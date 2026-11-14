import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { couleurs, ombres, polices, rayons } from '@/theme/theme';
import { Icone, type NomIcone } from './Icone';

type Variante = 'principal' | 'secondaire';

type Props = {
  libelle: string;
  onPress: () => void;
  /** « principal » : fond vert ; « secondaire » : fond blanc bordé. */
  variante?: Variante;
  /** Icône facultative affichée avant le libellé. */
  icone?: NomIcone;
  /** Affiche une roue de chargement et bloque le bouton. */
  enCours?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Bouton pleine largeur de la maquette (classe .button), hauteur 52 pt. */
export function Bouton({ libelle, onPress, variante = 'principal', icone, enCours = false, style }: Props) {
  const principal = variante === 'principal';
  const couleurTexte = principal ? couleurs.blanc : couleurs.marque;

  return (
    <Pressable
      onPress={onPress}
      disabled={enCours}
      accessibilityRole="button"
      accessibilityLabel={libelle}
      accessibilityState={{ disabled: enCours, busy: enCours }}
      style={({ pressed }) => [
        styles.base,
        principal ? styles.principal : styles.secondaire,
        // Retour visuel au toucher : léger rétrécissement, comme dans la maquette.
        pressed && styles.appuye,
        pressed && principal && styles.principalAppuye,
        enCours && styles.enCours,
        style,
      ]}
    >
      <View style={styles.contenu}>
        {enCours ? (
          <ActivityIndicator size="small" color={couleurTexte} />
        ) : (
          icone && <Icone nom={icone} taille={19} couleur={couleurTexte} />
        )}
        <Text style={[styles.libelle, { color: couleurTexte }]} numberOfLines={1}>
          {libelle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: rayons.bouton,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  principal: {
    backgroundColor: couleurs.marque,
    boxShadow: ombres.boutonPrincipal,
  },
  principalAppuye: {
    backgroundColor: couleurs.marqueFonce,
  },
  secondaire: {
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureSecondaire,
  },
  appuye: {
    transform: [{ scale: 0.985 }],
  },
  enCours: {
    opacity: 0.7,
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  libelle: {
    fontFamily: polices.extraGras,
    fontSize: 13,
    flexShrink: 1,
  },
});
