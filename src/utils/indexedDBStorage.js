// Lightweight, zero-dependency IndexedDB storage manager for permanent diamond & media file persistence

const DB_NAME = 'gk_diamond_marketing_db';
const DB_VERSION = 3;
const STORE_CUSTOM = 'custom_diamonds';
const STORE_DB_DIAMONDS = 'db_diamonds';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_CUSTOM)) {
        db.createObjectStore(STORE_CUSTOM, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_DB_DIAMONDS)) {
        db.createObjectStore(STORE_DB_DIAMONDS, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

const memoryCustomStore = new Map();
const memoryDbStore = new Map();

export async function saveToIndexedDB(diamonds) {
  memoryCustomStore.clear();
  if (Array.isArray(diamonds)) {
    diamonds.forEach((d) => {
      if (d && d.id) memoryCustomStore.set(d.id, d);
    });
  }
  try {
    const db = await openDB();
    if (!db) return true;
    const tx = db.transaction(STORE_CUSTOM, 'readwrite');
    const store = tx.objectStore(STORE_CUSTOM);
    store.clear();
    diamonds.forEach((d) => {
      store.put(d);
    });
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(true);
    });
  } catch {
    return true;
  }
}

export async function deleteFromIndexedDB(id) {
  if (!id) return;
  memoryCustomStore.delete(id);
  memoryDbStore.delete(id);
  try {
    const db = await openDB();
    if (!db) return;
    const tx = db.transaction([STORE_CUSTOM, STORE_DB_DIAMONDS], 'readwrite');
    tx.objectStore(STORE_CUSTOM).delete(id);
    tx.objectStore(STORE_DB_DIAMONDS).delete(id);
  } catch { /* ignore */ }
}

export async function loadFromIndexedDB() {
  try {
    const db = await openDB();
    if (!db) return Array.from(memoryCustomStore.values());
    if (!db.objectStoreNames.contains(STORE_CUSTOM)) return Array.from(memoryCustomStore.values());
    const tx = db.transaction(STORE_CUSTOM, 'readonly');
    const store = tx.objectStore(STORE_CUSTOM);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const res = request.result;
        if (Array.isArray(res) && res.length > 0) {
          res.forEach((item) => memoryCustomStore.set(item.id, item));
        }
        resolve(Array.from(memoryCustomStore.values()));
      };
      request.onerror = () => resolve(Array.from(memoryCustomStore.values()));
    });
  } catch {
    return Array.from(memoryCustomStore.values());
  }
}

export async function saveDbDiamondsToIndexedDB(diamonds) {
  memoryDbStore.clear();
  if (Array.isArray(diamonds)) {
    diamonds.forEach((d) => {
      if (d && d.id) memoryDbStore.set(d.id, d);
    });
  }
  try {
    const db = await openDB();
    if (!db) return true;
    const tx = db.transaction(STORE_DB_DIAMONDS, 'readwrite');
    const store = tx.objectStore(STORE_DB_DIAMONDS);
    store.clear();
    diamonds.forEach((d) => {
      store.put(d);
    });
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(true);
    });
  } catch {
    return true;
  }
}

export async function loadDbDiamondsFromIndexedDB() {
  try {
    const db = await openDB();
    if (!db) return Array.from(memoryDbStore.values());
    if (!db.objectStoreNames.contains(STORE_DB_DIAMONDS)) return Array.from(memoryDbStore.values());
    const tx = db.transaction(STORE_DB_DIAMONDS, 'readonly');
    const store = tx.objectStore(STORE_DB_DIAMONDS);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const res = request.result;
        if (Array.isArray(res) && res.length > 0) {
          res.forEach((item) => memoryDbStore.set(item.id, item));
        }
        resolve(Array.from(memoryDbStore.values()));
      };
      request.onerror = () => resolve(Array.from(memoryDbStore.values()));
    });
  } catch {
    return Array.from(memoryDbStore.values());
  }
}
