import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Ensure react-bootstrap is installed

interface FormContainerProps {
  children: React.ReactNode;
}
const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6} className="card p-5">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
