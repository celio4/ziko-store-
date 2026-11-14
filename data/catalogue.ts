import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

import { PRODUITS } from './produits';
import type { Categorie, Produit } from './types';

/** Durée du chargement simulé, demandée par le sujet : une seconde. */
export const DELAI_CHARGEMENT_MS = 1000;

/** Clé du catalogue dans AsyncStorage (versionnée pour pouvoir changer de format). */
const CLE_CACHE = 'ziko:catalogue:v1';

/** Options de démonstration pour tester les états de l'écran liste. */
export type OptionsChargement = {
  /** Simule une panne sans catalogue de secours : affiche l'état d'erreur. */
  simulerErreur?: boolean;
  /** Simule une perte de connexion : le catalogue enregistré prend le relais. */
  simulerHorsLigne?: boolean;
  /** Simule un catalogue vide. */
  simulerVide?: boolean;
};

/** Résultat d'un chargement : les produits et leur provenance. */
export type ResultatChargement = {
  produits: Produit[];
  /** « reseau » : données fraîches ; « cache » : copie enregistrée sur le téléphone. */
  source: 'reseau' | 'cache';
};

/** Petite pause asynchrone. */
function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * « Téléchargement » du catalogue.
 * Il n'y a pas de serveur : on renvoie les données locales après une seconde,
 * pour imiter un appel réseau. C'est la seule fonction à remplacer par un
 * vrai `fetch` le jour où une API existera.
 */
async function telechargerCatalogue(options: OptionsChargement): Promise<Produit[]> {
  await attendre(DELAI_CHARGEMENT_MS);
  if (options.simulerErreur || options.simulerHorsLigne) {
    throw new Error('Réseau indisponible (simulation)');
  }
  return options.simulerVide ? [] : [...PRODUITS];
}

const CATEGORIES_VALIDES: readonly string[] = ['Vêtements', 'Accessoires', 'Électronique'] satisfies Categorie[];

/** Vérifie qu'une valeur lue sur le disque a bien la forme d'un Produit. */
function estProduit(valeur: unknown): valeur is Produit {
  if (typeof valeur !== 'object' || valeur === null) return false;
  const objet = valeur as Record<string, unknown>;
  return (
    typeof objet.id === 'number' &&
    typeof objet.nom === 'string' &&
    typeof objet.prix === 'number' &&
    typeof objet.description === 'string' &&
    typeof objet.photo === 'string' &&
    typeof objet.categorie === 'string' &&
    CATEGORIES_VALIDES.includes(objet.categorie)
  );
}

/** Enregistre le catalogue sur le téléphone. Une erreur d'écriture n'est pas bloquante. */
async function enregistrerCache(produits: Produit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CLE_CACHE, JSON.stringify(produits));
  } catch {
    // Disque plein ou indisponible : l'application fonctionne quand même.
  }
}

/** Relit le catalogue enregistré ; null s'il n'existe pas ou s'il est illisible. */
async function lireCache(): Promise<Produit[] | null> {
  try {
    const texte = await AsyncStorage.getItem(CLE_CACHE);
    if (!texte) return null;
    const valeur: unknown = JSON.parse(texte);
    return Array.isArray(valeur) && valeur.every(estProduit) ? valeur : null;
  } catch {
    return null;
  }
}

/**
 * Télécharge toutes les photos dans le cache disque d'expo-image, y compris
 * celles des produits pas encore affichés : elles seront visibles hors connexion.
 */
function prechargerPhotos(produits: Produit[]): void {
  Image.prefetch(
    produits.map((produit) => produit.photo),
    'disk',
  ).catch(() => {
    // Échec du préchargement : les photos se chargeront à l'affichage.
  });
}

/**
 * Charge le catalogue.
 * 1. On tente le « réseau » ; en cas de succès, on enregistre une copie
 *    sur le téléphone et on précharge les photos.
 * 2. En cas d'échec, on se rabat sur la copie enregistrée si elle existe.
 * 3. Sinon, l'erreur remonte et l'écran affiche « Réessayer ».
 */
export async function chargerProduits(options: OptionsChargement = {}): Promise<ResultatChargement> {
  try {
    const produits = await telechargerCatalogue(options);
    // On ne remplace jamais une copie utile par une liste vide.
    if (produits.length > 0) {
      await enregistrerCache(produits);
      prechargerPhotos(produits);
    }
    return { produits, source: 'reseau' };
  } catch (erreur) {
    // L'option « erreur » de démonstration ignore volontairement la copie locale.
    if (!options.simulerErreur) {
      const copie = await lireCache();
      if (copie && copie.length > 0) {
        return { produits: copie, source: 'cache' };
      }
    }
    throw erreur;
  }
}
