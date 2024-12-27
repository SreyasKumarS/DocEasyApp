// src/screens/LandingPage.tsx
import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { BsPersonCircle, BsBook, BsCalendarCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const DemoLandingPage: React.FC = () => {
  return (
    <Container className="py-4 bg-light">
      <div className="text-center mb-4">
        <h1>Welcome to DocEasy!</h1>
        <p className="text-secondary">Your health is our priority.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <BsPersonCircle size={50} className="mb-3" />
              <Card.Title>Login</Card.Title>
              <Card.Text>Already a user? Access your account.</Card.Text>
              <Link to="/patient/login">
                <Button variant="primary">Login</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <BsBook size={50} className="mb-3" />
              <Card.Title>Register</Card.Title>
              <Card.Text>New user? Create an account to get started.</Card.Text>
              <Link to="/patient/register">
                <Button variant="success">Register</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <BsCalendarCheck size={50} className="mb-3" />
              <Card.Title>Learn More</Card.Title>
              <Card.Text>Discover more about our services.</Card.Text>
              <Link to="/patient/about"> {/* Assuming you have an about page */}
                <Button variant="outline-secondary">About Us</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DemoLandingPage;
