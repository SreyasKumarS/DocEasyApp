import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaUsers, FaCog, FaDollarSign,FaChartBar,FaFileAlt,FaTable } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../axios'


const AdminHomeScreen: React.FC = () => {
  const navigate = useNavigate();

  // State for Modal visibility
  const [showModal, setShowModal] = useState(false);

  // State for platform fee
  const [platformFee, setPlatformFee] = useState({
    percentage: '',
    fixedFee: '',
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlatformFee({ ...platformFee, [name]: value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      (platformFee.percentage !== '' && platformFee.fixedFee !== '') ||
      (platformFee.percentage === '' && platformFee.fixedFee === '')
    ) {
      alert('Please provide only one value: either percentage fee or fixed fee.');
      return;
    }
  
    try {
      const payload = {
        percentageFee: platformFee.percentage !== '' ? parseFloat(platformFee.percentage) : null,
        fixedFee: platformFee.fixedFee !== '' ? parseFloat(platformFee.fixedFee) : null,
      };
  
  
      const response = await api.post(
        '/admin/updatePlatformFee',
        payload,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        toast.success('Platform Fee updated successfully!');
        handleClose();
      }
    } catch (error) {
      console.error('Error updating platform fee:', error);
      toast.error('Failed to update platform fee. Please try again.');
    }
  };
  

  const navigateTo = (route: string) => {
    navigate(route);
  };

  return (
    <Container fluid className="p-4">
      <Row>
        {/* Sidebar Navigation */}
        <Col md={3} className="sidebar">
          <Nav className="flex-column bg-light p-3 h-100 shadow-sm rounded">
            <h5 className="text-primary">Admin Dashboard</h5>
            <Nav.Link onClick={() => navigateTo('/admin/adminHomeScreen')} className="text-dark">
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => navigateTo('/admin/DoctorApprovalScreen')} className="text-dark">
              Doctor Approvals
            </Nav.Link>
            <Nav.Link onClick={() => navigateTo('/admin/patientListingScreen')} className="text-dark">
              Manage Patients
            </Nav.Link>
            <Nav.Link onClick={() => navigateTo('/admin/doctorListingScreen')} className="text-dark">
              Manage Doctors
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Container>
            <h1 className="mb-4 text-center">Admin Portal Overview</h1>
            <Row>
              {/* Doctor Approvals Card */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaUserMd size={30} className="me-3 text-primary" /> {/* Icon */}
                      <Card.Title>Doctor Approvals</Card.Title>
                    </div>
                    <Card.Text>
                      Review and approve or reject doctor registrations to allow them access.
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="btn-hover"
                      onClick={() => navigateTo('/admin/DoctorApprovalScreen')}
                    >
                      Manage Approvals
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Manage Users Card */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaUsers size={30} className="me-3 text-secondary" /> {/* Icon */}
                      <Card.Title>Manage Users</Card.Title>
                    </div>
                    <Card.Text>
                      View and manage the users who are registered on the platform.
                    </Card.Text>
                    <Button
                      variant="secondary"
                      className="btn-hover"
                      onClick={() => navigateTo('/admin/patientListingScreen')}
                    >
                      Manage Users
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Manage Doctors Card */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaCog size={30} className="me-3 text-warning" /> {/* Icon */}
                      <Card.Title>Manage Doctors</Card.Title>
                    </div>
                    <Card.Text>
                      View and manage the Doctors who are registered on the platform.
                    </Card.Text>
                    <Button
                      variant="warning"
                      className="btn-hover"
                      onClick={() => navigateTo('/admin/doctorListingScreen')}
                    >
                      Manage Doctors
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Update Platform Fee Card */}
              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaDollarSign size={30} className="me-3 text-success" /> {/* Icon */}
                      <Card.Title>Update Platform Fee</Card.Title>
                    </div>
                    <Card.Text>
                      Adjust the platform fee as a percentage or fixed monetary value.
                    </Card.Text>
                    <Button
                      variant="success"
                      className="btn-hover"
                      onClick={handleShow}
                    >
                      Update Fee
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

            <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaTable size={30} className="me-3 text-info" /> {/* Icon with text-info for statistics */}
                      <Card.Title>Statistics</Card.Title>
                    </div>
                    <Card.Text>
                      Access detailed statistical data about platform performance.
                    </Card.Text>
                    <Button
                      variant="info"
                      className="btn-hover"
                      onClick={() => navigateTo('/admin/StatisticsPage')}
                    >
                      View Statistics
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                  <Card className="shadow-sm card-hover">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <FaChartBar size={30} className="me-3 text-black" /> {/* Icon with black color */}
                        <Card.Title>Charts</Card.Title>
                      </div>
                      <Card.Text>
                        Explore graphical representations of platform data.
                      </Card.Text>
                      <Button
                        variant="dark" /* Change to black button variant */
                        className="btn-hover"
                        onClick={() => navigateTo('/admin/ChartPage')}
                      >
                        View Charts
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>



              <Col md={6} className="mb-4">
                <Card className="shadow-sm card-hover">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <FaFileAlt size={30} className="me-3 text-danger" /> {/* Icon with text-danger for reports */}
                      <Card.Title>Reports</Card.Title>
                    </div>
                    <Card.Text>
                      View and generate detailed reports on platform activity.
                    </Card.Text>
                    <Button
                      variant="danger"
                      className="btn-hover"
                      onClick={() => navigateTo('/admin/ReportsPage')}
                    >
                      View Reports
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </Container>
        </Col>
      </Row>

      {/* Update Platform Fee Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Platform Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Percentage Fee (%)</Form.Label>
              <Form.Control
                type="number"
                name="percentage"
                value={platformFee.percentage}
                onChange={handleChange}
                placeholder="Enter percentage fee"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fixed Fee (in $)</Form.Label>
              <Form.Control
                type="number"
                name="fixedFee"
                value={platformFee.fixedFee}
                onChange={handleChange}
                placeholder="Enter fixed fee"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Footer (Optional) */}
      <footer className="text-center py-4 bg-light shadow-sm mt-auto">
        <p className="mb-0 text-muted">© 2024 Admin Portal. All Rights Reserved.</p>
      </footer>
    </Container>
  );
};

export default AdminHomeScreen;






