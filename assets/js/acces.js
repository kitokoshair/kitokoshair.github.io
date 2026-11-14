/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — onglet « Venir au salon »
   Carte et temps de trajet, 100 % gratuits :
   - carte : OpenStreetMap (bibliothèque Leaflet hébergée sur le site)
   - adresse → coordonnées : Nominatim (OpenStreetMap)
   - itinéraires à pied / en voiture : serveurs OSRM de FOSSGIS
   - tram / bus : lien vers Google Maps (calcul fait chez Google)
   L'adresse saisie sert uniquement au calcul et n'est jamais enregistrée.
   ───────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  // Point de rendez-vous affiché : l'arrêt de tram Lafayette (rue Gambetta).
  // L'adresse exacte de la coiffeuse n'est jamais publiée sur le site.
  const SALON = { lat: 48.00687, lon: 0.1901, label: "Arrêt Lafayette, rue Gambetta" };
  const LE_MANS_BOX = "0.05,48.10,0.35,47.90"; // pour privilégier les adresses du Mans

  const root = document.querySelector("[data-acces]");
  if (!root || !window.L) return;

  const $ = (s) => root.querySelector(s);
  const form = $("[data-acces-form]");
  const input = $("#acces-adresse");
  const status = $("[data-acces-status]");
  const result = $("[data-acces-result]");
  const summary = $("[data-acces-summary]");
  const modes = [...root.querySelectorAll("[data-mode]")];
  const transit = $("[data-acces-transit]");
  const locateBtn = $("[data-acces-locate]");
  const submitBtn = form.querySelector("button[type=submit]");

  let map, routeLayer, userMarker;
  let routes = {}; // { foot: {...}, car: {...} }
  let mode = "foot";

  const fmtTime = (s) => {
    const m = Math.max(1, Math.round(s / 60));
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60), r = m % 60;
    return r ? `${h} h ${String(r).padStart(2, "0")}` : `${h} h`;
  };
  const fmtDist = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

  /* ───────── Carte (chargée seulement quand la section devient visible) ───────── */
  function initMap() {
    if (map) return;
    map = L.map($("[data-acces-map]"), { scrollWheelZoom: false, zoomControl: true }).setView([SALON.lat, SALON.lon], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> · itinéraires <a href="https://routing.openstreetmap.de/about.html" rel="noopener">FOSSGIS / OSRM</a>',
    }).addTo(map);

    const salonIcon = L.divIcon({
      className: "map-pin map-pin--salon",
      html: '<span class="map-pin__disc"><img src="assets/img/kitoko-mark.png" alt="" width="32" height="40"></span>',
      iconSize: [52, 52], iconAnchor: [26, 26], popupAnchor: [0, -26],
    });
    L.marker([SALON.lat, SALON.lon], { icon: salonIcon, title: "KITOKO's HAIR", keyboard: true })
      .addTo(map)
      .bindPopup("<strong>KITOKO's HAIR</strong><br>À deux pas de l'arrêt Lafayette.<br>Adresse exacte envoyée à la confirmation.");
    // Petit cercle : la coiffeuse se trouve dans ce périmètre
    L.circle([SALON.lat, SALON.lon], { radius: 120, color: "#A62A7E", weight: 1.5, fillColor: "#FEAAF8", fillOpacity: 0.18 }).addTo(map);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { initMap(); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(root);
  } else initMap();

  /* ───────── Services gratuits ───────── */
  async function geocode(q) {
    const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
      q, format: "jsonv2", limit: "1", countrycodes: "fr", "accept-language": "fr", viewbox: LE_MANS_BOX,
    });
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("geocode");
    const data = await res.json();
    if (!data.length) return null;
    return { lat: Number(data[0].lat), lon: Number(data[0].lon), label: data[0].display_name };
  }

  async function route(profile, from) {
    const url = `https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${from.lon},${from.lat};${SALON.lon},${SALON.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("route");
    const data = await res.json();
    const r = data.routes && data.routes[0];
    if (!r) throw new Error("route");
    return { duration: r.duration, distance: r.distance, coords: r.geometry.coordinates.map(([x, y]) => [y, x]) };
  }

  /* ───────── Affichage ───────── */
  function setBusy(on, msg = "") {
    submitBtn.disabled = on; locateBtn.disabled = on;
    status.textContent = msg;
    root.classList.toggle("is-loading", on);
  }

  function draw() {
    if (!map) initMap();
    const r = routes[mode];
    if (routeLayer) routeLayer.remove();
    if (!r) return;
    routeLayer = L.layerGroup([
      L.polyline(r.coords, { color: "#FFFFFF", weight: 9, opacity: 0.9 }),
      L.polyline(r.coords, mode === "foot"
        ? { color: "#A62A7E", weight: 5, dashArray: "1 9", lineCap: "round" }
        : { color: "#24102B", weight: 5 }),
    ]).addTo(map);
    map.fitBounds(L.latLngBounds(r.coords), { padding: [40, 40] });
    modes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  }

  async function compute(from, label) {
    setBusy(true, "Calcul du trajet…");
    try {
      const [foot, car] = await Promise.allSettled([route("foot", from), route("car", from)]);
      routes = { foot: foot.value, car: car.value };
      if (!routes.foot && !routes.car) throw new Error("route");

      if (!map) initMap();
      if (userMarker) userMarker.remove();
      userMarker = L.marker([from.lat, from.lon], {
        icon: L.divIcon({ className: "map-pin map-pin--you", html: "<span></span>", iconSize: [22, 22], iconAnchor: [11, 11] }),
        title: "Votre point de départ",
      }).addTo(map).bindPopup("Votre point de départ");

      for (const p of ["foot", "car"]) {
        const r = routes[p];
        root.querySelector(`[data-time-${p}]`).textContent = r ? fmtTime(r.duration) : "—";
        root.querySelector(`[data-dist-${p}]`).textContent = r ? fmtDist(r.distance) : "indisponible";
      }
      transit.href = "https://www.google.com/maps/dir/?" + new URLSearchParams({
        api: "1", origin: `${from.lat},${from.lon}`, destination: `${SALON.lat},${SALON.lon}`, travelmode: "transit",
      });

      const parts = [];
      if (routes.foot) parts.push(`<strong>${fmtTime(routes.foot.duration)} à pied</strong>`);
      if (routes.car) parts.push(`<strong>${fmtTime(routes.car.duration)} en voiture</strong>`);
      summary.innerHTML = `Vous êtes à ${parts.join(" ou à ")} de votre coiffeuse.`;
      result.hidden = false;

      // Au-delà de 45 min à pied, on montre plutôt le trajet en voiture
      mode = routes.foot && (routes.foot.duration <= 45 * 60 || !routes.car) ? "foot" : "car";
      draw();
      setBusy(false, label ? `Départ : ${label}` : "");
    } catch {
      setBusy(false, "Impossible de calculer le trajet pour le moment. Réessayez dans quelques instants.");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q.length < 3) { status.textContent = "Entrez une adresse, par exemple « 10 rue de la Paix, Le Mans »."; input.focus(); return; }
    setBusy(true, "Recherche de l'adresse…");
    try {
      const place = await geocode(q);
      if (!place) { setBusy(false, "Adresse introuvable. Ajoutez le code postal et la ville, par exemple « 72000 Le Mans »."); return; }
      await compute(place, place.label.split(",").slice(0, 3).join(","));
    } catch {
      setBusy(false, "Le service de recherche d'adresse ne répond pas. Réessayez dans quelques instants.");
    }
  });

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) { status.textContent = "Votre navigateur ne permet pas la géolocalisation : entrez votre adresse."; return; }
    setBusy(true, "Localisation en cours…");
    navigator.geolocation.getCurrentPosition(
      (pos) => compute({ lat: pos.coords.latitude, lon: pos.coords.longitude }, "votre position actuelle"),
      () => setBusy(false, "Position non disponible. Autorisez la localisation ou entrez votre adresse."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });

  modes.forEach((b) => b.addEventListener("click", () => { if (routes[b.dataset.mode]) { mode = b.dataset.mode; draw(); } }));
})();
