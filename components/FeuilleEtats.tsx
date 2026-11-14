import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { couleurs, espacementLettres, ombres, polices, rayons } from '@/theme/theme';
import { Icone, type NomIcone } from './Icone';

/** Une option de la feuille : titre, description et pictogramme. */
export type OptionEtat<Cle extends string> = {
  cle: Cle;
  titre: string;
  description: string;
  /** Pictogramme ; « chargement » affiche une petite roue. */
  icone: NomIcone | 'chargement';
  ton?: 'normal' | 'danger' | 'succes';
};

type Props<Cle extends string> = {
  visible: boolean;
  options: readonly OptionEtat<Cle>[];
  onChoisir: (cle: Cle) => void;
  onFermer: () => void;
};

/**
 * Feuille « Tester les états » (classe .demo-sheet de la maquette).
 * Elle permet à l'examinateur d'afficher chaque état de la liste :
 * chargement, erreur, recherche vide, photo indisponible…
 */
export function FeuilleEtats<Cle extends string>({ visible, options, onChoisir, onFermer }: Props<Cle>) {
  const marges = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFermer} statusBarTranslucent>
      <View style={styles.voile}>
        {/* Toucher le voile ferme la feuille. */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onFermer} accessibilityLabel="Fermer" />
        <View style={[styles.feuille, { paddingBottom: Math.max(24, marges.bottom) }]}>
          <View style={styles.poignee} />
          <View style={styles.entete}>
            <View style={styles.enteteTextes}>
              <Text style={styles.surtitre}>Mode prototype</Text>
              <Text style={styles.titre} accessibilityRole="header">
                Tester les états
              </Text>
            </View>
            <Pressable
              onPress={onFermer}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
              style={styles.fermer}
            >
              <Icone nom="fermer" taille={17} couleur={couleurs.encre} />
            </Pressable>
          </View>
          <Text style={styles.intro}>Affichez les variantes prévues pour le catalogue.</Text>

          {options.map((option) => {
            const ton = option.ton ?? 'normal';
            const couleurIcone =
              ton === 'danger' ? couleurs.danger : ton === 'succes' ? couleurs.succes : couleurs.marque;
            return (
              <Pressable
                key={option.cle}
                onPress={() => onChoisir(option.cle)}
                accessibilityRole="button"
                accessibilityLabel={`${option.titre}. ${option.description}`}
                style={({ pressed }) => [styles.option, pressed && styles.optionAppuyee]}
              >
                <View style={[styles.pictogramme, ton === 'danger' && styles.pictoDanger, ton === 'succes' && styles.pictoSucces]}>
                  {option.icone === 'chargement' ? (
                    <ActivityIndicator size="small" color={couleurIcone} />
                  ) : (
                    <Icone nom={option.icone} taille={19} couleur={couleurIcone} />
                  )}
                </View>
                <View style={styles.optionTextes}>
                  <Text style={styles.optionTitre}>{option.titre}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  voile: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: couleurs.voileFeuille,
  },
  feuille: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: couleurs.blanc,
    borderTopLeftRadius: rayons.feuille,
    borderTopRightRadius: rayons.feuille,
    boxShadow: ombres.feuille,
  },
  poignee: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 9,
    marginBottom: 18,
    backgroundColor: couleurs.poigneeFeuille,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  enteteTextes: {
    flex: 1,
  },
  surtitre: {
    fontFamily: polices.extraGras,
    fontSize: 9,
    letterSpacing: espacementLettres(0.08, 9),
    textTransform: 'uppercase',
    color: couleurs.marque,
  },
  titre: {
    marginTop: 3,
    fontFamily: polices.extraGras,
    fontSize: 20,
    letterSpacing: espacementLettres(-0.03, 20),
    color: couleurs.encre,
  },
  fermer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: couleurs.fondBoutonFermer,
  },
  intro: {
    marginTop: 8,
    marginBottom: 15,
    fontFamily: polices.normal,
    fontSize: 10,
    color: couleurs.attenue,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    minHeight: 60,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: couleurs.separateurFeuille,
  },
  optionAppuyee: {
    opacity: 0.7,
  },
  pictogramme: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: couleurs.marqueDouce,
  },
  pictoDanger: {
    backgroundColor: couleurs.fondDanger,
  },
  pictoSucces: {
    backgroundColor: couleurs.fondSucces,
  },
  optionTextes: {
    flex: 1,
    gap: 2,
  },
  optionTitre: {
    fontFamily: polices.gras,
    fontSize: 11,
    color: couleurs.encre,
  },
  optionDescription: {
    fontFamily: polices.normal,
    fontSize: 8,
    color: couleurs.attenue,
  },
});
