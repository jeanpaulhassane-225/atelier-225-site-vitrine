# Atelier 225 — site vitrine

Site vitrine d'un studio de création sonore, visuelle et éditoriale.
Rendu **statique**, aucune base de données, aucun service tiers obligatoire.

## Stack

| Choix | Pourquoi |
|---|---|
| **Astro 5** | Générateur orienté contenu. Rend chaque page en HTML à la compilation. Par défaut, **zéro JavaScript** envoyé au navigateur. |
| **Îlots** (`islands`) | Seuls trois morceaux embarquent du JS : menu mobile, filtre du catalogue, validation du formulaire. Le reste est du HTML pur. |
| **TypeScript strict** | Le contenu du catalogue est validé par un schéma (`src/content.config.ts`). Un champ oublié casse le build, pas la page en production. |
| **CSS natif moderne** | Couches `@layer`, imbrication, `color-mix()`, requêtes de conteneur, `:has()`. Aucune dépendance CSS, aucune étape de compilation Tailwind. |
| **Polices auto-hébergées** | `@fontsource-variable/*` : Fraunces (titres) et Inter (texte) sont dans le bundle. Aucun appel à Google Fonts, rien à charger depuis un domaine tiers. |
| **View Transitions** | `<ClientRouter />` : la navigation entre pages est fondue, sans rechargement complet. |

Poids du JavaScript expédié : environ **2,4 ko** (menu + filtre + formulaire), plus le routeur de transitions d'Astro (~4,5 ko gzip), chargé à la demande.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build     # génère dist/
npm run preview   # sert dist/ en local pour vérifier avant déploiement
npm run check     # vérification TypeScript + Astro
npm run verifier  # check + build, reproduit exactement la CI (à lancer avant un commit)
```

Node 18.20.8+ requis. La version de référence est dans `.nvmrc` (Node 24), utilisée par la CI et localement si tu as nvm.

## Intégration continue

`.github/workflows/ci.yml` lance `npm ci`, `npm run check` puis `npm run build`
à chaque push sur `main` et à chaque pull request qui vise `main`. C'est la même
chaîne que `npm run verifier` en local.

Pour rendre ce contrôle **bloquant** avant fusion, il faut activer la protection
de branche dans les réglages GitHub du dépôt (Settings → Branches, ou Rulesets),
et cocher « Require status checks to pass » avec le job `check + build`. Cette
option n'est pas disponible sur un dépôt privé en offre GitHub gratuite : passer
le dépôt public, ou prendre GitHub Pro/Team.

## Structure

```
src/
├── consts.ts              Nom de marque, coordonnées, menu, services. SOURCE DE VÉRITÉ.
├── content.config.ts      Schéma du catalogue (Zod).
├── content/catalogue/     Un fichier .md par réalisation.
├── layouts/Base.astro     <head>, SEO, Open Graph, données structurées, en-tête, pied de page.
├── components/
│   ├── Header / Footer     Navigation, menu mobile.
│   ├── Hero / CtaBand      Blocs d'accroche réutilisables.
│   ├── CoverArt.astro      Pochette générative SVG (voir plus bas).
│   ├── CatalogCard / CatalogGrid   Cartes + filtre synchronisé à l'URL.
│   ├── ServiceCard.astro
│   └── ContactForm.astro
├── lib/
│   ├── seededRandom.ts     PRNG déterministe (graine texte -> visuel stable).
│   └── format.ts           Intl : nombres, listes, lien tel:.
├── pages/
│   ├── index.astro
│   ├── catalogue/index.astro       + [slug].astro (fiche par réalisation)
│   ├── services.astro / studio.astro / contact.astro
│   └── 404.astro
└── styles/
    ├── tokens.css          Jetons de design (couleur, échelle typo, espacement).
    └── global.css          Reset, base, composants, utilitaires.
```

## Tâches courantes

### Changer le nom de la marque

Tout est dans **`src/consts.ts`** : objet `SITE` (nom, baseline, e-mail, téléphone,
réseaux, ville) et tableau `NAV`. Un seul fichier à éditer.
Pensez aussi à `site:` dans `astro.config.mjs` (domaine de production).

### Ajouter une réalisation au catalogue

Créer un fichier dans `src/content/catalogue/`, par exemple `mon-projet.md` :

```markdown
---
titre: 'Mon projet'
type: 'projet'                # 'projet' (client) ou 'sortie' (signé studio)
categorie: 'Audiovisuel'      # Musique | Ingénierie du son | Sound design | Audiovisuel | Publi-reportage
annee: 2026
role: 'Réalisation, montage'
client: 'Nom du client'       # facultatif
resume: 'Une à deux phrases pour la carte.'
accent: '#3FA7A1'             # couleur hexadécimale, pilote la pochette générée
aLaUne: true                  # remonte sur la page d'accueil
ordre: 3                      # tri croissant
credits:
  - { role: 'Mixage', nom: 'Atelier 225' }
liens:
  - { label: 'Voir', url: 'https://exemple.com/projet' }
---

Le texte de la fiche, en Markdown.
```

La page `/catalogue/mon-projet` est générée automatiquement, avec navigation
précédent / suivant.

### Remplacer une pochette générée par une vraie image

Les pochettes sont des SVG calculés à partir du champ `seed` (ou de l'identifiant
du fichier). Pour utiliser une photo :

1. Placer l'image dans `src/assets/` (elle sera optimisée par Astro).
2. Dans `src/components/CatalogCard.astro` et `src/pages/catalogue/[slug].astro`,
   remplacer `<CoverArt ... />` par le composant `<Image />` d'`astro:assets` :

```astro
---
import { Image } from 'astro:assets';
import cover from '../assets/mon-projet.jpg';
---
<Image src={cover} alt={`Pochette — ${d.titre}`} width={800} height={600} />
```

On peut aussi ne remplacer que certaines pochettes et garder le génératif pour les autres.

### Brancher le formulaire de contact

Par défaut, le formulaire ouvre le client mail de l'internaute (lien `mailto:`),
sans serveur. Pour recevoir les messages par e-mail sans back-end :

1. Créer une clé gratuite sur [web3forms.com](https://web3forms.com) (ou Formspree, Basin…).
2. Dans `src/consts.ts`, renseigner `SITE.formulaireEndpoint` :
   `formulaireEndpoint: 'https://api.web3forms.com/submit'`
3. Ajouter un champ caché avec la clé dans `src/components/ContactForm.astro` :
   `<input type="hidden" name="access_key" value="VOTRE_CLE" />`

Le formulaire passe alors en envoi asynchrone (`fetch`), avec message de confirmation
en ligne. Un piège à robots (champ `_pot`) est déjà en place.

## Déploiement

`npm run build` produit un dossier `dist/` de fichiers statiques. Il s'héberge partout :

- **Netlify / Vercel / Cloudflare Pages** : commande de build `npm run build`, dossier `dist`.
- **GitHub Pages** : publier le contenu de `dist/`.
- **Serveur classique** : copier `dist/` dans la racine web.

Penser à mettre le vrai domaine dans `astro.config.mjs` (`site:`) avant le build final.

## Accessibilité

Vérifié : lien d'évitement, structure de titres, `aria-current` sur la page active,
focus visible partout, menu mobile clavier (`aria-expanded`, `Échap`), formulaire
avec libellés, `autocomplete`, erreurs en ligne et gestion du focus, respect de
`prefers-reduced-motion`, contrastes tenus sur fond sombre, thème `color-scheme: dark`
et `theme-color`.
