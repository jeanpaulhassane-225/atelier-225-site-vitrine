import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Le catalogue est alimenté par les fichiers Markdown de src/content/catalogue/.
 * Le schéma Zod ci-dessous est vérifié à chaque build : un champ manquant ou
 * mal typé arrête la compilation au lieu de produire une page cassée.
 */
const catalogue = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/catalogue' }),
  schema: z.object({
    titre: z.string(),
    /** « sortie » = projet signé Atelier 225 ; « projet » = travail pour un client. */
    type: z.enum(['sortie', 'projet']),
    categorie: z.enum([
      'Musique',
      'Ingénierie du son',
      'Sound design',
      'Audiovisuel',
      'Publi-reportage',
    ]),
    annee: z.number().int().min(2000).max(2100),
    /** Rôle tenu par le studio sur ce projet. */
    role: z.string(),
    client: z.string().optional(),
    /** Résumé court affiché sur la carte (une à deux phrases). */
    resume: z.string(),
    /** Couleur d'accent de la pochette générée, format hexadécimal. */
    accent: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Couleur hexadécimale à 6 chiffres attendue')
      .default('#F2A541'),
    /** Graine du visuel génératif. Par défaut : dérivée de l'identifiant du fichier. */
    seed: z.string().optional(),
    duree: z.string().optional(),
    credits: z
      .array(z.object({ role: z.string(), nom: z.string() }))
      .default([]),
    liens: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .default([]),
    /** Mise en avant sur la page d'accueil. */
    aLaUne: z.boolean().default(false),
    /** Ordre de tri croissant ; les petites valeurs remontent. */
    ordre: z.number().default(100),
  }),
});

export const collections = { catalogue };
