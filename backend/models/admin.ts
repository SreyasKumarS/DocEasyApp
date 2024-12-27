// import mongoose, { Schema } from 'mongoose';

// const adminSchema = new Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isVerified: { type: Boolean, default: false },
//     otp: { type: String },
//     otpExpires: { type: Date },
//     percentageFee: { type: Number, default: null },  // Ensure this allows null
//     fixedFee: { type: Number, default: null },       // Ensure this allows null
//   },
//   { timestamps: true }
// );

// const Admin = mongoose.model('Admin', adminSchema, 'admins');

// export default Admin;




import mongoose, { Schema, Document } from 'mongoose';

interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  otp: string;
  otpExpires: Date;
  percentageFee: number | null;  // Allowing null
  fixedFee: number | null;       // Allowing null
}

const adminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    percentageFee: { type: Number, default: null },
    fixedFee: { type: Number, default: null },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>('Admin', adminSchema, 'admins');

export default Admin;
