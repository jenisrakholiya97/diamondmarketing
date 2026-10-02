import { createContext, useContext, useState, useEffect } from 'react';
import { SITE_CONFIG, SUPPLY_CAPABILITIES, PROCESS_STEPS, FAQ_ITEMS, CORE_FACTS } from '../data/tradeData';
import { CATALOG_DIAMONDS } from '../data/catalogData';
import fallbackDiamondsData from '../../server/data/fallback_diamonds.json';

// Fallback catalog dataset containing all uploaded & loose certified diamond products
const DEFAULT_UPLOADED_DIAMONDS = CATALOG_DIAMONDS;
import { saveToIndexedDB, loadFromIndexedDB, saveDbDiamondsToIndexedDB, loadDbDiamondsFromIndexedDB, deleteFromIndexedDB } from '../utils/indexedDBStorage';
import { createDiamondInApi, createBulkDiamondsInApi, deleteDiamondInApi, fetchDiamondsFromApi, updateDiamondInApi } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Theme mode state: 'dark' | 'light' | 'system'
  const [themeMode, setThemeModeState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('gk_trade_theme') || 'system';
    }
    return 'system';
  });

  // Theme color preset state: 'diamond-luxe' | 'gold'
  const [themeColor, setThemeColorState] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('gk_trade_theme_color') || 'diamond-luxe';
    }
    return 'diamond-luxe';
  });

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState({ category: 'Lab-grown', specs: '' });

  // Add Product Modal & Custom Diamonds state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [activeAddProductTab, setActiveAddProductTab] = useState('single'); // 'single' | 'bulk' | 'fields' | 'manage'

  const [dbDiamonds, setDbDiamonds] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = localStorage.getItem('gk_cached_db_diamonds');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch { /* ignore localStorage read failures */ }
    }
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    return isTest ? [] : (Array.isArray(fallbackDiamondsData) ? fallbackDiamondsData : []);
  });

  const [dbConnected, setDbConnected] = useState(() => {
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    if (!isTest) return true;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = localStorage.getItem('gk_cached_db_diamonds');
        if (cached && JSON.parse(cached).length > 0) return true;
      } catch { /* ignore localStorage read failures */ }
    }
    return false;
  });

  const [customDiamonds, setCustomDiamonds] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = localStorage.getItem('gk_custom_diamonds');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
            if (isTest) return parsed;
            // Purge deleted/stale items not in server/data/fallback_diamonds.json
            const validIds = new Set((fallbackDiamondsData || []).map((d) => String(d.id)));
            const valid = parsed.filter((d) => validIds.has(String(d.id)));
            if (valid.length !== parsed.length) {
              try {
                localStorage.setItem('gk_custom_diamonds', JSON.stringify(valid));
              } catch { /* ignore */ }
            }
            return valid;
          }
        }
      } catch (e) {
        console.error('Failed to parse custom diamonds from localStorage:', e);
      }
    }
    return [];
  });

  const refreshDiamondsFromPostgres = async () => {
    if (typeof window === 'undefined') return null;

    // Fetch from backend API / fallback_diamonds.json
    try {
      const apiDiamonds = await fetchDiamondsFromApi();
      if (Array.isArray(apiDiamonds)) {
        setDbDiamonds(apiDiamonds);
        setDbConnected(true);
        saveDbDiamondsToIndexedDB(apiDiamonds);
        // Also ensure any custom diamonds inherit rich media from apiDiamonds if matching IDs exist
        setCustomDiamonds((prev) => {
          if (prev.length === 0) return prev;
          const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
          const validApiIds = new Set([
            ...apiDiamonds.map((a) => String(a.id)),
            ...(isTest ? [] : (fallbackDiamondsData || []).map((f) => String(f.id)))
          ]);
          const pruned = isTest ? prev : prev.filter((c) => validApiIds.has(String(c.id)));
          let changed = (pruned.length !== prev.length);
          const merged = pruned.map((c) => {
            const match = apiDiamonds.find((a) => String(a.id) === String(c.id));
            if (match) {
              changed = true;
              return {
                ...match,
                ...c,
                videoUrl: c.videoUrl || match.videoUrl || '',
                video: c.video || match.video || '',
                imageUrl: c.imageUrl || match.imageUrl || '',
                image: c.image || match.image || '',
                images: (c.images && c.images.length > 0) ? c.images : match.images,
                videoPoster: c.videoPoster || match.videoPoster || '',
              };
            }
            return c;
          });
          if (changed) {
            saveToIndexedDB(merged);
            try {
              localStorage.setItem('gk_custom_diamonds', JSON.stringify(merged));
            } catch { /* ignore */ }
          }
          return merged;
        });
        try {
          localStorage.setItem('gk_cached_db_diamonds', JSON.stringify(apiDiamonds));
        } catch {
          try {
            // First try stripping only embedded data-URI videos, preserving images!
            const noHeavyVideos = apiDiamonds.map((d) => ({
              ...d,
              videoUrl: (d.videoUrl && d.videoUrl.startsWith('data:')) ? '' : d.videoUrl,
              video: (d.video && d.video.startsWith('data:')) ? '' : d.video,
            }));
            localStorage.setItem('gk_cached_db_diamonds', JSON.stringify(noHeavyVideos));
          } catch {
            try {
              const lightweight = apiDiamonds.map((d) => ({
                ...d,
                imageUrl: (d.imageUrl && d.imageUrl.length > 500000) ? '' : d.imageUrl,
                image: (d.image && d.image.length > 500000) ? '' : d.image,
                images: Array.isArray(d.images) ? d.images.filter(img => !img || img.length <= 500000) : [],
                videoUrl: '',
                video: '',
                videoPoster: '',
              }));
              localStorage.setItem('gk_cached_db_diamonds', JSON.stringify(lightweight));
            } catch { /* ignore cached DB write failures */ }
          }
        }
        return apiDiamonds;
      }
    } catch { /* Swallow and fallback to IndexedDB/localStorage below */ }

    return null;
  };

  const broadcastSync = () => {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          const ch = new BroadcastChannel('gk_diamonds_sync');
          ch.postMessage({ type: 'SYNC_DIAMONDS', ts: Date.now() });
          ch.close();
        }
      } catch { /* ignore */ }
      try {
        localStorage.setItem('gk_diamonds_sync_event', String(Date.now()));
      } catch { /* ignore */ }
    }
  };

  // Rehydrate from PostgreSQL backend API / IndexedDB & setup cross-tab synchronization
  useEffect(() => {
    // 1. Immediately load any custom diamonds from IndexedDB and merge images & videos
    loadFromIndexedDB().then((idbDiamonds) => {
      if (idbDiamonds && idbDiamonds.length > 0) {
        const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
        const validIds = new Set((fallbackDiamondsData || []).map((d) => String(d.id)));
        const validIdb = isTest ? idbDiamonds : idbDiamonds.filter((d) => validIds.has(String(d.id)));
        if (!isTest && validIdb.length !== idbDiamonds.length) {
          saveToIndexedDB(validIdb);
        }
        setCustomDiamonds((prev) => {
          if (prev.length === 0) return validIdb;
          return prev.map((d) => {
            const match = validIdb.find((c) => String(c.id) === String(d.id));
            if (match) {
              return {
                ...d,
                imageUrl: (!d.imageUrl || d.imageUrl.trim().length === 0) ? (match.imageUrl || d.imageUrl) : d.imageUrl,
                image: (!d.image || d.image.trim().length === 0) ? (match.image || d.image) : d.image,
                images: (!d.images || d.images.length === 0) ? (match.images || d.images) : d.images,
                videoUrl: (!d.videoUrl || d.videoUrl.trim().length === 0) ? (match.videoUrl || d.videoUrl) : d.videoUrl,
                video: (!d.video || d.video.trim().length === 0) ? (match.video || d.video) : d.video,
                videoPoster: (!d.videoPoster || d.videoPoster.trim().length === 0) ? (match.videoPoster || d.videoPoster) : d.videoPoster,
              };
            }
            return d;
          });
        });
      }
    });

    // 2. Immediately load cached DB diamonds with full media from IndexedDB and restore missing images & videos
    loadDbDiamondsFromIndexedDB().then((cachedDb) => {
      if (cachedDb && cachedDb.length > 0) {
        setDbDiamonds((prev) => {
          if (prev.length === 0) return cachedDb;
          return prev.map((d) => {
            const match = cachedDb.find((c) => String(c.id) === String(d.id));
            if (match) {
              return {
                ...d,
                imageUrl: (!d.imageUrl || d.imageUrl.trim().length === 0) ? (match.imageUrl || d.imageUrl) : d.imageUrl,
                image: (!d.image || d.image.trim().length === 0) ? (match.image || d.image) : d.image,
                images: (!d.images || d.images.length === 0) ? (match.images || d.images) : d.images,
                videoUrl: (!d.videoUrl || d.videoUrl.trim().length === 0) ? (match.videoUrl || d.videoUrl) : d.videoUrl,
                video: (!d.video || d.video.trim().length === 0) ? (match.video || d.video) : d.video,
                videoPoster: (!d.videoPoster || d.videoPoster.trim().length === 0) ? (match.videoPoster || d.videoPoster) : d.videoPoster,
              };
            }
            return d;
          });
        });
        setDbConnected(true);
      }
    });

    // 3. Fetch fresh catalog from API / fallback_diamonds.json
    refreshDiamondsFromPostgres();

    // 3. Setup real-time cross-tab synchronization
    if (typeof window !== 'undefined') {
      let channel = null;
      if ('BroadcastChannel' in window) {
        try {
          channel = new BroadcastChannel('gk_diamonds_sync');
          channel.onmessage = () => {
            refreshDiamondsFromPostgres();
            loadFromIndexedDB().then((idbDiamonds) => {
              if (idbDiamonds && idbDiamonds.length > 0) {
                setCustomDiamonds(idbDiamonds);
              }
            });
          };
        } catch { /* ignore */ }
      }

      const handleStorage = (e) => {
        if (e.key === 'gk_custom_diamonds' || e.key === 'gk_diamonds_sync_event') {
          refreshDiamondsFromPostgres();
          loadFromIndexedDB().then((idbDiamonds) => {
            if (idbDiamonds && idbDiamonds.length > 0) {
              setCustomDiamonds(idbDiamonds);
            }
          });
        }
      };

      window.addEventListener('storage', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
        if (channel) channel.close();
      };
    }
  }, []);

  const saveCustomDiamonds = (updatedList) => {
    setCustomDiamonds(updatedList);
    saveToIndexedDB(updatedList);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('gk_custom_diamonds', JSON.stringify(updatedList));
      } catch {
        // Quota exceeded: store lightweight metadata in localStorage while IndexedDB holds full rich items
        try {
          const noHeavyVideos = updatedList.map((d) => ({
            ...d,
            videoUrl: (d.videoUrl && d.videoUrl.startsWith('data:')) ? '' : d.videoUrl,
            video: (d.video && d.video.startsWith('data:')) ? '' : d.video,
          }));
          localStorage.setItem('gk_custom_diamonds', JSON.stringify(noHeavyVideos));
        } catch {
          try {
            const lightweight = updatedList.map((d) => ({
              ...d,
              imageUrl: (d.imageUrl && d.imageUrl.length > 500000) ? '' : d.imageUrl,
              image: (d.image && d.image.length > 500000) ? '' : d.image,
              images: Array.isArray(d.images) ? d.images.filter(img => !img || img.length <= 500000) : [],
              videoUrl: '',
              video: '',
              videoPoster: '',
            }));
            localStorage.setItem('gk_custom_diamonds', JSON.stringify(lightweight));
          } catch { /* ignore */ }
        }
      }
    }
  };

  const addCustomDiamond = async (diamond) => {
    const newItem = {
      id: diamond.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isCustomAdded: true,
      _isSessionAdded: true,
      createdAt: new Date().toISOString(),
      ...diamond,
    };
    const updated = [newItem, ...customDiamonds.filter((d) => String(d.id) !== String(newItem.id))];
    saveCustomDiamonds(updated);
    broadcastSync();

    // Sync with PostgreSQL / Fallback Database API
    try {
      const res = await createDiamondInApi(newItem);
      await refreshDiamondsFromPostgres();
      broadcastSync();
      return res || newItem;
    } catch {
      return newItem;
    }
  };

  const addCustomDiamonds = async (diamondsArray) => {
    const formattedArray = diamondsArray.map((diamond, idx) => {
      return {
        id: diamond.id || `custom-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        isCustomAdded: true,
        _isSessionAdded: true,
        createdAt: new Date().toISOString(),
        ...diamond,
      };
    });
    const ids = new Set(formattedArray.map((d) => String(d.id)));
    const updated = [...formattedArray, ...customDiamonds.filter((d) => !ids.has(String(d.id)))];
    saveCustomDiamonds(updated);
    broadcastSync();

    // Sync with PostgreSQL / Fallback Database API
    try {
      const res = await createBulkDiamondsInApi(formattedArray);
      await refreshDiamondsFromPostgres();
      broadcastSync();
      return res || formattedArray;
    } catch {
      return formattedArray;
    }
  };

  const removeCustomDiamond = async (id) => {
    const targetIdStr = String(id);
    const updated = customDiamonds.filter((item) => String(item.id) !== targetIdStr);
    saveCustomDiamonds(updated);
    setDbDiamonds((prev) => prev.filter((item) => String(item.id) !== targetIdStr));
    broadcastSync();

    // Sync with PostgreSQL / Fallback Database API
    try {
      await deleteDiamondInApi(id);
      await refreshDiamondsFromPostgres();
      broadcastSync();
    } catch { /* ignore */ }
  };

  // Unified delete helper: removes either a user-added custom diamond or a DB diamond
  const deleteDiamond = async (id) => {
    const targetIdStr = String(id);
    deleteFromIndexedDB(targetIdStr);

    // Immediately remove from customDiamonds state and local storage / indexedDB
    const updatedCustom = customDiamonds.filter((item) => String(item.id) !== targetIdStr);
    saveCustomDiamonds(updatedCustom);

    // Immediately remove from dbDiamonds state and update localStorage cache
    setDbDiamonds((prev) => {
      const filtered = prev.filter((item) => String(item.id) !== targetIdStr);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('gk_cached_db_diamonds', JSON.stringify(filtered));
        } catch { /* ignore cache write errors */ }
      }
      return filtered;
    });
    broadcastSync();

    // Sync deletion with PostgreSQL / Fallback Database API
    try {
      await deleteDiamondInApi(id);
      await refreshDiamondsFromPostgres();
      broadcastSync();
    } catch { /* ignore delete API failures */ }
  };

  // Unified update helper: updates a diamond in state, storage, and backend API
  const updateDiamond = async (updatedDiamond) => {
    if (!updatedDiamond || !updatedDiamond.id) return null;
    const targetIdStr = String(updatedDiamond.id);

    // 1. Immediately update in customDiamonds state and local storage / indexedDB
    setCustomDiamonds((prev) => {
      const exists = prev.some((item) => String(item.id) === targetIdStr);
      const next = exists
        ? prev.map((item) => (String(item.id) === targetIdStr ? { ...item, ...updatedDiamond } : item))
        : [{ ...updatedDiamond, isCustomAdded: true }, ...prev];
      saveCustomDiamonds(next);
      return next;
    });

    // 2. Immediately update in dbDiamonds state and local storage cache / indexedDB
    setDbDiamonds((prev) => {
      const exists = prev.some((item) => String(item.id) === targetIdStr);
      const next = exists
        ? prev.map((item) => (String(item.id) === targetIdStr ? { ...item, ...updatedDiamond } : item))
        : [{ ...updatedDiamond }, ...prev];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('gk_cached_db_diamonds', JSON.stringify(next));
        } catch { /* ignore cache write errors */ }
      }
      saveDbDiamondsToIndexedDB(next);
      return next;
    });

    broadcastSync();

    // 3. Sync update with PostgreSQL / Fallback Database API
    try {
      const res = await updateDiamondInApi(updatedDiamond.id, updatedDiamond);
      await refreshDiamondsFromPostgres();
      broadcastSync();
      return res || updatedDiamond;
    } catch {
      return updatedDiamond;
    }
  };

  const clearCustomDiamonds = () => {
    saveCustomDiamonds([]);
    broadcastSync();
  };

  const openAddProductModal = (tab = 'single') => {
    setActiveAddProductTab(tab);
    setIsAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  // Handle client-side URL routing via pushState/popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme mode effect: applies 'dark' or 'light' class to document.documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    const applyTheme = () => {
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        // System preference
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      root.classList.remove('dark', 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    };

    applyTheme();

    // Attach system preference listener if mode is 'system'
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = () => applyTheme();

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange);
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleMediaChange);
        return () => mediaQuery.removeListener(handleMediaChange);
      }
    }
  }, [themeMode]);

  // Theme color preset effect: applies data-theme-color attribute to document.documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme-color', themeColor || 'diamond-luxe');
  }, [themeColor]);

  const setThemeMode = (mode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('gk_trade_theme', mode);
    }
  };

  const setThemeColor = (color) => {
    setThemeColorState(color);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('gk_trade_theme_color', color);
    }
  };

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const openQuoteModal = (prefillData = null) => {
    if (prefillData) {
      setQuotePrefill({
        category: prefillData.category || 'Lab-grown',
        specs: prefillData.specs || '',
      });
    } else {
      setQuotePrefill({
        category: 'Lab-grown',
        specs: '',
      });
    }
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  // Strictly show uploaded/database and user-added diamonds. Remove static data products.
  const baseList = (dbConnected || dbDiamonds.length > 0) ? dbDiamonds : DEFAULT_UPLOADED_DIAMONDS;
  const diamonds = customDiamonds.length > 0
    ? [
        ...customDiamonds.map((c) => {
          const match = baseList.find((b) => String(b.id) === String(c.id));
          if (match) {
            return {
              ...match,
              ...c,
              videoUrl: c.videoUrl || match.videoUrl || '',
              video: c.video || match.video || '',
              imageUrl: c.imageUrl || match.imageUrl || '',
              image: c.image || match.image || '',
              images: (c.images && c.images.length > 0) ? c.images : match.images,
              videoPoster: c.videoPoster || match.videoPoster || '',
            };
          }
          return c;
        }),
        ...baseList.filter((d) => !customDiamonds.some((c) => String(c.id) === String(d.id)))
      ]
    : baseList;

  return (
    <ShopContext.Provider
      value={{
        SITE_CONFIG,
        SUPPLY_CAPABILITIES,
        PROCESS_STEPS,
        FAQ_ITEMS,
        CORE_FACTS,
        currentPath,
        navigate,
        themeMode,
        setThemeMode,
        themeColor,
        setThemeColor,
        isQuoteModalOpen,
        openQuoteModal,
        closeQuoteModal,
        quotePrefill,
        // PostgreSQL Database state & methods
        dbDiamonds,
        dbConnected,
        diamonds,
        refreshDiamondsFromPostgres,
        // Add Product & Custom Diamonds exports
        customDiamonds,
        addCustomDiamond,
        addCustomDiamonds,
        removeCustomDiamond,
        deleteDiamond,
        updateDiamond,
        clearCustomDiamonds,
        isAddProductModalOpen,
        openAddProductModal,
        closeAddProductModal,
        activeAddProductTab,
        setActiveAddProductTab,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext);
