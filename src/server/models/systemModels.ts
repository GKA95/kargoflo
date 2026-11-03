import mongoose, { Schema, Document, Model } from 'mongoose';

// ----------------------------------------------------------------------
// Notification Model
// ----------------------------------------------------------------------
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'order_update' },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

// ----------------------------------------------------------------------
// Review Model
// ----------------------------------------------------------------------
export interface IReview extends Document {
  deliveryId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  riderId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    riderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

// ----------------------------------------------------------------------
// SupportTicket Model
// ----------------------------------------------------------------------
export interface ISupportTicket extends Document {
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: 'customer' | 'rider';
  trackingReference?: string;
  subject: string;
  message: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  adminResponse?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, enum: ['customer', 'rider'], required: true },
    trackingReference: { type: String, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    adminResponse: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const SupportTicket: Model<ISupportTicket> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

// ----------------------------------------------------------------------
// PricingSettings Model
// ----------------------------------------------------------------------
export interface IPricingSettings extends Document {
  baseFee: number;
  perKmRate: number;
  expressMultiplier: number;
  sameDayMultiplier: number;
  fragileHandlingFee: number;
  cancellationBeforeAcceptanceFee: number;
  cancellationAfterAcceptanceFee: number;
  currency: string;
  isPublished: boolean;
  publishedBy?: mongoose.Types.ObjectId;
  effectiveDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PricingSettingsSchema = new Schema<IPricingSettings>(
  {
    baseFee: { type: Number, required: true, default: 15.0 },
    perKmRate: { type: Number, required: true, default: 2.5 },
    expressMultiplier: { type: Number, required: true, default: 1.5 },
    sameDayMultiplier: { type: Number, required: true, default: 1.25 },
    fragileHandlingFee: { type: Number, required: true, default: 5.0 },
    cancellationBeforeAcceptanceFee: { type: Number, default: 0 },
    cancellationAfterAcceptanceFee: { type: Number, default: 5.0 },
    currency: { type: String, default: 'GHS', required: true },
    isPublished: { type: Boolean, default: true },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    effectiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PricingSettings: Model<IPricingSettings> =
  mongoose.models.PricingSettings ||
  mongoose.model<IPricingSettings>('PricingSettings', PricingSettingsSchema);

// ----------------------------------------------------------------------
// Policy Model
// ----------------------------------------------------------------------
export interface IPolicy extends Document {
  slug: string;
  title: string;
  version: string;
  complianceNotes: string;
  content: string;
  lastUpdated: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PolicySchema = new Schema<IPolicy>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    version: { type: String, required: true, default: '1.0.0' },
    complianceNotes: { type: String, default: 'Compliant with Ghana Data Protection Act (Act 843)' },
    content: { type: String, required: true },
    lastUpdated: { type: String, default: 'November 2026' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Policy: Model<IPolicy> =
  mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);

// ----------------------------------------------------------------------
// ConsentRecord Model (Act 843 compliance)
// ----------------------------------------------------------------------
export interface IConsentRecord extends Document {
  userId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  policySlug: string;
  policyVersion: string;
  consentPurpose: string;
  isGranted: boolean;
  timestamp: Date;
}

const ConsentRecordSchema = new Schema<IConsentRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    ipAddress: { type: String },
    policySlug: { type: String, required: true },
    policyVersion: { type: String, required: true },
    consentPurpose: { type: String, required: true },
    isGranted: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ConsentRecord: Model<IConsentRecord> =
  mongoose.models.ConsentRecord ||
  mongoose.model<IConsentRecord>('ConsentRecord', ConsentRecordSchema);

// ----------------------------------------------------------------------
// PrivacyRequest Model (Data access, deletion, rectification)
// ----------------------------------------------------------------------
export interface IPrivacyRequest extends Document {
  userId: mongoose.Types.ObjectId;
  requestType: 'access' | 'rectification' | 'deletion' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  reason?: string;
  adminNotes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PrivacyRequestSchema = new Schema<IPrivacyRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requestType: {
      type: String,
      enum: ['access', 'rectification', 'deletion', 'objection'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
      index: true,
    },
    reason: { type: String },
    adminNotes: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const PrivacyRequest: Model<IPrivacyRequest> =
  mongoose.models.PrivacyRequest ||
  mongoose.model<IPrivacyRequest>('PrivacyRequest', PrivacyRequestSchema);

// ----------------------------------------------------------------------
// PaymentWebhookEvent Model (Idempotent Paystack webhook processing)
// ----------------------------------------------------------------------
export interface IPaymentWebhookEvent extends Document {
  eventId: string;
  event: string;
  reference: string;
  status: 'received' | 'processed' | 'failed';
  payload: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
}

const PaymentWebhookEventSchema = new Schema<IPaymentWebhookEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    event: { type: String, required: true },
    reference: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['received', 'processed', 'failed'],
      default: 'received',
      index: true,
    },
    payload: { type: Schema.Types.Mixed, required: true },
    processedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PaymentWebhookEvent: Model<IPaymentWebhookEvent> =
  mongoose.models.PaymentWebhookEvent ||
  mongoose.model<IPaymentWebhookEvent>('PaymentWebhookEvent', PaymentWebhookEventSchema);
