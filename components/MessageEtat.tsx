import { StyleSheet, Text, View } from 'react-native';

import { couleurs, espacementLettres, polices } from '@/theme/theme';
import { Bouton } from './Bouton';
import { Icone, type NomIcone } from './Icone';

type Props = {
  icone: NomIcone;
  titre: string;
  texte: string;
  /** Bouton d'action facultatif (ex. « Réessayer »). */
  action?: { libelle: string; icone?: NomIcone; onPress: () => void };
  /** Pastille d'icône agrandie (74 pt au lieu de 62). */
  grand?: boolean;
};

/**
 * Message d'état centré (classe .empty-state de la maquette) :
 * erreur de chargement, liste vide, recherche sans résultat, panier vide.
 */
export function MessageEtat({ icone, titre, texte, action, grand = false }: Props) {
  return (
    <View style={styles.conteneur} accessibilityLiveRegion="polite">
      <View style={[styles.pastille, grand && styles.pastilleGrande]}>
        <Icone nom={icone} taille={grand ? 32 : 27} couleur={couleurs.marque} />
      </View>
      <Text style={styles.titre} accessibilityRole="header">
        {titre}
      </Text>
      <Text style={styles.texte}>{texte}</Text>
      {action && <Bouton libelle={action.libelle} icone={action.icone} onPress={action.onPress} style={styles.bouton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 385,
    paddingVertical: 25,
    paddingHorizontal: 18,
  },
  pastille: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: couleurs.marqueDouce,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pastilleGrande: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  titre: {
    maxWidth: 280,
    fontFamily: polices.extraGras,
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: espacementLettres(-0.03, 20),
    textAlign: 'center',
    color: couleurs.encre,
  },
  texte: {
    maxWidth: 310,
    marginTop: 10,
    marginBottom: 22,
    fontFamily: polices.normal,
    fontSize: 12,
    lineHeight: 19.8,
    textAlign: 'center',
    color: couleurs.attenue,
  },
  bouton: {
    alignSelf: 'center',
    minWidth: 180,
    paddingHorizontal: 20,
  },
});
