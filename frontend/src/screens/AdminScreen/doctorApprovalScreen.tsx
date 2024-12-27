import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import {DoctorApprovalScreen} from '../../../interfaces/adminInterfaces'

const DoctorApprovals: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorApprovalScreen[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(''); // Added selected doctor id
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/admin/unapproved', { withCredentials: true });
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleApprove = async (doctorId: string) => {
    try {
      await api.put(`/admin/approve/${doctorId}`, {}, {
        withCredentials: true, 
      });
      fetchDoctors();
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  const handleDelete = async (doctorId: string) => {
    try {
      await api.delete(`/admin/delete/${doctorId}`, {
        withCredentials: true, 
      });
      fetchDoctors();
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  const handleVerify = (doctorId: string) => {
    navigate('/admin/doctorProfileScreen', { state: { doctorId } });
  };

  const handleReject = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowRejectModal(true); // Show the modal
  };

  const submitRejectionReason = async () => {
    try {
      // Send rejection reason to backend and delete doctor record
      await api.post(`/admin/rejectDoctor/${selectedDoctorId}`, {
        reason: rejectionReason,
      }, { withCredentials: true });

      // Close modal, clear reason, and refresh list
      setShowRejectModal(false);
      setRejectionReason('');
      fetchDoctors(); // Refresh the list of doctors
    } catch (error) {
      console.error("Error rejecting doctor:", error);
    }
  };

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Doctor Approval Requests</h2>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors && doctors.length > 0 ? (
                doctors
                  .filter((doctor) => !doctor.isApproved)
                  .map((doctor, index) => (
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
                          style={{ width: '100px', height: 'auto' }} 
                        />
                      </td>
                      <td>{doctor.experience}</td>
                      <td>
                        <Button variant="info" onClick={() => handleVerify(doctor._id)} className="me-2"> 
                          Verify
                        </Button>
                        <Button variant="success" className="me-2" onClick={() => handleApprove(doctor._id)}>
                          Approve
                        </Button>
                        <Button variant="warning" className="me-2" onClick={() => handleReject(doctor._id)}>
                          Reject
                        </Button>
                        <Button variant="danger" className="me-2" onClick={() => handleDelete(doctor._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={8}>No unapproved doctors found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Rejection Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rejectionReason">
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={submitRejectionReason}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorApprovals;
