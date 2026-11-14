import { Redirect } from 'expo-router';

// Provisoire : l'application ouvre directement le catalogue.
// L'écran de bienvenue de la maquette viendra remplacer cette redirection.
export default function Accueil() {
  return <Redirect href="/catalogue" />;
}
