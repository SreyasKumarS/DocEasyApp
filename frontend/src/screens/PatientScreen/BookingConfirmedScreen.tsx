import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../../axios'
import { RootState } from '../../../store';
import { toast } from 'react-toastify';
import AppointmentsDetails from '../DoctorScreen/AppointmentsDetails';
import {BookingConfirmedScreen} from '../../../interfaces/patientInterfaces'

const BookedAppointmentsScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.PatientAuth.user);
  const patientId = user?.id;
  const [appointments, setAppointments] = useState<BookingConfirmedScreen[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<BookingConfirmedScreen | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); 

  // Fetch the booked appointments
  const fetchBookedAppointments = async () => {
    try {
      const response = await api.get(
        `/patients/getBookedAppointments/${patientId}`
      );
      const sortedAppointments = response.data.appointments.sort((a: BookingConfirmedScreen, b: BookingConfirmedScreen) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching booked appointments:', error);
    }
  };
 

   // Pagination logic
   const indexOfLastAppointment = currentPage * appointmentsPerPage;
   const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
   const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
 
   // Handle page change
   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
 
   // Calculate total pages
   const totalPages = Math.ceil(appointments.length / appointmentsPerPage);
  

  // Open the confirmation modal
  const handleShowModal = (appointment: BookingConfirmedScreen) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  

  // Close the confirmation modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Cancel appointment function
  const cancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await api.put(`/patients/cancelAppointment`, {
        slotId: selectedAppointment.slotId,
        patientId,
        amount: selectedAppointment.amount,
        startTime: selectedAppointment.startTime,
      });
  
      
      toast.success('Appointment cancelled successfully.');
      fetchBookedAppointments(); // Refresh the list after cancellation
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel the appointment.');
    } finally {
      handleCloseModal(); // Close the modal
    }
  };

  // Fetch appointments when the component loads
  useEffect(() => {
    if (patientId) {
      fetchBookedAppointments();
    }
  }, [patientId]);

  return (
    <Container className="py-4 bg-light">
      <h1 className="text-center mb-4">Your Booked Appointments</h1>

      {appointments.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Index</th>
              <th>Date</th>
              <th>Slot Time</th>
              <th>Doctor Name</th>
              <th>Clinic Address</th>
              <th>Locality</th>
              <th>Status</th>
              <th>Amount Paid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentAppointments.map((appointment, index) => (
              <tr key={appointment._id}>
                <td style={{ padding: '15px 18px' }}>{indexOfFirstAppointment + index + 1}</td>
                <td style={{ padding: '15px 18px' }}>{new Date(appointment.date).toLocaleDateString('en-GB')}</td>
                <td>
                <td>
                  {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} -{' '}
                  {new Date(appointment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                </td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.clinicAddress}</td>
                <td>{appointment.locality}</td>
                <td>
                {appointment.bookingStatus === 'confirmed' 
                  ? 'Confirmed' 
                  : appointment.bookingStatus === 'completed' 
                    ? 'Completed' 
                    : 'Cancelled'}
              </td>
                <td>{appointment.amount}</td>
                <td>
                  {appointment.status === 'booked' &&
                    appointment.bookingStatus === 'confirmed' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleShowModal(appointment)}
                      >
                        Cancel
                      </Button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No booked appointments found.</p>
      )}


  {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <Button
          variant="secondary"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-3">Page {currentPage} of {totalPages}</span>
        <Button
          variant="secondary"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="danger" onClick={cancelAppointment}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookedAppointmentsScreen;
