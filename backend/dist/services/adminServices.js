// import { Response } from 'express';
// import bcrypt from 'bcryptjs';
// import sendEmail from '../utils/sendEmail.js';
// import AdminRepository from '../repositories/adminRespository.js';
// import { generateAdminAccessToken, generateAdminRefreshToken } from '../utils/adminGenerateToken.js';
// import { IDoctor } from '../models/doctor.js'; 
// import { log } from 'console';
// import path from 'path';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';
import { generateAdminAccessToken, generateAdminRefreshToken } from '../utils/adminGenerateToken.js';
export class AdminService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async verifyOtp(email, otp) {
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Admin not found');
        }
        if (admin.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        if (admin.otpExpires && admin.otpExpires < new Date()) {
            throw new Error('OTP expired');
        }
        admin.isVerified = true;
        await this.adminRepository.updateAdmin(admin);
    }
    async resendOtp(email) {
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Admin not found');
        }
        if (admin.isVerified) {
            throw new Error('Admin already verified');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.adminRepository.updateAdmin(admin);
        await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
    }
    async loginAdmin(email, password, res) {
        try {
            // Fetch the admin by email from the database
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                console.error('Admin not found:', email);
                throw new Error('Invalid email or password');
            }
            // Check if password matches
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                console.error('Password mismatch for admin:', email);
                throw new Error('Invalid email or password');
            }
            // Check if admin email is verified
            if (!admin.isVerified) {
                console.error('Admin is not verified:', email);
                throw new Error('Please verify your email before logging in.');
            }
            // Generate the access token (short-lived) and refresh token (long-lived)
            let accessToken;
            try {
                accessToken = generateAdminAccessToken(admin._id.toString()); // Generate access token for the admin
                generateAdminRefreshToken(res, admin._id.toString()); // Generate and store refresh token in a cookie
                console.log("Access token generated:", accessToken);
            }
            catch (err) {
                console.error("Error generating tokens:", err);
                throw new Error("Could not generate tokens");
            }
            // Return the admin details and the access token
            return {
                admin: {
                    id: admin._id.toString(),
                    email: admin.email,
                    isVerified: admin.isVerified,
                },
                token: accessToken, // Return the generated access token
            };
        }
        catch (error) {
            console.error('Error during admin login:', error);
            throw error; // Re-throw error for controller to handle
        }
    }
    async logoutAdmin(res) {
        console.log('entrdd logot srvccccccccccccc');
        res.clearCookie('adminRefreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Immediately expire the cookie
        });
        console.log('Admin logged out and refresh token cleared.');
    }
    catch(error) {
        console.error('Error logging out admin:', error);
        throw new Error('Logout failed');
    }
    async sendResetOtp(email) {
        try {
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                console.error('Admin not found for email:', email);
                throw new Error('Admin not found');
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            admin.otp = otp;
            admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await this.adminRepository.updateAdmin(admin);
            await sendEmail(email, 'OTP Verification', `Your new OTP is ${otp}`);
        }
        catch (error) {
            console.error('Error in sendResetOtp for admin:', error);
            throw new Error('Internal server error');
        }
    }
    async resetPassword(email, newPassword) {
        try {
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error('Admin not found');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            admin.password = hashedPassword;
            await admin.save();
        }
        catch (error) {
            console.error('Error in resetPassword for admin:', error);
            throw new Error('Internal server error');
        }
    }
    // Fetch unapproved doctors----------------------------------------------------------------
    async fetchUnapprovedDoctors() {
        try {
            const unapprovedDoctors = await this.adminRepository.findUnapprovedDoctors();
            return unapprovedDoctors;
        }
        catch (error) {
            console.error('Error fetching unapproved doctors:', error);
            throw new Error('Internal server error');
        }
    }
    async approveDoctor(doctorId) {
        try {
            const doctor = await this.adminRepository.findDoctorById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            doctor.isApproved = true;
            await this.adminRepository.updateDoctor(doctor);
        }
        catch (error) {
            console.error('Error approving doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async deleteDoctor(doctorId) {
        try {
            const doctor = await this.adminRepository.findDoctorById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            await this.adminRepository.deleteDoctor(doctorId);
        }
        catch (error) {
            console.error('Error rejecting (deleting) doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async fetchPatientListing() {
        try {
            const unapprovedDoctors = await this.adminRepository.findPatients();
            return unapprovedDoctors;
        }
        catch (error) {
            console.error('Error fetching unapproved doctors:', error);
            throw new Error('Internal server error');
        }
    }
    async deletePatient(patientId) {
        try {
            const patient = await this.adminRepository.findPatientById(patientId);
            if (!patient) {
                throw new Error('Patient not found');
            }
            await this.adminRepository.deletePatient(patientId);
        }
        catch (error) {
            console.error('Error rejecting (deleting) patient:', error);
            throw new Error('Internal server error');
        }
    }
    async blockDoctor(doctorId) {
        try {
            const doctor = await this.adminRepository.findDoctorById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            doctor.isApproved = false; // Block the doctor
            await this.adminRepository.updateDoctor(doctor);
        }
        catch (error) {
            console.error('Error blocking doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async unblockDoctor(doctorId) {
        try {
            const doctor = await this.adminRepository.findDoctorById(doctorId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            doctor.isApproved = true; // Unblock the doctor
            await this.adminRepository.updateDoctor(doctor);
        }
        catch (error) {
            console.error('Error unblocking doctor:', error);
            throw new Error('Internal server error');
        }
    }
    async fetchAllDoctors() {
        try {
            const doctors = await this.adminRepository.findAllDoctors();
            return doctors;
        }
        catch (error) {
            console.error('Error fetching all doctors:', error);
            throw new Error('Internal server error');
        }
    }
    async fetchDoctorById(doctorId) {
        try {
            const doctor = await this.adminRepository.findDoctorById(doctorId);
            return doctor;
        }
        catch (error) {
            console.error('Error fetching doctor by ID:', error);
            throw new Error('Internal server error');
        }
    }
    async rejectDoctor(doctorId, reason) {
        const doctor = await this.adminRepository.findDoctorById(doctorId);
        if (!doctor)
            throw new Error('Doctor not found');
        // Send rejection email using the correct parameters
        await sendEmail(doctor.email, // to
        'Application Rejection', // subject
        `Your application has been rejected for the following reason: ${reason}` // text
        );
        // Delete the doctor after sending the email
        await this.adminRepository.deleteDoctor(doctorId);
    }
    async updatePlatformFee(percentageFee, fixedFee) {
        try {
            // Validation to ensure only one value is provided
            if (percentageFee !== null && fixedFee !== null) {
                throw new Error('Please provide only one: either percentage or fixed money value.');
            }
            if (percentageFee === null && fixedFee === null) {
                throw new Error('Please provide at least one: percentage or fixed money value.');
            }
            // Delegate the update operation to the repository
            const updatedAdmin = await this.adminRepository.updatePlatformFee({ percentageFee, fixedFee });
            return updatedAdmin;
        }
        catch (error) {
            console.error('Error in service layer:', error);
            throw new Error('Internal server error while updating platform fee.');
        }
    }
    async getTopRevenueDoctor(page, limit) {
        return await this.adminRepository.getTopRevenueDoctor(page, limit);
    }
    async getTopRatedDoctors(page, limit) {
        try {
            // Fetch the doctors and their average ratings
            const doctorsWithRatings = await this.adminRepository.getDoctorsWithRatings();
            // Calculate the average rating for each doctor
            const doctorsWithAverageRatings = doctorsWithRatings.map(doctor => {
                const totalRatings = doctor.reviews.length;
                const sumRatings = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
                doctor.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0; // Avoid division by zero
                return doctor;
            });
            // Sort by average rating in descending order
            const sortedDoctors = doctorsWithAverageRatings.sort((a, b) => b.averageRating - a.averageRating);
            // Implement pagination
            const paginatedDoctors = sortedDoctors.slice((page - 1) * limit, page * limit);
            const totalCount = sortedDoctors.length;
            return {
                data: paginatedDoctors,
                totalCount: totalCount
            };
        }
        catch (error) {
            console.error("Error in getTopRatedDoctors:", error);
            throw new Error('Error fetching top-rated doctors');
        }
    }
    async fetchTopPatients(page, limit) {
        return await this.adminRepository.getTopPatients(page, limit);
    }
    async fetchTopBookedDoctors(page, limit) {
        return await this.adminRepository.getTopBookedDoctors(page, limit);
    }
    ;
    // Service
    async getSpecializationsPieChart() {
        // Get aggregated data from repository
        const revenueData = await this.adminRepository.getRevenueBySpecialization();
        // Prepare response format
        const labels = revenueData.map((item) => item.specialization || 'Unknown');
        const data = revenueData.map((item) => item.totalRevenue);
        return { labels, data };
    }
    async getDoctorsRevenueBarChart() {
        const revenueData = await this.adminRepository.getDoctorsRevenueBarChart();
        const labels = revenueData.map((item) => item.doctorName);
        const data = revenueData.map((item) => item.totalRevenue);
        return { labels, data };
    }
    async generateReport(rangeType, startDate, endDate) {
        const filters = { rangeType, startDate, endDate };
        return await this.adminRepository.getReport(filters);
    }
}
// export default new AdminService();
// const adminService= new AdminService(new AdminService());
// export default AdminService
