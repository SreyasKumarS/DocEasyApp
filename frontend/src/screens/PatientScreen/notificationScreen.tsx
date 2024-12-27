import React, { useEffect, useState } from 'react';
import api from '../../axios'
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {NotificationScreen} from '../../../interfaces/patientInterfaces'


const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!patientId) return; // Ensure patientId exists before making the API call
      try {
        const response = await api.get(`/patients/getNotifications/${patientId}`);
        setNotifications(response.data.notifications); 
        (response.data.notifications,'ntfyyyy');
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [patientId]);


  const markAsRead = async (id: string) => {
    try {
      await api.put(`/patients/updateNotificationStatus/${id}`, { status: 'read' });
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, status: 'read' } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Notifications</h2>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          {notifications.map((notification) => (
            <Col md={6} key={notification._id}>
              <Card className={`shadow-sm ${notification.status === 'unread' ? 'border-danger' : ''}`}>
                <Card.Body>
                  <Row>
                    <Col xs={10}>
                      <Card.Title>{notification.message}</Card.Title>
                      <Card.Text className="text-muted">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Card.Text>
                      {
                          notification.refundAmount ? (
                            <Card.Text className="text-danger">
                              Refund: ₹{notification.refundAmount} ({notification.refundStatus})
                            </Card.Text>
                          ) : (
                            <Card.Text>No refund available</Card.Text>
                          )
                        }
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-end">
                      {notification.status === 'unread' && <Badge bg="danger">New</Badge>}
                    </Col>
                  </Row>
                  {notification.status === 'unread' && (
                    <Button variant="outline-primary" size="sm" onClick={() => markAsRead(notification._id)}>
                      Mark as Read
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default NotificationPage;
