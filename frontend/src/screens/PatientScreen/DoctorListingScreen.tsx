import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../axios'
import {DoctorListingScreen} from '../../../interfaces/patientInterfaces'



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
    <Container fluid className="py-0"> {/* Remove padding */}
      <Row noGutters> {/* Use noGutters to remove the gap */}
        <Col md={3} className="p-0"> {/* Set padding to zero for the sidebar */}
        </Col>
        <Col md={9}> {/* Main content area */}
          <h2>{specialization} Doctors</h2>
          <Row className="g-4"> {/* Maintain card spacing */}
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Col key={doctor._id} md={4} className="d-flex">
                  <Card 
                    onClick={() => handleDoctorClick(doctor._id)} 
                    style={{ cursor: 'pointer', height: '100%' }} 
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
                      }}
                    />
                    <Card.Body className="d-flex flex-column"> {/* Use flexbox for consistent spacing */}
                      <Card.Title>{doctor.name}</Card.Title>
                      <Card.Text className="mt-auto"> {/* Push text to the bottom */}
                        <strong>Experience:</strong> {doctor.experience} years <br />
                        <strong>Specialization:</strong> {doctor.specialization} <br />
                        <strong>Contact:</strong> {doctor.contactNumber} <br />
                        <strong>Clinic:</strong> {doctor.clinicAddress} <br />
                        <strong>Locality:</strong> {doctor.locality} <br />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No doctors available for this specialization.</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorsList;
