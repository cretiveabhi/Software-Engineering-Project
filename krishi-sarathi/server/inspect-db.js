// Krishi Sarathi - Live Database Inspector CLI for Hackathon Judges
// Usage: node inspect-db.js [farmers | bookings | quota | payments | all]
import { initDb, getLocalStore, isPostgres, query } from './src/config/database.js';

const target = (process.argv[2] || 'all').toLowerCase();

async function inspect() {
  await initDb();
  console.log('===============================================================');
  console.log('🌾 KRISHI SARATHI — LIVE DATABASE & TRANSACTION INSPECTOR');
  console.log(`   Engine: ${isPostgres() ? 'Supabase PostgreSQL' : 'Local Relational Store'}`);
  console.log(`   Timestamp: ${new Date().toLocaleString()}`);
  console.log('===============================================================\n');

  if (target === 'farmers' || target === 'all') {
    console.log('📋 [TABLE: profiles & farmers] — Registered Farmers:');
    if (isPostgres()) {
      const res = await query(`
        SELECT p.full_name, f.kisan_id, p.email, p.mobile_number, f.village, f.district, f.land_area
        FROM profiles p
        JOIN farmers f ON p.id = f.id
        ORDER BY p.created_at DESC LIMIT 10
      `);
      console.table(res.rows);
    } else {
      const store = getLocalStore();
      const farmers = store.profiles
        .filter(p => p.role === 'farmer')
        .map(p => {
          const f = store.farmers.find(farmer => farmer.id === p.id);
          return {
            'Full Name': p.full_name,
            'Kisan ID': f?.kisan_id || 'N/A',
            'Email': p.email,
            'Mobile': p.mobile_number,
            'Village': f?.village || 'N/A',
            'District': f?.district || 'N/A',
            'Land (Ac)': f?.land_area || 0
          };
        });
      console.table(farmers.slice(-10)); // Show latest 10
    }
    console.log('');
  }

  if (target === 'bookings' || target === 'all') {
    console.log('📦 [TABLE: bookings] — Recent Slot Bookings & Tokens:');
    if (isPostgres()) {
      const res = await query(`
        SELECT b.booking_reference, b.token_number, p.full_name as farmer, c.name as crop, b.total_quantity, b.status, b.current_step
        FROM bookings b
        JOIN profiles p ON b.farmer_id = p.id
        JOIN crops c ON b.crop_id = c.id
        ORDER BY b.created_at DESC LIMIT 10
      `);
      console.table(res.rows);
    } else {
      const store = getLocalStore();
      const bookings = store.bookings.slice(0, 10).map(b => {
        const p = store.profiles.find(prof => prof.id === b.farmer_id);
        const c = store.crops.find(crop => crop.id === b.crop_id);
        return {
          'Booking Ref': b.booking_reference,
          'Gate Token': b.token_number,
          'Farmer': p?.full_name || 'Farmer',
          'Crop': c?.name || 'Crop',
          'Total Qtl': b.total_quantity,
          'Status': b.status,
          'Step': `${b.current_step}/9`
        };
      });
      console.table(bookings);
    }
    console.log('');
  }

  if (target === 'quota' || target === 'all') {
    console.log('⚖️ [TABLE: quota_ledger] — Atomic Concurrency Ledger (Audit Trail):');
    if (isPostgres()) {
      const res = await query(`
        SELECT ql.id, pc.name as centre, ql.quantity_change, ql.previous_quota, ql.new_quota, ql.change_type, ql.notes
        FROM quota_ledger ql
        JOIN procurement_centres pc ON ql.centre_id = pc.id
        ORDER BY ql.recorded_at DESC LIMIT 10
      `);
      console.table(res.rows);
    } else {
      const store = getLocalStore();
      const ledger = store.quota_ledger.slice(-10).map(ql => {
        const pc = store.procurement_centres.find(c => c.id === ql.centre_id);
        return {
          'Mandi Centre': pc?.name?.substring(0, 24) || 'Mandi',
          'Qty Change': `${ql.quantity_change} Qtl`,
          'Prev Quota': `${ql.previous_quota} Qtl`,
          'New Quota': `${ql.new_quota} Qtl`,
          'Audit Note': ql.notes?.substring(0, 45)
        };
      });
      console.table(ledger);
    }
    console.log('');
  }

  if (target === 'payments' || target === 'all') {
    console.log('💳 [TABLE: payments] — Direct Bank Transfer (DBT) Payouts:');
    if (isPostgres()) {
      const res = await query(`
        SELECT p.transaction_ref, p.dbt_batch_id, pr.full_name as farmer, p.accepted_quantity, p.net_amount, p.payment_status
        FROM payments p
        JOIN profiles pr ON p.farmer_id = pr.id
        ORDER BY p.payment_date DESC LIMIT 5
      `);
      console.table(res.rows);
    } else {
      const store = getLocalStore();
      const pays = store.payments.slice(0, 5).map(p => {
        const pr = store.profiles.find(prof => prof.id === p.farmer_id);
        return {
          'DBT Ref': p.transaction_ref,
          'PFMS Batch': p.dbt_batch_id,
          'Farmer': pr?.full_name || 'Farmer',
          'Accepted Qtl': p.accepted_quantity,
          'Net Payout': `₹${Number(p.net_amount).toLocaleString('en-IN')}`,
          'Status': p.payment_status
        };
      });
      console.table(pays);
    }
  }

  process.exit(0);
}

inspect().catch(err => {
  console.error('Inspection error:', err);
  process.exit(1);
});
