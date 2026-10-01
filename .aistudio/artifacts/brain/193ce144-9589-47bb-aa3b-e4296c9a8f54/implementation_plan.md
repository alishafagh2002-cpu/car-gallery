# NOIR MOTORS — Luxury Persian Automotive Marketplace

A production-grade, full-stack automotive marketplace for Iran's luxury vehicle sector, specializing in Free Trade Zone (مناطق آزاد) and Temporary-Import (گذر موقت) hypercars and prestige vehicles. Combines Bugatti-grade cinematic storytelling with rigorous vehicle cataloging, an authentic multi-step purchase workflow, and an integrated Admin CMS.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Clarifying questions were presented in Phase 1 and proceeded with recommended defaults:
> - **Interactive Vehicle Showcase**: Dual-mode vehicle presentation featuring an interactive studio 360° multi-angle rotational viewer accompanied by a Three.js WebGL lighting and reflection stage.
> - **Currency & Pricing Representation**: Primary display in Billion Tomans (میلیارد تومان / همت) with a real-time conversion toggle for USD ($) and UAE Dirham (AED), aligning with Tehran, Dubai, and Free Trade Zone customs conventions.
> - **Data Persistence & Backend**: Express API server coupled with structured relational storage and strict schema typing matching Prisma conventions, supporting full search, filtering, request auditing, and admin operations.

---

## 1. Overview & Core Concept

- **What It Does**: NOIR MOTORS provides an ultra-luxury digital showroom and verified marketplace for acquiring, viewing, and ordering prestigious vehicles in Iran. It caters specifically to specialized import classifications:
  1. **Free Trade Zones (مناطق آزاد)**: Kish, Qeshm, Arvand, Anzali, Chabahar, and Maku.
  2. **Temporary Import (گذر موقت)**: 3-month to 6-month extendable customs licenses with full document verification.
  3. **National Imported & Luxury Sports**: Documented, cleared high-end vehicles.
- **Target Audience**: Discerning Iranian luxury automotive collectors, high-net-worth buyers in free zones, automotive enthusiasts, and certified luxury auto showrooms/dealers.
- **Key Value**: Replaces chaotic, low-trust social media listings with editorial-grade vehicle dossiers, transparent document/license status tracking, seamless test-drive and viewing appointments, and a structured purchase request funnel.

---

## 2. User Experience & Visual Design

### Aesthetic Direction (Bugatti-Inspired Luxury)
- **Atmosphere**: Deep, cinematic obsidian environment (`#050505`, `#0B0B0B`, `#111111`) punctuated by restrained warm platinum (`#F2F0EA`) and brushed champagne gold accents (`#D4AF37` / `#C5A880`).
- **Zero-Pill Discipline**: Metadata (mileage, year, fuel, customs status, engine output) is rendered as clean unboxed typography with refined hairline separators (`·` or `/`), never clumsy colored pill badges or candy chips.
- **Typography & Persian RTL**:
  - Primary Persian UI & Display: Vazirmatn / Estedad typography with balanced tracking, optical weight compensation for dark mode, and zero orphan headline wrapping (`text-wrap: balance`).
  - Latin Technical & Model Names: High-character typographic pairings for technical stats (e.g. *Porsche 911 Carrera S*, *4.0L Twin-Turbo V8*, *720 HP* with tabular numerals `tabular-nums`).
- **Spatial Rhythm**:
  - Full-viewport (100vh) hero featuring dramatic vehicle lighting, subtle parallax drift, and animated typography:
    - *«خودرو، فراتر از یک انتخاب.»*
    - *«مجموعه‌ای منتخب از خودروهای مناطق آزاد و گذر موقت.»*
  - Asymmetric editorial layouts that celebrate vehicle proportions rather than cramming cards into generic classified grids.

### Key User Flows & Pages
1. **Cinematic Homepage (`/`)**:
   - Immersive hero with scroll-driven camera framing and interactive lighting.
   - Curated marquee spotlighting Free Zone & Temporary Import flagship vehicles.
   - Interactive Free Zone gateway (Kish, Arvand, Qeshm, Anzali, Chabahar, Maku).
   - "The Art of Acquisition" editorial section detailing customs compliance and verified paperwork.
2. **Vehicle Inventory (`/cars`)**:
   - Server-side multi-parameter filtering: Brand, Model, Year Range, Price Range, Location, Free Zone, Temporary-Import License Status, Mileage, Transmission, Fuel, Drive Type, Body Type.
   - Search bar with instant autocomplete and live count.
   - Editorial view toggle: Grid & Detailed Technical Dossier.
3. **Vehicle Detail Dossier (`/cars/[slug]`)**:
   - Fullscreen multi-angle gallery + 360° rotatable viewer.
   - Contiguous sticky purchase action module (Price, status, primary CTAs).
   - Document & License Transparency Module: Customs entry date, remaining license validity, plate region, ownership transfer terms.
   - Verified mechanical specs: Power, torque, 0-100 km/h, drive layout.
   - Direct CTAs: *"درخواست خرید"* (Purchase Request), *"رزرو بازدید حضوری"* (Viewing), *"درخواست تست درایو"* (Test Drive), *"افزودن به علاقه‌مندی‌ها"* (Favorite).
4. **Multi-Step Purchase Workflow (Modal / Drawer)**:
   - **Step 1: مشخصات خریدار** (Full Name, Phone Number, National ID / Passport, City).
   - **Step 2: تایید مشخصات خودرو** (Selected vehicle, VIN verification, price confirmation, preferred currency).
   - **Step 3: روش تماس و هماهنگی** (Phone call, WhatsApp, VIP private showroom meeting).
   - **Step 4: زمان‌بندی ملاقات و کارشناسی** (Preferred inspection date and time slot).
   - **Step 5: صدور کد رهگیری و پیش‌فاکتور** (Unique tracking ID, payment gateway abstraction layer, status tracking).
5. **Free Zone Hubs (`/locations/[slug]`)**:
   - Dedicated landing hubs for Kish, Qeshm, Arvand, Anzali, Chabahar, and Maku with customs regulations, local inventory count, and concierge contact.
6. **Admin CMS (`/admin`)**:
   - Executive metrics: Active inventory count, total asset valuation, pending purchase requests, scheduled viewings, regional distribution chart.
   - Full CRUD on vehicles: Add vehicle, edit pricing history, manage documents, toggle availability (Available / Reserved / Sold).
   - Inquiries & Requests desk: Review purchase requests, approve appointments, and export dossiers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture in Node/Express + React**:
  - *Chosen Approach*: An integrated Express API backend running alongside the React single-page app, providing real REST endpoints (`/api/cars`, `/api/purchase-requests`, `/api/admin/dashboard`, etc.) and serving client-side assets smoothly.
  - *Why*: Ensures rapid response times, zero build friction, instant client routing, and native support for server-side search indexing and validation.
- **Decision 2: Payment Provider Abstraction (`PaymentProvider` Interface)**:
  - *Chosen Approach*: Abstracted interface with an Iranian Gateway adapter (e.g. Shaparak / ZarinPal / Saman spec) and a Concierge Direct Wire adapter for luxury transactions.
  - *Why*: Luxury car purchases in Iran require staged deposits and offline bank transfers rather than immediate full credit card swipes; the abstraction provides clean integration hooks for real gateways without mock dead ends.
- **Decision 3: Zero-Broken-Image Media Layer**:
  - *Chosen Approach*: High-resolution curated vehicle assets generated via `generate_image` and bundled with responsive gradient fallbacks and SVG schematics.
  - *Why*: Prevents any external CDN failures or blocked image hosts, ensuring 100% reliable rendering in all environments.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NOIR MOTORS CLIENT (React 19)                   │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar (Logo · Navigation · Buy Concierge · Currency/Lang Toggle)   │
│  ┌───────────────────────┬──────────────────────┬────────────────────┐ │
│  │   Cinematic Hero      │  Inventory & Filters │  Vehicle Dossier   │ │
│  │ (Three.js/360 Canvas) │ (/cars Search/Sort)  │ (/cars/:slug)      │ │
│  └───────────────────────┴──────────────────────┴────────────────────┘ │
│  ┌───────────────────────┬──────────────────────┬────────────────────┐ │
│  │  Purchase Flow Modal  │ Free Zone Hubs (/loc)│  Admin CMS Portal  │ │
│  │ (5-Step Request/Track)│ (Kish, Arvand, etc.) │ (/admin Dashboard) │ │
│  └───────────────────────┴──────────────────────┴────────────────────┘ │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ REST API (/api/*)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND CONTROLLER LAYER                  │
├──────────────────────────────┬─────────────────────────────────────────┤
│  Cars Router (/api/cars)     │  Requests Router (/api/purchase-req)    │
│  - GET / (Filters/Search)    │  - POST / (Submit Request)              │
│  - GET /:id or /:slug        │  - GET / (Admin list & status audit)    │
│  - POST, PUT, DELETE (Admin) │  - PUT /:id (Update approval status)    │
├──────────────────────────────┼─────────────────────────────────────────┤
│  Locations & Brands Router   │  Admin Metrics Router                   │
│  - GET /api/locations        │  - GET /api/admin/dashboard             │
│  - GET /api/brands           │  - GET /api/admin/analytics             │
└──────────────────────────────┴─────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        RELATIONAL STORAGE LAYER                        │
├────────────────────────────────────────────────────────────────────────┤
│  - Vehicles (20+ Seeded Supercars: Porsche, AMG G63, Range Rover, etc.)│
│  - Brands, Models, Trims, Specifications, PriceHistory                 │
│  - FreeZones & Locations (Kish, Arvand, Qeshm, Anzali, Chabahar, Maku) │
│  - PurchaseRequests, ViewingRequests, Inquiries, AdminAuditLog         │
│  - PaymentProvider Interface (Iranian Gateway & Luxury Escrow Stubs)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Schema (Prisma Equivalent)
1. **Vehicle**: `id`, `slug`, `brandId`, `modelId`, `trim`, `year`, `priceToman`, `priceUsd`, `mileage`, `fuelType`, `transmission`, `engine`, `enginePower`, `bodyType`, `driveType`, `exteriorColor`, `interiorColor`, `locationId`, `freeZoneId`, `temporaryImport`, `licenseStatus`, `licenseExpiry`, `documentStatus`, `availabilityStatus`, `featured`, `descriptionFa`, `images`, `specs360`, `createdAt`, `updatedAt`.
2. **Brand & Model**: Brand name, logo, country of origin, model list.
3. **Location & FreeZone**: Region name, Persian title, customs code, tax incentive description, image asset.
4. **PurchaseRequest**: `id`, `trackingCode`, `vehicleId`, `fullName`, `phone`, `nationalId`, `contactMethod`, `preferredAppointmentDate`, `paymentPreference`, `status` (PENDING, UNDER_REVIEW, APPOINTMENT_SET, COMPLETED, CANCELLED), `createdAt`.
5. **PriceHistory**: `id`, `vehicleId`, `oldPriceToman`, `newPriceToman`, `changeDate`, `reason`.

### 20 Seeded Luxury Vehicles
- Porsche 911 Carrera S, Mercedes-AMG G63, Range Rover Autobiography, Lexus LX600, Toyota Land Cruiser 300, BMW M4 Competition, BMW X6 M, Mercedes-AMG GT, Cadillac Escalade, Chevrolet Tahoe RST, Ford Bronco Wildtrak, Toyota Supra MK5, Nissan Patrol Nismo, Lexus GX550, Mercedes-Benz S580, Porsche Cayenne Turbo GT, Audi RS6 Avant, Land Rover Defender 110 V8, Toyota GR Supra Manual, Mercedes-Maybach GLS600.

---

## 5. Execution Steps After Approval

1. **Asset Generation Batch**: Call `generate_image` in one single parallel batch for high-impact hero vehicle banners and editorial showcases.
2. **Backend Services & Persistence**: Implement the typed repository, Express REST server, API routes, data validation, and 20 seeded vehicle dossiers with full Iranian Free Zone / Temporary Import data.
3. **Design System & Typography**: Configure Vazirmatn Persian typography, RTL layout rules, luxury dark color tokens, and navigation contract.
4. **Cinematic Hero & 3D/360 Experience**: Implement the Bugatti-inspired hero with scroll-driven framing, interactive 360 viewer, and vehicle motion.
5. **Inventory & Dynamic Filters**: Build the `/cars` marketplace view with instant server-side search, brand filtering, Free Zone badges, and responsive sorting.
6. **Vehicle Detail Dossier**: Build `/cars/[slug]` with technical specs sheet, customs paperwork transparency, 360 viewer, and interactive gallery.
7. **Purchase Request Funnel**: Implement the 5-step modal workflow with validation, tracking code generation, and payment provider abstraction.
8. **Admin CMS & Analytics**: Build `/admin` dashboard with inventory management, request status controls, and financial metrics.
9. **Free Zone Hubs & Editorial Pages**: Implement `/locations/*`, `/about`, `/contact`, and verify seamless routing and responsive performance.
10. **Build & Compilation Verification**: Run `compile_applet` and verify zero errors.
