import type { Categorie, Produit } from '@/data/types';

/**
 * Table des lettres accentuées du français et de leur équivalent sans accent.
 * On n'utilise pas `String.normalize` : son support dépend du moteur JavaScript
 * (Hermes) ; une table explicite donne le même résultat sur iOS et Android.
 */
const SANS_ACCENT: Record<string, string> = {
  à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a', å: 'a',
  ç: 'c',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  î: 'i', ï: 'i', í: 'i', ì: 'i',
  ñ: 'n',
  ô: 'o', ö: 'o', ó: 'o', ò: 'o', õ: 'o',
  ù: 'u', û: 'u', ü: 'u', ú: 'u',
  ÿ: 'y', ý: 'y',
  œ: 'oe', æ: 'ae',
};

/**
 * Prépare un texte pour la comparaison : minuscules, sans accents,
 * apostrophes unifiées et espaces superflues retirées.
 * « Écouteurs » -> « ecouteurs ».
 */
export function normaliserTexte(texte: string): string {
  const minuscules = texte.toLowerCase().replace(/[’‘`]/g, "'");
  let resultat = '';
  for (const caractere of minuscules) {
    resultat += SANS_ACCENT[caractere] ?? caractere;
  }
  return resultat.trim().replace(/\s+/g, ' ');
}

/** Vrai si le nom du produit contient le texte recherché (casse et accents ignorés). */
export function correspondALaRecherche(produit: Produit, recherche: string): boolean {
  const terme = normaliserTexte(recherche);
  return terme === '' || normaliserTexte(produit.nom).includes(terme);
}

/**
 * Filtre le catalogue par nom et, si besoin, par catégorie.
 * Une recherche vide et une catégorie nulle renvoient tout le catalogue.
 */
export function filtrerProduits(
  produits: readonly Produit[],
  recherche: string,
  categorie: Categorie | null = null,
): Produit[] {
  return produits.filter(
    (produit) => (categorie === null || produit.categorie === categorie) && correspondALaRecherche(produit, recherche),
  );
}
