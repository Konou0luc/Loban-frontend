/** Clés API alignées sur le backend (TransporterProfileSupport) */

export const VEHICLE_OPTIONS = [
  { key: 'MOTO', label: 'Moto' },
  { key: 'TRICYCLE', label: 'Tricycle' },
  { key: 'VOITURE', label: 'Voiture' },
  { key: 'CAMIONNETTE', label: 'Camionnette' },
  { key: 'CAMION', label: 'Camion' },
] as const;

export const AVAILABILITY_OPTIONS = [
  { key: 'DISPONIBLE_AUJOURDHUI', label: 'Disponible aujourd’hui' },
  { key: 'TEMPS_PLEIN', label: 'Temps plein' },
  { key: 'WEEKEND', label: 'Week-end' },
  { key: 'SUR_RESERVATION', label: 'Sur réservation' },
] as const;

export const DELIVERY_CATEGORY_OPTIONS = [
  { key: 'PETITS_COLIS', label: 'Petits colis' },
  { key: 'DOCUMENTS', label: 'Documents' },
  { key: 'MARCHANDISES', label: 'Marchandises' },
  { key: 'ELECTROMENAGER', label: 'Électroménager' },
  { key: 'LIVRAISON_EXPRESS', label: 'Livraison express' },
] as const;

export const DEFAULT_BIO_PLACEHOLDER =
  'Professionnel du transport spécialisé dans la livraison de colis et marchandises. Je m’engage à assurer un service fiable, rapide et sécurisé. Disponible pour les trajets urbains et interurbains avec une bonne connaissance des itinéraires au Togo.';

export function vehicleLabel(key: string) {
  return VEHICLE_OPTIONS.find((v) => v.key === key)?.label ?? key;
}

export function availabilityLabel(key: string) {
  return AVAILABILITY_OPTIONS.find((v) => v.key === key)?.label ?? key;
}

export function deliveryCategoryLabel(key: string) {
  return DELIVERY_CATEGORY_OPTIONS.find((v) => v.key === key)?.label ?? key;
}
