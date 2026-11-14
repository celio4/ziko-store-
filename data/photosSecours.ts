/**
 * Photos de secours incluses dans l'application.
 *
 * Les adresses du sujet (picsum.photos) restent la source principale. Si le site
 * est lent ou en panne, ces photos s'affichent à la place : pendant l'attente,
 * puis définitivement en cas d'échec.
 *
 * Photos Unsplash (licence Unsplash, usage libre) :
 * 1. Ervan M Wirawan — unsplash.com/photos/PUw24-taMKc
 * 2. Theresa Ude — unsplash.com/photos/6EvUrguVz7s
 * 3. Ali Kanjarawi — unsplash.com/photos/Lq_hFffbAeM
 * 4. Irene Kredenets — unsplash.com/photos/tcVH_BwHtrc
 * 5. Auguras Pipiras — unsplash.com/photos/O43D6CYzxqM
 * 6. Robert Richman — unsplash.com/photos/vcTKFYNZop4
 */
const PHOTOS_SECOURS: Readonly<Record<string, number>> = {
  'https://picsum.photos/seed/produit1/600/600': require('@/assets/images/produits/produit1.jpg'),
  'https://picsum.photos/seed/produit2/600/600': require('@/assets/images/produits/produit2.jpg'),
  'https://picsum.photos/seed/produit3/600/600': require('@/assets/images/produits/produit3.jpg'),
  'https://picsum.photos/seed/produit4/600/600': require('@/assets/images/produits/produit4.jpg'),
  'https://picsum.photos/seed/produit5/600/600': require('@/assets/images/produits/produit5.jpg'),
  'https://picsum.photos/seed/produit6/600/600': require('@/assets/images/produits/produit6.jpg'),
};

/** Photo de secours associée à l'adresse d'une photo (undefined s'il n'y en a pas). */
export function photoSecours(uri: string): number | undefined {
  return PHOTOS_SECOURS[uri];
}
