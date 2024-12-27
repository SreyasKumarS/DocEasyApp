// models/Chat.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sender: { type: String, enum: ['patient', 'doctor'], required: true }, // 'patient' or 'doctor'
});

const Chat = mongoose.model('Chat', messageSchema);

export default Chat;
