const q = 'auto=format&fit=crop';

export const landingImages = {
  /** Hero vidéo / sections : même univers que `public/landing/hero-side.jpg` si besoin d’URL distante */
  heroMain: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&fit=crop&q=80`,
  /** Bandeau « terrain » : flux routier */
  beltA: `https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?${q}&w=1600&q=80`,
  beltB: `https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?${q}&w=1600&q=80`,
  /** Galerie humaine */
  faceClient: `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?${q}&w=800&q=85`,
  /** Confiance : poignée de main (fichier local — l’ancienne URL Unsplash ne répond plus) */
  faceOps: '/landing/face-confiance.jpg',
  faceDriver: `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?${q}&w=800&q=85`,
  /** Section couverture */
  coverage: `https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?${q}&w=1200&q=85`,
  /** Parcours client : coordination */
  parcoursClient: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?${q}&w=900&q=85`,
  /** Parcours transporteur : quai & chargement */
  parcoursTransporter: `https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?${q}&w=900&q=85`,
} as const;

export const landingImageAlts = {
  heroMain:
    'Personnes manipulant des cartons dans un entrepôt, préparation de colis pour expédition.',
  beltA: 'Circulation routière et flux de véhicules — mouvement constant sur le réseau.',
  beltB: 'Activité logistique et manutention sur une aire de flux marchandises.',
  faceClient: 'Professionnelle en réunion, pilotage d’opérations.',
  faceOps: 'Poignée de main entre partenaires après accord.',
  faceDriver: 'Conducteur au volant, livraison et route.',
  coverage: 'Carte et planification d’itinéraires pour acheminer des envois.',
  parcoursClient: 'Équipe en réunion pour planifier expéditions et priorités.',
  parcoursTransporter: 'Chargement sur quai : préparation d’une livraison et départ vers la destination.',
} as const;
