import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'

const DailySlot: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [morningStart, setMorningStart] = useState<string>('09:00');
  const [morningEnd, setMorningEnd] = useState<string>('12:00');
  const [eveningStart, setEveningStart] = useState<string>('15:00');
  const [eveningEnd, setEveningEnd] = useState<string>('17:00');
  const [duration, setDuration] = useState<number>(30);

  const [createMorningSlot, setCreateMorningSlot] = useState<boolean>(true);
  const [createEveningSlot, setCreateEveningSlot] = useState<boolean>(true);

  const navigate = useNavigate();
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Conditional morning slot creation
      if (createMorningSlot) {
        const morningStartHour = parseInt(morningStart.split(':')[0]);
        const morningEndHour = parseInt(morningEnd.split(':')[0]);

        await api.post(`/doctor/DailySlots/${doctorId}`, {
          date,
          startHour: morningStartHour,
          endHour: morningEndHour,
          slotDuration: duration,
        });
        ('Morning slots created successfully');
      }

      // Conditional evening slot creation
      if (createEveningSlot) {
        const eveningStartHour = parseInt(eveningStart.split(':')[0]);
        const eveningEndHour = parseInt(eveningEnd.split(':')[0]);

        await api.post(`/doctor/DailySlots/${doctorId}`, {
          date,
          startHour: eveningStartHour,
          endHour: eveningEndHour,
          slotDuration: duration,
        });
        ('Evening slots created successfully');
      }

      navigate('/doctor/DoctorSlotsDisplay');
    } catch (error) {
      if ((error)) {
        toast.error(`Error creating slots`);
      } else if (error instanceof Error) {
        toast.error(`Error creating slots: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while creating slots.');
      }
    }
  };
  
  return (
    <Container>
      <h2>Create Appointment Slots</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formDate">
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCreateMorningSlot">
          <Form.Check
            type="checkbox"
            label="Create Morning Slot"
            checked={createMorningSlot}
            onChange={(e) => setCreateMorningSlot(e.target.checked)}
          />
        </Form.Group>
        {createMorningSlot && (
          <>
            <h5>Morning Slot</h5>
            <Row>
              <Col>
                <Form.Group controlId="formMorningStart">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formMorningEnd">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Form.Group controlId="formCreateEveningSlot">
          <Form.Check
            type="checkbox"
            label="Create Evening Slot"
            checked={createEveningSlot}
            onChange={(e) => setCreateEveningSlot(e.target.checked)}
          />
        </Form.Group>
        {createEveningSlot && (
          <>
            <h5>Evening Slot</h5>
            <Row>
              <Col>
                <Form.Group controlId="formEveningStart">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eveningStart}
                    onChange={(e) => setEveningStart(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formEveningEnd">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={eveningEnd}
                    onChange={(e) => setEveningEnd(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Form.Group controlId="formDuration">
          <Form.Label>Slot Duration (minutes)</Form.Label>
          <Form.Control
            as="select"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">Create Slots</Button>
      </Form>
    </Container>
  );
};

export default DailySlot;
