// import { Response, Request, NextFunction } from 'express';
import PatientService from '../services/patientService.js';
import mongoose from 'mongoose';
import patientService from '../services/patientService.js';
class PatientController {
    async registerPatient(req, res, next) {
        const { name, email, password, age, gender, address, locality, contactNumber, bloodGroup } = req.body;
        try {
            await PatientService.registerPatient(name, email, password, age, gender, address, locality, contactNumber, bloodGroup);
            return res.status(201).json({ message: 'OTP sent to your email' });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    // Verify OTP
    async verifyOtp(req, res, next) {
        const { email, otp } = req.body;
        try {
            await PatientService.verifyOtp(email, otp);
            return res.status(201).json({ message: 'Patient verified successfully' });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    // Resend OTP
    async resendOtp(req, res, next) {
        const { email } = req.body;
        try {
            await PatientService.resendOtp(email);
            return res.status(200).json({ message: 'OTP resent to your email' });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async loginPatient(req, res, next) {
        const { email, password } = req.body;
        try {
            const result = await PatientService.loginPatient(email, password, res);
            return res.status(200).json({
                message: 'Login successful',
                patient: result.patient,
                token: result.token,
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async googleLogin(req, res, next) {
        const { googleToken } = req.body;
        try {
            // Pass the 'res' object to the PatientService.googleLogin method
            const result = await PatientService.googleLogin(googleToken, res);
            return res.status(200).json({
                message: 'Google login successful',
                token: result.token,
                patient: result.patient,
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    // Logout Patient
    async logoutPatient(req, res, next) {
        try {
            await PatientService.logoutPatient(res);
            return res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            next(error);
        }
    }
    async sendResetOtp(req, res, next) {
        const { email } = req.body;
        try {
            await PatientService.sendResetOtp(email);
            return res.status(200).json({ message: 'OTP sent to your email' });
        }
        catch (error) {
            console.error('Error in resendOtp controller:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                return res.status(500).json({ message: error.message });
            }
            else {
                console.error('Unknown error in resendOtp controller:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }
    ;
    async resetPassword(req, res, next) {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        try {
            await PatientService.resetPassword(email, newPassword);
            return res.status(200).json({ message: 'Password reset successful' });
        }
        catch (error) {
            console.error('Error resetting password:', error);
            next(error);
        }
    }
    ;
    async getPatientDetails(req, res, next) {
        const { patientId } = req.params;
        try {
            const patientDetails = await PatientService.getPatientDetails(patientId);
            if (!patientDetails) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            return res.status(200).json(patientDetails);
        }
        catch (error) {
            next(error);
        }
    }
    async patientProfileEdit(req, res, next) {
        const { patientId } = req.params;
        const updatedData = req.body;
        try {
            const updatedPatient = await PatientService.PatientProfileEdit(patientId, updatedData);
            return res.status(200).json(updatedPatient);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getSpecializations(req, res, next) {
        try {
            const specializations = await PatientService.getSpecializations();
            return res.status(200).json({ specializations });
        }
        catch (error) {
            console.error('Error fetching specializations:', error);
            next(error); // Pass error to error-handling middleware
        }
    }
    ;
    async getDoctorsBySpecialization(req, res, next) {
        const { specialization } = req.params;
        try {
            const doctors = await PatientService.getDoctorsBySpecialization(specialization);
            return res.status(200).json({ doctors });
        }
        catch (error) {
            console.error('Error fetching doctors:', error);
            next(error);
        }
    }
    ;
    async getSlots(req, res, next) {
        const { doctorId, date } = req.params;
        if (!doctorId || !date) {
            return res.status(400).json({ error: 'doctorId and date are required.' });
        }
        try {
            const slots = await PatientService.fetchSlots(doctorId, date);
            return res.status(200).json({ slots });
        }
        catch (error) {
            console.error('Error fetching slots:', error);
            next(error);
        }
    }
    ;
    async getNearbyDoctors(req, res, next) {
        const { patientId } = req.params;
        const radius = parseFloat(req.query.radius) || 100;
        try {
            const doctors = await PatientService.getNearbyDoctors(patientId, radius);
            return res.status(200).json({ success: true, doctors });
        }
        catch (error) {
            console.error("Error fetching nearby doctors:", error);
            next(error);
        }
    }
    ;
    async search(req, res, next) {
        const { search, specialization, locality, page = 1, limit = 10 } = req.query;
        try {
            const result = await PatientService.searchDoctors(search, specialization, locality, Number(page), Number(limit));
            return res.status(200).json({ success: true, result });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async createOrder(req, res, next) {
        const { slotId, amount } = req.body;
        try {
            const order = await PatientService.createOrder(slotId, amount);
            return res.status(201).json({ success: true, orderId: order.id, amount: order.amount });
        }
        catch (error) {
            console.error('Error creating order:', error);
            next(error);
        }
    }
    ;
    async confirmPayment(req, res, next) {
        const { paymentId, orderId, slotId, doctorId, patientId, totalAmount, adminFee, consultationFee } = req.body;
        try {
            await PatientService.handlePaymentSuccess(paymentId, orderId, slotId, doctorId, patientId, totalAmount, adminFee, consultationFee);
            return res.status(200).json({ success: true, message: 'Payment successful, booking confirmed!' });
        }
        catch (error) {
            console.error('Error confirming payment:', error);
            next(error);
        }
    }
    ;
    async getBookedAppointments(req, res, next) {
        const { patientId } = req.params;
        try {
            const bookings = await PatientService.getPatientBookings(patientId);
            return res.status(200).json({ appointments: bookings });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async cancelAppointment(req, res, next) {
        const { slotId, patientId, amount, startTime } = req.body; // Ensure amount is sent in the request
        try {
            // Call service to handle the cancellation and refund
            const result = await PatientService.cancelAndRefund(slotId, patientId, amount, startTime);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('Error cancelling appointment and processing refund:', error);
            next(error);
        }
    }
    ;
    async createWalletRechargeOrder(req, res, next) {
        const { patientId, amount } = req.body;
        try {
            // Call the service to create the Razorpay order
            const order = await PatientService.createWalletRechargeOrder(patientId, amount);
            return res.status(201).json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                patientId,
            });
        }
        catch (error) {
            console.error("Error in controller while processing wallet recharge:", error);
            next(error);
        }
    }
    ;
    async rechargeWallet(req, res, next) {
        const { patientId, amount } = req.body;
        try {
            const wallet = await PatientService.rechargeWallet(patientId, amount);
            return res.status(200).json({ message: 'Wallet recharged successfully.', wallet });
        }
        catch (error) {
            console.error('Error recharging wallet:', error);
            next(error);
        }
    }
    ;
    async getWalletDetails(req, res, next) {
        const { patientId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        try {
            const data = await PatientService.getWalletDetails(patientId, page, limit);
            return res.status(200).json(data);
        }
        catch (error) {
            console.error('Error fetching wallet details:', error);
            next(error);
        }
    }
    ;
    async getPlatformFee(req, res, next) {
        try {
            const platformFee = await PatientService.fetchPlatformFee();
            if (!platformFee) {
                return res.status(404).json({ message: 'Platform fee configuration not found' });
            }
            return res.status(200).json(platformFee);
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getConsultationFee(req, res, next) {
        try {
            const { doctorId } = req.params; // Extract doctorId from request parameters
            const consultationFee = await PatientService.fetchConsultationFee(doctorId);
            if (!consultationFee) {
                return res.status(404).json({ message: 'Consultation fee not found for this doctor' });
            }
            return res.status(200).json({ consultationFee });
        }
        catch (error) {
            console.error('Error fetching consultation fee:', error);
            next(error); // Pass error to error-handling middleware
        }
    }
    ;
    async confirmWalletPayment(req, res, next) {
        const { patientId, slotId, doctorId, totalAmount, adminFee, consultationFee } = req.body;
        try {
            await PatientService.handleWalletPaymentSuccess(patientId, slotId, doctorId, totalAmount, adminFee, consultationFee);
            return res.status(200).json({ success: true, message: 'Payment successful, booking confirmed!' });
        }
        catch (error) {
            console.error('Error confirming wallet payment:', error);
            next(error);
        }
    }
    ;
    async getNotifications(req, res) {
        try {
            const { patientId } = req.params;
            if (!patientId) {
                return res.status(400).json({ error: 'Patient ID is required' });
            }
            const notifications = await PatientService.getNotificationsByPatientId(patientId);
            const unreadCount = notifications.filter(notification => notification.status === 'unread').length;
            res.status(200).json({ notifications, unreadCount });
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
    ;
    async updateNotificationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedNotification = await PatientService.updateNotificationReadStatus(id, status);
            res.status(200).json(updatedNotification);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update notification status' });
        }
    }
    ;
    async getDoctorDetailsForPatient(req, res) {
        try {
            const { doctorId } = req.params;
            const doctor = await PatientService.getDoctorDetailsForPatient(doctorId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            return res.status(200).json(doctor);
        }
        catch (error) {
            console.error('Error fetching doctor details:', error);
            return res.status(500).json({});
        }
    }
    async getReviews(req, res) {
        const doctorId = req.params.doctorId;
        try {
            const reviews = await PatientService.getReviewsByDoctor(doctorId);
            res.status(200).json(reviews);
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    ;
    // Submit a new review
    async submitReview(req, res) {
        const { doctorId, patientName, comment, rating } = req.body;
        try {
            // Check if the doctor exists
            const doctorExists = await PatientService.getReviewsByDoctor(doctorId);
            if (!doctorExists) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            // Create and save the review
            const newReview = await PatientService.submitReview(doctorId, patientName, comment, rating);
            res.status(201).json(newReview);
        }
        catch (error) {
            console.error('Error submitting review:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    ;
    async getDoctorAverageRating(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const objectId = new mongoose.Types.ObjectId(doctorId);
            if (!doctorId) {
                res.status(400).json({ message: 'Doctor ID is required' });
                return;
            }
            const averageRating = await PatientService.getDoctorAverageRating(objectId);
            if (averageRating !== null) {
                res.status(200).json({ doctorId, averageRating });
            }
            else {
                res.status(404).json({ message: 'No reviews found for the doctor' });
            }
        }
        catch (error) {
            console.error('Error fetching average rating:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
    ;
    async getDoctorAverageRatingformultipleDoctors(req, res) {
        try {
            const doctorIds = req.params.doctorId.split(',').map((id) => new mongoose.Types.ObjectId(id));
            if (doctorIds.length === 0) {
                res.status(400).json({ message: 'Doctor IDs are required' });
                return;
            }
            const averageRatings = await PatientService.getDoctorAverageRatingformultipleDoctors(doctorIds);
            res.status(200).json({ averageRatings });
        }
        catch (error) {
            console.error('Error fetching average rating:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
    ;
    async getBookingDetailsforSuccessPage(req, res, next) {
        try {
            const { slotId } = req.params; // Extract slotId from request params
            const bookingDetails = await patientService.getBookingDetailsforSuccessPage(slotId);
            if (!bookingDetails) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(bookingDetails);
        }
        catch (error) {
            console.error('Error fetching booking details:', error);
            next(error);
        }
    }
    ;
    async getAppointmentHistory(req, res, next) {
        const { patientId } = req.params;
        ;
        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }
        try {
            const appointmentHistory = await patientService.getAppointmentHistoryForPatient(patientId);
            res.status(200).json({ success: true, data: appointmentHistory });
        }
        catch (error) {
            console.error('Error fetching appointment history:', error);
            res.status(500).json({ success: false, message: 'Error fetching appointment history' });
        }
    }
    ;
    async sendMessage(data) {
        const { patientId, doctorId, message, sender } = data;
        try {
            const newMessage = await patientService.sendMessage(patientId, doctorId, message, sender);
            return newMessage;
        }
        catch (err) {
            console.error('Error sending message:', err);
            throw new Error('Error sending message');
        }
    }
    ;
    async getChatHistory(req, res) {
        const { patientId, doctorId } = req.params;
        try {
            const chatHistory = await patientService.getChatHistory(patientId, doctorId);
            return res.status(200).json(chatHistory);
        }
        catch (err) {
            console.error('Error fetching chat history:', err);
            return res.status(500).json({ message: 'Error fetching chat history' });
        }
    }
    ;
    async fetchDoctorDetailsforChat(req, res) {
        try {
            const { doctorId } = req.params;
            const doctorDetails = await PatientService.fetchDoctorDetailsforChat(doctorId);
            return res.status(200).json({
                success: true,
                data: doctorDetails,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
            });
        }
    }
}
export default new PatientController();
