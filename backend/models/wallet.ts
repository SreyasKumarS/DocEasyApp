import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  patientId: string; // Reference to the patient
  balance: number; // Current wallet balance
}

const WalletSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IWallet>('Wallet', WalletSchema);
