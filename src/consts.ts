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
  { label: 'FAQ', href: '/faq' },
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

export interface FaqItem {
  /** Regroupement thématique, affiché comme intertitre sur la page FAQ. */
  theme: string;
  question: string;
  reponse: string;
}

/**
 * Questions fréquentes de la page FAQ, dans l'ordre d'affichage.
 * Les items d'un même thème doivent rester groupés (la page les regroupe par
 * ordre de première apparition, sans tri supplémentaire).
 *
 * Notes de contenu, à garder en tête pour les prochaines relectures :
 * - Tarifs : uniquement des fourchettes indicatives (« à partir de », « entre X et Y »).
 *   Le chiffrage ferme reste renvoyé vers /contact, jamais annoncé ici comme définitif.
 * - Zones d'intervention : les communes précises d'Abidjan ne sont pas encore
 *   validées par Jean Paul. En attendant, la réponse reste volontairement générale
 *   et renvoie vers le formulaire de contact plutôt que d'inventer une liste.
 * - Les espaces insecables suivent la meme convention typographique que le
 *   reste du site (avant les points d'interrogation et les deux-points, et
 *   comme separateur de milliers). Ce sont ici de vrais caracteres Unicode
 *   (U+00A0) tapes directement dans la chaine, pas l'entite HTML nbsp : ce
 *   texte passe par des accolades d'expression dans les pages, et une
 *   entite HTML litterale s'y afficherait telle quelle au lieu d'etre
 *   interpretee.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    theme: 'Délais',
    question: 'Combien de temps faut-il pour un morceau produit et mixé ?',
    reponse:
      'Comptez en moyenne deux à quatre semaines entre la première séance et le master livré, selon le nombre de titres et les allers-retours de validation. Un mixage seul, sur un morceau déjà enregistré, se boucle souvent en une semaine.',
  },
  {
    theme: 'Délais',
    question: 'Et pour un clip, une captation ou un publi-reportage ?',
    reponse:
      'Le tournage se cale sur votre calendrier ; comptez ensuite une à trois semaines de montage et d’étalonnage selon la longueur du format et le nombre de versions demandées.',
  },
  {
    theme: 'Délais',
    question: 'Peut-on accélérer une commande urgente ?',
    reponse:
      'Dans certains cas, oui, avec une majoration liée au calendrier resserré. Indiquez votre échéance dès le premier contact : on vous dit tout de suite si elle est tenable.',
  },
  {
    theme: 'Tarifs',
    question: 'Combien coûte une prestation chez Atelier 225 ?',
    reponse:
      'Ça dépend du métier, de la durée et de la complexité du projet. À titre indicatif, un mixage démarre autour de 50 000 FCFA le morceau, une captation ou un clip se situe le plus souvent entre 300 000 et 1 500 000 FCFA selon le format. Le montant exact est toujours confirmé par un devis écrit avant le démarrage.',
  },
  {
    theme: 'Tarifs',
    question: 'Le devis est-il gratuit et sans engagement ?',
    reponse:
      'Oui. Décrivez votre projet via le formulaire de contact, vous recevez une proposition chiffrée sous 48 h ouvrées, sans obligation de donner suite.',
  },
  {
    theme: 'Tarifs',
    question: 'Un acompte est-il demandé au démarrage ?',
    reponse:
      'Pour les projets de plus grande ampleur, un acompte au lancement et un solde à la livraison sont la règle. Les modalités précises se discutent au moment du devis.',
  },
  {
    theme: 'Zones d’intervention',
    question: 'Intervenez-vous partout à Abidjan ?',
    reponse:
      'Le studio est basé à Abidjan et l’équipe se déplace pour les prises de son, les tournages et les captations selon les besoins du projet. Indiquez votre quartier au moment du contact : la faisabilité et d’éventuels frais de déplacement sont confirmés avec le devis.',
  },
  {
    theme: 'Zones d’intervention',
    question: 'Travaillez-vous avec des clients hors d’Abidjan ou de la diaspora ?',
    reponse:
      'Oui. Une bonne partie des échanges (brief, validations, livraison des fichiers) se fait déjà à distance. Pour un tournage ou une captation en dehors d’Abidjan, écrivez-nous : on regarde ensemble ce qui est possible.',
  },
  {
    theme: 'Livrables',
    question: 'Sous quel format je récupère mes fichiers ?',
    reponse:
      'Pour l’audio : fichiers WAV haute définition et versions compressées prêtes pour le streaming. Pour l’image : fichiers vidéo en haute définition, avec des déclinaisons pour les réseaux (format carré, vertical) quand le projet le prévoit.',
  },
  {
    theme: 'Livrables',
    question: 'Est-ce que je récupère les fichiers sources (pistes, rushes) ?',
    reponse:
      'Sur demande, et selon la formule choisie. Précisez ce besoin dès le devis : la remise des sources s’organise différemment d’une simple livraison de master.',
  },
  {
    theme: 'Livrables',
    question: 'Comment les fichiers sont-ils transmis, en pratique ?',
    reponse:
      'Par lien de téléchargement, adapté au poids des fichiers audio et vidéo haute définition. Le lien reste actif assez longtemps pour que vous récupériez tout sans précipitation.',
  },
  {
    theme: 'Commande',
    question: 'Comment se passe une commande, du premier message à la livraison ?',
    reponse:
      'En quatre temps : écoute du besoin et devis, direction artistique et validation d’une maquette, production, puis livraison des masters et fichiers sources. Le détail de chaque étape est présenté sur la page Services.',
  },
  {
    theme: 'Commande',
    question: 'Dois-je déjà tout savoir avant de vous écrire ?',
    reponse:
      'Non. Une intention, un calendrier approximatif et une ou deux références qui vous parlent suffisent pour démarrer l’échange. Le reste s’affine ensemble.',
  },
  {
    theme: 'Commande',
    question: 'Puis-je demander des retouches après la première livraison ?',
    reponse:
      'Un round de retouches raisonnable est inclus dans la plupart des prestations, précisé dans le devis. Au-delà, les allers-retours supplémentaires sont chiffrés séparément.',
  },
];
