import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setCredentials } from "../../slices/patientSlice/patientAuthSlice";
import FormContainer from "../../components/patientComponents/FormContainer";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {toast} from 'react-toastify';
import api from '../../axios'



const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.PatientAuth.user);

  useEffect(() => {
    if (user) {
      navigate('/patient/HomeScreen');
    }
  }, [user, navigate]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/patients/login', { email, password }); 
      const result = response.data;
      console.log(result,'normlallllll')
      dispatch(setCredentials(result));
      navigate('/patient/HomeScreen');
      toast.success('Login successful'); 
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };  



  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const googleToken = response.credential;
        console.log("Google token received:", googleToken);
        const result = await api.post('/patients/googlelogin', { googleToken });
        console.log(result,'googleeeeeeeee')
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
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Row className="py-3">
            <Col>
              <Link to="/patient/forgot-password">Forgot Password?</Link> 
            </Col>
          </Row>

            <Button type="submit" variant="primary" className="mt-3">
              Login
            </Button>
            
          <Row className="py-3">
            <Col>
              Don’t have an account? <Link to="/patient/register">Register</Link>
            </Col>
          </Row>
        </Form>

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

export default LoginScreen;
