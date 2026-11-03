import mongoose, { Schema, Document, Model } from 'mongoose';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface IRiderOffer extends Document {
  deliveryId: mongoose.Types.ObjectId;
  riderId: mongoose.Types.ObjectId;
  status: OfferStatus;
  offeredAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RiderOfferSchema = new Schema<IRiderOffer>(
  {
    deliveryId: {
      type: Schema.Types.ObjectId,
      ref: 'Delivery',
      required: true,
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending',
      index: true,
    },
    offeredAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find active offer for a delivery
RiderOfferSchema.index({ deliveryId: 1, riderId: 1 });

export const RiderOffer: Model<IRiderOffer> =
  mongoose.models.RiderOffer ||
  mongoose.model<IRiderOffer>('RiderOffer', RiderOfferSchema);
