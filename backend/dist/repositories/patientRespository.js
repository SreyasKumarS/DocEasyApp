// import Patient from '../models/patient.js';
// import Doctor, { IDoctor }   from '../models/doctor.js';
// import {Slot} from '../models/slot.js';
// import Booking from '../models/booking.js'
// import Wallet from '../models/wallet.js'
// import Transaction from '../models/transaction.js'
// import { ITransaction } from '../models/transaction.js'
// import { IWallet } from '../models/wallet.js'
// import Admin from '../models/admin.js'
// import Notification from '../models/notification.js';
// import {Review} from '../models/reviews.js';
// import Chat from '../models/chat.js';
// import mongoose from 'mongoose';
// class PatientRepository {
//   async findByEmail(email: string) {
//     return Patient.findOne({ email });
//   }
//   async savePatient(patientData: any) {
//     const patient = new Patient(patientData);
//     return patient.save();
//   }
//   async updatePatient(patient: any) {
//     return patient.save();
//   }
//   async findById(patientId: string) {
//     return Patient.findById(patientId);
//   }
//   async updatePatientProfile(id: string, updatedData: Partial<any>) {
//     return Patient.findByIdAndUpdate(id, updatedData, { new: true }); // Returns the updated document
//   }
//   async getDistinctSpecializations() {
//     try {
//       return await Doctor.aggregate([
//         { $match: { isApproved: true } }, // Only approved doctors
//         { $group: { _id: "$specialization", doctorCount: { $sum: 1 } } }, // Group by specialization and count
//         { 
//           $project: { 
//             _id: 0, 
//             name: "$_id", 
//             doctorCount: 1, 
//             isActive: { $gt: ["$doctorCount", 0] } 
//           } 
//         }
//       ]);
//     } catch (error) {
//       throw new Error('Error fetching specializations: ');
//     }
//   }
//   async getDoctorsBySpecialization(specialization: string) {
//     try {
//       return await Doctor.find(
//         { specialization, isApproved: true },
//         { name: 1, experience: 1, contactNumber: 1, profilePicture: 1, clinicAddress: 1, specialization:1, locality:1 }
//       );
//     } catch (error) {
//       console.error('Error fetching doctors by specialization:', error);
//       throw new Error('Error fetching doctors by specialization');
//     }
//   }
//   async getSlotsByDoctorAndDate(doctorId: string, date: string): Promise<any> {
//     try {
//       const slots = await Slot.find({ doctorId, date }); // Adjust the query as necessary
//       return slots;
//     } catch (error) {
//       console.error('Error fetching slots by doctor and date:', error);
//       throw new Error('Error fetching slots by doctor and date');
//     }
//   }
//   async findOrCreatePatient(email: string, name: string) {
//     const existingPatient = await this.findByEmail(email);
//     if (existingPatient) {
//       return existingPatient;
//     }
//     // Create a new patient with default values for required fields if not found
//     const newPatient = new Patient({
//       email,
//       name,
//       contactNumber: 'N/A', // Default or placeholder value
//       gender: 'other', // Default gender
//       password: 'google_oauth', // Placeholder password to meet schema requirement
//       isVerified: true, // Set as verified for OAuth users
//     });
//     return newPatient.save();
//   }
//   async findByIdfornearbydoc(patientId: string): Promise<Patient | null> {
//     return Patient.findById(patientId) as Promise<Patient | null>;
//   }
//   async findDoctors(
//     search?: string,
//     specialization?: string,
//     locality?: string,
//     page: number = 1,
//     limit: number = 10
//   ): Promise<{ doctors: IDoctor[]; totalPages: number; currentPage: number }> {
//     const query: any = { isApproved: true };
//     // Add specialization filter if specified
//     if (specialization) {
//       query.specialization = specialization;
//     }
//     // Build the $or query for name, specialization, or locality search
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { specialization: { $regex: search, $options: 'i' } },
//         { locality: { $regex: search, $options: 'i' } }
//       ];
//     } else if (locality) {
//       // Filter by locality if specified
//       query.locality = { $regex: locality, $options: 'i' };
//     }
//     // Paginate the results
//     const doctors = await Doctor.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit);
//     const totalDoctors = await Doctor.countDocuments(query);
//     return {
//       doctors,
//       totalPages: Math.ceil(totalDoctors / limit),
//       currentPage: page
//     };
//   }
//   async updateBookingAfterPayment(
//     paymentId: string,
//     orderId: string,
//     slotId: string,
//     paymentStatus: string,
//     bookingStatus: string
//   ): Promise<any> {
//     try {
//       let booking = await Booking.findOne({ slotId });
//       if (!booking) {
//         booking = new Booking({
//           slotId,
//           paymentId,
//           paymentStatus: paymentStatus as 'pending' | 'successful' | 'failed',
//           bookingStatus: bookingStatus as 'pending' | 'confirmed' | 'cancelled',
//           amount: 100, // Replace with actual amount if needed
//         });
//         await booking.save();
//         return booking;
//       } else {
//         booking.paymentId = paymentId;
//         booking.paymentStatus = paymentStatus as 'pending' | 'successful' | 'failed';
//         booking.bookingStatus = bookingStatus as 'pending' | 'confirmed' | 'cancelled';
//         await booking.save();
//         return booking;
//       }
//     } catch (error) {
//       console.error('Error updating booking after payment:', error);
//       throw new Error('Error updating booking after payment');
//     }
//   }
//   async updateSlotStatus(slotId: string, status: string): Promise<any> {
//     try {
//       const updatedSlot = await Slot.findByIdAndUpdate(slotId, { status }, { new: true });
//       return updatedSlot;
//     } catch (error) {
//       console.error('Error updating slot status:', error);
//       throw new Error('Error updating slot status');
//     }
//   }
//   async getBookingsByPatientId(patientId: string): Promise<any> {
//     return Booking.find({ patientId }).populate([
//       { path: 'slotId', model: Slot },
//       { path: 'doctorId', model: Doctor },
//     ]);
//   }
//    async getSlotDetails(slotId: string): Promise<any> {
//     return Slot.findById(slotId);
//   }
//   async cancelBooking(slotId: string, patientId: string): Promise<any> {
//     return Booking.findOneAndUpdate(
//       { slotId, patientId },
//       { bookingStatus: 'cancelled', paymentStatus: 'refunded' },
//       { new: true }
//     );
//   }
//    async updateSlotStatusofcancel(slotId: string, status: string): Promise<any> {
//     return Slot.findByIdAndUpdate(slotId, { status }, { new: true });
//   }
//   async findByPatientId(patientId: string): Promise<IWallet | null> {
//     return Wallet.findOne({ patientId });
//   }
//   async createWallet(patientId: string): Promise<IWallet> {
//     return Wallet.create({ patientId, balance: 0 });
//   }
//   async updateBalance(patientId: string, amount: number): Promise<IWallet> {
//     try {
//       // Find the wallet associated with the patient
//       let wallet = await Wallet.findOne({ patientId });
//       // If wallet does not exist, create it with an initial balance of 0
//       if (!wallet) {
//         wallet = await Wallet.create({ patientId, balance: 0 });
//       }
//       // Increment the wallet balance
//       wallet.balance += amount;
//       // Save the updated wallet
//       await wallet.save();
//       return wallet;
//     } catch (error) {
//       console.error("Error updating wallet balance:", error);
//       throw new Error("Failed to update wallet balance.");
//     }
//   }
// async createTransaction(transactionData: Partial<ITransaction>): Promise<ITransaction> {
//   return Transaction.create(transactionData);
// }
// async findByPatientIdTransaction(patientId: string, skip: number, limit: number): Promise<ITransaction[]> {
//   return Transaction.find({ patientId })
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);
// }
// async countTransactionsByPatientId(patientId: string): Promise<number> {
//   return Transaction.countDocuments({ patientId });
// }
// async fetchPlatformFee(): Promise<any> {
//   try {
//     // Fetch the platform fee from the Admin collection
//     return await Admin.findOne({}, 'fixedFee percentageFee');
//   } catch (error) {
//     console.error('Error in repository layer:', error);
//     throw error;
//   }
// }
// async getConsultationFee(doctorId: string): Promise<number | null> {
//   try {
//     // Fetch the doctor document by ID, returning only the consultationFee field
//     const doctor = await Doctor.findById(doctorId).select('consultationFee');
//     // Return the consultation fee if the doctor exists, otherwise null
//     return doctor ? doctor.consultationFee : null;
//   } catch (error) {
//     console.error('Error in repository layer:', error);
//     throw error;
//   }
// }
// async getWalletByPatientId(patientId: string): Promise<any> {
//   try {
//     return await Wallet.findOne({ patientId });
//   } catch (error) {
//     console.error('Error fetching wallet by patient ID:', error);
//     throw new Error('Error fetching wallet');
//   }
// }
// async updateWalletBalance(walletId: string, newBalance: number): Promise<void> {
//   const wallet = await Wallet.findById(walletId);
//   if (!wallet) {
//     throw new Error('Wallet not found');
//   }
//   if (wallet.balance < newBalance) {
//     throw new Error('Insufficient wallet balance');
//   }
//   await Wallet.findByIdAndUpdate(walletId, { $set: { balance: newBalance } });
// }
// async findNotificationByPatientId(patientId: string): Promise<any> {
//   try {
//     const notifications = await Notification.find({ patientId }).sort({ createdAt: -1 }); // Latest notifications first
//     return notifications;
//   } catch (error) {
//     console.error(`Error fetching notifications for patient ID: ${patientId}`, error);
//     throw error;
//   }
// }
// async updateStatus(id: string, status: string): Promise<any> {
//   try {
//     const updatedNotification = await Notification.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true } // Return the updated document
//     );
//     return updatedNotification;
//   } catch (error) {
//     console.error(`Error updating notification ID: ${id} with status: ${status}`, error);
//     throw error;
//   }
// }
// async getDoctorDetailsForPatient(doctorId: string) {
//   return Doctor.findById(doctorId);
// }
// async saveReview(review: any) {
//   try {
//     const savedReview = await review.save();
//     return savedReview;
//   } catch (error) {
//     throw new Error('Error saving review to database');
//   }
// }
// // Method to fetch reviews by doctorId
// async getReviewsByDoctorId(doctorId: string) {
//   try {
//     const reviews = await Review.find({ doctorId }).exec();
//     return reviews;
//   } catch (error) {
//     throw new Error('Error fetching reviews from database');
//   }
// }
//  async getAverageRatingForDoctor(objectId:mongoose.Types.ObjectId): Promise<number | null> {
//     const result = await Review.aggregate([
//       { $match: { doctorId: objectId } }, // Filter reviews for the given doctor
//       {
//         $group: {
//           _id: null,
//           averageRating: { $avg: '$rating' }, // Calculate the average rating
//         },
//       },
//     ]);
//     return result.length > 0 ? result[0].averageRating : null;
//   }
//   async getDoctorAverageRatingformultipleDoctors(doctorId: mongoose.Types.ObjectId): Promise<number | null> {
//     const result = await Review.aggregate([
//       { $match: { doctorId } },
//       {
//         $group: {
//           _id: "$doctorId",
//           averageRating: { $avg: "$rating" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           doctorId: "$_id",
//           averageRating: 1,
//         },
//       },
//     ]);
//     return result.length > 0 ? result[0].averageRating : null;
//   }
//   async findBookingBySlotIdforSuccessPage(slotId: string): Promise<any> {
//     try {
//       const booking = await Booking.findOne({ slotId });
//       if (!booking) {
//         throw new Error('Booking not found');
//       }
//       return booking;
//     } catch (error) {
//     }
//   }
//   async findDoctorByIdforSuccessPage(doctorId: string): Promise<any> {
//     try {
//       const doctor = await Doctor.findById(doctorId);
//       if (!doctor) {
//         throw new Error('Doctor not found');
//       }
//       return doctor;
//     } catch (error) {
//     }
//   }
//   async findSlotByIdforSuccessPage(slotId: string): Promise<any> {
//     return await Slot.findById(slotId);
//   }
// async getAppointmentHistoryForPatient(patientId:string) {
//   try {
//     const appointments = await Booking.find({
//       patientId,
//       bookingStatus: 'completed',
//     })
//       .populate('patientId', 'name contactNumber')
//       .populate('slotId', 'startTime endTime date')
//       .populate('doctorId', '_id name specialization clinicAddress locality experience')
//       .exec();
//     return appointments;
//   } catch (error) {
//     console.error('Error finding confirmed appointments:', error);
//     throw error;
//   }
// }
// async saveMessage(
//   patientId: string,  // Explicitly define the type
//   doctorId: string,   // Explicitly define the type
//   message: string,
//   sender: string
// ): Promise<any> {
//   try {
//     const newMessage = new Chat({
//       patientId,
//       doctorId,
//       message,
//       sender,
//     });
//     await newMessage.save();  // Save the message to the database
//     return newMessage;        // Return the saved message
//   } catch (error) {
//     console.error("Error saving message:", error);
//     throw new Error('Error saving message');
//   }
// }
// async getChatHistory(query: object): Promise<any[]> {
//   try {
//     const chatHistory = await Chat.find(query).sort({ timestamp: 1 });
//     return chatHistory;
//   } catch (error) {
//     console.error('Error in repository while fetching chat history:', error);
//     throw new Error('Database query failed');
//   }
// }
// async fetchDoctorDetailsforChat(doctorId:string) {
//   try {
//     return await Doctor.findById(doctorId).select('name specialization experience clinicAddress contactNumber');
//   } catch (error) {
//     throw new Error('Error fetching doctor details from the database');
//   }
// }
// }
// export default new PatientRepository();
import Patient from '../models/patient.js';
import Doctor from '../models/doctor.js';
import { Slot } from '../models/slot.js';
import Booking from '../models/booking.js';
import Wallet from '../models/wallet.js';
import Transaction from '../models/transaction.js';
import Admin from '../models/admin.js';
import Notification from '../models/notification.js';
import { Review } from '../models/reviews.js';
import Chat from '../models/chat.js';
export class PatientRepository {
    async findByEmail(email) {
        return Patient.findOne({ email });
    }
    async savePatient(patientData) {
        const patient = new Patient(patientData);
        return patient.save();
    }
    async updatePatient(patient) {
        return patient.save();
    }
    async findById(patientId) {
        return Patient.findById(patientId);
    }
    async updatePatientProfile(id, updatedData) {
        return Patient.findByIdAndUpdate(id, updatedData, { new: true }); // Returns the updated document
    }
    async getDistinctSpecializations() {
        try {
            return await Doctor.aggregate([
                { $match: { isApproved: true } }, // Only approved doctors
                { $group: { _id: "$specialization", doctorCount: { $sum: 1 } } }, // Group by specialization and count
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        doctorCount: 1,
                        isActive: { $gt: ["$doctorCount", 0] }
                    }
                }
            ]);
        }
        catch (error) {
            throw new Error('Error fetching specializations: ');
        }
    }
    async getDoctorsBySpecialization(specialization) {
        try {
            return await Doctor.find({ specialization, isApproved: true }, { name: 1, experience: 1, contactNumber: 1, profilePicture: 1, clinicAddress: 1, specialization: 1, locality: 1 });
        }
        catch (error) {
            console.error('Error fetching doctors by specialization:', error);
            throw new Error('Error fetching doctors by specialization');
        }
    }
    async getSlotsByDoctorAndDate(doctorId, date) {
        try {
            const slots = await Slot.find({ doctorId, date }); // Adjust the query as necessary
            return slots;
        }
        catch (error) {
            console.error('Error fetching slots by doctor and date:', error);
            throw new Error('Error fetching slots by doctor and date');
        }
    }
    async findOrCreatePatient(email, name) {
        const existingPatient = await this.findByEmail(email);
        if (existingPatient) {
            return existingPatient;
        }
        // Create a new patient with default values for required fields if not found
        const newPatient = new Patient({
            email,
            name,
            contactNumber: 'N/A', // Default or placeholder value
            gender: 'other', // Default gender
            password: 'google_oauth', // Placeholder password to meet schema requirement
            isVerified: true, // Set as verified for OAuth users
        });
        return newPatient.save();
    }
    async findByIdfornearbydoc(patientId) {
        return Patient.findById(patientId);
    }
    async findDoctors(search, specialization, locality, page = 1, limit = 10) {
        const query = { isApproved: true };
        // Add specialization filter if specified
        if (specialization) {
            query.specialization = specialization;
        }
        // Build the $or query for name, specialization, or locality search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialization: { $regex: search, $options: 'i' } },
                { locality: { $regex: search, $options: 'i' } }
            ];
        }
        else if (locality) {
            // Filter by locality if specified
            query.locality = { $regex: locality, $options: 'i' };
        }
        // Paginate the results
        const doctors = await Doctor.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalDoctors = await Doctor.countDocuments(query);
        return {
            doctors,
            totalPages: Math.ceil(totalDoctors / limit),
            currentPage: page
        };
    }
    async updateBookingAfterPayment(paymentId, orderId, slotId, paymentStatus, bookingStatus) {
        try {
            let booking = await Booking.findOne({ slotId });
            if (!booking) {
                booking = new Booking({
                    slotId,
                    paymentId,
                    paymentStatus: paymentStatus,
                    bookingStatus: bookingStatus,
                    amount: 100, // Replace with actual amount if needed
                });
                await booking.save();
                return booking;
            }
            else {
                booking.paymentId = paymentId;
                booking.paymentStatus = paymentStatus;
                booking.bookingStatus = bookingStatus;
                await booking.save();
                return booking;
            }
        }
        catch (error) {
            console.error('Error updating booking after payment:', error);
            throw new Error('Error updating booking after payment');
        }
    }
    async updateSlotStatus(slotId, status) {
        try {
            const updatedSlot = await Slot.findByIdAndUpdate(slotId, { status }, { new: true });
            return updatedSlot;
        }
        catch (error) {
            console.error('Error updating slot status:', error);
            throw new Error('Error updating slot status');
        }
    }
    async getBookingsByPatientId(patientId) {
        return Booking.find({ patientId }).populate([
            { path: 'slotId', model: Slot },
            { path: 'doctorId', model: Doctor },
        ]);
    }
    async getSlotDetails(slotId) {
        return Slot.findById(slotId);
    }
    async cancelBooking(slotId, patientId) {
        return Booking.findOneAndUpdate({ slotId, patientId }, { bookingStatus: 'cancelled', paymentStatus: 'refunded' }, { new: true });
    }
    async updateSlotStatusofcancel(slotId, status) {
        return Slot.findByIdAndUpdate(slotId, { status }, { new: true });
    }
    async findByPatientId(patientId) {
        return Wallet.findOne({ patientId });
    }
    async createWallet(patientId) {
        return Wallet.create({ patientId, balance: 0 });
    }
    async updateBalance(patientId, amount) {
        try {
            // Find the wallet associated with the patient
            let wallet = await Wallet.findOne({ patientId });
            // If wallet does not exist, create it with an initial balance of 0
            if (!wallet) {
                wallet = await Wallet.create({ patientId, balance: 0 });
            }
            // Increment the wallet balance
            wallet.balance += amount;
            // Save the updated wallet
            await wallet.save();
            return wallet;
        }
        catch (error) {
            console.error("Error updating wallet balance:", error);
            throw new Error("Failed to update wallet balance.");
        }
    }
    async createTransaction(transactionData) {
        return Transaction.create(transactionData);
    }
    async findByPatientIdTransaction(patientId, skip, limit) {
        return Transaction.find({ patientId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
    async countTransactionsByPatientId(patientId) {
        return Transaction.countDocuments({ patientId });
    }
    async fetchPlatformFee() {
        try {
            // Fetch the platform fee from the Admin collection
            return await Admin.findOne({}, 'fixedFee percentageFee');
        }
        catch (error) {
            console.error('Error in repository layer:', error);
            throw error;
        }
    }
    async getConsultationFee(doctorId) {
        try {
            // Fetch the doctor document by ID, returning only the consultationFee field
            const doctor = await Doctor.findById(doctorId).select('consultationFee');
            // Return the consultation fee if the doctor exists, otherwise null
            return doctor ? doctor.consultationFee : null;
        }
        catch (error) {
            console.error('Error in repository layer:', error);
            throw error;
        }
    }
    async getWalletByPatientId(patientId) {
        try {
            return await Wallet.findOne({ patientId });
        }
        catch (error) {
            console.error('Error fetching wallet by patient ID:', error);
            throw new Error('Error fetching wallet');
        }
    }
    async updateWalletBalance(walletId, newBalance) {
        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        if (wallet.balance < newBalance) {
            throw new Error('Insufficient wallet balance');
        }
        await Wallet.findByIdAndUpdate(walletId, { $set: { balance: newBalance } });
    }
    async findNotificationByPatientId(patientId) {
        try {
            const notifications = await Notification.find({ patientId }).sort({ createdAt: -1 }); // Latest notifications first
            return notifications;
        }
        catch (error) {
            console.error(`Error fetching notifications for patient ID: ${patientId}`, error);
            throw error;
        }
    }
    async updateStatus(id, status) {
        try {
            const updatedNotification = await Notification.findByIdAndUpdate(id, { status }, { new: true } // Return the updated document
            );
            return updatedNotification;
        }
        catch (error) {
            console.error(`Error updating notification ID: ${id} with status: ${status}`, error);
            throw error;
        }
    }
    async getDoctorDetailsForPatient(doctorId) {
        return Doctor.findById(doctorId);
    }
    async saveReview(review) {
        try {
            const savedReview = await review.save();
            return savedReview;
        }
        catch (error) {
            throw new Error('Error saving review to database');
        }
    }
    // Method to fetch reviews by doctorId
    async getReviewsByDoctorId(doctorId) {
        try {
            const reviews = await Review.find({ doctorId }).exec();
            return reviews;
        }
        catch (error) {
            throw new Error('Error fetching reviews from database');
        }
    }
    async getAverageRatingForDoctor(objectId) {
        const result = await Review.aggregate([
            { $match: { doctorId: objectId } }, // Filter reviews for the given doctor
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }, // Calculate the average rating
                },
            },
        ]);
        return result.length > 0 ? result[0].averageRating : null;
    }
    async getDoctorAverageRatingformultipleDoctors(doctorId) {
        const result = await Review.aggregate([
            { $match: { doctorId } },
            {
                $group: {
                    _id: "$doctorId",
                    averageRating: { $avg: "$rating" },
                },
            },
            {
                $project: {
                    _id: 0,
                    doctorId: "$_id",
                    averageRating: 1,
                },
            },
        ]);
        return result.length > 0 ? result[0].averageRating : null;
    }
    async findBookingBySlotIdforSuccessPage(slotId) {
        try {
            const booking = await Booking.findOne({ slotId });
            if (!booking) {
                throw new Error('Booking not found');
            }
            return booking;
        }
        catch (error) {
        }
    }
    async findDoctorByIdforSuccessPage(doctorId) {
        try {
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            return doctor;
        }
        catch (error) {
        }
    }
    async findSlotByIdforSuccessPage(slotId) {
        return await Slot.findById(slotId);
    }
    async getAppointmentHistoryForPatient(patientId) {
        try {
            const appointments = await Booking.find({
                patientId,
                bookingStatus: 'completed',
            })
                .populate('patientId', 'name contactNumber')
                .populate('slotId', 'startTime endTime date')
                .populate('doctorId', '_id name specialization clinicAddress locality experience')
                .exec();
            return appointments;
        }
        catch (error) {
            console.error('Error finding confirmed appointments:', error);
            throw error;
        }
    }
    async saveMessage(patientId, // Explicitly define the type
    doctorId, // Explicitly define the type
    message, sender) {
        try {
            const newMessage = new Chat({
                patientId,
                doctorId,
                message,
                sender,
            });
            await newMessage.save(); // Save the message to the database
            return newMessage; // Return the saved message
        }
        catch (error) {
            console.error("Error saving message:", error);
            throw new Error('Error saving message');
        }
    }
    async getChatHistory(query) {
        try {
            const chatHistory = await Chat.find(query).sort({ timestamp: 1 });
            return chatHistory;
        }
        catch (error) {
            console.error('Error in repository while fetching chat history:', error);
            throw new Error('Database query failed');
        }
    }
    async fetchDoctorDetailsforChat(doctorId) {
        try {
            return await Doctor.findById(doctorId).select('name specialization experience clinicAddress contactNumber');
        }
        catch (error) {
            throw new Error('Error fetching doctor details from the database');
        }
    }
}
export default new PatientRepository();
