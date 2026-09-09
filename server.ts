import express from 'express';
import path from 'path';
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
  addPageItem,
  getUserProfile,
  getTransactions,
  createPaymentDeposit,
  getAllServiceProviders,
  saveServiceProvider,
  getAllServiceRequests,
  saveServiceRequest,
  addServiceProviderReview,
} from './server/db';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Ads
app.get('/api/ads', (_req, res) => {
  res.json({ ads: getAllAds() });
});

app.post('/api/ads', (req, res) => {
  try {
    const saved = saveAd(req.body);
    res.json({ success: true, ad: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Content
app.get('/api/content', (_req, res) => {
  res.json({ content: getAllContent() });
});

app.post('/api/content', (req, res) => {
  try {
    const saved = saveContent(req.body);
    res.json({ success: true, post: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/content/:id/like', (req, res) => {
  const updated = updateContentLikes(req.params.id, req.body.delta || 1);
  res.json({ success: true, post: updated });
});

app.post('/api/content/:id/comment', (req, res) => {
  const updated = addContentComment(req.params.id, req.body);
  res.json({ success: true, post: updated });
});

app.post('/api/content/:id/gift', (req, res) => {
  const result = sendContentGift(req.params.id, req.body.coins || 10, req.body.icon || '⭐', req.body.name || 'نجمة');
  res.json(result);
});

// Market
app.get('/api/market', (_req, res) => {
  res.json({ items: getAllMarketItems() });
});

app.post('/api/market', (req, res) => {
  try {
    const saved = saveMarketItem(req.body);
    res.json({ success: true, item: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Pages
app.get('/api/pages', (_req, res) => {
  res.json({ pages: getAllPages() });
});

app.post('/api/pages', (req, res) => {
  try {
    const saved = savePage(req.body);
    res.json({ success: true, page: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/pages/:id/items', (req, res) => {
  try {
    const updatedPage = addPageItem(req.params.id, req.body);
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    res.json({ success: true, page: updatedPage });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// User Profile
app.get('/api/profile', (_req, res) => {
  res.json({ profile: getUserProfile() });
});

// Services & Professions
app.get('/api/services', (_req, res) => {
  res.json({ services: getAllServiceProviders() });
});

app.post('/api/services', (req, res) => {
  try {
    const saved = saveServiceProvider(req.body);
    res.json({ success: true, service: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/service-requests', (_req, res) => {
  res.json({ requests: getAllServiceRequests() });
});

app.post('/api/service-requests', (req, res) => {
  try {
    const saved = saveServiceRequest(req.body);
    res.json({ success: true, request: saved });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/services/:id/reviews', (req, res) => {
  try {
    const updated = addServiceProviderReview(req.params.id, req.body);
    res.json({ success: true, provider: updated });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// AI Gateway
app.post(['/api/search', '/api/ai-gateway/search'], async (req, res) => {
  try {
    const { query, userLocation } = req.body;
    const allContent = getAllContent();
    const allMarket = getAllMarketItems();
    const allAds = getAllAds();
    const allPages = getAllPages();
    const allServices = getAllServiceProviders();
    const defaultLocation = { city: 'مادبا', district: 'وسط البلد', lat: 31.7197, lng: 35.7941, displayName: 'مادبا' };
    const result = await processAIGatewaySearch(
      query || '',
      userLocation || defaultLocation,
      allContent,
      allMarket,
      allAds,
      allPages,
      allServices
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai-gateway/classify', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const result = await classifyContentPost(title || '', description || '', category || '');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Payment & Deposit Architecture (Foundational)
app.get('/api/payment/transactions', (_req, res) => {
  res.json({ transactions: getTransactions() });
});

app.post('/api/payment/deposit', (req, res) => {
  try {
    const tx = createPaymentDeposit(req.body);
    res.json({ success: true, transaction: tx });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
