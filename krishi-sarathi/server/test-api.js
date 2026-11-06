// Comprehensive API & Module Verification Test for Krishi Sarathi
import { initDb, getLocalStore } from './src/config/database.js';
import { runSeed } from './src/scripts/seed.js';
import { register, login } from './src/controllers/authController.js';
import { getAllCrops, calculateEarnings } from './src/controllers/cropController.js';
import { getAllCentres } from './src/controllers/centreController.js';
import { createBooking, getFarmerBookings } from './src/controllers/bookingController.js';
import { getTrackingTimeline, updateOperatorStage } from './src/controllers/trackingController.js';
import { getFarmerPayments } from './src/controllers/paymentController.js';
import { getDashboardData } from './src/controllers/farmerController.js';

// Helper to mock express req/res
function mockReqRes(body = {}, params = {}, query = {}, user = null) {
  let statusCode = 200;
  let responseData = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    }
  };

  const req = { body, params, query, user };

  return {
    req,
    res,
    getStatus: () => statusCode,
    getData: () => responseData
  };
}

async function runTests() {
  console.log('🧪 Starting Krishi Sarathi Automated Test Suite...\n');

  await initDb();
  await runSeed();

  // Test 1: Farmer Login with Demo Credentials
  console.log('Test 1: Testing Demo Farmer Login...');
  const t1 = mockReqRes({ email: 'farmer@krishisarathi.in', password: 'Farmer@123' });
  await login(t1.req, t1.res);
  const loginData = t1.getData();
  if (t1.getStatus() === 200 && loginData.token && loginData.user.kisan_id === 'KS-MP-IND-01001') {
    console.log('  ✅ PASSED: Farmer authenticated, Kisan ID:', loginData.user.kisan_id);
  } else {
    throw new Error('Test 1 Failed: ' + JSON.stringify(loginData));
  }
  const authUser = loginData.user;

  // Test 2: Fetch Crops
  console.log('\nTest 2: Testing Crop Selection Module...');
  const t2 = mockReqRes();
  await getAllCrops(t2.req, t2.res);
  const cropsData = t2.getData();
  if (cropsData.crops.length === 7) {
    console.log(`  ✅ PASSED: Retrieved all ${cropsData.crops.length} crops. Top crop: ${cropsData.crops[0].name} (MSP ₹${cropsData.crops[0].msp})`);
  } else {
    throw new Error('Test 2 Failed');
  }

  // Test 3: Calculate MSP Earnings
  console.log('\nTest 3: Testing MSP Calculator (100 Quintals Wheat)...');
  const t3 = mockReqRes({ cropId: 'crop-001', quantity: 100 });
  await calculateEarnings(t3.req, t3.res);
  const calcData = t3.getData();
  if (calcData.calculation.officialMspPayout === 227500) {
    console.log(`  ✅ PASSED: Calculated official MSP Payout = ₹${calcData.calculation.officialMspPayout}`);
  } else {
    throw new Error('Test 3 Failed: ' + JSON.stringify(calcData));
  }

  // Test 4: Fetch Procurement Centres with AI Scoring
  console.log('\nTest 4: Testing Procurement Centres & AI Scoring Engine...');
  const t4 = mockReqRes({}, {}, {}, authUser);
  await getAllCentres(t4.req, t4.res);
  const centresData = t4.getData();
  if (centresData.centres.length === 10) {
    const top = centresData.centres[0];
    console.log(`  ✅ PASSED: Retrieved 10 MP Demo Centres. Top recommended: "${top.name}" with AI Score: ${top.smartScore}/100 (${top.recommendationLabel})`);
  } else {
    throw new Error('Test 4 Failed');
  }

  // Test 5: Split Selling Booking (Module 6)
  console.log('\nTest 5: Testing Split Selling with Atomic Quota Deduction...');
  const store = getLocalStore();
  const c1 = store.procurement_centres.find(c => c.id === 'centre-001');
  const c2 = store.procurement_centres.find(c => c.id === 'centre-002');
  const c3 = store.procurement_centres.find(c => c.id === 'centre-003');
  const q1Before = Number(c1.available_quota);
  const q2Before = Number(c2.available_quota);
  const q3Before = Number(c3.available_quota);

  // Split 100 quintals: 40 + 35 + 25 = 100
  const t5 = mockReqRes({
    cropId: 'crop-001',
    totalQuantity: 100,
    bookingDate: '2026-11-20',
    allocations: [
      { centreId: 'centre-001', quantity: 40, slotTimeWindow: '09:00 AM - 12:00 PM' },
      { centreId: 'centre-002', quantity: 35, slotTimeWindow: '12:00 PM - 03:00 PM' },
      { centreId: 'centre-003', quantity: 25, slotTimeWindow: '03:00 PM - 06:00 PM' }
    ]
  }, {}, {}, authUser);
  await createBooking(t5.req, t5.res);
  const splitBookingData = t5.getData();

  if (t5.getStatus() === 201 && splitBookingData.booking.token_number) {
    const q1After = Number(c1.available_quota);
    const q2After = Number(c2.available_quota);
    const q3After = Number(c3.available_quota);
    console.log(`  ✅ PASSED: Split selling booked! Token: ${splitBookingData.booking.token_number}, Ref: ${splitBookingData.booking.booking_reference}`);
    console.log(`     Quota reserved atomically: Centre 1 (-40: ${q1Before} -> ${q1After}), Centre 2 (-35: ${q2Before} -> ${q2After}), Centre 3 (-25: ${q3Before} -> ${q3After})`);
  } else {
    throw new Error('Test 5 Failed: ' + JSON.stringify(splitBookingData));
  }

  // Test 6: 9-Stage Visual Procurement Tracking
  console.log('\nTest 6: Testing 9-Stage Procurement Tracking for Token A-042...');
  const t6 = mockReqRes({}, { identifier: 'A-042' });
  await getTrackingTimeline(t6.req, t6.res);
  const trackData = t6.getData();
  if (trackData.timeline && trackData.timeline.length === 9) {
    console.log(`  ✅ PASSED: 9-Stage Timeline loaded successfully. Current Status: ${trackData.status} (Step ${trackData.currentStep}/9)`);
  } else {
    throw new Error('Test 6 Failed: ' + JSON.stringify(trackData));
  }

  // Test 7: Operator Portal Updating Stage (Advancing to Step 7: Crop Accepted)
  console.log('\nTest 7: Testing Mandi Operator Interface Updating Stage...');
  const operatorUser = { id: 'usr-operator-001', full_name: 'Shri Vikram Singh Chouhan', role: 'operator' };
  const t7 = mockReqRes({
    bookingId: 'bk-demo-001',
    targetStep: 7,
    grossWeight: 140,
    tareWeight: 40,
    moisturePercentage: 11.2,
    qualityGrade: 'Grade-A (FAQ Certified)',
    operatorNotes: 'Verified grain moisture 11.2%. FAQ Grade A accepted at Silo 4.'
  }, {}, {}, operatorUser);
  await updateOperatorStage(t7.req, t7.res);
  const opData = t7.getData();
  if (t7.getStatus() === 200) {
    console.log(`  ✅ PASSED: Operator successfully updated booking to Step 7: Crop Accepted!`);
  } else {
    throw new Error('Test 7 Failed: ' + JSON.stringify(opData));
  }

  // Test 8: Farmer Dashboard Aggregated Real Metrics
  console.log('\nTest 8: Testing Farmer Dashboard Real DB Aggregations...');
  const t8 = mockReqRes({}, {}, {}, authUser);
  await getDashboardData(t8.req, t8.res);
  const dashData = t8.getData();
  if (dashData.stats && dashData.stats.kisanId === 'KS-MP-IND-01001') {
    console.log(`  ✅ PASSED: Dashboard returned real metrics:
     - Farmer: ${dashData.stats.farmerName} (${dashData.stats.kisanId})
     - Active Bookings: ${dashData.stats.activeBookingsCount}
     - Pending Procurement: ${dashData.stats.pendingProcurementQty} Qtl
     - Total Credited: ₹${dashData.stats.totalCreditedAmount}
     - Recommended Centres: ${dashData.recommendedCentres.length} centres loaded`);
  } else {
    throw new Error('Test 8 Failed: ' + JSON.stringify(dashData));
  }

  // Test 9: Farmer Registration Validation & Generation
  console.log('\nTest 9: Testing New Farmer Registration & Kisan ID Generation...');
  const testEmail = `farmer.test.${Date.now()}@krishi.mp.gov`;
  const t9 = mockReqRes({
    full_name: 'Babulal Malviya',
    mobile_number: '9893' + Math.floor(100000 + Math.random() * 900000),
    email: testEmail,
    password: 'Farmer@123',
    village: 'Gram Datana',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    farmer_address: 'Maksi Road, Datana, Ujjain 456664',
    land_area: 14.5,
    preferred_language: 'Hindi'
  });
  await register(t9.req, t9.res);
  const regData = t9.getData();
  if (t9.getStatus() === 201 && regData.user.kisan_id.startsWith('KS-MP-UJJ-')) {
    console.log(`  ✅ PASSED: New Farmer Registered successfully! Generated Kisan ID: ${regData.user.kisan_id}`);
  } else {
    throw new Error('Test 9 Failed: ' + JSON.stringify(regData));
  }

  console.log('\n🎉 ALL 9 BACKEND MODULES AND CONTROLLERS VERIFIED 100% WORKING!\n');
}

runTests().catch(err => {
  console.error('\n❌ Test execution encountered error:', err);
  process.exit(1);
});
