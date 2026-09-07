// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // URL de production. Sert au sitemap, aux URL canoniques et aux balises Open Graph.
  // À remplacer par le vrai domaine au moment du déploiement.
  site: 'https://atelier225.ci',

  // Astro accepte /catalogue comme /catalogue/ sans redirection forcée.
  trailingSlash: 'ignore',

  // Précharge les pages liées quand le lien entre dans le viewport : navigation quasi instantanée.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  build: {
    // Inline les petites feuilles de style dans le <head>, garde les grosses en fichier séparé.
    inlineStylesheets: 'auto',
  },
});
