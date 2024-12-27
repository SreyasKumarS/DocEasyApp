import React, { useEffect, useState } from 'react';
import { Card, Container, Form, Button, Col, Row, Spinner, Alert } from 'react-bootstrap';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toast, ToastContainer } from 'react-toastify';
import {EditPatientProfileScreen} from '../../../interfaces/patientInterfaces'



const EditPatientProfile = () => {
  const [formData, setFormData] = useState<EditPatientProfileScreen>({
    name: '',
    email: '',
    age: 0,
    gender: '',
    address: '',
    locality:'',
    contactNumber: '',
    bloodGroup: '',
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);

  useEffect(() => {
    api.get(`/patients/getPatientDetails/${patientId}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Error loading profile data.");
        setLoading(false);
      });
  }, [patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    api.put(`/patients/PatientProfileEdit/${patientId}`, formData)
      .then(() => {
        toast.success("Profile updated successfully!");
        navigate('/patient/PatientProfileScreen');
      })
      .catch(() => {
        toast.error("Failed to update profile.");
        setError("Failed to update profile.");
      });
  };

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card className="shadow-lg" style={{ width: '100%', maxWidth: '800px', borderRadius: '15px', padding: '20px' }}>
        <Card.Header className="text-center bg-primary text-white" style={{ fontSize: '1.3rem', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          Edit Profile
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success" className="text-center">{success}</Alert>}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Enter gender"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>locality</Form.Label>
                <Form.Control
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="Enter locality"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  placeholder="Enter blood group"
                  required
                />
              </Form.Group>
            </Row>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" className="me-2">Save Changes</Button>
              <Button variant="secondary" onClick={() => navigate('/patient/profile')}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditPatientProfile;
