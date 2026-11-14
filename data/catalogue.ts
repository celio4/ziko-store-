import { PRODUITS } from './produits';
import type { Produit } from './types';

/** Durée du chargement simulé, demandée par le sujet : une seconde. */
export const DELAI_CHARGEMENT_MS = 1000;

/** Options de démonstration pour tester les états de l'écran liste. */
export type OptionsChargement = {
  /** Simule une panne pour afficher l'état d'erreur. */
  simulerErreur?: boolean;
  /** Simule un catalogue vide. */
  simulerVide?: boolean;
};

/** Petite pause asynchrone. */
function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Charge le catalogue.
 * Il n'y a pas de serveur : on renvoie les données locales après une seconde,
 * pour imiter un appel réseau et montrer l'indicateur de chargement.
 */
export async function chargerProduits(options: OptionsChargement = {}): Promise<Produit[]> {
  await attendre(DELAI_CHARGEMENT_MS);

  if (options.simulerErreur) {
    throw new Error('Erreur de chargement simulée');
  }
  if (options.simulerVide) {
    return [];
  }
  // Copie du tableau : l'écran ne peut pas modifier les données d'origine.
  return [...PRODUITS];
}
