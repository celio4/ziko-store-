import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { photoSecours } from '@/data/photosSecours';
import { couleurs, polices } from '@/theme/theme';
import { Icone } from './Icone';

type Props = {
  uri: string;
  nom: string;
  style: StyleProp<ViewStyle>;
  /** Force l'affichage du visuel de remplacement (démonstration des états). */
  forcerRemplacement?: boolean;
  /** « cover » (par défaut) remplit le cadre ; « contain » montre la photo entière. */
  ajustement?: 'cover' | 'contain';
};

/**
 * Photo d'un produit.
 *
 * - `cachePolicy="memory-disk"` : expo-image garde la photo en mémoire (défilement
 *   fluide) et sur le disque du téléphone : elle reste visible hors connexion.
 * - Photo de secours incluse dans l'application (voir data/photosSecours.ts) :
 *   visible pendant l'attente, et à la place de la photo si son chargement échoue.
 * - Sans photo de secours, si la photo ne peut pas être chargée, on affiche un visuel de remplacement
 *   (icône colis + « Photo indisponible » + nom du produit), comme la maquette.
 */
export function ImageProduit({ uri, nom, style, forcerRemplacement = false, ajustement = 'cover' }: Props) {
  const [enErreur, setEnErreur] = useState(false);
  const secours = photoSecours(uri);

  // Photo distante en échec mais photo de secours incluse dans l'application : on l'affiche.
  if (enErreur && secours !== undefined && !forcerRemplacement) {
    return (
      <View style={[styles.conteneur, style]}>
        <Image source={secours} style={StyleSheet.absoluteFill} contentFit={ajustement} accessibilityLabel={nom} />
      </View>
    );
  }

  if (enErreur || forcerRemplacement) {
    return (
      <View style={[styles.remplacement, style]} accessibilityRole="image" accessibilityLabel={`Photo indisponible : ${nom}`}>
        <Icone nom="colis" taille={28} couleur={couleurs.texteRemplacement} />
        <Text style={styles.mention}>Photo indisponible</Text>
        <Text style={styles.nom} numberOfLines={2}>
          {nom}
        </Text>
      </View>
    );
  }

  // Le conteneur porte la taille et les angles ; la photo le remplit entièrement.
  return (
    <View style={[styles.conteneur, style]}>
      <Image
        source={{ uri }}
        // Pendant l'attente de la photo distante, la photo de secours est déjà visible.
        placeholder={secours}
        placeholderContentFit={ajustement}
        style={StyleSheet.absoluteFill}
        contentFit={ajustement}
        cachePolicy="memory-disk"
        transition={150}
        accessibilityLabel={nom}
        onError={() => setEnErreur(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    overflow: 'hidden',
    backgroundColor: couleurs.fondImage,
  },
  remplacement: {
    // Dégradé de la maquette : linear-gradient(135deg, #eef1ed, #e1e8e3)
    backgroundImage: 'linear-gradient(135deg, #EEF1ED, #E1E8E3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
  },
  mention: {
    fontFamily: polices.normal,
    fontSize: 9,
    color: couleurs.texteRemplacement,
    textAlign: 'center',
  },
  nom: {
    fontFamily: polices.gras,
    fontSize: 10,
    lineHeight: 12.5,
    color: couleurs.titreRemplacement,
    textAlign: 'center',
  },
});
