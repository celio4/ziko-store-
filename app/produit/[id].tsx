import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bouton } from '@/components/Bouton';
import { BoutonIcone } from '@/components/BoutonIcone';
import { ControleQuantite } from '@/components/ControleQuantite';
import { Icone } from '@/components/Icone';
import { ImageProduit } from '@/components/ImageProduit';
import { MessageEtat } from '@/components/MessageEtat';
import { Toast } from '@/components/Toast';
import { usePanier } from '@/context/PanierContexte';
import { trouverProduit } from '@/data/produits';
import { couleurs, espacementLettres, espaces, ombres, polices, rayons } from '@/theme/theme';
import { bornerQuantite } from '@/utils/commande';
import { formaterPrix } from '@/utils/prix';

/** Durée d'affichage du bandeau « ajouté au panier ». */
const DUREE_TOAST_MS = 2200;

export default function EcranFicheProduit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const produit = trouverProduit(Number(id));

  const marges = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { ajouter, nombreArticles } = usePanier();

  const [quantite, setQuantite] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const minuterieToast = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On nettoie la minuterie si l'on quitte l'écran avant la fin du bandeau.
  useEffect(() => {
    return () => {
      if (minuterieToast.current) clearTimeout(minuterieToast.current);
    };
  }, []);

  // Retour : on revient à l'écran précédent, ou au catalogue s'il n'y en a pas.
  const retour = () => (router.canGoBack() ? router.back() : router.replace('/catalogue'));

  // Produit inconnu (lien invalide) : message clair et retour au catalogue.
  if (!produit) {
    return (
      <SafeAreaView style={styles.ecranVide}>
        <MessageEtat
          icone="colis"
          titre="Produit introuvable"
          texte="Ce produit n’existe pas ou n’est plus disponible."
          action={{ libelle: 'Retour au catalogue', onPress: () => router.replace('/catalogue') }}
        />
      </SafeAreaView>
    );
  }

  const ajouterAuPanier = () => {
    ajouter(produit, quantite);
    setToastVisible(true);
    if (minuterieToast.current) clearTimeout(minuterieToast.current);
    minuterieToast.current = setTimeout(() => setToastVisible(false), DUREE_TOAST_MS);
  };

  const commanderDirectement = () => {
    router.push({ pathname: '/commande', params: { id: String(produit.id), quantite: String(quantite) } });
  };

  // Hauteur de la photo : min(52 % de l'écran, 430), au moins 360 (règle de la maquette),
  // plus la hauteur de la barre d'état puisque la photo passe dessous.
  const hauteurPhoto = Math.max(360, Math.min(height * 0.52, 430)) + marges.top;

  return (
    <View style={styles.ecran}>
      <ScrollView contentContainerStyle={{ paddingBottom: marges.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.photo, { height: hauteurPhoto }]}>
          <ImageProduit uri={produit.photo} nom={produit.nom} style={StyleSheet.absoluteFill} />

          {/* Boutons flottants au-dessus de la photo, sous l'encoche. */}
          <Pressable
            onPress={retour}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Retour au catalogue"
            style={({ pressed }) => [styles.boutonRetour, { top: marges.top + 13 }, pressed && styles.appuye]}
          >
            <Icone nom="retour" taille={21} couleur={couleurs.encre} />
            <Text style={styles.boutonRetourTexte}>Catalogue</Text>
          </Pressable>
          <View style={[styles.boutonPanier, { top: marges.top + 13 }]}>
            <BoutonIcone
              icone="panier"
              variante="flottant"
              pastille={nombreArticles}
              libelleAccessible={`Panier, ${nombreArticles} ${nombreArticles > 1 ? 'articles' : 'article'}`}
              onPress={() => router.push('/panier')}
            />
          </View>

          {/* Indicateur de photo (décoratif, repris de la maquette). */}
          <View style={styles.pagination} importantForAccessibility="no-hide-descendants" accessible={false}>
            <View style={styles.paginationActive} />
            <View style={styles.paginationPoint} />
            <View style={styles.paginationPoint} />
          </View>
        </View>

        <View style={styles.contenu}>
          <Text style={styles.surtitre}>{produit.categorie}</Text>
          <Text style={styles.nom} accessibilityRole="header">
            {produit.nom}
          </Text>
          <Text style={styles.prix}>{formaterPrix(produit.prix)}</Text>

          <View style={styles.separateur} />

          <Text style={styles.sousTitre}>Description</Text>
          <Text style={styles.description}>{produit.description}</Text>

          <View style={styles.quantite}>
            <View style={styles.quantiteTextes}>
              <Text style={styles.quantiteTitre}>Quantité</Text>
              <Text style={styles.quantiteAide}>Choisissez avant d’ajouter</Text>
            </View>
            <ControleQuantite quantite={quantite} onChange={(q) => setQuantite(bornerQuantite(q))} />
          </View>

          <View style={styles.actions}>
            <Bouton libelle="Ajouter au panier" icone="panier" onPress={ajouterAuPanier} />
            <Bouton libelle="Commander directement" variante="secondaire" onPress={commanderDirectement} />
          </View>
          <Text style={styles.note}>Commande simulée · Aucun paiement ne sera demandé</Text>
        </View>
      </ScrollView>

      {toastVisible && <Toast message={`${produit.nom} ajouté au panier`} bas={marges.bottom + 24} />}
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.blanc,
  },
  ecranVide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: espaces.bordEcran,
    backgroundColor: couleurs.fondEcran,
  },
  photo: {
    backgroundColor: couleurs.fondFiche,
  },
  boutonRetour: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 40,
    paddingLeft: 9,
    paddingRight: 13,
    borderRadius: rayons.pilule,
    backgroundColor: couleurs.voileBlanc,
    boxShadow: ombres.standard,
  },
  boutonRetourTexte: {
    fontFamily: polices.extraGras,
    fontSize: 11,
    color: couleurs.encre,
  },
  boutonPanier: {
    position: 'absolute',
    right: 16,
  },
  appuye: {
    opacity: 0.8,
  },
  pagination: {
    position: 'absolute',
    bottom: 14 + 16, // 16 pt sont recouverts par le contenu arrondi
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  paginationActive: {
    width: 17,
    height: 6,
    borderRadius: rayons.pilule,
    backgroundColor: couleurs.blanc,
  },
  paginationPoint: {
    width: 6,
    height: 6,
    borderRadius: rayons.pilule,
    backgroundColor: couleurs.pagerInactif,
  },
  contenu: {
    marginTop: -16,
    paddingTop: 27,
    paddingHorizontal: espaces.bordEcran,
    paddingBottom: 12,
    backgroundColor: couleurs.blanc,
    borderTopLeftRadius: rayons.photo,
    borderTopRightRadius: rayons.photo,
  },
  surtitre: {
    fontFamily: polices.extraGras,
    fontSize: 9,
    letterSpacing: espacementLettres(0.08, 9),
    textTransform: 'uppercase',
    color: couleurs.marque,
  },
  nom: {
    marginVertical: 6,
    fontFamily: polices.extraGras,
    fontSize: 25,
    lineHeight: 29.5,
    letterSpacing: espacementLettres(-0.045, 25),
    color: couleurs.encre,
  },
  prix: {
    fontFamily: polices.extraGras,
    fontSize: 18,
    color: couleurs.marque,
  },
  separateur: {
    height: 1,
    marginVertical: 21,
    backgroundColor: couleurs.ligne,
  },
  sousTitre: {
    marginBottom: 7,
    fontFamily: polices.extraGras,
    fontSize: 13,
    color: couleurs.encre,
  },
  description: {
    fontFamily: polices.normal,
    fontSize: 12,
    lineHeight: 19.8,
    color: couleurs.texteDescription,
  },
  quantite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 22,
  },
  quantiteTextes: {
    flexShrink: 1,
    gap: 4,
  },
  quantiteTitre: {
    fontFamily: polices.gras,
    fontSize: 13,
    color: couleurs.encre,
  },
  quantiteAide: {
    fontFamily: polices.normal,
    fontSize: 9,
    color: couleurs.attenue,
  },
  actions: {
    gap: 9,
  },
  note: {
    marginTop: 12,
    fontFamily: polices.normal,
    fontSize: 9,
    textAlign: 'center',
    color: couleurs.noteProto,
  },
});
