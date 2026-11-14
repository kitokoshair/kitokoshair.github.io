/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — page Galerie : filtres, recherche et visionneuse
   Les photos sont listées dans galerie-data.js, les prix viennent
   de services.js (un prix changé là-bas est mis à jour ici aussi).
   ───────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  const CFG = window.KITOKO_CONFIG;
  const CAT = window.KITOKO_SERVICES;
  const PHOTOS = window.KITOKO_GALLERY || [];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) n.append(kid);
    return n;
  };
  const euro = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
  // Recherche sans accents ni majuscules : « defrisage » trouve « Défrisage »
  const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const family = (id) => CAT.families.find((f) => f.id === id);
  const groupLabel = (id) => CAT.groups.find((g) => g.id === id)?.label || "";
  const minFamilyPrice = (f) => {
    const min = Math.min(...f.variants.map((v) => v[2]));
    const sizeExtra = f.sizes ? Math.min(...CAT.sizes.map((s) => s.extra)) : 0;
    return min + sizeExtra;
  };
  const optionsPrice = (ids = []) => ids.reduce((t, id) => t + (CAT.extras.find((x) => x.id === id)?.price || 0), 0);
  const priceText = (f, opts) => {
    if (!f) return "Sur demande";
    const single = f.variants.length === 1 && !f.sizes;
    return (single && f.variants[0][3] !== "from" ? "" : "dès ") + euro(minFamilyPrice(f) + optionsPrice(opts));
  };
  // Lien « Réserver » : prestation choisie + options déjà cochées (ex. version bohème)
  const bookUrl = (it) => it.fam
    ? `index.html?prestation=${encodeURIComponent(it.fam.id)}${it.options?.length ? `&options=${it.options.join(",")}` : ""}#reserver`
    : "index.html#reserver";

  /* ───────── Contact (pied de page) ───────── */
  const biz = CFG.business;
  const set = (sel, href, label) => { const a = $(sel); if (!a) return; if (href) { a.href = href; if (label) a.textContent = label; } else a.parentElement.remove(); };
  $$("[data-city]").forEach((n) => (n.textContent = biz.city));
  set("[data-instagram]", biz.instagram && `https://instagram.com/${biz.instagram}`, `Instagram @${biz.instagram}`);
  set("[data-whatsapp]", biz.whatsapp && `https://wa.me/${biz.whatsapp}`);
  set("[data-phone]", biz.phoneDisplay && `tel:+${biz.whatsapp || ""}`, biz.phoneDisplay);
  set("[data-email]", biz.email && `mailto:${biz.email}`, biz.email);

  /* ───────── Données enrichies ───────── */
  const items = PHOTOS.map((p, i) => {
    const f = family(p.family);
    return {
      ...p, index: i, fam: f,
      price: priceText(f, p.options),
      groupName: groupLabel(p.group),
      search: norm([p.title, p.keywords, f?.name, groupLabel(p.group)].join(" ")),
    };
  });

  /* ───────── Filtres ───────── */
  const state = { group: "all", q: "" };
  const filters = $("[data-filters]");
  const groupsWithPhotos = CAT.groups.filter((g) => items.some((it) => it.group === g.id));
  const makeFilter = (id, label, count) =>
    el("button", { class: "filter", type: "button", "data-group": id, "aria-pressed": String(state.group === id),
      onclick: () => { state.group = id; render(); } },
      el("span", { text: label }), el("small", { text: String(count) }));
  filters.append(
    makeFilter("all", "Tout", items.length),
    ...groupsWithPhotos.map((g) => makeFilter(g.id, g.id === "nails" ? "Ongles & pieds" : g.label, items.filter((it) => it.group === g.id).length))
  );

  const search = $("[data-search]");
  search.addEventListener("input", () => { state.q = norm(search.value.trim()); render(); });
  $("[data-search-clear]").addEventListener("click", () => { search.value = ""; state.q = ""; render(); search.focus(); });

  // Lien direct vers un filtre : galerie.html?filtre=locs ou ?q=knotless
  const params = new URLSearchParams(location.search);
  if (params.get("filtre") && groupsWithPhotos.some((g) => g.id === params.get("filtre"))) state.group = params.get("filtre");
  if (params.get("q")) { search.value = params.get("q"); state.q = norm(params.get("q")); }

  /* ───────── Grille ───────── */
  const grid = $("[data-grid]");
  const count = $("[data-count]");
  const empty = $("[data-empty]");
  let visible = [];

  function card(it) {
    const book = bookUrl(it);
    return el("li", { class: "shot" },
      el("button", { class: "shot__open", type: "button", "aria-label": `Agrandir la photo : ${it.title}`, onclick: () => openViewer(it.index) },
        el("img", { src: `assets/galerie/${it.id}-s.webp?v=${window.KITOKO_GALLERY_VERSION || 1}`, alt: it.title, width: it.w, height: it.h, loading: "lazy", decoding: "async" })
      ),
      el("div", { class: "shot__body" },
        el("p", { class: "shot__cat", text: it.groupName }),
        el("h2", { class: "shot__title", text: it.title }),
        el("div", { class: "shot__foot" },
          el("span", { class: "shot__price", text: it.price }),
          el("a", { class: "shot__book", href: book, text: "Réserver" })
        )
      )
    );
  }

  function render() {
    $$("[data-group]", filters).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.group === state.group)));
    $("[data-search-clear]").hidden = !state.q;
    const words = state.q.split(/\s+/).filter(Boolean);
    visible = items.filter((it) =>
      (state.group === "all" || it.group === state.group) && words.every((w) => it.search.includes(w)));
    grid.replaceChildren(...visible.map(card));
    count.textContent = visible.length === 1 ? "1 photo" : `${visible.length} photos`;
    empty.hidden = visible.length > 0;
    // Garder le lien partageable
    const u = new URL(location.href);
    state.group === "all" ? u.searchParams.delete("filtre") : u.searchParams.set("filtre", state.group);
    state.q ? u.searchParams.set("q", search.value.trim()) : u.searchParams.delete("q");
    history.replaceState(null, "", u);
  }

  /* ───────── Visionneuse ───────── */
  const dlg = $("[data-viewer]");
  let current = 0;
  function show(i) {
    const list = visible.length ? visible : items;
    const pos = (list.findIndex((it) => it.index === i) + list.length) % list.length;
    const it = list[pos]; current = it.index;
    const img = $("[data-viewer-img]", dlg);
    img.src = `assets/galerie/${it.id}.webp?v=${window.KITOKO_GALLERY_VERSION || 1}`; img.alt = it.title;
    $("[data-viewer-title]", dlg).textContent = it.title;
    $("[data-viewer-meta]", dlg).textContent = `${it.groupName} · ${it.price}`;
    $("[data-viewer-book]", dlg).href = bookUrl(it);
    $("[data-viewer-pos]", dlg).textContent = `${pos + 1} / ${list.length}`;
    // Précharger la suivante
    const next = list[(pos + 1) % list.length]; if (next) new Image().src = `assets/galerie/${next.id}.webp?v=${window.KITOKO_GALLERY_VERSION || 1}`;
  }
  const step = (d) => {
    const list = visible.length ? visible : items;
    const pos = list.findIndex((it) => it.index === current);
    show(list[(pos + d + list.length) % list.length].index);
  };
  function openViewer(i) { show(i); dlg.showModal(); }
  $("[data-viewer-prev]", dlg).addEventListener("click", () => step(-1));
  $("[data-viewer-next]", dlg).addEventListener("click", () => step(1));
  $("[data-viewer-close]", dlg).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // Balayage sur téléphone
  let x0 = null;
  dlg.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });

  render();
})();
