import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Badge, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import { BsHeart, BsPersonCheck } from 'react-icons/bs';
import {SpecializationScreen,SpecializationScreenDoctor} from '../../../interfaces/patientInterfaces'


const Specializations = () => {
  const [specializations, setSpecializations] = useState<SpecializationScreen[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<SpecializationScreenDoctor[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDoctors, setShowDoctors] = useState(false); // New state to control initial view
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (search || filter) {
      fetchDoctors();
      setShowDoctors(true);
    } else {
      setShowDoctors(false); // Show specializations if no search/filter
    }
  }, [page, search, filter]);

  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/patients/specializations');
      setSpecializations(response.data.specializations || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/patients/search', {
        params: { search, specialization: filter, page },
      });
      setFilteredDoctors(response.data.result.doctors || []);
      setTotalPages(response.data.result.totalPages || 1);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handleSpecializationClick = (spec: SpecializationScreen | SpecializationScreenDoctor) => {
    navigate('/patient/DoctorsList', { state: { specialization: spec.name } });
  };

  const handleDoctorClick = (doctorId: string) => {
    navigate('/patient/DoctorDetailsPagePatient', { state: { doctorId } });
  };

  return (
    <Container className="py-4">
    <h2>Specializations</h2>

    <Row className="align-items-center mb-3">
      <Col md={6}>
        <h6 className="text-muted mb-1">Search</h6>
        <InputGroup>
          <Form.Control
            placeholder="Search by doctor name or specialization"
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </Col>
      <Col md={6}>
        <h6 className="text-muted mb-1">Filter by Specialization</h6>
        <Form.Select value={filter} onChange={handleFilterChange}>
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec._id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>

      <Row>
        {!showDoctors ? (
          specializations.map((spec) => (
            <Col key={spec._id} md={4} className="mb-3">
              <Card
                onClick={() => handleSpecializationClick(spec)}
                style={{ cursor: 'pointer' }}
                className="shadow-sm h-100"
              >
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <BsHeart size={30} className="me-2 text-primary" />
                    <Card.Title className="mb-0">{spec.name}</Card.Title>
                  </div>
                  <Card.Text>
                    <Badge bg={spec.isActive ? 'success' : 'secondary'}>
                      {spec.isActive ? 'Available' : 'Unavailable'}
                    </Badge>
                    <br />
                    <small className="text-muted">
                      <BsPersonCheck className="me-1" />
                      {spec.doctorCount} {spec.doctorCount === 1 ? 'Doctor' : 'Doctors'} Available
                    </small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Col key={doctor._id} md={6} lg={4} className="mb-3">
  <Card
    onClick={() =>  handleDoctorClick(doctor._id)}
    style={{
      cursor: 'pointer',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease',
    }}
    className="h-100"
  >
    {/* Profile Picture */}
    <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
      <Card.Img
        variant="top"
        src={doctor.profilePicture}
        alt={`${doctor.name}'s profile`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          filter: 'brightness(0.95)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {doctor.name}
      </div>
    </div>

    {/* Card Body */}
    <Card.Body
      style={{
        padding: '15px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Card.Text style={{ color: '#333', lineHeight: '1.6', fontSize: '0.85rem' }}>
        <strong style={{ color: '#007BFF' }}>Experience:</strong> {doctor.experience} years <br />
        <strong style={{ color: '#007BFF' }}>Specialization:</strong> {doctor.specialization} <br />
        <strong style={{ color: '#007BFF' }}>Contact:</strong> {doctor.contactNumber} <br />
        <strong style={{ color: '#007BFF' }}>Clinic:</strong> {doctor.clinicAddress} <br />
        <strong style={{ color: '#007BFF' }}>Locality:</strong> {doctor.locality}
      </Card.Text>
    </Card.Body>
  </Card>
</Col>

          ))
        ) : (
          <p>No doctors found with the given criteria.</p>
        )}
      </Row>

      <Pagination className="justify-content-center">
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default Specializations;
