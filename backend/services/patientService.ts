// import { Response, Request, NextFunction } from 'express';
// import bcrypt from 'bcryptjs';
// import sendEmail from '../utils/sendEmail.js';
// import PatientRepository from '../repositories/patientRespository.js';
// import DoctorRepository from '../repositories/doctorRespository.js';
// import Doctor, { IDoctor } from '../models/doctor.js'; 
// import Booking from '../models/booking.js'; 
// import {generatePatientAccessToken, generatePatientRefreshToken} from '../utils/patientGenerateToken.js';
// import {verifyGoogleToken} from '../middleware/googleAuthMiddleware.js';
// import { TokenPayload } from 'google-auth-library';
// import { getCoordinates } from '../config/geocoordination.js'; 
// import Razorpay from 'razorpay';
// import { Types } from 'mongoose';
// import {Review} from '../models/reviews.js'
// import mongoose from 'mongoose';
// import Chat from '../models/chat.js'
// import {patientServiceSlot,patientServiceSlotDoctor,patientServiceSBooking,patientServiceSPopulatedPatient,
//   patientServiceSPopulatedSlot,patientServiceSPopulatedDoctor
// } 
// from '../interfaces/patientBackendInterfaces.js'

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID as string, // Type assertion
//   key_secret: process.env.RAZORPAY_KEY_SECRET as string,
// });


// class PatientService {
  
//  async registerPatient(
//     name: string,
//     email: string,
//     password: string,
//     age: number,
//     gender: string,
//     address: string,
//     locality:string,
//     contactNumber: string,
//     bloodGroup: string
//   ) {
//     try {

//       const coordinates = await getCoordinates(locality,email);
//       if (!coordinates) {
//         throw new Error('Unable to find location for the provided locality.');
//       }

//       const existingPatient = await PatientRepository.findByEmail(email);
  
//       if (existingPatient) {
//         throw new Error('Email already registered');
//       }
      
//       const otp = Math.floor(100000 + Math.random() * 900000).toString();
//       const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
  
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       const newPatient = {
//         name,
//         email,
//         password: hashedPassword,
//         otp,
//         otpExpires,
//         age,
//         gender,
//         address,
//         locality,
//         location: {
//           type: 'Point',
//           coordinates: [coordinates.longitude, coordinates.latitude] // GeoJSON format [longitude, latitude]
//         },
//         contactNumber,
//         bloodGroup,
//       };
      
//       await PatientRepository.savePatient(newPatient);
      
//       await sendEmail(email, 'OTP Verification', `Your OTP is ${otp}`);
//     } catch (error) {
//       console.error('Error in registerPatient:', error);
//       throw error; 
//     }
//   }
  


//   async verifyOtp(email: string, otp: string) {
//     const patient = await PatientRepository.findByEmail(email);  
//     if (!patient) {
//       throw new Error('Patient not found');
//     }
//     if (patient.otp !== otp) {
//       throw new Error('Invalid OTP');
//     }
//     if (patient.otpExpires && patient.otpExpires < new Date()) {
//       throw new Error('OTP expired');
//     }
//     patient.isVerified = true;
//     await PatientRepository.updatePatient(patient);
//   }


//   async resendOtp(email: string) {
//     const patient = await PatientRepository.findByEmail(email);
//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     if (patient.isVerified) {
//       throw new Error('Patient already verified');
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     patient.otp = otp;
//     patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//     await PatientRepository.updatePatient(patient);
    
//     await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
//   }

  



// async loginPatient(email: string, password: string, res: Response): Promise<{
//   patient: {
//       id: string; 
//       name: string;
//       email: string;
//       isVerified: boolean;
//   };
//   token: string;
// }> {
//   const patient = await PatientRepository.findByEmail(email);
//   if (!patient) throw new Error('Invalid email or password');

//   const isMatch = await bcrypt.compare(password, patient.password);
//   if (!isMatch) throw new Error('Invalid email or password');

//   if (!patient.isVerified) throw new Error('Please verify your email before logging in.');


//   let accessToken;
//     try {
//       accessToken = generatePatientAccessToken(patient._id.toString(), "patient");
//       generatePatientRefreshToken(res, patient._id.toString(), "patient");
//       console.log("Access token generated:", accessToken);
//     } catch (err) {
//       console.error("Error generating tokens:", err);
//       throw new Error("Could not generate tokens");
//     }

//   return {
//     patient: {
//       id: patient._id.toString(), 
//       name: patient.name,
//       email: patient.email,
//       isVerified: patient.isVerified,
//     },
//     token: accessToken,
//   };
// }


// async logoutPatient(res: Response): Promise<void> {
//   res.clearCookie('token', { httpOnly: true, secure: true }); 
// }


// async sendResetOtp(email: string) {
//   try {
//     const patient = await PatientRepository.findByEmail(email); 
//     if (!patient) {
//       console.error('Patient not found for email:', email); 
//       throw new Error('Patient not found');
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     patient.otp = otp;
//     patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//     await PatientRepository.updatePatient(patient);  
//     await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
//   } catch (error) {
//     console.error('Error in sendResetOtp:', error); 
//     throw new Error('Internal server error');
//   }
// }



// async resetPassword(email: string, newPassword: string): Promise<void> {
//   const patient = await PatientRepository.findByEmail(email); 
//   if (!patient) {
//     throw new Error('User not found');
//   }
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(newPassword, salt);

//   patient.password = hashedPassword; 
//   await patient.save();
// }


// async getPatientDetails(patientId: string) {
//   try {
//     const patient = await PatientRepository.findById(patientId); // Assuming your repository has a findById method
//     if (!patient) {
//       throw new Error('Patient not found');
//     }
//     return patient; // Return the patient details if found
//   } catch (error) {
//     console.error('Error in getPatientDetails:', error);
//     throw error; // This will allow your error handling middleware to catch and respond to the client
//   }
// }


// async PatientProfileEdit(id: string, updatedData: Partial<any>) {
//   const updatedPatient = await PatientRepository.updatePatientProfile(id, updatedData);
//   if (!updatedPatient) {
//     throw new Error('Patient not found');
//   }
//   return updatedPatient;
// }



// async  getSpecializations() {
 
//   try {
//     const specializations = await PatientRepository.getDistinctSpecializations();
    
//     return specializations;
//   } catch (error) {
//     throw new Error('Error in service layer: ');
//   }
// }


// async getDoctorsBySpecialization(specialization: string) {
 
//   try {
//     const doctors = await PatientRepository.getDoctorsBySpecialization(specialization);
//     return doctors;
//   } catch (error) {
//     console.error('Error in service layer:', error);
//     throw new Error('Error in service layer');
//   }
// }



// async fetchSlots(doctorId: string, date: string): Promise<any> {
//   try {
//     const slots = await PatientRepository.getSlotsByDoctorAndDate(doctorId, date);
//     return slots;
//   } catch (error) {
//     console.error('Error in service layer:', error);
//     throw new Error('Error in service layer');
//   }
// }


// async googleLogin(googleToken: string, res: Response) {
//   try {
//     const payload: TokenPayload | undefined = await verifyGoogleToken(googleToken);
    
//     if (!payload) {
//       throw new Error('Failed to verify Google token');
//     }

//     const { email, name } = payload;
//     if (!email) {
//       throw new Error('Email is required from Google token');
//     }
//     const userName = name || 'Unnamed User';
//     const patient = await PatientRepository.findOrCreatePatient(email, userName);

//     let accessToken;
//     try {
//       accessToken = generatePatientAccessToken(patient._id.toString(), "patient");
//       generatePatientRefreshToken(res, patient._id.toString(), "patient");
//       console.log("Access token generated:", accessToken);
//     } catch (err) {
//       console.error("Error generating tokens:", err);
//       throw new Error("Could not generate tokens");
//     }

//     return { 
//       patient: {
//         id: patient._id.toString(),
//         name: patient.name,
//         email: patient.email,
//         isVerified: patient.isVerified,
//       },
//       token: accessToken,
//     };
//   } catch (error) {
//     console.error('Google login error:', error);
//     throw new Error('Error during Google login');
//   }
// }




// async getNearbyDoctors(patientId: string, radius: number) {
  
//   const patient = await PatientRepository.findByIdfornearbydoc(patientId);
  
//   if (!patient) {
//     throw new Error('Patient not found');
//   }

//   // Ensure patient.location and patient.location.coordinates are defined
//   const coordinates = patient.location?.coordinates;
  
//   if (!coordinates) {
//     throw new Error('Patient location coordinates are missing');
//   }


//   return DoctorRepository.getNearbyDoctors(coordinates, radius);
// }




// async searchDoctors(
//   search: string,
//   specialization: string,
//   locality: string,
//   page: number,
//   limit: number
// ): Promise<{ doctors: IDoctor[]; totalPages: number; currentPage: number }> {
//   try {

//     const searchResult = await PatientRepository.findDoctors(search, specialization, locality, page, limit);

//     if (!searchResult) {
//       throw new Error('No doctors found with the specified criteria');
//     }

//     return searchResult;
//   } catch (error) {
//     console.error('Error in searchDoctors:', error);
//     throw new Error('Error occurred while searching for doctors');
//   }
// }
// //-----------------------------------------------------------------------------

// async createOrder(slotId: string, amount: number): Promise<any> {
//   try {
//     const options = {
//       amount: amount * 100, // Amount in paise
//       currency: 'INR',
//       receipt: `receipt_${slotId}`,
//     };
//     const order = await razorpay.orders.create(options);
//     return order;
//   } catch (error) {
//     console.error('Error in service layer while creating order:', error);
//     throw new Error('Error in service layer while creating order');
//   }
// }



// async handlePaymentSuccess(
//   paymentId: string,
//   orderId: string,
//   slotId: string,
//   doctorId: string, // Accepting doctorId from the frontend
//   patientId: string,
//   totalAmount: string,
//   adminFee:string,
//   consultationFee:string // Accepting totalAmount from the frontend
// ): Promise<void> {
//   try {

//     const amount = parseFloat(totalAmount); // Ensure the amount is a number
//     const platformFee = parseFloat(adminFee); // Convert adminFee to a number
//     const consultationFeeParsed = parseFloat(consultationFee); //
//     const patientObjectId = new Types.ObjectId(patientId); // Convert patientId to ObjectId

//     // Check if a booking already exists for this slot with an active status
//     let booking = await Booking.findOne({ slotId, bookingStatus: { $in: ['confirmed', 'pending'] } });

//     if (!booking) {
//       // No active booking found, create a new booking
//          booking = new Booking({
//         slotId: new Types.ObjectId(slotId), // Convert slotId to ObjectId
//         doctorId: new Types.ObjectId(doctorId), // Convert doctorId to ObjectId
//         patientId: patientObjectId, // Use the new patient's ID
//         paymentId,
//         paymentMethod: 'razorpay',
//         paymentStatus: 'successful',
//         bookingStatus: 'confirmed',
//         amount,
//         platformFee, // Save adminFee as platformFee
//         consultationFee: consultationFeeParsed, 
//       });

//       await booking.save();
   
//     } else {
//       // If an active booking is found, update it
//       booking.paymentId = paymentId;
//       booking.patientId = patientObjectId; // Update to the new patient's ID
//       booking.paymentMethod = 'razorpay';
//       booking.paymentStatus = 'successful';
//       booking.bookingStatus = 'confirmed';
//       booking.amount = amount;
//       booking.platformFee = platformFee; // Update platformFee
//       booking.consultationFee = consultationFeeParsed;
//       await booking.save();
//     }

//     // Update the slot status to 'booked'
//     await PatientRepository.updateSlotStatus(slotId, 'booked');
 
//   } catch (error) {
//     console.error('Error in service layer while handling payment success:', error);
//     throw new Error('Error in service layer while handling payment success');
//   }
// }



// async getPatientBookings(patientId: string): Promise<any> {
 
//   try {
//     const bookings: patientServiceSBooking[] = await PatientRepository.getBookingsByPatientId(patientId);
  

//     const formattedBookings = bookings.map((booking: patientServiceSBooking) => {
//       if (!booking || !booking.slotId || !booking.doctorId) {
//         console.error('Invalid booking data:', booking);
//         return null;
//       }

//       return {
//         _id: booking._id,
//         slotId: booking.slotId?._id,
//         doctorName: booking.doctorId?.name,
//         clinicAddress: booking.doctorId?.clinicAddress,
//         locality: booking.doctorId?.locality,
//         date: booking.slotId?.date,
//         startTime: booking.slotId?.startTime,
//         endTime: booking.slotId?.endTime,
//         status: booking.slotId?.status,
//         bookingStatus: booking.bookingStatus,
//         amount: booking.amount,
//       };
//     }).filter((b) => b !== null)// Filter out invalid bookings

  
//     return formattedBookings;
//   } catch (error) {
//     console.error('Error in service layer while fetching patient bookings:', error);
//     throw new Error('Error in service layer while fetching patient bookings');
//   }
// }




// async cancelAndRefund(slotId: string, patientId: string, amount: number, startTime: Date): Promise<any> {

//   try {
//     // Step 1: Calculate the refund based on the policy
//     const now = new Date();
//     const hoursDifference = (new Date(startTime).getTime() - now.getTime()) / (1000 * 60 * 60); // Time difference in hours

//     let refundAmount = 0;

//     if (hoursDifference >= 24) {
//       refundAmount = amount; // Full refund
//     } else if (hoursDifference >= 12) {
//       refundAmount = amount * 0.75; // 75% refund
//     } else {
//       refundAmount = 0; // No refund
//     }

//     // Step 2: Cancel booking and update slot status
//     const booking = await PatientRepository.cancelBooking(slotId, patientId);
//     if (!booking) throw new Error('Booking not found or already cancelled');

//     await PatientRepository.updateSlotStatusofcancel(slotId, 'available');



//     // Step 3: Refund amount to wallet (if any)
//     let wallet = await PatientRepository.findByPatientId(patientId);
//     if (!wallet) {
     
//       wallet = await PatientRepository.createWallet(patientId);
//     }

//     // Step 4: Refund amount to wallet (if any)
//     if (refundAmount > 0) {
//       wallet = await PatientRepository.updateBalance(patientId, refundAmount);
//       if (!wallet) throw new Error('Failed to update wallet balance.');
//     }

//     // Step 4: Create a transaction record for the refund
//     await PatientRepository.createTransaction({
//       patientId,
//       amount: refundAmount,
//       type: refundAmount > 0 ? 'refund' : 'no refund',
//       status: 'success',
//       description: refundAmount > 0
//         ? `Refund for cancelled appointment`
//         : `Cancellation without refund (within 12 hours)`,
//     });


//     return {
//       message: refundAmount > 0
//         ? 'Appointment cancelled and refund processed successfully.'
//         : 'Appointment cancelled without refund.',
//       refundAmount,
//       wallet,
//       booking,
//     };
//   } catch (error) {
//     console.error('Error in service layer while cancelling and refunding:', error);
//     throw new Error('Error in service layer while cancelling and refunding');
//   }
// }






// async createWalletRechargeOrder(patientId: string, amount: number): Promise<any> {

//   try {
//     // Generate a shorter receipt string
//     const receipt = `WR_${patientId}_${Date.now().toString().slice(-6)}`; // Short and unique

//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency: "INR",
//       receipt, // Use the shorter receipt
//     };

//     // Call Razorpay API to create the order
//     const order = await razorpay.orders.create(options);


//     return order; // Return the created order
//   } catch (error) {
//     console.error("Error in service layer while creating wallet recharge order:", error);
//     throw new Error("Failed to create Razorpay order for wallet recharge");
//   }
// }





// async rechargeWallet(patientId: string, amount: number): Promise<any> {
//   const wallet = await PatientRepository.updateBalance(patientId, amount);

//   if (!wallet) throw new Error('Failed to update wallet balance.');

//   await PatientRepository.createTransaction({
//     patientId,
//     amount,
//     type: 'recharge',
//     status: 'success',
//     description: 'Wallet recharge',
//   });

//   return wallet;
// }


// async getWalletDetails(patientId: string, page: number, limit: number): Promise<any> {
//   const wallet = await PatientRepository.findByPatientId(patientId);

//   if (!wallet) throw new Error('Wallet not found.');

//   const skip = (page - 1) * limit;
//   const transactions = await PatientRepository.findByPatientIdTransaction(patientId, skip, limit);
//   const totalTransactions = await PatientRepository.countTransactionsByPatientId(patientId);

//   return { wallet, transactions, totalTransactions };
// }



// async fetchPlatformFee(): Promise<any> {
//   try {
//     // Fetch platform fee from the repository
//     const platformFee = await PatientRepository.fetchPlatformFee();

//     // Check if platform fee exists
//     if (!platformFee) {
//       throw new Error('Platform fee configuration not found.');
//     }

//     // Return the platform fee if found
//     return platformFee;
//   } catch (error) {
//     console.error('Error fetching platform fee:', error);
//     throw new Error('Internal server error while fetching platform fee');
//   }
// }



// async fetchConsultationFee(doctorId: string): Promise<number | null> {
//   try {
//     const consultationFee = await PatientRepository.getConsultationFee(doctorId);

//     if (!consultationFee) {
//       throw new Error(`Consultation fee not found for doctor with ID: ${doctorId}`);
//     }

//     return consultationFee;
//   } catch (error) {
//     console.error('Error in service layer:', error);
//     throw error;
//   }
// }


// async handleWalletPaymentSuccess(
//   patientId: string,
//   slotId: string,
//   doctorId: string,
//   totalAmount: string,
//   adminFee:string,
//   consultationFee:string
// ): Promise<void> {
//   try {
//     const amount = parseFloat(totalAmount);
//     const platformFee = parseFloat(adminFee); // Convert adminFee to a number
//     const consultationFeeParsed = parseFloat(consultationFee); //

//     // Fetch wallet details using patientId
//     const wallet = await PatientRepository.getWalletByPatientId(patientId);
//     if (!wallet) {
//       throw new Error('Wallet not found for the patient.');
//     }

//     if (wallet.balance < amount) {
//       throw new Error('Insufficient wallet balance.');
//     }

//     // Deduct the wallet balance atomically
//     await PatientRepository.updateWalletBalance(wallet._id, wallet.balance - amount);


//   // Save the wallet payment transaction
//   await PatientRepository.createTransaction({
//     patientId,
//     amount,
//     type: 'wallet payment',
//     status: 'success',
//     description: 'Payment deducted via wallet for booking',
//   });


//     // Check if a booking already exists for the slot
//     let booking = await Booking.findOne({ slotId, bookingStatus: { $in: ['confirmed', 'pending'] } });

//     if (!booking) {
//       // Create a new booking
//       booking = new Booking({
//         slotId: new Types.ObjectId(slotId),
//         doctorId: new Types.ObjectId(doctorId),
//         patientId: new Types.ObjectId(patientId),
//         paymentId: null,
//         paymentMethod: 'wallet',
//         paymentStatus: 'successful',
//         bookingStatus: 'confirmed',
//         amount,
//         platformFee, // Save adminFee as platformFee
//         consultationFee: consultationFeeParsed, 
//       });

//       await booking.save();
//     } else {
//       // Update existing booking
//       booking.patientId = new Types.ObjectId(patientId);
//       booking.paymentMethod = 'wallet';
//       booking.paymentStatus = 'successful';
//       booking.bookingStatus = 'confirmed';
//       booking.amount = amount;
//       booking.platformFee = platformFee; // Update platformFee
//       booking.consultationFee = consultationFeeParsed;
//       await booking.save();
//     }

//     // Update the slot status to 'booked'
//     await PatientRepository.updateSlotStatus(slotId, 'booked');
//   } catch (error) {
//     console.error('Error in service layer while handling wallet payment success:', error);
//     throw error;
//   }

 

// }

// async getNotificationsByPatientId(patientId: string): Promise<any> {
//   try {
//     const notifications = await PatientRepository.findNotificationByPatientId(patientId);
//     return notifications;
//   } catch (error) {
//     console.error(`Error fetching notifications for patient ID: ${patientId}`, error);
//     throw error;
//   }
// }

// async updateNotificationReadStatus(id: string, status: string): Promise<any> {
//   try {
//     const updatedNotification = await PatientRepository.updateStatus(id, status);
//     return updatedNotification;
//   } catch (error) {
//     console.error(`Error updating notification ID: ${id} with status: ${status}`, error);
//     throw error;
//   }
// }

// async getDoctorDetailsForPatient(doctorId: string) {
//   try {
//     const doctor = await PatientRepository.getDoctorDetailsForPatient(doctorId);

//     if (!doctor) {
//       throw new Error('Doctor not found');
//     }

//     return doctor;
//   } catch (error) {
//     console.error(`Error fetching doctor with ID ${doctorId}:`, error);
//     throw error; // Re-throw to be handled by the caller
//   }
// }



// async getReviewsByDoctor(doctorId: string) {
//   try {
//     const reviews = await PatientRepository.getReviewsByDoctorId(doctorId);
//     return reviews;
//   } catch (error) {
//     throw new Error('Error fetching reviews');
//   }
// }

// // Method for submitting a new review
// async submitReview(doctorId: string, patientName: string, comment: string, rating: number) {
//   try {
//     const review = new Review({
//       doctorId,
//       patientName,
//       comment,
//       rating,
//       date: new Date(),
//     });
//     // Save the review using the repository
//     const savedReview = await PatientRepository.saveReview(review);
//     return savedReview;
//   } catch (error) {
//     throw new Error('Error saving review');
//   }
// }




// async getDoctorAverageRating(objectId: mongoose.Types.ObjectId): Promise<number | null> {
//   return await PatientRepository.getAverageRatingForDoctor(objectId);
// }



// async getDoctorAverageRatingformultipleDoctors(
//   doctorIds: mongoose.Types.ObjectId[]
// ): Promise<{ doctorId: mongoose.Types.ObjectId; averageRating: number | null }[]> {
//   const ratings = await Promise.all(
//     doctorIds.map(async (doctorId) => {
//       const averageRating = await PatientRepository.getDoctorAverageRatingformultipleDoctors(doctorId);
//       return { doctorId, averageRating };
//     })
//   );
//   return ratings;
// }




// async getBookingDetailsforSuccessPage(slotId: string): Promise<any> {
//   try {
//     // Fetch booking details using the repository
//     const booking = await PatientRepository.findBookingBySlotIdforSuccessPage(slotId);

//     if (!booking) {
//       throw new Error('Booking not found');
//     }

//     // Include doctor details in the booking information
//     const doctorDetails = await PatientRepository.findDoctorByIdforSuccessPage(booking.doctorId);

//     if (!doctorDetails) {
//       throw new Error('Doctor details not found');
//     }

//     // Include slot details in the booking information
//     const slotDetails = await PatientRepository.findSlotByIdforSuccessPage(slotId);

//     if (!slotDetails) {
//       throw new Error('Slot details not found');
//     }

//     return {
//       ...booking.toObject(),
//       doctorName: doctorDetails.name,
//       doctorAddress: doctorDetails.clinicAddress,
//       doctorSpecialization: doctorDetails.specialization,
//       appointmentDate: slotDetails.date,
//       appointmentStartTime: slotDetails.startTime,
//       appointmentEndTime: slotDetails.endTime,
//     };
//   } catch (error) {
    
//     throw new Error('Failed to fetch booking details');
//   }
// }




// async getAppointmentHistoryForPatient(patientId: string) {

//   const appointments = await PatientRepository.getAppointmentHistoryForPatient(patientId);

//   return appointments.map((appointment, index) => {
//     const patient = appointment.patientId as unknown as patientServiceSPopulatedPatient;
//     const slot = appointment.slotId as unknown as patientServiceSPopulatedSlot;
//     const doctor = appointment.doctorId as unknown as patientServiceSPopulatedDoctor;

//     return {
//       index: index + 1,
//       bookingId: appointment._id.toString(), // Unique booking ID
//       date: slot.date,
//       slotTime: `${slot.startTime} - ${slot.endTime}`, // Combined slot times
//       patientName: patient.name,
//       contactNumber: patient.contactNumber,
//       doctorName: doctor.name,
//       doctorId:doctor._id,
//       specialization: doctor.specialization ,
//       clinicAddress: doctor.clinicAddress, // Adjust doctor fields as per schema
//       locality: doctor.locality,
//       experience: doctor.experience,
        
//     };
//   });
// }








// async sendMessage(patientId: string, doctorId: string, message: string, sender: string){
//   const newMessage = await PatientRepository.saveMessage(patientId, doctorId, message, sender);
//   return newMessage;
// }





// async getChatHistory(patientId: string, doctorId: string): Promise<any[]> {
//   try {
//     const query = {
//       $or: [
//         { patientId, doctorId },
//         { patientId: doctorId, doctorId: patientId },
//       ],
//     };

//     // Call the repository method
//     const chatHistory = await PatientRepository.getChatHistory(query);
//     return chatHistory;
//   } catch (error) {
//     console.error('Error in service while fetching chat history:', error);
//     throw new Error('Failed to fetch chat history');
//   }
// }



// async fetchDoctorDetailsforChat(doctorId: string){
//   if (!doctorId) {
//     throw new Error('Doctor ID is required');
//   }

//   const doctorDetails = await PatientRepository.fetchDoctorDetailsforChat(doctorId);
//   if (!doctorDetails) {
//     throw new Error('Doctor not found');
//   }

//   return {
//     name: doctorDetails.name,
//     specialization: doctorDetails.specialization,
//     clinicAddress: doctorDetails.clinicAddress,
//     contactNumber: doctorDetails.contactNumber,
//     experience:doctorDetails.experience
//   };
// }



// }

// export default new PatientService();










import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import {PatientRepository} from '../repositories/patientRespository.js';
import DoctorRepository from '../repositories/doctorRespository.js';
import Doctor, { IDoctor } from '../models/doctor.js'; 
import Booking from '../models/booking.js'; 
import {generatePatientAccessToken, generatePatientRefreshToken} from '../utils/patientGenerateToken.js';
import {verifyGoogleToken} from '../middleware/googleAuthMiddleware.js';
import { TokenPayload } from 'google-auth-library';
import { getCoordinates } from '../config/geocoordination.js'; 
import Razorpay from 'razorpay';
import { Types } from 'mongoose';
import {Review} from '../models/reviews.js'
import mongoose from 'mongoose';
import Chat from '../models/chat.js'
import {patientServiceSlot,patientServiceSlotDoctor,patientServiceSBooking,patientServiceSPopulatedPatient,
  patientServiceSPopulatedSlot,patientServiceSPopulatedDoctor
} 
from '../interfaces/patientBackendInterfaces.js'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string, // Type assertion
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});


export class PatientService {

 private PatientRepository: PatientRepository;

  constructor(patientRepository: PatientRepository) {
    this.PatientRepository = patientRepository
  }

  
 async registerPatient(
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    address: string,
    locality:string,
    contactNumber: string,
    bloodGroup: string
  ) {
    try {

      const coordinates = await getCoordinates(locality,email);
      if (!coordinates) {
        throw new Error('Unable to find location for the provided locality.');
      }

      const existingPatient = await this.PatientRepository.findByEmail(email);
  
      if (existingPatient) {
        throw new Error('Email already registered');
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newPatient = {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
        age,
        gender,
        address,
        locality,
        location: {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude] // GeoJSON format [longitude, latitude]
        },
        contactNumber,
        bloodGroup,
      };
      
      await this.PatientRepository.savePatient(newPatient);
      
      await sendEmail(email, 'OTP Verification', `Your OTP is ${otp}`);
    } catch (error) {
      console.error('Error in registerPatient:', error);
      throw error; 
    }
  }
  


  async verifyOtp(email: string, otp: string) {
    const patient = await this.PatientRepository.findByEmail(email);  
    if (!patient) {
      throw new Error('Patient not found');
    }
    if (patient.otp !== otp) {
      throw new Error('Invalid OTP');
    }
    if (patient.otpExpires && patient.otpExpires < new Date()) {
      throw new Error('OTP expired');
    }
    patient.isVerified = true;
    await this.PatientRepository.updatePatient(patient);
  }


  async resendOtp(email: string) {
    const patient = await this.PatientRepository.findByEmail(email);
    if (!patient) {
      throw new Error('Patient not found');
    }

    if (patient.isVerified) {
      throw new Error('Patient already verified');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    patient.otp = otp;
    patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.PatientRepository.updatePatient(patient);
    
    await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
  }

  



async loginPatient(email: string, password: string, res: Response): Promise<{
  patient: {
      id: string; 
      name: string;
      email: string;
      isVerified: boolean;
  };
  token: string;
}> {
  const patient = await this.PatientRepository.findByEmail(email);
  if (!patient) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, patient.password);
  if (!isMatch) throw new Error('Invalid email or password');

  if (!patient.isVerified) throw new Error('Please verify your email before logging in.');


  let accessToken;
    try {
      accessToken = generatePatientAccessToken(patient._id.toString(), "patient");
      generatePatientRefreshToken(res, patient._id.toString(), "patient");
      console.log("Access token generated:", accessToken);
    } catch (err) {
      console.error("Error generating tokens:", err);
      throw new Error("Could not generate tokens");
    }

  return {
    patient: {
      id: patient._id.toString(), 
      name: patient.name,
      email: patient.email,
      isVerified: patient.isVerified,
    },
    token: accessToken,
  };
}


async logoutPatient(res: Response): Promise<void> {
  res.clearCookie('token', { httpOnly: true, secure: true }); 
}


async sendResetOtp(email: string) {
  try {
    const patient = await this.PatientRepository.findByEmail(email); 
    if (!patient) {
      console.error('Patient not found for email:', email); 
      throw new Error('Patient not found');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    patient.otp = otp;
    patient.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.PatientRepository.updatePatient(patient);  
    await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
  } catch (error) {
    console.error('Error in sendResetOtp:', error); 
    throw new Error('Internal server error');
  }
}



async resetPassword(email: string, newPassword: string): Promise<void> {
  const patient = await this.PatientRepository.findByEmail(email); 
  if (!patient) {
    throw new Error('User not found');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  patient.password = hashedPassword; 
  await patient.save();
}


async getPatientDetails(patientId: string) {
  try {
    const patient = await this.PatientRepository.findById(patientId); // Assuming your repository has a findById method
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient; // Return the patient details if found
  } catch (error) {
    console.error('Error in getPatientDetails:', error);
    throw error; // This will allow your error handling middleware to catch and respond to the client
  }
}


async PatientProfileEdit(id: string, updatedData: Partial<any>) {
  const updatedPatient = await this.PatientRepository.updatePatientProfile(id, updatedData);
  if (!updatedPatient) {
    throw new Error('Patient not found');
  }
  return updatedPatient;
}



async  getSpecializations() {
 
  try {
    const specializations = await this.PatientRepository.getDistinctSpecializations();
    
    return specializations;
  } catch (error) {
    throw new Error('Error in service layer: ');
  }
}


async getDoctorsBySpecialization(specialization: string) {
 
  try {
    const doctors = await this.PatientRepository.getDoctorsBySpecialization(specialization);
    return doctors;
  } catch (error) {
    console.error('Error in service layer:', error);
    throw new Error('Error in service layer');
  }
}



async fetchSlots(doctorId: string, date: string): Promise<any> {
  try {
    const slots = await this.PatientRepository.getSlotsByDoctorAndDate(doctorId, date);
    return slots;
  } catch (error) {
    console.error('Error in service layer:', error);
    throw new Error('Error in service layer');
  }
}


async googleLogin(googleToken: string, res: Response) {
  try {
    const payload: TokenPayload | undefined = await verifyGoogleToken(googleToken);
    
    if (!payload) {
      throw new Error('Failed to verify Google token');
    }

    const { email, name } = payload;
    if (!email) {
      throw new Error('Email is required from Google token');
    }
    const userName = name || 'Unnamed User';
    const patient = await this.PatientRepository.findOrCreatePatient(email, userName);

    let accessToken;
    try {
      accessToken = generatePatientAccessToken(patient._id.toString(), "patient");
      generatePatientRefreshToken(res, patient._id.toString(), "patient");
      console.log("Access token generated:", accessToken);
    } catch (err) {
      console.error("Error generating tokens:", err);
      throw new Error("Could not generate tokens");
    }

    return { 
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
        isVerified: patient.isVerified,
      },
      token: accessToken,
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error('Error during Google login');
  }
}




async getNearbyDoctors(patientId: string, radius: number) {
  
  const patient = await this.PatientRepository.findByIdfornearbydoc(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Ensure patient.location and patient.location.coordinates are defined
  const coordinates = patient.location?.coordinates;
  
  if (!coordinates) {
    throw new Error('Patient location coordinates are missing');
  }


  return DoctorRepository.getNearbyDoctors(coordinates, radius);
}




async searchDoctors(
  search: string,
  specialization: string,
  locality: string,
  page: number,
  limit: number
): Promise<{ doctors: IDoctor[]; totalPages: number; currentPage: number }> {
  try {

    const searchResult = await this.PatientRepository.findDoctors(search, specialization, locality, page, limit);

    if (!searchResult) {
      throw new Error('No doctors found with the specified criteria');
    }

    return searchResult;
  } catch (error) {
    console.error('Error in searchDoctors:', error);
    throw new Error('Error occurred while searching for doctors');
  }
}
//-----------------------------------------------------------------------------

async createOrder(slotId: string, amount: number): Promise<any> {
  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${slotId}`,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error in service layer while creating order:', error);
    throw new Error('Error in service layer while creating order');
  }
}



async handlePaymentSuccess(
  paymentId: string,
  orderId: string,
  slotId: string,
  doctorId: string, // Accepting doctorId from the frontend
  patientId: string,
  totalAmount: string,
  adminFee:string,
  consultationFee:string // Accepting totalAmount from the frontend
): Promise<void> {
  try {

    const amount = parseFloat(totalAmount); // Ensure the amount is a number
    const platformFee = parseFloat(adminFee); // Convert adminFee to a number
    const consultationFeeParsed = parseFloat(consultationFee); //
    const patientObjectId = new Types.ObjectId(patientId); // Convert patientId to ObjectId

    // Check if a booking already exists for this slot with an active status
    let booking = await Booking.findOne({ slotId, bookingStatus: { $in: ['confirmed', 'pending'] } });

    if (!booking) {
      // No active booking found, create a new booking
         booking = new Booking({
        slotId: new Types.ObjectId(slotId), // Convert slotId to ObjectId
        doctorId: new Types.ObjectId(doctorId), // Convert doctorId to ObjectId
        patientId: patientObjectId, // Use the new patient's ID
        paymentId,
        paymentMethod: 'razorpay',
        paymentStatus: 'successful',
        bookingStatus: 'confirmed',
        amount,
        platformFee, // Save adminFee as platformFee
        consultationFee: consultationFeeParsed, 
      });

      await booking.save();
   
    } else {
      // If an active booking is found, update it
      booking.paymentId = paymentId;
      booking.patientId = patientObjectId; // Update to the new patient's ID
      booking.paymentMethod = 'razorpay';
      booking.paymentStatus = 'successful';
      booking.bookingStatus = 'confirmed';
      booking.amount = amount;
      booking.platformFee = platformFee; // Update platformFee
      booking.consultationFee = consultationFeeParsed;
      await booking.save();
    }

    // Update the slot status to 'booked'
    await this.PatientRepository.updateSlotStatus(slotId, 'booked');
 
  } catch (error) {
    console.error('Error in service layer while handling payment success:', error);
    throw new Error('Error in service layer while handling payment success');
  }
}



async getPatientBookings(patientId: string): Promise<any> {
 
  try {
    const bookings: patientServiceSBooking[] = await this.PatientRepository.getBookingsByPatientId(patientId);
  

    const formattedBookings = bookings.map((booking: patientServiceSBooking) => {
      if (!booking || !booking.slotId || !booking.doctorId) {
        console.error('Invalid booking data:', booking);
        return null;
      }

      return {
        _id: booking._id,
        slotId: booking.slotId?._id,
        doctorName: booking.doctorId?.name,
        clinicAddress: booking.doctorId?.clinicAddress,
        locality: booking.doctorId?.locality,
        date: booking.slotId?.date,
        startTime: booking.slotId?.startTime,
        endTime: booking.slotId?.endTime,
        status: booking.slotId?.status,
        bookingStatus: booking.bookingStatus,
        amount: booking.amount,
      };
    }).filter((b) => b !== null)// Filter out invalid bookings

  
    return formattedBookings;
  } catch (error) {
    console.error('Error in service layer while fetching patient bookings:', error);
    throw new Error('Error in service layer while fetching patient bookings');
  }
}




async cancelAndRefund(slotId: string, patientId: string, amount: number, startTime: Date): Promise<any> {

  try {
    // Step 1: Calculate the refund based on the policy
    const now = new Date();
    const hoursDifference = (new Date(startTime).getTime() - now.getTime()) / (1000 * 60 * 60); // Time difference in hours

    let refundAmount = 0;

    if (hoursDifference >= 24) {
      refundAmount = amount; // Full refund
    } else if (hoursDifference >= 12) {
      refundAmount = amount * 0.75; // 75% refund
    } else {
      refundAmount = 0; // No refund
    }

    // Step 2: Cancel booking and update slot status
    const booking = await this.PatientRepository.cancelBooking(slotId, patientId);
    if (!booking) throw new Error('Booking not found or already cancelled');

    await this.PatientRepository.updateSlotStatusofcancel(slotId, 'available');



    // Step 3: Refund amount to wallet (if any)
    let wallet = await this.PatientRepository.findByPatientId(patientId);
    if (!wallet) {
     
      wallet = await this.PatientRepository.createWallet(patientId);
    }

    // Step 4: Refund amount to wallet (if any)
    if (refundAmount > 0) {
      wallet = await this.PatientRepository.updateBalance(patientId, refundAmount);
      if (!wallet) throw new Error('Failed to update wallet balance.');
    }

    // Step 4: Create a transaction record for the refund
    await this.PatientRepository.createTransaction({
      patientId,
      amount: refundAmount,
      type: refundAmount > 0 ? 'refund' : 'no refund',
      status: 'success',
      description: refundAmount > 0
        ? `Refund for cancelled appointment`
        : `Cancellation without refund (within 12 hours)`,
    });


    return {
      message: refundAmount > 0
        ? 'Appointment cancelled and refund processed successfully.'
        : 'Appointment cancelled without refund.',
      refundAmount,
      wallet,
      booking,
    };
  } catch (error) {
    console.error('Error in service layer while cancelling and refunding:', error);
    throw new Error('Error in service layer while cancelling and refunding');
  }
}






async createWalletRechargeOrder(patientId: string, amount: number): Promise<any> {

  try {
    // Generate a shorter receipt string
    const receipt = `WR_${patientId}_${Date.now().toString().slice(-6)}`; // Short and unique

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt, // Use the shorter receipt
    };

    // Call Razorpay API to create the order
    const order = await razorpay.orders.create(options);


    return order; // Return the created order
  } catch (error) {
    console.error("Error in service layer while creating wallet recharge order:", error);
    throw new Error("Failed to create Razorpay order for wallet recharge");
  }
}





async rechargeWallet(patientId: string, amount: number): Promise<any> {
  const wallet = await this.PatientRepository.updateBalance(patientId, amount);

  if (!wallet) throw new Error('Failed to update wallet balance.');

  await this.PatientRepository.createTransaction({
    patientId,
    amount,
    type: 'recharge',
    status: 'success',
    description: 'Wallet recharge',
  });

  return wallet;
}


async getWalletDetails(patientId: string, page: number, limit: number): Promise<any> {
  const wallet = await this.PatientRepository.findByPatientId(patientId);

  if (!wallet) throw new Error('Wallet not found.');

  const skip = (page - 1) * limit;
  const transactions = await this.PatientRepository.findByPatientIdTransaction(patientId, skip, limit);
  const totalTransactions = await this.PatientRepository.countTransactionsByPatientId(patientId);

  return { wallet, transactions, totalTransactions };
}



async fetchPlatformFee(): Promise<any> {
  try {
    // Fetch platform fee from the repository
    const platformFee = await this.PatientRepository.fetchPlatformFee();

    // Check if platform fee exists
    if (!platformFee) {
      throw new Error('Platform fee configuration not found.');
    }

    // Return the platform fee if found
    return platformFee;
  } catch (error) {
    console.error('Error fetching platform fee:', error);
    throw new Error('Internal server error while fetching platform fee');
  }
}



async fetchConsultationFee(doctorId: string): Promise<number | null> {
  try {
    const consultationFee = await this.PatientRepository.getConsultationFee(doctorId);

    if (!consultationFee) {
      throw new Error(`Consultation fee not found for doctor with ID: ${doctorId}`);
    }

    return consultationFee;
  } catch (error) {
    console.error('Error in service layer:', error);
    throw error;
  }
}


async handleWalletPaymentSuccess(
  patientId: string,
  slotId: string,
  doctorId: string,
  totalAmount: string,
  adminFee:string,
  consultationFee:string
): Promise<void> {
  try {
    const amount = parseFloat(totalAmount);
    const platformFee = parseFloat(adminFee); // Convert adminFee to a number
    const consultationFeeParsed = parseFloat(consultationFee); //

    // Fetch wallet details using patientId
    const wallet = await this.PatientRepository.getWalletByPatientId(patientId);
    if (!wallet) {
      throw new Error('Wallet not found for the patient.');
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient wallet balance.');
    }

    // Deduct the wallet balance atomically
    await this.PatientRepository.updateWalletBalance(wallet._id, wallet.balance - amount);


  // Save the wallet payment transaction
  await this.PatientRepository.createTransaction({
    patientId,
    amount,
    type: 'wallet payment',
    status: 'success',
    description: 'Payment deducted via wallet for booking',
  });


    // Check if a booking already exists for the slot
    let booking = await Booking.findOne({ slotId, bookingStatus: { $in: ['confirmed', 'pending'] } });

    if (!booking) {
      // Create a new booking
      booking = new Booking({
        slotId: new Types.ObjectId(slotId),
        doctorId: new Types.ObjectId(doctorId),
        patientId: new Types.ObjectId(patientId),
        paymentId: null,
        paymentMethod: 'wallet',
        paymentStatus: 'successful',
        bookingStatus: 'confirmed',
        amount,
        platformFee, // Save adminFee as platformFee
        consultationFee: consultationFeeParsed, 
      });

      await booking.save();
    } else {
      // Update existing booking
      booking.patientId = new Types.ObjectId(patientId);
      booking.paymentMethod = 'wallet';
      booking.paymentStatus = 'successful';
      booking.bookingStatus = 'confirmed';
      booking.amount = amount;
      booking.platformFee = platformFee; // Update platformFee
      booking.consultationFee = consultationFeeParsed;
      await booking.save();
    }

    // Update the slot status to 'booked'
    await this.PatientRepository.updateSlotStatus(slotId, 'booked');
  } catch (error) {
    console.error('Error in service layer while handling wallet payment success:', error);
    throw error;
  }

 

}

async getNotificationsByPatientId(patientId: string): Promise<any> {
  try {
    const notifications = await this.PatientRepository.findNotificationByPatientId(patientId);
    return notifications;
  } catch (error) {
    console.error(`Error fetching notifications for patient ID: ${patientId}`, error);
    throw error;
  }
}

async updateNotificationReadStatus(id: string, status: string): Promise<any> {
  try {
    const updatedNotification = await this.PatientRepository.updateStatus(id, status);
    return updatedNotification;
  } catch (error) {
    console.error(`Error updating notification ID: ${id} with status: ${status}`, error);
    throw error;
  }
}

async getDoctorDetailsForPatient(doctorId: string) {
  try {
    const doctor = await this.PatientRepository.getDoctorDetailsForPatient(doctorId);

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${doctorId}:`, error);
    throw error; // Re-throw to be handled by the caller
  }
}



async getReviewsByDoctor(doctorId: string) {
  try {
    const reviews = await this.PatientRepository.getReviewsByDoctorId(doctorId);
    return reviews;
  } catch (error) {
    throw new Error('Error fetching reviews');
  }
}

// Method for submitting a new review
async submitReview(doctorId: string, patientName: string, comment: string, rating: number) {
  try {
    const review = new Review({
      doctorId,
      patientName,
      comment,
      rating,
      date: new Date(),
    });
    // Save the review using the repository
    const savedReview = await this.PatientRepository.saveReview(review);
    return savedReview;
  } catch (error) {
    throw new Error('Error saving review');
  }
}




async getDoctorAverageRating(objectId: mongoose.Types.ObjectId): Promise<number | null> {
  return await this.PatientRepository.getAverageRatingForDoctor(objectId);
}



async getDoctorAverageRatingformultipleDoctors(
  doctorIds: mongoose.Types.ObjectId[]
): Promise<{ doctorId: mongoose.Types.ObjectId; averageRating: number | null }[]> {
  const ratings = await Promise.all(
    doctorIds.map(async (doctorId) => {
      const averageRating = await this.PatientRepository.getDoctorAverageRatingformultipleDoctors(doctorId);
      return { doctorId, averageRating };
    })
  );
  return ratings;
}




async getBookingDetailsforSuccessPage(slotId: string): Promise<any> {
  try {
    // Fetch booking details using the repository
    const booking = await this.PatientRepository.findBookingBySlotIdforSuccessPage(slotId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Include doctor details in the booking information
    const doctorDetails = await this.PatientRepository.findDoctorByIdforSuccessPage(booking.doctorId);

    if (!doctorDetails) {
      throw new Error('Doctor details not found');
    }

    // Include slot details in the booking information
    const slotDetails = await this.PatientRepository.findSlotByIdforSuccessPage(slotId);

    if (!slotDetails) {
      throw new Error('Slot details not found');
    }

    return {
      ...booking.toObject(),
      doctorName: doctorDetails.name,
      doctorAddress: doctorDetails.clinicAddress,
      doctorSpecialization: doctorDetails.specialization,
      appointmentDate: slotDetails.date,
      appointmentStartTime: slotDetails.startTime,
      appointmentEndTime: slotDetails.endTime,
    };
  } catch (error) {
    
    throw new Error('Failed to fetch booking details');
  }
}




async getAppointmentHistoryForPatient(patientId: string) {

  const appointments = await this.PatientRepository.getAppointmentHistoryForPatient(patientId);

  return appointments.map((appointment, index) => {
    const patient = appointment.patientId as unknown as patientServiceSPopulatedPatient;
    const slot = appointment.slotId as unknown as patientServiceSPopulatedSlot;
    const doctor = appointment.doctorId as unknown as patientServiceSPopulatedDoctor;

    return {
      index: index + 1,
      bookingId: appointment._id.toString(), // Unique booking ID
      date: slot.date,
      slotTime: `${slot.startTime} - ${slot.endTime}`, // Combined slot times
      patientName: patient.name,
      contactNumber: patient.contactNumber,
      doctorName: doctor.name,
      doctorId:doctor._id,
      specialization: doctor.specialization ,
      clinicAddress: doctor.clinicAddress, // Adjust doctor fields as per schema
      locality: doctor.locality,
      experience: doctor.experience,
        
    };
  });
}








async sendMessage(patientId: string, doctorId: string, message: string, sender: string){
  const newMessage = await this.PatientRepository.saveMessage(patientId, doctorId, message, sender);
  return newMessage;
}





async getChatHistory(patientId: string, doctorId: string): Promise<any[]> {
  try {
    const query = {
      $or: [
        { patientId, doctorId },
        { patientId: doctorId, doctorId: patientId },
      ],
    };

    // Call the repository method
    const chatHistory = await this.PatientRepository.getChatHistory(query);
    return chatHistory;
  } catch (error) {
    console.error('Error in service while fetching chat history:', error);
    throw new Error('Failed to fetch chat history');
  }
}



async fetchDoctorDetailsforChat(doctorId: string){
  if (!doctorId) {
    throw new Error('Doctor ID is required');
  }

  const doctorDetails = await this.PatientRepository.fetchDoctorDetailsforChat(doctorId);
  if (!doctorDetails) {
    throw new Error('Doctor not found');
  }

  return {
    name: doctorDetails.name,
    specialization: doctorDetails.specialization,
    clinicAddress: doctorDetails.clinicAddress,
    contactNumber: doctorDetails.contactNumber,
    experience:doctorDetails.experience
  };
}






}


