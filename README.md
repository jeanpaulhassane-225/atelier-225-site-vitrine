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

### Côté serveur (bloquant)

`.github/workflows/ci.yml` lance `npm ci`, `npm run check` puis `npm run build`
à chaque push sur `main` et à chaque pull request qui vise `main`. C'est la même
chaîne que `npm run verifier` en local.

Un **ruleset GitHub** sur `main` rend le job `check + build` **obligatoire** :
un commit ne peut atterrir sur `main` que si la CI est passée dessus. Sont aussi
bloqués le force-push (`non_fast_forward`) et la suppression de la branche. Aucune
dérogation, y compris pour le propriétaire.

Conséquence sur le flux de travail : **on ne pousse plus en direct sur `main`**.

```bash
git switch -c ma-branche
# ... commits ...
git push -u origin ma-branche
# ouvrir une PR, attendre la CI verte, fusionner
```

La politique « branche à jour avant fusion » est active : si `main` a bougé,
rebase ta branche avant de fusionner. Pour la relâcher, retirer
`strict_required_status_checks_policy` du ruleset (Settings → Rules).

### Côté local (pré-contrôle rapide)

Un hook git `pre-push` (`.githooks/pre-push`) lance `npm run verifier` avant
tout push **vers `main`** et refuse le push s'il échoue. Il évite d'ouvrir une
PR pour découvrir un typo trois minutes plus tard. Il s'active tout seul après
`npm install` (script `postinstall` → `scripts/setup-hooks.mjs`, qui pose
`git config core.hooksPath .githooks`). Pour l'activer à la main :

```bash
git config core.hooksPath .githooks
```

Contournable avec `git push --no-verify` ; c'est un confort local, l'enforcement
réel est le ruleset côté serveur.

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

`npm run build` produit un dossier `dist/` de fichiers statiques, hébergeable partout.
Cible retenue : **Cloudflare Pages**, connecté au dépôt GitHub.

### Cloudflare Pages via l'intégration Git (recommandé)

Chaque push sur `main` déclenche un build et un déploiement ; chaque PR reçoit
un déploiement de prévisualisation. Aucun secret à stocker dans GitHub.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Autoriser GitHub, choisir le dépôt `atelier-225-site-vitrine`.
3. Réglages de build (Cloudflare détecte le préréglage « Astro », sinon manuellement) :
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`  (déjà déclaré dans `wrangler.toml`)
   - **Root directory** : laisser vide
   - La version de Node est lue depuis `.nvmrc` (24)
4. **Save and Deploy**. L'URL `https://atelier-225-site-vitrine.pages.dev` est en ligne à la fin du build.

`public/_headers` ajoute quelques en-têtes de sécurité et un cache long sur `/_astro/*`.

### Déploiement piloté par GitHub Actions

`.github/workflows/deploy.yml` déploie sur Cloudflare Pages via
`cloudflare/wrangler-action` : production sur chaque push vers `main`,
prévisualisation sur chaque pull request, plus un déclenchement manuel.

Le job est **inerte tant que le secret `CLOUDFLARE_API_TOKEN` n'est pas
configuré** (il apparaît comme « skipped », pas en échec). Pour l'activer :

1. **Créer un token API Cloudflare** : dash.cloudflare.com → *My Profile* →
   *API Tokens* → *Create Token* → *Custom token*, permission
   **Account → Cloudflare Pages → Edit**.
2. **Récupérer l'Account ID** : visible dans *Workers & Pages* (colonne de droite).
3. **Ajouter les deux secrets au dépôt** :

   ```bash
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID
   ```

Au premier passage, le workflow crée le projet Pages `atelier-225-site-vitrine`
s'il n'existe pas. Version de `wrangler` figée dans le workflow (`4.129.1`), à
bumper d'une ligne au besoin.

Déploiement manuel en local : `npm run deploy` (nécessite d'être connecté à
Cloudflare, `npx wrangler login`).

> Choisir **une seule** des deux méthodes. L'intégration Git et ce workflow
> déploieraient tous les deux à chaque push.

### Avant la mise en ligne

- Mettre le vrai domaine dans `astro.config.mjs` (`site:`), il sert au sitemap et à l'Open Graph.
- Remplacer la marque et les noms de clients placeholder (voir plus haut).

## Accessibilité

Vérifié : lien d'évitement, structure de titres, `aria-current` sur la page active,
focus visible partout, menu mobile clavier (`aria-expanded`, `Échap`), formulaire
avec libellés, `autocomplete`, erreurs en ligne et gestion du focus, respect de
`prefers-reduced-motion`, contrastes tenus sur fond sombre, thème `color-scheme: dark`
et `theme-color`.
