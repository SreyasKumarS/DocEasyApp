import { Document, Schema, model } from 'mongoose';

export interface IDoctor extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  specialization: string;
  licenseNumber: string;
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  isApproved: boolean;
  medicalLicense: string;
  contactNumber: string;  // New field
  experience: number;     // New field
  clinicAddress: string;
  locality:string;
  location?: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };  // New field
  biography: string;      // New field
  idProof: string;
  profilePicture:string;
  consultationFee: number;         // New field
}

// Define the doctor schema
const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    medicalLicense: { type: String, required: true },
    contactNumber: { type: String, required: true },   
    experience: { type: Number, required: true },       
    clinicAddress: { type: String, required: true },
    locality: { type: String, required: true },
    location: { 
      type: { type: String, default: 'Point' }, // This should be 'Point' for GeoJSON
      coordinates: [Number], // [longitude, latitude]
    },    
    biography: { type: String },                         
    idProof: { type: String },   
    profilePicture: { type: String },
    consultationFee: { type: Number, required: true },                         
  },
  { timestamps: true }
);

doctorSchema.index({ location: '2dsphere' });
const Doctor = model<IDoctor>('Doctor', doctorSchema);
export default Doctor;

