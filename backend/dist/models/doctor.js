import { Schema, model } from 'mongoose';
// Define the doctor schema
const doctorSchema = new Schema({
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
}, { timestamps: true });
doctorSchema.index({ location: '2dsphere' });
const Doctor = model('Doctor', doctorSchema);
export default Doctor;
