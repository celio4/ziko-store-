import type { LigneCommande } from '@/data/types';

/** La quantité d'un article ne descend jamais sous 1. */
export const QUANTITE_MIN = 1;
/** Plafond raisonnable pour une commande de démonstration. */
export const QUANTITE_MAX = 99;

/**
 * Ramène une quantité dans l'intervalle autorisé [1, 99].
 * Une valeur non entière est arrondie ; une valeur invalide donne 1.
 */
export function bornerQuantite(quantite: number): number {
  if (!Number.isFinite(quantite)) {
    return QUANTITE_MIN;
  }
  return Math.min(QUANTITE_MAX, Math.max(QUANTITE_MIN, Math.round(quantite)));
}

/** Sous-total d'une ligne : prix unitaire × quantité. */
export function calculerSousTotal(ligne: LigneCommande): number {
  return ligne.produit.prix * ligne.quantite;
}

/** Total de la commande : somme des sous-totaux de toutes les lignes. */
export function calculerTotal(lignes: readonly LigneCommande[]): number {
  return lignes.reduce((total, ligne) => total + calculerSousTotal(ligne), 0);
}

/** Nombre total d'articles (somme des quantités). */
export function compterArticles(lignes: readonly LigneCommande[]): number {
  return lignes.reduce((nombre, ligne) => nombre + ligne.quantite, 0);
}

/** « 1 article », « 3 articles » : accord du mot selon le nombre. */
export function libelleArticles(nombre: number): string {
  return `${nombre} ${nombre > 1 ? 'articles' : 'article'}`;
}
