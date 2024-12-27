import mongoose, { Schema } from 'mongoose';
// Define the Notification Schema
const NotificationSchema = new Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    type: {
        type: String,
        enum: ['appointment', 'prescription', 'chat', 'videoCall'],
        required: true
    },
    message: { type: String, required: true },
    reason: { type: String }, // Optional, only for cancellations or other actions
    refundAmount: { type: Number, default: 0 }, // Optional, only for refund-related notifications
    refundStatus: {
        type: String,
        enum: ['success', 'failed'],
        default: 'failed'
    },
    prescriptionDetails: { type: String }, // Optional, for prescription notifications
    chatDetails: { type: String }, // Optional, for chat notifications
    videoCallDetails: { type: String }, // Optional, for video call notifications
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
}, { timestamps: true });
// Create and export the Mongoose model
const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
