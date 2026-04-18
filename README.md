# 📍 Branch Locator App (React + Mapbox/Google Maps + Redux)

A React-based branch locator application that allows users to search for a location and view nearby BDO branches on an interactive Mapbox map with clustering, distance filtering, and cached API responses.

---

## 🚀 Features

- 🔍 Location search with Google Geocoding API
- 🗺️ Interactive Mapbox/Google map integration
- 📍 Red marker for searched location
- 🔵 Blue markers for branches
- 📊 Marker clustering for performance
- 📏 Distance calculation using Haversine formula
- ⚡ Redux-based caching (avoids repeated API calls)
- 🧠 Cached BDO API data (3-hour TTL)
- 🏦 Displays branch details (address, hours, distance)
- 📱 Responsive UI with branch info card

---

## 🧱 Tech Stack

- React (Vite)
- Redux Toolkit
- Mapbox GL JS/ Google Maps
- Axios
- Google Geocoding API

---

## 📦 Installation

```bash
git clone https://github.com/dineshadhinarayanan1010/locationsearch.git
cd branch-locator
npm install
node server.js
npm run dev