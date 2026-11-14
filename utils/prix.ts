/**
 * Formate un prix en francs congolais : 35000 -> « 35 000 FC ».
 *
 * Fonction pure, volontairement sans `Intl` : le formatage de `Intl` dépend
 * du moteur JavaScript et de la langue du téléphone, il peut donc différer
 * entre iOS et Android. Ici le résultat est identique partout.
 */
export function formaterPrix(montant: number): string {
  // On travaille sur un entier positif ; le signe est remis à la fin.
  const entier = Math.round(Math.abs(montant));
  const chiffres = String(entier);

  // On parcourt les chiffres de droite à gauche et on insère une espace
  // tous les trois chiffres.
  let resultat = '';
  for (let i = 0; i < chiffres.length; i++) {
    const positionDepuisLaDroite = chiffres.length - i;
    resultat += chiffres[i];
    if (positionDepuisLaDroite > 1 && (positionDepuisLaDroite - 1) % 3 === 0) {
      resultat += ' ';
    }
  }

  const signe = montant < 0 && entier !== 0 ? '-' : '';
  return `${signe}${resultat} FC`;
}
