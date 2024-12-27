// import mongoose, { Document, Schema } from 'mongoose';
// interface ISlot extends Document {
//   doctorId: string;
//   startTime: Date;
//   endTime: Date;
//   date: String;
//   status: 'available' | 'booked' | 'unavailable' |'completed';
// }
// const slotSchema = new Schema<ISlot>({
//   doctorId: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   date: { type: String, required: true },
//   status: { type: String, enum: ['available', 'booked', 'unavailable','completed'], default: 'available' },
// });
// const Slot = mongoose.model<ISlot>('Slot', slotSchema);
// export { Slot, ISlot };
import mongoose, { Schema } from 'mongoose';
const slotSchema = new Schema({
    doctorId: { type: String, required: true },
    startTime: { type: Schema.Types.Mixed, required: true },
    endTime: { type: Schema.Types.Mixed, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['available', 'booked', 'unavailable', 'completed'], default: 'available' },
});
const Slot = mongoose.model('Slot', slotSchema);
export { Slot };
