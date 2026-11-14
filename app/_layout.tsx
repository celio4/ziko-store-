import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FournisseurPanier } from '@/context/PanierContexte';
import { couleurs } from '@/theme/theme';

// On garde l'écran de démarrage tant que la police Manrope n'est pas prête,
// pour éviter un « saut » de police au premier affichage.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [policesChargees, erreurPolices] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  // Prêt dès que les polices sont chargées… ou en échec (on affiche alors la police système).
  const pret = policesChargees || erreurPolices !== null;

  useEffect(() => {
    if (pret) {
      SplashScreen.hideAsync();
    }
  }, [pret]);

  if (!pret) {
    return null;
  }

  return (
    <FournisseurPanier>
      <StatusBar style="dark" />
      {/* Pile d'écrans sans en-tête natif : chaque écran dessine le sien, comme la maquette. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: couleurs.fondEcran } }} />
    </FournisseurPanier>
  );
}
