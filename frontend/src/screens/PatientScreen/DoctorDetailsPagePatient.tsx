import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import api from '../../axios'
import ReactStars from 'react-rating-stars-component'; 
import { useSelector} from 'react-redux';
import { RootState } from '../../../store'; 
import {DoctorDetailsPagePatient,DoctorDetailsPagePatientReview} from '../../../interfaces/patientInterfaces'


const DoctorDetails = () => {
  const location = useLocation();
  const doctorId = location.state?.doctorId;
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetailsPagePatient | null>(null);
  const [reviews, setReviews] = useState<DoctorDetailsPagePatientReview[]>([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const patientName = useSelector((state: RootState) => state.PatientAuth.user);
  
  

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await api.get(`/patients/getDoctorDetailsForPatient/${doctorId}`);
        setDoctor(doctorResponse.data);

        const reviewsResponse = await api.get(`/patients/getReviews/${doctorId}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching doctor details or reviews:', error);
      }
    };

        // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const ratingResponse = await api.get(`/patients/getDoctorAverageRating/${doctorId}`);
      setAverageRating(ratingResponse.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };
  
    fetchDoctorDetails();
    fetchAverageRating();
  }, [doctorId]);


  const handleReviewSubmit = async () => {
    if (!patientName) {
      console.error('Patient name is not available.');
      return;
    }
  
    const patientNameOnly = patientName.name; 
    try {
      const response = await api.post(`/patients/submitReview`, {
        doctorId,
        patientName: patientNameOnly,
        ...newReview,
      });
      setReviews([...reviews, response.data]);
      setNewReview({ comment: '', rating: 0 });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

 
  const handleDoctorClick = (doctorId: string) => {
    navigate('/patient/DoctorSlots', { state: { doctorId } });
  };

  return (
    <Container>
      {doctor && (
        <>
          <Row className="my-4">
            <Col md={4}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`${doctor.profilePicture}`}
                  alt={`${doctor.name}'s profile`}
                  style={{
                    height: '380px',
                    width: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  }}
                />
              </Card>
            </Col>
            <Col md={8}>
              <h2>{doctor.name}</h2>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Contact:</strong> {doctor.contactNumber}</p>
              <p><strong>Clinic Address:</strong> {doctor.clinicAddress}</p>
              <p><strong>Locality:</strong> {doctor.locality}</p>
              <p><strong>Biography:</strong> {doctor.biography}</p>
              {averageRating !== null && (
                <div>
                  <p>
                    <strong>Average Rating:</strong> {averageRating.toFixed(1)}
                  </p>
                  <ReactStars
                    count={5}
                    size={24}
                    value={averageRating}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                </div>
              )}  

              <Button
                variant="primary"
                onClick={() => handleDoctorClick(doctor._id)}
                className="mt-3"
              >
                Book Slots
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className="my-4">
            <Col>
              <h3>Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title>{review.patientName}</Card.Title>
                      <Card.Text>{review.comment}</Card.Text>
                      <p><strong>Rating:</strong> 
                        <ReactStars
                          count={5}
                          size={24}
                          value={review.rating}
                          edit={false}
                          activeColor="#ffd700"
                        />
                      </p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h3>Write a Review</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <ReactStars
                    count={5}
                    size={24}
                    value={newReview.rating}
                    onChange={(newRating) => setNewReview({ ...newReview, rating: newRating })}
                    activeColor="#ffd700"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </Form.Group>
                <Button onClick={handleReviewSubmit}>Submit Review</Button>
              </Form>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DoctorDetails;
