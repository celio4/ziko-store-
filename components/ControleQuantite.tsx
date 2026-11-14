import { Pressable, StyleSheet, Text, View } from 'react-native';

import { couleurs, polices, rayons, ZONE_TACTILE_MIN } from '@/theme/theme';
import { QUANTITE_MAX, QUANTITE_MIN } from '@/utils/commande';
import { Icone } from './Icone';

type Props = {
  quantite: number;
  onChange: (nouvelleQuantite: number) => void;
  /** Version réduite utilisée dans les lignes du panier et de la commande. */
  compact?: boolean;
};

/**
 * Sélecteur « − 1 + » (classe .quantity de la maquette).
 * Le bouton « − » est désactivé à 1 : la quantité ne descend jamais sous 1.
 */
export function ControleQuantite({ quantite, onChange, compact = false }: Props) {
  const peutDiminuer = quantite > QUANTITE_MIN;
  const peutAugmenter = quantite < QUANTITE_MAX;
  const hauteur = compact ? 34 : 42;
  // Zone tactile agrandie (hitSlop) pour atteindre 44 pt même en version compacte.
  const marge = Math.max(0, (ZONE_TACTILE_MIN - hauteur) / 2);
  const marges = { top: marge, bottom: marge, left: 4, right: 4 };

  return (
    <View
      style={[styles.conteneur, compact && styles.conteneurCompact]}
      accessibilityLabel="Choisir la quantité"
    >
      <Pressable
        onPress={() => onChange(quantite - 1)}
        disabled={!peutDiminuer}
        hitSlop={marges}
        accessibilityRole="button"
        accessibilityLabel="Diminuer la quantité"
        accessibilityState={{ disabled: !peutDiminuer }}
        style={[styles.bouton, compact && styles.boutonCompact]}
      >
        <Icone nom="moins" taille={17} couleur={peutDiminuer ? couleurs.marque : couleurs.quantiteDesactivee} />
      </Pressable>
      <Text
        style={[styles.valeur, compact && styles.valeurCompacte]}
        accessibilityLiveRegion="polite"
        accessibilityLabel={`Quantité : ${quantite}`}
      >
        {quantite}
      </Text>
      <Pressable
        onPress={() => onChange(quantite + 1)}
        disabled={!peutAugmenter}
        hitSlop={marges}
        accessibilityRole="button"
        accessibilityLabel="Augmenter la quantité"
        accessibilityState={{ disabled: !peutAugmenter }}
        style={[styles.bouton, compact && styles.boutonCompact]}
      >
        <Icone nom="plus" taille={17} couleur={peutAugmenter ? couleurs.marque : couleurs.quantiteDesactivee} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    backgroundColor: couleurs.fondQuantite,
    borderWidth: 1,
    borderColor: couleurs.bordureQuantite,
    borderRadius: rayons.quantite,
  },
  conteneurCompact: {
    height: 34,
    borderRadius: rayons.petit,
  },
  bouton: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boutonCompact: {
    width: 33,
  },
  valeur: {
    minWidth: 35,
    textAlign: 'center',
    fontFamily: polices.extraGras,
    fontSize: 12,
    color: couleurs.encre,
  },
  valeurCompacte: {
    minWidth: 26,
    fontSize: 11,
  },
});
