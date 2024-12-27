import mongoose, { Schema } from 'mongoose';

interface Location {
  type: string;
  coordinates: [number, number]; 
}
interface Patient {
  _id: string;
  location?: Location; 
}


const patientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },  
    age: { type: Number, min: 0, max: 120 },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'], // Ensure 'male' is included here
      required: true
    },
    address: { type: String },
    locality: { type: String },
    location: { 
      type: { type: String, default: 'Point' }, // This should be 'Point' for GeoJSON
      coordinates: [Number], // [longitude, latitude]
    },
    contactNumber: { type: String, required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  },
  { timestamps: true }
);


patientSchema.index({ location: '2dsphere' });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
