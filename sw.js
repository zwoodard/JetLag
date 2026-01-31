/**
 * Service Worker for JetLag Planner
 * Minimal implementation - no caching for cost version
 * This enables PWA installation without aggressive caching
 */

const SW_VERSION = '1.0.0';

// Install event - just activate immediately
self.addEventListener('install', (event) => {
    console.log(`[SW v${SW_VERSION}] Installing...`);
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
    console.log(`[SW v${SW_VERSION}] Activating...`);
    // Take control of all pages immediately
    event.waitUntil(clients.claim());
});

// Fetch event - pass through to network (no caching)
self.addEventListener('fetch', (event) => {
    // Simply fetch from network - no caching strategy
    // This keeps the app always fresh while still enabling PWA installation
    event.respondWith(fetch(event.request));
});
