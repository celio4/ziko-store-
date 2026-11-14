/** Catégories affichées dans la maquette (surtitre des cartes et filtres). */
export type Categorie = 'Vêtements' | 'Accessoires' | 'Électronique';

/** Un produit du catalogue Ziko. */
export type Produit = {
  id: number;
  nom: string;
  /** Prix en francs congolais (FC), nombre entier. */
  prix: number;
  description: string;
  /** Adresse web de la photo. */
  photo: string;
  categorie: Categorie;
};

/** Une ligne de commande ou de panier : un produit et sa quantité. */
export type LigneCommande = {
  produit: Produit;
  quantite: number;
};
