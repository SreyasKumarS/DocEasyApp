import mongoose, { Schema } from 'mongoose';
const WalletSchema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
}, { timestamps: true });
export default mongoose.model('Wallet', WalletSchema);
