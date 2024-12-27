import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../../components/patientComponents/FormContainer'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'

const ResetDoctorPasswordWithOtpScreen: React.FC = () => {

  const location = useLocation();
  const { email } = location.state || {};
  
  const [newPassword, setNewPassword] = useState<string>(''); 
  const [confirmPassword, setConfirmPassword] = useState<string>(''); 

  
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await api.post('/doctor/resetDoctorPassword', { email, newPassword, confirmPassword });
      toast.success('Password reset successfully!');
      navigate('/doctor/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };
  

  return (
    <FormContainer>
      <h2>Reset Doctor Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="newPassword" className="my-2">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-2">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Reset Password
        </Button>

      </Form>
    </FormContainer>
  );
};

export default ResetDoctorPasswordWithOtpScreen;
