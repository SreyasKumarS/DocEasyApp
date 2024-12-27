import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/patientComponents/FormContainer"; 
import { toast } from 'react-toastify';
import api from '../../axios'


const DoctorRegisterScreen: React.FC = () => {  
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>(''); 
  const [licenseNumber, setLicenseNumber] = useState<string>(''); 
  const [contactNumber, setContactNumber] = useState<string>(''); 
  const [experience, setExperience] = useState<string>(''); 
  const [clinicAddress, setClinicAddress] = useState<string>(''); 
  const [locality, setLocality] = useState<string>(''); 
  const [idProof, setIdProof] = useState<File | null>(null); 
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [biography, setBiography] = useState<string>(''); 
  const [licenseFile, setLicenseFile] = useState<File | null>(null); 
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(40);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [consultationFee, setConsultationFee] = useState<string>(''); // Add this state



  const navigate = useNavigate();


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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regex patterns
    const nameRegex = /^[a-zA-Z ]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6}$/;
    const licenseNumberRegex = /^[A-Za-z0-9]+$/;
    const contactNumberRegex = /^\d{10}$/;  
    const experienceRegex = /^\d+$/;
    const localityRegex = /^[a-zA-Z ]+$/; 
    const consultationFeeRegex = /^\d+(\.\d{1,2})?$/;

    if (!isOtpSent) {
      // Validation checks
      if (!nameRegex.test(name)) {
        toast.error('Name should contain only letters and spaces');
      } else if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
      } else if (!passwordRegex.test(password)) {
        toast.error('Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number');
      } else if (password !== confirmPassword) {
        toast.error('Passwords do not match');
      } else if (!specialization) {
        toast.error('Please provide your specialization');
      } else if (!licenseNumberRegex.test(licenseNumber)) {
        toast.error('License Number should contain only alphanumeric characters');
      } else if (!contactNumberRegex.test(contactNumber)) {
        toast.error('Contact Number must be a 10-digit number');
      } else if (!experienceRegex.test(experience)) {
        toast.error('Experience should be a valid number');
      } else if (!clinicAddress) {
        toast.error('Please provide the clinic address');
      } else if (!localityRegex.test(locality)) {  
        toast.error('Locality should contain only letters and spaces');
      } else if (!biography) {
        toast.error('Please provide a short biography or description');
      } else if (!licenseFile) {  
        toast.error('Please upload your medical license certificate');
      } else if (!idProof) {
        toast.error('Please upload your ID proof');
      } else if (!profilePicture) {  
        toast.error('Please upload your Picture');
      } else if (!consultationFeeRegex.test(consultationFee)) {
        toast.error('Consultation Fee must be a valid number (e.g., 50, 100.25)');
      }else {
        // FormData to handle file uploads
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('specialization', specialization);
        formData.append('licenseNumber', licenseNumber);
        formData.append('licenseFile', licenseFile); 
        formData.append('contactNumber', contactNumber);
        formData.append('experience', experience);
        formData.append('clinicAddress', clinicAddress);
        formData.append('locality', locality);
        formData.append('idProof', idProof); 
        formData.append('profilePicture', profilePicture); 
        formData.append('biography', biography);
        formData.append('consultationFee', consultationFee);


        try {
          const response = await api.post('/doctor/register', formData);
          toast.success('OTP sent successfully!');
          setIsOtpSent(true);
          setTimer(10);
          setResendDisabled(true);
        } catch (error: any) {
          toast.error(error.response?.data?.message || error.message || 'Doctor already exists! Try another email.');
        }
      }
    } else if (isOtpSent && otp.trim() !== '') {
      try {
        const response = await api.post('/doctor/verify-otpDoctor', { email, otp });
        setOtpVerified(true);
        toast.success('OTP verified successfully!');
      } catch (error) {
        console.error('Error verifying OTP:', error);
        toast.error('Invalid OTP!');
      }
    } else {
      toast.error('Please enter the OTP');
    }
  };
  
  useEffect(() => {
    if (otpVerified) {
      toast.success('Registration completed successfully!');
      navigate('/doctor/login'); 
    }
  }, [otpVerified, navigate]);

  const resendOtpHandler = async () => {
    try {
      await api.post('/doctor/resend-otp', { email });
      setTimer(10);
      setResendDisabled(true);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <FormContainer>
      <h1>{!isOtpSent ? 'Doctor Sign Up' : 'Enter OTP'}</h1>
      <Form onSubmit={submitHandler}>
        {!isOtpSent ? (
          <>
            {/* Doctor Registration Form */}
            <Form.Group className="my-2" controlId='name'>
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                // type="email"
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

            <Form.Group className="my-2" controlId='specialization'>
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
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

            <Form.Group className="my-2" controlId='experience'>
              <Form.Label>Experience</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Years of Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId='clinicAddress'>
              <Form.Label>Clinic Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Clinic Address"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="my-2" controlId='locality'>
              <Form.Label>Locality</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Locality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="my-2" controlId='consultationFee'>
                <Form.Label>Consultation Fee</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Consultation Fee (in USD)"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  required
                />
              </Form.Group>


            <Form.Group className="my-2" controlId='biography'>
              <Form.Label>Biography / Short Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Write a short biography"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                required
              />
            </Form.Group>


            <Form.Group className="my-2" controlId='licenseNumber'>
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId='licenseFile'>
              <Form.Label>Medical License Certificate</Form.Label>
              <Form.Control
                type="file"
                name="licenseFile"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement; 
                  setLicenseFile(target.files ? target.files[0] : null);
                }}
                required
                />
            </Form.Group>

            <Form.Group className="my-2" controlId='idProof'>
              <Form.Label>ID Proof</Form.Label>
              <Form.Control
                type="file"
                name="idProof"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setIdProof(target.files ? target.files[0] : null);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId='profilePicture'>
              <Form.Label>ProfilePicture</Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setProfilePicture(target.files ? target.files[0] : null);
                }}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Send OTP
            </Button>
          </>
        ) : (
          <>
            {/* OTP Input Section */}
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
                <Button type="submit" variant="primary" className="mt-3">
                  Verify OTP
                </Button>
              </Col>
              <Col>
                <Button
                  variant="secondary"
                  disabled={resendDisabled}
                  onClick={resendOtpHandler}
                >
                  {resendDisabled ? `Resend in ${timer}s` : 'Resend OTP'}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </FormContainer>
  );
};

export default DoctorRegisterScreen;