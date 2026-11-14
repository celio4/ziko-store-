import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { couleurs, ombres, polices, rayons } from '@/theme/theme';
import { Icone } from './Icone';

type Props = {
  valeur: string;
  onChange: (texte: string) => void;
};

/** Champ « Rechercher un produit » (classe .search-wrap), avec bouton pour effacer. */
export function ChampRecherche({ valeur, onChange }: Props) {
  return (
    <View style={styles.conteneur}>
      <Icone nom="recherche" taille={20} couleur={couleurs.iconeRecherche} />
      <TextInput
        value={valeur}
        onChangeText={onChange}
        placeholder="Rechercher un produit"
        placeholderTextColor={couleurs.placeholder}
        accessibilityLabel="Rechercher un produit"
        style={styles.saisie}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
      />
      {valeur.length > 0 && (
        <Pressable
          onPress={() => onChange('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
          style={styles.effacer}
        >
          <Icone nom="fermer" taille={17} couleur={couleurs.attenue} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureRecherche,
    borderRadius: rayons.recherche,
    boxShadow: ombres.recherche,
  },
  saisie: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: polices.normal,
    fontSize: 13,
    color: couleurs.encre,
  },
  effacer: {
    padding: 4,
  },
});
