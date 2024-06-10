import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserType = Document & {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  salt: string;
  flgUseStatus: number;
  verified: boolean;
  verifyToken: string | null;
};

const userSchema: Schema<UserType> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    flgUseStatus: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<UserType> = mongoose.model<UserType>('User', userSchema);

export default User;
