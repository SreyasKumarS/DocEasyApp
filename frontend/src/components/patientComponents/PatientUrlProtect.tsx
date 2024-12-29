import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 

interface ProtectedRouteProps {
  children: JSX.Element;
}

const PatientProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);
  console.log(  patientId,'state fullllllllllllllllllllllllll');
  
  return  patientId ? children : <Navigate to="/patient/login" replace />;
};

export default PatientProtectedRoute;