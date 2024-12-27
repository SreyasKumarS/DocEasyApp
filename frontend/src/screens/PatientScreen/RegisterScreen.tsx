import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/patientComponents/FormContainer";
import { toast } from 'react-toastify';
import api from '../../axios'
import { setCredentials } from "../../slices/patientSlice/patientAuthSlice";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('');
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(40);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOtpSent && resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setResendDisabled(false);
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isOtpSent, resendDisabled]);

  const validateName = (name: string) => /^[A-Za-z\s]{3,}$/.test(name);
  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6}$/.test(password);
  const validateAge = (age: number | '') => age !== '' && age > 0 && age <= 120;
  const validateContactNumber = (contactNumber: string) => /^\d{10}$/.test(contactNumber);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpSent) {
      if (!validateName(name)) {
        toast.error('Invalid name. Name must be at least 3 characters long and contain only letters.');
      } else if (!validateEmail(email)) {
        toast.error('Invalid email format.');
      } else if (!validatePassword(password)) {
        toast.error('Password must be at least 6 characters, including 1 uppercase, 1 lowercase, and 1 number.');
      } else if (password !== confirmPassword) {
        toast.error('Passwords do not match');
      } else if (!validateAge(age)) {
        toast.error('Please enter a valid age (1-120).');
      } else if (!validateContactNumber(contactNumber)) {
        toast.error('Invalid contact number. It should be 10 digits.');
      } else {
        try {
          const formData = {
            name,
            email,
            password,
            age,
            gender,
            address,
            locality,
            contactNumber,
            bloodGroup,
          };

          // Axios POST request for registration
          await api.post('/patients/register', formData);
          setIsOtpSent(true);
          setTimer(40);
          setResendDisabled(true);
        } catch (error) {
          toast.error('Registration failed. Please try again.');
        }
      }
    } else if (isOtpSent && otp.trim() !== '') {
      try {
        // Axios POST request for OTP verification
        await api.post('/patients/verify-otp', { email, otp });
        toast.success('Registration completed successfully!');
        navigate('/patient/login');
      } catch (error) {
        toast.error('Invalid OTP!');
      }
    } else {
      toast.error('Please enter the OTP');
    }
  };

  const resendOtpHandler = async () => {
    try {
      // Axios POST request for resending OTP
      await api.post('/patients/resend-otp', { email });
      setTimer(10);
      setResendDisabled(true);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const googleToken = response.credential;
        const result = await api.post('/patients/googlelogin', { googleToken });
        dispatch(setCredentials(result.data)); 
        navigate('/patient/HomeScreen');
      } catch (error) {
        console.error('Google login failed:', error);
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <FormContainer>
      <h1>{!isOtpSent ? 'Sign Up' : 'Enter OTP'}</h1>
      <Form onSubmit={submitHandler}>
        {!isOtpSent ? (
          <>
            <Form.Group className="my-2" controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='age'>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='gender'>
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="my-2" controlId='address'>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='locality'>
              <Form.Label>Locality</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please specify your Locality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='contactNumber'>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='bloodGroup'>
              <Form.Label>Blood Group</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Blood Group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3" disabled={isRegistering}>
              {isRegistering ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <Form.Group className="my-2" controlId='otp'>
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
                <Button type="button" variant="link" onClick={resendOtpHandler} disabled={resendDisabled}>
                  Resend OTP {resendDisabled ? `(${timer})` : ''}
                </Button>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="mt-3" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account? <Link to="/patient/login">Login</Link>
        </Col>
      </Row>
    <hr />
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => ("Google login failed")}
          useOneTap
        />
      </FormContainer>
    </GoogleOAuthProvider>
  );
};

export default RegisterScreen;
