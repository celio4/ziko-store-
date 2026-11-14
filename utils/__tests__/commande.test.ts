import { describe, expect, it } from '@jest/globals';

import { trouverProduit } from '@/data/produits';
import type { LigneCommande, Produit } from '@/data/types';
import {
  bornerQuantite,
  calculerSousTotal,
  calculerTotal,
  compterArticles,
  libelleArticles,
  QUANTITE_MAX,
} from '../commande';

/** Récupère un produit du catalogue (le test échoue s'il n'existe pas). */
function produit(id: number): Produit {
  const trouve = trouverProduit(id);
  if (!trouve) throw new Error(`Produit ${id} absent`);
  return trouve;
}

describe('bornerQuantite', () => {
  it('ne descend jamais sous 1', () => {
    expect(bornerQuantite(0)).toBe(1);
    expect(bornerQuantite(-3)).toBe(1);
    expect(bornerQuantite(1)).toBe(1);
  });

  it('plafonne la quantité', () => {
    expect(bornerQuantite(QUANTITE_MAX + 1)).toBe(QUANTITE_MAX);
  });

  it('arrondit et gère les valeurs invalides', () => {
    expect(bornerQuantite(2.6)).toBe(3);
    expect(bornerQuantite(Number.NaN)).toBe(1);
    expect(bornerQuantite(Number('abc'))).toBe(1);
  });
});

describe('calcul du total', () => {
  // Baskets (87 500 FC) × 2 et écouteurs (32 000 FC) × 1.
  const lignes: LigneCommande[] = [
    { produit: produit(1), quantite: 2 },
    { produit: produit(3), quantite: 1 },
  ];

  it('calcule le sous-total d’une ligne', () => {
    expect(calculerSousTotal(lignes[0])).toBe(175000);
  });

  it('additionne toutes les lignes', () => {
    expect(calculerTotal(lignes)).toBe(207000);
  });

  it('vaut 0 pour une commande vide', () => {
    expect(calculerTotal([])).toBe(0);
  });

  it('suit chaque changement de quantité', () => {
    const uneLigne = (quantite: number): LigneCommande[] => [{ produit: produit(5), quantite }];
    expect(calculerTotal(uneLigne(1))).toBe(115000);
    expect(calculerTotal(uneLigne(2))).toBe(230000);
    expect(calculerTotal(uneLigne(3))).toBe(345000);
  });

  it('compte les articles', () => {
    expect(compterArticles(lignes)).toBe(3);
    expect(compterArticles([])).toBe(0);
  });
});

describe('libelleArticles', () => {
  it('accorde le mot « article »', () => {
    expect(libelleArticles(0)).toBe('0 article');
    expect(libelleArticles(1)).toBe('1 article');
    expect(libelleArticles(6)).toBe('6 articles');
  });
});
