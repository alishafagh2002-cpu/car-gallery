import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SEED_VEHICLES } from './src/data/seedVehicles';
import { FREE_ZONES } from './src/data/locations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory persistent database for server lifecycle
  let dbVehicles = [...SEED_VEHICLES];
  let dbPurchaseRequests: any[] = [
    {
      id: 'pr-101',
      trackingCode: 'NOIR-74912',
      vehicleId: 'veh-001',
      vehicleHeadline: 'پورشه ۹۱۱ کاررا اس مدل ۲۰۲۴ فول پکیج اسپرت کرونو',
      priceToman: 19800000000,
      fullName: 'مهندس بردیا شایگان',
      phone: '09121112233',
      city: 'تهران / کیش',
      contactMethod: 'IN_PERSON',
      preferredAppointmentDate: '2026-10-04T10:00',
      preferredCurrency: 'TOMAN',
      status: 'UNDER_REVIEW',
      createdAt: '2026-09-30T14:30:00Z',
    },
    {
      id: 'pr-102',
      trackingCode: 'NOIR-83940',
      vehicleId: 'veh-002',
      vehicleHeadline: 'مرسدس آ‌ام‌گ جی۶۳ گذر موقت ۶ ماهه',
      priceToman: 32000000000,
      fullName: 'دکتر ارشیا خسروی',
      phone: '09128889900',
      city: 'تهران',
      contactMethod: 'PHONE_CALL',
      preferredCurrency: 'USD',
      status: 'PENDING',
      createdAt: '2026-10-01T08:15:00Z',
    },
  ];
  let dbViewingRequests: any[] = [];
  let dbFavorites: string[] = [];
  let dbInquiries: any[] = [];

  // ==================== REST API ENDPOINTS ====================

  // GET /api/cars
  app.get('/api/cars', (req, res) => {
    let result = [...dbVehicles];
    const { search, brand, freeZone, temporaryImport, bodyType, transmission, sort, page = '1', limit = '9' } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.brandNameEn.toLowerCase().includes(q) ||
          v.modelNameEn.toLowerCase().includes(q) ||
          v.headlineFa.toLowerCase().includes(q)
      );
    }

    if (brand && typeof brand === 'string' && brand !== 'ALL') {
      result = result.filter((v) => v.brandNameEn.toLowerCase() === brand.toLowerCase());
    }

    if (freeZone && typeof freeZone === 'string' && freeZone !== 'ALL') {
      result = result.filter((v) => v.freeZoneSlug === freeZone);
    }

    if (temporaryImport === 'true') {
      result = result.filter((v) => v.temporaryImport === true);
    }

    if (bodyType && typeof bodyType === 'string' && bodyType !== 'ALL') {
      result = result.filter((v) => v.bodyType === bodyType);
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'ALL') {
      result = result.filter((v) => v.transmission === transmission);
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.priceToman - b.priceToman);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.priceToman - a.priceToman);
    } else if (sort === 'year_desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (sort === 'mileage_asc') {
      result.sort((a, b) => a.mileage - b.mileage);
    }

    const p = parseInt(page as string, 10) || 1;
    const l = parseInt(limit as string, 10) || 9;
    const start = (p - 1) * l;
    const paginated = result.slice(start, start + l);

    res.json({
      vehicles: paginated,
      total: result.length,
      page: p,
      totalPages: Math.ceil(result.length / l) || 1,
    });
  });

  // GET /api/cars/:id (or slug)
  app.get('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const vehicle = dbVehicles.find((v) => v.id === id || v.slug === id);
    if (!vehicle) {
      res.status(404).json({ error: 'خودروی مورد نظر یافت نشد' });
      return;
    }
    res.json(vehicle);
  });

  // POST /api/cars
  app.post('/api/cars', (req, res) => {
    const newCar = {
      ...req.body,
      id: `veh-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbVehicles.unshift(newCar);
    res.status(201).json(newCar);
  });

  // PUT /api/cars/:id
  app.put('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const index = dbVehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }
    dbVehicles[index] = { ...dbVehicles[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(dbVehicles[index]);
  });

  // DELETE /api/cars/:id
  app.delete('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    dbVehicles = dbVehicles.filter((v) => v.id !== id);
    res.json({ success: true, message: 'Vehicle deleted' });
  });

  // GET /api/brands
  app.get('/api/brands', (_req, res) => {
    const brands = Array.from(new Set(dbVehicles.map((v) => v.brandNameEn))).map((brand) => ({
      brand,
      count: dbVehicles.filter((v) => v.brandNameEn === brand).length,
    }));
    res.json(brands);
  });

  // GET /api/models
  app.get('/api/models', (req, res) => {
    const { brand } = req.query;
    let list = dbVehicles;
    if (brand && typeof brand === 'string') {
      list = list.filter((v) => v.brandNameEn.toLowerCase() === brand.toLowerCase());
    }
    const models = Array.from(new Set(list.map((v) => v.modelNameEn)));
    res.json(models);
  });

  // GET /api/locations
  app.get('/api/locations', (_req, res) => {
    res.json(FREE_ZONES);
  });

  // Favorites
  app.post('/api/favorites', (req, res) => {
    const { vehicleId } = req.body;
    if (!dbFavorites.includes(vehicleId)) {
      dbFavorites.push(vehicleId);
    }
    res.json({ favorites: dbFavorites });
  });

  app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
    dbFavorites = dbFavorites.filter((f) => f !== id);
    res.json({ favorites: dbFavorites });
  });

  // Inquiries
  app.post('/api/inquiries', (req, res) => {
    const inquiry = { id: `inq-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
    dbInquiries.unshift(inquiry);
    res.status(201).json({ success: true, inquiry });
  });

  // Purchase Requests
  app.post('/api/purchase-requests', (req, res) => {
    const trackingCode = `NOIR-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRequest = {
      ...req.body,
      id: `pr-${Date.now()}`,
      trackingCode,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    dbPurchaseRequests.unshift(newRequest);
    res.status(201).json(newRequest);
  });

  app.get('/api/purchase-requests', (_req, res) => {
    res.json(dbPurchaseRequests);
  });

  app.put('/api/purchase-requests/:id', (req, res) => {
    const { id } = req.params;
    const index = dbPurchaseRequests.findIndex((r) => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }
    dbPurchaseRequests[index] = { ...dbPurchaseRequests[index], ...req.body };
    res.json(dbPurchaseRequests[index]);
  });

  // Viewing & Test Drive Requests
  app.post('/api/viewing-requests', (req, res) => {
    const trackingCode = `VIEW-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord = { ...req.body, id: `vr-${Date.now()}`, trackingCode, status: 'PENDING', createdAt: new Date().toISOString() };
    dbViewingRequests.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  app.post('/api/test-drive-requests', (req, res) => {
    const trackingCode = `DRIVE-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord = { ...req.body, id: `td-${Date.now()}`, trackingCode, status: 'PENDING', createdAt: new Date().toISOString() };
    dbViewingRequests.unshift(newRecord);
    res.status(201).json(newRecord);
  });

  // Admin Dashboard
  app.get('/api/admin/dashboard', (_req, res) => {
    const totalInventoryValueToman = dbVehicles.reduce((sum, v) => sum + v.priceToman, 0);
    res.json({
      totalVehicles: dbVehicles.length,
      availableVehicles: dbVehicles.filter((v) => v.availabilityStatus === 'AVAILABLE').length,
      soldVehicles: dbVehicles.filter((v) => v.availabilityStatus === 'SOLD').length,
      temporaryImportCount: dbVehicles.filter((v) => v.temporaryImport).length,
      totalInventoryValueToman,
      pendingPurchaseRequests: dbPurchaseRequests.filter((r) => r.status === 'PENDING').length,
      pendingViewingRequests: dbViewingRequests.filter((r) => r.status === 'PENDING').length,
      recentRequests: dbPurchaseRequests.slice(0, 5),
    });
  });

  // ==================== STATIC ASSETS & VITE MIDDLEWARE SETUP ====================
  // Serve static assets unconditionally so that images are always accessible in production
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));
  app.use('/src/assets', express.static(path.resolve(__dirname, 'dist/src/assets')));
  app.use('/images', express.static(path.resolve(__dirname, 'public/images')));
  app.use('/images', express.static(path.resolve(__dirname, 'dist/images')));
  app.use(express.static(path.resolve(__dirname, 'public')));

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`NOIR MOTORS Server listening on http://localhost:${PORT}`);
  });
}

startServer();
