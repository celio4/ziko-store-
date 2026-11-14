import type { Produit } from './types';

/**
 * Catalogue Ziko : données fournies par le sujet du test, copiées telles quelles.
 * Seul ajout : le champ `categorie`, repris de la maquette Figma (surtitre des
 * cartes et filtres « Vêtements / Accessoires / Électronique »).
 */
export const PRODUITS: readonly Produit[] = [
  {
    id: 1,
    nom: 'Baskets blanches en cuir',
    prix: 87500,
    description: 'Baskets en cuir, semelle confortable, du 38 au 45.',
    photo: 'https://picsum.photos/seed/produit1/600/600',
    categorie: 'Vêtements',
  },
  {
    id: 2,
    nom: 'Robe en pagne',
    prix: 45000,
    description: 'Robe longue cousue main, plusieurs motifs disponibles.',
    photo: 'https://picsum.photos/seed/produit2/600/600',
    categorie: 'Vêtements',
  },
  {
    id: 3,
    nom: 'Écouteurs sans fil',
    prix: 32000,
    description: "Bluetooth, 20 heures d'autonomie avec le boîtier.",
    photo: 'https://picsum.photos/seed/produit3/600/600',
    categorie: 'Électronique',
  },
  {
    id: 4,
    nom: 'Sac à main',
    prix: 60000,
    description: 'Sac en simili cuir, trois compartiments.',
    photo: 'https://picsum.photos/seed/produit4/600/600',
    categorie: 'Accessoires',
  },
  {
    id: 5,
    nom: 'Montre connectée',
    prix: 115000,
    description: 'Suivi des pas et du sommeil, notifications du téléphone.',
    photo: 'https://picsum.photos/seed/produit5/600/600',
    categorie: 'Électronique',
  },
  {
    id: 6,
    nom: 'Chemise en lin',
    prix: 38000,
    description: 'Coupe ajustée, légère, idéale par forte chaleur.',
    photo: 'https://picsum.photos/seed/produit6/600/600',
    categorie: 'Vêtements',
  },
];

/** Retrouve un produit par son identifiant (undefined s'il n'existe pas). */
export function trouverProduit(id: number): Produit | undefined {
  return PRODUITS.find((produit) => produit.id === id);
}
