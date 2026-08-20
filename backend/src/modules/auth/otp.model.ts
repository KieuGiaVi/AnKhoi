import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpDocument extends Document {
  sdt: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    sdt: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 300 }, // TTL: 300s (5 minutes)
  },
  {
    timestamps: true,
    collection: 'otps',
  }
);

export const OtpModel = mongoose.model<IOtpDocument>('Otp', OtpSchema);
