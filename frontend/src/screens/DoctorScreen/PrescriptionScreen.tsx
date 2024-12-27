import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import api from '../../axios'
import { useLocation, useNavigate } from 'react-router-dom';
import {PrescriptionScreen} from '../../../interfaces/doctorInterfaces'


const PrescriptionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slotId, patientId, doctorId } = location.state || {}; // Extracting passed state

  const [prescription, setPrescription] = useState<PrescriptionScreen>({
    patientId: patientId || '',
    doctorId: doctorId || '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', duration: '' }], // Initial medication
    additionalNotes: '',
  });

  // Unified handler for updating prescription data
  const handlePrescriptionChange = (field: string, value: any) => {
    setPrescription((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...prescription.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setPrescription((prev) => ({ ...prev, medications: updatedMedications }));
  };

  const addMedicationField = () => {
    setPrescription((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', duration: '' }],
    }));
  };

  const removeMedicationField = (index: number) => {
    setPrescription((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...prescription,
        slotId,
        patientId
      };


      // Make an Axios POST request to the backend
      await api.post('/doctor/addPrescription', payload);

      alert('Prescription submitted successfully!');
      navigate('/doctor/AppointmentsOverview'); // Navigate back to the appointments page or another desired page
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Failed to submit the prescription. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Prescription</h2>
      <Form>
        <Form.Group controlId="formPatientId" className="mb-3">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control type="text" value={prescription.patientId} readOnly disabled />
        </Form.Group>

        <Form.Group controlId="formDoctorId" className="mb-3">
          <Form.Label>Doctor ID</Form.Label>
          <Form.Control type="text" value={prescription.doctorId} readOnly disabled />
        </Form.Group>

        <Form.Group controlId="formDiagnosis" className="mb-3">
          <Form.Label>Diagnosis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={prescription.diagnosis}
            onChange={(e) => handlePrescriptionChange('diagnosis', e.target.value)}
            placeholder="Enter diagnosis"
          />
        </Form.Group>

        <Form.Label>Medications</Form.Label>
        {prescription.medications.map((medication, index) => (
          <Row key={index} className="mb-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Medication Name"
                value={medication.name}
                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Dosage"
                value={medication.dosage}
                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Duration (e.g., 5 days)"
                value={medication.duration}
                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button
                variant="danger"
                onClick={() => removeMedicationField(index)}
                className="w-100"
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={addMedicationField}>
          Add Medication
        </Button>

        <Form.Group controlId="formAdditionalNotes" className="mt-4 mb-3">
          <Form.Label>Additional Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={prescription.additionalNotes}
            onChange={(e) => handlePrescriptionChange('additionalNotes', e.target.value)}
            placeholder="Add any additional notes"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit}>
          Submit Prescription
        </Button>
      </Form>
    </Container>
  );
};

export default PrescriptionPage;
