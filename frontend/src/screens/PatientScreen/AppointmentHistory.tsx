import React, { useEffect, useState } from 'react';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {AppointmentHistoryScreen} from '../../../interfaces/patientInterfaces'


const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentHistoryScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.PatientAuth.user);
  const patientId = user?.id;
  const navigate = useNavigate();

  // Fetch appointment history on component load
  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const response = await api.get(
          `/patients/getAppointmentHistory/${patientId}`
        );
        setAppointments(response.data.data);
        (response.data.data,'histry');
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

  if (loading) return <p className="text-center mt-5">Loading appointment history...</p>;

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
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment.bookingId}>
                <td>{appointment.index}</td>
                <td>{appointment.date}</td>
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
    </div>
  );
};

export default AppointmentHistory;
