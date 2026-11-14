import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import type { Categorie } from '@/data/types';
import { couleurs, polices, rayons } from '@/theme/theme';

/** Ordre des filtres dans la maquette. */
const CATEGORIES: readonly Categorie[] = ['Vêtements', 'Accessoires', 'Électronique'];

type Props = {
  /** Catégorie active ; null = « Tous ». */
  active: Categorie | null;
  onChange: (categorie: Categorie | null) => void;
  /** Marge latérale de l'écran : la rangée défile jusqu'aux bords. */
  bord: number;
};

/** Rangée de filtres « Tous / Vêtements / Accessoires / Électronique » (.category-scroll). */
export function FiltresCategories({ active, onChange, bord }: Props) {
  const filtres: { libelle: string; valeur: Categorie | null }[] = [
    { libelle: 'Tous', valeur: null },
    ...CATEGORIES.map((categorie) => ({ libelle: categorie, valeur: categorie })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Catégories"
      style={{ marginHorizontal: -bord }}
      contentContainerStyle={[styles.rangee, { paddingHorizontal: bord }]}
    >
      {filtres.map(({ libelle, valeur }) => {
        const estActif = active === valeur;
        return (
          <Pressable
            key={libelle}
            onPress={() => onChange(valeur)}
            // Pastille de 34 pt : zone tactile agrandie à 44 pt.
            hitSlop={{ top: 5, bottom: 5 }}
            accessibilityRole="button"
            accessibilityLabel={libelle}
            accessibilityState={{ selected: estActif }}
            style={[styles.pastille, estActif && styles.pastilleActive]}
          >
            <Text style={[styles.texte, estActif && styles.texteActif]}>{libelle}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rangee: {
    gap: 8,
  },
  pastille: {
    height: 34,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.ligne,
    borderRadius: rayons.pilule,
  },
  pastilleActive: {
    backgroundColor: couleurs.marque,
    borderColor: couleurs.marque,
  },
  texte: {
    fontFamily: polices.gras,
    fontSize: 11,
    color: couleurs.texteFiltre,
  },
  texteActif: {
    color: couleurs.blanc,
  },
});
