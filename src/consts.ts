/**
 * Source de vérité unique du site.
 * Pour changer le nom de la marque, les coordonnées ou le menu, tout se passe ici.
 */

export const SITE = {
  /** Nom court, affiché dans le logo et le pied de page. */
  nom: 'Atelier 225',
  /** Nom complet, utilisé dans la balise <title> et les données structurées. */
  nomComplet: 'Atelier 225 — studio de création',
  /** Phrase d'accroche, une ligne. */
  baseline: 'Studio de création sonore, visuelle et éditoriale. Abidjan.',
  /** Description par défaut pour le référencement (150-160 caractères). */
  description:
    'Atelier 225 accompagne artistes et marques d’Abidjan : production musicale, ingénierie du son, réalisation audiovisuelle et publi-reportage, du premier repère au master.',
  /** Domaine de production, sans barre oblique finale. Doit coïncider avec astro.config.mjs. */
  url: 'https://atelier225.ci',
  langue: 'fr',
  /** Fuseau, pour un futur affichage de dates. */
  fuseau: 'Africa/Abidjan',
  ville: 'Abidjan, Côte d’Ivoire',

  /* --- Coordonnées (remplacer par les vraies valeurs) --- */
  email: 'bonjour@atelier225.ci',
  /** Format lisible ; le lien tel: est dérivé automatiquement. */
  telephone: '+225 07 07 07 07 07',

  /**
   * Endpoint du formulaire de contact.
   * Vide  -> le formulaire bascule sur un lien mailto: (aucun serveur requis).
   * Sinon -> URL qui reçoit un POST (par exemple une clé Web3Forms : https://api.web3forms.com/submit).
   * Voir le README, section « Formulaire de contact ».
   */
  formulaireEndpoint: '',

  reseaux: [
    { label: 'Instagram', url: 'https://instagram.com/' },
    { label: 'YouTube', url: 'https://youtube.com/' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/' },
  ],
} as const;

/** Menu principal, réutilisé dans l'en-tête et le pied de page. */
export const NAV = [
  { label: 'Studio', href: '/studio' },
  { label: 'Services', href: '/services' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Contact', href: '/contact' },
] as const;

export interface Service {
  slug: string;
  titre: string;
  resume: string;
  points: string[];
  /** Couleur d'accent du bloc, format hexadécimal. */
  accent: string;
}

/** Les prestations, dans l'ordre d'affichage. */
export const SERVICES: Service[] = [
  {
    slug: 'production-musicale',
    titre: 'Production musicale',
    resume:
      'De la première idée au morceau fini : composition, beatmaking, arrangement et direction artistique.',
    points: [
      'Composition originale et adaptation',
      'Beatmaking, programmation rythmique, sound selection',
      'Arrangement et pré-production',
      'Direction artistique de projet (EP, album, bande originale)',
    ],
    accent: '#F2A541',
  },
  {
    slug: 'ingenierie-du-son',
    titre: 'Ingénierie du son',
    resume:
      'Un son propre, dense et prêt pour la diffusion : prise de son, mixage et mastering.',
    points: [
      'Prise de son voix et instruments',
      'Édition, montage, accordage, calage rythmique',
      'Mixage stéréo et écoute translation',
      'Mastering pour le streaming, le disque et la diffusion radio',
    ],
    accent: '#3FA7A1',
  },
  {
    slug: 'sound-design',
    titre: 'Sound design & habillage',
    resume:
      'L’identité sonore d’une marque, d’un film, d’un podcast ou d’un jeu : bruitage, ambiances, signatures.',
    points: [
      'Charte et logo sonores',
      'Ambiances, textures, nappes',
      'Bruitage et synchronisation image',
      'Habillage de podcast et de série',
    ],
    accent: '#8A6CF0',
  },
  {
    slug: 'audiovisuel',
    titre: 'Réalisation audiovisuelle',
    resume:
      'L’image au service du morceau ou de la marque : clips, captations live, motion design et montage.',
    points: [
      'Clip et vidéo performance',
      'Captation de concert multi-caméras',
      'Motion design et habillage graphique',
      'Montage, étalonnage, livraison multi-formats',
    ],
    accent: '#D9553B',
  },
  {
    slug: 'publi-reportage',
    titre: 'Publi-reportage',
    resume:
      'Le récit d’une activité, d’un lieu ou d’un métier : on filme, on écrit, on monte le reportage de marque.',
    points: [
      'Repérage et écriture du fil narratif',
      'Tournage documentaire léger',
      'Interviews et voix off',
      'Article, montage et déclinaisons réseaux',
    ],
    accent: '#B6D94C',
  },
];

/** Étapes de collaboration, affichées sur la page Services. */
export const PROCESS = [
  {
    titre: 'Écoute',
    texte: 'On part de la référence, de l’intention et du calendrier. Devis clair, jalons posés.',
  },
  {
    titre: 'Direction',
    texte: 'Maquette, choix esthétiques, allers-retours cadrés. On valide avant de produire.',
  },
  {
    titre: 'Production',
    texte: 'Prise, montage, mixage ou tournage. Points d’étape réguliers, aucune surprise.',
  },
  {
    titre: 'Livraison',
    texte: 'Masters et fichiers sources remis, formats adaptés à chaque canal de diffusion.',
  },
] as const;
