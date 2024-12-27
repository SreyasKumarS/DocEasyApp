import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const StatisticsPage: React.FC = () => {
  const statisticsData = [
    {
      title: 'Top Revenue-Generating Doctors',
      description: 'View the doctors who generated the most revenue.',
      buttonText: 'View Details',
      link: '/admin/TopRevenueDoctorPage',
    },
    {
      title: 'Top Rated Doctors',
      description: 'See the doctors with the highest patient ratings.',
      buttonText: 'View Details',
      link: '/admin/TopRatedDoctors',
    },
    {
      title: 'Top Booked Patients',
      description: 'Find patients with the highest number of bookings.',
      buttonText: 'View Details',
      link: '/admin/TopPatients',
    },
    {
      title: 'Top Booked Doctors',
      description: 'Discover the most sought-after doctors.',
      buttonText: 'View Details',
      link: '/admin/TopBookedDoctors',
    },
  ];

  return (
    <Container className="py-5">
      <h3 className="text-center mb-5" style={{ fontWeight: 'bold', color: '#0d6efd' }}>
        Professional Statistics
      </h3>
      <Row className="g-4">
        {statisticsData.map((stat, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Card
              className="shadow-lg h-100 border-0"
              style={{
                borderRadius: '12px',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Card.Body className="d-flex flex-column">
                <Card.Title style={{ fontSize: '1.25rem', color: '#0d6efd', fontWeight: '600' }}>
                  {stat.title}
                </Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {stat.description}
                </Card.Text>
                <Button
                  variant="primary"
                  className="mt-auto"
                  href={stat.link}
                  style={{
                    backgroundColor: '#0d6efd',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1rem',
                    fontWeight: '500',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d6efd';
                  }}
                >
                  {stat.buttonText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StatisticsPage;
