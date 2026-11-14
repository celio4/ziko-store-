import { Stack } from 'expo-router';

// Navigation principale : une pile d'écrans sans en-tête natif
// (chaque écran dessine son propre en-tête, comme dans la maquette).
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
