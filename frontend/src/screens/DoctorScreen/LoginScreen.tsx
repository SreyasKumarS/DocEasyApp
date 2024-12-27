import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/patientComponents/FormContainer";  
import { setCredentials } from "../../slices/doctorSlice/doctorAuthSlice"; 
import { useDispatch,useSelector } from 'react-redux'; 
import { toast } from "react-toastify";
import { RootState } from '../../../store'; 
import api from '../../axios'
import { log } from "node:console";



const DoctorLoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.DoctorAuth.user);
  const doctorAuth = useSelector((state: RootState) => state.DoctorAuth);

  useEffect(() => {
    if (user) {
      navigate('/doctor/DoctorHomeScreen');
    }
    console.log(doctorAuth,'doctor slice auth checkkkkl');
  }, [user, navigate])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await api.post('/doctor/loginDoctor', { email, password });
        const result = response.data;
        dispatch(setCredentials(result));

        
        navigate('/doctor/DoctorHomeScreen');
    } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed. Please try again.');
    }
};



  return (
    <FormContainer>
      <h2>Doctor Login</h2>
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
            <Link to="/doctor/DoctorForgotPasswordScreen">Forgot Password?</Link> 
          </Col>
        </Row>

        <Button type="submit" variant="primary" className="mt-3">
          Login
        </Button>


        <Row className="py-3">
          <Col>
            Don't have an account? <Link to="/doctor/register">Register</Link> 
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default DoctorLoginScreen;
