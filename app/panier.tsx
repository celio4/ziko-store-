import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bouton } from '@/components/Bouton';
import { EnTete } from '@/components/EnTete';
import { LigneArticle } from '@/components/LigneArticle';
import { MessageEtat } from '@/components/MessageEtat';
import { usePanier } from '@/context/PanierContexte';
import { couleurs, espaces, LARGEUR_PETIT_ECRAN, polices, rayons } from '@/theme/theme';
import { calculerTotal, libelleArticles } from '@/utils/commande';
import { formaterPrix } from '@/utils/prix';

/** Panier : articles ajoutés depuis les fiches, avant de passer commande. */
export default function EcranPanier() {
  const { lignes, nombreArticles, modifierQuantite, retirer } = usePanier();
  const marges = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bord = width < LARGEUR_PETIT_ECRAN ? espaces.bordEcranPetit : espaces.bordEcran;
  const total = calculerTotal(lignes);
  const vide = lignes.length === 0;

  const retour = () => (router.canGoBack() ? router.back() : router.replace('/catalogue'));

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: bord, paddingBottom: marges.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <EnTete
          titre="Votre panier"
          sousTitre={vide ? 'Prêt pour vos trouvailles' : libelleArticles(nombreArticles)}
          onRetour={retour}
        />

        {vide ? (
          <MessageEtat
            grand
            icone="panier"
            titre="Votre panier est vide"
            texte="Découvrez notre sélection et ajoutez les produits qui vous plaisent."
            action={{ libelle: 'Découvrir les produits', onPress: () => router.dismissTo('/catalogue') }}
          />
        ) : (
          <>
            <View style={styles.lignes}>
              {lignes.map((ligne) => (
                <LigneArticle
                  key={ligne.produit.id}
                  ligne={ligne}
                  onChangeQuantite={(q) => modifierQuantite(ligne.produit.id, q)}
                  onRetirer={() => retirer(ligne.produit.id)}
                />
              ))}
            </View>

            <View style={styles.recap}>
              <Text style={styles.recapTitre}>Récapitulatif</Text>
              <View style={styles.recapLigne}>
                <Text style={styles.recapTexte}>{libelleArticles(nombreArticles)}</Text>
                <Text style={styles.recapTexte}>{formaterPrix(total)}</Text>
              </View>
              <View style={[styles.recapLigne, styles.recapTotal]}>
                <Text style={styles.recapTotalTexte}>Total</Text>
                <Text style={styles.recapTotalTexte}>{formaterPrix(total)}</Text>
              </View>
              <Bouton
                libelle="Continuer la commande"
                onPress={() => router.push({ pathname: '/commande', params: { origine: 'panier' } })}
              />
              <Text style={styles.recapNote}>Aucun paiement réel dans ce prototype.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fondEcran,
  },
  lignes: {
    gap: 10,
  },
  recap: {
    marginTop: 16,
    padding: 19,
    borderRadius: rayons.carte,
    backgroundColor: couleurs.fondRecap,
  },
  recapTitre: {
    marginBottom: 14,
    fontFamily: polices.extraGras,
    fontSize: 14,
    color: couleurs.encre,
  },
  recapLigne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 9,
  },
  recapTexte: {
    fontFamily: polices.normal,
    fontSize: 11,
    color: couleurs.texteRecap,
  },
  recapTotal: {
    marginTop: 15,
    marginBottom: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordureRecapTotal,
  },
  recapTotalTexte: {
    fontFamily: polices.extraGras,
    fontSize: 15,
    color: couleurs.encre,
  },
  recapNote: {
    marginTop: 10,
    fontFamily: polices.normal,
    fontSize: 8,
    textAlign: 'center',
    color: couleurs.noteRecap,
  },
});
