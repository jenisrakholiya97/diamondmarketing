import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDb,
  getAllDiamondsFromDb,
  getDiamondByIdFromDb,
  insertDiamondIntoDb,
  deleteDiamondFromDb,
  insertQuoteIntoDb,
  getAllQuotesFromDb,
  insertReviewIntoDb,
  getAllReviewsFromDb,
  pool
} from './db.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialize PostgreSQL Database Schema
initDb();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    const client = await pool.connect();
    client.release();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'fallback_mode';
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      engine: 'PostgreSQL',
      status: dbStatus
    }
  });
});

// ----------------------------------------------------
// DIAMONDS ENDPOINTS
// ----------------------------------------------------

// GET /api/diamonds - Fetch diamonds with optional filter parameters
app.get('/api/diamonds', async (req, res) => {
  try {
    const { shape, color, clarity, onlyTripleExcellent, source } = req.query;
    const diamonds = await getAllDiamondsFromDb({
      shape,
      color,
      clarity,
      onlyTripleExcellent: onlyTripleExcellent === 'true',
      source
    });
    res.json({ success: true, count: diamonds.length, diamonds });
  } catch (err) {
    console.error('API /api/diamonds error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/diamonds/:id - Fetch single diamond
app.get('/api/diamonds/:id', async (req, res) => {
  try {
    const diamond = await getDiamondByIdFromDb(req.params.id);
    if (!diamond) {
      return res.status(404).json({ success: false, error: 'Diamond not found' });
    }
    res.json({ success: true, diamond });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/diamonds - Create/Upload custom diamond
app.post('/api/diamonds', async (req, res) => {
  try {
    const diamondData = req.body;
    if (!diamondData.title && !diamondData.shape) {
      return res.status(400).json({ success: false, error: 'Diamond title or shape is required' });
    }
    const inserted = await insertDiamondIntoDb({
      ...diamondData,
      isCustomAdded: true
    });
    res.status(201).json({ success: true, message: 'Diamond created & stored in PostgreSQL database', diamond: inserted });
  } catch (err) {
    console.error('API POST /api/diamonds error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/diamonds/bulk - Bulk import diamonds into PostgreSQL
app.post('/api/diamonds/bulk', async (req, res) => {
  try {
    const { diamonds } = req.body;
    if (!Array.isArray(diamonds) || diamonds.length === 0) {
      return res.status(400).json({ success: false, error: 'Request body must contain a non-empty diamonds array' });
    }

    const insertedItems = [];
    for (const d of diamonds) {
      const inserted = await insertDiamondIntoDb({
        ...d,
        isCustomAdded: true
      });
      insertedItems.push(inserted);
    }

    res.status(201).json({
      success: true,
      count: insertedItems.length,
      message: `Successfully imported ${insertedItems.length} diamonds into PostgreSQL database`,
      diamonds: insertedItems
    });
  } catch (err) {
    console.error('API POST /api/diamonds/bulk error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/diamonds/:id - Remove custom diamond
app.delete('/api/diamonds/:id', async (req, res) => {
  try {
    await deleteDiamondFromDb(req.params.id);
    res.json({ success: true, message: `Diamond ${req.params.id} deleted from PostgreSQL database` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// B2B QUOTES ENDPOINTS
// ----------------------------------------------------

// POST /api/quotes - Submit B2B official quote request
app.post('/api/quotes', async (req, res) => {
  try {
    const quote = await insertQuoteIntoDb(req.body);
    res.status(201).json({
      ok: true,
      success: true,
      message: 'Official B2B quotation request submitted & stored in PostgreSQL database',
      quote
    });
  } catch (err) {
    console.error('API POST /api/quotes error:', err);
    res.status(500).json({ ok: false, success: false, error: err.message });
  }
});

// GET /api/quotes - Fetch quote requests
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await getAllQuotesFromDb();
    res.json({ success: true, count: quotes.length, quotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------------------------------------------
// REVIEWS ENDPOINTS
// ----------------------------------------------------

// POST /api/reviews - Submit customer review
app.post('/api/reviews', async (req, res) => {
  try {
    const review = await insertReviewIntoDb(req.body);
    res.status(201).json({ success: true, message: 'Review saved in PostgreSQL database', review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews - Fetch reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await getAllReviewsFromDb();
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Gigakelvin Express Backend API with PostgreSQL running on http://localhost:${PORT}`);
  });
}

export default app;
