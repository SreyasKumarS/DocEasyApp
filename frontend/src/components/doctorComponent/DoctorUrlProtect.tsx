import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 

interface ProtectedRouteProps {
  children: JSX.Element;
}

const DoctorProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  console.log( doctorId,'state fullllllllllllllllllllllllll');
  
  return doctorId ? children : <Navigate to="/doctor/login" replace />;
};

export default DoctorProtectedRoute;