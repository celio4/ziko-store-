import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bouton } from '@/components/Bouton';
import { ImageProduit } from '@/components/ImageProduit';
import { trouverProduit } from '@/data/produits';
import type { Produit } from '@/data/types';
import { couleurs, espacementLettres, espaces, ombres, polices, rayons, ZONE_TACTILE_MIN } from '@/theme/theme';

/** Les trois produits de la galerie, comme dans la maquette : robe, montre, sac. */
const GALERIE = [2, 5, 4]
  .map((id) => trouverProduit(id))
  .filter((produit): produit is Produit => produit !== undefined);

/** Borne une valeur entre un minimum et un maximum (équivalent du clamp() CSS). */
function borner(min: number, valeur: number, max: number): number {
  return Math.min(max, Math.max(min, valeur));
}

/** Écran de bienvenue : présentation de Ziko et accès au catalogue sans compte. */
export default function EcranBienvenue() {
  const { width, height } = useWindowDimensions();
  const marges = useSafeAreaInsets();

  // Tailles « fluides » de la maquette : clamp(270px, 39vh, 360px) et clamp(27px, 7.3vw, 32px).
  const hauteurGalerie = borner(270, height * 0.39, 360);
  const tailleTitre = borner(27, width * 0.073, 32);

  const continuerSansCompte = () => router.push('/catalogue');

  // Pas de compte dans ce prototype : on l'explique et on propose de continuer.
  const compteIndisponible = () => {
    Alert.alert('Mode prototype', 'La commande est possible sans connexion.', [
      { text: 'Fermer', style: 'cancel' },
      { text: 'Continuer sans compte', onPress: continuerSansCompte },
    ]);
  };

  const [principale, haut, bas] = GALERIE;

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.contenu, { paddingBottom: Math.max(24, marges.bottom) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marque}>
          <View style={styles.logo}>
            <Text style={styles.logoLettre}>Z</Text>
          </View>
          <Text style={styles.marqueNom}>Ziko</Text>
        </View>

        <View style={[styles.galerie, { height: hauteurGalerie }]} accessibilityLabel="Sélection de produits Ziko">
          {principale && (
            <ImageProduit uri={principale.photo} nom={principale.nom} style={[styles.photo, styles.photoPrincipale]} />
          )}
          {haut && <ImageProduit uri={haut.photo} nom={haut.nom} style={[styles.photo, styles.photoHaut]} />}
          {bas && <ImageProduit uri={bas.photo} nom={bas.nom} style={[styles.photo, styles.photoBas]} />}
          <Text style={styles.etiquette}>Mode · Tech · Accessoires</Text>
        </View>

        <Text style={styles.surtitre}>Bienvenue à Kinshasa</Text>
        <Text
          style={[styles.titre, { fontSize: tailleTitre, lineHeight: tailleTitre * 1.12, letterSpacing: espacementLettres(-0.055, tailleTitre) }]}
          accessibilityRole="header"
        >
          Tout ce que vous aimez, au même endroit.
        </Text>
        <Text style={styles.texte}>Découvrez la sélection Ziko et commandez en quelques gestes depuis votre téléphone.</Text>

        <View style={styles.actions}>
          <Bouton libelle="Créer mon compte" onPress={compteIndisponible} />
          <Bouton libelle="J’ai déjà un compte" variante="secondaire" onPress={compteIndisponible} />
          <Pressable
            onPress={continuerSansCompte}
            accessibilityRole="button"
            accessibilityLabel="Continuer sans compte"
            style={({ pressed }) => [styles.invite, pressed && styles.appuye]}
          >
            <Text style={styles.inviteTexte}>Continuer sans compte</Text>
            <Text style={styles.inviteChevron}>›</Text>
          </Pressable>
        </View>
        <Text style={styles.mention}>Prototype de démonstration · Aucune donnée n’est transmise</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fondEcran,
  },
  contenu: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: espaces.bordEcran,
  },
  marque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 48,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: rayons.icone,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: couleurs.marque,
  },
  logoLettre: {
    fontFamily: polices.extraGras,
    fontSize: 17,
    color: couleurs.blanc,
  },
  marqueNom: {
    fontFamily: polices.gras,
    fontSize: 18,
    letterSpacing: espacementLettres(-0.04, 18),
    color: couleurs.encre,
  },
  galerie: {
    marginTop: 12,
    marginBottom: 24,
  },
  photo: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: couleurs.blanc,
    borderRadius: rayons.photo,
    backgroundColor: couleurs.fondPhotoBienvenue,
    boxShadow: ombres.photoBienvenue,
  },
  photoPrincipale: {
    top: 0,
    bottom: 0,
    left: 0,
    right: '31%',
    transform: [{ rotate: '-2deg' }],
  },
  photoHaut: {
    width: '41%',
    height: '48%',
    top: '3%',
    right: 0,
    transform: [{ rotate: '3deg' }],
  },
  photoBas: {
    width: '42%',
    height: '45%',
    bottom: '1%',
    right: '1%',
    transform: [{ rotate: '-1.5deg' }],
  },
  etiquette: {
    position: 'absolute',
    bottom: 15,
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: rayons.pilule,
    overflow: 'hidden',
    backgroundColor: couleurs.voileEtiquette,
    fontFamily: polices.extraGras,
    fontSize: 8,
    letterSpacing: espacementLettres(0.04, 8),
    textTransform: 'uppercase',
    color: couleurs.encre,
  },
  surtitre: {
    fontFamily: polices.extraGras,
    fontSize: 9,
    letterSpacing: espacementLettres(0.1, 9),
    textTransform: 'uppercase',
    color: couleurs.marque,
  },
  titre: {
    maxWidth: 365,
    marginTop: 7,
    marginBottom: 10,
    fontFamily: polices.extraGras,
    color: couleurs.encre,
  },
  texte: {
    maxWidth: 350,
    fontFamily: polices.normal,
    fontSize: 11,
    lineHeight: 17.6,
    color: couleurs.attenue,
  },
  actions: {
    gap: 9,
    marginTop: 'auto',
    paddingTop: 22,
  },
  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: ZONE_TACTILE_MIN,
  },
  appuye: {
    opacity: 0.7,
  },
  inviteTexte: {
    fontFamily: polices.extraGras,
    fontSize: 10,
    color: couleurs.marque,
  },
  inviteChevron: {
    fontFamily: polices.extraGras,
    fontSize: 16,
    lineHeight: 18,
    color: couleurs.marque,
  },
  mention: {
    fontFamily: polices.normal,
    fontSize: 7,
    textAlign: 'center',
    color: couleurs.texteMention,
  },
});
