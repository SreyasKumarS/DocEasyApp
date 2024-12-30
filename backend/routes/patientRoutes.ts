import { Router } from 'express';
import authenticateUser from '../middleware/authMiddleware.js'
import {PatientController} from '../controllers/patientController.js';
import { PatientService } from '../services/patientService.js';
import { PatientRepository } from '../repositories/patientRespository.js';

const patientRepository = new PatientRepository();
const patientService = new PatientService(patientRepository)
const patientController = new PatientController(patientService);




const router = Router();
router.post('/register', patientController.registerPatient.bind(patientController));
router.post('/verify-otp', patientController.verifyOtp.bind(patientController));
router.post('/resend-otp', patientController.resendOtp.bind(patientController));
router.post('/login', patientController.loginPatient.bind(patientController));
router.post('/logout', patientController.logoutPatient.bind(patientController));
router.post('/sendResetOtp', patientController.sendResetOtp.bind(patientController));
router.post('/ResetPassword',patientController.resetPassword.bind(patientController));

router.get('/getPatientDetails/:patientId',authenticateUser,patientController.getPatientDetails.bind(patientController));
router.put('/PatientProfileEdit/:patientId',authenticateUser,patientController.patientProfileEdit.bind(patientController))
router.get('/specializations',authenticateUser, patientController.getSpecializations.bind(patientController));
router.get('/getDoctorsBySpecialization/:specialization',authenticateUser,patientController.getDoctorsBySpecialization.bind(patientController));
router.get('/getSlots/:doctorId/:date',authenticateUser, patientController.getSlots.bind(patientController));
router.post('/googlelogin',patientController.googleLogin.bind(patientController));
router.get('/getNearbyDoctors/:patientId',patientController.getNearbyDoctors.bind(patientController));
router.get('/search',authenticateUser,patientController.search.bind(patientController));
router.post('/createOrder',authenticateUser,patientController.createOrder.bind(patientController));
router.post('/confirmPayment',authenticateUser, patientController.confirmPayment.bind(patientController)); 
router.get('/getBookedAppointments/:patientId',authenticateUser,patientController.getBookedAppointments.bind(patientController));
router.put('/cancelAppointment',authenticateUser, patientController.cancelAppointment.bind(patientController));
router.post('/createWalletRechargeOrder',authenticateUser, patientController.createWalletRechargeOrder.bind(patientController));
router.post('/rechargeWallet',authenticateUser, patientController.rechargeWallet.bind(patientController));
router.post('/confirmWalletPayment',authenticateUser, patientController.confirmWalletPayment.bind(patientController));
router.get('/getWalletDetails/:patientId',authenticateUser,patientController.getWalletDetails.bind(patientController));
router.get('/getPlatformFee',patientController.getPlatformFee.bind(patientController));
router.get('/getConsultationFee/:doctorId',patientController.getConsultationFee.bind(patientController));
router.get('/getNotifications/:patientId', patientController.getNotifications.bind(patientController));
router.put('/updateNotificationStatus/:id', patientController.updateNotificationStatus.bind(patientController));
router.get('/getDoctorDetailsForPatient/:doctorId',authenticateUser,patientController.getDoctorDetailsForPatient.bind(patientController));
router.post('/submitReview',authenticateUser, patientController.submitReview.bind(patientController));
router.get('/getReviews/:doctorId',authenticateUser,patientController.getReviews.bind(patientController));
router.get('/getDoctorAverageRating/:doctorId',patientController.getDoctorAverageRating.bind(patientController));
router.get('/getDoctorAverageRatingformultipleDoctors/:doctorId',patientController.getDoctorAverageRatingformultipleDoctors.bind(patientController));
router.get('/getBookingDetailsforSuccessPage/:slotId',authenticateUser,patientController.getBookingDetailsforSuccessPage.bind(patientController));
router.get('/getAppointmentHistory/:patientId',authenticateUser,patientController.getAppointmentHistory.bind(patientController));
router.get('/getChatHistory/:doctorId/:patientId',patientController.getChatHistory.bind(patientController));
router.get('/getDoctorDetails/:doctorId', patientController.fetchDoctorDetailsforChat.bind(patientController));


export default router;
