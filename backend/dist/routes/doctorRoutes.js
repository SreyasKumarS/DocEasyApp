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
import { DoctorController } from '../controllers/doctorControllers.js';
import { DoctorService } from '../services/doctorServices.js';
import { DoctorRepository } from '../repositories/doctorRespository.js';
const doctorRepository = new DoctorRepository();
const doctorService = new DoctorService(doctorRepository);
const doctorControllers = new DoctorController(doctorService);
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
router.post('/verify-otpDoctor', doctorControllers.verifyOtp.bind(doctorControllers));
router.post('/resend-otp', doctorControllers.resendOtp.bind(doctorControllers));
router.post('/loginDoctor', doctorControllers.loginDoctor.bind(doctorControllers));
router.post('/logout', doctorControllers.logoutDoctor.bind(doctorControllers));
router.post('/sendResetDoctorOtp', doctorControllers.sendDoctorResetOtp.bind(doctorControllers));
router.post('/resetDoctorPassword', doctorControllers.resetDoctorPassword.bind(doctorControllers));
router.get('/fetchDoctorById/:doctorId', authenticateUser, doctorControllers.fetchDoctorProfile.bind(doctorControllers));
router.put('/updateDoctorProfile/:doctorId', authenticateUser, doctorControllers.updateDoctorProfile.bind(doctorControllers));
router.post('/DailySlots/:doctorId', authenticateUser, doctorControllers.DailySlots.bind(doctorControllers));
router.post('/DailyRecurringSlots', authenticateUser, doctorControllers.DailyRecurringSlots.bind(doctorControllers));
router.post('/createDoctorMonthlySlots/:doctorId', authenticateUser, doctorControllers.createDoctorMonthlySlots.bind(doctorControllers));
// router.get('/getDoctorSlots/:doctorId', getDoctorSlots);
router.get('/getDoctorSlotsM/:doctorId', authenticateUser, doctorControllers.getDoctorSlotsM.bind(doctorControllers));
router.delete('/deleteSlot/:slotId', authenticateUser, doctorControllers.deleteSlot.bind(doctorControllers));
router.get('/AppointmentsOverView/:doctorId', authenticateUser, doctorControllers.AppointmentsOverView.bind(doctorControllers));
router.get('/getDoctorSlotsByDate/:doctorId', authenticateUser, doctorControllers.getDoctorSlotsByDate.bind(doctorControllers));
router.get('/getPatientDetails/:slotId', authenticateUser, doctorControllers.getPatientDetails.bind(doctorControllers));
router.put('/cancelAppointmentbydoctor', authenticateUser, doctorControllers.cancelAppointmentByDoctor.bind(doctorControllers));
router.post('/addPrescription', authenticateUser, doctorControllers.addPrescription.bind(doctorControllers));
router.get('/getCompletedBookings', authenticateUser, doctorControllers.getCompletedBookings.bind(doctorControllers));
router.get('/getPrescription/:bookingId', doctorControllers.getPrescription.bind(doctorControllers));
router.get('/getChatList/:doctorId', doctorControllers.getChatList.bind(doctorControllers));
router.post('/createWeeklyRecurringSlots', authenticateUser, doctorControllers.createWeeklyRecurringSlots.bind(doctorControllers));
router.get('/fetchPatientDetails/:patientId', doctorControllers.fetchPatientDetailsforChat.bind(doctorControllers));
export default router;
