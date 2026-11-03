import mongoose, { Schema, Document, Model } from 'mongoose';

export type RiderApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type VehicleType = 'motorcycle' | 'scooter' | 'bicycle' | 'van' | 'cargo_tricycle';

export interface IRiderProfile extends Document {
  userId: mongoose.Types.ObjectId;
  residentialLocation: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  ghanaCardNumber?: string;
  approvalStatus: RiderApprovalStatus;
  rejectionReason?: string;
  isOnline: boolean;
  currentLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    updatedAt: Date;
  };
  rating: number;
  totalCompletedDeliveries: number;
  earningsToday: number;
  earningsWeek: number;
  earningsTotal: number;
  documents?: {
    ghanaCardStored: boolean;
    drivingLicenseStored: boolean;
    documentStorageRef?: string;
    uploadedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RiderProfileSchema = new Schema<IRiderProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    residentialLocation: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['motorcycle', 'scooter', 'bicycle', 'van', 'cargo_tricycle'],
      default: 'motorcycle',
      required: true,
    },
    vehicleRegistrationNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    ghanaCardNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      required: true,
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      updatedAt: {
        type: Date,
      },
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    },
    totalCompletedDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    earningsToday: {
      type: Number,
      default: 0,
      min: 0,
    },
    earningsWeek: {
      type: Number,
      default: 0,
      min: 0,
    },
    earningsTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    documents: {
      ghanaCardStored: { type: Boolean, default: false },
      drivingLicenseStored: { type: Boolean, default: false },
      documentStorageRef: { type: String, select: false }, // protected private reference
      uploadedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for real rider geo-queries when location is supplied
RiderProfileSchema.index({ currentLocation: '2dsphere' });

export const RiderProfile: Model<IRiderProfile> =
  mongoose.models.RiderProfile ||
  mongoose.model<IRiderProfile>('RiderProfile', RiderProfileSchema);
