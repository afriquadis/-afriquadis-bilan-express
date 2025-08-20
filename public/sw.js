// Service Worker vide pour éviter les erreurs 404
// Ce fichier sera remplacé par un vrai service worker si nécessaire

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Ne pas intercepter les requêtes pour le moment
  return;
});
