import React, { useEffect, useState } from 'react';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { AppointmentHistoryScreen } from '../../../interfaces/patientInterfaces'
import { Pagination } from 'react-bootstrap';

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.PatientAuth.user);
  const patientId = user?.id;
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  // Fetch appointment history on component load
  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await api.get(
          `/patients/getAppointmentHistory/${patientId}`
        );
        // Sort by date descending
        const sortedAppointments = response.data.data.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error('Error fetching appointment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, [patientId]);

  // Function to format the slot time
  const formatTime = (time: string): string => {
    if (!time) return 'Invalid Time';

    const times = time.split(' - '); // Split into start and end times
    if (times.length !== 2) return 'Invalid Time'; // Ensure valid format

    const [startTime, endTime] = times.map((t) => {
      const date = new Date(t.trim());
      if (isNaN(date.getTime())) return null;
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(date);
    });

    if (!startTime || !endTime) return 'Invalid Time'; // Handle parsing errors
    return `${startTime} to ${endTime}`;
  };

  // Function to format the date as dd-mm-yy
  const formatDate = (date: string): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  };

  if (loading) return <p className="text-center mt-5">Loading appointment history...</p>;

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Appointment History</h1>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Index</th>
            <th>Date</th>
            <th>Slot Time</th>
            <th>Doctor Name</th>
            <th>Actions</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment, index) => (
              <tr key={appointment.bookingId}>
                <td>{indexOfFirstAppointment + index + 1}</td> {/* Adjust index based on page */}
                <td>{formatDate(appointment.date)}</td> {/* Change date format */}
                <td>{formatTime(appointment.slotTime)}</td>
                <td>{appointment.doctorName}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate('/patient/PatientPrescriptionScreen', {
                        state: {
                          bookingId: appointment.bookingId,
                          patientName: appointment.patientName,
                          contactNumber: appointment.contactNumber,
                          doctorName: appointment.doctorName,
                          slotTime: appointment.slotTime,
                          date: appointment.date,
                          specialization: appointment.specialization, // Add specialization
                          clinicAddress: appointment.clinicAddress,   // Add clinic address
                          locality: appointment.locality,             // Add locality
                          experience: appointment.experience,
                        },
                      })
                    }
                  >
                    View Prescription
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() =>
                      navigate('/patient/PatientChat', {
                        state: {
                          doctorId: appointment.doctorId,
                          patientId,
                        },
                      })
                    }
                  >
                    Chat with Doctor
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default AppointmentHistory;
