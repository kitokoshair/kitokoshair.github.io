/* ─────────────────────────────────────────────────────────────
   KITOKO's HAIR — application installable
   - enregistre le service worker (sw.js)
   - affiche les boutons « Installer l'appli » quand c'est possible
   - Android / ordinateur : fenêtre d'installation du navigateur
   - iPhone / iPad : petit mode d'emploi (Safari ne propose pas de bouton)
   ───────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  if ("serviceWorker" in navigator) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  const buttons = [...document.querySelectorAll("[data-install]")];
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone) { document.documentElement.classList.add("is-app"); return; }

  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const inApp = /Instagram|FBAN|FBAV|TikTok|Snapchat|Line\//i.test(ua); // navigateurs intégrés : installation impossible
  let deferred = null;

  const show = () => buttons.forEach((b) => (b.hidden = false));
  const hide = () => buttons.forEach((b) => (b.hidden = true));

  // Android, Chrome, Edge : le navigateur propose l'installation
  addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; show(); });
  addEventListener("appinstalled", () => { deferred = null; hide(); });

  // iPhone / iPad (Safari) ou navigateur intégré d'Instagram, TikTok… : on explique
  if (isIOS || inApp) show();

  function helpDialog() {
    let dlg = document.querySelector("[data-install-help]");
    if (dlg) return dlg;
    const share = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
    const plus = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
    dlg = document.createElement("dialog");
    dlg.className = "install-help";
    dlg.setAttribute("data-install-help", "");
    dlg.setAttribute("aria-labelledby", "install-help-title");
    dlg.innerHTML = inApp
      ? `<h2 id="install-help-title">Ouvrez le site dans votre navigateur</h2>
         <p>Depuis Instagram, TikTok ou Facebook, l'installation n'est pas possible. Touchez le menu <b>⋯</b> en haut à droite, puis <b>Ouvrir dans le navigateur</b> (Safari ou Chrome), et revenez sur ce bouton.</p>
         <button class="btn" type="button" data-close>J'ai compris</button>`
      : `<span class="install-help__icon"><img src="assets/img/app-192.png" alt="" width="64" height="64"></span>
         <h2 id="install-help-title">Installer Kitoko's Hair sur votre iPhone</h2>
         <ol class="install-help__steps">
           <li><span class="install-help__key">${share}</span><span>Touchez le bouton <b>Partager</b> en bas de Safari (ou en haut sur iPad).</span></li>
           <li><span class="install-help__key">${plus}</span><span>Choisissez <b>Sur l'écran d'accueil</b>. Faites défiler la liste si besoin.</span></li>
           <li><span class="install-help__key"><b>OK</b></span><span>Touchez <b>Ajouter</b> : l'icône Kitoko's Hair apparaît avec vos applis.</span></li>
         </ol>
         <button class="btn" type="button" data-close>J'ai compris</button>`;
    document.body.append(dlg);
    dlg.querySelector("[data-close]").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    return dlg;
  }

  buttons.forEach((b) => b.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") hide();
      deferred = null;
    } else {
      helpDialog().showModal();
    }
  }));
})();
