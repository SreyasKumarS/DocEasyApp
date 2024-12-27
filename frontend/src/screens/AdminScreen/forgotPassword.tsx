import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../../components/patientComponents/FormContainer'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'

const RequestAdminOtpScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>(''); 
  const [otpSent, setOtpSent] = useState<boolean>(false); 
  const [isVerifying, setIsVerifying] = useState<boolean>(false); 
  const [resendDisabled, setResendDisabled] = useState<boolean>(true); 
  const [timer, setTimer] = useState<number>(60); 
  const [isResending, setIsResending] = useState<boolean>(false); 
  let interval: NodeJS.Timeout; 


  const navigate = useNavigate();

  useEffect(() => {
    if (otpSent && resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendDisabled(false); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/sendResetAdminOtp', { email });
      toast.success('OTP sent to your email');
      setOtpSent(true);
      setResendDisabled(true);
      setTimer(60);
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    }
  };
  
  const resendOtpHandler = async () => {
    try {
      setIsResending(true);
      await api.post('/admin/resend-otp', { email });
      toast.success('OTP resent');
      setIsResending(false);
      setResendDisabled(true);
      setTimer(60);
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
      setIsResending(false);
    }
  };
  
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await api.post('/admin/verify-otpAdmin', { email, otp });
      toast.success('OTP Verified Successfully!');
      navigate('/admin/AdminResetPasswordScreen', { state: { email } });
    } catch (error) {
      toast.error('OTP verification failed, please try again');
      console.error('Error verifying OTP:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <FormContainer>
      <h2>Request Password Reset OTP for Admin</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3" disabled={otpSent}>
          Send OTP
        </Button>

      </Form>

      {otpSent && (
        <>
          <Form onSubmit={handleOtpVerify}>
            <Form.Group controlId="otp" className="my-2">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="py-3">
              <Col>
                <Button type="submit" variant="primary" className="mt-3" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </Col>
              <Col>
                <Button
                  variant="secondary"
                  disabled={resendDisabled || isResending}
                  onClick={resendOtpHandler}
                  className="mt-3"
                >
                  {isResending ? 'Resending...' : 'Resend OTP'}
                </Button>
              </Col>
            </Row>
            <p>{timer > 0 ? `Resend OTP in ${timer}s` : ''}</p>
          </Form>
        </>
      )}
    </FormContainer>
  );
};

export default RequestAdminOtpScreen;
