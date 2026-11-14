import Feather from '@expo/vector-icons/Feather';

/**
 * Icônes de l'application.
 *
 * La maquette utilise des icônes au trait de la famille Lucide, elle-même
 * dérivée de Feather : on prend donc Feather, fourni par Expo et disponible
 * dans Expo Go. Ce tableau associe un nom simple à l'icône Feather équivalente.
 */
const ICONES = {
  accueil: 'home',
  panier: 'shopping-cart',
  profil: 'user',
  recherche: 'search',
  reglages: 'sliders',
  fermer: 'x',
  retour: 'chevron-left',
  moins: 'minus',
  plus: 'plus',
  supprimer: 'trash-2',
  valider: 'check',
  colis: 'package',
  recharger: 'refresh-cw',
  agrandir: 'maximize-2',
} as const;

export type NomIcone = keyof typeof ICONES;

type Props = {
  nom: NomIcone;
  taille: number;
  couleur: string;
};

export function Icone({ nom, taille, couleur }: Props) {
  return <Feather name={ICONES[nom]} size={taille} color={couleur} />;
}
