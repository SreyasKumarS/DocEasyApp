import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import {PatientListingScreen} from '../../../interfaces/adminInterfaces'
import api from '../../axios'



const PatientListings: React.FC = () => {
  const [patients, setPatients] = useState<PatientListingScreen[]>([]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/admin/patientlisting', { withCredentials: true });
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, []);
  
  const handleDelete = async (patientId: string) => {
    try {
      await api.delete(`/admin/deletePatient/${patientId}`, {
        withCredentials: true, 
      });
      fetchPatients(); 
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Patient Listings</h2>
      <Row>
        <Col md={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Index</th> 
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient._id}>
                    <td>{index + 1}</td> 
                    <td>{patient.name}</td>
                    <td>{patient.email}</td>
                    <td>{patient.isVerified ? 'Yes' : 'No'}</td>
                    <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(patient._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No patients found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientListings;
