import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateAppointmentSlots: React.FC = () => {
  const navigate = useNavigate();

  const handleCardSelect = (option: string) => {
    // Directly navigate based on the selected option
    if (option === 'WeeklyRecurringSlots') {
      navigate('/doctor/WeeklyRecurringSlots');
    } else if (option === 'Per Day') {
      navigate('/doctor/DailySlot');
    }
     else if (option === 'Daily Recurring') {
      navigate('/doctor/DailyRecurringSlots');
    }
  };

  return (
    <Container>
      <h2>Select Slot Creation Option</h2>
      <Row>
      <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Per Day</Card.Title>
              <Card.Text>Select daily appointments.</Card.Text>
              <Button onClick={() => handleCardSelect('Per Day')} variant="primary">Select Per Day</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Daily</Card.Title>
              <Card.Text>Select Daily Recurring slots for your appointments.</Card.Text>
              <Button onClick={() => handleCardSelect('Daily Recurring')} variant="primary">Select Daily Recurring</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Weekly</Card.Title>
              <Card.Text>Select weeklyRecurring slots for your appointments.</Card.Text>
              <Button onClick={() => handleCardSelect('WeeklyRecurringSlots')} variant="primary">Select Weekly</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAppointmentSlots;
