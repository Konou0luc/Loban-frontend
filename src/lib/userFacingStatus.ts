/** Remplace les codes de statut API par du français pour l’affichage utilisateur. */
export function humanizeStatusCodesInText(text: string): string {
  return text
    .replace(/\bIN_PROGRESS\b/g, 'en cours')
    .replace(/\bDELIVERED\b/g, 'livrée')
    .replace(/\bPENDING\b/g, "en attente d'offres")
    .replace(/\bACCEPTED\b/g, 'acceptée');
}
