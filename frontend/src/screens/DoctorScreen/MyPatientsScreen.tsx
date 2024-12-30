import React, { useEffect, useState } from 'react';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import { MyPatientsScreen } from '../../../interfaces/doctorInterfaces';

const PatientsScreen: React.FC = () => {
  const [patients, setPatients] = useState<MyPatientsScreen[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5; // Number of records per page
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
    navigate('/doctor/MyPatientPrescriptionScreen', {
      state: {
        bookingId: patient.id,
        patientName: patient.patientName,
        contactNumber: patient.contactNumber,
        slotStartTime: patient.slotStartTime,
        slotEndTime: patient.slotEndTime,
        date: patient.date,
      },
    });
  };

  // Pagination calculations
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients
    .slice()
    .sort((a, b) => new Date(b.date as string).getTime() - new Date(a.date as string).getTime())
    .slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(patients.length / patientsPerPage);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          {currentPatients.map((patient, index) => (
            <tr key={patient.id}>
              <td>{indexOfFirstPatient + index + 1}</td>
              <td>{patient.patientName}</td>
              <td>{patient.contactNumber}</td>
              <td>
                {formatTime(patient.slotStartTime)} to {formatTime(patient.slotEndTime)}
              </td>
              <td>
                {new Date(patient.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                })}
              </td>
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
      {/* Pagination Component */}
      <Pagination className="justify-content-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default PatientsScreen;

