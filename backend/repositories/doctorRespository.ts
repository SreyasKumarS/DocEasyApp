// import Doctor, { IDoctor } from '../models/doctor.js'; 
// import Patient from '../models/patient.js'; 
// import  { ISlot,Slot } from '../models/slot.js';
// import { FilterQuery } from 'mongoose';
// import  Booking from '../models/booking.js';
// import Wallet from '../models/wallet.js';
// import Transaction from '../models/transaction.js'
// import { ITransaction } from '../models/transaction.js'
// import { IWallet } from '../models/wallet.js'
// import Chat from '../models/chat.js';
// import mongoose from 'mongoose';


// class DoctorRepository {
//   async findByEmail(email: string) {
//     return Doctor.findOne({ email });
//   }

//   async saveDoctor(doctorData: any) {
//     const doctor = new Doctor(doctorData);
//     return doctor.save();
//   }

//   async updateDoctor(doctor: any) {
//     return doctor.save(); 
//   }

//   async findById(id: string) {
//     return Doctor.findById(id);
//   }

//   async deleteDoctor(id: string) {
//     return Doctor.findByIdAndDelete(id);
//   }

//   async getAllDoctors() {
//     return Doctor.find({});
//   }


//   async findDoctorById(doctorId: string): Promise<IDoctor | null> {
//     return Doctor.findById(doctorId); 
//   }

//   async updateDoctorById(doctorId: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
//     return Doctor.findByIdAndUpdate(doctorId, updateData, { new: true });
//   }

// //------------------------------daily---------------------------------------------------------


// async findSlot(filter: FilterQuery<ISlot>): Promise<ISlot | null> {
//   return Slot.findOne(filter).exec();
// }

//   async createSlot(slotData: Partial<ISlot>): Promise<ISlot> {
//     const slot = new Slot(slotData);
//     return slot.save();
//   }

//  async findSlotsByDoctorAndDate(doctorId: string, date?: string): Promise<ISlot[]> {
//     const query: any = { doctorId };
//     if (date) {
//       query.date = date; 
//     }
//     return Slot.find(query); 
//   }
// //----------------------------------------------------------------------------------------------------------



//   async getDoctorSlotsM(doctorId: string) {
//     try {
//       // Query to find all slots by doctorId, without filtering by date
//       const query = { doctorId };
//       const slots = await Slot.find(query).sort({ date: 1 }); // Sort by date if you want chronological order
//       return slots;
//     } catch (error) {
//       console.error('Error in getDoctorSlots repository:', error);
//       throw new Error('Database error: failed to fetch slots');
//     }
//   }
  


//   async deleteSlotById(slotId: string): Promise<any> {
//     try {
//         const deletedSlot = await Slot.findByIdAndDelete(slotId);
//         return deletedSlot;
//     } catch (error: unknown) {
//         // Use a type guard to ensure error is of type Error
//         if (error instanceof Error) {
//             throw new Error(`Error deleting slot: ${error.message}`);
//         } else {
//             throw new Error('An unknown error occurred while deleting the slot.');
//         }
//     }
// }


// async AppointmentsOverViewByDoctorAndDate(doctorId: string, date?: string): Promise<any[]> {
//   const matchQuery: any = { doctorId };
//   if (date) {
//     matchQuery.date = date;
//   }

//   return await Slot.aggregate([
//     { $match: matchQuery },
//     {
//       $group: {
//         _id: "$date",
//         totalSlots: { $sum: 1 },
//         availableSlots: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
//         bookedSlots: { $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] } },
//         completedSlots: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
//       }
//     },
//     {
//       $project: {
//         date: "$_id",
//         totalSlots: 1,
//         availableSlots: 1,
//         bookedSlots: 1,
//         completedSlots:1,
//         _id: 0
//       }
//     }
//   ]);
// }

// public async getDoctorSlotsByDate(doctorId: string, date: string): Promise<ISlot[]> {
//   return await Slot.find({ doctorId, date }).exec();
// }




// async getNearbyDoctors(coordinates: [number, number], radius: number) {
  
//   try {
//     const doctors = await Doctor.aggregate([
//       {
//         $geoNear: {
//           near: { type: "Point", coordinates },
//           distanceField: "distance",
//           maxDistance: radius * 1000, // Convert radius to meters
//           spherical: true,
//           query: { isApproved: true }
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           specialization: 1,
//           location: 1,
//           distance: { $round: [{ $divide: ["$distance", 1000] }, 2] },
//           profilePicture: 1,         // Include profile picture
//           contactNumber: 1,           // Include contact email
//           experience: 1,             // Include experience
//           clinicAddress: 1,         // Include clinic address
//           locality: 1,     
//         }
//       }
//     ]);
//     return doctors;

//   } catch (error) {
//     console.error('Error fetching nearby doctors:', error);
//     throw new Error('Error fetching nearby doctors');
//   }
// }

// //----------------------------------------------------------------------------------------------------------------

// // async findSlotsByDoctorAndDates(doctorId: string, dates: string[]): Promise<ISlot[]> {
// //   try {
// //     // If the dates array is empty, return all slots for the doctor
// //     const query = dates.length ? { doctorId, date: { $in: dates } } : { doctorId };
// //     return await Slot.find(query);
// //   } catch (error) {
// //     throw new Error('Error fetching existing slots from the database');
// //   }
// // }

// // // Create slots for a doctor
// // async createSlots(slots: ISlot[]): Promise<ISlot[]> {
// //   try {
// //     return await Slot.insertMany(slots);
// //   } catch (error) {
// //     throw new Error('Error saving slots to the database');
// //   }
// // }





// async saveGeneratedSlots(doctorId: string, slots: ISlot[]): Promise<ISlot[]> {


//   try {
//     const slotData = slots.map(slot => ({
//       doctorId,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       date: slot.date,
//       status: slot.status,
//     }));

//     const savedSlots = await Slot.insertMany(slotData);
//     return savedSlots;
//   } catch (error) {
//     console.error("Error saving slots:", error);
//     throw new Error("Failed to save slots");
//   }
// }
// //--------------------------------recurringdailyslots---------------------------------------------

// async createSlotRecurringDaily(slotData: Partial<ISlot>): Promise<ISlot> {
//   ('hit repooooo');  
//   try {
//     const newSlot = await Slot.create(slotData);
   
//     return newSlot;
//   } catch (error) {
//     console.error("Error creating slot:", error);
//     throw new Error("Failed to create slot.");
//   }
// }

// async findSlotConflict(doctorId: string, startTime: Date, endTime: Date): Promise<ISlot | null> {
//   ('hit clfttttt');
  
//   return await Slot.findOne({
//     doctorId,
//     startTime: { $lt: endTime },
//     endTime: { $gt: startTime }
//   });
// }

// // Find all slots for a doctor within a specific date range
// async findSlotsByDoctorAndDateRange(doctorId: string, startDate: Date, endDate: Date): Promise<ISlot[]> {
//   return await Slot.find({
//     doctorId,
//     date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
//   });
// }




// async getPatientDetailsBySlotId(slotId: string): Promise<any> {
//   ('Repository: Fetching active booking by slot ID...');

//   try {
//     // Fetch booking where the booking status is 'confirmed' and populate patient details
//     const booking = await Booking.findOne({ 
//       slotId, 
//       bookingStatus: 'confirmed' // Only include confirmed bookings
//     })
//     .populate('patientId', 'name contactNumber email age gender') // Fetch only required fields
//     .exec();

//     if (!booking) {
//       ('No active booking found for the provided slot ID.');
//       return null;
//     }

    
//     return booking;
//   } catch (error) {
//     console.error('Error fetching active booking by slot ID:', error);
//     throw new Error('Database query error');
//   }
// }

// //---notofiactoon rfund etc byu doctyor=---------------------------------------//

// async findByPatientId(patientId: string) {
//   return await Wallet.findOne({ patientId });
// }

// async createWallet(patientId: string) {
//   return await Wallet.create({ patientId, balance: 0 });
// }

// async updateBalance(patientId: string, amount: number) {
//   return await Wallet.findOneAndUpdate({ patientId }, { $inc: { balance: amount } }, { new: true });
// }

// async createTransaction(transactionDetails: any) {
//   return await Transaction.create(transactionDetails);
// }


// async getAmountBySlotId(slotId: string): Promise<number | null> {
//   try {
//     // Query the Booking collection to find a document with the matching slotId
//     const booking = await Booking.findOne({ slotId }).exec();
    
//     // If no booking is found, return null
//     if (!booking) {
//       (`No booking found for slotId: ${slotId}`);
//       return null;
//     }
    
//     // Return the amount from the booking document
//     return booking.amount;
//   } catch (error) {
//     console.error(`Error fetching amount for slotId ${slotId}:`, error);
//     throw new Error('Database query error');
//   }
// }



// async StartTime(slotId: string): Promise<Date | null> {
//   try {
//     const slot = await Slot.findById(slotId, 'startTime'); // Fetch only the startTime field
//     return slot ? slot.startTime : null; // Return the Date object
//   } catch (error) {
//     console.error(`Error fetching start time for slot ID ${slotId}:`, error);
//     throw new Error('Database query error');
//   }
// }




// async findConfirmedBooking(slotId:string , patientId:string) {
//   return await Booking.findOne({
//     slotId,
//     patientId,
//     bookingStatus: 'confirmed',
//   });
// }


// // async updateBookingPrescription(bookingId: string , prescription: string) {
// //   return await Booking.findByIdAndUpdate(
// //     bookingId,
// //     {
// //       prescription,
// //       bookingStatus: 'completed',
// //     },
// //     { new: true }
// //   );
// // }


// async updateBookingPrescription(bookingId: string, prescription: string) {
//   // Find the booking and update it
//   const updatedBooking = await Booking.findByIdAndUpdate(
//     bookingId,
//     {
//       prescription,
//       bookingStatus: 'completed',
//     },
//     { new: true }
//   );

//   // If the booking was updated, update the slot status to 'completed'
//   if (updatedBooking) {
//     await Slot.findByIdAndUpdate(
//       updatedBooking.slotId, // Assuming the booking contains a reference to the slotId
//       {
//         status: 'completed',
//       },
//       { new: true }
//     );
//   }

//   return updatedBooking; // Return the updated booking
// }





// async getCompletedBookings() {
//   ('hit repooo ');
//   return await Booking.find({ bookingStatus: 'completed' })
//     .populate('patientId', 'name contactNumber') // Populate only required fields from Patient
//     .populate('slotId', 'startTime endTime date') // Use lowercase field names as per schema
//     .exec();
// }


// async getPrescriptionByBookingId(bookingId: string) {
//   return await Booking.findById(bookingId).select('prescription');
// }




//   async getChatsByDoctor(doctorId: string) {
//     ('recherd repo if listtt');
    
//     try {
//       // Aggregation to find unique patients and the latest message
//       return await Chat.aggregate([
//         { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
//         {
//           $group: {
//             _id: '$patientId',
//             latestMessage: { $last: '$message' },
//             latestTimestamp: { $last: '$timestamp' },
//           },
//         },
//         {
//           $lookup: {
//             from: 'patients', // Collection name for patients
//             localField: '_id',
//             foreignField: '_id',
//             as: 'patientInfo',
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             patientId: '$_id',
//             latestMessage: 1,
//             latestTimestamp: 1,
//             patientName: { $arrayElemAt: ['$patientInfo.name', 0] }, // Assuming patient schema has a `name` field
//           },
//         },
//         { $sort: { latestTimestamp: -1 } }, // Sort by latest message
//       ]);
//     } catch (error) {
//       console.error('Error fetching chats by doctor:', error);
//       throw new Error('Error fetching chats by doctor');
//     }
//   }




//   async findConflictingSlots(
//     startDate: Date,
//     endDate: Date,
//     time: string,
//     dayOfWeek: number
//   ): Promise<ISlot[]> {
   
  
//     const conflictingSlots = await Slot.find({
//       date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
//       startTime: time,
//       dayOfWeek,
//     });
  
   
//     return conflictingSlots as unknown as ISlot[];
//   }
  
//   async saveSlots(slots: ISlot[]): Promise<ISlot[]> {
  
  
//     const savedSlots = await Slot.insertMany(slots);
  
  
//     return savedSlots;
//   }
  
//   async deleteSlotsForDate(doctorId: string, date: string): Promise<void> {
//     (`Deleting slots for doctor: ${doctorId} on date: ${date}`);
//     const result = await Slot.deleteMany({ doctorId, date });
//     (`Deleted slots: ${result.deletedCount}`);
//   }
  
  


//   async fetchPatientDetailsforChat(patientId:string) {
//     try {
//       return await Patient.findById(patientId).select('name email contactNumber gender ');
//     } catch (error) {
//       throw new Error('Error fetching doctor details from the database');
//     }
//   }



// }

// export default new DoctorRepository();















import Doctor, { IDoctor } from '../models/doctor.js'; 
import Patient from '../models/patient.js'; 
import  { ISlot,Slot } from '../models/slot.js';
import { FilterQuery } from 'mongoose';
import  Booking from '../models/booking.js';
import Wallet from '../models/wallet.js';
import Transaction from '../models/transaction.js'
import { ITransaction } from '../models/transaction.js'
import { IWallet } from '../models/wallet.js'
import Chat from '../models/chat.js';
import mongoose from 'mongoose';


export class DoctorRepository {
  async findByEmail(email: string) {
    return Doctor.findOne({ email });
  }

  async saveDoctor(doctorData: any) {
    const doctor = new Doctor(doctorData);
    return doctor.save();
  }

  async updateDoctor(doctor: any) {
    return doctor.save(); 
  }

  async findById(id: string) {
    return Doctor.findById(id);
  }

  async deleteDoctor(id: string) {
    return Doctor.findByIdAndDelete(id);
  }

  async getAllDoctors() {
    return Doctor.find({});
  }


  async findDoctorById(doctorId: string): Promise<IDoctor | null> {
    return Doctor.findById(doctorId); 
  }

  async updateDoctorById(doctorId: string, updateData: Partial<IDoctor>): Promise<IDoctor | null> {
    return Doctor.findByIdAndUpdate(doctorId, updateData, { new: true });
  }

//------------------------------daily---------------------------------------------------------


async findSlot(filter: FilterQuery<ISlot>): Promise<ISlot | null> {
  return Slot.findOne(filter).exec();
}

  async createSlot(slotData: Partial<ISlot>): Promise<ISlot> {
    const slot = new Slot(slotData);
    return slot.save();
  }

 async findSlotsByDoctorAndDate(doctorId: string, date?: string): Promise<ISlot[]> {
    const query: any = { doctorId };
    if (date) {
      query.date = date; 
    }
    return Slot.find(query); 
  }
//----------------------------------------------------------------------------------------------------------



  async getDoctorSlotsM(doctorId: string) {
    try {
      // Query to find all slots by doctorId, without filtering by date
      const query = { doctorId };
      const slots = await Slot.find(query).sort({ date: 1 }); // Sort by date if you want chronological order
      return slots;
    } catch (error) {
      console.error('Error in getDoctorSlots repository:', error);
      throw new Error('Database error: failed to fetch slots');
    }
  }
  


  async deleteSlotById(slotId: string): Promise<any> {
    try {
        const deletedSlot = await Slot.findByIdAndDelete(slotId);
        return deletedSlot;
    } catch (error: unknown) {
        // Use a type guard to ensure error is of type Error
        if (error instanceof Error) {
            throw new Error(`Error deleting slot: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while deleting the slot.');
        }
    }
}


async AppointmentsOverViewByDoctorAndDate(doctorId: string, date?: string): Promise<any[]> {
  const matchQuery: any = { doctorId };
  if (date) {
    matchQuery.date = date;
  }

  return await Slot.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$date",
        totalSlots: { $sum: 1 },
        availableSlots: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
        bookedSlots: { $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] } },
        completedSlots: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
      }
    },
    {
      $project: {
        date: "$_id",
        totalSlots: 1,
        availableSlots: 1,
        bookedSlots: 1,
        completedSlots:1,
        _id: 0
      }
    }
  ]);
}

public async getDoctorSlotsByDate(doctorId: string, date: string): Promise<ISlot[]> {
  return await Slot.find({ doctorId, date }).exec();
}




async getNearbyDoctors(coordinates: [number, number], radius: number) {
  
  try {
    const doctors = await Doctor.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates },
          distanceField: "distance",
          maxDistance: radius * 1000, // Convert radius to meters
          spherical: true,
          query: { isApproved: true }
        }
      },
      {
        $project: {
          name: 1,
          specialization: 1,
          location: 1,
          distance: { $round: [{ $divide: ["$distance", 1000] }, 2] },
          profilePicture: 1,         // Include profile picture
          contactNumber: 1,           // Include contact email
          experience: 1,             // Include experience
          clinicAddress: 1,         // Include clinic address
          locality: 1,     
        }
      }
    ]);
    return doctors;

  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    throw new Error('Error fetching nearby doctors');
  }
}

//----------------------------------------------------------------------------------------------------------------

// async findSlotsByDoctorAndDates(doctorId: string, dates: string[]): Promise<ISlot[]> {
//   try {
//     // If the dates array is empty, return all slots for the doctor
//     const query = dates.length ? { doctorId, date: { $in: dates } } : { doctorId };
//     return await Slot.find(query);
//   } catch (error) {
//     throw new Error('Error fetching existing slots from the database');
//   }
// }

// // Create slots for a doctor
// async createSlots(slots: ISlot[]): Promise<ISlot[]> {
//   try {
//     return await Slot.insertMany(slots);
//   } catch (error) {
//     throw new Error('Error saving slots to the database');
//   }
// }





async saveGeneratedSlots(doctorId: string, slots: ISlot[]): Promise<ISlot[]> {


  try {
    const slotData = slots.map(slot => ({
      doctorId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      date: slot.date,
      status: slot.status,
    }));

    const savedSlots = await Slot.insertMany(slotData);
    return savedSlots;
  } catch (error) {
    console.error("Error saving slots:", error);
    throw new Error("Failed to save slots");
  }
}
//--------------------------------recurringdailyslots---------------------------------------------

async createSlotRecurringDaily(slotData: Partial<ISlot>): Promise<ISlot> {
  ('hit repooooo');  
  try {
    const newSlot = await Slot.create(slotData);
   
    return newSlot;
  } catch (error) {
    console.error("Error creating slot:", error);
    throw new Error("Failed to create slot.");
  }
}

async findSlotConflict(doctorId: string, startTime: Date, endTime: Date): Promise<ISlot | null> {
  ('hit clfttttt');
  
  return await Slot.findOne({
    doctorId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
}

// Find all slots for a doctor within a specific date range
async findSlotsByDoctorAndDateRange(doctorId: string, startDate: Date, endDate: Date): Promise<ISlot[]> {
  return await Slot.find({
    doctorId,
    date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
  });
}




async getPatientDetailsBySlotId(slotId: string): Promise<any> {
  ('Repository: Fetching active booking by slot ID...');

  try {
    // Fetch booking where the booking status is 'confirmed' and populate patient details
    const booking = await Booking.findOne({ 
      slotId, 
      bookingStatus: 'confirmed' // Only include confirmed bookings
    })
    .populate('patientId', 'name contactNumber email age gender') // Fetch only required fields
    .exec();

    if (!booking) {
      ('No active booking found for the provided slot ID.');
      return null;
    }

    
    return booking;
  } catch (error) {
    console.error('Error fetching active booking by slot ID:', error);
    throw new Error('Database query error');
  }
}

//---notofiactoon rfund etc byu doctyor=---------------------------------------//

async findByPatientId(patientId: string) {
  return await Wallet.findOne({ patientId });
}

async createWallet(patientId: string) {
  return await Wallet.create({ patientId, balance: 0 });
}

async updateBalance(patientId: string, amount: number) {
  return await Wallet.findOneAndUpdate({ patientId }, { $inc: { balance: amount } }, { new: true });
}

async createTransaction(transactionDetails: any) {
  return await Transaction.create(transactionDetails);
}


async getAmountBySlotId(slotId: string): Promise<number | null> {
  try {
    // Query the Booking collection to find a document with the matching slotId
    const booking = await Booking.findOne({ slotId }).exec();
    
    // If no booking is found, return null
    if (!booking) {
      (`No booking found for slotId: ${slotId}`);
      return null;
    }
    
    // Return the amount from the booking document
    return booking.amount;
  } catch (error) {
    console.error(`Error fetching amount for slotId ${slotId}:`, error);
    throw new Error('Database query error');
  }
}



async StartTime(slotId: string): Promise<Date | null> {
  try {
    const slot = await Slot.findById(slotId, 'startTime'); // Fetch only the startTime field
    return slot ? slot.startTime : null; // Return the Date object
  } catch (error) {
    console.error(`Error fetching start time for slot ID ${slotId}:`, error);
    throw new Error('Database query error');
  }
}




async findConfirmedBooking(slotId:string , patientId:string) {
  return await Booking.findOne({
    slotId,
    patientId,
    bookingStatus: 'confirmed',
  });
}


// async updateBookingPrescription(bookingId: string , prescription: string) {
//   return await Booking.findByIdAndUpdate(
//     bookingId,
//     {
//       prescription,
//       bookingStatus: 'completed',
//     },
//     { new: true }
//   );
// }


async updateBookingPrescription(bookingId: string, prescription: string) {
  // Find the booking and update it
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      prescription,
      bookingStatus: 'completed',
    },
    { new: true }
  );

  // If the booking was updated, update the slot status to 'completed'
  if (updatedBooking) {
    await Slot.findByIdAndUpdate(
      updatedBooking.slotId, // Assuming the booking contains a reference to the slotId
      {
        status: 'completed',
      },
      { new: true }
    );
  }

  return updatedBooking; // Return the updated booking
}





async getCompletedBookings() {
  return await Booking.find({ bookingStatus: 'completed' })
    .populate('patientId', 'name contactNumber') // Populate only required fields from Patient
    .populate('slotId', 'startTime endTime date') // Use lowercase field names as per schema
    .exec();
}


async getPrescriptionByBookingId(bookingId: string) {
  return await Booking.findById(bookingId).select('prescription');
}




  async getChatsByDoctor(doctorId: string) {
    ('recherd repo if listtt');
    
    try {
      // Aggregation to find unique patients and the latest message
      return await Chat.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
        {
          $group: {
            _id: '$patientId',
            latestMessage: { $last: '$message' },
            latestTimestamp: { $last: '$timestamp' },
          },
        },
        {
          $lookup: {
            from: 'patients', // Collection name for patients
            localField: '_id',
            foreignField: '_id',
            as: 'patientInfo',
          },
        },
        {
          $project: {
            _id: 0,
            patientId: '$_id',
            latestMessage: 1,
            latestTimestamp: 1,
            patientName: { $arrayElemAt: ['$patientInfo.name', 0] }, // Assuming patient schema has a `name` field
          },
        },
        { $sort: { latestTimestamp: -1 } }, // Sort by latest message
      ]);
    } catch (error) {
      console.error('Error fetching chats by doctor:', error);
      throw new Error('Error fetching chats by doctor');
    }
  }




  async findConflictingSlots(
    startDate: Date,
    endDate: Date,
    time: string,
    dayOfWeek: number
  ): Promise<ISlot[]> {
   
  
    const conflictingSlots = await Slot.find({
      date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
      startTime: time,
      dayOfWeek,
    });
  
   
    return conflictingSlots as unknown as ISlot[];
  }
  
  async saveSlots(slots: ISlot[]): Promise<ISlot[]> {
  
  
    const savedSlots = await Slot.insertMany(slots);
  
  
    return savedSlots;
  }
  
  async deleteSlotsForDate(doctorId: string, date: string): Promise<void> {
    (`Deleting slots for doctor: ${doctorId} on date: ${date}`);
    const result = await Slot.deleteMany({ doctorId, date });
    (`Deleted slots: ${result.deletedCount}`);
  }
  
  


  async fetchPatientDetailsforChat(patientId:string) {
    try {
      return await Patient.findById(patientId).select('name email contactNumber gender ');
    } catch (error) {
      throw new Error('Error fetching doctor details from the database');
    }
  }










}

export default new DoctorRepository();
