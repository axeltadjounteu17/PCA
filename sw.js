/* ==========================================================================
   PCA Prep — Service Worker (Cache & Mode Hors Ligne)
   Permet de réviser sans connexion Internet (train, avion, coupure réseau).
   ========================================================================== */

const CACHE_NAME = "pca-prep-cache-v2";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./cours.html",
  "./cas.html",
  "./cheatsheet.html",
  "./quiz.html",
  "./examen.html",
  "./vocabulaire.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/favicon.svg",
  "./assets/favicon.ico",
  "./assets/favicon-32.png",
  "./assets/apple-touch-icon.png",
  "./assets/icon-512.png",
  "./data/content.js",
  "./data/questions-d1.js",
  "./data/questions-d2.js",
  "./data/questions-d3.js",
  "./data/questions-d4.js",
  "./data/questions-d5.js",
  "./data/questions-d6.js",
  "./data/questions-d7.js",
  "./data/questions-d8.js",
  "./data/questions-cases.js"
];

// Installation : mise en cache initiale des assets locaux
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Interception : stratégie Cache-first avec fallback Réseau et mise à jour dynamique
self.addEventListener("fetch", function (event) {
  // Uniquement pour les requêtes HTTP/HTTPS GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        // Retourne le cache immédiatement, puis met à jour en arrière-plan si réseau dispo
        fetch(event.request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(function () {
          // Hors ligne : rien à faire, le cache a déjà répondu
        });
        return cachedResponse;
      }

      // Si pas en cache, effectue la requête réseau et met en cache
      return fetch(event.request).then(function (networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(function () {
        // Fallback si hors ligne et page HTML demandée
        if (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
