// import { Router } from 'express';
// import authenticateUser from '../middleware/authMiddleware.js'
// import {
//     registerPatient,
//     verifyOtp,
//     resendOtp,
//     loginPatient,
//     logoutPatient,
//     sendResetOtp,
//     resetPassword,
//     getPatientDetails,
//     PatientProfileEdit,
//     getSpecializations,
//     getDoctorsBySpecialization,
//     getSlots,
//     googleLogin,
//     getNearbyDoctors,
//     search,
//     createOrder,
//     confirmPayment,
//     getBookedAppointments,
//     cancelAppointment,
//     createWalletRechargeOrder,
//     rechargeWallet,
//     confirmWalletPayment,
//     getWalletDetails,
//     getPlatformFee,
//     getConsultationFee,
//     getNotifications,
//     updateNotificationStatus,
//     getDoctorDetailsForPatient,
//     submitReview,
//     getReviews,
//     getDoctorAverageRating,
//     getDoctorAverageRatingformultipleDoctors, 
//     getBookingDetailsforSuccessPage,
//     getAppointmentHistory,
//     getChatHistory

   
// } from '../controllers/patientController.js';


// const router = Router();
// router.post('/register', registerPatient);
// router.post('/verify-otp', verifyOtp);
// router.post('/resend-otp', resendOtp);
// router.post('/login', loginPatient);
// router.post('/logout', logoutPatient);
// router.post('/sendResetOtp', sendResetOtp);
// router.post('/ResetPassword',resetPassword);

// router.get('/getPatientDetails/:patientId',authenticateUser,getPatientDetails);
// router.put('/PatientProfileEdit/:patientId',authenticateUser,PatientProfileEdit)
// router.get('/specializations',authenticateUser, getSpecializations);
// router.get('/getDoctorsBySpecialization/:specialization',authenticateUser,getDoctorsBySpecialization);
// router.get('/getSlots/:doctorId/:date',authenticateUser, getSlots);
// router.post('/googlelogin',googleLogin);
// router.get('/getNearbyDoctors/:patientId',getNearbyDoctors);
// router.get('/search',authenticateUser,search);
// router.post('/createOrder',authenticateUser,createOrder);
// router.post('/confirmPayment',authenticateUser, confirmPayment); 
// router.get('/getBookedAppointments/:patientId',authenticateUser,getBookedAppointments);
// router.put('/cancelAppointment',authenticateUser, cancelAppointment);
// router.post('/createWalletRechargeOrder',authenticateUser, createWalletRechargeOrder);
// router.post('/rechargeWallet',authenticateUser, rechargeWallet);
// router.post('/confirmWalletPayment',authenticateUser, confirmWalletPayment);
// router.get('/getWalletDetails/:patientId',authenticateUser,getWalletDetails);
// router.get('/getPlatformFee',getPlatformFee);
// router.get('/getConsultationFee/:doctorId',getConsultationFee );
// router.get('/getNotifications/:patientId', getNotifications );
// router.put('/updateNotificationStatus/:id', updateNotificationStatus );
// router.get('/getDoctorDetailsForPatient/:doctorId',authenticateUser,getDoctorDetailsForPatient);
// router.post('/submitReview',authenticateUser, submitReview);
// router.get('/getReviews/:doctorId',authenticateUser,getReviews);
// router.get('/getDoctorAverageRating/:doctorId',getDoctorAverageRating);
// router.get('/getDoctorAverageRatingformultipleDoctors/:doctorId',getDoctorAverageRatingformultipleDoctors );
// router.get('/getBookingDetailsforSuccessPage/:slotId',authenticateUser,getBookingDetailsforSuccessPage);
// router.get('/getAppointmentHistory/:patientId',authenticateUser,getAppointmentHistory);
// router.get('/getChatHistory/:doctorId/:patientId',getChatHistory);



// export default router;











import { Router } from 'express';
import authenticateUser from '../middleware/authMiddleware.js'
import patientController from '../controllers/patientController.js';


const router = Router();
router.post('/register', patientController.registerPatient);
router.post('/verify-otp', patientController.verifyOtp);
router.post('/resend-otp', patientController.resendOtp);
router.post('/login', patientController.loginPatient);
router.post('/logout', patientController.logoutPatient);
router.post('/sendResetOtp', patientController.sendResetOtp);
router.post('/ResetPassword',patientController.resetPassword);

router.get('/getPatientDetails/:patientId',authenticateUser,patientController.getPatientDetails);
router.put('/PatientProfileEdit/:patientId',authenticateUser,patientController.patientProfileEdit)
router.get('/specializations',authenticateUser, patientController.getSpecializations);
router.get('/getDoctorsBySpecialization/:specialization',authenticateUser,patientController.getDoctorsBySpecialization);
router.get('/getSlots/:doctorId/:date',authenticateUser, patientController.getSlots);
router.post('/googlelogin',patientController.googleLogin);
router.get('/getNearbyDoctors/:patientId',patientController.getNearbyDoctors);
router.get('/search',authenticateUser,patientController.search);
router.post('/createOrder',authenticateUser,patientController.createOrder);
router.post('/confirmPayment',authenticateUser, patientController.confirmPayment); 
router.get('/getBookedAppointments/:patientId',authenticateUser,patientController.getBookedAppointments);
router.put('/cancelAppointment',authenticateUser, patientController.cancelAppointment);
router.post('/createWalletRechargeOrder',authenticateUser, patientController.createWalletRechargeOrder);
router.post('/rechargeWallet',authenticateUser, patientController.rechargeWallet);
router.post('/confirmWalletPayment',authenticateUser, patientController.confirmWalletPayment);
router.get('/getWalletDetails/:patientId',authenticateUser,patientController.getWalletDetails);
router.get('/getPlatformFee',patientController.getPlatformFee);
router.get('/getConsultationFee/:doctorId',patientController.getConsultationFee );
router.get('/getNotifications/:patientId', patientController.getNotifications );
router.put('/updateNotificationStatus/:id', patientController.updateNotificationStatus );
router.get('/getDoctorDetailsForPatient/:doctorId',authenticateUser,patientController.getDoctorDetailsForPatient);
router.post('/submitReview',authenticateUser, patientController.submitReview);
router.get('/getReviews/:doctorId',authenticateUser,patientController.getReviews);
router.get('/getDoctorAverageRating/:doctorId',patientController.getDoctorAverageRating);
router.get('/getDoctorAverageRatingformultipleDoctors/:doctorId',patientController.getDoctorAverageRatingformultipleDoctors );
router.get('/getBookingDetailsforSuccessPage/:slotId',authenticateUser,patientController.getBookingDetailsforSuccessPage);
router.get('/getAppointmentHistory/:patientId',authenticateUser,patientController.getAppointmentHistory);
router.get('/getChatHistory/:doctorId/:patientId',patientController.getChatHistory);
router.get('/getDoctorDetails/:doctorId', patientController.fetchDoctorDetailsforChat);


export default router;
