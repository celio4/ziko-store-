import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { couleurs, polices } from '@/theme/theme';
import { Icone } from './Icone';

type Props = {
  uri: string;
  nom: string;
  style: StyleProp<ViewStyle>;
  /** Force l'affichage du visuel de remplacement (démonstration des états). */
  forcerRemplacement?: boolean;
};

/**
 * Photo d'un produit.
 *
 * - `cachePolicy="disk"` : expo-image garde la photo sur le disque du téléphone,
 *   elle reste donc visible hors connexion une fois téléchargée.
 * - Si la photo ne peut pas être chargée, on affiche un visuel de remplacement
 *   (icône colis + « Photo indisponible » + nom du produit), comme la maquette.
 */
export function ImageProduit({ uri, nom, style, forcerRemplacement = false }: Props) {
  const [enErreur, setEnErreur] = useState(false);

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
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="disk"
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
