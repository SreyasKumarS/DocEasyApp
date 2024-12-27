import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
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
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
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
    </Container>
  );
};

export default AppointmentsOverview;
