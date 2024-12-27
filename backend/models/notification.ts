import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Notification document
interface INotification extends Document {
  patientId: mongoose.Types.ObjectId;   // Reference to the patient
  doctorId: mongoose.Types.ObjectId;    // Reference to the doctor
  type: 'appointment' | 'prescription' | 'chat' | 'videoCall';  // Type of notification
  message: string;                       // Message content for the notification
  reason?: string;                       // Reason for cancellation or other actions
  refundAmount?: number;                 // Amount refunded (if applicable)
  refundStatus?: 'success' | 'failed';   // Status of the refund (if applicable)
  prescriptionDetails?: string;          // For prescription-related notifications
  chatDetails?: string;                  // For chat-related notifications
  videoCallDetails?: string;             // For video call-related notifications
  status: 'unread' | 'read';             // Notification read/unread status
  createdAt: Date;                       // Date when the notification was created
  updatedAt: Date;                       // Date when the notification was last updated
}

// Define the Notification Schema
const NotificationSchema: Schema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    type: { 
      type: String, 
      enum: ['appointment', 'prescription', 'chat', 'videoCall'], 
      required: true 
    },
    message: { type: String, required: true },
    reason: { type: String }, // Optional, only for cancellations or other actions
    refundAmount: { type: Number, default: 0 },  // Optional, only for refund-related notifications
    refundStatus: { 
      type: String, 
      enum: ['success', 'failed'], 
      default: 'failed' 
    },
    prescriptionDetails: { type: String }, // Optional, for prescription notifications
    chatDetails: { type: String },         // Optional, for chat notifications
    videoCallDetails: { type: String },    // Optional, for video call notifications
    status: { 
      type: String, 
      enum: ['unread', 'read'], 
      default: 'unread' 
    },
  },
  { timestamps: true }
);

// Create and export the Mongoose model
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;

