// import { Response, Request, NextFunction } from 'express';
// import DoctorService from '../services/doctorServices.js';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import patientService from '../services/patientService.js';
// import doctorServices from '../services/doctorServices.js';
// import { io } from '../server.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { io } from '../server.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class DoctorController {
    DoctorService;
    constructor(doctorService) {
        this.DoctorService = doctorService;
    }
    // async registerDoctor(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //   const {
    //     name,
    //     email,
    //     password,
    //     specialization,
    //     licenseNumber,
    //     contactNumber,   
    //     experience,      
    //     clinicAddress,
    //     locality,   
    //     biography,
    //     consultationFee       
    //   } = req.body;
    // const files = req.files as MulterFiles;
    //   const medicalLicense = files.licenseFile
    //     ? `doctorFiles/${path.basename(files.licenseFile[0].path)}`
    //     : null;
    //   const idProof = files.idProof
    //     ? `doctorFiles/${path.basename(files.idProof[0].path)}`
    //     : null;
    //   const profilePicture = files.profilePicture
    //     ? `doctorFiles/${path.basename(files.profilePicture[0].path)}`
    //     : null;
    //   try {
    //     if (!name || !email || !password || !specialization || !licenseNumber || !medicalLicense 
    //       || !idProof || !profilePicture ||!contactNumber || !experience || !clinicAddress || !locality || !consultationFee ||
    //         !biography) {
    //       console.error('Missing required fields');
    //       return res.status(400).json({ message: 'All fields are required' });
    //     }
    //     await DoctorService.registerDoctor(
    //       name,
    //       email,
    //       password,
    //       specialization,
    //       licenseNumber,
    //       medicalLicense,
    //       contactNumber,
    //       experience,
    //       clinicAddress,
    //       locality,
    //       biography,
    //       idProof,
    //       profilePicture,
    //       consultationFee  
    //     );
    //     return res.status(201).json({ message: 'OTP sent to your email' });
    //   } catch (error) {
    //     console.error('Error during registration:', error);
    //     next(error);
    //   }
    // };
    async registerDoctor(req, res, next) {
        const { name, email, password, specialization, licenseNumber, contactNumber, experience, clinicAddress, locality, biography, consultationFee, } = req.body;
        const files = req.files;
        const medicalLicense = files.licenseFile
            ? files.licenseFile[0].location // S3 URL provided by multer-s3
            : null;
        const idProof = files.idProof
            ? files.idProof[0].location // S3 URL provided by multer-s3
            : null;
        const profilePicture = files.profilePicture
            ? files.profilePicture[0].location // S3 URL provided by multer-s3
            : null;
        try {
            if (!name ||
                !email ||
                !password ||
                !specialization ||
                !licenseNumber ||
                !medicalLicense ||
                !idProof ||
                !profilePicture ||
                !contactNumber ||
                !experience ||
                !clinicAddress ||
                !locality ||
                !consultationFee ||
                !biography) {
                console.error('Missing required fields');
                return res.status(400).json({ message: 'All fields are required' });
            }
            await this.DoctorService.registerDoctor(name, email, password, specialization, licenseNumber, medicalLicense, contactNumber, experience, clinicAddress, locality, biography, idProof, profilePicture, consultationFee);
            return res.status(201).json({ message: 'OTP sent to your email' });
        }
        catch (error) {
            console.error('Error during registration:', error);
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        const { email, otp } = req.body;
        try {
            await this.DoctorService.verifyOtp(email, otp);
            return res.status(201).json({ message: 'Doctor verified successfully' });
        }
        catch (error) {
            console.error('Error during OTP verification:', error);
            next(error);
        }
    }
    ;
    async resendOtp(req, res, next) {
        const { email } = req.body;
        try {
            await this.DoctorService.resendOtp(email);
            return res.status(200).json({ message: 'OTP resent to your email' });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async loginDoctor(req, res, next) {
        const { email, password } = req.body;
        try {
            const result = await this.DoctorService.loginDoctor(email, password, res);
            return res.status(200).json({
                message: 'Login successful',
                doctor: result.doctor,
                token: result.token,
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async logoutDoctor(req, res, next) {
        try {
            await this.DoctorService.logoutDoctor(res);
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async sendDoctorResetOtp(req, res, next) {
        const { email } = req.body;
        try {
            await this.DoctorService.sendResetOtp(email);
            return res.status(200).json({ message: 'OTP sent to your email' });
        }
        catch (error) {
            console.error('Error in sendDoctorResetOtp controller:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                return res.status(500).json({ message: error.message });
            }
            else {
                console.error('Unknown error in sendDoctorResetOtp controller:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    ;
    async resetDoctorPassword(req, res, next) {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        try {
            await this.DoctorService.resetPassword(email, newPassword);
            return res.status(200).json({ message: 'Password reset successful' });
        }
        catch (error) {
            console.error('Error resetting doctor password:', error);
            next(error);
        }
    }
    ;
    async fetchDoctorProfile(req, res, next) {
        try {
            const { doctorId } = req.params;
            if (!doctorId) {
                return res.status(400).json({ error: 'Doctor ID is required' });
            }
            const doctor = await this.DoctorService.fetchDoctorById(doctorId);
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            return res.status(200).json(doctor);
        }
        catch (error) {
            console.error('Error fetching doctor by ID:', error);
            next(error);
        }
    }
    ;
    async updateDoctorProfile(req, res, next) {
        try {
            const { doctorId } = req.params;
            const updateData = req.body;
            const updatedDoctor = await this.DoctorService.updateDoctor(doctorId, updateData);
            return res.status(200).json(updatedDoctor);
        }
        catch (error) {
            console.error('Error updating doctor profile:', error);
            next(error);
        }
    }
    ;
    async DailySlots(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { date, startHour, endHour, slotDuration } = req.body;
            const slots = await this.DoctorService.DailySlots(doctorId, date, startHour, endHour, slotDuration);
            return res.status(201).json(slots);
        }
        catch (error) {
            console.error('Error creating slots:', error);
            next(error);
        }
    }
    ;
    //-------------------------------------------------------------------------------------------------------
    async createDoctorMonthlySlots(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { defaultMonthlyTime, excludedDates, specificDates, weeklyDays } = req.body;
            const slots = await this.DoctorService.createDoctorMonthlySlots(doctorId, {
                defaultMonthlyTime,
                excludedDates: excludedDates || [],
                specificDates: specificDates || [],
                weeklyDays: weeklyDays || []
            });
            return res.status(200).json({ slots });
        }
        catch (error) {
            console.error("Error in createDoctorMonthlySlots controller:", error);
            next(error);
        }
    }
    ;
    async getDoctorSlotsM(req, res) {
        const { doctorId } = req.params;
        try {
            // Fetch all slots for the specified doctor
            const slots = await this.DoctorService.getDoctorSlotsM(doctorId);
            res.status(200).json(slots);
        }
        catch (error) {
            console.error('Error in getDoctorSlots controller:', error);
            res.status(500).json({ message: 'Failed to fetch slots', error });
        }
    }
    ;
    async deleteSlot(req, res, next) {
        try {
            const { slotId } = req.params;
            const deletedSlot = await this.DoctorService.deleteSlot(slotId);
            return res.status(200).json({
                message: 'Slot deleted successfully',
                slot: deletedSlot,
            });
        }
        catch (error) {
            console.error('Error deleting slot:', error);
            return res.status(400).json({});
        }
    }
    ;
    async AppointmentsOverView(req, res, next) {
        try {
            const doctorId = req.params.doctorId;
            const { date } = req.query;
            const slots = await this.DoctorService.AppointmentsOverView(doctorId, date);
            res.status(200).json(slots);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getDoctorSlotsByDate(req, res, next) {
        try {
            const doctorId = req.params.doctorId;
            const { date } = req.query;
            const slots = await this.DoctorService.getDoctorSlotsByDate(doctorId, date);
            res.status(200).json(slots);
        }
        catch (error) {
            next(error);
        }
    }
    async DailyRecurringSlots(req, res, next) {
        try {
            const { doctorId, startDate, endDate, startTime, endTime, duration, breakStart, breakEnd, excludedDates } = req.body;
            // Validate required fields
            if (!doctorId || !startDate || !endDate || !startTime || !endTime || !duration) {
                return res.status(400).json({ message: "All required fields must be provided." });
            }
            // Parse startTime and endTime into { hours, minutes }
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            const [endHours, endMinutes] = endTime.split(":").map(Number);
            // Create slots using the service
            const slots = await this.DoctorService.DailyRecurringSlots(doctorId, startDate, endDate, { hours: startHours, minutes: startMinutes }, { hours: endHours, minutes: endMinutes }, duration, breakStart, breakEnd, excludedDates);
            res.status(201).json({ message: "Slots created successfully.", slots });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error. Please try again." });
        }
    }
    ;
    async getPatientDetails(req, res, next) {
        const { slotId } = req.params;
        try {
            if (!slotId) {
                return res.status(400).json({ message: 'Slot ID is required' });
            }
            const patientDetails = await this.DoctorService.getPatientDetailsBySlotId(slotId);
            if (!patientDetails) {
                return res.status(404).json({ message: 'Patient details not found' });
            }
            return res.status(200).json(patientDetails);
        }
        catch (error) {
            console.error('Error fetching patient details:', error);
            next(error);
        }
    }
    ;
    async cancelAppointmentByDoctor(req, res, next) {
        const { slotId, patientId, doctorId, amount, reason } = req.body;
        try {
            const startTime = await this.DoctorService.startime(slotId);
            const result = await this.DoctorService.cancelAndRefundByDoctor(slotId, patientId, amount, startTime, reason);
            await this.DoctorService.createNotification({
                patientId,
                doctorId,
                type: 'appointment',
                message: result.notificationMessage,
                refundAmount: result.refundAmount,
                refundStatus: result.refundStatus,
                reason: result.cancellationReason,
            });
            // Emit the cancellation event to relevant clients (e.g., the patient or doctor)
            io.emit('appointmentCanceled', {
                patientId,
                doctorId,
                message: result.notificationMessage,
                refundAmount: result.refundAmount,
                status: result.refundStatus,
            });
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('Error cancelling appointment:', error);
            next(error);
        }
    }
    ;
    async addPrescription(req, res, next) {
        try {
            const { slotId, patientId, doctorId, diagnosis, medications, additionalNotes } = req.body;
            const prescription = {
                diagnosis,
                medications,
                additionalNotes,
            };
            const result = await this.DoctorService.addPrescription({ slotId, patientId, doctorId, prescription });
            res.status(200).json({
                message: 'Prescription added successfully.',
                booking: result,
            });
        }
        catch (error) {
            console.error('Error adding prescription:');
        }
    }
    ;
    async getCompletedBookings(req, res, next) {
        try {
            const completedBookings = await this.DoctorService.fetchCompletedBookings();
            res.status(200).json(completedBookings);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getPrescription(req, res, next) {
        try {
            const { bookingId } = req.params;
            const prescription = await this.DoctorService.fetchPrescription(bookingId);
            res.status(200).json(prescription);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getChatList(req, res, next) {
        try {
            const { doctorId } = req.params; // Assuming doctor authentication is handled, and ID is in req.user
            const chatList = await this.DoctorService.getChatListByDoctor(doctorId);
            res.status(200).json(chatList);
        }
        catch (error) {
            console.error('Error fetching chat list:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ;
    async createWeeklyRecurringSlots(req, res) {
        const { doctorId, startDate, endDate, daysConfig, excludedDates, slotDuration } = req.body;
        try {
            const slots = await this.DoctorService.createWeeklyRecurringSlots(doctorId, new Date(startDate), new Date(endDate), daysConfig, excludedDates);
            return res.status(200).json({ message: "Slots created successfully", slots });
        }
        catch (error) {
            console.error("Error creating slots:", error);
            return res.status(500).json({ message: "Failed to create slots", error });
        }
    }
    ;
    async fetchPatientDetailsforChat(req, res) {
        try {
            const { patientId } = req.params;
            const patientDetails = await this.DoctorService.fetchPatientDetailsforChat(patientId);
            return res.status(200).json({
                success: true,
                data: patientDetails,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
            });
        }
    }
}
