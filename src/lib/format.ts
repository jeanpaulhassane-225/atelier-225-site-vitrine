import { SITE } from '../consts';

/**
 * Formatage localisé. On passe par l'API Intl plutôt que par des chaînes
 * codées en dur : les séparateurs et l'ordre suivent la locale du site.
 */

const nombreFr = new Intl.NumberFormat(SITE.langue);
const listeFr = new Intl.ListFormat(SITE.langue, { style: 'long', type: 'conjunction' });

/** 1200 -> « 1 200 ». Ne pas utiliser pour une année. */
export function nombre(n: number): string {
  return nombreFr.format(n);
}

/** Année brute, sans séparateur de milliers : 2025 -> « 2025 ». */
export function annee(n: number): string {
  return String(n);
}

/** ['voix', 'guitare', 'basse'] -> « voix, guitare et basse ». */
export function liste(parts: string[]): string {
  return listeFr.format(parts);
}

/** Transforme un numéro affichable en lien tel: (garde le + et les chiffres). */
export function lienTel(numero: string): string {
  return 'tel:' + numero.replace(/[^\d+]/g, '');
}
