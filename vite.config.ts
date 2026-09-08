import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
import { processAIGatewaySearch, classifyContentPost } from './server/aiGateway';
import {
  getAllAds,
  saveAd,
  getAllContent,
  saveContent,
  updateContentLikes,
  addContentComment,
  sendContentGift,
  getAllMarketItems,
  saveMarketItem,
  getAllPages,
  savePage,
  getUserProfile,
  getTransactions,
  createPaymentDeposit,
} from './server/db';

dotenv.config();

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        const sendJson = (data: any, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        };

        const readBody = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                reject(e);
              }
            });
          });
        };

        try {
          // --- Ads ---
          if (url.pathname === '/api/ads' && req.method === 'GET') {
            return sendJson({ ads: getAllAds() });
          }
          if (url.pathname === '/api/ads' && req.method === 'POST') {
            const data = await readBody();
            const saved = saveAd(data);
            return sendJson({ success: true, ad: saved });
          }

          // --- Content Posts ---
          if (url.pathname === '/api/content' && req.method === 'GET') {
            return sendJson({ content: getAllContent() });
          }
          if (url.pathname === '/api/content' && req.method === 'POST') {
            const data = await readBody();
            const saved = saveContent(data);
            return sendJson({ success: true, post: saved });
          }
          if (url.pathname.match(/^\/api\/content\/([^/]+)\/like$/) && req.method === 'POST') {
            const match = url.pathname.match(/^\/api\/content\/([^/]+)\/like$/);
            const id = match ? match[1] : '';
            const data = await readBody();
            const updated = updateContentLikes(id, data.delta || 1);
            return sendJson({ success: true, post: updated });
          }
          if (url.pathname.match(/^\/api\/content\/([^/]+)\/comment$/) && req.method === 'POST') {
            const match = url.pathname.match(/^\/api\/content\/([^/]+)\/comment$/);
            const id = match ? match[1] : '';
            const data = await readBody();
            const updated = addContentComment(id, data);
            return sendJson({ success: true, post: updated });
          }
          if (url.pathname.match(/^\/api\/content\/([^/]+)\/gift$/) && req.method === 'POST') {
            const match = url.pathname.match(/^\/api\/content\/([^/]+)\/gift$/);
            const id = match ? match[1] : '';
            const data = await readBody();
            const resData = sendContentGift(id, data.coins || 10, data.icon || '⭐', data.name || 'نجمة');
            return sendJson(resData);
          }

          // --- Market Items ---
          if (url.pathname === '/api/market' && req.method === 'GET') {
            return sendJson({ items: getAllMarketItems() });
          }
          if (url.pathname === '/api/market' && req.method === 'POST') {
            const data = await readBody();
            const saved = saveMarketItem(data);
            return sendJson({ success: true, item: saved });
          }

          // --- Pages ---
          if (url.pathname === '/api/pages' && req.method === 'GET') {
            return sendJson({ pages: getAllPages() });
          }
          if (url.pathname === '/api/pages' && req.method === 'POST') {
            const data = await readBody();
            const saved = savePage(data);
            return sendJson({ success: true, page: saved });
          }

          // --- User Profile ---
          if (url.pathname === '/api/profile' && req.method === 'GET') {
            return sendJson({ profile: getUserProfile() });
          }

          // --- AI Gateway Search ---
          if ((url.pathname === '/api/search' || url.pathname === '/api/ai-gateway/search') && req.method === 'POST') {
            const data = await readBody();
            const query = data.query || '';
            const userLocation = data.userLocation || { city: 'مادبا', district: 'وسط البلد', lat: 31.7197, lng: 35.7941, displayName: 'مادبا' };
            const allContent = getAllContent();
            const allMarket = getAllMarketItems();
            const allAds = getAllAds();
            const allPages = getAllPages();
            const searchResult = await processAIGatewaySearch(query, userLocation, allContent, allMarket, allAds, allPages);
            return sendJson(searchResult);
          }

          // --- AI Gateway Content Classifier ---
          if (url.pathname === '/api/ai-gateway/classify' && req.method === 'POST') {
            const data = await readBody();
            const classification = await classifyContentPost(data.title || '', data.description || '', data.category || '');
            return sendJson(classification);
          }

          // --- Payment & Deposit Architecture (Foundational) ---
          if (url.pathname === '/api/payment/transactions' && req.method === 'GET') {
            return sendJson({ transactions: getTransactions() });
          }
          if (url.pathname === '/api/payment/deposit' && req.method === 'POST') {
            const data = await readBody();
            const tx = createPaymentDeposit(data);
            return sendJson({ success: true, transaction: tx });
          }

        } catch (err: any) {
          return sendJson({ error: err.message || 'Server error' }, 500);
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
