/**
 * Générateur pseudo-aléatoire déterministe.
 *
 * Même graine (texte) => même suite de nombres => même visuel à chaque build.
 * C'est ce qui permet de produire des pochettes uniques par projet sans
 * stocker la moindre image, tout en gardant un rendu stable dans le temps.
 *
 * xmur3 : fonction de hachage 32 bits pour transformer un texte en entier.
 * mulberry32 : PRNG rapide et correct pour de l'aléatoire visuel (pas cryptographique).
 */

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Alea {
  /** Flottant dans [0, 1). */
  next(): number;
  /** Flottant dans [min, max). */
  range(min: number, max: number): number;
  /** Entier dans [min, max] inclus. */
  int(min: number, max: number): number;
  /** Élément tiré au hasard dans un tableau non vide. */
  pick<T>(arr: readonly T[]): T;
  /** true avec la probabilité p (0 à 1). */
  chance(p: number): boolean;
}

/** Crée un générateur à partir d'une graine textuelle. */
export function alea(seed: string): Alea {
  const nextSeed = xmur3(seed);
  const rand = mulberry32(nextSeed());
  const next = () => rand();
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)]!,
    chance: (p) => next() < p,
  };
}
