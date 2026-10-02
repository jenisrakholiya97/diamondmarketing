import dotenv from 'dotenv';
import { initDb, pool } from './db.js';

dotenv.config();

async function seedDatabase() {
  console.log('🌱 Starting PostgreSQL Database Seed Process...');
  await initDb();
  console.log('✅ Database initialized successfully!');
  await pool.end();
}

seedDatabase().catch((err) => {
  console.error('Fatal error during database seeding:', err);
  process.exit(1);
});
