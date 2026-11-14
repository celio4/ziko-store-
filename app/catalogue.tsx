import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CarteProduit } from '@/components/CarteProduit';
import { EnTete } from '@/components/EnTete';
import { FeuilleEtats, type OptionEtat } from '@/components/FeuilleEtats';
import { Icone } from '@/components/Icone';
import { MessageEtat } from '@/components/MessageEtat';
import { SqueletteProduit } from '@/components/SqueletteProduit';
import { chargerProduits, type OptionsChargement } from '@/data/catalogue';
import type { Produit } from '@/data/types';
import { couleurs, espacementLettres, espaces, LARGEUR_PETIT_ECRAN, polices, rayons } from '@/theme/theme';
import { libelleArticles } from '@/utils/commande';

/** Les trois états possibles du chargement. */
type Statut = 'chargement' | 'erreur' | 'pret';

/** États proposés dans la feuille « Tester les états ». */
type EtatDemo = 'chargement' | 'erreur' | 'vide' | 'photo' | 'charge';

const OPTIONS_DEMO: readonly OptionEtat<EtatDemo>[] = [
  { cle: 'chargement', titre: 'Chargement', description: 'Squelettes pendant une seconde', icone: 'chargement' },
  { cle: 'erreur', titre: 'Erreur de chargement', description: 'Message et action pour réessayer', icone: 'recharger', ton: 'danger' },
  { cle: 'vide', titre: 'Liste vide', description: 'Aucun produit dans le catalogue', icone: 'colis' },
  { cle: 'photo', titre: 'Photo indisponible', description: 'Visuel de remplacement sur une carte', icone: 'colis' },
  { cle: 'charge', titre: 'Catalogue chargé', description: 'Les six produits disponibles', icone: 'valider', ton: 'succes' },
];

/** Nombre de cartes « squelette » affichées pendant le chargement. */
const NOMBRE_SQUELETTES = 4;

export default function EcranCatalogue() {
  const marges = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bord = width < LARGEUR_PETIT_ECRAN ? espaces.bordEcranPetit : espaces.bordEcran;

  const [statut, setStatut] = useState<Statut>('chargement');
  const [produits, setProduits] = useState<Produit[]>([]);
  const [feuilleOuverte, setFeuilleOuverte] = useState(false);
  const [photoForcee, setPhotoForcee] = useState(false);

  // Numéro du dernier chargement lancé : on ignore les réponses des anciens
  // chargements (par exemple si l'on touche deux fois « Réessayer »).
  const dernierChargement = useRef(0);

  const charger = useCallback(async (options: OptionsChargement = {}) => {
    const numero = ++dernierChargement.current;
    setStatut('chargement');
    try {
      const resultat = await chargerProduits(options);
      if (numero !== dernierChargement.current) return;
      setProduits(resultat);
      setStatut('pret');
    } catch {
      if (numero !== dernierChargement.current) return;
      setStatut('erreur');
    }
  }, []);

  // Premier chargement à l'ouverture de l'écran.
  useEffect(() => {
    charger();
  }, [charger]);

  const ouvrirProduit = useCallback((produit: Produit) => {
    router.push({ pathname: '/produit/[id]', params: { id: String(produit.id) } });
  }, []);

  /** Applique l'état choisi dans la feuille de démonstration. */
  const choisirEtat = (etat: EtatDemo) => {
    setFeuilleOuverte(false);
    setPhotoForcee(etat === 'photo');
    if (etat === 'erreur') {
      charger({ simulerErreur: true });
    } else if (etat === 'vide') {
      charger({ simulerVide: true });
    } else if (etat === 'chargement') {
      charger();
    } else if (statut !== 'pret' || produits.length === 0) {
      // « Catalogue chargé » ou « Photo indisponible » : on recharge si besoin.
      charger();
    }
  };

  const enTete = (
    <View>
      <EnTete
        titre="Ziko"
        sousTitre="Le bon choix, tout près de vous."
        droite={
          <Pressable
            onPress={() => setFeuilleOuverte(true)}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Tester les états"
            style={({ pressed }) => [styles.boutonEtats, pressed && styles.appuye]}
          >
            <Icone nom="reglages" taille={16} couleur={couleurs.marque} />
            <Text style={styles.boutonEtatsTexte}>États</Text>
          </Pressable>
        }
      />
      <View style={styles.titreListe}>
        <Text style={styles.titreListeTexte} accessibilityRole="header">
          Nos produits
        </Text>
        {statut === 'pret' && <Text style={styles.compteur}>{libelleArticles(produits.length)}</Text>}
      </View>
    </View>
  );

  /** Contenu affiché quand la liste n'a pas de produits à montrer. */
  const contenuVide = () => {
    if (statut === 'chargement') {
      return (
        <View style={styles.squelettes} accessibilityLabel="Chargement des produits" accessibilityRole="progressbar">
          {Array.from({ length: NOMBRE_SQUELETTES }, (_, i) => (
            <SqueletteProduit key={i} />
          ))}
        </View>
      );
    }
    if (statut === 'erreur') {
      return (
        <MessageEtat
          icone="recharger"
          titre="Impossible de charger le catalogue"
          texte="Une erreur de démonstration est survenue. Réessayez pour afficher les produits."
          action={{ libelle: 'Réessayer', icone: 'recharger', onPress: () => charger() }}
        />
      );
    }
    return (
      <MessageEtat
        icone="colis"
        titre="Aucun produit pour le moment"
        texte="Le catalogue est vide. Réessayez dans quelques instants."
        action={{ libelle: 'Réessayer', icone: 'recharger', onPress: () => charger() }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.ecran} edges={['top', 'left', 'right']}>
      <FlatList
        data={statut === 'pret' ? produits : []}
        keyExtractor={(produit) => String(produit.id)}
        renderItem={({ item, index }) => (
          <CarteProduit produit={item} onPress={ouvrirProduit} forcerRemplacementPhoto={photoForcee && index === 0} />
        )}
        ListHeaderComponent={enTete}
        ListEmptyComponent={contenuVide}
        ItemSeparatorComponent={Separateur}
        contentContainerStyle={{ paddingHorizontal: bord, paddingBottom: marges.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // Réglages de fluidité : peu de cartes rendues d'un coup.
        initialNumToRender={6}
        windowSize={7}
      />
      <FeuilleEtats
        visible={feuilleOuverte}
        options={OPTIONS_DEMO}
        onChoisir={choisirEtat}
        onFermer={() => setFeuilleOuverte(false)}
      />
    </SafeAreaView>
  );
}

/** Espace de 12 pt entre deux cartes. */
function Separateur() {
  return <View style={styles.separateur} />;
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: couleurs.fondEcran,
  },
  boutonEtats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: rayons.champ,
    backgroundColor: couleurs.marqueDouce,
  },
  boutonEtatsTexte: {
    fontFamily: polices.extraGras,
    fontSize: 11,
    color: couleurs.marque,
  },
  appuye: {
    opacity: 0.75,
  },
  titreListe: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 13,
  },
  titreListeTexte: {
    fontFamily: polices.extraGras,
    fontSize: 17,
    letterSpacing: espacementLettres(-0.025, 17),
    color: couleurs.encre,
  },
  compteur: {
    fontFamily: polices.semiGras,
    fontSize: 11,
    color: couleurs.attenue,
  },
  squelettes: {
    gap: 12,
  },
  separateur: {
    height: 12,
  },
});
