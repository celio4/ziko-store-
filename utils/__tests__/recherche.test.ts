import { describe, expect, it } from '@jest/globals';

import { PRODUITS } from '@/data/produits';
import { filtrerProduits, normaliserTexte } from '../recherche';

/** Noms des produits trouvés, pour des assertions lisibles. */
const noms = (recherche: string, categorie: Parameters<typeof filtrerProduits>[2] = null) =>
  filtrerProduits(PRODUITS, recherche, categorie).map((produit) => produit.nom);

describe('normaliserTexte', () => {
  it('met en minuscules et retire les accents', () => {
    expect(normaliserTexte('Écouteurs')).toBe('ecouteurs');
    expect(normaliserTexte('Sac à main')).toBe('sac a main');
    expect(normaliserTexte('Montre connectée')).toBe('montre connectee');
    expect(normaliserTexte('ŒUVRE Ça')).toBe('oeuvre ca');
  });

  it('retire les espaces superflues', () => {
    expect(normaliserTexte('  robe   en  pagne ')).toBe('robe en pagne');
  });
});

describe('filtrerProduits', () => {
  it('renvoie tout le catalogue pour une recherche vide', () => {
    expect(filtrerProduits(PRODUITS, '')).toHaveLength(6);
    expect(filtrerProduits(PRODUITS, '   ')).toHaveLength(6);
  });

  it('ignore la casse', () => {
    expect(noms('ROBE')).toEqual(['Robe en pagne']);
    expect(noms('chemise')).toEqual(['Chemise en lin']);
  });

  it('ignore les accents dans les deux sens', () => {
    expect(noms('ecouteurs')).toEqual(['Écouteurs sans fil']);
    expect(noms('connectée')).toEqual(['Montre connectée']);
    expect(noms('connectee')).toEqual(['Montre connectée']);
    expect(noms('sac a')).toEqual(['Sac à main']);
  });

  it('trouve un mot au milieu du nom', () => {
    expect(noms('en')).toEqual(['Baskets blanches en cuir', 'Robe en pagne', 'Chemise en lin']);
  });

  it('renvoie une liste vide quand rien ne correspond', () => {
    expect(noms('Parapluie')).toEqual([]);
  });

  it('cherche uniquement dans le nom, pas dans la description', () => {
    // « Bluetooth » n'apparaît que dans la description des écouteurs.
    expect(noms('bluetooth')).toEqual([]);
  });

  it('combine recherche et catégorie', () => {
    expect(noms('', 'Électronique')).toEqual(['Écouteurs sans fil', 'Montre connectée']);
    expect(noms('en', 'Vêtements')).toEqual(['Baskets blanches en cuir', 'Robe en pagne', 'Chemise en lin']);
    expect(noms('montre', 'Vêtements')).toEqual([]);
  });

  it('ne modifie pas le tableau reçu', () => {
    const avant = PRODUITS.map((produit) => produit.id);
    filtrerProduits(PRODUITS, 'robe');
    expect(PRODUITS.map((produit) => produit.id)).toEqual(avant);
  });
});
