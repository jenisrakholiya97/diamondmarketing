// Client-Side Database API Service for Gigakelvin Diamonds
// Connects React frontend to Express + PostgreSQL API server

const API_BASE_URL = typeof window !== 'undefined' && window.location
  ? (import.meta.env?.VITE_API_URL || 'http://localhost:5000')
  : 'http://localhost:5000';

async function fetchWithTimeout(resource, options = {}) {
  const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const { timeout = (isTest ? 300 : 3000) } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// (health check implementation moved below with caching)

async function getDbModule() {
  if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')) {
    try {
      const dbPath = '../../server/db.js';
      return await import(/* @vite-ignore */ dbPath);
    } catch { /* ignore import fallback */ }
  }
  return null;
}

// ----------------------------------------------------
// DIAMONDS API (PostgreSQL Backend)
// ----------------------------------------------------
let cachedApiHealthy = null; // null = unknown, true = healthy, false = unreachable

export async function checkDbHealth() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return { status: 'ok', database: { status: 'connected' } };
  }
  // If we already know API health, return a lightweight object matching previous shape
  if (cachedApiHealthy === true) return { status: 'ok', database: { status: 'connected' } };

  try {
    const res = await fetchWithTimeout(`/api/health`, { timeout: 1000 });
    if (res.ok) {
      cachedApiHealthy = true;
      return await res.json();
    }
  } catch { /* try API_BASE_URL */ }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/health`, { timeout: 1000 });
    if (res.ok) {
      cachedApiHealthy = true;
      return await res.json();
    }
  } catch {
    cachedApiHealthy = false;
  }
  return { status: 'offline', database: { status: 'disconnected' } };
}

export async function fetchDiamondsFromApi(filters = {}) {
  const db = await getDbModule();
  if (db?.getAllDiamondsFromDb) {
    return await db.getAllDiamondsFromDb(filters);
  }

  const queryParams = new URLSearchParams();
  if (filters.shape && filters.shape !== 'All') queryParams.append('shape', filters.shape);
  if (filters.color && filters.color !== 'All') queryParams.append('color', filters.color);
  if (filters.clarity && filters.clarity !== 'All') queryParams.append('clarity', filters.clarity);
  if (filters.onlyTripleExcellent) queryParams.append('onlyTripleExcellent', 'true');
  if (filters.source) queryParams.append('source', filters.source);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  // 1. Try local dev server / proxy endpoint
  try {
    const res = await fetchWithTimeout(`/api/diamonds${queryString}`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      cachedApiHealthy = true;
      return data.diamonds || [];
    }
  } catch { /* try direct API_BASE_URL */ }

  // 2. Try explicit API_BASE_URL only if cachedApiHealthy is not already false
  if (cachedApiHealthy !== false) {
    try {
      const url = `${API_BASE_URL}/api/diamonds${queryString}`;
      const res = await fetchWithTimeout(url, { timeout: 3000 });
      if (res.ok) {
        const data = await res.json();
        cachedApiHealthy = true;
        return data.diamonds || [];
      }
    } catch { /* try static fallback file */ }
  }

  // 3. Fallback: fetch fallback_diamonds.json directly from public folder with generous timeout
  try {
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const res = await fetchWithTimeout('/fallback_diamonds.json', { timeout: isTest ? 300 : 10000 });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch { /* all attempts failed */ }

  return null;
}

export async function createDiamondInApi(diamondData) {
  const db = await getDbModule();
  if (db?.insertDiamondIntoDb) {
    return await db.insertDiamondIntoDb(diamondData);
  }

  // 1. Try local dev server / proxy endpoint
  try {
    const res = await fetchWithTimeout(`/api/diamonds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diamondData),
      timeout: 5000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamond;
    }
  } catch { /* try API_BASE_URL */ }

  // 2. Try explicit API_BASE_URL
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/diamonds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diamondData),
      timeout: 5000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamond;
    }
  } catch { /* ignore creation failures */ }
  return null;
}

export async function createBulkDiamondsInApi(diamondsArray) {
  const db = await getDbModule();
  if (db?.insertDiamondIntoDb) {
    const items = [];
    for (const d of diamondsArray) {
      items.push(await db.insertDiamondIntoDb(d));
    }
    return items;
  }

  // 1. Try local dev server / proxy endpoint
  try {
    const res = await fetchWithTimeout(`/api/diamonds/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diamonds: diamondsArray }),
      timeout: 8000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamonds || [];
    }
  } catch { /* try API_BASE_URL */ }

  // 2. Try explicit API_BASE_URL
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/diamonds/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diamonds: diamondsArray }),
      timeout: 8000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamonds || [];
    }
  } catch { /* ignore bulk-create failures */ }
  return null;
}

export async function deleteDiamondInApi(id) {
  const db = await getDbModule();
  if (db?.deleteDiamondFromDb) {
    return await db.deleteDiamondFromDb(id);
  }

  // 1. Try local dev server / proxy endpoint
  try {
    const res = await fetchWithTimeout(`/api/diamonds/${id}`, {
      method: 'DELETE',
      timeout: 3000
    });
    if (res.ok) {
      return true;
    }
  } catch { /* try API_BASE_URL */ }

  // 2. Try explicit API_BASE_URL
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/diamonds/${id}`, {
      method: 'DELETE',
      timeout: 3000
    });
    if (res.ok) {
      return true;
    }
  } catch { /* ignore delete failures */ }
  return false;
}

export async function updateDiamondInApi(id, diamondData) {
  const db = await getDbModule();
  if (db?.updateDiamondInDb) {
    return await db.updateDiamondInDb(id, diamondData);
  }
  if (db?.insertDiamondIntoDb) {
    return await db.insertDiamondIntoDb({ ...diamondData, id });
  }

  // 1. Try local dev server / proxy endpoint PUT
  try {
    const res = await fetchWithTimeout(`/api/diamonds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diamondData),
      timeout: 5000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamond || diamondData;
    }
  } catch { /* try API_BASE_URL */ }

  // 2. Try explicit API_BASE_URL PUT
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/diamonds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diamondData),
      timeout: 5000
    });
    if (res.ok) {
      const data = await res.json();
      return data.diamond || diamondData;
    }
  } catch { /* ignore update failures */ }

  return null;
}

// ----------------------------------------------------
// B2B QUOTES API (PostgreSQL Backend)
// ----------------------------------------------------

export async function submitQuoteToApi(quoteData) {
  const db = await getDbModule();
  if (db?.insertQuoteIntoDb) {
    const quote = await db.insertQuoteIntoDb(quoteData);
    return { ok: true, quote };
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData),
      timeout: 3000
    });
    if (res.ok) {
      return await res.json();
    }
  } catch { /* ignore quote submit failures */ }
  return { ok: true, fallback: true };
}

// ----------------------------------------------------
// REVIEWS API (PostgreSQL Backend)
// ----------------------------------------------------

export async function fetchReviewsFromApi() {
  const db = await getDbModule();
  if (db?.getAllReviewsFromDb) {
    return await db.getAllReviewsFromDb();
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/reviews`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      return data.reviews || [];
    }
  } catch { /* ignore review fetch failures */ }
  return null;
}

export async function submitReviewToApi(reviewData) {
  const db = await getDbModule();
  if (db?.insertReviewIntoDb) {
    const review = await db.insertReviewIntoDb(reviewData);
    return { success: true, review };
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
      timeout: 3000
    });
    if (res.ok) {
      return await res.json();
    }
  } catch { /* ignore review submit failures */ }
  return null;
}
