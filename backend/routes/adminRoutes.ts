






import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { AdminService } from '../services/adminServices.js';
import { AdminRepository } from '../repositories/adminRespository.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = Router();

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService);

router.post('/login', adminController.loginAdmin.bind(adminController));
router.post('/logout', adminController.logoutAdmin.bind(adminController));
router.post('/verify-otpAdmin', adminController.verifyOtp.bind(adminController));
router.post('/resend-otp', adminController.resendOtp.bind(adminController));
router.post('/sendResetAdminOtp', adminController.sendAdminResetOtp.bind(adminController));
router.post('/resetAdminPassword', adminController.resetAdminPassword.bind(adminController));

// Protected Routes (Require Authentication)
router.get('/unapproved', authenticateUser, adminController.fetchUnapprovedDoctors.bind(adminController));
router.put('/approve/:doctorId', authenticateUser, adminController.approveDoctor.bind(adminController));
router.delete('/delete/:doctorId', authenticateUser, adminController.deleteDoctor.bind(adminController));
router.post('/rejectDoctor/:doctorId', authenticateUser, adminController.rejectDoctor.bind(adminController));
router.get('/patientlisting', authenticateUser, adminController.fetchPatientListing.bind(adminController));
router.delete('/deletePatient/:patientId', authenticateUser, adminController.deletePatient.bind(adminController));

router.put('/block/:doctorId', authenticateUser, adminController.blockDoctor.bind(adminController));
router.put('/unblock/:doctorId', authenticateUser, adminController.unblockDoctor.bind(adminController));
router.get('/fetchAllDoctors', authenticateUser, adminController.fetchAllDoctors.bind(adminController));
router.get('/fetchDoctorById/:doctorId', authenticateUser, adminController.fetchDoctorProfile.bind(adminController));
router.post('/updatePlatformFee', authenticateUser, adminController.updatePlatformFee.bind(adminController));
router.get('/TopRevenueDoctors', authenticateUser, adminController.TopRevenueDoctors.bind(adminController));
router.get('/getTopRatedDoctors', authenticateUser, adminController.getTopRatedDoctors.bind(adminController));
router.get('/getTopPatients', authenticateUser, adminController.getTopPatients.bind(adminController));
router.get('/getTopBookedDoctors', authenticateUser, adminController.getTopBookedDoctors.bind(adminController));
router.get('/getSpecializationsPieChart',adminController.getSpecializationsPieChart.bind(adminController));
router.get('/getDoctorsRevenueBarChart', adminController.getDoctorsRevenueBarChart.bind(adminController));
router.post('/getReport',adminController.getReport.bind(adminController));

export default router;
