import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { couleurs, espacementLettres, polices } from '@/theme/theme';
import { BoutonIcone } from './BoutonIcone';

type Props = {
  titre: string;
  sousTitre?: string;
  /** Si fourni, affiche le bouton rond « retour » à gauche. */
  onRetour?: () => void;
  /** Contenu facultatif aligné à droite (boutons). */
  droite?: ReactNode;
};

/** En-tête d'écran (classe .top-header de la maquette) : grand titre + sous-titre. */
export function EnTete({ titre, sousTitre, onRetour, droite }: Props) {
  return (
    <View style={[styles.conteneur, onRetour && styles.avecRetour]}>
      {onRetour && (
        <View style={styles.retour}>
          <BoutonIcone icone="retour" libelleAccessible="Retour" onPress={onRetour} />
        </View>
      )}
      <View style={styles.textes}>
        <Text style={styles.titre} accessibilityRole="header" numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
          {titre}
        </Text>
        {sousTitre && (
          <Text style={styles.sousTitre} numberOfLines={2}>
            {sousTitre}
          </Text>
        )}
      </View>
      {droite && <View style={styles.droite}>{droite}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 86,
  },
  avecRetour: {
    paddingLeft: 44,
  },
  retour: {
    position: 'absolute',
    left: 0,
  },
  textes: {
    flex: 1,
    minWidth: 0,
  },
  titre: {
    fontFamily: polices.extraGras,
    fontSize: 26,
    lineHeight: 28.6,
    letterSpacing: espacementLettres(-0.04, 26),
    color: couleurs.encre,
  },
  sousTitre: {
    fontFamily: polices.normal,
    fontSize: 12,
    marginTop: 5,
    color: couleurs.attenue,
  },
  droite: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
