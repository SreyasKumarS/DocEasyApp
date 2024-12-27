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
      <Route path="PatientProfileScreen" element={<PatientProfile />} /> 
      <Route path="EditPatientProfile" element={<EditPatientProfile />} /> 
      <Route path="Specializations" element={<Specializations />} /> 
      <Route path="DoctorsList" element={<DoctorsList />} /> 
      <Route path="DoctorSlots" element={<DoctorSlots />} /> 
      <Route path="BookedAppointmentsScreen" element={<BookedAppointmentsScreen />} /> 
      <Route path="WalletPage" element={<WalletPage />} /> 
      <Route path="NotificationPage" element={<NotificationPage />} /> 
      <Route path="DoctorDetailsPagePatient" element={<DoctorDetailsPagePatient />} /> 
      <Route path="BookingSuccessScreen" element={<BookingSuccessScreen />} /> 
      <Route path="AppointmentHistoryScreen" element={<AppointmentHistoryScreen />} /> 
      <Route path="PatientPrescriptionScreen" element={<PatientPrescriptionScreen />} />
      <Route path="PatientChat" element={<PatientChat />} />
      
    </Route>

      {/* Doctor Routes */}
      <Route path="doctor">
        <Route path="register" element={<DoctorRegisterScreen />} /> 
        <Route path="login" element={<DoctorLoginScreen />} />
        <Route path="DoctorHomeScreen" element={<DoctorHomeScreen />} />
        <Route path="DoctorForgotPasswordScreen" element={<DoctorForgotPasswordScreen />} />
        <Route path="resetpassword" element={<ResetDoctorPasswordWithOtpScreen />} />
        <Route path="DoctorProfileDocside" element={<DoctorProfileDocside />} />
        <Route path="DoctorProfileEdit" element={<DoctorProfileEdit />} />
        <Route path="CreateAppointmentSlots" element={<CreateAppointmentSlots />} />
        <Route path="DoctorSlotsDisplay" element={<SlotsDisplay />} />
        <Route path="AppointmentsOverview" element={<AppointmentsOverview />} />
        <Route path="AppointmentsDetails" element={<AppointmentsDetails />} />
        <Route path="DailySlot" element={<DailySlot />} />
        {/* <Route path="MonthlySlot" element={<MonthlySlot />} /> */}
        <Route path="DailyRecurringSlots" element={<DailyRecurringSlots />} />
        <Route path="WeeklyRecurringSlots" element={<WeeklyRecurringSlots />} />
        <Route path="PrescriptionScreen" element={<PrescriptionScreen />} />
        <Route path="MyPatientsScreen" element={<MyPatientsScreen />} />
        <Route path="MyPatientPrescriptionScreen" element={<MyPatientPrescriptionScreen />} />
        <Route path="ChatListandRequests" element={<ChatListandRequests />} />
        <Route path="DoctorSideChat" element={<DoctorSideChat />} />
       

        
      </Route>

      {/* Admin Routes */}
      <Route path="admin">
        <Route path="login" element={<AdminLoginScreen />} />
        <Route path="adminHomeScreen" element={<AdminHomeScreen />} />
        <Route path="adminForgotPasswordScreen" element={<AdminForgotPasswordScreen />} />
        <Route path="adminResetPasswordScreen" element={<AdminResetPasswordScreen />} />
        <Route path="DoctorApprovalScreen" element={<DoctorApprovals />} />
        <Route path="patientListingScreen" element={<PatientListings />} />
        <Route path="doctorListingScreen" element={<DoctorListings />} />
        <Route path="doctorProfileScreen" element={<DoctorProfile />} />
        <Route path="StatisticsPage" element={<StatisticsPage />} />
        <Route path="TopRevenueDoctorPage" element={<TopRevenueDoctorPage />} />
        <Route path="TopRatedDoctors" element={<TopRatedDoctors />} />
        <Route path="TopPatients" element={<TopPatients />} />
        <Route path="TopBookedDoctors" element={<TopBookedDoctors />} />
        <Route path="ChartPage" element={<ChartPage />} />
        <Route path="ReportsPage" element={<ReportsPage />} />
        
        
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
