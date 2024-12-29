import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';


import DemoLandingPage from './screens/PatientScreen/DemoLandingPage'
import HomeScreen from './screens/PatientScreen/HomeScreen';
import RegisterScreen from './screens/PatientScreen/RegisterScreen'; 
import LoginScreen from './screens/PatientScreen/LoginScreen';  
import ForgotPasswordScreen from './screens/PatientScreen/ForgotPasswordScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import store, { persistor } from '../store'; 
import ResetPasswordScreen from './screens/PatientScreen/ResetPasswordScreen';
import PatientProfile from './screens/PatientScreen/PatientProfileScreen';
import EditPatientProfile from './screens/PatientScreen/EditPatientProfileScreen';
import Specializations from './screens/PatientScreen/SpecializationScreen';
import DoctorsList from './screens/PatientScreen/DoctorListingScreen';
import DoctorSlots from './screens/PatientScreen/DoctorSlotListingScreen';
import BookedAppointmentsScreen from './screens/PatientScreen/BookingConfirmedScreen';
import WalletPage from './screens/PatientScreen/wallet';
import NotificationPage from './screens/PatientScreen/notificationScreen';
import DoctorDetailsPagePatient from './screens/PatientScreen/DoctorDetailsPagePatient';
import BookingSuccessScreen from './screens/PatientScreen/BookingSucessPage';
import AppointmentHistoryScreen from './screens/PatientScreen/AppointmentHistory';
import PatientPrescriptionScreen from './screens/PatientScreen/PatientPrescritpionPage';
import PatientChat from './screens/PatientScreen/PatientChat';
import PatientProtectedRoute from './components/patientComponents/PatientUrlProtect'



import DoctorHomeScreen from './screens/DoctorScreen/HomeScreen'; 
import DoctorRegisterScreen from './screens/DoctorScreen/RegisterScreen';
import DoctorLoginScreen from './screens/DoctorScreen/LoginScreen';
import DoctorForgotPasswordScreen from './screens/DoctorScreen/ForgotPassword';
import ResetDoctorPasswordWithOtpScreen from './screens/DoctorScreen/ResetPassword';
import DoctorProfileDocside from './screens/DoctorScreen/DoctorProfileScreen';
import DoctorProfileEdit from './screens/DoctorScreen/DoctorProfileEditScreen';
import CreateAppointmentSlots from './screens/DoctorScreen/CreateSlotsScreen';
import SlotsDisplay from './screens/DoctorScreen/DisplayDoctorSlots';
import AppointmentsOverview  from './screens/DoctorScreen/AppointmentsOverview';
import AppointmentsDetails  from './screens/DoctorScreen/AppointmentsDetails';
import DailySlot from './screens/DoctorScreen/Daily';
// import MonthlySlot from './screens/DoctorScreen/Monthly';
import DailyRecurringSlots from './screens/DoctorScreen/DailyReccuring';
import WeeklyRecurringSlots from './screens/DoctorScreen/weeklyRecurring';
import PrescriptionScreen from './screens/DoctorScreen/PrescriptionScreen';
import MyPatientsScreen from './screens/DoctorScreen/MyPatientsScreen';
import MyPatientPrescriptionScreen from './screens/DoctorScreen/MyPatientPrescriptionScreen';
import ChatListandRequests from './screens/DoctorScreen/ChatListandRequests';
import DoctorSideChat from './screens/DoctorScreen/DoctorSideChat';
import DoctorProtectedRoute from './components/doctorComponent/DoctorUrlProtect';






import AdminHomeScreen from './screens/AdminScreen/homeScreen'; 
import AdminLoginScreen from './screens/AdminScreen/loginScreen';
import AdminForgotPasswordScreen from './screens/AdminScreen/forgotPassword';
import AdminResetPasswordScreen from './screens/AdminScreen/resetPassword';
import DoctorApprovals from './screens/AdminScreen/doctorApprovalScreen';
import PatientListings from './screens/AdminScreen/patientListingScreen';
import DoctorListings from './screens/AdminScreen/doctorListingScreen';
import DoctorProfile from './screens/AdminScreen/doctorProfileScreen';
import StatisticsPage from './screens/AdminScreen/statisticsScreen';
import TopRevenueDoctorPage from './screens/AdminScreen/topRevenueDoctorScreen';
import TopRatedDoctors from './screens/AdminScreen/topRatedDoctors';
import TopPatients from './screens/AdminScreen/topBookedPatients';
import TopBookedDoctors from './screens/AdminScreen/topBookedDoctors';
import ChartPage from './screens/AdminScreen/chartPage'; 
import ReportsPage from './screens/AdminScreen/reportPage'; 
import AdminProtectedRoute from './components/adminComponent/AdminUrlProtect'        



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<DemoLandingPage />} />
      {/* Patient Routes */}
    <Route path="patient">
      <Route path="HomeScreen" element={<HomeScreen />} /> {/* /patient */}
      <Route path="register" element={<RegisterScreen />} />
      <Route path="login" element={<LoginScreen />} /> 
      <Route path="forgot-password" element={<ForgotPasswordScreen />} /> 
      <Route path="resetPassword" element={<ResetPasswordScreen />} /> 

      <Route path="PatientProfileScreen" element={<PatientProtectedRoute><PatientProfile /></PatientProtectedRoute>} /> 
      <Route path="EditPatientProfile" element={<PatientProtectedRoute><EditPatientProfile /></PatientProtectedRoute>} /> 
      <Route path="Specializations" element={<PatientProtectedRoute><Specializations /></PatientProtectedRoute>} /> 
      <Route path="DoctorsList" element={<PatientProtectedRoute><DoctorsList /></PatientProtectedRoute>} /> 
      <Route path="DoctorSlots" element={<PatientProtectedRoute><DoctorSlots /></PatientProtectedRoute>} /> 
      <Route path="BookedAppointmentsScreen" element={<PatientProtectedRoute><BookedAppointmentsScreen /></PatientProtectedRoute>} /> 
      <Route path="WalletPage" element={<PatientProtectedRoute><WalletPage /></PatientProtectedRoute>} /> 
      <Route path="NotificationPage" element={<PatientProtectedRoute><NotificationPage /></PatientProtectedRoute>} /> 
      <Route path="DoctorDetailsPagePatient" element={<PatientProtectedRoute><DoctorDetailsPagePatient /></PatientProtectedRoute>} /> 
      <Route path="BookingSuccessScreen" element={<PatientProtectedRoute><BookingSuccessScreen /></PatientProtectedRoute>} /> 
      <Route path="AppointmentHistoryScreen" element={<PatientProtectedRoute><AppointmentHistoryScreen /></PatientProtectedRoute>} /> 
      <Route path="PatientPrescriptionScreen" element={<PatientProtectedRoute><PatientPrescriptionScreen /></PatientProtectedRoute>} />
      <Route path="PatientChat" element={<PatientProtectedRoute><PatientChat /></PatientProtectedRoute>} />
      
    </Route>

      {/* Doctor Routes */}
      <Route path="doctor">
        <Route path="register" element={<DoctorRegisterScreen />} /> 
        <Route path="login" element={<DoctorLoginScreen />} />
        <Route path="DoctorHomeScreen" element={<DoctorHomeScreen />} />
        <Route path="DoctorForgotPasswordScreen" element={<DoctorForgotPasswordScreen />} />
        <Route path="resetpassword" element={<ResetDoctorPasswordWithOtpScreen />} />

        <Route path="DoctorProfileDocside" element={<DoctorProtectedRoute><DoctorProfileDocside /></DoctorProtectedRoute>} />
        <Route path="DoctorProfileEdit" element={<DoctorProtectedRoute><DoctorProfileEdit /></DoctorProtectedRoute>} />
        <Route path="CreateAppointmentSlots" element={<DoctorProtectedRoute><CreateAppointmentSlots /></DoctorProtectedRoute>} />
        <Route path="DoctorSlotsDisplay" element={<DoctorProtectedRoute><SlotsDisplay /></DoctorProtectedRoute>} />
        <Route path="AppointmentsOverview" element={<DoctorProtectedRoute><AppointmentsOverview /></DoctorProtectedRoute>} />
        <Route path="AppointmentsDetails" element={<DoctorProtectedRoute><AppointmentsDetails /></DoctorProtectedRoute>} />
        <Route path="DailySlot" element={<DoctorProtectedRoute><DailySlot /></DoctorProtectedRoute>} />
        {/* <Route path="MonthlySlot" element={<MonthlySlot />} /> */}
        <Route path="DailyRecurringSlots" element={<DoctorProtectedRoute><DailyRecurringSlots /></DoctorProtectedRoute>} />
        <Route path="WeeklyRecurringSlots" element={<DoctorProtectedRoute><WeeklyRecurringSlots /></DoctorProtectedRoute>} />
        <Route path="PrescriptionScreen" element={<DoctorProtectedRoute><PrescriptionScreen /></DoctorProtectedRoute>} />
        <Route path="MyPatientsScreen" element={<DoctorProtectedRoute><MyPatientsScreen /></DoctorProtectedRoute>} />
        <Route path="MyPatientPrescriptionScreen" element={<DoctorProtectedRoute><MyPatientPrescriptionScreen /></DoctorProtectedRoute>} />
        <Route path="ChatListandRequests" element={<DoctorProtectedRoute><ChatListandRequests /></DoctorProtectedRoute>} />
        <Route path="DoctorSideChat" element={<DoctorProtectedRoute><DoctorSideChat /></DoctorProtectedRoute>} />
       

        
      </Route>

      {/* Admin Routes */}
      <Route path="admin">
        <Route path="login" element={<AdminLoginScreen />} />

        <Route path="adminHomeScreen" element={<AdminProtectedRoute><AdminHomeScreen /></AdminProtectedRoute>} />
        <Route path="adminForgotPasswordScreen" element={<AdminProtectedRoute><AdminForgotPasswordScreen /></AdminProtectedRoute>} />
        <Route path="adminResetPasswordScreen" element={<AdminProtectedRoute><AdminResetPasswordScreen /></AdminProtectedRoute>} />
        <Route path="DoctorApprovalScreen" element={<AdminProtectedRoute><DoctorApprovals /></AdminProtectedRoute>} />
        <Route path="patientListingScreen" element={<AdminProtectedRoute><PatientListings /></AdminProtectedRoute>} />
        <Route path="doctorListingScreen" element={<AdminProtectedRoute><DoctorListings /></AdminProtectedRoute>} />
        <Route path="doctorProfileScreen" element={<AdminProtectedRoute><DoctorProfile /></AdminProtectedRoute>} />
        <Route path="StatisticsPage" element={<AdminProtectedRoute><StatisticsPage /></AdminProtectedRoute>} />
        <Route path="TopRevenueDoctorPage" element={<AdminProtectedRoute><TopRevenueDoctorPage /></AdminProtectedRoute>} />
        <Route path="TopRatedDoctors" element={<AdminProtectedRoute><TopRatedDoctors /></AdminProtectedRoute>} />
        <Route path="TopPatients" element={<AdminProtectedRoute><TopPatients /></AdminProtectedRoute>} />
        <Route path="TopBookedDoctors" element={<AdminProtectedRoute><TopBookedDoctors /></AdminProtectedRoute>} />
        <Route path="ChartPage" element={<AdminProtectedRoute><ChartPage /></AdminProtectedRoute>} />
        <Route path="ReportsPage" element={<AdminProtectedRoute><ReportsPage /></AdminProtectedRoute>} />
        
        
      </Route>
    </Route>
  )
);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Provider store={store}> {/* Wrap with Provider */}
      <PersistGate loading={null} persistor={persistor}> {/* Wrap with PersistGate */}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
