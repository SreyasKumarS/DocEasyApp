import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useLocation,useNavigate } from 'react-router-dom';
import api from '../../axios'


const AppointmentsDetails: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { date } = location.state || {};
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const [patientDetails, setPatientDetails] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>(''); // State for reason input
  const [showCancellationModal, setShowCancellationModal] = useState<boolean>(false); // State for cancellation modal

  useEffect(() => {
    const fetchSlotsAndPatients = async () => {
      try {
        if (!doctorId || !date) {
          console.warn("Doctor ID or date is missing, skipping fetch.");
          return;
        }

        const response = await api.get(
          `/doctor/getDoctorSlotsByDate/${doctorId}`,
          { params: { date } }
        );

        const slots = response.data;
        setSlots(slots);

        // Fetch patient details for each slot
        const patientDetailsPromises = slots.map((slot: any) =>
          api
            .get(`/doctor/getPatientDetails/${slot._id}`)
            .then((res) => ({ slotId: slot._id, details: res.data }))
            .catch((error) => {
              console.error(`Error fetching patient details for slot ${slot._id}:`, error);
              return null;
            })
        );

        const patientDetailsArray = await Promise.all(patientDetailsPromises);

        // Create a mapping of slotId to patient details
        const detailsMap: Record<string, any> = {};
        patientDetailsArray.forEach((item) => {
          if (item) {
            detailsMap[item.slotId] = item.details;
          }
        });

        setPatientDetails(detailsMap);
        
      } catch (error) {
        console.error('Error fetching slots and patient details:', error);
      }
    };

    fetchSlotsAndPatients();
  }, [doctorId, date]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  const formatTimeSlot = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    return `${startTime.toLocaleTimeString([], options)} - ${endTime.toLocaleTimeString([], options)}`;
  };

  const handleDelete = async (slotId: string) => {
    try {
      await api.delete(`/doctor/deleteSlot/${slotId}`);
      setSlots((prevSlots) => prevSlots.filter((slot) => slot._id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  const handleCancel = (slotId: string) => {
    setSelectedSlotId(slotId); // Set selected slot ID
    setShowCancellationModal(true); // Show cancellation modal
  };

  const handleSubmitCancellation = async () => {
    // if (!cancellationReason) {
    //   alert('Please provide a cancellation reason.');
    //   return;
    // }

    const patient = patientDetails[selectedSlotId || '']; // Retrieve the patient details for the selected slot
    if (!patient) {
      console.error('Patient details not found for the selected slot');
      return;
    }

    if (!selectedSlotId) {
      console.error("Selected Slot ID is null. Cannot proceed.");
      return;
    }
    
    try {
      const payload = {
        slotId: selectedSlotId,
        patientId: patientDetails[selectedSlotId].patientId,
        doctorId: doctorId,
        amount: patientDetails[selectedSlotId].patientAmount,
        reason: cancellationReason,
      };
      // Sending data to backend
      await api.put('/doctor/cancelAppointmentbydoctor', payload);
      
      // Updating the state to reflect the cancellation
      setSlots((prevSlots) =>
        prevSlots.map((slot) =>
          slot._id === selectedSlotId ? { ...slot, status: 'available' } : slot
        )
      );

      alert('Appointment canceled successfully.');
      setShowCancellationModal(false); // Hide modal after cancellation
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };



  const handlePrescriptionClick = (slotId: string) => {
    const patient = patientDetails[slotId]; // Retrieve patient details for the selected slot
    if (!patient || !patient.patientId) {
      alert("Patient details not found for the selected slot.");
      return;
    }
  
    const { patientId } = patient;

  
    navigate(`/doctor/PrescriptionScreen`, {
      state: {
        slotId,
        patientId, // Pass patient ID to the prescription screen
        doctorId, // Pass doctor ID
      },
    });
  };
  




  return (
    <Container>
      <h2>Slots for {formatDate(date)}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Index</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Patient Name</th>
            <th>Contact</th>
            <th>View More</th>
            <th>Cancel</th>
            <th>Actions</th>
            <th>Prescription</th>
          </tr>
        </thead>
        <tbody>
          {slots.length > 0 ? (
            slots.map((slot, index) => {
              const patient = patientDetails[slot._id]; // Fetch patient details for this slot
              return (
                <tr key={slot._id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(slot.date)}</td>
                  <td>{formatTimeSlot(slot.startTime, slot.endTime)}</td>
                  <td>{slot.status}</td>
                  <td>{slot.status === 'booked' ? patient?.patientName || 'Nil' : 'Nil'}</td>
                  <td>{slot.status === 'booked' ? patient?.patientContact || 'Nil' : 'Nil'}</td>

                  <td>
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedSlotId(slot._id); // Set selected slot ID
                        setShowModal(true);
                      }}
                      disabled={slot.status !== 'booked'}
                    >
                      View More Details
                    </Button>
                  </td>
                  <td>
                    {slot.status === 'booked' ? (
                      <Button
                        variant="danger"
                        onClick={() => handleCancel(slot._id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled style={{ filter: 'blur(0px)' }}>
                        Cancel
                      </Button>
                    )}
                  </td>
                  <td>
                      {slot.status === 'available' ? (
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(slot._id)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          disabled
                          style={{ filter: 'blur(0px)', cursor: 'not-allowed' }}
                        >
                          Delete
                        </Button>
                      )}
                    </td>

                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handlePrescriptionClick(slot._id)}
                    >
                      Add Prescription
                    </Button>
                  </td>

                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8}>No slots available for this date.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {selectedSlotId && patientDetails[selectedSlotId] && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Patient Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {patientDetails[selectedSlotId].patientName}</p>
            <p><strong>Contact:</strong> {patientDetails[selectedSlotId].patientContact}</p>
            <p><strong>Email:</strong> {patientDetails[selectedSlotId].patientEmail}</p>
            <p><strong>Age:</strong> {patientDetails[selectedSlotId].patientAge}</p>
            <p><strong>Gender:</strong> {patientDetails[selectedSlotId].patientGender}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Cancellation reason modal */}
      <Modal show={showCancellationModal} onHide={() => setShowCancellationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Cancellation Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formCancellationReason">
            <Form.Label>Reason for Cancellation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter reason for cancellation"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancellationModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitCancellation}>
            Submit Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentsDetails;
