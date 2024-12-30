import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaUserInjured, FaRegChartBar, FaCog } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 
import ReactStars from 'react-rating-stars-component'; 
import api from '../../axios';

const DoctorHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (doctorId) {
        try {
          const response = await api.get(`/doctor/fetchDoctorById/${doctorId}`);   
          setDoctorProfile(response.data); 
        } catch (error) {
          console.error('Error fetching doctor profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchAverageRating = async () => {
      try {
        const ratingResponse = await api.get(`/patients/getDoctorAverageRating/${doctorId}`);
        setAverageRating(ratingResponse.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };
    



    fetchAverageRating();
    fetchDoctorProfile();
  }, [doctorId]);

  const navigateTo = (route: string) => {
    navigate(route);
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Container fluid className="p-4 doctor-dashboard" style={{ 
      backgroundImage: `url('https://example.com/background-image.jpg')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar shadow p-3 rounded" style={{ backgroundColor: '#3D6F95', color: '#ffffff', width: '180px' }}>
          <h5 className="text-center mb-4">Doctor Portal</h5>
          <Nav className="flex-column">
            <Nav.Link onClick={() => navigateTo('/doctor/DoctorHomeScreen')} className="text-white">Overview</Nav.Link>
            <Nav.Link onClick={() => navigateTo('/doctor/AppointmentsOverview')} className="text-white">Appointments</Nav.Link>
            <Nav.Link onClick={() => navigateTo('/doctor/MyPatientsScreen')} className="text-white">My Patients</Nav.Link>
            <Nav.Link onClick={() => navigateTo('/doctor/DoctorProfileDocside')} className="text-white">Profile</Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          <Container>
            <h1 className="mb-4 text-center text-white">Welcome, {doctorProfile?.name}</h1>
            <Row>
              {/* Profile Card */}
              <Col md={12} className="mb-4">
      <Card className="shadow-lg rounded" style={{ borderColor: '#3A9F98', transition: 'transform 0.3s ease' }}>
        <Card.Body>
          <Row className="align-items-center">
            {/* Image Column */}
            <Col md={4} className="text-center mb-4 mb-md-0">
              <img
                src={doctorProfile?.profilePicture} // This should be the S3 URL
                alt={`${doctorProfile?.name}'s Profile`}
                className="img-fluid rounded-circle shadow-sm mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #3A9F98' }}
              />
            </Col>

            {/* Details Column */}
            <Col md={8}>
              <h5 className="mb-2" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>
                {doctorProfile?.name}
              </h5>
              <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                <strong>Specialization:</strong> {doctorProfile?.specialization || 'N/A'}
              </p>
              <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                <strong>Contact:</strong> {doctorProfile?.email || 'N/A'}
              </p>
              <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                <strong>Clinic Address:</strong> {doctorProfile?.clinicAddress || 'N/A'}
              </p>
              <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                <strong>Bio:</strong> {doctorProfile?.biography || 'N/A'}
              </p>

              {/* Rating Section */}
              {averageRating !== null && (
                <div className="mt-3">
                  <p className="text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                    <strong>Average Rating:</strong> {averageRating.toFixed(1)}
                  </p>
                  <ReactStars
                    count={5}
                    size={24}
                    value={averageRating}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
              {/* Dashboard Quick Links */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover" style={{ background: 'linear-gradient(135deg, #5B9BD5, #4A77B6)', color: '#fff' }}>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt size={30} className="me-3 text-white" />
                      <Card.Title>Create Appointments</Card.Title>
                    </div>
                    <Card.Text>Create, view, and manage your available slots and upcoming appointments.</Card.Text>
                    <Button variant="light" onClick={() => navigateTo('/doctor/CreateAppointmentSlots')} style={{ backgroundColor: '#3A9F98', color: '#fff' }}>Create Slots</Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover" style={{ background: 'linear-gradient(135deg, #5B9BD5, #4A77B6)', color: '#fff' }}>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaUserInjured size={30} className="me-3 text-white" />
                      <Card.Title>My Patients</Card.Title>
                    </div>
                    <Card.Text>Access patient records, manage interactions, and update medical notes.</Card.Text>
                    <Button variant="light" onClick={() => navigateTo('/doctor/MyPatientsScreen')} style={{ backgroundColor: '#3A9F98', color: '#fff' }}>View Patients</Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover" style={{ background: 'linear-gradient(135deg, #5B9BD5, #4A77B6)', color: '#fff' }}>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaRegChartBar size={30} className="me-3 text-white" />
                      <Card.Title>View Appointments</Card.Title>
                    </div>
                    <Card.Text>View and analyze your appointment trends and patient engagement.</Card.Text>
                    <Button variant="light" onClick={() => navigateTo('/doctor/AppointmentsOverview')} style={{ backgroundColor: '#3A9F98', color: '#fff' }}>View Appointments</Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover" style={{ background: 'linear-gradient(135deg, #5B9BD5, #4A77B6)', color: '#fff' }}>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaCog size={30} className="me-3 text-white" />
                      <Card.Title>Profile & Settings</Card.Title>
                    </div>
                    <Card.Text>Update your profile details and adjust account settings.</Card.Text>
                    <Button variant="light" onClick={() => navigateTo('/doctor/DoctorProfileDocside')} style={{ backgroundColor: '#3A9F98', color: '#fff' }}>Manage Profile</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorHomeScreen;
