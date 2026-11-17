/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — Mesure d'audience anonyme (sans cookie)
   Envoie au script Google de réservation : pages vues, clics de
   contact et étapes du formulaire. Aucune donnée personnelle :
   un identifiant aléatoire par appareil, rien d'autre.
   ───────────────────────────────────────────────────────────── */
(() => {
  const CFG = window.KITOKO_CONFIG || {};
  const url = CFG.appsScriptUrl;
  const prod = /(^|\.)kitokoshair\.github\.io$/.test(location.hostname);
  const bot = navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent);
  const noop = () => {};
  if (!url || !prod || bot) { window.khTrack = noop; return; }

  const store = (s) => { try { return window[s]; } catch (e) { return null; } };
  const ls = store("localStorage"), ss = store("sessionStorage");
  const get = (st, k) => { try { return st && st.getItem(k); } catch (e) { return null; } };
  const set = (st, k, v) => { try { st && st.setItem(k, v); } catch (e) {} };
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(9)), (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 16);

  let visitor = get(ls, "kh_vid"), isNew = 0;
  if (!visitor) { visitor = rid(); set(ls, "kh_vid", visitor); isNew = 1; }
  let session = get(ss, "kh_sid");
  if (!session) { session = rid(); set(ss, "kh_sid", session); }

  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const device = standalone ? "appli"
    : /iPad|Tablet/i.test(navigator.userAgent) || (/Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent)) ? "tablette"
    : /Mobi|iPhone|Android/i.test(navigator.userAgent) ? "mobile" : "ordinateur";

  // Source de la visite, calculée une fois par visite
  let source = get(ss, "kh_src");
  if (!source) {
    const q = new URLSearchParams(location.search);
    const utm = (q.get("utm_source") || q.get("src") || "").toLowerCase();
    const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    const fromHost = (h) =>
      /instagram/.test(h) ? "Instagram" : /facebook|fb\.|messenger/.test(h) ? "Facebook" : /tiktok/.test(h) ? "TikTok"
      : /whatsapp|wa\.me/.test(h) ? "WhatsApp" : /snapchat/.test(h) ? "Snapchat" : /google\./.test(h) ? "Google"
      : /bing|qwant|duckduckgo|ecosia|yahoo/.test(h) ? "Autre moteur" : /qr/.test(h) ? "QR code" : "";
    source = (utm && (fromHost(utm) || utm.slice(0, 24))) || (ref && !/kitokoshair\.github\.io/.test(ref) && (fromHost(ref) || ref.slice(0, 30))) || (standalone ? "Appli installée" : "Accès direct");
    if (utm === "qr" || utm === "affiche") source = "QR code";
    set(ss, "kh_src", source);
  }

  const page = /galerie/.test(location.pathname) ? "galerie" : "accueil";
  const sent = new Set();
  function track(event, detail, once) {
    if (once) { const k = event + "|" + (detail || ""); if (sent.has(k)) return; sent.add(k); }
    const body = JSON.stringify({ action: "hit", e: event, d: detail || "", v: visitor, s: session, p: page, src: source, dev: device, nv: event === "pageview" ? isNew : 0 });
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon(url, body))) fetch(url, { method: "POST", body, mode: "no-cors", keepalive: true });
    } catch (e) {}
  }
  window.khTrack = track;
  window.khVisitor = () => ({ visitor, source });

  track("pageview");
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const h = a.getAttribute("href");
    if (/wa\.me|whatsapp/i.test(h)) track("contact_whatsapp");
    else if (/instagram\.com/i.test(h)) track("contact_instagram");
    else if (/^tel:/i.test(h)) track("contact_tel");
    else if (/^mailto:/i.test(h)) track("contact_email");
    else if (page === "galerie" && (a.hasAttribute("data-viewer-book") || /prestation=/.test(h))) track("gallery_book", (h.match(/prestation=([\w-]+)/) || [])[1]);
  }, true);
  addEventListener("appinstalled", () => track("install"));
})();
