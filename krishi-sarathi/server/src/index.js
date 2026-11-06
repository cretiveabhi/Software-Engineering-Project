// Krishi Sarathi (कृषि सारथी) Backend Server
// Smart India Hackathon 2026 | PS: SIH26032 | Team: Off By One
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import db, { initDb, isPostgres, getLocalStore } from './config/database.js';
import { runSeed } from './scripts/seed.js';

// Import Routes
import authRoutes from './routes/auth.js';
import cropRoutes from './routes/crops.js';
import centreRoutes from './routes/centres.js';
import bookingRoutes from './routes/bookings.js';
import trackingRoutes from './routes/tracking.js';
import paymentRoutes from './routes/payments.js';
import farmerRoutes from './routes/farmer.js';
import weatherRoutes from './routes/weather.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '../../client/dist');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev & preview servers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'KRISHI SARATHI (कृषि सारथी)',
    hackathon: 'Smart India Hackathon 2026 (SIH26032)',
    team: 'Off By One',
    databaseEngine: isPostgres() ? 'Supabase PostgreSQL' : 'Local Relational Store',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/centres', centreRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/weather', weatherRoutes);

// Serve Client Static Build if present (Single-port Unified Full-Stack)
if (fs.existsSync(CLIENT_DIST)) {
  console.log(`📁 Serving frontend static build from: ${CLIENT_DIST}`);
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Initialize Database & Server
async function startServer() {
  try {
    await initDb();

    // Check if seeding is needed
    if (!isPostgres()) {
      const store = getLocalStore();
      if (!store.crops || store.crops.length === 0) {
        console.log('⚡ Initializing seed data on first boot...');
        await runSeed();
      }
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🌾 KRISHI SARATHI API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`   Database Mode: ${isPostgres() ? 'Supabase PostgreSQL' : 'Local Relational Store'}`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`   Smart India Hackathon 2026 | Team: Off By One`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Only auto-listen when run directly
if (process.argv[1]?.endsWith('index.js')) {
  startServer();
}

export { app, startServer };
export default app;

