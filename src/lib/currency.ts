/** FCFA (Franc CFA BCEAO) — code ISO XOF */
const fcfaFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatFcfa(amount: number): string {
  return fcfaFormatter.format(amount);
}
