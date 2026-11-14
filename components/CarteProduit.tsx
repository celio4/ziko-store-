import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Produit } from '@/data/types';
import { couleurs, espacementLettres, ombres, polices, rayons } from '@/theme/theme';
import { formaterPrix } from '@/utils/prix';
import { ImageProduit } from './ImageProduit';

type Props = {
  produit: Produit;
  onPress: (produit: Produit) => void;
  /** Démonstration de l'état « photo indisponible ». */
  forcerRemplacementPhoto?: boolean;
};

/**
 * Carte d'un produit dans la liste (classe .product-card de la maquette) :
 * photo à gauche, catégorie, nom, prix et lien « Voir le produit ».
 * Toute la carte est cliquable. `memo` évite de la redessiner sans raison
 * pendant le défilement.
 */
function CarteProduitBase({ produit, onPress, forcerRemplacementPhoto = false }: Props) {
  return (
    <Pressable
      onPress={() => onPress(produit)}
      accessibilityRole="button"
      accessibilityLabel={`${produit.nom}, ${formaterPrix(produit.prix)}. Voir le produit`}
      style={({ pressed }) => [styles.carte, pressed && styles.appuyee]}
    >
      <ImageProduit uri={produit.photo} nom={produit.nom} style={styles.image} forcerRemplacement={forcerRemplacementPhoto} />
      <View style={styles.texte}>
        <Text style={styles.surtitre} numberOfLines={1}>
          {produit.categorie}
        </Text>
        <Text style={styles.nom} numberOfLines={2}>
          {produit.nom}
        </Text>
        <Text style={styles.prix} numberOfLines={1}>
          {formaterPrix(produit.prix)}
        </Text>
        <View style={styles.lien}>
          <Text style={styles.lienTexte}>Voir le produit</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const CarteProduit = memo(CarteProduitBase);

const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    gap: 14,
    minHeight: 142,
    padding: 8,
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureCarte,
    borderRadius: rayons.carte,
    boxShadow: ombres.carte,
  },
  appuyee: {
    boxShadow: 'none',
    transform: [{ scale: 0.985 }],
  },
  image: {
    width: 126,
    minHeight: 124,
    borderRadius: rayons.image,
  },
  texte: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    paddingTop: 9,
    paddingRight: 8,
    paddingBottom: 6,
  },
  surtitre: {
    fontFamily: polices.extraGras,
    fontSize: 9,
    letterSpacing: espacementLettres(0.08, 9),
    textTransform: 'uppercase',
    color: couleurs.marque,
  },
  nom: {
    fontFamily: polices.gras,
    fontSize: 14,
    lineHeight: 18.2,
    color: couleurs.encre,
    marginTop: 6,
    marginBottom: 5,
  },
  prix: {
    fontFamily: polices.extraGras,
    fontSize: 13,
    color: couleurs.encre,
  },
  lien: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 'auto',
    minHeight: 24,
  },
  lienTexte: {
    fontFamily: polices.extraGras,
    fontSize: 11,
    color: couleurs.marque,
  },
  chevron: {
    fontFamily: polices.extraGras,
    fontSize: 17,
    lineHeight: 17,
    color: couleurs.marque,
  },
});
