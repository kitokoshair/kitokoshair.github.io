/**
 * ─────────────────────────────────────────────────────────────
 *  KITOKO's HAIR — Tableau de bord de pilotage
 *
 *  • Tient un journal des réservations (avec leur statut) dans un
 *    classeur Google « KITOKO's HAIR – Pilotage ».
 *  • Reçoit la mesure d'audience anonyme du site (sans cookie).
 *  • Enregistre les dépenses saisies dans le tableau de bord.
 *  • Calcule les indicateurs et sert la page privée du tableau de bord :
 *      <URL du script>?action=pilotage&k=<clé>
 *
 *  Installation : lancer une fois setupPilotage() depuis l'éditeur.
 *  Le lien du tableau de bord s'affiche dans le journal d'exécution.
 * ─────────────────────────────────────────────────────────────
 */

const PIL = {
  BOOK_NAME: "KITOKO's HAIR – Pilotage",
  SHEET_PROP: "PILOTAGE_SHEET_ID",
  KEY_PROP: "PILOTAGE_KEY",
  VISIT_RETENTION_DAYS: 760, // ~25 mois, puis les visites sont effacées
  HISTORY_FROM: "2026-11-01",
  EXPENSE_CATEGORIES: ["Mèches & cheveux", "Produits", "Matériel", "Transport", "Communication & pub", "Formation", "Autre"],
};

const PIL_SHEETS = {
  resa: { name: "Réservations", head: ["Réf.", "Créée le", "Date du RDV", "Heure", "Durée (min)", "Prestation", "Catégorie", "Montant (€)", "Prix « dès »", "Suppléments", "Mèches", "Statut", "Mis à jour le", "E-mail cliente", "Source", "Visiteur", "ID agenda"] },
  visites: { name: "Visites", head: ["Horodatage", "Visiteur", "Session", "Événement", "Page", "Détail", "Source", "Appareil", "Nouveau visiteur"] },
  depenses: { name: "Dépenses", head: ["Date", "Catégorie", "Libellé", "Montant (€)", "Ajoutée le"] },
};

const R = { REF: 0, CREATED: 1, DATE: 2, TIME: 3, DUR: 4, SERVICE: 5, CAT: 6, AMOUNT: 7, FROM: 8, EXTRAS: 9, HAIR: 10, STATUS: 11, UPDATED: 12, EMAIL: 13, SOURCE: 14, VISITOR: 15, EVENT: 16 };
const STATUS = { pending: "En attente", confirmed: "Confirmé", declined: "Refusé", cancelled: "Annulé par la cliente", removed: "Retiré de l'agenda" };

/* ═════════════════════════ Installation ═════════════════════════ */

function setupPilotage() {
  const book = pilBook_();
  Object.keys(PIL_SHEETS).forEach(pilSheet_);
  const def = book.getSheetByName("Feuille 1") || book.getSheetByName("Sheet1");
  if (def && book.getSheets().length > 1) book.deleteSheet(def);
  const added = importHistorique_();
  console.log("Classeur : " + book.getUrl());
  console.log("Réservations importées depuis l'agenda : " + added);
  console.log("Tableau de bord : " + scriptUrl_() + "?action=pilotage&k=" + pilKey_());
}

function pilKey_() {
  const props = PropertiesService.getScriptProperties();
  let k = props.getProperty(PIL.KEY_PROP);
  if (!k) { k = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "").slice(0, 8); props.setProperty(PIL.KEY_PROP, k); }
  return k;
}

function pilBook_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty(PIL.SHEET_PROP);
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) { console.warn("Classeur introuvable, recréation"); } }
  const book = SpreadsheetApp.create(PIL.BOOK_NAME);
  book.setSpreadsheetTimeZone(CONFIG.TIMEZONE);
  props.setProperty(PIL.SHEET_PROP, book.getId());
  return book;
}

function pilSheet_(key) {
  const def = PIL_SHEETS[key];
  const book = pilBook_();
  let sh = book.getSheetByName(def.name);
  if (!sh) {
    sh = book.insertSheet(def.name);
    sh.getRange(1, 1, 1, def.head.length).setValues([def.head]).setFontWeight("bold").setBackground("#24102B").setFontColor("#FFFFFF");
    sh.setFrozenRows(1);
  }
  return sh;
}

/* ═════════════════════════ Journal des réservations ═════════════════════════ */

// Appelé par book_() juste après la création du rendez-vous
function journalNew_(c, ref, start, duration, evId) {
  try {
    pilSheet_("resa").appendRow([
      ref, new Date(), fmt_(start, "yyyy-MM-dd"), fmt_(start, "HH:mm"), duration, c.service, c.category || "",
      c.total, c.priceFrom ? "oui" : "", c.extras.join(", "), c.hairSupply, STATUS.pending, new Date(), c.email,
      c.source || "", c.visitor || "", evId,
    ]);
  } catch (err) { console.error("journalNew_", err); }
}

function journalStatus_(ref, statusKey) {
  try {
    if (!ref) return;
    const sh = pilSheet_("resa");
    const cell = sh.getRange("A:A").createTextFinder(ref).matchEntireCell(true).findNext();
    if (!cell) return;
    sh.getRange(cell.getRow(), R.STATUS + 1, 1, 2).setValues([[STATUS[statusKey], new Date()]]);
  } catch (err) { console.error("journalStatus_", err); }
}

// Reprend les rendez-vous déjà présents dans l'agenda (créés avant le journal)
function importHistorique_() {
  const sh = pilSheet_("resa");
  const known = {};
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().forEach(function (r) { known[r[0]] = true; });
  const from = parseLocal_(PIL.HISTORY_FROM, "00:00");
  const to = new Date(Date.now() + (CONFIG.MAX_DAYS_AHEAD + 5) * 86400000);
  const rows = [];
  calendar_().getEvents(from, to).forEach(function (ev) {
    const ref = ev.getTag("kh_ref");
    if (!ref || known[ref]) return;
    const d = ev.getDescription() || "";
    const pick = function (label) { const m = d.match(new RegExp("^" + label + " : (.*)$", "m")); return m ? m[1].trim() : ""; };
    const price = pick("Prix");
    const amount = Number((price.match(/([\d.,]+)\s*€/) || [0, "0"])[1].replace(",", ".")) || 0;
    const start = ev.getStartTime();
    const st = ev.getTag("kh_status") === "confirmed" ? STATUS.confirmed : STATUS.pending;
    rows.push([ref, ev.getDateCreated(), fmt_(start, "yyyy-MM-dd"), fmt_(start, "HH:mm"), Math.round((ev.getEndTime() - start) / 60000),
      pick("Coiffure"), "", amount, /dès/.test(price) ? "oui" : "", pick("Suppléments").replace(/^aucun$/, ""), pick("Mèches"),
      st, new Date(), ev.getTag("kh_email") || pick("E-mail"), "", "", ev.getId()]);
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  return rows.length;
}

// Les rendez-vous supprimés à la main dans l'agenda passent en « Retiré de l'agenda »
function reconcile_(rows, sh) {
  const now = Date.now();
  rows.forEach(function (r, i) {
    const active = r[R.STATUS] === STATUS.pending || r[R.STATUS] === STATUS.confirmed;
    if (!active || !r[R.EVENT]) return;
    const when = parseLocal_(dateStr_(r[R.DATE]), timeStr_(r[R.TIME])).getTime();
    if (when < now - 86400000) return; // passé : on garde le statut
    if (!findEvent_(r[R.EVENT])) {
      r[R.STATUS] = STATUS.removed;
      sh.getRange(i + 2, R.STATUS + 1, 1, 2).setValues([[STATUS.removed, new Date()]]);
    } else if (r[R.STATUS] === STATUS.pending) {
      const ev = findEvent_(r[R.EVENT]);
      if (ev && ev.getTag("kh_status") === "confirmed") { r[R.STATUS] = STATUS.confirmed; sh.getRange(i + 2, R.STATUS + 1, 1, 2).setValues([[STATUS.confirmed, new Date()]]); }
    }
  });
}

/* ═════════════════════════ Mesure d'audience ═════════════════════════ */

const HIT_EVENTS = ["pageview", "contact_whatsapp", "contact_instagram", "contact_tel", "contact_email", "book_start", "book_date", "book_details", "book_submit", "gallery_book", "install"];

function recordHit_(d) {
  const s = function (v, max) { return String(v == null ? "" : v).replace(/[\r\n\t]/g, " ").trim().slice(0, max); };
  if (HIT_EVENTS.indexOf(d.e) < 0 || !/^[a-z0-9]{8,40}$/i.test(String(d.v)) || !/^[a-z0-9]{6,40}$/i.test(String(d.s))) return { ok: false };
  pilSheet_("visites").appendRow([new Date(), s(d.v, 40), s(d.s, 40), d.e, s(d.p, 40), s(d.d, 80), s(d.src, 30), s(d.dev, 20), d.nv ? 1 : 0]);
  return { ok: true };
}

function purgeVisites_() {
  const cache = CacheService.getScriptCache();
  if (cache.get("pil_purged")) return;
  cache.put("pil_purged", "1", 21600);
  const sh = pilSheet_("visites");
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const limit = Date.now() - PIL.VISIT_RETENTION_DAYS * 86400000;
  const ts = sh.getRange(2, 1, n, 1).getValues();
  let old = 0;
  while (old < n && new Date(ts[old][0]).getTime() < limit) old++;
  if (old > 0) sh.deleteRows(2, old);
}

/* ═════════════════════════ Page privée ═════════════════════════ */

function pilotagePage_(p) {
  if (!p.k || p.k !== pilKey_()) return page_("Lien invalide", "<p>Ce lien de tableau de bord n'est pas valide.</p>");
  const t = HtmlService.createTemplateFromFile("Tableau");
  t.key = p.k;
  t.categories = JSON.stringify(PIL.EXPENSE_CATEGORIES);
  return t.evaluate().setTitle("Pilotage — " + CONFIG.BUSINESS_NAME)
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setFaviconUrl(CONFIG.SITE_URL + "assets/img/favicon.png");
}

function checkKey_(k) { if (!k || k !== pilKey_()) throw new Error("Accès refusé"); }

/* ═════════════════════════ Dépenses ═════════════════════════ */

function addExpense(k, x) {
  checkKey_(k);
  const amount = Math.round(Number(String(x.amount).replace(",", ".")) * 100) / 100;
  if (!(amount > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(x.date)) throw new Error("Montant ou date invalide");
  const cat = PIL.EXPENSE_CATEGORIES.indexOf(x.category) >= 0 ? x.category : "Autre";
  pilSheet_("depenses").appendRow([x.date, cat, String(x.label || "").slice(0, 120), amount, new Date()]);
  return true;
}

function deleteExpense(k, row) {
  checkKey_(k);
  const sh = pilSheet_("depenses");
  row = Number(row);
  if (row < 2 || row > sh.getLastRow()) throw new Error("Ligne introuvable");
  sh.deleteRow(row);
  return true;
}

/* ═════════════════════════ Indicateurs ═════════════════════════ */

function getPilotage(k, period) {
  checkKey_(k);
  purgeVisites_();
  const now = new Date();
  const today = parseLocal_(fmt_(now, "yyyy-MM-dd"), "00:00");
  const tomorrow = new Date(today.getTime() + 86400000);
  let from, to = tomorrow, label;
  if (period === "mois") { from = parseLocal_(fmt_(now, "yyyy-MM") + "-01", "00:00"); label = "Ce mois-ci"; }
  else if (period === "annee") { from = parseLocal_(fmt_(now, "yyyy") + "-01-01", "00:00"); label = "Cette année"; }
  else if (period === "tout") { from = parseLocal_(PIL.HISTORY_FROM, "00:00"); label = "Depuis le début"; }
  else { const n = [7, 30, 90, 365].indexOf(Number(period)) >= 0 ? Number(period) : 30; from = new Date(tomorrow.getTime() - n * 86400000); label = n + " derniers jours"; }
  const span = to - from;
  const prevFrom = new Date(from.getTime() - span), prevTo = from;

  const resaSh = pilSheet_("resa");
  const resa = values_(resaSh);
  reconcile_(resa, resaSh);
  const visits = values_(pilSheet_("visites"));
  const depSh = pilSheet_("depenses");
  const deps = values_(depSh).map(function (r, i) { return { row: i + 2, date: dateStr_(r[0]), cat: r[1], label: r[2], amount: Number(r[3]) || 0 }; });

  const cur = periodStats_(resa, visits, deps, from, to, now);
  const prev = periodStats_(resa, visits, deps, prevFrom, prevTo, now);

  // Rendez-vous à venir (toutes périodes)
  const upcoming = resa.filter(function (r) { return (r[R.STATUS] === STATUS.confirmed || r[R.STATUS] === STATUS.pending) && rdvTime_(r) >= now.getTime(); })
    .sort(function (a, b) { return rdvTime_(a) - rdvTime_(b); });
  const upcomingList = upcoming.slice(0, 8).map(function (r) {
    return { when: whenText_(new Date(rdvTime_(r))), service: r[R.SERVICE], amount: Number(r[R.AMOUNT]) || 0, status: r[R.STATUS], from: r[R.FROM] === "oui" };
  });
  const upcomingCA = { confirmed: sum_(upcoming.filter(function (r) { return r[R.STATUS] === STATUS.confirmed; }), R.AMOUNT), pending: sum_(upcoming.filter(function (r) { return r[R.STATUS] === STATUS.pending; }), R.AMOUNT), count: upcoming.length };

  // 12 derniers mois : CA réalisé et dépenses
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Number(fmt_(now, "yyyy")), Number(fmt_(now, "M")) - 1 - i, 1);
    const key = Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM");
    months.push({ key: key, label: monthLabel_(key), ca: 0, dep: 0, resa: 0 });
  }
  const mIdx = {}; months.forEach(function (m, i) { mIdx[m.key] = i; });
  resa.forEach(function (r) {
    const key = dateStr_(r[R.DATE]).slice(0, 7);
    if (mIdx[key] == null) return;
    if (r[R.STATUS] === STATUS.confirmed && rdvTime_(r) < now.getTime()) { months[mIdx[key]].ca += Number(r[R.AMOUNT]) || 0; months[mIdx[key]].resa++; }
  });
  deps.forEach(function (x) { const key = x.date.slice(0, 7); if (mIdx[key] != null) months[mIdx[key]].dep += x.amount; });

  // Fidélité (sur tout l'historique)
  const byEmail = {};
  resa.forEach(function (r) { const e = String(r[R.EMAIL] || "").toLowerCase(); if (e && r[R.STATUS] !== STATUS.declined) byEmail[e] = (byEmail[e] || 0) + 1; });
  const clients = Object.keys(byEmail);
  const loyal = clients.filter(function (e) { return byEmail[e] > 1; }).length;

  return {
    label: label, from: fmt_(from, "dd/MM/yyyy"), to: fmt_(new Date(to - 1), "dd/MM/yyyy"),
    generated: fmt_(now, "dd/MM/yyyy 'à' HH:mm"),
    cur: cur, prev: prev, months: months, upcoming: upcomingList, upcomingCA: upcomingCA,
    clients: { total: clients.length, loyal: loyal },
    expenses: deps.filter(function (x) { return x.date >= fmt_(from, "yyyy-MM-dd") && x.date < fmt_(to, "yyyy-MM-dd"); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }),
    sheetUrl: pilBook_().getUrl(),
  };
}

function periodStats_(resa, visits, deps, from, to, now) {
  const f = from.getTime(), t = to.getTime(), n = now.getTime();
  const inRange = function (d) { const x = new Date(d).getTime(); return x >= f && x < t; };

  /* — Visites — */
  const V = visits.filter(function (r) { return inRange(r[0]); });
  const pv = V.filter(function (r) { return r[3] === "pageview"; });
  const visitors = uniq_(pv, 1), sessions = uniq_(pv, 2);
  const newVisitors = uniq_(pv.filter(function (r) { return Number(r[8]) === 1; }), 1);
  const firstHit = {};
  pv.forEach(function (r) { if (!firstHit[r[2]]) firstHit[r[2]] = r; });
  const sess = Object.keys(firstHit).map(function (s) { return firstHit[s]; });
  const sessEvent = function (e) { return uniq_(V.filter(function (r) { return r[3] === e; }), 2); };
  const count = function (e) { return V.filter(function (r) { return r[3] === e; }).length; };
  const days = {};
  for (let d = f; d < t; d += 86400000) days[Utilities.formatDate(new Date(d), CONFIG.TIMEZONE, "yyyy-MM-dd")] = {};
  pv.forEach(function (r) { const k = Utilities.formatDate(new Date(r[0]), CONFIG.TIMEZONE, "yyyy-MM-dd"); if (days[k]) days[k][r[1]] = 1; });

  /* — Réservations créées sur la période (la demande) — */
  const created = resa.filter(function (r) { return inRange(r[R.CREATED]); });
  const st = function (s) { return created.filter(function (r) { return r[R.STATUS] === s; }).length; };
  const leads = created.map(function (r) { return (rdvTime_(r) - new Date(r[R.CREATED]).getTime()) / 86400000; }).filter(function (x) { return x >= 0; });

  /* — Rendez-vous réalisés sur la période (le chiffre d'affaires) — */
  const done = resa.filter(function (r) { const w = rdvTime_(r); return r[R.STATUS] === STATUS.confirmed && w >= f && w < t && w < n; });
  const lost = resa.filter(function (r) { const w = rdvTime_(r); return (r[R.STATUS] === STATUS.cancelled || r[R.STATUS] === STATUS.declined || r[R.STATUS] === STATUS.removed) && w >= f && w < t; });
  const ca = sum_(done, R.AMOUNT);
  const ndays = (t - f) / 86400000;

  const D = deps.filter(function (x) { const d = parseLocal_(x.date, "12:00").getTime(); return d >= f && d < t; });
  const depTotal = D.reduce(function (a, x) { return a + x.amount; }, 0);
  const depCats = group_(D.map(function (x) { return [x.cat, x.amount]; }));

  const dow = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const rdvAll = created.filter(function (r) { return r[R.STATUS] !== STATUS.declined; });

  return {
    visits: {
      visitors: visitors, sessions: sessions, pageviews: pv.length, newVisitors: newVisitors,
      pagesPerSession: sessions ? pv.length / sessions : 0,
      mobileShare: sessions ? sess.filter(function (r) { return r[7] === "mobile"; }).length / sessions : 0,
      daily: Object.keys(days).map(function (k) { return { d: k, label: Number(k.slice(8)) + "/" + Number(k.slice(5, 7)), n: Object.keys(days[k]).length }; }),
      sources: top_(group_(sess.map(function (r) { return [r[6] || "Accès direct", 1]; })), 8),
      devices: top_(group_(sess.map(function (r) { return [{ mobile: "Mobile", tablette: "Tablette", ordinateur: "Ordinateur", appli: "Appli installée" }[r[7]] || "Autre", 1]; })), 4),
      pages: top_(group_(pv.map(function (r) { return [{ accueil: "Accueil", galerie: "Galerie" }[r[4]] || r[4] || "Autre", 1]; })), 6),
      contacts: { whatsapp: count("contact_whatsapp"), instagram: count("contact_instagram"), tel: count("contact_tel"), email: count("contact_email") },
      installs: count("install"), galleryBook: count("gallery_book"),
      funnel: [
        { label: "Visiteurs", n: sessions },
        { label: "Ont choisi une prestation", n: sessEvent("book_start") },
        { label: "Ont choisi une date", n: sessEvent("book_date") },
        { label: "Ont rempli leurs coordonnées", n: sessEvent("book_details") },
        { label: "Ont envoyé la réservation", n: sessEvent("book_submit") },
      ],
    },
    resa: {
      requests: created.length, confirmed: st(STATUS.confirmed), pending: st(STATUS.pending), declined: st(STATUS.declined),
      cancelled: st(STATUS.cancelled), removed: st(STATUS.removed),
      conversion: sessions ? created.length / sessions : 0,
      leadDays: leads.length ? leads.reduce(function (a, b) { return a + b; }, 0) / leads.length : 0,
      home: created.filter(function (r) { return /domicile/i.test(r[R.EXTRAS]); }).length,
      withHair: created.filter(function (r) { return /incluse|tissage|laine|produits/i.test(r[R.HAIR]) && !/apporte|sans produits/i.test(r[R.HAIR]); }).length,
      services: top_(group_(rdvAll.map(function (r) { return [shortService_(r[R.SERVICE]), 1]; })), 8),
      categories: top_(group_(rdvAll.map(function (r) { return [r[R.CAT] || "Non renseignée", 1]; })), 8),
      weekdays: [1, 2, 3, 4, 5, 6, 0].map(function (i) { return { label: dow[i], n: rdvAll.filter(function (r) { return new Date(rdvTime_(r)).getDay() === i; }).length }; }),
      hours: ["09", "10", "11", "12", "13", "14", "15", "16", "17"].map(function (h) { return { label: Number(h) + " h", n: rdvAll.filter(function (r) { return timeStr_(r[R.TIME]).slice(0, 2) === h; }).length }; }),
    },
    money: {
      ca: ca, done: done.length, basket: done.length ? ca / done.length : 0, perDay: ndays ? ca / ndays : 0,
      lost: sum_(lost, R.AMOUNT), lostCount: lost.length,
      caServices: top_(group_(done.map(function (r) { return [shortService_(r[R.SERVICE]), Number(r[R.AMOUNT]) || 0]; })), 8),
      caCategories: top_(group_(done.map(function (r) { return [r[R.CAT] || "Non renseignée", Number(r[R.AMOUNT]) || 0]; })), 8),
      expenses: depTotal, expenseCats: top_(depCats, 8),
      profit: ca - depTotal, margin: ca ? (ca - depTotal) / ca : 0,
    },
  };
}

/* ═════════════════════════ Outils ═════════════════════════ */

function values_(sh) { const n = sh.getLastRow() - 1; return n > 0 ? sh.getRange(2, 1, n, sh.getLastColumn()).getValues() : []; }
function uniq_(rows, col) { const s = {}; rows.forEach(function (r) { s[r[col]] = 1; }); return Object.keys(s).length; }
function sum_(rows, col) { return rows.reduce(function (a, r) { return a + (Number(r[col]) || 0); }, 0); }
function group_(pairs) { const g = {}; pairs.forEach(function (p) { g[p[0]] = (g[p[0]] || 0) + p[1]; }); return g; }
function top_(g, n) { return Object.keys(g).map(function (k) { return { label: k, n: Math.round(g[k] * 100) / 100 }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, n); }
function dateStr_(v) { return v instanceof Date ? fmt_(v, "yyyy-MM-dd") : String(v).slice(0, 10); }
function timeStr_(v) { return v instanceof Date ? fmt_(v, "HH:mm") : String(v).slice(0, 5); }
function rdvTime_(r) { try { return parseLocal_(dateStr_(r[R.DATE]), timeStr_(r[R.TIME])).getTime(); } catch (e) { return 0; } }
function shortService_(s) { return String(s || "—").split(" — ")[0].split(" · ")[0].trim(); }
function monthLabel_(key) { const m = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]; return m[Number(key.slice(5)) - 1] + " " + key.slice(2, 4); }
