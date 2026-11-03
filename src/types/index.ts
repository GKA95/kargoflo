/**
 * Core TypeScript definitions for KargoFlow Ghana
 * Delivery Management Platform
 */

export type UserRole = 'customer' | 'rider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
  avatarUrl?: string;
}

export type DeliveryStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'awaiting_rider'
  | 'rider_assigned'
  | 'rider_accepted'
  | 'package_picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DeliveryType = 'standard' | 'express' | 'same_day';

export type ParcelCategory =
  | 'documents'
  | 'food_groceries'
  | 'electronics'
  | 'apparel_fashion'
  | 'fragile_goods'
  | 'pharmaceuticals'
  | 'general_merchandise';

export type PackageSize = 'small' | 'medium' | 'large' | 'bulky';

export interface LocationPoint {
  address: string;
  digitalAddress?: string; // e.g. Ghana Post GPS "GA-183-9024"
  landmark?: string;
  city: string;
  region: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryParty {
  name: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  location: LocationPoint;
}

export interface ParcelDetails {
  description: string;
  category: ParcelCategory;
  size: PackageSize;
  weightKg?: number;
  specialInstructions?: string;
  isFragile?: boolean;
}

export interface DeliveryTimelineEvent {
  status: DeliveryStatus;
  timestamp: string;
  note: string;
  actor?: string;
}

export interface PricingBreakdown {
  baseFee: number;
  distanceFee: number;
  serviceTypeFee: number;
  handlingFee: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string; // "GHS"
}

export interface DeliveryOrder {
  id: string;
  trackingReference: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  status: DeliveryStatus;
  type: DeliveryType;
  pickup: DeliveryParty;
  destination: DeliveryParty;
  parcel: ParcelDetails;
  pricing?: PricingBreakdown;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  timeline: DeliveryTimelineEvent[];
  proofOfDelivery?: {
    recipientName?: string;
    signatureUrl?: string;
    photoUrl?: string;
    deliveredAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type RiderApprovalStatus =
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'information_required';

export type VehicleType =
  | 'motorcycle'
  | 'scooter'
  | 'bicycle'
  | 'van'
  | 'cargo_tricycle';

export interface RiderProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  residentialLocation: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  ghanaCardNumber?: string;
  approvalStatus: RiderApprovalStatus;
  rejectionReason?: string;
  isOnline: boolean;
  rating?: number;
  totalCompletedDeliveries: number;
  earningsSummary?: {
    today: number;
    thisWeek: number;
    total: number;
    currency: string;
  };
  documents?: {
    ghanaCardUrl?: string;
    drivingLicenseUrl?: string;
    vehicleInsuranceUrl?: string;
    uploadedAt?: string;
  };
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses: Array<{
    id: string;
    label: string;
    address: string;
    digitalAddress?: string;
    landmark?: string;
  }>;
  stats?: {
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
  };
}

export type PaymentMethod =
  | 'mobile_money_mtn'
  | 'mobile_money_telecel'
  | 'mobile_money_at'
  | 'credit_card'
  | 'paystack';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  deliveryId: string;
  trackingReference: string;
  customerId: string;
  customerName?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paystackReference?: string;
  transactionReference: string;
  channelDetails?: string;
  createdAt: string;
}

export type RefundStatus = 'pending_review' | 'approved' | 'rejected' | 'processed';

export interface RefundRequest {
  id: string;
  deliveryId: string;
  trackingReference: string;
  customerId: string;
  customerName?: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  adminNotes?: string;
  requestedAt: string;
  resolvedAt?: string;
}

export type ComplaintStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface ComplaintTicket {
  id: string;
  trackingReference?: string;
  authorId: string;
  authorName: string;
  authorRole: 'customer' | 'rider';
  subject: string;
  message: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  version: string;
  lastUpdated: string;
  complianceNotes: string;
  content: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  ipAddress?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface PricingConfig {
  baseFee: number;
  perKmRate: number;
  expressMultiplier: number;
  sameDayMultiplier: number;
  fragileHandlingFee: number;
  currency: string;
  effectiveDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
