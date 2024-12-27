import mongoose, { Schema } from 'mongoose';
const reviewSchema = new Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
});
const Review = mongoose.model('Review', reviewSchema);
export { Review };
