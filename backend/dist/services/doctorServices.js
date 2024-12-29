// import { Response } from 'express';
// import bcrypt from 'bcryptjs';
// import sendEmail from '../utils/sendEmail.js';
// import DoctorRepository from '../repositories/doctorRespository.js';
// import {generateDoctorAccessToken,generateDoctorRefreshToken} from '../utils/doctorGenerateToken.js';
// import Doctor, { IDoctor } from '../models/doctor.js'; 
// import { ISlot,Slot  } from '../models/slot.js'; 
// import { sendNotification } from '../config/notification.js'
// import NotificationModel from '../models/notification.js';
// import { validateSlotDuration } from '../config/slotHelper.js';
// import { generateTimeSlots, convertTo24Hour } from '../config/slotHelper.js';
// import { getCoordinates } from '../config/geocoordination.js';
// import {doctorServicesICreateDoctorMonthlySlotsParams,doctorServicesAddPrescriptionParams,doctorServicesPopulatedPatient,
//   doctorServicesPopulatedSlot
//  } from '../interfaces/doctorBackendInterfaces.js'
// import pkg from 'rrule';
// const { RRule } = pkg;
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import { generateDoctorAccessToken, generateDoctorRefreshToken } from '../utils/doctorGenerateToken.js';
import { Slot } from '../models/slot.js';
import NotificationModel from '../models/notification.js';
import { validateSlotDuration } from '../config/slotHelper.js';
import { generateTimeSlots, convertTo24Hour } from '../config/slotHelper.js';
import { getCoordinates } from '../config/geocoordination.js';
import pkg from 'rrule';
const { RRule } = pkg;
export class DoctorService {
    DoctorRepository;
    constructor(doctorRepository) {
        this.DoctorRepository = doctorRepository;
    }
    async registerDoctor(name, email, password, specialization, licenseNumber, medicalLicense, contactNumber, experience, clinicAddress, locality, biography, idProof, profilePicture, consultationFee) {
        const coordinates = await getCoordinates(locality, email);
        if (!coordinates) {
            throw new Error('Unable to find location for the provided locality.');
        }
        const existingDoctor = await this.DoctorRepository.findByEmail(email);
        if (existingDoctor) {
            throw new Error('Email already registered');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = {
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            specialization,
            licenseNumber,
            medicalLicense,
            contactNumber, // New field
            experience, // New field
            clinicAddress,
            locality,
            consultationFee,
            location: {
                type: 'Point',
                coordinates: [coordinates.longitude, coordinates.latitude] // GeoJSON format [longitude, latitude]
            }, // New field
            biography,
            profilePicture, // New field
            idProof, // New field
            isVerified: false,
            isApproved: false, // Assuming you want to set this as false by default
        };
        await this.DoctorRepository.saveDoctor(newDoctor);
        await sendEmail(email, 'OTP Verification', `Your OTP is ${otp}`);
    }
    async verifyOtp(email, otp) {
        const doctor = await this.DoctorRepository.findByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        if (doctor.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (doctor.otpExpires && doctor.otpExpires < new Date()) {
            throw new Error('OTP expired');
        }
        doctor.isVerified = true;
        await this.DoctorRepository.updateDoctor(doctor);
    }
    async resendOtp(email) {
        const doctor = await this.DoctorRepository.findByEmail(email);
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        if (doctor.isVerified) {
            throw new Error('Doctor already verified');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        doctor.otp = otp;
        doctor.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.DoctorRepository.updateDoctor(doctor);
        await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
    }
    async loginDoctor(email, password, res) {
        const doctor = await this.DoctorRepository.findByEmail(email);
        if (!doctor) {
            console.error("Doctor not found for email:", email);
            throw new Error("Invalid email or password");
        }
        // Check if doctor is approved
        if (!doctor.isApproved) {
            console.error("Doctor account not approved:", doctor.email);
            throw new Error("Your account is not approved. Please contact support.");
        }
        const isMatch = await bcrypt.compare(password, doctor.password).catch((err) => {
            console.error("Error comparing passwords:", err);
            throw new Error("Invalid email or password");
        });
        if (!isMatch) {
            console.error("Invalid password for email:", email);
            throw new Error("Invalid email or password");
        }
        if (!doctor.isVerified) {
            console.error("Doctor email not verified:", doctor.email);
            throw new Error("Please verify your email before logging in.");
        }
        let accessToken;
        try {
            accessToken = generateDoctorAccessToken(doctor._id.toString(), "doctor");
            generateDoctorRefreshToken(res, doctor._id.toString(), "doctor");
            console.log("Access token generated:", accessToken);
        }
        catch (err) {
            console.error("Error generating tokens:", err);
            throw new Error("Could not generate tokens");
        }
        return {
            doctor: {
                id: doctor._id.toString(),
                name: doctor.name,
                email: doctor.email,
                isVerified: doctor.isVerified,
            },
            token: accessToken,
        };
    }
    catch(error) {
        console.error("Error in loginDoctor service:", error.message);
        throw error; // Re-throw error for controller to handle
    }
    async logoutDoctor(res) {
        try {
            console.log('Entered logoutDoctor service');
            res.clearCookie('doctorRefreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 0,
            });
            console.log('Doctor logged out and refresh token cleared');
        }
        catch (error) {
            console.error('Error logging out doctor:', error);
            throw new Error('Logout failed');
        }
    }
    async sendResetOtp(email) {
        try {
            const doctor = await this.DoctorRepository.findByEmail(email);
            if (!doctor) {
                console.error('Doctor not found for email:', email);
                throw new Error('Doctor not found');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            doctor.otp = otp;
            doctor.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await this.DoctorRepository.updateDoctor(doctor);
            await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
        }
        catch (error) {
            console.error('Error in sendResetOtp for doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async resetPassword(email, newPassword) {
        try {
            const doctor = await this.DoctorRepository.findByEmail(email);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            doctor.password = hashedPassword;
            await doctor.save();
        }
        catch (error) {
            console.error('Error in resetPassword for doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async fetchDoctorById(doctorId) {
        try {
            const doctor = await this.DoctorRepository.findDoctorById(doctorId);
            return doctor;
        }
        catch (error) {
            console.error('Error fetching doctor by ID:', error);
            throw new Error('Internal server error');
        }
    }
    async updateDoctor(doctorId, updateData) {
        const doctor = await this.DoctorRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error('Doctor not found');
        return await this.DoctorRepository.updateDoctorById(doctorId, updateData);
    }
    async DailySlots(doctorId, date, startHour, endHour, slotDuration) {
        const slots = [];
        const existingSlots = await this.DoctorRepository.findSlotsByDoctorAndDate(doctorId, date);
        validateSlotDuration(existingSlots, slotDuration);
        const timeSlots = generateTimeSlots(startHour, endHour, slotDuration);
        for (const slotString of timeSlots) {
            const [start, end] = slotString.split(' - ');
            const [startTime, startPeriod] = start.split(' ');
            const [endTime, endPeriod] = end.split(' ');
            const slotStart = new Date(`${date}T${convertTo24Hour(startTime, startPeriod)}`);
            const slotEnd = new Date(`${date}T${convertTo24Hour(endTime, endPeriod)}`);
            const existingSlot = await this.DoctorRepository.findSlot({
                doctorId,
                startTime: slotStart,
                endTime: slotEnd,
                date
            });
            if (!existingSlot) {
                const slotData = {
                    doctorId,
                    startTime: slotStart,
                    endTime: slotEnd,
                    date,
                    status: 'available'
                };
                const slot = await this.DoctorRepository.createSlot(slotData);
                slots.push(slot);
            }
        }
        return slots;
    }
    // Main method to create doctor's monthly slots
    async createDoctorMonthlySlots(doctorId, { defaultMonthlyTime, excludedDates, specificDates, weeklyDays }) {
        const { startDate, endDate, startTime, endTime, breakStart, breakEnd } = defaultMonthlyTime;
        // Generate slots for the provided date range
        let generatedSlots = await this.generateSlotsForDateRange(doctorId, startDate, endDate, startTime, endTime, breakStart, breakEnd);
        // Filter out slots that fall on excluded dates
        generatedSlots = this.filterExcludedDates(generatedSlots, excludedDates);
        // Generate slots for specific dates provided
        const specificDateSlots = await this.generateSpecificDateSlots(specificDates, doctorId);
        generatedSlots = this.mergeSlots(generatedSlots, specificDateSlots);
        // Generate weekly slots based on provided weekly days
        const weeklySlots = await this.generateWeeklySlots(doctorId, startDate, endDate, weeklyDays);
        generatedSlots = this.mergeSlots(generatedSlots, weeklySlots);
        // Save all the generated slots to the repository
        return await this.DoctorRepository.saveGeneratedSlots(doctorId, generatedSlots);
    }
    // Generate slots for the specified date range (with breaks)
    async generateSlotsForDateRange(doctorId, startDate, endDate, startTime, endTime, breakStart, breakEnd) {
        const slots = [];
        const currentDate = new Date(startDate);
        // Loop through each day in the range
        while (currentDate <= new Date(endDate)) {
            let slotStartTime = this.createDateTime(currentDate, startTime);
            const slotEndTime = this.createDateTime(currentDate, endTime);
            const breakStartTime = this.createDateTime(currentDate, breakStart);
            const breakEndTime = this.createDateTime(currentDate, breakEnd);
            // Morning slots before break time
            while (slotStartTime < breakStartTime) {
                const nextSlotEndTime = new Date(slotStartTime.getTime() + 30 * 60000); // 30-minute slot
                if (nextSlotEndTime > breakStartTime)
                    break; // Stop if the next slot overlaps with break time
                const slot = await this.createSlot(doctorId, slotStartTime, nextSlotEndTime);
                if (slot && !this.isDuplicateSlot(slots, slot))
                    slots.push(slot); // Only add if no duplicate
                slotStartTime = nextSlotEndTime; // Move to the next slot
            }
            // Resume slots after break time
            slotStartTime = breakEndTime; // Set start time to the end of the break
            while (slotStartTime < slotEndTime) {
                const nextSlotEndTime = new Date(slotStartTime.getTime() + 30 * 60000); // 30-minute slot
                if (nextSlotEndTime > slotEndTime)
                    break; // Stop if past end of working hours
                const slot = await this.createSlot(doctorId, slotStartTime, nextSlotEndTime);
                if (slot && !this.isDuplicateSlot(slots, slot))
                    slots.push(slot); // Only add if no duplicate
                slotStartTime = nextSlotEndTime; // Move to the next slot
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        return slots;
    }
    // Generate slots for specific dates
    async generateSpecificDateSlots(specificDates, doctorId) {
        const specificDateSlots = [];
        for (const dateInfo of specificDates) {
            const slotStart = this.createDateTime(new Date(dateInfo.date), dateInfo.startTime);
            const slotEnd = this.createDateTime(new Date(dateInfo.date), dateInfo.endTime);
            const slot = await this.createSlot(doctorId, slotStart, slotEnd);
            if (slot && !this.isDuplicateSlot(specificDateSlots, slot))
                specificDateSlots.push(slot);
        }
        return specificDateSlots;
    }
    // Generate weekly slots based on provided days
    async generateWeeklySlots(doctorId, startDate, endDate, weeklyDays) {
        const weeklySlots = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        while (start <= end) {
            const currentDay = start.getDay();
            for (const { day, startTime, endTime } of weeklyDays) {
                const dayNumber = this.getDayNumber(day); // Convert "Tuesday" to 2, etc.
                if (currentDay === dayNumber) {
                    const slotStart = this.createDateTime(start, startTime);
                    const slotEnd = this.createDateTime(start, endTime);
                    const slot = await this.createSlot(doctorId, slotStart, slotEnd);
                    if (slot && !this.isDuplicateSlot(weeklySlots, slot))
                        weeklySlots.push(slot);
                }
            }
            start.setDate(start.getDate() + 1); // Move to the next day
        }
        return weeklySlots;
    }
    // Helper method to create a Date object with the specified time
    createDateTime(date, time) {
        const [hours, minutes] = time.split(":").map(Number);
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }
    // Helper method to get day number (e.g., "Monday" -> 1)
    getDayNumber(day) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days.indexOf(day);
    }
    // Method to prevent duplicates and create a new slot
    async createSlot(doctorId, startTime, endTime) {
        // Check if a slot already exists for this doctor at the same time (startTime and endTime)
        const existingSlot = await Slot.findOne({
            doctorId,
            startTime,
            endTime
        });
        if (existingSlot) {
            return null; // Skip creating a duplicate slot
        }
        // If no existing slot, create a new one
        const slot = new Slot({
            doctorId,
            startTime,
            endTime,
            date: startTime,
            status: 'available',
        });
        await slot.save();
        return slot;
    }
    // Helper method to check if a slot is a duplicate
    isDuplicateSlot(slots, slot) {
        return slots.some(existingSlot => existingSlot.startTime.getTime() === slot.startTime.getTime() &&
            existingSlot.endTime.getTime() === slot.endTime.getTime());
    }
    // Method to merge default slots with additional slots (e.g., specific date or weekly)
    mergeSlots(defaultSlots, additionalSlots) {
        const mergedSlots = [...defaultSlots, ...additionalSlots];
        const uniqueSlots = mergedSlots.filter((slot, index, self) => index === self.findIndex((t) => (t.date.toString() === slot.date.toString() &&
            t.startTime.toString() === slot.startTime.toString() &&
            t.endTime.toString() === slot.endTime.toString())));
        return uniqueSlots;
    }
    // Filter out slots that fall on excluded dates
    filterExcludedDates(slots, excludedDates) {
        const excludedSet = new Set(excludedDates.map(date => new Date(date).toDateString()));
        const filteredSlots = slots.filter(slot => !excludedSet.has(slot.date.toString()));
        return filteredSlots;
    }
    //------------------------------------------------------------------------------------------------------------
    // async getSlotsForDoctor(doctorId: string, date?: string): Promise<ISlot[]> {
    //   return await DoctorRepository.findSlotsByDoctorAndDate(doctorId, date); // Fetch slots from the repository
    // }
    async getDoctorSlotsM(doctorId) {
        if (!doctorId) {
            throw new Error("Doctor ID is required to retrieve slots");
        }
        try {
            const slots = await this.DoctorRepository.getDoctorSlotsM(doctorId);
            if (!slots) {
                throw new Error("No slots found for this doctor");
            }
            return slots;
        }
        catch (error) {
            console.error('Error in getDoctorSlots service:', error);
            throw new Error('Could not retrieve doctor slots');
        }
    }
    async deleteSlot(slotId) {
        if (!slotId) {
            throw new Error("Slot ID is required for deletion");
        }
        const deletedSlot = await this.DoctorRepository.deleteSlotById(slotId);
        if (!deletedSlot) {
            throw new Error("Slot not found or already deleted");
        }
        return deletedSlot;
    }
    async AppointmentsOverView(doctorId, date) {
        return await this.DoctorRepository.AppointmentsOverViewByDoctorAndDate(doctorId, date);
    }
    async getDoctorSlotsByDate(doctorId, date) {
        return await this.DoctorRepository.getDoctorSlotsByDate(doctorId, date);
    }
    async DailyRecurringSlots(doctorId, startDate, endDate, startTime, endTime, duration, breakStart, breakEnd, excludedDates) {
        const rule = new RRule({
            freq: RRule.DAILY,
            dtstart: new Date(startDate),
            until: new Date(endDate),
        });
        let recurringDates = rule.all();
        const excludedDateStrings = excludedDates.map(date => new Date(date).toISOString().split('T')[0]);
        recurringDates = recurringDates.filter(date => !excludedDateStrings.includes(date.toISOString().split('T')[0]));
        const slotsToCreate = [];
        for (const date of recurringDates) {
            let slotStart = new Date(date);
            slotStart.setHours(startTime.hours, startTime.minutes, 0, 0);
            const slotEnd = new Date(date);
            slotEnd.setHours(endTime.hours, endTime.minutes, 0, 0);
            let breakStartDate = null;
            let breakEndDate = null;
            if (breakStart && breakEnd) {
                breakStartDate = new Date(date);
                breakEndDate = new Date(date);
                const [breakStartHour, breakStartMinute] = breakStart.split(":").map(Number);
                const [breakEndHour, breakEndMinute] = breakEnd.split(":").map(Number);
                breakStartDate.setHours(breakStartHour, breakStartMinute, 0, 0);
                breakEndDate.setHours(breakEndHour, breakEndMinute, 0, 0);
            }
            while (slotStart < slotEnd) {
                const newSlotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
                if (newSlotEnd > slotEnd) {
                    break;
                }
                if (breakStartDate && breakEndDate && slotStart >= breakStartDate && newSlotEnd <= breakEndDate) {
                    slotStart = newSlotEnd;
                    continue;
                }
                const existingSlot = await this.DoctorRepository.findSlotConflict(doctorId, slotStart, newSlotEnd);
                if (!existingSlot) {
                    const createdSlot = await this.DoctorRepository.createSlotRecurringDaily({
                        doctorId,
                        startTime: slotStart,
                        endTime: newSlotEnd,
                        date: slotStart.toISOString().split('T')[0],
                        status: 'available',
                    });
                    slotsToCreate.push(createdSlot);
                }
                else {
                }
                slotStart = newSlotEnd;
            }
        }
        return slotsToCreate;
    }
    async getPatientDetailsBySlotId(slotId) {
        try {
            const booking = await this.DoctorRepository.getPatientDetailsBySlotId(slotId);
            if (!booking) {
                return null;
            }
            const amount = await this.DoctorRepository.getAmountBySlotId(slotId);
            // Extract patient details from the populated `patientId`
            const patient = booking.patientId;
            const patientDetails = {
                patientId: patient._id,
                patientName: patient.name,
                patientContact: patient.contactNumber,
                patientEmail: patient.email,
                patientAge: patient.age,
                patientGender: patient.gender,
                patientAmount: amount,
            };
            return patientDetails;
        }
        catch (error) {
            console.error('Error fetching patient details by slot ID:', error);
            throw new Error('Failed to fetch patient details');
        }
    }
    async cancelAndRefundByDoctor(slotId, patientId, amount, startTime, reason) {
        try {
            // const cancellationReason = reason || 'Slot cancelled due to unforeseen circumstances.';
            const now = new Date();
            const hoursDifference = (new Date(startTime).getTime() - now.getTime()) / (1000 * 60 * 60);
            let refundAmount = 0;
            if (hoursDifference >= 24) {
                refundAmount = amount;
            }
            else if (hoursDifference >= 12) {
                refundAmount = amount * 0.75;
            }
            const cancellationReason = reason
                ? `${reason}.Your Appointment Scheduled on ${new Date(startTime).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString()}.has been cancelled ${refundAmount > 0
                    ? `A refund of ₹${refundAmount.toFixed(2)} has been processed.`
                    : `No refund applicable.`}`
                : `Your appointment scheduled on ${new Date(startTime).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString()} has been cancelled. ${refundAmount > 0
                    ? `A refund of ₹${refundAmount.toFixed(2)} has been processed.`
                    : `No refund applicable.`}`;
            // Update or create the wallet for the patient
            let wallet = await this.DoctorRepository.findByPatientId(patientId);
            if (!wallet)
                wallet = await this.DoctorRepository.createWallet(patientId);
            if (refundAmount > 0)
                wallet = await this.DoctorRepository.updateBalance(patientId, refundAmount);
            // Create transaction for the refund
            const transaction = await this.DoctorRepository.createTransaction({
                patientId,
                amount: refundAmount,
                type: refundAmount > 0 ? 'refund' : 'no refund',
                status: 'success',
                description: refundAmount > 0 ? `Refund for cancelled appointment` : `Cancellation without refund.`,
            });
            // Deleting the slot (appointment) after cancellation
            const deletedSlot = await this.DoctorRepository.deleteSlotById(slotId);
            if (!deletedSlot) {
                throw new Error('Slot not found or could not be deleted');
            }
            return {
                message: refundAmount > 0 ? 'Refund processed successfully.' : 'No refund applicable.',
                refundAmount,
                refundStatus: refundAmount > 0 ? 'success' : 'failed',
                cancellationReason,
                notificationMessage: `${cancellationReason}`,
            };
        }
        catch (error) {
            console.error('Error in service layer while cancelling appointment:', error);
            throw new Error('Error processing cancellation and refund.');
        }
    }
    // Create a new notification
    async createNotification(details) {
        return await NotificationModel.create({
            ...details,
            status: 'unread',
        });
    }
    async startime(slotId) {
        if (!slotId) {
            throw new Error('Slot ID is required.');
        }
        // Fetch start time from the repository
        const startTime = await this.DoctorRepository.StartTime(slotId);
        if (!startTime) {
            throw new Error(`No start time found for slot ID ${slotId}`);
        }
        // Return start time as an ISO string
        return startTime.toISOString(); // This will return the date in "2024-11-27T09:00:00.000Z" format
    }
    async addPrescription({ slotId, patientId, doctorId, prescription, }) {
        // Find the booking with the given criteria
        const booking = await this.DoctorRepository.findConfirmedBooking(slotId, patientId);
        if (!booking) {
            throw new Error('No confirmed booking found for the given criteria.');
        }
        // Serialize the prescription object to a string
        const serializedPrescription = JSON.stringify(prescription);
        // Update the prescription and status
        const updatedBooking = await this.DoctorRepository.updateBookingPrescription(booking._id.toString(), serializedPrescription);
        return updatedBooking;
    }
    async fetchCompletedBookings() {
        const bookings = await this.DoctorRepository.getCompletedBookings();
        return bookings.map((booking) => {
            const patient = booking.patientId;
            const slot = booking.slotId;
            return {
                id: booking._id.toString(),
                patientName: patient.name,
                contactNumber: patient.contactNumber,
                slotStartTime: slot.startTime, // Use lowercase as per schema
                slotEndTime: slot.endTime, // Use lowercase as per schema
                date: slot.date, // Use lowercase as per schema
            };
        });
    }
    async fetchPrescription(bookingId) {
        const prescription = await this.DoctorRepository.getPrescriptionByBookingId(bookingId);
        if (!prescription)
            throw new Error('Prescription not found');
        return prescription;
    }
    async getChatListByDoctor(doctorId) {
        try {
            // Fetch distinct patients who have interacted with the doctor
            const chatList = await this.DoctorRepository.getChatsByDoctor(doctorId);
            return chatList;
        }
        catch (error) {
            console.error('Error fetching chat list by doctor:', error);
            throw new Error('Error fetching chat list by doctor');
        }
    }
    async createWeeklyRecurringSlots(doctorId, startDate, endDate, daysConfig, excludedDates) {
        const newSlots = [];
        for (const config of daysConfig) {
            if (config.selected === undefined) {
                config.selected = true;
            }
            if (!config.selected) {
                continue;
            }
            // Generate recurring dates using RRule
            const rule = new RRule({
                freq: RRule.WEEKLY,
                dtstart: startDate,
                until: endDate,
                byweekday: config.day,
            });
            const dates = rule.all();
            for (const date of dates) {
                const slotDate = new Date(date);
                // Delete existing slots for this date
                const dateStr = slotDate.toISOString().split('T')[0];
                await this.DoctorRepository.deleteSlotsForDate(doctorId, dateStr);
                let currentStartTime = new Date(`${slotDate.toDateString()} ${config.startTime}`);
                const breakStart = config.breakStart
                    ? new Date(`${slotDate.toDateString()} ${config.breakStart}`)
                    : null;
                const breakEnd = config.breakEnd
                    ? new Date(`${slotDate.toDateString()} ${config.breakEnd}`)
                    : null;
                // Generate slots until the end time
                while (currentStartTime < new Date(`${slotDate.toDateString()} ${config.endTime}`)) {
                    let currentEndTime = new Date(currentStartTime.getTime() + config.slotDuration * 60000);
                    // Skip the slot if it falls during the break time or is excluded
                    if ((breakStart && breakEnd && currentStartTime < breakEnd && currentEndTime > breakStart) ||
                        excludedDates.includes(dateStr) ||
                        isNaN(currentStartTime.getTime()) ||
                        isNaN(currentEndTime.getTime())) {
                        currentStartTime = new Date(currentStartTime.getTime() + config.slotDuration * 60000);
                        continue;
                    }
                    // Add valid slot to the newSlots list
                    newSlots.push({
                        doctorId,
                        date: slotDate.toISOString(),
                        startTime: currentStartTime,
                        endTime: currentEndTime,
                        breakStart,
                        breakEnd,
                        status: 'available',
                    });
                    currentStartTime = new Date(currentStartTime.getTime() + config.slotDuration * 60000);
                }
            }
        }
        const savedSlots = await this.DoctorRepository.saveSlots(newSlots);
        return savedSlots;
    }
    async fetchPatientDetailsforChat(patientId) {
        if (!patientId) {
            throw new Error('Doctor ID is required');
        }
        const patientDetails = await this.DoctorRepository.fetchPatientDetailsforChat(patientId);
        if (!patientDetails) {
            throw new Error('Doctor not found');
        }
        console.log(patientDetails, 'patientDetails');
        return {
            name: patientDetails.name,
            contactNumber: patientDetails.contactNumber,
            email: patientDetails.email,
            gender: patientDetails.gender,
        };
    }
}
// export default new DoctorService();
