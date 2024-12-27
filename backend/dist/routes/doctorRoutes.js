// import { Router } from 'express';
// import  { multerDoctor } from '../config/multer.js'
// import authenticateUser from '../middleware/authMiddleware.js'
// import {
//     registerDoctor,
//     verifyOtp,
//     resendOtp,
//     loginDoctor,
//     logoutDoctor,
//     sendDoctorResetOtp,
//     resetDoctorPassword ,
//     fetchDoctorProfile,
//     updateDoctorProfile,
//     DailySlots,
//     createDoctorMonthlySlots,
//     // getDoctorSlots,
//     getDoctorSlotsM,
//     deleteSlot,
//     AppointmentsOverView,
//     getDoctorSlotsByDate,
//     DailyRecurringSlots,
//     getPatientDetails,
//     cancelAppointmentbydoctor,
//     addPrescription,
//     getCompletedBookings,
//     getPrescription,
//     getChatList,
//     createWeeklyRecurringSlots
// } from '../controllers/doctorControllers.js';
// const router = Router();
// router.post('/register', (req, res, next) => {
//   multerDoctor(req, res, (err) => {
//     if (err) {
//       console.error('Multer error:', err);
//       return res.status(400).json({ message: err.message });
//     }
//     ('Multer processing done, proceeding to registerDoctor');
//     registerDoctor(req, res, next);
//   });
// });
// router.post('/verify-otpDoctor', verifyOtp);
// router.post('/resend-otp', resendOtp);
// router.post('/loginDoctor',loginDoctor);
// router.post('/logout', logoutDoctor);
// router.post('/sendResetDoctorOtp', sendDoctorResetOtp);
// router.post('/resetDoctorPassword', resetDoctorPassword );
// router.get('/fetchDoctorById/:doctorId',authenticateUser,fetchDoctorProfile);
// router.put('/updateDoctorProfile/:doctorId',authenticateUser, updateDoctorProfile);
// router.post('/DailySlots/:doctorId',authenticateUser, DailySlots);
// router.post('/DailyRecurringSlots',authenticateUser, DailyRecurringSlots);
// router.post('/createDoctorMonthlySlots/:doctorId',authenticateUser,createDoctorMonthlySlots);
// // router.get('/getDoctorSlots/:doctorId', getDoctorSlots);
// router.get('/getDoctorSlotsM/:doctorId',authenticateUser, getDoctorSlotsM);
// router.delete('/deleteSlot/:slotId',authenticateUser, deleteSlot  );
// router.get('/AppointmentsOverView/:doctorId',authenticateUser, AppointmentsOverView);
// router.get('/getDoctorSlotsByDate/:doctorId',authenticateUser, getDoctorSlotsByDate);
// router.get('/getPatientDetails/:slotId',authenticateUser, getPatientDetails);
// router.put('/cancelAppointmentbydoctor',authenticateUser, cancelAppointmentbydoctor);
// router.post('/addPrescription',authenticateUser, addPrescription);
// router.get('/getCompletedBookings',authenticateUser, getCompletedBookings);
// router.get('/getPrescription/:bookingId',authenticateUser, getPrescription);
// router.get('/getChatList/:doctorId',getChatList);
// router.post('/createWeeklyRecurringSlots',authenticateUser, createWeeklyRecurringSlots);
// export default router;
import { Router } from 'express';
import { multerDoctor } from '../config/multer.js';
import authenticateUser from '../middleware/authMiddleware.js';
import doctorControllers from '../controllers/doctorControllers.js';
const router = Router();
router.post('/register', (req, res, next) => {
    multerDoctor(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }
        ('Multer processing done, proceeding to registerDoctor');
        doctorControllers.registerDoctor(req, res, next);
    });
});
router.post('/verify-otpDoctor', doctorControllers.verifyOtp);
router.post('/resend-otp', doctorControllers.resendOtp);
router.post('/loginDoctor', doctorControllers.loginDoctor);
router.post('/logout', doctorControllers.logoutDoctor);
router.post('/sendResetDoctorOtp', doctorControllers.sendDoctorResetOtp);
router.post('/resetDoctorPassword', doctorControllers.resetDoctorPassword);
router.get('/fetchDoctorById/:doctorId', authenticateUser, doctorControllers.fetchDoctorProfile);
router.put('/updateDoctorProfile/:doctorId', authenticateUser, doctorControllers.updateDoctorProfile);
router.post('/DailySlots/:doctorId', authenticateUser, doctorControllers.DailySlots);
router.post('/DailyRecurringSlots', authenticateUser, doctorControllers.DailyRecurringSlots);
router.post('/createDoctorMonthlySlots/:doctorId', authenticateUser, doctorControllers.createDoctorMonthlySlots);
// router.get('/getDoctorSlots/:doctorId', getDoctorSlots);
router.get('/getDoctorSlotsM/:doctorId', authenticateUser, doctorControllers.getDoctorSlotsM);
router.delete('/deleteSlot/:slotId', authenticateUser, doctorControllers.deleteSlot);
router.get('/AppointmentsOverView/:doctorId', authenticateUser, doctorControllers.AppointmentsOverView);
router.get('/getDoctorSlotsByDate/:doctorId', authenticateUser, doctorControllers.getDoctorSlotsByDate);
router.get('/getPatientDetails/:slotId', authenticateUser, doctorControllers.getPatientDetails);
router.put('/cancelAppointmentbydoctor', authenticateUser, doctorControllers.cancelAppointmentByDoctor);
router.post('/addPrescription', authenticateUser, doctorControllers.addPrescription);
router.get('/getCompletedBookings', authenticateUser, doctorControllers.getCompletedBookings);
router.get('/getPrescription/:bookingId', authenticateUser, doctorControllers.getPrescription);
router.get('/getChatList/:doctorId', doctorControllers.getChatList);
router.post('/createWeeklyRecurringSlots', authenticateUser, doctorControllers.createWeeklyRecurringSlots);
router.get('/fetchPatientDetails/:patientId', doctorControllers.fetchPatientDetailsforChat);
export default router;
