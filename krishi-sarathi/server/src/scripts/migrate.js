// Database Migration Script for Supabase PostgreSQL
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { isPostgres } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

async function runMigrations() {
  await db.initDb();

  if (!isPostgres()) {
    console.log('ℹ️ Running in local file-backed mode. Tables and schema are structured dynamically.');
    console.log('💡 To migrate a live Supabase PostgreSQL database, set DATABASE_URL in server/.env and re-run.');
    return;
  }

  console.log('🚀 Running SQL migrations on Supabase PostgreSQL...');

  const migrationFiles = [
    '001_initial_schema.sql',
    '002_rls_policies.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(MIGRATIONS_DIR, file);
    if (fs.existsSync(filePath)) {
      console.log(`Executing ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf-8');
      try {
        await db.query(sql);
        console.log(`✅ ${file} applied successfully.`);
      } catch (err) {
        console.error(`❌ Migration error in ${file}:`, err.message);
      }
    }
  }

  console.log('✨ All migrations completed.');
}

if (process.argv[1]?.endsWith('migrate.js')) {
  runMigrations().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}

export default runMigrations;
