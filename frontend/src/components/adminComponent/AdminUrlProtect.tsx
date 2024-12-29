import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 

interface ProtectedRouteProps {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const adminId = useSelector((state: RootState) => state.AdminAuth.user?.id);
  console.log(  adminId,'state fullllllllllllllllllllllllll');
  
  return  adminId ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;