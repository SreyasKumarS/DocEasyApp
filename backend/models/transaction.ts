import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  patientId: string; // Reference to the patient
  amount: number; // Amount involved in the transaction
  type: 'recharge' | 'refund' | 'no refund'|'wallet payment'; // Type of transaction
  status: 'success' | 'failed'; // Transaction status
  description: string; // Additional details (e.g., refund for cancellation
}

const TransactionSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['recharge', 'refund','no refund','wallet payment'], required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
