import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  deliveryId: mongoose.Types.ObjectId;
  trackingReference: string;
  customerId: mongoose.Types.ObjectId;
  amountPesewas: number;
  amountGhs: number;
  currency: string;
  channel: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paystackReference: string;
  paystackTransactionId?: string;
  gatewayResponse?: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
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
    amountPesewas: {
      type: Number,
      required: true,
      min: 0,
    },
    amountGhs: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'GHS',
      required: true,
    },
    channel: {
      type: String,
      default: 'mobile_money',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paystackTransactionId: {
      type: String,
    },
    gatewayResponse: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
