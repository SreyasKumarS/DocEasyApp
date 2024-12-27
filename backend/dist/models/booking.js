// import { Schema, model } from 'mongoose';
// // Define the Booking schema
// const bookingSchema = new Schema(
//   {
//     slotId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Slot', // Reference to the Slot model
//       required: true,
//     },
//     doctorId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Doctor', // Reference to the Doctor model
//       required: true,
//     },
//     patientId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Patient', // Reference to the Patient model
//       required: true,
//     },
//     paymentId: {
//       type: String, // Razorpay payment ID (optional for wallet payments)
//       required: false,
//     },
//     paymentMethod: {
//       type: String, // Payment method used
//       enum: ['wallet', 'razorpay'], // Add more methods here if needed
//       required: true, // Ensures the method is always specified
//     },
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'successful', 'failed'],
//       default: 'pending',
//     },
//     bookingStatus: {
//       type: String,
//       enum: ['pending', 'confirmed', 'cancelled','completed'],
//       default: 'pending',
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     prescription: {
//       type: String, 
//       required: false,
//     },
//   },
//   { timestamps: true }
// );
// // Export the Booking model
// export default model('Booking', bookingSchema);
import { Schema, model } from 'mongoose';
// Define the Booking schema
const bookingSchema = new Schema({
    slotId: {
        type: Schema.Types.ObjectId,
        ref: 'Slot', // Reference to the Slot model
        required: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to the Doctor model
        required: true,
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient', // Reference to the Patient model
        required: true,
    },
    paymentId: {
        type: String, // Razorpay payment ID (optional for wallet payments)
        required: false,
    },
    paymentMethod: {
        type: String, // Payment method used
        enum: ['wallet', 'razorpay'], // Add more methods here if needed
        required: true, // Ensures the method is always specified
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending',
    },
    bookingStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    amount: {
        type: Number,
        required: true, // The total amount (platform fee + consultation fee)
    },
    platformFee: {
        type: Number,
        required: true, // Fee charged by the platform
    },
    consultationFee: {
        type: Number,
        required: true, // Fee for the doctor's consultation
    },
    prescription: {
        type: String,
        required: false,
    },
}, { timestamps: true });
// Export the Booking model
export default model('Booking', bookingSchema);
