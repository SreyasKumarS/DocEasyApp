import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
  doctorId: mongoose.Schema.Types.ObjectId; // Fix for ObjectId reference
  patientName: string;
  comment: string;
  rating: number;
  date: Date;
}

const reviewSchema = new Schema<IReview>({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientName: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model<IReview>('Review', reviewSchema);

export { Review, IReview };
