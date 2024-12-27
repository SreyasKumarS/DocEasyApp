import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import api from '../../axios'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const SlotsDisplay: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        // Update API endpoint to fetch all slots for the doctor (no specific date)
        const response = await api.get(`/doctor/getDoctorSlotsM/${doctorId}`);
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchSlots();
    }
  }, [doctorId]);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDelete = async (slotId: string) => {
    if (!slotId) {
      console.error("Slot _id is undefined");
      return;
    }
    try {
      await api.delete(`/doctor/deleteSlot/${slotId}`);
      setSlots((prevSlots) => prevSlots.filter((slot) => slot._id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  };

  return (
    <Container>
      <h2>Your Appointment Slots</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {slots.length > 0 ? (
            slots.map((slot) => (
              <Col sm={12} md={6} lg={4} key={slot._id}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{slot.date}</Card.Subtitle>
                    <Card.Text>Status: {slot.status}</Card.Text>
                    <Button variant="danger" onClick={() => handleDelete(slot._id)}>
                      Delete Slot
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>No slots available.</p>
            </Col>
          )}
        </Row>
      )}
      <Button variant="secondary" onClick={() => window.history.back()}>
        Back
      </Button>
    </Container>
  );
};

export default SlotsDisplay;
