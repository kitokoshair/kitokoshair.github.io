/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — service worker (application installable)
   - Pages : réseau d'abord (toujours les derniers prix et créneaux),
     copie en cache en secours, page « hors connexion » sinon.
   - Fichiers du site (style, scripts, images) : servis depuis le cache
     puis mis à jour en arrière-plan.
   - Agenda, cartes, recherche d'adresse : jamais mis en cache.
   Changer VERSION à chaque mise à jour importante du site.
   ───────────────────────────────────────────────────────────── */
const VERSION = "kitoko-2026-11-16a";
const CORE = [
  "./", "index.html", "galerie.html", "offline.html", "manifest.webmanifest",
  "assets/css/style.css", "assets/js/config.js", "assets/js/services.js", "assets/js/app.js",
  "assets/js/galerie-data.js", "assets/js/galerie.js", "assets/js/teaser.js", "assets/js/pwa.js",
  "assets/fonts/figtree-latin-wght-normal.woff2", "assets/fonts/unbounded-latin-wght-normal.woff2",
  "assets/img/kitoko-logo.png", "assets/img/kitoko-mark.png", "assets/img/favicon.png", "assets/img/app-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // agenda Google, cartes, adresses : toujours en direct

  // Pages HTML : réseau d'abord
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await fetch(req, { cache: "no-cache" }); // toujours vérifier la dernière version
        const c = await caches.open(VERSION); c.put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req, { ignoreSearch: true })) ||
               (await caches.match("offline.html"));
      }
    })());
    return;
  }

  // Fichiers du site : la version exacte demandée (?v=…) depuis le cache, sinon le réseau.
  // Une ancienne version n'est utilisée qu'en dernier recours, hors connexion.
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const exact = await c.match(req);
    const network = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
    if (exact) return exact;
    return (await network) || (await c.match(req, { ignoreSearch: true })) || new Response("", { status: 504 });
  })());
});
