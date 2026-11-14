import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { LigneCommande } from '@/data/types';
import { couleurs, LARGEUR_PETIT_ECRAN, polices, rayons } from '@/theme/theme';
import { calculerSousTotal } from '@/utils/commande';
import { formaterPrix } from '@/utils/prix';
import { ControleQuantite } from './ControleQuantite';
import { Icone } from './Icone';
import { ImageProduit } from './ImageProduit';

type Props = {
  ligne: LigneCommande;
  onChangeQuantite: (quantite: number) => void;
  /** Si fourni, affiche la corbeille pour retirer l'article (panier). */
  onRetirer?: () => void;
  /** Version un peu plus basse utilisée sur l'écran de confirmation. */
  compacte?: boolean;
};

/**
 * Ligne d'article (classe .cart-row de la maquette) : vignette, nom,
 * prix unitaire, sélecteur de quantité et sous-total de la ligne.
 */
export function LigneArticle({ ligne, onChangeQuantite, onRetirer, compacte = false }: Props) {
  const { width } = useWindowDimensions();
  const petitEcran = width < LARGEUR_PETIT_ECRAN;
  const { produit, quantite } = ligne;

  return (
    <View style={[styles.ligne, compacte && styles.ligneCompacte]}>
      <ImageProduit
        uri={produit.photo}
        nom={produit.nom}
        style={[styles.vignette, compacte && styles.vignetteCompacte, petitEcran && styles.vignettePetitEcran]}
      />
      <View style={styles.infos}>
        <View style={styles.titreLigne}>
          <Text style={styles.nom} numberOfLines={2}>
            {produit.nom}
          </Text>
          {onRetirer && (
            <Pressable
              onPress={onRetirer}
              hitSlop={7}
              accessibilityRole="button"
              accessibilityLabel={`Retirer ${produit.nom} du panier`}
              style={styles.retirer}
            >
              <Icone nom="supprimer" taille={18} couleur={couleurs.supprimer} />
            </Pressable>
          )}
        </View>
        <Text style={styles.prixUnitaire}>
          {formaterPrix(produit.prix)}
          <Text style={styles.unite}> / unité</Text>
        </Text>
        <View style={styles.bas}>
          <ControleQuantite quantite={quantite} onChange={onChangeQuantite} compact />
          <Text style={styles.sousTotal} numberOfLines={1} accessibilityLabel={`Sous-total : ${formaterPrix(calculerSousTotal(ligne))}`}>
            {formaterPrix(calculerSousTotal(ligne))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 136,
    padding: 9,
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureLigneCommande,
    borderRadius: rayons.ligne,
  },
  ligneCompacte: {
    minHeight: 127,
  },
  vignette: {
    width: 94,
    minHeight: 116,
    borderRadius: rayons.champ,
  },
  vignetteCompacte: {
    width: 86,
    minHeight: 107,
  },
  vignettePetitEcran: {
    width: 82,
  },
  infos: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
    paddingRight: 2,
    paddingBottom: 2,
  },
  titreLigne: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  nom: {
    flex: 1,
    fontFamily: polices.extraGras,
    fontSize: 12,
    lineHeight: 16.2,
    color: couleurs.encre,
  },
  retirer: {
    width: 30,
    height: 30,
    marginTop: -5,
    marginRight: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prixUnitaire: {
    marginTop: 4,
    fontFamily: polices.extraGras,
    fontSize: 10,
    color: couleurs.marque,
  },
  unite: {
    fontFamily: polices.moyen,
    color: couleurs.texteMention,
  },
  bas: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 8,
  },
  sousTotal: {
    flexShrink: 1,
    fontFamily: polices.gras,
    fontSize: 11,
    color: couleurs.encre,
  },
});
