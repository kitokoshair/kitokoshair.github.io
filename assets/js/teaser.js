/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — aperçu de la galerie sur l'accueil
   3 photos tirées au hasard, qui changent une par une en fondu.
   Pause au survol, quand l'onglet est caché ou hors de l'écran ;
   aucun changement automatique si l'utilisatrice réduit les animations.
   ───────────────────────────────────────────────────────────── */
(() => {
  "use strict";
  const root = document.querySelector("[data-teaser]");
  const PHOTOS = window.KITOKO_GALLERY || [];
  const CAT = window.KITOKO_SERVICES;
  if (!root || PHOTOS.length < 3) { if (root) root.hidden = true; return; }

  const tiles = [...root.querySelectorAll("[data-teaser-tile]")];
  const groupLabel = (id) => (id === "nails" ? "Kitoko's Nail" : CAT?.groups.find((g) => g.id === id)?.label || "");
  const total = root.querySelector("[data-teaser-total]");
  if (total) total.textContent = `les ${PHOTOS.length} modèles`;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 3800; // une photo change toutes les 3,8 s

  // Pioche aléatoire : jamais une photo déjà affichée, et on évite de revoir les dernières
  const shown = new Array(tiles.length).fill(null);
  const recent = [];
  function pick(tileIndex) {
    const others = shown.filter((p, i) => p && i !== tileIndex);
    const busyGroups = new Set(others.map((p) => p.group));
    let pool = PHOTOS.filter((p) => !shown.includes(p) && !recent.includes(p));
    // Varier les prestations visibles en même temps quand c'est possible
    const varied = pool.filter((p) => !busyGroups.has(p.group));
    if (varied.length) pool = varied;
    if (!pool.length) pool = PHOTOS.filter((p) => !shown.includes(p));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function layer(p) {
    const src = `assets/galerie/${p.id}-s.webp`;
    const d = document.createElement("span");
    d.className = "teaser__layer";
    const bg = new Image(); bg.className = "teaser__bg"; bg.alt = ""; bg.src = src; bg.setAttribute("aria-hidden", "true");
    const img = new Image(); img.className = "teaser__img"; img.alt = p.title; img.src = src; img.decoding = "async";
    d.append(bg, img);
    return { el: d, ready: img.decode ? img.decode().catch(() => {}) : Promise.resolve() };
  }

  async function show(i, p, instant = false) {
    const tile = tiles[i];
    const { el, ready } = layer(p);
    tile.prepend(el);
    await ready;
    const cap = tile.querySelector(".teaser__cap");
    cap.classList.add("is-changing");
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-on")));
    setTimeout(() => {
      cap.querySelector("small").textContent = groupLabel(p.group);
      cap.querySelector("b").textContent = p.title;
      cap.classList.remove("is-changing");
      tile.href = `galerie.html?filtre=${encodeURIComponent(p.group)}`;
      tile.setAttribute("aria-label", `${p.title} : voir les photos « ${groupLabel(p.group)} » dans la galerie`);
    }, instant ? 0 : 450);
    // Retirer l'ancienne photo une fois le fondu terminé
    setTimeout(() => [...tile.querySelectorAll(".teaser__layer")].slice(1).forEach((n) => n.remove()), instant ? 50 : 1300);
    shown[i] = p;
    recent.push(p); if (recent.length > 9) recent.shift();
  }

  tiles.forEach((_, i) => show(i, pick(i), true));
  if (reduce) return;

  // Ordre de changement des tuiles mélangé à chaque tour : effet naturel, jamais mécanique
  let order = [], paused = false, visible = true;
  const nextTile = () => { if (!order.length) order = tiles.map((_, i) => i).sort(() => Math.random() - 0.5); return order.shift(); };
  root.addEventListener("mouseenter", () => (paused = true));
  root.addEventListener("mouseleave", () => (paused = false));
  root.addEventListener("focusin", () => (paused = true));
  root.addEventListener("focusout", () => (paused = false));
  if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);

  setInterval(() => {
    if (paused || !visible || document.hidden) return;
    const i = nextTile();
    show(i, pick(i));
  }, INTERVAL);
})();
