/**
 * ─────────────────────────────────────────────────────────────
 *  KITOKO's HAIR — Catalogue des prestations et des prix
 *  Prix en euros. Modifier ici met à jour la grille tarifaire
 *  ET le formulaire de réservation.
 * ─────────────────────────────────────────────────────────────
 *
 *  family = une coiffure
 *    variantLabel : nom du choix (Longueur, Formule…)
 *    variants     : [id, libellé, prix, "from" si prix « à partir de »]
 *    sizes        : true si la cliente choisit une taille S / M / L
 *    duration     : durée en minutes (sinon durée par défaut du config.js)
 *    note         : petite précision affichée sous la prestation
 *
 *  group.noHair = true : pas de question « mèches » (soins, ongles)
 *  extra.only / extra.except : groupes où le supplément est proposé
 */
window.KITOKO_SERVICES = {
  // Suppléments de taille (ajoutés au prix de la longueur)
  sizes: [
    { id: "S", label: "S", extra: 10 },
    { id: "M", label: "M", extra: 5 },
    { id: "L", label: "L", extra: 0 },
  ],

  groups: [
    { id: "tresses", label: "Tresses" },
    { id: "boucles", label: "Courtes & bouclées" },
    { id: "french", label: "French curly" },
    { id: "shuku", label: "Shuku with curls" },
    { id: "twists", label: "Twists & vanilles" },
    { id: "locs", label: "Locs" },
    { id: "nattes", label: "Nattes collées" },
    { id: "tissage", label: "Tissage" },
    { id: "homme", label: "Homme" },
    { id: "soins", label: "Soins & lissage", noHair: true },
    { id: "nails", label: "Kitoko's Nail", noHair: true },
  ],

  families: [
    // ── Tresses ──────────────────────────────────────────────
    {
      id: "knotless", group: "tresses", name: "Knotless braids", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 30], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 50], ["bas-fesses", "Bas des fesses", 60]],
    },
    {
      id: "fulani-braids", group: "tresses", name: "Fulani braids", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 30], ["mi-dos", "Mi-dos", 35], ["bas-dos", "Bas du dos", 40], ["bas-fesses", "Bas des fesses", 55]],
    },
    {
      id: "lemonade", group: "tresses", name: "Lemonade braids", sizes: true,
      variantLabel: "Formule",
      variants: [["sans-meche", "Sans mèche", 40], ["meche-incluse", "Mèches incluses", 55]],
    },
    {
      id: "two-steps", group: "tresses", name: "Two steps braids", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40]],
    },
    {
      id: "miracle-braids", group: "tresses", name: "Miracle braids", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40]],
    },
    {
      id: "miracle-knots", group: "tresses", name: "Miracle knots braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },
    {
      id: "tyla", group: "tresses", name: "Tyla braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "jayda-wayda", group: "tresses", name: "Jayda Wayda braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "tems", group: "tresses", name: "Tems braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 50]],
    },
    {
      id: "layer-dolly", group: "tresses", name: "Layer dolly braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "patewo", group: "tresses", name: "Patewo", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "stick", group: "tresses", name: "Stick braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },

    // ── Courtes & bouclées ──────────────────────────────────
    {
      id: "french-curly", group: "french", name: "French curly", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 40], ["dos", "Dos", 45]],
    },
    {
      id: "short-french-curls", group: "boucles", name: "Short French curls braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },
    {
      id: "shuku-curls", group: "shuku", name: "Shuku with curls", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "short-lemonade", group: "boucles", name: "Short lemonade braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "short-bob", group: "boucles", name: "Short bob braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "mermaid", group: "boucles", name: "Mermaid braids", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },

    // ── Twists & vanilles ───────────────────────────────────
    {
      id: "vanilles", group: "twists", name: "Vanilles", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 45], ["bas-fesses", "Bas des fesses", 50]],
    },
    {
      id: "fulani-twist", group: "twists", name: "Fulani twist", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 30], ["mi-dos", "Mi-dos", 35], ["bas-dos", "Bas du dos", 45], ["bas-fesses", "Bas des fesses", 60]],
    },
    {
      id: "marley", group: "twists", name: "Marley twist", sizes: false,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40], ["bas-fesses", "Bas des fesses", 50], ["meche-incluse", "Mèches incluses", 35, "from"]],
    },
    {
      id: "twist-naturels", group: "twists", name: "Twist sur cheveux naturels", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Cheveux naturels", 20]],
    },
    {
      id: "twist-meches", group: "twists", name: "Twist avec mèches", sizes: false,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 25], ["dos", "Dos", 35]],
    },
    {
      id: "bantu-knots", group: "boucles", name: "Bantu knots", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },
    {
      id: "passion-twist", group: "twists", name: "Passion twist", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 45]],
    },

    // ── Locs ─────────────────────────────────────────────────
    {
      id: "soft-locs", group: "locs", name: "Soft locs", sizes: true,
      variantLabel: "Longueur",
      variants: [["mi-dos", "Mi-dos", 35], ["dos", "Dos", 40], ["bas-fesses", "Bas des fesses", 45]],
    },
    {
      id: "butterfly-locs", group: "locs", name: "Butterfly locs", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 50], ["dos", "Dos", 60]],
    },
    {
      id: "invisible-locs", group: "locs", name: "Invisible locs", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Toutes tailles (S, M, L)", 50]],
    },
    {
      id: "vrais-locs", group: "locs", name: "Vrais locs — resserrage", sizes: false,
      variantLabel: "Type",
      variants: [["sisterlocks", "Sisterlocks", 100], ["medium", "Medium", 75]],
    },
    {
      id: "depart-locs", group: "locs", name: "Départ de locs", sizes: false,
      variantLabel: "Technique",
      variants: [["twist", "En twist", 50], ["vanille", "En vanille", 55]],
    },
    {
      id: "pose-vrais-locs", group: "locs", name: "Pose de vrais locs (retwist sur devis)", sizes: false,
      variantLabel: "Nombre de locs",
      variants: [["100", "100 locs", 50], ["200", "200 locs", 70], ["400", "400 locs", 90]],
    },
    {
      id: "pose-faux-locs", group: "locs", name: "Pose de faux locs", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },

    // ── Nattes collées ──────────────────────────────────────
    {
      id: "nattes-rajout", group: "nattes", name: "Nattes collées avec rajout", sizes: true,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 20], ["mi-dos", "Mi-dos", 25], ["bas-dos", "Bas du dos", 30], ["bas-fesses", "Bas des fesses", 35]],
    },
    {
      id: "nattes-sans", group: "nattes", name: "Nattes collées avec cheveux naturels", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Sans rajout (20 à 25 €)", 20, "from"]],
    },
    {
      id: "cornrows", group: "nattes", name: "Cornrows", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },

    // ── Tissage ─────────────────────────────────────────────
    {
      id: "tissage", group: "tissage", name: "Tissage", sizes: false,
      variantLabel: "Formule",
      variants: [["ferme", "Fermé", 45], ["ouvert", "Ouvert", 40], ["meche-incluse", "Mèches incluses", 40, "from"]],
    },

    {
      id: "half-braids", group: "tissage", name: "Half braids / Half sew-in", sizes: false,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 55]],
    },

    // ── Homme ───────────────────────────────────────────────
    {
      id: "homme", group: "homme", name: "Coiffures homme", sizes: false,
      variantLabel: "Coiffure",
      variants: [["barrel", "Barrel twist", 30], ["vanille", "Vanille", 35], ["nattes-libres", "Nattes libres", 20], ["nattes-collees", "Nattes collées", 20], ["zigzag-cornrow", "Zigzag cornrow", 30], ["stitch-cornrow", "Stitch cornrow", 25], ["filant-twist", "Filant twist", 25]],
    },

    // ── Soins & lissage ─────────────────────────────────────
    {
      id: "lissage-tanin", group: "soins", name: "Lissage au tanin", sizes: false, duration: 240,
      note: "Prestation et produits inclus · tient 5 à 6 mois",
      variantLabel: "Longueur",
      variants: [["courts", "Courts (au-dessus des épaules)", 145], ["mi-longs", "Mi-longs (épaules / clavicules)", 190], ["longs", "Longs (milieu du dos)", 210], ["tres-longs", "Très longs, très épais ou afro", 235]],
    },
    {
      id: "lissage-keratine", group: "soins", name: "Lissage à la kératine", sizes: false, duration: 240,
      note: "Prestation et produits inclus · tient 5 à 6 mois",
      variantLabel: "Longueur",
      variants: [["courts", "Courts (au-dessus des épaules)", 125], ["mi-longs", "Mi-longs (épaules / clavicules)", 170], ["longs", "Longs (milieu du dos)", 190], ["tres-longs", "Très longs, très épais ou afro", 215]],
    },
    {
      id: "brushing", group: "soins", name: "Brushing", sizes: false, duration: 60,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },
    {
      id: "lissage-temporaire", group: "soins", name: "Lissage temporaire", sizes: false, duration: 90,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "defrisage", group: "soins", name: "Défrisage (produits chimiques)", sizes: false, duration: 120,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },

    // ── Kitoko's Nail ───────────────────────────────────────
    {
      id: "pose-complete", group: "nails", name: "Pose complète (capsules + gel)", sizes: false, duration: 90,
      variantLabel: "Finition",
      variants: [["unie", "Couleur unie ou nude", 35], ["couleur", "+ 1 couleur (vernis couleur unie)", 40], ["french", "French", 40], ["baby-boomer", "Baby-boomer (dégradé rosé / blanc)", 45]],
    },
    {
      id: "remplissage", group: "nails", name: "Remplissage", sizes: false, duration: 60,
      note: "Conseillé toutes les 3 semaines",
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 25]],
    },
    {
      id: "reparation-ongle", group: "nails", name: "Réparation d'un ongle cassé", sizes: false, duration: 30,
      note: "5 € par ongle",
      variantLabel: "Nombre d'ongles",
      variants: [["1", "1 ongle", 5], ["2", "2 ongles", 10], ["3", "3 ongles", 15], ["4", "4 ongles", 20], ["5", "5 ongles", 25]],
    },
    {
      id: "depose", group: "nails", name: "Dépose seule", sizes: false, duration: 30,
      note: "Retrait complet + soin fortifiant · offerte si nouvelle pose",
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 20]],
    },
    {
      id: "soin-pieds-hydratation", group: "nails", name: "Soin des pieds — Hydratation & douceur", sizes: false, duration: 45,
      note: "45 min",
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },
    {
      id: "soin-pieds-express", group: "nails", name: "Soin des pieds — Express & nettoyage", sizes: false, duration: 30,
      note: "30 min",
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 20]],
    },
  ],

  // Suppléments à cocher
  extras: [
    { id: "koroba", label: "Koroba braids", price: 10, except: ["soins", "nails"] },
    { id: "boheme", label: "Version bohème", price: 5, except: ["soins", "nails"] },
    { id: "perles", label: "Pose des perles", price: 5, except: ["soins", "nails"] },
    { id: "coiffage-locs", label: "Coiffage des locks", price: 10, except: ["soins", "nails"] },
    { id: "shampoing", label: "Shampoing", price: 10, hint: "Si vous ne venez pas les cheveux propres", except: ["nails"] },
    { id: "demelant", label: "Démêlant", price: 5, except: ["nails"] },
    { id: "nail-art", label: "Nail art (ongles)", price: 5, only: ["nails"] },
    { id: "domicile", label: "Prestation à domicile (Le Mans, bus ou tram)", price: 10, from: true },
  ],
};
