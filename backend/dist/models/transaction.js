import mongoose, { Schema } from 'mongoose';
const TransactionSchema = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['recharge', 'refund', 'no refund', 'wallet payment'], required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    description: { type: String },
}, { timestamps: true });
export default mongoose.model('Transaction', TransactionSchema);
