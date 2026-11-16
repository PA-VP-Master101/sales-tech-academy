/* Sales Tech Academy : fonctionnement hors ligne.
   Pages : le réseau d'abord, la copie en cache si tu es hors ligne.
   Fichiers du site : le cache d'abord, mis à jour en arrière-plan. Polices Google et bibliothèque des comptes : gardées en cache.
   config.js (réglages des comptes) : le réseau d'abord. */
const VERSION = "sta-v5";
const LIBS = "sta-libs-v1";
const FONTS = "sta-fonts-v1";
const CORE = ["./", "index.html", "config.js", "logo.svg", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== FONTS && k !== LIBS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("index.html", copy)); }
          return res;
        })
        .catch(() => caches.match("index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Réglages des comptes : toujours la dernière version si le réseau répond
  if (url.origin === self.location.origin && url.pathname.endsWith("/config.js")) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Bibliothèque des comptes (version figée) : gardée en cache pour le hors-ligne
  if (url.hostname === "cdn.jsdelivr.net" && url.pathname.startsWith("/npm/@supabase/supabase-js@")) {
    e.respondWith(
      caches.open(LIBS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) c.put(req, res.clone());
        return res;
      })))
    );
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(FONTS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") c.put(req, res.clone());
        return res;
      })))
    );
  }
});
