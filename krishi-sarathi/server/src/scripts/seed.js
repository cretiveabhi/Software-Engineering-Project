// Seed runner for Krishi Sarathi (Postgres + local store)
import dotenv from 'dotenv';
dotenv.config();

import db, { isPostgres, getLocalStore, persistLocalStore } from '../config/database.js';
import {
  cropsData,
  centresData,
  profilesData,
  farmersData,
  farmerCropsData,
  bookingsData,
  bookingAllocationsData,
  quotaLedgerData,
  procurementEventsData,
  paymentsData,
  weatherRecordsData
} from './seedData.js';

export async function runSeed() {
  await db.initDb();

  console.log('🌱 Starting Krishi Sarathi database seeding...');

  if (isPostgres()) {
    console.log('📦 Seeding into Supabase PostgreSQL...');
    try {
      // 1. Seed crops
      for (const crop of cropsData) {
        await db.query(`
          INSERT INTO crops (id, crop_code, name, hindi_name, season, msp, unit, procurement_window, description, icon_name, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            msp = EXCLUDED.msp,
            procurement_window = EXCLUDED.procurement_window;
        `, [crop.id, crop.crop_code, crop.name, crop.hindi_name, crop.season, crop.msp, crop.unit, crop.procurement_window, crop.description, crop.icon_name, crop.is_active]);
      }

      // 2. Seed centres
      for (const centre of centresData) {
        await db.query(`
          INSERT INTO procurement_centres (id, centre_code, name, hindi_name, district, address, latitude, longitude, daily_capacity, available_quota, current_queue, operational_status, contact_phone, operator_name, is_demo)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO UPDATE SET
            daily_capacity = EXCLUDED.daily_capacity,
            available_quota = EXCLUDED.available_quota,
            current_queue = EXCLUDED.current_queue,
            operational_status = EXCLUDED.operational_status;
        `, [centre.id, centre.centre_code, centre.name, centre.hindi_name, centre.district, centre.address, centre.latitude, centre.longitude, centre.daily_capacity, centre.available_quota, centre.current_queue, centre.operational_status, centre.contact_phone, centre.operator_name, centre.is_demo]);
      }

      // 3. Seed profiles
      for (const profile of profilesData) {
        await db.query(`
          INSERT INTO profiles (id, email, password_hash, role, full_name, mobile_number, avatar_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role;
        `, [profile.id, profile.email, profile.password_hash, profile.role, profile.full_name, profile.mobile_number, profile.avatar_url || null]);
      }

      // 4. Seed farmers
      for (const farmer of farmersData) {
        await db.query(`
          INSERT INTO farmers (id, kisan_id, village, district, state, farmer_address, land_area, land_unit, preferred_language, bank_account_masked, ifsc_code)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            kisan_id = EXCLUDED.kisan_id,
            land_area = EXCLUDED.land_area;
        `, [farmer.id, farmer.kisan_id, farmer.village, farmer.district, farmer.state, farmer.farmer_address, farmer.land_area, farmer.land_unit, farmer.preferred_language, farmer.bank_account_masked, farmer.ifsc_code]);
      }

      // 5. Seed farmer_crops
      for (const fc of farmerCropsData) {
        await db.query(`
          INSERT INTO farmer_crops (id, farmer_id, crop_id, acreage, estimated_yield, sowing_date)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [fc.id, fc.farmer_id, fc.crop_id, fc.acreage, fc.estimated_yield, fc.sowing_date]);
      }

      // 6. Seed bookings
      for (const bk of bookingsData) {
        await db.query(`
          INSERT INTO bookings (id, booking_reference, farmer_id, crop_id, total_quantity, is_split, booking_date, status, token_number, qr_code_data, current_step)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            current_step = EXCLUDED.current_step;
        `, [bk.id, bk.booking_reference, bk.farmer_id, bk.crop_id, bk.total_quantity, bk.is_split, bk.booking_date, bk.status, bk.token_number, bk.qr_code_data, bk.current_step]);
      }

      // 7. Seed allocations
      for (const alloc of bookingAllocationsData) {
        await db.query(`
          INSERT INTO booking_allocations (id, booking_id, centre_id, allocated_quantity, status, slot_time_window)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [alloc.id, alloc.booking_id, alloc.centre_id, alloc.allocated_quantity, alloc.status, alloc.slot_time_window]);
      }

      // 8. Seed quota ledger
      for (const ql of quotaLedgerData) {
        await db.query(`
          INSERT INTO quota_ledger (id, centre_id, booking_id, crop_id, quantity_change, previous_quota, new_quota, change_type, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING;
        `, [ql.id, ql.centre_id, ql.booking_id, ql.crop_id, ql.quantity_change, ql.previous_quota, ql.new_quota, ql.change_type, ql.notes]);
      }

      // 9. Seed procurement events
      for (const evt of procurementEventsData) {
        await db.query(`
          INSERT INTO procurement_events (id, booking_id, centre_id, event_step, event_name, status, gross_weight, tare_weight, net_weight, moisture_percentage, quality_grade, operator_notes, operator_name)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING;
        `, [evt.id, evt.booking_id, evt.centre_id, evt.event_step, evt.event_name, evt.status, evt.gross_weight, evt.tare_weight, evt.net_weight, evt.moisture_percentage, evt.quality_grade, evt.operator_notes, evt.operator_name]);
      }

      // 10. Seed payments
      for (const pay of paymentsData) {
        await db.query(`
          INSERT INTO payments (id, booking_id, farmer_id, accepted_quantity, msp_rate, gross_amount, mandi_cess, net_amount, payment_status, transaction_ref, dbt_batch_id, bank_account_masked, ifsc_code, is_simulated)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING;
        `, [pay.id, pay.booking_id, pay.farmer_id, pay.accepted_quantity, pay.msp_rate, pay.gross_amount, pay.mandi_cess, pay.net_amount, pay.payment_status, pay.transaction_ref, pay.dbt_batch_id, pay.bank_account_masked, pay.ifsc_code, pay.is_simulated]);
      }

      // 11. Seed weather
      for (const w of weatherRecordsData) {
        await db.query(`
          INSERT INTO weather_records (id, centre_id, temperature, rain_probability, weather_code, condition_text, wind_speed, humidity, alert_level, alert_message, is_simulated)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [w.id, w.centre_id, w.temperature, w.rain_probability, w.weather_code, w.condition_text, w.wind_speed, w.humidity, w.alert_level, w.alert_message, w.is_simulated]);
      }

      console.log('✅ Supabase PostgreSQL seeded successfully!');
    } catch (err) {
      console.error('❌ Error during PostgreSQL seed:', err.message);
    }
  }

  // Always seed / sync the local store so it is ready for instant execution
  console.log('📦 Initializing local relational database store...');
  const store = getLocalStore();

  // Helper for idempotent upsert into array by 'id'
  const upsertAll = (key, list) => {
    store[key] = store[key] || [];
    for (const item of list) {
      const idx = store[key].findIndex(x => x.id === item.id);
      if (idx >= 0) {
        store[key][idx] = { ...store[key][idx], ...item };
      } else {
        store[key].push(item);
      }
    }
  };

  upsertAll('crops', cropsData);
  upsertAll('procurement_centres', centresData);
  upsertAll('profiles', profilesData);
  upsertAll('farmers', farmersData);
  upsertAll('farmer_crops', farmerCropsData);
  upsertAll('bookings', bookingsData);
  upsertAll('booking_allocations', bookingAllocationsData);
  upsertAll('quota_ledger', quotaLedgerData);
  upsertAll('procurement_events', procurementEventsData);
  upsertAll('payments', paymentsData);
  upsertAll('weather_records', weatherRecordsData);

  persistLocalStore();

  console.log(`✅ Local database seeded successfully:
   - 7 Crops
   - 10 Madhya Pradesh Demo Centres
   - 20 Farmers + 1 Operator + 1 Admin (Total: ${store.profiles.length} Profiles)
   - ${store.bookings.length} Sample Bookings (Split & Single)
   - ${store.booking_allocations.length} Split Allocations
   - ${store.procurement_events.length} Procurement Tracking Events (Steps 1-9)
   - ${store.payments.length} Payments (Simulated DBT)
   - 10 Weather Records (Open-Meteo Cache)`);
}

// If run directly via node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  runSeed().then(() => {
    console.log('🌱 Seeding process complete.');
    process.exit(0);
  }).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
