import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import http from 'http';
function localApiFallbackPlugin() {
  const fallbackPath = path.resolve(__dirname, 'server/data/fallback_diamonds.json');
  const publicFallbackPath = path.resolve(__dirname, 'public/fallback_diamonds.json');
  const readFallback = () => {
    try {
      if (fs.existsSync(fallbackPath)) {
        return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      }
      if (fs.existsSync(publicFallbackPath)) {
        return JSON.parse(fs.readFileSync(publicFallbackPath, 'utf8'));
      }
    } catch (e) {
      console.error('[Vite API] Read error:', e);
    }
    return [];
  };
  const saveBase64MediaToFile = (dataUrl, folder, filenamePrefix) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return dataUrl;
    }
    try {
      const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!match) return dataUrl;
      const mime = match[1];
      const base64Data = match[2];
      let ext = 'bin';
      if (mime.includes('mp4')) ext = 'mp4';else if (mime.includes('webm')) ext = 'webm';else if (mime.includes('png')) ext = 'png';else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';else if (mime.includes('webp')) ext = 'webp';
      const dir = path.resolve(__dirname, 'public/assets/nivaan', folder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true
        });
      }
      const filename = `${filenamePrefix}.${ext}`;
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      return `/assets/nivaan/${folder}/${filename}`;
    } catch (e) {
      console.error(`[Vite API] Failed to save base64 media for ${filenamePrefix}:`, e);
      return dataUrl;
    }
  };
  const writeFallback = data => {
    try {
      fs.mkdirSync(path.dirname(fallbackPath), {
        recursive: true
      });
      fs.writeFileSync(fallbackPath, JSON.stringify(data, null, 2), 'utf8');
      if (fs.existsSync(path.dirname(publicFallbackPath))) {
        fs.writeFileSync(publicFallbackPath, JSON.stringify(data, null, 2), 'utf8');
      }
      return true;
    } catch (e) {
      console.error('[Vite API] Write error:', e);
      return false;
    }
  };
  let backendOnline = null;
  let lastCheck = 0;
  const isBackendAlive = () => {
    return new Promise(resolve => {
      const now = Date.now();
      if (backendOnline !== null && now - lastCheck < 2000) {
        return resolve(backendOnline);
      }
      lastCheck = now;
      const req = http.get('http://127.0.0.1:5000/api/health', {
        timeout: 300
      }, res => {
        backendOnline = res.statusCode === 200;
        resolve(backendOnline);
      });
      req.on('error', () => {
        backendOnline = false;
        resolve(false);
      });
      req.on('timeout', () => {
        req.destroy();
        backendOnline = false;
        resolve(false);
      });
    });
  };
  return {
    name: 'local-api-fallback',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }
        const alive = await isBackendAlive();
        if (alive) {
          return next();
        }
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'ok',
            database: {
              engine: 'PostgreSQL',
              status: 'fallback_mode'
            }
          }));
          return;
        }
        if (url.pathname === '/api/diamonds' && req.method === 'GET') {
          let diamonds = readFallback();
          const shape = url.searchParams.get('shape');
          const color = url.searchParams.get('color');
          const clarity = url.searchParams.get('clarity');
          const onlyTripleExcellent = url.searchParams.get('onlyTripleExcellent') === 'true';
          if (shape && shape !== 'All') {
            diamonds = diamonds.filter(d => (d.shape || '').toLowerCase() === shape.toLowerCase());
          }
          if (color && color !== 'All') {
            diamonds = diamonds.filter(d => d.color === color);
          }
          if (clarity && clarity !== 'All') {
            diamonds = diamonds.filter(d => d.clarity === clarity);
          }
          if (onlyTripleExcellent) {
            diamonds = diamonds.filter(d => d.isTripleExcellent);
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            count: diamonds.length,
            diamonds
          }));
          return;
        }
        if (url.pathname === '/api/diamonds' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const diamondData = JSON.parse(body || '{}');
              const diamondId = diamondData.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const resolvedVideoUrl = saveBase64MediaToFile(diamondData.videoUrl || diamondData.video, 'videos', diamondId);
              const resolvedImageUrl = saveBase64MediaToFile(diamondData.imageUrl || diamondData.image, 'images', diamondId);
              const rawImages = Array.isArray(diamondData.images) && diamondData.images.length > 0 ? diamondData.images : [diamondData.imageUrl || diamondData.image].filter(Boolean);
              const resolvedImages = rawImages.map((img, idx) => {
                if (img === (diamondData.imageUrl || diamondData.image) && resolvedImageUrl) return resolvedImageUrl;
                return saveBase64MediaToFile(img, 'images', `${diamondId}-${idx}`);
              });
              const rawPoster = diamondData.videoPoster;
              const resolvedVideoPoster = !rawPoster || rawPoster === (diamondData.imageUrl || diamondData.image) ? resolvedImageUrl : saveBase64MediaToFile(rawPoster, 'images', `${diamondId}-poster`) || resolvedImageUrl;
              const newItem = {
                id: diamondId,
                originalId: diamondData.originalId || diamondData.id || '',
                handle: diamondData.handle || '',
                title: diamondData.title || 'Certified Lab-Grown Diamond',
                category: diamondData.category || 'diamond',
                productType: diamondData.productType || 'diamond',
                naturalOrLab: diamondData.naturalOrLab || 'Lab-grown',
                shape: diamondData.shape || 'Round Brilliant',
                carat: diamondData.carat || `${parseFloat(diamondData.caratValue || 1.0).toFixed(2)} Ct`,
                caratValue: parseFloat(diamondData.caratValue) || 1.0,
                color: diamondData.color || 'D',
                colorTier: diamondData.colorTier || 'Near Colorless',
                clarity: diamondData.clarity || 'VVS1',
                clarityTier: diamondData.clarityTier || 'Very Very Slightly Included',
                cut: diamondData.cut || 'Ideal',
                cert: diamondData.cert || 'IGI Certified',
                certNumber: diamondData.certNumber || `LG${Math.floor(100000000 + Math.random() * 900000000)}`,
                certUrl: diamondData.certUrl || 'https://www.igi.org',
                dimensions: diamondData.dimensions || '10.00 x 7.50 x 4.50 mm',
                depth: diamondData.depth || '62.0%',
                tablePct: diamondData.table || diamondData.tablePct || '57.0%',
                polish: diamondData.polish || 'Excellent',
                symmetry: diamondData.symmetry || 'Excellent',
                fluorescence: diamondData.fluorescence || 'None',
                ratio: diamondData.ratio || '1.00',
                price: diamondData.price || `$${parseFloat(diamondData.priceValue || 1000).toLocaleString('en-US')}`,
                priceValue: parseFloat(diamondData.priceValue) || 1000.0,
                isTripleExcellent: Boolean(diamondData.isTripleExcellent !== false),
                imageUrl: resolvedImageUrl,
                image: resolvedImageUrl,
                images: resolvedImages.length > 0 ? resolvedImages : [resolvedImageUrl].filter(Boolean),
                videoUrl: resolvedVideoUrl,
                video: resolvedVideoUrl,
                videoPoster: resolvedVideoPoster,
                isCustomAdded: true,
                createdAt: new Date().toISOString()
              };
              const current = readFallback();
              const updated = [newItem, ...current.filter(d => String(d.id) !== String(newItem.id))];
              writeFallback(updated);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                message: 'Diamond saved to fallback storage',
                diamond: newItem
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                error: err.message
              }));
            }
          });
          return;
        }
        if (url.pathname === '/api/diamonds/bulk' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const {
                diamonds
              } = JSON.parse(body || '{}');
              if (!Array.isArray(diamonds) || diamonds.length === 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                  success: false,
                  error: 'Empty diamonds array'
                }));
                return;
              }
              const current = readFallback();
              const formattedList = diamonds.map((d, idx) => {
                const diamondId = d.id || `custom-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`;
                const resolvedVideoUrl = saveBase64MediaToFile(d.videoUrl || d.video, 'videos', diamondId);
                const resolvedImageUrl = saveBase64MediaToFile(d.imageUrl || d.image, 'images', diamondId);
                const rawImages = Array.isArray(d.images) ? d.images : [d.imageUrl || d.image].filter(Boolean);
                const resolvedImages = rawImages.map((img, imgIdx) => saveBase64MediaToFile(img, 'images', `${diamondId}-${imgIdx}`));
                const resolvedVideoPoster = saveBase64MediaToFile(d.videoPoster || d.imageUrl, 'images', `${diamondId}-poster`) || resolvedImageUrl;
                return {
                  ...d,
                  id: diamondId,
                  imageUrl: resolvedImageUrl,
                  image: resolvedImageUrl,
                  images: resolvedImages.length > 0 ? resolvedImages : [resolvedImageUrl].filter(Boolean),
                  videoUrl: resolvedVideoUrl,
                  video: resolvedVideoUrl,
                  videoPoster: resolvedVideoPoster,
                  isCustomAdded: true,
                  createdAt: new Date().toISOString()
                };
              });
              const ids = new Set(formattedList.map(d => String(d.id)));
              const updated = [...formattedList, ...current.filter(d => !ids.has(String(d.id)))];
              writeFallback(updated);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({
                success: true,
                count: formattedList.length,
                diamonds: formattedList
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                error: err.message
              }));
            }
          });
          return;
        }
        if (url.pathname.startsWith('/api/diamonds/') && (req.method === 'PUT' || req.method === 'PATCH')) {
          const id = url.pathname.replace('/api/diamonds/', '');
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const diamondData = JSON.parse(body || '{}');
              const resolvedVideoUrl = saveBase64MediaToFile(diamondData.videoUrl || diamondData.video, 'videos', id);
              const resolvedImageUrl = saveBase64MediaToFile(diamondData.imageUrl || diamondData.image, 'images', id);
              const rawImages = Array.isArray(diamondData.images) ? diamondData.images : [resolvedImageUrl || diamondData.imageUrl || diamondData.image].filter(Boolean);
              const resolvedImages = rawImages.map((img, idx) => saveBase64MediaToFile(img, 'images', `${id}-${idx}`));
              const resolvedVideoPoster = saveBase64MediaToFile(diamondData.videoPoster || resolvedImageUrl, 'images', `${id}-poster`) || resolvedImageUrl;
              const current = readFallback();
              const existing = current.find(d => String(d.id) === String(id)) || {};
              const updatedItem = {
                ...existing,
                ...diamondData,
                id: String(id),
                imageUrl: resolvedImageUrl || existing.imageUrl || '',
                image: resolvedImageUrl || existing.image || '',
                images: resolvedImages.length > 0 ? resolvedImages : existing.images || [resolvedImageUrl].filter(Boolean),
                videoUrl: resolvedVideoUrl !== undefined ? resolvedVideoUrl : existing.videoUrl || '',
                video: resolvedVideoUrl !== undefined ? resolvedVideoUrl : existing.video || '',
                videoPoster: resolvedVideoPoster || existing.videoPoster || resolvedImageUrl,
                updatedAt: new Date().toISOString()
              };
              let updatedList = current.map(d => String(d.id) === String(id) ? updatedItem : d);
              if (!current.some(d => String(d.id) === String(id))) {
                updatedList = [updatedItem, ...current];
              }
              writeFallback(updatedList);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: `Diamond ${id} updated in fallback storage`,
                diamond: updatedItem
              }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                error: err.message
              }));
            }
          });
          return;
        }
        if (url.pathname.startsWith('/api/diamonds/') && req.method === 'DELETE') {
          const id = url.pathname.replace('/api/diamonds/', '');
          const current = readFallback();
          const updated = current.filter(d => String(d.id) !== String(id));
          writeFallback(updated);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            message: `Diamond ${id} deleted from fallback storage`
          }));
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiFallbackPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/test/*.test.jsx'],
    testTimeout: 15000,
  },
});