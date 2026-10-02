import '@testing-library/jest-dom';
import { vi } from 'vitest';
import dotenv from 'dotenv';

dotenv.config();

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe(target) {
    // Trigger mock intersection event
    if (this.callback) {
      this.callback([
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: Date.now(),
        },
      ]);
    }
  }
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    if (this.callback) {
      this.callback([
        {
          target,
          contentRect: { width: 390, height: 844, top: 0, left: 0 },
        },
      ]);
    }
  }
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = MockResizeObserver;

// Mock matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    };
  };

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock indexedDB for jsdom environment
if (typeof window !== 'undefined' && !window.indexedDB) {
  const memoryStores = {};

  window.indexedDB = {
    open: () => {
      const request = {
        result: {
          objectStoreNames: {
            contains: (name) => !!memoryStores[name],
          },
          createObjectStore: (name) => {
            if (!memoryStores[name]) memoryStores[name] = new Map();
            return {};
          },
          transaction: (storeNames) => {
            const storeName = Array.isArray(storeNames) ? storeNames[0] : storeNames;
            if (!memoryStores[storeName]) memoryStores[storeName] = new Map();
            const store = memoryStores[storeName];
            const txObj = {
              objectStore: () => ({
                put: (val) => {
                  store.set(val.id, val);
                },
                clear: () => {
                  store.clear();
                },
                getAll: () => {
                  const req = { result: Array.from(store.values()) };
                  setTimeout(() => {
                    if (req.onsuccess) req.onsuccess({ target: req });
                  }, 0);
                  return req;
                },
              }),
              oncomplete: null,
              onerror: null,
            };
            setTimeout(() => {
              if (txObj.oncomplete) txObj.oncomplete();
            }, 0);
            return txObj;
          },
        },
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
      };

      setTimeout(() => {
        if (request.onupgradeneeded) {
          request.onupgradeneeded({ target: request });
        }
        if (request.onsuccess) {
          request.onsuccess({ target: request });
        }
      }, 0);

      return request;
    },
  };
}
