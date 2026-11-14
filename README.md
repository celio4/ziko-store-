# Ziko — boutique mobile (test technique)

Prototype d'application de commande en React Native (Expo, TypeScript, Expo Router).
On parcourt le catalogue, on consulte une fiche produit, on choisit une quantité et on
confirme une commande — **sans compte et sans serveur**.

## Lancer le projet

```bash
npm install
npx expo start        # puis « a » (Android), « i » (iOS) ou « w » (web), ou Expo Go
```

Vérifications :

```bash
npm test              # tests Jest (jest-expo) de la logique pure
npm run typecheck     # tsc --noEmit
```

## Écrans

| Route | Écran |
| --- | --- |
| `/` | Bienvenue (maquette) — « Continuer sans compte » ouvre le catalogue |
| `/catalogue` | Liste des produits : recherche, filtres par catégorie, compteur |
| `/produit/[id]` | Fiche produit : photo, description, quantité, ajout au panier / commande directe |
| `/panier` | Panier : quantités, retrait d'article, récapitulatif |
| `/commande` | Confirmation : récapitulatif modifiable, total recalculé, message de succès |

## Fonctionnalités

- **Chargement simulé d'une seconde** avec cartes squelettes ; états erreur (« Réessayer »),
  catalogue vide et recherche sans résultat.
- **Recherche** insensible à la casse et aux accents, combinable avec les filtres
  Tous / Vêtements / Accessoires / Électronique.
- **Hors connexion** : le catalogue est enregistré dans AsyncStorage après chaque
  chargement réussi et sert de secours (bandeau d'information) ; les photos sont
  préchargées dans le cache disque d'`expo-image`.
- **Photos de secours** : 6 photos Unsplash incluses dans l'application
  (`assets/images/produits`, crédits dans `data/photosSecours.ts`), visibles pendant le
  chargement des photos du sujet et à leur place si picsum.photos ne répond pas.
- **Quantité jamais inférieure à 1**, total recalculé à chaque changement.
- **Feuille « Tester les états »** (bouton sur le catalogue) pour montrer chaque état
  sans modifier le code : chargement, erreur, hors connexion, liste vide, recherche vide,
  photo indisponible.

## Organisation du code

```
app/          écrans (routage par fichiers d'Expo Router)
components/   composants réutilisables (Bouton, CarteProduit, ControleQuantite…)
context/      panier partagé (React Context, en mémoire)
data/         types, produits du sujet, chargement + cache du catalogue
utils/        fonctions pures (prix, recherche, commande) et leurs tests
theme/        couleurs, police Manrope, espacements, rayons relevés dans la maquette
```

## Choix techniques

- **Pas de bibliothèque d'état** : un Context suffit pour un panier en mémoire.
- **Logique métier en fonctions pures** (`utils/`) : testable sans rendu, réutilisée
  par le panier et la confirmation.
- **Un seul point d'accès aux données** (`chargerProduits` dans `data/catalogue.ts`) :
  c'est la seule fonction à remplacer par un vrai `fetch` le jour où une API existera.
- **Commande simulée** : la confirmation imite un enregistrement puis vide le panier.

## Limites et pistes

- Pas de persistance du panier ni de compte utilisateur (hors du périmètre du sujet).
- ESLint n'est pas encore configuré (`npx expo lint` l'installerait).
- Pistes : API réelle, persistance du panier, tests de composants (React Native Testing Library).
