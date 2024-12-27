import React, { useEffect, useState } from 'react';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container } from 'react-bootstrap';
import {MyPatientsScreen} from '../../../interfaces/doctorInterfaces'


const PatientsScreen: React.FC = () => {
  const [patients, setPatients] = useState<MyPatientsScreen[]>([]); // Use Patient[] as the type
  const navigate = useNavigate();

  // Fetch completed bookings on component load
  useEffect(() => {
    api
      .get<MyPatientsScreen[]>('/doctor/getCompletedBookings') 
      .then((response) => setPatients(response.data))
      .catch((error) =>
        console.error('Error fetching completed bookings:', error)
      );
  }, []);

  // Format time to '9:00 AM to 10:00 AM' format
  const formatTime = (time: string): string => {
    const date = new Date(time);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Handle View Prescription button click
  const viewPrescription = (patient: MyPatientsScreen): void => {
  
    // Navigate to MyPatientPrescriptionScreen with patient details
    navigate('/doctor/MyPatientPrescriptionScreen', {
      state: {  bookingId: patient.id, // Ensure this value is valid
        patientName: patient.patientName,
        contactNumber: patient.contactNumber,
        slotStartTime: patient.slotStartTime,
        slotEndTime: patient.slotEndTime,
        date: patient.date},
    });
  };
  

  return (
    <Container>
      <h1 className="my-4 text-center">Patients with Completed Bookings</h1>
      <Table striped bordered hover responsive className="text-center">
        <thead className="thead-dark">
          <tr>
            <th>Index</th>
            <th>Patient Name</th>
            <th>Contact Number</th>
            <th>Slot Time</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id}>
              <td>{index + 1}</td>
              <td>{patient.patientName}</td>
              <td>{patient.contactNumber}</td>
              <td>
                {formatTime(patient.slotStartTime)} to{' '}
                {formatTime(patient.slotEndTime)}
              </td>
              <td>{patient.date}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => viewPrescription(patient)}
                >
                  View Prescription
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PatientsScreen;

