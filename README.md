# Central Appliance Repair - Client Interface

This directory contains the public-facing, client web application for Central Appliance Repair. It has been extensively engineered to provide a lightning-fast, highly aesthetic modern user experience optimized for conversion, internationalization, and seamless data transmission.

## 🚀 Key Features

### 1. Modern User Experience (UX/UI)
- **Glassmorphism Design:** A premium bento-box design aesthetic utilizing Tailwind CSS, featuring soft gradients, blurred backdrops, and subtle micro-animations.
- **Fully Responsive:** Flawless scaling from ultra-wide desktops down to mobile devices, ensuring zero layout shifts and a perfect mobile-first booking experience.
- **Skeleton Loading:** Implemented smooth loading states to prevent jarring layout jumps while Firebase connections establish.

### 2. Live Chat Integration
- **Real-Time Communication:** Direct integration with Firebase Firestore allows customers to chat with active dispatchers in real-time.
- **Status Badges:** The chat widget automatically tracks dispatcher availability and provides audio/visual cues precisely when an agent joins the session or replies.

### 3. Smart Booking & GPS Telemetry
- **Intelligent Intake:** The booking form requires essential data (Name, Urgency, Appliance Type) and executes validation prior to transmission.
- **Automated Geolocation:** A one-click `Locate Me` workflow securely queries the browser's HTML5 Geolocation API, reverse-geocodes the exact point using the OpenStreetMap Nominatim API to generate a readable address, and privately bundles the raw `latitude/longitude` coordinates into the Firestore payload for precise technician routing.
- **Email Fallback System:** If the database connection fails, the system safely falls back to formatting a pre-filled `mailto:` string to ensure zero lost leads.

### 4. Native Internationalization (i18n)
- **Bilingual Core:** The entire DOM is wrapped with `data-i18n` tags, controlled by a lightweight JavaScript localization engine.
- **Instant Toggle:** Users can flawlessly switch the entire website between English and French without requiring page reloads or relying on clunky third-party plugins.

### 5. SEO & Performance Optimizations
- **Semantic Structure:** Designed with rigorous HTML5 semantic outlines (nav, main, section, footer) and exactly one dynamic `<h1>` tag to adhere strictly to Google Lighthouse guidelines.
- **Asset Optimization:** Minimal blocking scripts and deferred asset loading, keeping the initial paint cycle incredibly rapid.

## 🛠 Technology Stack
- **Structure:** HTML5
- **Styling:** Tailwind CSS (via CDN for edge-caching)
- **Icons:** Lucide Icons
- **Backend/Database:** Google Firebase (Firestore)
- **Telemetrics:** HTML5 Geolocation API & Nominatim API

## 📋 Folder Structure
- `index.html` — The core single-page application and presentation layer.
- `style.css` — Custom utility classes (custom scrollbars, glassmorphism filters, loading skeletons).
- `script.js` — Client-side logic encompassing form validation, real-time Firestore listeners, i18n translation dictionaries, and geolocation workflows.