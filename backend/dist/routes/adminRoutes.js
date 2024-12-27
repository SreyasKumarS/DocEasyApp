// import { Router } from 'express';
// import authenticateUser from '../middleware/authMiddleware.js'
// import {
//     loginAdmin,
//     logoutAdmin,
//     verifyOtp,
//     resendOtp,
//     sendAdminResetOtp,
//     resetAdminPassword,
//     fetchUnapprovedDoctors,   
//     approveDoctor,           
//     deleteDoctor,
//     fetchPatientListing,
//     deletePatient,
//     blockDoctor,          
//     unblockDoctor,
//     fetchAllDoctors,
//     fetchDoctorProfile,
//     rejectDoctor,
//     updatePlatformFee,
//     TopRevenueDoctors,
//     getTopRatedDoctors,
//     getTopPatients,
//     getTopBookedDoctors,
//     getSpecializationsPieChart,
//     getDoctorsRevenueBarChart,
//     getReport    
// } from '../controllers/adminController.js';
// const router = Router();
// router.post('/login', loginAdmin);
// router.post('/logout', logoutAdmin);
// router.post('/verify-otpAdmin', verifyOtp);
// router.post('/resend-otp', resendOtp);
// router.post('/sendResetAdminOtp', sendAdminResetOtp);
// router.post('/resetAdminPassword', resetAdminPassword);
// router.get('/unapproved',fetchUnapprovedDoctors);
// router.put('/approve/:doctorId', authenticateUser, approveDoctor);
// router.delete('/delete/:doctorId', authenticateUser, deleteDoctor);
// router.post('/rejectDoctor/:doctorId', authenticateUser, rejectDoctor);
// router.get('/patientlisting', authenticateUser, fetchPatientListing);
// router.delete('/deletePatient/:patientId', authenticateUser, deletePatient);
// router.put('/block/:doctorId', authenticateUser, blockDoctor);     
// router.put('/unblock/:doctorId', authenticateUser, unblockDoctor);
// router.get('/fetchAllDoctors', authenticateUser, fetchAllDoctors);
// router.get('/fetchDoctorById/:doctorId',authenticateUser, fetchDoctorProfile);
// router.post('/updatePlatformFee', authenticateUser, updatePlatformFee);
// router.get('/TopRevenueDoctors', authenticateUser, TopRevenueDoctors);
// router.get('/getTopRatedDoctors', authenticateUser, getTopRatedDoctors);
// router.get('/getTopPatients', authenticateUser, getTopPatients);
// router.get('/getTopBookedDoctors', authenticateUser, getTopBookedDoctors);
// router.get('/getSpecializationsPieChart',getSpecializationsPieChart);
// router.get('/getDoctorsRevenueBarChart', getDoctorsRevenueBarChart);
// router.post('/getReport',getReport);
// export default router;
import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import authenticateUser from '../middleware/authMiddleware.js';
const router = Router();
router.post('/login', adminController.loginAdmin);
router.post('/logout', adminController.logoutAdmin);
router.post('/verify-otpAdmin', adminController.verifyOtp);
router.post('/resend-otp', adminController.resendOtp);
router.post('/sendResetAdminOtp', adminController.sendAdminResetOtp);
router.post('/resetAdminPassword', adminController.resetAdminPassword);
// Protected Routes (Require Authentication)
router.get('/unapproved', authenticateUser, adminController.fetchUnapprovedDoctors);
router.put('/approve/:doctorId', authenticateUser, adminController.approveDoctor);
router.delete('/delete/:doctorId', authenticateUser, adminController.deleteDoctor);
router.post('/rejectDoctor/:doctorId', authenticateUser, adminController.rejectDoctor);
router.get('/patientlisting', authenticateUser, adminController.fetchPatientListing);
router.delete('/deletePatient/:patientId', authenticateUser, adminController.deletePatient);
router.put('/block/:doctorId', authenticateUser, adminController.blockDoctor);
router.put('/unblock/:doctorId', authenticateUser, adminController.unblockDoctor);
router.get('/fetchAllDoctors', authenticateUser, adminController.fetchAllDoctors);
router.get('/fetchDoctorById/:doctorId', authenticateUser, adminController.fetchDoctorProfile);
router.post('/updatePlatformFee', authenticateUser, adminController.updatePlatformFee);
router.get('/TopRevenueDoctors', authenticateUser, adminController.TopRevenueDoctors);
router.get('/getTopRatedDoctors', authenticateUser, adminController.getTopRatedDoctors);
router.get('/getTopPatients', authenticateUser, adminController.getTopPatients);
router.get('/getTopBookedDoctors', authenticateUser, adminController.getTopBookedDoctors);
router.get('/getSpecializationsPieChart', adminController.getSpecializationsPieChart);
router.get('/getDoctorsRevenueBarChart', adminController.getDoctorsRevenueBarChart);
router.post('/getReport', adminController.getReport);
export default router;
