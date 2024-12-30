import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Pagination  } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { useLocation } from 'react-router-dom';
import api from '../../axios'


const AppointmentsOverview: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get(
          `/doctor/AppointmentsOverView/${doctorId}`,
          { params: { date } }
        );

        const sortedAppointments = response.data.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (doctorId) fetchAppointments();
  }, [doctorId, date]);


 // Pagination logic
 const indexOfLastAppointment = currentPage * appointmentsPerPage;
 const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
 const currentAppointments = appointments.slice(
   indexOfFirstAppointment,
   indexOfLastAppointment
 );

 const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

 const handlePageChange = (pageNumber: number) => {
   setCurrentPage(pageNumber);
 };



  return (
    <Container>
      <h2>Your Appointments Overview</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Appointments</th>
            <th>Available Slots</th>
            <th>Booked Slots</th>
            <th>completed Slots</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <tr key={appointment.date}>
                <td>{new Date(appointment.date).toLocaleDateString('en-GB')}</td>
                <td>{appointment.totalSlots}</td>
                <td>{appointment.availableSlots}</td>
                <td>{appointment.bookedSlots}</td>
                <td>{appointment.completedSlots}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate('/doctor/AppointmentsDetails', {
                        state: { date: appointment.date },
                      })
                    }
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No appointments available.</td>
            </tr>
          )}
        </tbody>
      </Table>


      {/* Pagination Component */}
      {totalPages > 1 && (
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
      )}
      
    </Container>
  );
};

export default AppointmentsOverview;
