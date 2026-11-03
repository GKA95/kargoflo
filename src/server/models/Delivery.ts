import mongoose, { Schema, Document, Model } from 'mongoose';

export type ControlledDeliveryStatus =
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'awaiting_rider'
  | 'rider_assigned'
  | 'rider_accepted'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export interface IDeliveryTimelineEvent {
  status: ControlledDeliveryStatus;
  timestamp: Date;
  note?: string;
  actorId?: mongoose.Types.ObjectId;
  actorRole?: string;
}

export interface IDelivery extends Document {
  trackingReference: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  riderId?: mongoose.Types.ObjectId;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
  status: ControlledDeliveryStatus;
  type: 'standard' | 'express' | 'same_day';
  pickup: {
    address: string;
    digitalAddress?: string;
    landmark?: string;
    contactName: string;
    contactPhone: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  destination: {
    address: string;
    digitalAddress?: string;
    landmark?: string;
    recipientName: string;
    recipientPhone: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  parcel: {
    description: string;
    category: string;
    size: 'small' | 'medium' | 'large' | 'bulky';
    weightKg?: number;
    isFragile: boolean;
    specialInstructions?: string;
  };
  pricing: {
    baseFee: number;
    distanceFee: number;
    serviceTypeFee: number;
    fragileFee: number;
    totalAmountPesewas: number; // Integer pesewas for monetary precision
    totalAmountGhs: number;
    currency: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  timeline: IDeliveryTimelineEvent[];
  proofOfDelivery?: {
    recipientName?: string;
    notes?: string;
    photoUrl?: string;
    signatureUrl?: string;
    deliveredAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema = new Schema<IDelivery>(
  {
    trackingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    riderName: { type: String },
    riderPhone: { type: String },
    riderVehicle: { type: String },
    status: {
      type: String,
      enum: [
        'awaiting_payment',
        'payment_confirmed',
        'awaiting_rider',
        'rider_assigned',
        'rider_accepted',
        'picked_up',
        'in_transit',
        'delivered',
        'cancelled',
        'failed',
      ],
      default: 'awaiting_payment',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['standard', 'express', 'same_day'],
      default: 'standard',
      required: true,
    },
    pickup: {
      address: { type: String, required: true },
      digitalAddress: { type: String },
      landmark: { type: String },
      contactName: { type: String, required: true },
      contactPhone: { type: String, required: true },
      city: { type: String, default: 'Accra' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    destination: {
      address: { type: String, required: true },
      digitalAddress: { type: String },
      landmark: { type: String },
      recipientName: { type: String, required: true },
      recipientPhone: { type: String, required: true },
      city: { type: String, default: 'Accra' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    parcel: {
      description: { type: String, required: true },
      category: { type: String, default: 'documents' },
      size: { type: String, enum: ['small', 'medium', 'large', 'bulky'], default: 'small' },
      weightKg: { type: Number },
      isFragile: { type: Boolean, default: false },
      specialInstructions: { type: String },
    },
    pricing: {
      baseFee: { type: Number, default: 0 },
      distanceFee: { type: Number, default: 0 },
      serviceTypeFee: { type: Number, default: 0 },
      fragileFee: { type: Number, default: 0 },
      totalAmountPesewas: { type: Number, required: true, default: 0 },
      totalAmountGhs: { type: Number, required: true, default: 0 },
      currency: { type: String, default: 'GHS' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentReference: {
      type: String,
      sparse: true,
      index: true,
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        actorId: { type: Schema.Types.ObjectId, ref: 'User' },
        actorRole: { type: String },
      },
    ],
    proofOfDelivery: {
      recipientName: { type: String },
      notes: { type: String },
      photoUrl: { type: String },
      signatureUrl: { type: String },
      deliveredAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Delivery: Model<IDelivery> =
  mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);
