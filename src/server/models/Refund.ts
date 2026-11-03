import mongoose, { Schema, Document, Model } from 'mongoose';

export type RefundStatus =
  | 'requested'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'processed'
  | 'failed';

export interface IRefund extends Document {
  deliveryId: mongoose.Types.ObjectId;
  trackingReference: string;
  customerId: mongoose.Types.ObjectId;
  amountPesewas: number;
  amountGhs: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  adminDecisionNotes?: string;
  paystackRefundReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true,
      index: true,
    },
    trackingReference: {
      type: String,
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amountPesewas: { type: Number, required: true },
    amountGhs: { type: Number, required: true },
    currency: { type: String, default: 'GHS' },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'requested',
        'under_review',
        'approved',
        'rejected',
        'processing',
        'processed',
        'failed',
      ],
      default: 'requested',
      index: true,
    },
    adminDecisionNotes: { type: String },
    paystackRefundReference: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Refund: Model<IRefund> =
  mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema);
