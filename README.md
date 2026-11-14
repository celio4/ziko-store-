# Ziko — boutique mobile (test technique)

Prototype d'application de commande en **React Native avec Expo** (SDK 58, TypeScript,
Expo Router). On parcourt le catalogue, on consulte une fiche produit, on choisit une
quantité et on confirme une commande — **sans compte et sans serveur**.

L'historique Git suit la construction du projet étape par étape (un commit par étape).

---

## 1. Lancer l'application

### Prérequis

- **Node.js** en version LTS récente (testé avec Node 24).
- Un téléphone avec **Expo Go** (App Store / Play Store), **ou** un émulateur Android /
  simulateur iOS, **ou** un navigateur web.
- Un **compte Expo** gratuit (https://expo.dev/signup) — voir l'étape 3.

### Étapes

```bash
# 1. Récupérer le projet
git clone https://github.com/celio4/ziko-store-.git
cd ziko-store-

# 2. Installer les dépendances
npm install

# 3. Se connecter à Expo (même compte que dans Expo Go sur le téléphone)
npx expo login

# 4. Démarrer le serveur de développement
npx expo start
```

Puis :

- **Sur un téléphone** : scanner le QR code affiché dans le terminal (appareil photo sur
  iPhone, Expo Go sur Android). Le téléphone et l'ordinateur doivent être sur le
  **même réseau Wi-Fi**. Sinon : `npx expo start --tunnel`.
- **Émulateur / simulateur** : touche `a` (Android) ou `i` (iOS) dans le terminal.
- **Navigateur** : touche `w`.

### Problèmes rencontrés et solutions

| Message | Cause | Solution |
| --- | --- | --- |
| « You need to be signed in to Expo Go and Expo CLI » | Expo Go exige le même compte sur le téléphone et sur l'ordinateur | `npx expo login` sur l'ordinateur, puis se connecter avec le même compte dans Expo Go (onglet Profil) |
| Le téléphone ne trouve pas le serveur | Réseaux différents ou pare-feu | Même Wi-Fi, ou `npx expo start --tunnel` |
| `npx expo …` télécharge Expo / erreur npm | Commande lancée hors du dossier du projet | Se placer dans `ziko-store-` avant de lancer la commande |

### Vérifications

```bash
npm test             # 25 tests Jest (jest-expo) de la logique métier
npm run typecheck    # vérification TypeScript (tsc --noEmit)
```

---

## 2. Ce que fait l'application

| Route | Écran |
| --- | --- |
| `/` | Bienvenue — « Continuer sans compte » ouvre le catalogue |
| `/catalogue` | Liste des produits : recherche, filtres par catégorie, compteur |
| `/produit/[id]` | Fiche produit : grande photo (plein écran au toucher), description, quantité, ajout au panier ou commande directe |
| `/panier` | Panier : quantités, retrait d'article, récapitulatif |
| `/commande` | Confirmation : récapitulatif détaillé, quantité modifiable, total mis à jour, bouton « Confirmer » et message de succès |

**Points demandés et comment ils sont traités :**

- **Chargement simulé d'une seconde** avec cartes « squelette » ; états erreur
  (bouton « Réessayer »), catalogue vide et recherche sans résultat.
- **Quantité jamais inférieure à 1**, total recalculé à chaque changement (avec une petite
  animation pour rendre la mise à jour visible).
- **Recherche** insensible à la casse et aux accents (« ecouteurs » trouve « Écouteurs »),
  combinable avec les filtres Tous / Vêtements / Accessoires / Électronique.
- **Hors connexion** : le catalogue est enregistré sur le téléphone après chaque
  chargement réussi et reprend le relais si le chargement échoue (bandeau d'information) ;
  les photos sont gardées dans le cache disque.
- **Photos de secours** : les photos du sujet viennent de picsum.photos, qui était en
  panne pendant le développement (erreur 522). Six photos Unsplash libres de droits sont
  incluses dans l'application : visibles pendant le chargement, et à la place de la photo
  si picsum ne répond pas. Crédits dans `data/photosSecours.ts`.
- **« Tester les états »** : un bouton sur le catalogue ouvre une feuille qui permet de
  montrer chaque état (chargement, erreur, hors connexion, liste vide, recherche vide,
  photo indisponible) sans modifier le code.

---

## 3. Choix techniques et pourquoi

### Structure

```
app/          écrans (routage par fichiers d'Expo Router)
components/   composants réutilisables (Bouton, CarteProduit, ControleQuantite…)
context/      panier partagé (React Context, en mémoire)
data/         types, produits du sujet, chargement + cache du catalogue, photos de secours
utils/        fonctions pures (prix, recherche, commande) et leurs tests
theme/        couleurs, police Manrope, espacements, rayons relevés dans la maquette
assets/       icônes, écran de démarrage, photos de secours
```

### Les choix

- **Expo + Expo Router** : l'application se teste immédiatement dans Expo Go, sans Xcode
  ni Android Studio. Le routage par fichiers rend la navigation lisible (un fichier = un
  écran) et gère les paramètres (`/produit/3`) proprement.
- **TypeScript partout** : le type `Produit` est partagé par tous les écrans ; une erreur
  de champ est détectée avant l'exécution.
- **Pas de bibliothèque d'état (Redux, Zustand…)** : il n'y a qu'un panier en mémoire.
  Un React Context avec `useMemo`/`useCallback` suffit et évite une dépendance de plus.
- **Logique métier en fonctions pures** (`utils/`) : formatage du prix, recherche,
  calcul des totaux, quantité minimale. Elles sont testables sans afficher d'écran
  (25 tests), et réutilisées par le panier et la confirmation : un seul calcul du total.
- **Prix et recherche sans `Intl` ni `String.normalize`** : leur comportement dépend du
  moteur JavaScript et de la langue du téléphone. Une implémentation simple donne
  exactement le même résultat sur iOS et Android (« 87 500 FC »).
- **Un seul point d'accès aux données** (`chargerProduits` dans `data/catalogue.ts`) :
  c'est la seule fonction à remplacer par un vrai `fetch` le jour où une API existera ;
  les écrans ne changent pas.
- **AsyncStorage pour le hors connexion** : stockage clé/valeur simple, suffisant pour
  six produits. La clé est versionnée (`ziko:catalogue:v1`) et les données relues sont
  vérifiées avant usage, pour ne jamais afficher un cache corrompu.
- **expo-image** (plutôt que `Image` de React Native) : cache disque intégré,
  préchargement et image d'attente — utilisés pour le hors connexion et les photos de
  secours.
- **Icônes Feather** (`@expo/vector-icons`) : la maquette utilise des icônes au trait
  proches de Feather, déjà inclus dans Expo Go — pas de module natif à ajouter.
- **Confirmation indépendante du panier** : sur l'écran de confirmation, modifier une
  quantité ne touche pas au panier tant que la commande n'est pas confirmée.
- **Commande simulée** : « Confirmer » imite un court enregistrement (0,8 s) puis affiche
  le message de succès et vide le panier.
- **Accessibilité** : libellés pour les lecteurs d'écran, annonce du total et du succès,
  zones de toucher élargies.

---

## 4. Ce que j'améliorerais avec plus de temps

- **Vraie API** : remplacer le chargement simulé par un `fetch` (avec React Query ou
  TanStack Query pour le cache, les nouvelles tentatives et le rafraîchissement).
- **Envoi réel de la commande** : endpoint serveur, gestion des erreurs réseau,
  commandes mises en file d'attente hors connexion puis envoyées au retour du réseau.
- **Panier persistant** : le garder dans AsyncStorage pour qu'il survive à la fermeture
  de l'application.
- **Tests d'écrans** : React Native Testing Library pour les parcours (ajouter au panier,
  modifier la quantité, confirmer), et un test de bout en bout avec Maestro.
- **ESLint + Prettier** et une intégration continue (GitHub Actions) qui lance les tests
  et la vérification TypeScript à chaque push.
- **Photos produit maîtrisées** : héberger les vraies photos des produits plutôt que des
  images aléatoires de picsum, avec plusieurs photos par produit (le carrousel de la
  fiche est déjà esquissé).
- **Comptes utilisateurs** : les boutons de l'écran d'accueil sont prévus mais
  expliquent pour l'instant que la commande se fait sans compte.
- **Mode sombre** et **traduction** (lingala, swahili, anglais) — les couleurs et les
  textes sont déjà centralisés, ce qui faciliterait ces deux évolutions.
- **Build de démonstration** avec EAS (`eas build`) pour installer l'application sans
  Expo Go.
