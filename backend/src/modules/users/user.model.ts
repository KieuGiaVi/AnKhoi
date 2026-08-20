import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../../common/types';
import { IUser, UserStatus } from './users.types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema: Schema = new Schema(
  {
    ho_ten: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    sdt: { type: String, unique: true, sparse: true, trim: true },
    mat_khau_hash: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.PATIENT,
      required: true,
    },
    is_temp: { type: Boolean, default: false },
    chuyen_khoa: { type: String, trim: true },
    trang_thai: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
