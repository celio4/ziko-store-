import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { LigneCommande, Produit } from '@/data/types';
import { bornerQuantite, compterArticles } from '@/utils/commande';

/** Ce que le panier met à disposition des écrans. */
type ValeurPanier = {
  lignes: LigneCommande[];
  nombreArticles: number;
  /** Ajoute un produit (ou augmente sa quantité s'il est déjà dans le panier). */
  ajouter: (produit: Produit, quantite: number) => void;
  modifierQuantite: (idProduit: number, quantite: number) => void;
  retirer: (idProduit: number) => void;
  vider: () => void;
};

const PanierContexte = createContext<ValeurPanier | null>(null);

/**
 * Fournit le panier à toute l'application.
 * Le panier vit en mémoire : il n'y a ni compte ni serveur dans ce prototype.
 */
export function FournisseurPanier({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<LigneCommande[]>([]);

  const ajouter = useCallback((produit: Produit, quantite: number) => {
    setLignes((actuelles) => {
      const existante = actuelles.find((ligne) => ligne.produit.id === produit.id);
      if (existante) {
        return actuelles.map((ligne) =>
          ligne.produit.id === produit.id ? { ...ligne, quantite: bornerQuantite(ligne.quantite + quantite) } : ligne,
        );
      }
      return [...actuelles, { produit, quantite: bornerQuantite(quantite) }];
    });
  }, []);

  const modifierQuantite = useCallback((idProduit: number, quantite: number) => {
    setLignes((actuelles) =>
      actuelles.map((ligne) => (ligne.produit.id === idProduit ? { ...ligne, quantite: bornerQuantite(quantite) } : ligne)),
    );
  }, []);

  const retirer = useCallback((idProduit: number) => {
    setLignes((actuelles) => actuelles.filter((ligne) => ligne.produit.id !== idProduit));
  }, []);

  const vider = useCallback(() => setLignes([]), []);

  // useMemo : la valeur ne change que si le panier change réellement.
  const valeur = useMemo<ValeurPanier>(
    () => ({ lignes, nombreArticles: compterArticles(lignes), ajouter, modifierQuantite, retirer, vider }),
    [lignes, ajouter, modifierQuantite, retirer, vider],
  );

  return <PanierContexte.Provider value={valeur}>{children}</PanierContexte.Provider>;
}

/** Accès au panier depuis un écran. */
export function usePanier(): ValeurPanier {
  const valeur = useContext(PanierContexte);
  if (!valeur) {
    throw new Error('usePanier doit être utilisé dans <FournisseurPanier>.');
  }
  return valeur;
}
