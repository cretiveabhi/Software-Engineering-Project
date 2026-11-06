// Krishi Sarathi - Payment Tracking Controller
// Direct Bank Transfer (DBT) Simulation, MSP Calculations, Receipt Generation
import db, { isPostgres, getLocalStore } from '../config/database.js';

export async function getFarmerPayments(req, res) {
  try {
    const farmerId = req.user.id;

    if (isPostgres()) {
      const sql = `
        SELECT
          p.*,
          b.booking_reference,
          b.token_number,
          b.booking_date,
          c.name as crop_name,
          c.hindi_name as crop_hindi_name,
          c.unit as crop_unit
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN crops c ON b.crop_id = c.id
        WHERE p.farmer_id = $1
        ORDER BY p.payment_date DESC
      `;
      const result = await db.query(sql, [farmerId]);
      return res.json({ success: true, payments: result.rows });
    } else {
      const store = getLocalStore();
      const payments = store.payments
        .filter(p => p.farmer_id === farmerId)
        .map(p => {
          const booking = store.bookings.find(b => b.id === p.booking_id);
          const crop = store.crops.find(c => c.id === booking?.crop_id);
          return {
            ...p,
            booking_reference: booking?.booking_reference || 'N/A',
            token_number: booking?.token_number || 'N/A',
            booking_date: booking?.booking_date || '',
            crop_name: crop?.name || 'Crop',
            crop_hindi_name: crop?.hindi_name || '',
            crop_unit: crop?.unit || 'Quintal'
          };
        })
        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

      return res.json({ success: true, payments });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments: ' + err.message });
  }
}

export async function getPaymentReceipt(req, res) {
  try {
    const { id } = req.params;
    let payment = null;

    if (isPostgres()) {
      const sql = `
        SELECT
          p.*,
          b.booking_reference,
          b.token_number,
          b.booking_date,
          c.name as crop_name,
          c.hindi_name as crop_hindi_name,
          pr.full_name as farmer_name,
          f.kisan_id,
          f.village,
          f.district
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        JOIN crops c ON b.crop_id = c.id
        JOIN profiles pr ON p.farmer_id = pr.id
        JOIN farmers f ON p.farmer_id = f.id
        WHERE p.id = $1 OR p.transaction_ref = $1
      `;
      const result = await db.query(sql, [id]);
      payment = result.rows[0];
    } else {
      const store = getLocalStore();
      const raw = store.payments.find(p => p.id === id || p.transaction_ref === id);
      if (raw) {
        const booking = store.bookings.find(b => b.id === raw.booking_id);
        const crop = store.crops.find(c => c.id === booking?.crop_id);
        const profile = store.profiles.find(pr => pr.id === raw.farmer_id);
        const farmer = store.farmers.find(f => f.id === raw.farmer_id);
        payment = {
          ...raw,
          booking_reference: booking?.booking_reference,
          token_number: booking?.token_number,
          booking_date: booking?.booking_date,
          crop_name: crop?.name,
          crop_hindi_name: crop?.hindi_name,
          farmer_name: profile?.full_name,
          kisan_id: farmer?.kisan_id,
          village: farmer?.village,
          district: farmer?.district
        };
      }
    }

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    return res.json({ success: true, receipt: payment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default {
  getFarmerPayments,
  getPaymentReceipt
};
