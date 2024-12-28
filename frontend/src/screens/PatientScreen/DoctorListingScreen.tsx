import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../axios';
import { DoctorListingScreen } from '../../../interfaces/patientInterfaces';
import { FaStethoscope, FaUserMd } from 'react-icons/fa';

const DoctorsList = () => {
  const location = useLocation();
  const specialization = location.state?.specialization;
  const [doctors, setDoctors] = useState<DoctorListingScreen[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get(`/patients/getDoctorsBySpecialization/${specialization}`);

        if (response.data && Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    if (specialization) {
      fetchDoctors();
    }
  }, [specialization]);

  const handleDoctorClick = (doctorId: string) => {
    navigate('/patient/DoctorDetailsPagePatient', { state: { doctorId } });
  };

  return (
    <Container fluid className="py-0" style={{ minHeight: '100vh' }}> {/* Full height of the screen */}
      <Row noGutters className="justify-content-center">
        <Col md={3} className="p-4 bg-light"> {/* Left Sidebar */}
          <h3>{specialization}</h3>
          <div className="mb-4">
          <FaStethoscope size={30} className="text-primary" />
          <p>
            {specialization} is a specialized field of medicine focusing on diagnosing and treating various conditions. 
            Doctors in this field have extensive training and experience in providing the best care for patients with specific needs.
          </p>
          </div>
          <h5>Why Choose a {specialization} Specialist?</h5>
          <ul>
            <li>Expert in treating complex cases.</li>
            <li>Personalized care based on years of experience.</li>
            <li>Access to the latest treatment options and technology.</li>
          </ul>
          <Button variant="primary" className="w-100 mt-3">Learn More</Button>
        </Col>

        <Col md={9} className="p-4"> {/* Main content area */}
          <h2 className="text-center mb-4">{specialization} Doctors</h2>
          <Row className="g-4 justify-content-center"> {/* Center the cards */}
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Col key={doctor._id} md={4} sm={6} xs={12} className="d-flex justify-content-center">
                  <Card 
                    onClick={() => handleDoctorClick(doctor._id)} 
                    style={{
                      cursor: 'pointer', 
                      height: '100%',
                      borderRadius: '10px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                      transition: 'transform 0.3s ease',
                    }}
                    className="shadow-sm h-100"
                  >
                    <Card.Img 
                      variant="top" 
                      src={`${doctor?.profilePicture}`}
                      alt={`${doctor.name}'s profile`} 
                      style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px',
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{doctor.name}</Card.Title>
                      <Card.Text className="mt-auto">
                        <strong>Experience:</strong> {doctor.experience} years <br />
                        <strong>Specialization:</strong> {doctor.specialization} <br />
                        <strong>Contact:</strong> {doctor.contactNumber} <br />
                        <strong>Clinic:</strong> {doctor.clinicAddress} <br />
                        <strong>Locality:</strong> {doctor.locality} <br />
                      </Card.Text>
                      <Button variant="primary" onClick={() => handleDoctorClick(doctor._id)}>
                        View Profile
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <p>No doctors available for this specialization.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorsList;
