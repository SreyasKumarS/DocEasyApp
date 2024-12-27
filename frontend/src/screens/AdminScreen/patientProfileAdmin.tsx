import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { BsPerson, BsEnvelope, BsGenderAmbiguous, BsDroplet, BsGeoAlt, BsPhone, BsShieldCheck, BsCalendar3 } from 'react-icons/bs';
import api from '../../axios'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Sidebar from '../../components/patientComponents/SideBar';
import { useNavigate } from 'react-router-dom';
import {PatientProfileAdminScreen} from '../../../interfaces/adminInterfaces'



const PatientProfile = () => {
  const [patientData, setPatientData] = useState<PatientProfileAdminScreen | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);

  useEffect(() => {
    api.get(`/patients/getPatientDetails/${patientId}`)
      .then(response => {
        setPatientData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the patient data!", error);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!patientData) {
    return (
      <Container className="py-5 text-center">
        <p>Unable to load profile data. Please try again later.</p>
      </Container>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container className="py-5 flex-grow-1 d-flex justify-content-center">
        <Card className="shadow-lg" style={{ width: '100%', maxWidth: '900px', borderRadius: '15px', padding: '20px' }}>
          <Card.Header className="text-center bg-primary text-white" style={{ fontSize: '1.3rem', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
            <p className="mb-1"><small>ID: {patientData._id}</small></p>
          </Card.Header>

          <Card.Body>
            <Row className="mb-3">
              <Col className="text-center">
                <h5 style={{ fontSize: '1.2rem' }}>
                  <BsShieldCheck /> Verified:{" "}
                  <Badge bg={patientData.isVerified ? "success" : "secondary"}>
                    {patientData.isVerified ? "Yes" : "No"}
                  </Badge>
                </h5>
              </Col>
            </Row>

            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsPerson /> Name:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.name}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsEnvelope /> Email:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.email}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsCalendar3 /> Age:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.age}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsGenderAmbiguous /> Gender:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.gender}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsGeoAlt /> Address:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.address}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsPhone /> Contact:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.contactNumber}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsDroplet /> Blood Group:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>{patientData.bloodGroup}</Col>
            </Row>
            <Row>
              <Col xs={4} className="text-secondary text-end" style={{ fontSize: '1.1rem' }}>
                <BsCalendar3 /> Joined Date:
              </Col>
              <Col style={{ fontSize: '1.1rem' }}>
                {patientData.createdAt ? new Date(patientData.createdAt).toLocaleString() : 'N/A'}
              </Col>
            </Row>
          </Card.Body>

          <Card.Footer className="text-center">
            <Button variant="primary" className="me-2" onClick={() => navigate('/EditPatientProfile')}>
              Edit Profile
            </Button>
            <Button variant="secondary" onClick={() => navigate('/HomeScreen')}>
              Back
            </Button>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};

export default PatientProfile;
