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
 *    meches       : supplément « mèches incluses » en € (même prix pour toutes les longueurs et tailles)
 *    hair         : plusieurs choix de mèches : [{ id, label, price }] ;
 *                   price peut dépendre de la longueur : { epaule: 15, dos: 20 }
 *                   (sans meches ni hair : question « j'apporte / fournies » comme avant)
 *
 *    hairTitle / hairNone / hairDefault : titre du choix (« Produits »…), libellé sans option, option cochée d'avance
 *    hairColumns  : tarifs affichés en colonnes (sans / avec l'option), ex. lissages
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
    { id: "tresses", label: "Tresses (Braids)" },
    { id: "boucles", label: "Courtes & bouclées" },
    { id: "french", label: "French curly" },
    { id: "shuku", label: "Shuku with curls" },
    { id: "twists", label: "Twists & vanilles" },
    { id: "locs", label: "Locs" },
    { id: "nattes", label: "Nattes collées (avec rajout)" },
    { id: "nattes-naturels", label: "Nattes collées (cheveux naturels)" },
    { id: "tissage", label: "Tissage" },
    { id: "homme", label: "Homme" },
    { id: "enfants", label: "Enfants" },
    { id: "soins", label: "Lissage", noHair: true },
    { id: "nails", label: "Kitoko's Nail", noHair: true },
  ],

  families: [
    // ── Tresses ──────────────────────────────────────────────
    {
      id: "knotless", group: "tresses", name: "Knotless braids", sizes: true,
      meches: 15,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 30], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 50], ["bas-fesses", "Bas des fesses", 60]],
    },
    {
      id: "boho-braids", group: "tresses", name: "Boho braids", sizes: true,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 10 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["mi-dos", "Mi-dos", 45], ["bas-dos", "Bas du dos", 55], ["bas-fesses", "Bas des fesses", 65]],
    },
    {
      id: "fulani-braids", group: "tresses", name: "Fulani braids", sizes: true,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 15 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
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
      hair: [{ id: "incluses", label: "Mèches incluses", price: 15 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40]],
    },
    {
      id: "miracle-braids", group: "tresses", name: "Miracle braids", sizes: true,
      meches: 35,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40]],
    },
    {
      id: "tyla", group: "tresses", name: "Tyla braids", sizes: false,
      hair: [
        { id: "tissage", label: "Tissage inclus", price: 30 },
        { id: "human-8", label: "Mèches human hair incluses — taille 8 (200 g)", price: 35 },
        { id: "human-10", label: "Mèches human hair incluses — taille 10 (200 g)", price: 45 },
        { id: "human-12", label: "Mèches human hair incluses — taille 12 (200 g)", price: 50 },
        { id: "human-14", label: "Mèches human hair incluses — taille 14 (200 g)", price: 60 },
        { id: "human-16", label: "Mèches human hair incluses — taille 16 (200 g)", price: 70 },
      ],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 50]],
    },
    {
      id: "jayda-wayda", group: "tresses", name: "Jayda Wayda braids", sizes: false,
      hair: [{ id: "synthetique", label: "Mèche synthétique incluse (crochet)", price: 20 }, { id: "naturel", label: "Tissage naturel inclus (taille 10 à 14)", price: 55 }],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "tems", group: "tresses", name: "Tems braids", sizes: false,
      hair: [{ id: "tissage", label: "Mèches incluses (tissage)", price: 40 }],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 50]],
    },
    {
      id: "layer-dolly", group: "tresses", name: "Layer dolly braids", sizes: false,
      meches: 30,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "patewo", group: "tresses", name: "Patewo", sizes: false,
      meches: 10,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "stick", group: "tresses", name: "Stick braids", sizes: false,
      meches: 15,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },

    // ── Courtes & bouclées ──────────────────────────────────
    {
      id: "french-curly", group: "french", name: "French curly", sizes: true,
      meches: 30,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 40], ["dos", "Dos", 45]],
    },
    {
      id: "short-french-curls", group: "boucles", name: "Short French curls braids", sizes: false,
      meches: 30,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "shuku-curls", group: "shuku", name: "Shuku with curls", sizes: false,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 10 }, { id: "boheme", label: "Mèches bohème incluses", price: 5 }],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "short-lemonade", group: "boucles", name: "Boho short lemonade braids", sizes: false,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 15 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 45]],
    },
    {
      id: "short-bob", group: "boucles", name: "Short bob braids", sizes: false,
      meches: 10,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 40]],
    },
    {
      id: "mermaid", group: "boucles", name: "Mermaid braids", sizes: false,
      meches: 20,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },

    // ── Twists & vanilles ───────────────────────────────────
    {
      id: "vanilles", group: "twists", name: "Vanilles", sizes: true,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 15 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 45], ["bas-fesses", "Bas des fesses", 50]],
    },
    {
      id: "fulani-twist", group: "twists", name: "Fulani twist", sizes: true,
      meches: 15,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 30], ["mi-dos", "Mi-dos", 35], ["bas-dos", "Bas du dos", 45], ["bas-fesses", "Bas des fesses", 60]],
    },
    {
      id: "marley", group: "twists", name: "Marley twist", sizes: false,
      meches: 35,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["dos", "Dos", 40], ["bas-fesses", "Bas des fesses", 50]],
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
      meches: 10,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },
    {
      id: "twist-simple", group: "twists", name: "Twist simple", sizes: false,
      hair: [{ id: "standard", label: "Mèches standard incluses", price: 30 }, { id: "naturelles", label: "Mèches naturelles humaines incluses", price: 60 }],
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule (taille unique)", 35]],
    },
    {
      id: "passion-twist", group: "twists", name: "Passion twist", sizes: true,
      meches: 25,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 35], ["mi-dos", "Mi-dos", 40], ["bas-dos", "Bas du dos", 45]],
    },

    // ── Locs ─────────────────────────────────────────────────
    {
      id: "soft-locs", group: "locs", name: "Soft locs", sizes: true,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 30 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }],
      variantLabel: "Longueur",
      variants: [["mi-dos", "Mi-dos", 35], ["dos", "Dos", 40], ["bas-fesses", "Bas des fesses", 45]],
    },
    {
      id: "butterfly-locs", group: "locs", name: "Butterfly locs", sizes: true,
      meches: 35,
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 50], ["dos", "Dos", 60]],
    },
    {
      id: "invisible-locs", group: "locs", name: "Invisible locs", sizes: false,
      hair: [{ id: "marley-twist", label: "Mèches Marley twist incluses", price: 25 }, { id: "xpression", label: "Mèches X-pression incluses", price: 15 }],
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
      variants: [["unique", "Prix unique (de 40 à 60 locks)", 40]],
    },

    // ── Nattes collées ──────────────────────────────────────
    {
      id: "nattes-rajout", group: "nattes", name: "Nattes collées avec rajout", sizes: true,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 10 }, { id: "boheme", label: "Mèches bohème incluses", price: 5 }],
      variantLabel: "Longueur",
      variants: [["epaule", "Épaule", 20], ["mi-dos", "Mi-dos", 25], ["bas-dos", "Bas du dos", 30], ["bas-fesses", "Bas des fesses", 35]],
    },
    {
      id: "nattes-sans", group: "nattes-naturels", name: "Nattes collées avec cheveux naturels", sizes: false,
      variantLabel: "Style",
      variants: [["simple", "Coiffure simple", 20], ["motif", "Coiffure avec motif", 30]],
    },
    {
      id: "cornrows", group: "nattes", name: "Cornrows", sizes: false,
      meches: 10,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },

    // ── Tissage ─────────────────────────────────────────────
    {
      id: "tissage", group: "tissage", name: "Tissage", sizes: false,
      hair: [
        { id: "premium-boucle-lace", label: "Human hair premium bouclé + lace (taille 14)", price: { ferme: 75 } },
        { id: "premium-lisse", label: "Human hair lisse premium (taille 14)", price: { ferme: 60 } },
        { id: "wave-12-16", label: "Human hair premium bouclé wave (taille 12 à 16)", price: { ouvert: 65 } },
        { id: "wave-16-20", label: "Human hair premium bouclé wave (taille 16 à 20)", price: { ouvert: 80 } },
        { id: "lisse-12-16", label: "Tissage standard lisse (taille 12 à 16)", price: { ouvert: 50 } },
        { id: "lisse-16-20", label: "Tissage standard lisse (taille 16 à 20)", price: { ouvert: 70 } },
      ],
      variantLabel: "Formule",
      variants: [["ferme", "Fermé", 45], ["ouvert", "Ouvert", 40]],
    },

    {
      id: "half-braids", group: "tissage", name: "Half braids / Half sew-in", sizes: false,
      hair: [{ id: "tissage", label: "Tissage inclus", price: 35 }],
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 55]],
    },

    // ── Homme ───────────────────────────────────────────────
    {
      id: "homme", group: "homme", name: "Coiffures homme", sizes: false,
      // Mèches incluses : +5 € partout, +10 € pour les vanilles, rien pour le barrel twist
      hair: [{ id: "incluses", label: "Mèches incluses", price: { vanille: 10, "nattes-libres": 5, "nattes-collees": 5, "zigzag-cornrow": 5, "stitch-cornrow": 5, "filant-twist": 5 } }],
      variantLabel: "Coiffure",
      variants: [["barrel", "Barrel twist", 35], ["vanille", "Vanille", 30], ["nattes-libres", "Nattes libres", 20], ["nattes-collees", "Nattes collées", 20], ["zigzag-cornrow", "Zigzag cornrow", 30], ["stitch-cornrow", "Stitch cornrow", 25], ["filant-twist", "Filant twist", 25]],
    },

    // ── Enfants ─────────────────────────────────────────────
    {
      id: "enfant-braids", group: "enfants", name: "Braids enfant", sizes: false, duration: 240,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 10 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }], variantLabel: "Formule", variants: [["unique", "Toutes tailles", 30]],
    },
    {
      id: "enfant-nattes", group: "enfants", name: "Nattes collées enfant", sizes: false, duration: 120,
      meches: 5, variantLabel: "Style", variants: [["simple", "Simple", 25], ["complexe", "Complexe (motifs)", 35]],
    },
    {
      id: "enfant-nattes-libres", group: "enfants", name: "Nattes libres enfant", sizes: false, duration: 120,
      meches: 5, variantLabel: "Formule", variants: [["unique", "Prix unique", 20]],
    },
    {
      id: "enfant-tresses-fil", group: "enfants", name: "Tresses au fil + coiffe", sizes: false, duration: 120,
      hair: [{ id: "laine", label: "Laine brésilienne incluse", price: 25 }], hairTitle: "Laine", hairNone: "J'apporte la laine",
      variantLabel: "Formule", variants: [["unique", "Prix unique", 30]],
    },
    {
      id: "enfant-fulani", group: "enfants", name: "Fulani enfant (twist / braids)", sizes: false, duration: 180,
      hair: [{ id: "incluses", label: "Mèches incluses", price: 10 }, { id: "boho-synth", label: "Mèches boho synthétiques incluses", price: 15 }, { id: "boho-human", label: "Mèches boho human hair incluses", price: 35 }], variantLabel: "Formule", variants: [["unique", "Prix unique", 25]],
    },
    {
      id: "enfant-lemonade", group: "enfants", name: "Lemonade braids enfant", sizes: false, duration: 180,
      meches: 5, variantLabel: "Formule", variants: [["unique", "Prix unique", 25]],
    },
    {
      id: "enfant-shuku", group: "enfants", name: "Shuku braids enfant", sizes: false, duration: 120,
      meches: 5, variantLabel: "Formule", variants: [["unique", "Prix unique", 20]],
    },
    {
      id: "enfant-vanilles", group: "enfants", name: "Vanilles enfant", sizes: false, duration: 150,
      meches: 5, variantLabel: "Formule", variants: [["unique", "Prix unique", 25]],
    },
    {
      id: "enfant-butterfly", group: "enfants", name: "Butterfly kids", sizes: false, duration: 180,
      meches: 25, variantLabel: "Formule", variants: [["unique", "Prix unique", 25]],
    },

    // ── Soins & lissage ─────────────────────────────────────
    {
      id: "lissage-tanin", group: "soins", name: "Lissage au tanin", sizes: false, duration: 240,
      hair: [{ id: "produits", label: "Produits inclus", price: { courts: 50, "mi-longs": 80, longs: 80, "tres-longs": 70 } }],
      hairTitle: "Produits", hairNone: "Sans produits", hairDefault: "produits", hairColumns: true,
      note: "Tient 5 à 6 mois",
      variantLabel: "Longueur",
      variants: [["courts", "Courts (au-dessus des épaules)", 95], ["mi-longs", "Mi-longs (épaules / clavicules)", 110], ["longs", "Longs (milieu du dos)", 130], ["tres-longs", "Très longs, très épais ou afro", 165]],
    },
    {
      id: "lissage-keratine", group: "soins", name: "Lissage à la kératine", sizes: false, duration: 240,
      hair: [{ id: "produits", label: "Produits inclus", price: { courts: 30, "mi-longs": 60, longs: 60, "tres-longs": 50 } }],
      hairTitle: "Produits", hairNone: "Sans produits", hairDefault: "produits", hairColumns: true,
      note: "Tient 5 à 6 mois",
      variantLabel: "Longueur",
      variants: [["courts", "Courts (au-dessus des épaules)", 95], ["mi-longs", "Mi-longs (épaules / clavicules)", 110], ["longs", "Longs (milieu du dos)", 130], ["tres-longs", "Très longs, très épais ou afro", 165]],
    },
    {
      id: "brushing", group: "soins", name: "Brushing", sizes: false, duration: 60,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 30]],
    },
    {
      id: "lissage-temporaire", group: "soins", name: "Lissage temporaire (normal)", sizes: false, duration: 90,
      variantLabel: "Formule",
      variants: [["unique", "Prix unique", 35]],
    },
    {
      id: "defrisage", group: "soins", name: "Défrisage (produits chimiques)", sizes: false, duration: 120,
      hair: [{ id: "produits", label: "Produits inclus", price: 15 }], hairTitle: "Produits", hairNone: "Sans produits",
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
