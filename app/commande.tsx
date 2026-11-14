import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bouton } from '@/components/Bouton';
import { EnTete } from '@/components/EnTete';
import { Icone } from '@/components/Icone';
import { LigneArticle } from '@/components/LigneArticle';
import { MessageEtat } from '@/components/MessageEtat';
import { usePanier } from '@/context/PanierContexte';
import { trouverProduit } from '@/data/produits';
import type { LigneCommande } from '@/data/types';
import { couleurs, espacementLettres, espaces, LARGEUR_PETIT_ECRAN, polices, rayons } from '@/theme/theme';
import { bornerQuantite, calculerSousTotal, calculerTotal, compterArticles, libelleArticles } from '@/utils/commande';
import { formaterPrix } from '@/utils/prix';

/** Durée de l'enregistrement simulé de la commande. */
const DELAI_ENREGISTREMENT_MS = 800;

/** Paramètres reçus : un produit et sa quantité, ou « origine=panier ». */
type Parametres = { id?: string; quantite?: string; origine?: string };

/**
 * Construit les lignes de départ de la commande :
 * - depuis le panier : copie des lignes du panier ;
 * - depuis « Commander directement » : le produit choisi et sa quantité.
 */
function lignesInitiales(parametres: Parametres, lignesPanier: LigneCommande[]): LigneCommande[] {
  if (parametres.origine === 'panier') {
    return lignesPanier.map((ligne) => ({ ...ligne }));
  }
  const produit = trouverProduit(Number(parametres.id));
  return produit ? [{ produit, quantite: bornerQuantite(Number(parametres.quantite ?? 1)) }] : [];
}

export default function EcranCommande() {
  const parametres = useLocalSearchParams<Parametres>();
  const panier = usePanier();
  const marges = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bord = width < LARGEUR_PETIT_ECRAN ? espaces.bordEcranPetit : espaces.bordEcran;

  // Les quantités sont modifiables ici sans toucher au panier.
  const [lignes, setLignes] = useState<LigneCommande[]>(() => lignesInitiales(parametres, panier.lignes));
  const [enCours, setEnCours] = useState(false);
  const [confirmee, setConfirmee] = useState(false);
  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (minuterie.current) clearTimeout(minuterie.current);
    };
  }, []);

  // Le total est recalculé à chaque rendu, donc à chaque changement de quantité.
  const total = calculerTotal(lignes);
  const nombreArticles = compterArticles(lignes);

  // Petit « pouls » sur le total quand il change, pour rendre la mise à jour visible.
  const echelleTotal = useRef(new Animated.Value(1)).current;
  const premierTotal = useRef(true);
  useEffect(() => {
    if (premierTotal.current) {
      premierTotal.current = false;
      return;
    }
    echelleTotal.setValue(1.12);
    Animated.spring(echelleTotal, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [total, echelleTotal]);

  const changerQuantite = (idProduit: number, quantite: number) => {
    setLignes((actuelles) =>
      actuelles.map((ligne) => (ligne.produit.id === idProduit ? { ...ligne, quantite: bornerQuantite(quantite) } : ligne)),
    );
  };

  const confirmer = () => {
    setEnCours(true);
    // Aucun serveur : on simule un court enregistrement puis on affiche le succès.
    minuterie.current = setTimeout(() => {
      if (parametres.origine === 'panier') {
        panier.vider();
      }
      setEnCours(false);
      setConfirmee(true);
    }, DELAI_ENREGISTREMENT_MS);
  };

  const retourBoutique = () => router.dismissTo('/catalogue');
  const retour = () => (router.canGoBack() ? router.back() : router.replace('/catalogue'));

  // Commande impossible à construire (lien invalide, panier vidé…).
  if (lignes.length === 0 && !confirmee) {
    return (
      <SafeAreaView style={[styles.ecran, { paddingHorizontal: bord }]}>
        <EnTete titre="Confirmer la commande" onRetour={retour} />
        <MessageEtat
          icone="colis"
          titre="Aucun article à commander"
          texte="Choisissez un produit dans le catalogue pour passer commande."
          action={{ libelle: 'Retour à la boutique', onPress: retourBoutique }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: bord, paddingBottom: marges.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {confirmee ? (
          <>
            <EnTete titre="Commande enregistrée" sousTitre="Merci pour votre confiance" />
            <Succes nombreArticles={nombreArticles} total={total} onRetour={retourBoutique} />
          </>
        ) : (
          <>
            <EnTete titre="Confirmer la commande" sousTitre="Vérifiez votre récapitulatif" onRetour={retour} />

            <View style={styles.intro}>
              <Text style={styles.introTitre}>Récapitulatif</Text>
              <Text style={styles.introAide}>Quantités modifiables</Text>
            </View>

            <View style={styles.lignes}>
              {lignes.map((ligne) => (
                <LigneArticle
                  key={ligne.produit.id}
                  ligne={ligne}
                  compacte
                  onChangeQuantite={(q) => changerQuantite(ligne.produit.id, q)}
                />
              ))}
            </View>

            <View style={styles.totalBoite}>
              {/* Détail : une ligne par produit, recalculée à chaque changement de quantité. */}
              <View style={styles.detail}>
                {lignes.map((ligne) => (
                  <View key={ligne.produit.id} style={styles.detailLigne}>
                    <Text style={styles.detailNom} numberOfLines={1}>
                      {ligne.produit.nom} <Text style={styles.detailQuantite}>× {ligne.quantite}</Text>
                    </Text>
                    <Text style={styles.detailMontant}>{formaterPrix(calculerSousTotal(ligne))}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.totalLigne}>
                <Text style={styles.totalLibelle}>
                  Total · {libelleArticles(nombreArticles)}
                </Text>
                <Animated.Text
                  style={[styles.totalMontant, { transform: [{ scale: echelleTotal }] }]}
                  accessibilityLiveRegion="polite"
                >
                  {formaterPrix(total)}
                </Animated.Text>
              </View>
              <Text style={styles.totalNote}>
                En confirmant, vous enregistrez uniquement une demande fictive. Aucun paiement ni livraison réelle.
              </Text>
            </View>

            <Bouton libelle="Confirmer" icone="valider" onPress={confirmer} enCours={enCours} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type PropsSucces = { nombreArticles: number; total: number; onRetour: () => void };

/** Message de succès (classe .success-state), avec la coche qui « rebondit ». */
function Succes({ nombreArticles, total, onRetour }: PropsSucces) {
  const echelle = useRef(new Animated.Value(0.4)).current;
  const opacite = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation « success-pop » de la maquette : 0,4 -> 1,08 -> 1 en 0,5 s.
    Animated.parallel([
      Animated.timing(opacite, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(echelle, { toValue: 1.08, duration: 350, useNativeDriver: true }),
        Animated.timing(echelle, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
    ]).start();
  }, [echelle, opacite]);

  return (
    <View style={styles.succes} accessibilityLiveRegion="assertive">
      <Animated.View style={[styles.coche, { opacity: opacite, transform: [{ scale: echelle }] }]}>
        <Icone nom="valider" taille={38} couleur={couleurs.blanc} />
      </Animated.View>
      <Text style={styles.succesSurtitre}>C’est confirmé</Text>
      <Text style={styles.succesTitre} accessibilityRole="header">
        Votre commande a bien été enregistrée.
      </Text>
      <Text style={styles.succesTexte}>La boutique pourra reprendre contact avec vous. Aucun paiement n’a été effectué.</Text>
      <View style={styles.recap}>
        <Text style={styles.recapLibelle}>{libelleArticles(nombreArticles)}</Text>
        <Text style={styles.recapMontant}>{formaterPrix(total)}</Text>
      </View>
      <Bouton libelle="Retour à la boutique" onPress={onRetour} />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fondEcran,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 12,
  },
  introTitre: {
    fontFamily: polices.extraGras,
    fontSize: 14,
    color: couleurs.encre,
  },
  introAide: {
    fontFamily: polices.gras,
    fontSize: 9,
    color: couleurs.marque,
  },
  lignes: {
    gap: 10,
  },
  totalBoite: {
    marginVertical: 16,
    padding: 18,
    borderRadius: rayons.ligne,
    backgroundColor: couleurs.marqueDouce,
  },
  detail: {
    gap: 8,
    marginBottom: 13,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.bordureConfirmation,
  },
  detailLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  detailNom: {
    flexShrink: 1,
    fontFamily: polices.moyen,
    fontSize: 11,
    color: couleurs.texteConfirmation,
  },
  detailQuantite: {
    fontFamily: polices.gras,
    color: couleurs.marque,
  },
  detailMontant: {
    fontFamily: polices.gras,
    fontSize: 11,
    color: couleurs.texteConfirmation,
  },
  totalLigne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  totalLibelle: {
    flexShrink: 1,
    fontFamily: polices.normal,
    fontSize: 11,
    color: couleurs.texteConfirmation,
  },
  totalMontant: {
    fontFamily: polices.gras,
    fontSize: 18,
    color: couleurs.marque,
  },
  totalNote: {
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: couleurs.bordureConfirmation,
    fontFamily: polices.normal,
    fontSize: 9,
    lineHeight: 13.95,
    color: couleurs.noteConfirmation,
  },
  succes: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 2,
    paddingBottom: 10,
  },
  coche: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: couleurs.marque,
    // Anneau vert pâle de 12 pt autour de la coche.
    boxShadow: `0px 0px 0px 12px ${couleurs.marqueDouce}`,
  },
  succesSurtitre: {
    fontFamily: polices.extraGras,
    fontSize: 9,
    letterSpacing: espacementLettres(0.1, 9),
    textTransform: 'uppercase',
    color: couleurs.marque,
  },
  succesTitre: {
    maxWidth: 330,
    marginTop: 9,
    marginBottom: 12,
    fontFamily: polices.extraGras,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: espacementLettres(-0.04, 24),
    textAlign: 'center',
    color: couleurs.encre,
  },
  succesTexte: {
    maxWidth: 310,
    fontFamily: polices.normal,
    fontSize: 11,
    lineHeight: 18.15,
    textAlign: 'center',
    color: couleurs.attenue,
  },
  recap: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 20,
    paddingVertical: 17,
    paddingHorizontal: 18,
    backgroundColor: couleurs.blanc,
    borderWidth: 1,
    borderColor: couleurs.ligne,
    borderRadius: rayons.recherche,
  },
  recapLibelle: {
    fontFamily: polices.normal,
    fontSize: 11,
    color: couleurs.attenue,
  },
  recapMontant: {
    fontFamily: polices.gras,
    fontSize: 15,
    color: couleurs.encre,
  },
});
