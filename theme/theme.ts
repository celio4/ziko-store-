/**
 * Thème unique de l'application Ziko.
 *
 * Toutes les valeurs ci-dessous sont relevées dans la maquette Figma Make
 * « Boutique mobile Ziko » (feuille de style de l'aperçu) : on n'invente rien.
 * Les écrans et composants n'utilisent que ces constantes.
 */

/** Couleurs : les 10 variables CSS de la maquette, puis les teintes ponctuelles. */
export const couleurs = {
  // Variables globales (:root de la maquette)
  encre: '#1E2522', // --ink : texte principal
  attenue: '#6F7773', // --muted : texte secondaire
  marque: '#176B52', // --brand : vert Ziko
  marqueFonce: '#0E543F', // --brand-dark : vert appuyé
  marqueDouce: '#E8F3EE', // --brand-soft : fond vert pâle
  creme: '#F7F5EF', // --cream
  ligne: '#E8E9E5', // --line : bordures et séparateurs
  blanc: '#FFFFFF', // --white
  danger: '#B5453F', // --danger

  // Fonds
  fondEcran: '#FBFBF8', // fond de la coque du téléphone
  fondImage: '#EDEAE3', // fond d'une photo produit pendant le chargement
  fondPhotoBienvenue: '#E8EBE7',
  fondFiche: '#E9E8E2', // fond de la grande photo de la fiche
  fondQuantite: '#FAFBF9',
  fondRecap: '#EEF4F0', // carte « Récapitulatif » du panier
  squelette: '#EDF0ED',

  // Bordures
  bordureRecherche: '#E2E5E1',
  bordureCarte: '#EAEBE8',
  bordureLigneCommande: '#E8EAE7',
  bordureSecondaire: '#CDD7D2',
  bordureQuantite: '#DFE4E0',
  bordureRecapTotal: '#D4DFD9',
  bordureConfirmation: '#CFE0D7',
  bordureSqueletteCarte: '#EEEEEE',

  // Textes ponctuels
  iconeRecherche: '#8A928E',
  placeholder: '#9BA19E',
  texteFiltre: '#606763',
  texteDescription: '#646C68',
  texteRemplacement: '#77807C',
  titreRemplacement: '#56605B',
  texteMention: '#9A9F9C', // mentions légales, « / unité »
  noteProto: '#8C928F',
  texteRecap: '#69716D',
  noteRecap: '#8B928E',
  texteConfirmation: '#5D6863',
  noteConfirmation: '#717B76',
  quantiteDesactivee: '#C9CECB',
  supprimer: '#A35A54',
  pastille: '#D36B3D', // pastille du nombre d'articles
  voileBlanc: 'rgba(255, 255, 255, 0.91)', // #ffffffe8 : boutons flottants
  voileEtiquette: 'rgba(255, 255, 255, 0.9)', // #ffffffe6
  voileFeuille: 'rgba(25, 31, 28, 0.4)', // #191f1c66 : fond derrière la feuille
  poigneeFeuille: '#DADDDA',
  fondBoutonFermer: '#F1F2EF',
  separateurFeuille: '#F0F1EE',
  pagerInactif: 'rgba(255, 255, 255, 0.65)', // #ffffffa6
  succes: '#5F7838', // pictogramme « succès » de la feuille des états
  fondSucces: '#EFF4E7',
  fondDanger: '#FBEFEE',
  fondToast: '#26342F',
} as const;

/** Police Manrope (chargée via @expo-google-fonts/manrope), une famille par graisse. */
export const polices = {
  normal: 'Manrope_400Regular',
  moyen: 'Manrope_500Medium',
  semiGras: 'Manrope_600SemiBold',
  gras: 'Manrope_700Bold',
  extraGras: 'Manrope_800ExtraBold',
} as const;

/** Rayons d'angle relevés dans la maquette (en points). */
export const rayons = {
  petit: 10,
  icone: 11,
  champ: 12,
  quantite: 13,
  image: 14,
  bouton: 15,
  recherche: 16,
  ligne: 18,
  carte: 20,
  photo: 24,
  feuille: 26,
  pilule: 999,
} as const;

/** Ombres : chaînes CSS identiques à la maquette (propriété boxShadow de React Native). */
export const ombres = {
  standard: '0px 10px 34px rgba(29, 50, 42, 0.09)', // --shadow
  carte: '0px 6px 20px rgba(29, 47, 40, 0.043)',
  recherche: '0px 5px 18px rgba(34, 52, 45, 0.04)',
  boutonPrincipal: '0px 8px 18px rgba(23, 107, 82, 0.18)',
  photoBienvenue: '0px 18px 38px rgba(32, 51, 43, 0.13)',
  feuille: '0px -12px 40px rgba(20, 30, 26, 0.16)',
  toast: '0px 12px 28px rgba(25, 35, 31, 0.25)',
} as const;

/** Marges générales. */
export const espaces = {
  bordEcran: 20, // marge latérale des écrans
  bordEcranPetit: 15, // marge latérale sur les écrans de moins de 360 pt
} as const;

/** En dessous de cette largeur, la maquette resserre les marges et les photos. */
export const LARGEUR_PETIT_ECRAN = 360;

/** Taille minimale d'une zone tactile (recommandation iOS et Android). */
export const ZONE_TACTILE_MIN = 44;

/**
 * Convertit un espacement de lettres CSS (en « em ») en points React Native.
 * Exemple : -0.04em sur un texte de 26 pt donne -1,04 pt.
 */
export function espacementLettres(em: number, taille: number): number {
  return em * taille;
}
