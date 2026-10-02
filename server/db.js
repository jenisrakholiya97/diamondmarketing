import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Database Connection Configuration
const connectionConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
  : {
    host: process.env.PGHOST || '127.0.0.1',
    port: parseInt(process.env.PGPORT || '5433', 10),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'diamond_marketing',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

export const pool = new Pool(connectionConfig);

// Path to fallback_diamonds.json storage
const fallbackFilePath = path.join(__dirname, 'data', 'fallback_diamonds.json');
const publicFallbackFilePath = path.join(__dirname, '..', 'public', 'fallback_diamonds.json');

// Read diamonds from fallback_diamonds.json
export function loadFallbackDiamonds() {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const raw = fs.readFileSync(fallbackFilePath, 'utf8');
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Error loading fallback_diamonds.json:', err.message);
  }
  return [];
}

// Persist diamonds to fallback_diamonds.json and public directory
export function saveFallbackDiamonds(diamonds) {
  if (process.env.NODE_ENV === 'test') {
    // In test environment, do not overwrite user catalog file
    return true;
  }
  try {
    const dir = path.dirname(fallbackFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fallbackFilePath, JSON.stringify(diamonds, null, 2), 'utf8');

    // Also sync to public directory for static / client availability
    try {
      const publicDir = path.dirname(publicFallbackFilePath);
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(publicFallbackFilePath, JSON.stringify(diamonds, null, 2), 'utf8');
      }
    } catch { /* ignore public sync */ }

    return true;
  } catch (err) {
    console.error('Error saving fallback_diamonds.json:', err.message);
    return false;
  }
}

// In-Memory / Local File Fallback Cache for seamless resilient operation
// Strictly populated from fallback_diamonds.json; user uploaded data pushes into this object
export const fallbackStorage = {
  diamonds: loadFallbackDiamonds(),
  quotes: [],
  reviews: []
};

// Sync to public directory on startup if public folder exists
try {
  const publicDir = path.dirname(publicFallbackFilePath);
  if (fs.existsSync(publicDir) && !fs.existsSync(publicFallbackFilePath) && fallbackStorage.diamonds.length > 0) {
    fs.writeFileSync(publicFallbackFilePath, JSON.stringify(fallbackStorage.diamonds, null, 2), 'utf8');
  }
} catch { /* ignore */ }

let isPostgresConnected = false;

// Initialize PostgreSQL Tables
export async function initDb() {
  if (fallbackStorage.diamonds.length === 0) {
    fallbackStorage.diamonds = loadFallbackDiamonds();
  }
  try {
    const client = await pool.connect();
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(sql);
      }
      isPostgresConnected = true;
      console.log('✅ PostgreSQL Database schema initialized successfully!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection notice:', err.message);
    console.log('ℹ️ Running backend API with persistent fallback storage enabled.');
    isPostgresConnected = false;
  }
}

// Universal Query Wrapper
export async function query(text, params) {
  if (isPostgresConnected) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error('PostgreSQL Query Error:', err.message);
    }
  }
  return { rows: [] };
}

// ----------------------------------------------------
// DIAMONDS DATA MODEL (PostgreSQL Operations)
// ----------------------------------------------------

// ----------------------------------------------------
// DIAMONDS DATA MODEL (PostgreSQL Operations)
// ----------------------------------------------------

export async function getAllDiamondsFromDb(filters = {}) {
  try {
    let sql = 'SELECT * FROM diamonds WHERE 1=1';
    const values = [];
    let paramIdx = 1;

    if (filters.shape && filters.shape !== 'All') {
      sql += ` AND LOWER(shape) = LOWER($${paramIdx++})`;
      values.push(filters.shape);
    }
    if (filters.color && filters.color !== 'All') {
      sql += ` AND color = $${paramIdx++}`;
      values.push(filters.color);
    }
    if (filters.clarity && filters.clarity !== 'All') {
      sql += ` AND clarity = $${paramIdx++}`;
      values.push(filters.clarity);
    }
    if (filters.onlyTripleExcellent) {
      sql += ` AND is_triple_excellent = TRUE`;
    }
    if (filters.source === 'added') {
      sql += ` AND is_custom_added = TRUE`;
    } else if (filters.source === 'stock') {
      sql += ` AND is_custom_added = FALSE`;
    }

    sql += ' ORDER BY created_at DESC';

    const res = await pool.query(sql, values);
    isPostgresConnected = true;
    const dbDiamonds = res.rows.map(mapDbRowToDiamond);

    return dbDiamonds.filter((d) => {
      if (filters.shape && filters.shape !== 'All' && (d.shape || '').toLowerCase() !== filters.shape.toLowerCase()) return false;
      if (filters.color && filters.color !== 'All' && d.color !== filters.color) return false;
      if (filters.clarity && filters.clarity !== 'All' && d.clarity !== filters.clarity) return false;
      if (filters.onlyTripleExcellent && !d.isTripleExcellent) return false;
      if (filters.source === 'added' && !d.isCustomAdded) return false;
      if (filters.source === 'stock' && d.isCustomAdded) return false;
      return true;
    });
  } catch (err) {
    console.error('Error fetching diamonds from PostgreSQL:', err.message);
  }

  // Fallback to in-memory/custom array with filtering support
  return (fallbackStorage.diamonds || []).filter((d) => {
    if (filters.shape && filters.shape !== 'All' && (d.shape || '').toLowerCase() !== filters.shape.toLowerCase()) return false;
    if (filters.color && filters.color !== 'All' && d.color !== filters.color) return false;
    if (filters.clarity && filters.clarity !== 'All' && d.clarity !== filters.clarity) return false;
    if (filters.onlyTripleExcellent && !d.isTripleExcellent) return false;
    if (filters.source === 'added' && !d.isCustomAdded) return false;
    if (filters.source === 'stock' && d.isCustomAdded) return false;
    return true;
  });
}

export async function getDiamondByIdFromDb(id) {
  try {
    const res = await pool.query('SELECT * FROM diamonds WHERE id = $1', [id]);
    isPostgresConnected = true;
    if (res.rows.length > 0) {
      return mapDbRowToDiamond(res.rows[0]);
    }
    return null;
  } catch (err) {
    console.error(`Error fetching diamond ${id} from PostgreSQL:`, err.message);
  }
  return (fallbackStorage.diamonds || []).find((d) => String(d.id) === String(id)) || null;
}

function saveBase64MediaToFile(dataUrl, folder, filenamePrefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  try {
    const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) return dataUrl;
    const mime = match[1];
    const base64Data = match[2];
    let ext = 'bin';
    if (mime.includes('mp4')) ext = 'mp4';
    else if (mime.includes('webm')) ext = 'webm';
    else if (mime.includes('png')) ext = 'png';
    else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
    else if (mime.includes('webp')) ext = 'webp';

    const dir = path.join(__dirname, '..', 'public', 'assets', 'nivaan', folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filename = `${filenamePrefix}.${ext}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    return `/assets/nivaan/${folder}/${filename}`;
  } catch (e) {
    console.error(`Failed to save base64 media for ${filenamePrefix}:`, e.message);
    return dataUrl;
  }
}

export async function insertDiamondIntoDb(diamond) {
  const diamondId = diamond.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const resolvedVideoUrl = saveBase64MediaToFile(diamond.videoUrl || diamond.video, 'videos', diamondId);
  const resolvedImageUrl = saveBase64MediaToFile(diamond.imageUrl || diamond.image, 'images', diamondId);
  const rawImages = Array.isArray(diamond.images) && diamond.images.length > 0 ? diamond.images : [diamond.imageUrl || diamond.image].filter(Boolean);
  const resolvedImages = rawImages.map((img, idx) => {
    if (img === (diamond.imageUrl || diamond.image) && resolvedImageUrl) return resolvedImageUrl;
    return saveBase64MediaToFile(img, 'images', `${diamondId}-${idx}`);
  });
  const rawPoster = diamond.videoPoster;
  const resolvedVideoPoster = (!rawPoster || rawPoster === (diamond.imageUrl || diamond.image))
    ? resolvedImageUrl
    : saveBase64MediaToFile(rawPoster, 'images', `${diamondId}-poster`) || resolvedImageUrl;

  const formatted = {
    id: diamondId,
    originalId: diamond.originalId || diamond.id || '',
    handle: diamond.handle || '',
    title: diamond.title || 'Certified Lab-Grown Diamond',
    category: diamond.category || 'diamond',
    productType: diamond.productType || 'diamond',
    naturalOrLab: diamond.naturalOrLab || 'Lab-grown',
    shape: diamond.shape || 'Round Brilliant',
    carat: diamond.carat || `${parseFloat(diamond.caratValue || 1.0).toFixed(2)} Ct`,
    caratValue: parseFloat(diamond.caratValue) || 1.0,
    color: diamond.color || 'D',
    colorTier: diamond.colorTier || 'Near Colorless',
    clarity: diamond.clarity || 'VVS1',
    clarityTier: diamond.clarityTier || 'Very Very Slightly Included',
    cut: diamond.cut || 'Ideal',
    cert: diamond.cert || 'IGI Certified',
    certNumber: diamond.certNumber || `LG${Math.floor(100000000 + Math.random() * 900000000)}`,
    certUrl: diamond.certUrl || 'https://www.igi.org',
    dimensions: diamond.dimensions || '10.00 x 7.50 x 4.50 mm',
    depth: diamond.depth || '62.0%',
    tablePct: diamond.table || diamond.tablePct || '57.0%',
    polish: diamond.polish || 'Excellent',
    symmetry: diamond.symmetry || 'Excellent',
    fluorescence: diamond.fluorescence || 'None',
    ratio: diamond.ratio || '1.00',
    price: diamond.price || `$${(parseFloat(diamond.priceValue || 1000)).toLocaleString('en-US')}`,
    priceValue: parseFloat(diamond.priceValue) || 1000.0,
    isTripleExcellent: Boolean(diamond.isTripleExcellent !== false),
    imageUrl: resolvedImageUrl,
    image: resolvedImageUrl,
    images: resolvedImages.length > 0 ? resolvedImages : [resolvedImageUrl].filter(Boolean),
    videoUrl: resolvedVideoUrl,
    video: resolvedVideoUrl,
    videoPoster: resolvedVideoPoster,
    isCustomAdded: Boolean(diamond.isCustomAdded !== false)
  };

  // Add to fallback storage and persist to fallback_diamonds.json
  fallbackStorage.diamonds = [formatted, ...fallbackStorage.diamonds.filter((d) => String(d.id) !== String(formatted.id))];
  saveFallbackDiamonds(fallbackStorage.diamonds);

  try {
    const sql = `
      INSERT INTO diamonds (
        id, original_id, handle, title, category, product_type, natural_or_lab,
        shape, carat, carat_value, color, color_tier, clarity, clarity_tier, cut,
        cert, cert_number, cert_url, dimensions, depth, table_pct, polish, symmetry,
        fluorescence, ratio, price, price_value, is_triple_excellent, image_url, image,
        images, video_url, video, video_poster, is_custom_added
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        price_value = EXCLUDED.price_value,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        images = EXCLUDED.images,
        video_url = EXCLUDED.video_url
    `;
    const values = [
      formatted.id, formatted.originalId, formatted.handle, formatted.title, formatted.category,
      formatted.productType, formatted.naturalOrLab, formatted.shape, formatted.carat, formatted.caratValue,
      formatted.color, formatted.colorTier, formatted.clarity, formatted.clarityTier, formatted.cut,
      formatted.cert, formatted.certNumber, formatted.certUrl, formatted.dimensions, formatted.depth,
      formatted.tablePct, formatted.polish, formatted.symmetry, formatted.fluorescence, formatted.ratio,
      formatted.price, formatted.priceValue, formatted.isTripleExcellent, formatted.imageUrl, formatted.imageUrl,
      JSON.stringify(formatted.images), formatted.videoUrl, formatted.videoUrl, formatted.videoPoster, formatted.isCustomAdded
    ];
    await pool.query(sql, values);
    isPostgresConnected = true;
  } catch (err) {
    console.error('Error inserting diamond into PostgreSQL:', err.message);
  }

  return formatted;
}

export async function deleteDiamondFromDb(id) {
  fallbackStorage.diamonds = fallbackStorage.diamonds.filter((d) => String(d.id) !== String(id));
  saveFallbackDiamonds(fallbackStorage.diamonds);

  try {
    await pool.query('DELETE FROM diamonds WHERE id = $1', [id]);
    isPostgresConnected = true;
  } catch (err) {
    console.error(`Error deleting diamond ${id} from PostgreSQL:`, err.message);
  }
  return true;
}

// ----------------------------------------------------
// QUOTES DATA MODEL (PostgreSQL Operations)
// ----------------------------------------------------

export async function insertQuoteIntoDb(quoteData) {
  const quote = {
    id: `quote-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    category: quoteData.category || 'Lab-grown',
    specs: quoteData.specs || '',
    fullName: quoteData.fullName || quoteData.name || '',
    companyName: quoteData.companyName || quoteData.company || quoteData.businessName || '',
    email: quoteData.email || '',
    phone: quoteData.phone || '',
    country: quoteData.country || '',
    targetBudget: quoteData.targetBudget || quoteData.budget || '',
    orderTimeframe: quoteData.orderTimeframe || quoteData.timeframe || '',
    notes: quoteData.notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  fallbackStorage.quotes.unshift(quote);

  if (isPostgresConnected) {
    try {
      const sql = `
        INSERT INTO quotes (
          id, category, specs, full_name, company_name, email, phone,
          country, target_budget, order_timeframe, notes, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      const values = [
        quote.id, quote.category, quote.specs, quote.fullName, quote.companyName,
        quote.email, quote.phone, quote.country, quote.targetBudget, quote.orderTimeframe,
        quote.notes, quote.status
      ];
      await pool.query(sql, values);
    } catch (err) {
      console.error('Error inserting quote into PostgreSQL:', err.message);
    }
  }

  return quote;
}

export async function getAllQuotesFromDb() {
  if (isPostgresConnected) {
    try {
      const res = await pool.query('SELECT * FROM quotes ORDER BY created_at DESC');
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          id: row.id,
          category: row.category,
          specs: row.specs,
          fullName: row.full_name,
          companyName: row.company_name,
          email: row.email,
          phone: row.phone,
          country: row.country,
          targetBudget: row.target_budget,
          orderTimeframe: row.order_timeframe,
          notes: row.notes,
          status: row.status,
          createdAt: row.created_at
        }));
      }
    } catch (err) {
      console.error('Error fetching quotes from PostgreSQL:', err.message);
    }
  }
  return fallbackStorage.quotes;
}

// ----------------------------------------------------
// REVIEWS DATA MODEL (PostgreSQL Operations)
// ----------------------------------------------------

export async function insertReviewIntoDb(reviewData) {
  const review = {
    id: `review-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    authorName: reviewData.authorName || reviewData.name || 'B2B Client',
    companyName: reviewData.companyName || reviewData.company || 'Jewelry Distributor',
    country: reviewData.country || 'International',
    rating: parseInt(reviewData.rating || '5', 10),
    reviewText: reviewData.reviewText || reviewData.text || '',
    verifiedPurchaser: true,
    createdAt: new Date().toISOString()
  };

  fallbackStorage.reviews.unshift(review);

  if (isPostgresConnected) {
    try {
      const sql = `
        INSERT INTO reviews (id, author_name, company_name, country, rating, review_text, verified_purchaser)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      await pool.query(sql, [
        review.id, review.authorName, review.companyName, review.country,
        review.rating, review.reviewText, review.verifiedPurchaser
      ]);
    } catch (err) {
      console.error('Error inserting review into PostgreSQL:', err.message);
    }
  }

  return review;
}

export async function getAllReviewsFromDb() {
  if (isPostgresConnected) {
    try {
      const res = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
      if (res.rows.length > 0) {
        return res.rows.map((row) => ({
          id: row.id,
          authorName: row.author_name,
          companyName: row.company_name,
          country: row.country,
          rating: row.rating,
          reviewText: row.review_text,
          verifiedPurchaser: row.verified_purchaser,
          createdAt: row.created_at
        }));
      }
    } catch (err) {
      console.error('Error fetching reviews from PostgreSQL:', err.message);
    }
  }
  return fallbackStorage.reviews;
}

// Helper: Map PostgreSQL DB Row to Client Diamond Object
function mapDbRowToDiamond(row) {
  let images = [];
  try {
    images = typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []);
  } catch {
    images = [row.image_url];
  }

  return {
    id: row.id,
    originalId: row.original_id,
    handle: row.handle,
    title: row.title,
    category: row.category,
    productType: row.product_type,
    naturalOrLab: row.natural_or_lab,
    shape: row.shape,
    carat: row.carat,
    caratValue: parseFloat(row.carat_value),
    color: row.color,
    colorTier: row.color_tier,
    clarity: row.clarity,
    clarityTier: row.clarity_tier,
    cut: row.cut,
    cert: row.cert,
    certNumber: row.cert_number,
    certUrl: row.cert_url,
    dimensions: row.dimensions,
    depth: row.depth,
    table: row.table_pct,
    polish: row.polish,
    symmetry: row.symmetry,
    fluorescence: row.fluorescence,
    ratio: row.ratio,
    price: row.price,
    priceValue: parseFloat(row.price_value),
    isTripleExcellent: row.is_triple_excellent,
    imageUrl: row.image_url,
    image: row.image_url,
    images: images.length > 0 ? images : [row.image_url],
    videoUrl: row.video_url,
    video: row.video_url,
    videoPoster: row.video_poster,
    isCustomAdded: row.is_custom_added,
    createdAt: row.created_at
  };
}
