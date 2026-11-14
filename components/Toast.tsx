import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { couleurs, ombres, polices, rayons } from '@/theme/theme';
import { Icone } from './Icone';

type Props = {
  message: string;
  /** Distance au bas de l'écran (inclut la zone de sécurité). */
  bas: number;
};

/**
 * Bandeau de confirmation (classe .toast de la maquette) : pastille verte
 * cochée + message. Il apparaît en glissant légèrement vers le haut.
 * C'est l'écran parent qui décide quand l'afficher et le retirer.
 */
export function Toast({ message, bas }: Props) {
  const apparition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(apparition, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [apparition]);

  const translateY = apparition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.toast, { bottom: bas, opacity: apparition, transform: [{ translateY }] }]}
    >
      <View style={styles.pastille}>
        <Icone nom="valider" taille={14} couleur={couleurs.blanc} />
      </View>
      <Text style={styles.texte} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    minHeight: 48,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: rayons.bouton,
    backgroundColor: couleurs.fondToast,
    boxShadow: ombres.toast,
  },
  pastille: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: couleurs.marque,
  },
  texte: {
    flexShrink: 1,
    fontFamily: polices.gras,
    fontSize: 10,
    color: couleurs.blanc,
  },
});
