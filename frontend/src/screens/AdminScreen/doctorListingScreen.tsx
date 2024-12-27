import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import {DoctorListingScreen} from '../../../interfaces/adminInterfaces'


const DoctorListings: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorListingScreen[]>([]);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/admin/fetchAllDoctors', { withCredentials: true });
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Toggle Block/Unblock functionality
  const handleToggleBlock = async (doctorId: string, isApproved: boolean) => {
    try {
      const action = isApproved ? 'block' : 'unblock'; // Define the action based on current approval status
      await api.put(`/admin/${action}/${doctorId}`, {}, {
        withCredentials: true,
      });
      fetchDoctors(); // Fetch the updated list after toggling
    } catch (error) {
      console.error(`Error trying to ${isApproved ? 'block' : 'unblock'} the doctor:`, error);
    }
  };

  const handleVerify = (doctorId: string) => {
    navigate('/admin/doctorProfileScreen', { state: { doctorId } });
  };


  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Doctor Listing</h2>
      <Row>
        <Col md={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Email</th>
                <th>License Number</th>
                <th>Specialization</th>
                <th>Medical License</th>
                <th>Experience</th>
                <th>Profile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <tr key={doctor._id}>
                    <td>{index + 1}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.licenseNumber}</td>
                    <td>{doctor.specialization}</td>
                    <td>
                      <img 
                     src={`${doctor.medicalLicense}`}  
                        alt="Medical License" 
                        style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
                      />
                    </td>
                    <td>{doctor.experience}</td>
                    <td><Button variant="secondary" onClick={() => handleVerify(doctor._id)} className="me-2"> 
                        View
                      </Button>
                      </td>
                    <td>
                      <Button
                        variant={doctor.isApproved ? 'danger' : 'success'}
                        onClick={() => handleToggleBlock(doctor._id, doctor.isApproved)}
                      >
                        {doctor.isApproved ? 'Block' : 'Unblock'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>No doctors found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorListings;
