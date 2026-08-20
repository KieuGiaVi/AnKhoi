import mongoose, { Schema, Document } from 'mongoose';
import { IPatientProfile } from './users.types';

export interface IPatientProfileDocument extends Omit<IPatientProfile, '_id'>, Document {}

const PatientProfileSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    chi_so_sinh_ton: {
      mach: { type: Number },
      huyet_ap: { type: String },
      nhiet_do: { type: Number },
      chieu_cao: { type: Number },
      can_nang: { type: Number },
    },
    ma_the_bhyt: { type: String, trim: true },
    muc_huong: { type: Number, default: 80 },
    danh_sach_di_ung: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'patient_profiles',
  }
);

export const PatientProfileModel = mongoose.model<IPatientProfileDocument>(
  'PatientProfile',
  PatientProfileSchema
);
