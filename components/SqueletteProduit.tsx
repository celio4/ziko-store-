import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { couleurs, rayons } from '@/theme/theme';

/**
 * Carte « squelette » affichée pendant le chargement (classe .product-skeleton) :
 * des blocs gris qui pulsent à la place de la photo, du nom et du prix.
 */
export function SqueletteProduit() {
  const opacite = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulsation 1 -> 0,5 -> 1 en 1,2 s, en boucle (animation « pulse » de la maquette).
    const boucle = Animated.loop(
      Animated.sequence([
        Animated.timing(opacite, { toValue: 0.5, duration: 600, useNativeDriver: true }),
        Animated.timing(opacite, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    boucle.start();
    return () => boucle.stop();
  }, [opacite]);

  return (
    <View style={styles.carte} accessible={false} importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.image, { opacity: opacite }]} />
      <View style={styles.textes}>
        <Animated.View style={[styles.bloc, styles.surtitre, { opacity: opacite }]} />
        <Animated.View style={[styles.bloc, styles.nom, { opacity: opacite }]} />
        <Animated.View style={[styles.bloc, styles.prix, { opacity: opacite }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    gap: 14,
    height: 142,
    padding: 8,
    overflow: 'hidden',
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.bordureSqueletteCarte,
    borderRadius: rayons.carte,
  },
  image: {
    width: 126,
    borderRadius: rayons.image,
    backgroundColor: couleurs.squelette,
  },
  textes: {
    flex: 1,
    paddingTop: 13,
  },
  bloc: {
    height: 10,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: couleurs.squelette,
  },
  surtitre: { width: '58%', height: 9 },
  nom: { width: '91%', height: 16 },
  prix: { width: '65%' },
});
