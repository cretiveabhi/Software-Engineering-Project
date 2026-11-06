// Krishi Sarathi - Slot Booking & Split Selling Controller
// Concurrency-safe atomic quota ledger, multi-centre split allocation, QR Token generation
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import db, { isPostgres, getLocalStore, persistLocalStore } from '../config/database.js';

function generateTokenNumber() {
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const prefix = letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}-${num.toString().padStart(3, '0')}`;
}

function generateBookingReference(district = 'MP') {
  const code = (district || 'MP').substring(0, 3).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK-2026-${code}-${rand}`;
}

export async function createBooking(req, res) {
  try {
    const farmerId = req.user.id;
    const {
      cropId,
      totalQuantity,
      bookingDate,
      allocations // Array of { centreId, quantity, slotTimeWindow }
    } = req.body;

    // 1. Validation
    const parsedTotal = parseFloat(totalQuantity);
    if (!cropId || isNaN(parsedTotal) || parsedTotal <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid crop and positive total quantity.' });
    }
    if (!bookingDate) {
      return res.status(400).json({ success: false, message: 'Please select a booking date.' });
    }
    if (!Array.isArray(allocations) || allocations.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one procurement centre allocation is required.' });
    }

    // Check individual allocations
    let allocatedSum = 0;
    for (const alloc of allocations) {
      const q = parseFloat(alloc.quantity);
      if (isNaN(q) || q <= 0) {
        return res.status(400).json({
          success: false,
          message: `Allocation quantity must be greater than zero for all centres.`
        });
      }
      if (!alloc.centreId) {
        return res.status(400).json({ success: false, message: 'Each allocation must specify a valid centreId.' });
      }
      allocatedSum += q;
    }

    // Exact equality check
    if (Math.abs(allocatedSum - parsedTotal) > 0.001) {
      return res.status(400).json({
        success: false,
        message: `Total allocated quantity (${allocatedSum} qtl) does not equal requested quantity (${parsedTotal} qtl). Please balance your split allocation exactly.`
      });
    }

    const isSplit = allocations.length > 1;
    const tokenNumber = generateTokenNumber();
    const bookingRef = generateBookingReference(req.user.district);
    const bookingId = uuidv4();

    // 2. Fetch crop details
    let crop = null;
    if (isPostgres()) {
      const cRes = await db.query('SELECT * FROM crops WHERE id = $1', [cropId]);
      crop = cRes.rows[0];
    } else {
      const store = getLocalStore();
      crop = store.crops.find(c => c.id === cropId);
    }
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Selected crop not found.' });
    }

    // 3. Prepare QR Code Data Payload
    const qrPayload = {
      bookingId,
      reference: bookingRef,
      token: tokenNumber,
      kisanId: req.user.kisan_id || 'KS-MP-2026-FARMER',
      farmerName: req.user.full_name,
      cropName: crop.name,
      totalQuantity: parsedTotal,
      isSplit,
      allocationsCount: allocations.length,
      issuedAt: new Date().toISOString()
    };

    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
      errorCorrectionLevel: 'M',
      margin: 2,
      color: {
        dark: '#064e3b',
        light: '#ffffff'
      }
    });

    // 4. Atomic Transaction for Quota Ledger & Reservation
    let createdBooking = null;

    if (isPostgres()) {
      await db.withTransaction(async (tx) => {
        // Lock centres with SELECT FOR UPDATE to prevent race conditions
        const centreIds = allocations.map(a => a.centreId);
        const lockRes = await tx.query(
          `SELECT id, name, available_quota, current_queue, operational_status
           FROM procurement_centres
           WHERE id = ANY($1::uuid[])
           FOR UPDATE`,
          [centreIds]
        );

        const centreMap = new Map();
        lockRes.rows.forEach(c => centreMap.set(c.id, c));

        // Validate quota availability under lock
        for (const alloc of allocations) {
          const centre = centreMap.get(alloc.centreId);
          if (!centre) {
            throw new Error(`Procurement centre not found: ${alloc.centreId}`);
          }
          if (centre.operational_status === 'Closed') {
            throw new Error(`Procurement centre "${centre.name}" is currently closed.`);
          }
          const allocQty = parseFloat(alloc.quantity);
          if (Number(centre.available_quota) < allocQty) {
            throw new Error(
              `Insufficient quota at "${centre.name}". Available: ${centre.available_quota} qtl, requested: ${allocQty} qtl.`
            );
          }
        }

        // Create booking
        await tx.query(`
          INSERT INTO bookings (id, booking_reference, farmer_id, crop_id, total_quantity, is_split, booking_date, status, token_number, qr_code_data, current_step)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'Slot Booked', $8, $9, 3)
        `, [bookingId, bookingRef, farmerId, cropId, parsedTotal, isSplit, bookingDate, tokenNumber, qrCodeDataUrl]);

        // Process each allocation
        for (const alloc of allocations) {
          const allocQty = parseFloat(alloc.quantity);
          const centre = centreMap.get(alloc.centreId);
          const previousQuota = Number(centre.available_quota);
          const newQuota = previousQuota - allocQty;

          // Deduct quota atomically & increment queue
          await tx.query(`
            UPDATE procurement_centres
            SET available_quota = available_quota - $1,
                current_queue = current_queue + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
          `, [allocQty, alloc.centreId]);

          // Insert allocation
          const allocId = uuidv4();
          await tx.query(`
            INSERT INTO booking_allocations (id, booking_id, centre_id, allocated_quantity, status, slot_time_window)
            VALUES ($1, $2, $3, $4, 'Reserved', $5)
          `, [allocId, bookingId, alloc.centreId, allocQty, alloc.slotTimeWindow || '09:00 AM - 12:00 PM']);

          // Record in Quota Ledger
          const ledgerId = uuidv4();
          await tx.query(`
            INSERT INTO quota_ledger (id, centre_id, booking_id, crop_id, quantity_change, previous_quota, new_quota, change_type, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'RESERVATION', $8)
          `, [ledgerId, alloc.centreId, bookingId, cropId, -allocQty, previousQuota, newQuota, `Allocated ${allocQty} qtl to ${req.user.full_name} (${tokenNumber})`]);
        }

        // Insert initial tracking events (Steps 1, 2, 3)
        const primaryCentreId = allocations[0].centreId;
        await tx.query(`
          INSERT INTO procurement_events (id, booking_id, centre_id, event_step, event_name, status, operator_notes, operator_name)
          VALUES
            ($1, $2, $3, 1, 'Registration Completed', 'COMPLETED', $4, 'System KYC Engine'),
            ($5, $2, $3, 2, 'Slot Booked', 'COMPLETED', $6, 'Atomic Quota Ledger'),
            ($7, $2, $3, 3, 'QR Token Generated', 'COMPLETED', $8, 'Security Token Authority')
        `, [
          uuidv4(), bookingId, primaryCentreId, `Farmer identity ${req.user.kisan_id || 'Registered'} verified.`,
          uuidv4(), `${parsedTotal} Qtl allocated across ${allocations.length} centre(s). Quota locked.`,
          uuidv4(), `Digital Token ${tokenNumber} issued with encrypted Mandi Gate pass.`
        ]);
      });

      createdBooking = {
        id: bookingId,
        booking_reference: bookingRef,
        farmer_id: farmerId,
        crop_id: cropId,
        crop_name: crop.name,
        total_quantity: parsedTotal,
        is_split: isSplit,
        booking_date: bookingDate,
        status: 'Slot Booked',
        token_number: tokenNumber,
        qr_code_data: qrCodeDataUrl,
        current_step: 3,
        allocations
      };
    } else {
      // Local Relational Engine with atomic mutex transaction
      await db.withTransaction(async () => {
        const store = getLocalStore();

        // Validate quotas
        for (const alloc of allocations) {
          const centre = store.procurement_centres.find(c => c.id === alloc.centreId);
          if (!centre) throw new Error(`Procurement centre not found: ${alloc.centreId}`);
          if (centre.operational_status === 'Closed') throw new Error(`Procurement centre "${centre.name}" is closed.`);
          const allocQty = parseFloat(alloc.quantity);
          if (Number(centre.available_quota) < allocQty) {
            throw new Error(`Insufficient quota at "${centre.name}". Available: ${centre.available_quota} qtl, requested: ${allocQty} qtl.`);
          }
        }

        // Deduct quotas and record
        for (const alloc of allocations) {
          const allocQty = parseFloat(alloc.quantity);
          const centre = store.procurement_centres.find(c => c.id === alloc.centreId);
          const previousQuota = Number(centre.available_quota);
          centre.available_quota = previousQuota - allocQty;
          centre.current_queue = (Number(centre.current_queue) || 0) + 1;

          const allocId = uuidv4();
          store.booking_allocations.push({
            id: allocId,
            booking_id: bookingId,
            centre_id: alloc.centreId,
            allocated_quantity: allocQty,
            status: 'Reserved',
            slot_time_window: alloc.slotTimeWindow || '09:00 AM - 12:00 PM',
            created_at: new Date().toISOString()
          });

          store.quota_ledger.push({
            id: uuidv4(),
            centre_id: alloc.centreId,
            booking_id: bookingId,
            crop_id: cropId,
            quantity_change: -allocQty,
            previous_quota: previousQuota,
            new_quota: centre.available_quota,
            change_type: 'RESERVATION',
            notes: `Allocated ${allocQty} qtl to ${req.user.full_name} (${tokenNumber})`,
            recorded_at: new Date().toISOString()
          });
        }

        // Add booking
        const newBooking = {
          id: bookingId,
          booking_reference: bookingRef,
          farmer_id: farmerId,
          crop_id: cropId,
          total_quantity: parsedTotal,
          is_split: isSplit,
          booking_date: bookingDate,
          status: 'Slot Booked',
          token_number: tokenNumber,
          qr_code_data: qrCodeDataUrl,
          current_step: 3,
          created_at: new Date().toISOString()
        };
        store.bookings.unshift(newBooking);

        // Add 3 completed initial tracking events
        const primaryCentreId = allocations[0].centreId;
        store.procurement_events.push(
          {
            id: uuidv4(),
            booking_id: bookingId,
            centre_id: primaryCentreId,
            event_step: 1,
            event_name: 'Registration Completed',
            status: 'COMPLETED',
            operator_notes: `Farmer identity verified: ${req.user.kisan_id || 'Registered'}.`,
            operator_name: 'System KYC Engine',
            created_at: new Date().toISOString()
          },
          {
            id: uuidv4(),
            booking_id: bookingId,
            centre_id: primaryCentreId,
            event_step: 2,
            event_name: 'Slot Booked',
            status: 'COMPLETED',
            operator_notes: `${parsedTotal} Qtl allocated across ${allocations.length} centre(s). Quota locked.`,
            operator_name: 'Atomic Quota Ledger',
            created_at: new Date().toISOString()
          },
          {
            id: uuidv4(),
            booking_id: bookingId,
            centre_id: primaryCentreId,
            event_step: 3,
            event_name: 'QR Token Generated',
            status: 'COMPLETED',
            operator_notes: `Digital Token ${tokenNumber} issued with encrypted gate QR code.`,
            operator_name: 'Token Dispatcher',
            created_at: new Date().toISOString()
          }
        );

        createdBooking = {
          ...newBooking,
          crop_name: crop.name,
          allocations
        };
      });
    }

    return res.status(201).json({
      success: true,
      message: isSplit
        ? `Split selling slot booked successfully across ${allocations.length} procurement centres!`
        : 'Procurement slot booked successfully!',
      booking: createdBooking
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
}

export async function getFarmerBookings(req, res) {
  try {
    const farmerId = req.user.id;

    if (isPostgres()) {
      const sql = `
        SELECT
          b.*,
          c.name as crop_name,
          c.hindi_name as crop_hindi_name,
          c.msp as crop_msp,
          c.unit as crop_unit
        FROM bookings b
        JOIN crops c ON b.crop_id = c.id
        WHERE b.farmer_id = $1
        ORDER BY b.created_at DESC
      `;
      const result = await db.query(sql, [farmerId]);
      const bookings = result.rows;

      // Attach allocations
      for (const bk of bookings) {
        const aRes = await db.query(`
          SELECT ba.*, pc.name as centre_name, pc.district, pc.address
          FROM booking_allocations ba
          JOIN procurement_centres pc ON ba.centre_id = pc.id
          WHERE ba.booking_id = $1
        `, [bk.id]);
        bk.allocations = aRes.rows;
      }

      return res.json({ success: true, bookings });
    } else {
      const store = getLocalStore();
      const bookings = store.bookings
        .filter(b => b.farmer_id === farmerId)
        .map(b => {
          const crop = store.crops.find(c => c.id === b.crop_id);
          const allocations = store.booking_allocations
            .filter(a => a.booking_id === b.id)
            .map(a => {
              const centre = store.procurement_centres.find(c => c.id === a.centre_id);
              return {
                ...a,
                centre_name: centre?.name || 'Mandi Centre',
                district: centre?.district || '',
                address: centre?.address || ''
              };
            });
          return {
            ...b,
            crop_name: crop?.name || 'Crop',
            crop_hindi_name: crop?.hindi_name || '',
            crop_msp: crop?.msp || 0,
            crop_unit: crop?.unit || 'Quintal',
            allocations
          };
        });

      return res.json({ success: true, bookings });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;
    let booking = null;

    if (isPostgres()) {
      const bRes = await db.query(`
        SELECT b.*, c.name as crop_name, c.hindi_name as crop_hindi_name, c.msp as crop_msp, c.unit as crop_unit
        FROM bookings b
        JOIN crops c ON b.crop_id = c.id
        WHERE b.id = $1 OR b.booking_reference = $1
      `, [id]);
      booking = bRes.rows[0];
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const aRes = await db.query(`
        SELECT ba.*, pc.name as centre_name, pc.district, pc.address, pc.latitude, pc.longitude
        FROM booking_allocations ba
        JOIN procurement_centres pc ON ba.centre_id = pc.id
        WHERE ba.booking_id = $1
      `, [booking.id]);
      booking.allocations = aRes.rows;
    } else {
      const store = getLocalStore();
      const raw = store.bookings.find(b => b.id === id || b.booking_reference === id || b.token_number === id);
      if (!raw) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const crop = store.crops.find(c => c.id === raw.crop_id);
      const allocations = store.booking_allocations
        .filter(a => a.booking_id === raw.id)
        .map(a => {
          const centre = store.procurement_centres.find(c => c.id === a.centre_id);
          return {
            ...a,
            centre_name: centre?.name || 'Mandi Centre',
            district: centre?.district || '',
            address: centre?.address || '',
            latitude: centre?.latitude,
            longitude: centre?.longitude
          };
        });

      booking = {
        ...raw,
        crop_name: crop?.name,
        crop_hindi_name: crop?.hindi_name,
        crop_msp: crop?.msp,
        crop_unit: crop?.unit,
        allocations
      };
    }

    return res.json({ success: true, booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default {
  createBooking,
  getFarmerBookings,
  getBookingById
};
