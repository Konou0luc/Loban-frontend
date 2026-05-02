export type Role = 'CLIENT' | 'TRANSPORTER';

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED';

export interface AvailabilitySlot {
  id?: number;
  startAt: string;
  endAt: string;
}

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: Role;
  createdAt: string;
  /** Toujours true pour les clients. Pour les transporteurs : profil complété (photo + infos). */
  transporterProfileComplete: boolean;
  /** Transporteur — photo actuelle (URL ou data), sinon null. */
  profilePhotoDataUrl: string | null;
  /** Bio / présentation affichée aux clients. */
  transporterSecurityInfo: string | null;
  vehicleType?: string | null;
  coverageArea?: string | null;
  yearsExperience?: number | null;
  deliveryCategories?: string[];
  availability?: string | null;
  /** Renvoyé uniquement au transporteur connecté. */
  drivingLicenseNumber?: string | null;
  identityVerified?: boolean;
  licenseVerified?: boolean;
  transporterConfirmed?: boolean;
  totalDeliveriesCompleted?: number;
  averageRating?: number;
  availabilitySlots?: AvailabilitySlot[];
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface TransporterSummary {
  id: number;
  fullname: string;
  profilePhotoDataUrl: string | null;
  transporterSecurityInfo: string;
  vehicleType: string;
  coverageArea: string;
  yearsExperience: number | null;
  deliveryCategories: string[];
  availability: string;
  identityVerified: boolean;
  licenseVerified: boolean;
  transporterConfirmed: boolean;
  totalDeliveriesCompleted: number;
  averageRating: number;
  /** Prochains créneaux (peut être vide). */
  availabilitySlots?: AvailabilitySlot[];
}

export interface TransportRequest {
  id: number;
  clientId: number;
  clientName: string;
  pickupLocation: string;
  destination: string;
  parcelDescription: string;
  /** Fenêtre souhaitée (ISO) ; si les deux sont renseignés côté API, filtre les transporteurs par créneaux. */
  desiredSlotStart?: string | null;
  desiredSlotEnd?: string | null;
  status: RequestStatus;
  acceptedOfferId: number | null;
  createdAt: string;
  offerCount: number;
  /** Vrai si le client (vous) a déjà noté — renvoyé sur la fiche demande / « mes demandes ». */
  clientHasRated: boolean;
  /** Présent dès qu’une offre est acceptée (informations du transporteur pour le client). */
  assignedTransporter: TransporterSummary | null;
}

export interface Offer {
  id: number;
  requestId: number;
  transporterId: number;
  transporterName: string;
  price: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface Rating {
  id: number;
  clientId: number;
  clientName: string;
  transporterId: number;
  transportRequestId: number;
  rating: number;
  comment: string | null;
}
