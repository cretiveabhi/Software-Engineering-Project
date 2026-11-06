// Krishi Sarathi - Procurement Tracking Controller (9-Stage Live Visual Timeline)
import { v4 as uuidv4 } from 'uuid';
import db, { isPostgres, getLocalStore, persistLocalStore } from '../config/database.js';

// The 9 Canonical SIH Stages
export const PROCUREMENT_STAGES = [
  { step: 1, name: 'Registration Completed', shortDesc: 'Farmer identity and land records verified with Kisan ID.' },
  { step: 2, name: 'Slot Booked', shortDesc: 'Procurement slot confirmed with atomic quota reservation.' },
  { step: 3, name: 'QR Token Generated', shortDesc: 'Digital token & encrypted Mandi Gate pass issued.' },
  { step: 4, name: 'Farmer Arrived', shortDesc: 'Vehicle scanned at Mandi Security Gate.' },
  { step: 5, name: 'Weighing Completed', shortDesc: 'Electronic weighbridge gross & tare weights verified.' },
  { step: 6, name: 'Quality Assessment', shortDesc: 'Moisture analyzer and FAQ grain purity inspection.' },
  { step: 7, name: 'Crop Accepted', shortDesc: 'Grain unloaded and accepted into procurement silo/shed.' },
  { step: 8, name: 'Payment Initiated', shortDesc: 'Direct Bank Transfer (DBT) batch sent to PFMS bridge.' },
  { step: 9, name: 'Payment Completed', shortDesc: 'Funds credited to farmer Aadhaar-linked bank account.' }
];

export async function getTrackingTimeline(req, res) {
  try {
    const { identifier } = req.params; // bookingId, booking_reference, or token_number

    let booking = null;
    let events = [];
    let crop = null;
    let farmer = null;
    let payment = null;

    if (isPostgres()) {
      const bRes = await db.query(`
        SELECT b.*, c.name as crop_name, c.hindi_name as crop_hindi_name, c.msp as crop_msp, c.unit as crop_unit,
               p.full_name as farmer_name, p.mobile_number, f.kisan_id, f.village, f.district, f.bank_account_masked, f.ifsc_code
        FROM bookings b
        JOIN crops c ON b.crop_id = c.id
        JOIN profiles p ON b.farmer_id = p.id
        JOIN farmers f ON b.farmer_id = f.id
        WHERE b.id::text = $1 OR b.booking_reference = $1 OR b.token_number = $1
      `, [identifier]);

      if (bRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No procurement record found for this identifier.' });
      }
      booking = bRes.rows[0];

      const eRes = await db.query(`
        SELECT pe.*, pc.name as centre_name, pc.district as centre_district
        FROM procurement_events pe
        LEFT JOIN procurement_centres pc ON pe.centre_id = pc.id
        WHERE pe.booking_id = $1
        ORDER BY pe.event_step ASC, pe.created_at ASC
      `, [booking.id]);
      events = eRes.rows;

      const pRes = await db.query('SELECT * FROM payments WHERE booking_id = $1', [booking.id]);
      payment = pRes.rows[0] || null;
    } else {
      const store = getLocalStore();
      booking = store.bookings.find(
        b => b.id === identifier || b.booking_reference === identifier || b.token_number === identifier
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: 'No procurement record found for this identifier.' });
      }

      crop = store.crops.find(c => c.id === booking.crop_id);
      farmer = store.farmers.find(f => f.id === booking.farmer_id);
      const profile = store.profiles.find(p => p.id === booking.farmer_id);

      booking = {
        ...booking,
        crop_name: crop?.name,
        crop_hindi_name: crop?.hindi_name,
        crop_msp: crop?.msp,
        crop_unit: crop?.unit,
        farmer_name: profile?.full_name,
        mobile_number: profile?.mobile_number,
        kisan_id: farmer?.kisan_id,
        village: farmer?.village,
        district: farmer?.district,
        bank_account_masked: farmer?.bank_account_masked,
        ifsc_code: farmer?.ifsc_code
      };

      events = store.procurement_events
        .filter(e => e.booking_id === booking.id)
        .map(e => {
          const centre = store.procurement_centres.find(c => c.id === e.centre_id);
          return {
            ...e,
            centre_name: centre?.name || 'Mandi Centre',
            centre_district: centre?.district || ''
          };
        })
        .sort((a, b) => a.event_step - b.event_step);

      payment = store.payments.find(p => p.booking_id === booking.id) || null;
    }

    // Build the complete 9-step timeline representation
    const timeline = PROCUREMENT_STAGES.map(stage => {
      const recordedEvent = events.find(e => e.event_step === stage.step);
      let status = 'PENDING';

      if (recordedEvent) {
        status = recordedEvent.status || 'COMPLETED';
      } else if (stage.step < booking.current_step) {
        status = 'COMPLETED';
      } else if (stage.step === booking.current_step) {
        status = 'IN_PROGRESS';
      }

      return {
        step: stage.step,
        name: stage.name,
        shortDesc: stage.shortDesc,
        status,
        timestamp: recordedEvent?.created_at || null,
        operatorNotes: recordedEvent?.operator_notes || null,
        operatorName: recordedEvent?.operator_name || null,
        grossWeight: recordedEvent?.gross_weight || null,
        tareWeight: recordedEvent?.tare_weight || null,
        netWeight: recordedEvent?.net_weight || null,
        moisturePercentage: recordedEvent?.moisture_percentage || null,
        qualityGrade: recordedEvent?.quality_grade || null
      };
    });

    return res.json({
      success: true,
      booking,
      currentStep: booking.current_step,
      status: booking.status,
      timeline,
      payment
    });
  } catch (err) {
    console.error('Error in getTrackingTimeline:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Centre Operator / Officer Interface: Advance procurement event stage
 */
export async function updateOperatorStage(req, res) {
  try {
    const {
      bookingId,
      targetStep, // 4 to 9
      centreId,
      grossWeight,
      tareWeight,
      moisturePercentage,
      qualityGrade,
      operatorNotes
    } = req.body;

    const stepNum = parseInt(targetStep);
    if (isNaN(stepNum) || stepNum < 4 || stepNum > 9) {
      return res.status(400).json({
        success: false,
        message: 'Valid target step between 4 and 9 is required.'
      });
    }

    const stageConfig = PROCUREMENT_STAGES.find(s => s.step === stepNum);
    const operatorName = req.user?.full_name || 'Mandi Field Officer';

    let netWeight = null;
    if (grossWeight && tareWeight) {
      netWeight = Math.max(0, parseFloat(grossWeight) - parseFloat(tareWeight));
    }

    if (isPostgres()) {
      const bRes = await db.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
      if (bRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Booking not found.' });
      const booking = bRes.rows[0];

      await db.withTransaction(async (tx) => {
        // Update booking status
        await tx.query(`
          UPDATE bookings
          SET status = $1, current_step = $2, updated_at = CURRENT_TIMESTAMP
          WHERE id = $3
        `, [stageConfig.name, stepNum, bookingId]);

        // Insert or update event
        await tx.query(`
          INSERT INTO procurement_events (id, booking_id, centre_id, event_step, event_name, status, gross_weight, tare_weight, net_weight, moisture_percentage, quality_grade, operator_notes, operator_name)
          VALUES ($1, $2, $3, $4, $5, 'COMPLETED', $6, $7, $8, $9, $10, $11, $12)
        `, [
          uuidv4(),
          bookingId,
          centreId || null,
          stepNum,
          stageConfig.name,
          grossWeight ? parseFloat(grossWeight) : null,
          tareWeight ? parseFloat(tareWeight) : null,
          netWeight,
          moisturePercentage ? parseFloat(moisturePercentage) : null,
          qualityGrade || null,
          operatorNotes || `${stageConfig.name} updated by ${operatorName}.`,
          operatorName
        ]);

        // If step 7 (Crop Accepted) or 8 (Payment Initiated) or 9 (Payment Completed), manage simulated payment
        if (stepNum >= 7) {
          const cRes = await tx.query('SELECT msp FROM crops WHERE id = $1', [booking.crop_id]);
          const mspRate = cRes.rows[0]?.msp || 2275.00;
          const acceptedQty = netWeight || Number(booking.total_quantity);
          const grossAmount = acceptedQty * mspRate;
          const netAmount = grossAmount; // no deductions

          const pStatus = stepNum === 9 ? 'Completed' : 'Initiated';
          const pCheck = await tx.query('SELECT id FROM payments WHERE booking_id = $1', [bookingId]);

          if (pCheck.rows.length === 0) {
            const fRes = await tx.query('SELECT bank_account_masked, ifsc_code FROM farmers WHERE id = $1', [booking.farmer_id]);
            const farmer = fRes.rows[0];
            await tx.query(`
              INSERT INTO payments (id, booking_id, farmer_id, accepted_quantity, msp_rate, gross_amount, mandi_cess, net_amount, payment_status, transaction_ref, dbt_batch_id, bank_account_masked, ifsc_code, is_simulated)
              VALUES ($1, $2, $3, $4, $5, $6, 0.00, $7, $8, $9, $10, $11, $12, true)
            `, [
              uuidv4(),
              bookingId,
              booking.farmer_id,
              acceptedQty,
              mspRate,
              grossAmount,
              netAmount,
              pStatus,
              `DBT-2026-MP-${Math.floor(100000 + Math.random() * 900000)}`,
              `PFMS-BATCH-MP-2611-${Math.floor(100 + Math.random() * 900)}`,
              farmer?.bank_account_masked || 'XXXX-XXXX-4821',
              farmer?.ifsc_code || 'SBIN0001234'
            ]);
          } else {
            await tx.query(`
              UPDATE payments
              SET payment_status = $1, payment_date = CURRENT_TIMESTAMP
              WHERE booking_id = $2
            `, [pStatus, bookingId]);
          }
        }
      });

      return res.json({
        success: true,
        message: `Successfully advanced procurement status to Step ${stepNum}: ${stageConfig.name}!`
      });
    } else {
      const store = getLocalStore();
      const booking = store.bookings.find(b => b.id === bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

      booking.status = stageConfig.name;
      booking.current_step = stepNum;

      const eventRecord = {
        id: uuidv4(),
        booking_id: bookingId,
        centre_id: centreId || store.procurement_centres[0].id,
        event_step: stepNum,
        event_name: stageConfig.name,
        status: 'COMPLETED',
        gross_weight: grossWeight ? parseFloat(grossWeight) : null,
        tare_weight: tareWeight ? parseFloat(tareWeight) : null,
        net_weight: netWeight,
        moisture_percentage: moisturePercentage ? parseFloat(moisturePercentage) : null,
        quality_grade: qualityGrade || null,
        operator_notes: operatorNotes || `${stageConfig.name} completed at mandi terminal.`,
        operator_name: operatorName,
        created_at: new Date().toISOString()
      };
      store.procurement_events.push(eventRecord);

      // Handle simulated payment
      if (stepNum >= 7) {
        let payment = store.payments.find(p => p.booking_id === bookingId);
        const crop = store.crops.find(c => c.id === booking.crop_id);
        const msp = crop?.msp || 2275.00;
        const acceptedQty = netWeight || Number(booking.total_quantity);
        const grossAmount = acceptedQty * msp;

        if (!payment) {
          const farmer = store.farmers.find(f => f.id === booking.farmer_id);
          payment = {
            id: uuidv4(),
            booking_id: bookingId,
            farmer_id: booking.farmer_id,
            accepted_quantity: acceptedQty,
            msp_rate: msp,
            gross_amount: grossAmount,
            mandi_cess: 0.00,
            net_amount: grossAmount,
            payment_status: stepNum === 9 ? 'Completed' : 'Initiated',
            transaction_ref: `DBT-2026-MP-${Math.floor(100000 + Math.random() * 900000)}`,
            dbt_batch_id: `PFMS-BATCH-MP-2611-${Math.floor(100 + Math.random() * 900)}`,
            bank_account_masked: farmer?.bank_account_masked || 'XXXX-XXXX-4821',
            ifsc_code: farmer?.ifsc_code || 'SBIN0001234',
            is_simulated: true,
            payment_date: new Date().toISOString()
          };
          store.payments.push(payment);
        } else {
          payment.payment_status = stepNum === 9 ? 'Completed' : 'Initiated';
          payment.payment_date = new Date().toISOString();
        }
      }

      persistLocalStore();

      return res.json({
        success: true,
        message: `Successfully advanced procurement status to Step ${stepNum}: ${stageConfig.name}!`
      });
    }
  } catch (err) {
    console.error('Operator update error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export default {
  getTrackingTimeline,
  updateOperatorStage
};
