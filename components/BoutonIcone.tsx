import { Pressable, StyleSheet, Text, View } from 'react-native';

import { couleurs, ombres, polices, rayons } from '@/theme/theme';
import { Icone, type NomIcone } from './Icone';

type Props = {
  icone: NomIcone;
  libelleAccessible: string;
  onPress: () => void;
  /** « bordure » : rond blanc bordé (en-têtes) ; « flottant » : rond voilé sur une photo. */
  variante?: 'bordure' | 'flottant';
  /** Nombre affiché dans une pastille orange (ex. articles du panier). */
  pastille?: number;
};

/** Bouton rond de 40 pt (.icon-button / .floating-cart), zone tactile portée à 44 pt. */
export function BoutonIcone({ icone, libelleAccessible, onPress, variante = 'bordure', pastille = 0 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={2}
      accessibilityRole="button"
      accessibilityLabel={libelleAccessible}
      style={({ pressed }) => [styles.base, variante === 'bordure' ? styles.bordure : styles.flottant, pressed && styles.appuye]}
    >
      <Icone nom={icone} taille={variante === 'bordure' ? 22 : 21} couleur={couleurs.encre} />
      {pastille > 0 && (
        <View style={styles.pastille}>
          <Text style={styles.pastilleTexte}>{pastille > 99 ? '99+' : pastille}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordure: {
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.ligne,
  },
  flottant: {
    backgroundColor: couleurs.voileBlanc,
    boxShadow: ombres.standard,
  },
  appuye: {
    opacity: 0.8,
  },
  pastille: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: rayons.pilule,
    borderWidth: 2,
    borderColor: couleurs.blanc,
    backgroundColor: couleurs.pastille,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastilleTexte: {
    fontFamily: polices.gras,
    fontSize: 8,
    lineHeight: 10,
    color: couleurs.blanc,
  },
});
