// import React, { useEffect, useState } from 'react';
// import { Button, Card, Container, Row, Col } from 'react-bootstrap';
// import { BsBook, BsPersonCircle, BsCalendarCheck, BsWallet, BsCalendar2Check } from 'react-icons/bs';
// import { RootState } from '../../../store';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import api from '../../axios'
// import { BsFillBellFill } from 'react-icons/bs'; 
// import { Badge } from 'react-bootstrap';// Correct import
// import ReactStars from 'react-rating-stars-component';
// import {HomeScreenDoctor} from '../../../interfaces/patientInterfaces';
// import Footer from '../../components/patientComponents/footer'; 
// import {SpecializationScreen,SpecializationScreenDoctor} from '../../../interfaces/patientInterfaces'


// const HomeScreen: React.FC = () => {
//   const navigate = useNavigate();
//   const user = useSelector((state: RootState) => state.PatientAuth.user);
//   const patientId = user?.id;
//   const [doctors, setDoctors] = useState<HomeScreenDoctor[]>([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [unreadNotificationsforbellicon, setunreadNotificationsforbellicon] = useState(0);
//   const [specializations, setSpecializations] = useState<SpecializationScreen[]>([]);


//   const handleNavigateToSpecialization = () => {
//     navigate('/patient/Specializations');
//   };

//   const   handleNavigateToSpecializationDoctors = () => {
//     navigate('/patient/Specialization');
//   };

//   const handleDoctorClick = (doctorId: string) => {
//     navigate('/patient/DoctorDetailsPagePatient', { state: { doctorId } });
//   };

//   const fetchNearbyDoctors = async () => {
//     try {
//       const response = await api.get(`/patients/getNearbyDoctors/${patientId}?radius=100`);
//       const doctorIds = response.data.doctors.map((doctor: HomeScreenDoctor) => doctor._id);
//       setDoctors(response.data.doctors || []);
//       if (doctorIds.length > 0) {
//         fetchDoctorRatings(doctorIds);
//       }
//     } catch (error) {
//       console.error('Error fetching nearby doctors:', error);
//     }
//   };

//   const fetchDoctorRatings = async (doctorIds: string[]) => {
//     try {
//       const response = await api.get(`/patients/getDoctorAverageRatingformultipleDoctors/${doctorIds.join(',')}`);
//       const ratingsMap = new Map(response.data.averageRatings.map((item: any) => [item.doctorId, item.averageRating]));
      
//       setDoctors((prevDoctors) => 
//         prevDoctors.map((doctor) => {
//           const rating = ratingsMap.get(doctor._id);
//           return {
//             ...doctor,
//             averageRating: typeof rating === 'number' ? rating : null, // Ensure rating is a number or null
//           };
//         })
//       );
//     } catch (error) {
//       console.error('Error fetching doctor ratings:', error);
//     }
//   };


//   useEffect(() => {
//     if (patientId) {
//       fetchNearbyDoctors();
//     }
//   }, [patientId]);



//   useEffect(() => {
//     // Simulating fetching unread notifications every 5 seconds
//     const interval = setInterval(() => {
//       setUnreadNotifications(prev => prev + 1); // Increment unread notifications as an example
//     },1000);
  
//     return () => clearInterval(interval); // Clean up interval on component unmount
//   }, []);
  

//   const fetchUnreadNotifications = async (patientId: string) => {
//     try {
//       const response = await api.get(`/patients/getNotifications/${patientId}`);
//       return response.data.unreadCount; // Return only the unread count
//     } catch (error) {
//       console.error('Error fetching unread notifications:', error);
//       return 0; // Default to 0 if there's an error
//     }
//   };
  
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       if (patientId) {
//         const count = await fetchUnreadNotifications(patientId);
//         setunreadNotificationsforbellicon(count); // Update unread count
//       }
//     }, 4000); // Poll every 5 seconds
  
//     return () => clearInterval(interval); // Cleanup interval on unmount
//   }, [patientId]);
  



//   const fetchSpecializations = async () => {
//     try {
//       const response = await api.get('/patients/specializations');
//       setSpecializations(response.data.specializations || []);
//     } catch (error) {
//       console.error('Error fetching specializations:', error);
//     }
//   };

//   useEffect(() => {
//     fetchSpecializations();
//   }, []);

//   return (
//     <>
//       {/* Inline styles for hover effects */}
//       <style>{`
//         .card:hover {
//           transform: scale(1.05);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//           box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
//         }
//         .card-title {
//           color: #007bff;
//         }
//         .card-title:hover {
//           color: #0056b3;
//           text-decoration: underline;
//         }
//         .btn-outline-primary:hover {
//           background-color: #007bff;
//           color: #fff;
//         }
//       `}</style>

//      <div className="d-flex flex-column min-vh-100">
//       <Container className="py-4 bg-light flex-grow-1">
//         <div className="text-center mb-4">
//           <h1 className="text-primary">Welcome to DocEasy, {user?.name || 'Patient'}</h1>
//           <p className="text-secondary">Your health is our priority.</p>
//         </div>

//         <Row className="justify-content-center g-3">
//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//                 <BsPersonCircle size={50} className="text-primary mb-3" />
//                 <Card.Title className="text-dark">My Profile</Card.Title>
//                 <Card.Text className="text-muted">View and update your personal information</Card.Text>
//                 <Button variant="primary" href="/patient/PatientProfileScreen">Edit Profile</Button>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//                 <BsBook size={50} className="text-success mb-3" />
//                 <Card.Title className="text-dark">Need a Check-up?</Card.Title>
//                 <Card.Text className="text-muted">Book an appointment with your doctor at your convenience</Card.Text>
//                 <Button variant="success" onClick={handleNavigateToSpecialization}>Book Appointment</Button>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//               <div className="position-relative">
//                 <BsFillBellFill size={50} className="text-danger mb-3" />
//                 {unreadNotificationsforbellicon > 0 && (
//                   <Badge bg="danger" className="position-absolute top-0 end-0 translate-middle badge rounded-pill">
//                     {unreadNotificationsforbellicon}
//                   </Badge>
//                 )}
//               </div>
//                 <Card.Title className="text-dark">Notifications</Card.Title>
//                 <Card.Text className="text-muted">View your recent notifications and updates</Card.Text>
//                 <Button variant="outline-danger" href="/patient/NotificationPage">View Notifications</Button>
//               </Card.Body>
//             </Card>
//           </Col>


//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//                 <BsCalendarCheck size={50} className="text-secondary mb-3" />
//                 <Card.Title className="text-dark">Your Appointment History</Card.Title>
//                 <Card.Text className="text-muted">Check your previous consultations and follow-ups</Card.Text>
//                 <Button variant="outline-secondary" href="/patient/AppointmentHistoryScreen">View History</Button>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//                 <BsCalendar2Check size={50} className="text-info mb-3" />
//                 <Card.Title className="text-dark">My Bookings</Card.Title>
//                 <Card.Text className="text-muted">View and manage your booked appointments</Card.Text>
//                 <Button variant="outline-primary" href="/patient/BookedAppointmentsScreen">View Appointments</Button>
//               </Card.Body>
//             </Card>
//           </Col>

//           <Col md={4}>
//             <Card className="text-center shadow-lg border-0 bg-white hover-effect">
//               <Card.Body>
//                 <BsWallet size={50} className="text-warning mb-3" />
//                 <Card.Title className="text-dark">My Wallet</Card.Title>
//                 <Card.Text className="text-muted">View and manage your wallet and transactions</Card.Text>
//                 <Button variant="outline-warning" href="/patient/WalletPage">View Wallet</Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Nearby Doctors Section */}
//         <h3 className="mt-5">Nearby Doctors</h3>
//         <Row className="g-4 mt-2">
//           {doctors.length > 0 ? (
//             doctors.map((doctor) => (
//               <Col key={doctor._id} md={4} className="d-flex">
//                 <Card
//                   onClick={() => handleDoctorClick(doctor._id)}
//                   style={{ cursor: 'pointer' }}
//                   className="shadow-lg border-0 h-100 hover-effect"
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={`${doctor.profilePicture}`}
//                     alt={`${doctor.name}'s profile`}
//                     style={{
//                       height: '250px',
//                       width: '100%',
//                       objectFit: 'cover',
//                       objectPosition: 'top center',
//                     }}
//                   />
//                   <Card.Body>
//                     <Card.Title>{doctor.name}</Card.Title>
//                     <Card.Text>
//                       <strong>Specialization:</strong> {doctor.specialization} <br />
//                       <strong>Experience:</strong> {doctor.experience} years <br />
//                       <strong>Contact:</strong> {doctor.contactNumber} <br />
//                       <strong>Clinic:</strong> {doctor.clinicAddress} <br />
//                       <strong>Locality:</strong> {doctor.locality} <br />

                 
//               {/* Render stars and numeric rating */}
//               {doctor.averageRating !== undefined && doctor.averageRating !== null && (
//                 <div className="my-2">
//                   <ReactStars
//                     count={5}
//                     size={24}
//                     value={doctor.averageRating}
//                     edit={false}
//                     isHalf={true}
//                     activeColor="#ffd700"
//                   />
//                   <p className="text-muted mt-2">
//                     <strong>Rating:</strong> {doctor.averageRating.toFixed(1)} / 5
//                   </p>
//                 </div>
//               )}
//                     </Card.Text>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <p className="text-center">No nearby doctors available at the moment.</p>
//           )}
//         </Row>
//       </Container>




//           {/* Specializations Section */}
//           <div style={{ margin: '20px 0' }}>
//             <h3 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>
//               Explore Specializations
//             </h3>
//             <Row className="justify-content-center">
//               {specializations.length > 0 ? (
//                 specializations.map((specialization) => (
//                   <Col
//                     key={specialization._id}
//                     md={3}
//                     style={{
//                       margin: '10px 0',
//                       display: 'flex',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <div
//                       style={{
//                         backgroundColor: '#f8f9fa',
//                         border: '1px solid #ddd',
//                         borderRadius: '8px',
//                         padding: '20px',
//                         textAlign: 'center',
//                         width: '100%',
//                         cursor: 'pointer',
//                         transition: 'transform 0.3s ease',
//                       }}
//                       onClick={handleNavigateToSpecializationDoctors}
//                     >
//                       <h5 style={{ color: '#007bff', marginBottom: '10px' }}>
//                         {specialization.name}
//                       </h5>
//                       <p style={{ color: '#6c757d' }}>Discover experts in this field</p>
//                       <Button variant="outline-primary">View Doctors</Button>
//                     </div>
//                   </Col>
//                 ))
//               ) : (
//                 <p className="text-center">No specializations available at the moment.</p>
//               )}
//             </Row>
//           </div>



//       <Footer />
//     </div>
//     </>
//   );
// };

// export default HomeScreen;


































import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { BsBook, BsPersonCircle, BsCalendarCheck, BsWallet, BsCalendar2Check } from 'react-icons/bs';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import { BsFillBellFill } from 'react-icons/bs'; 
import { Badge } from 'react-bootstrap';// Correct import
import ReactStars from 'react-rating-stars-component';
import {HomeScreenDoctor} from '../../../interfaces/patientInterfaces';
import {SpecializationScreen,SpecializationScreenDoctor} from '../../../interfaces/patientInterfaces'


const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.PatientAuth.user);
  const patientId = user?.id;
  const [doctors, setDoctors] = useState<HomeScreenDoctor[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadNotificationsforbellicon, setunreadNotificationsforbellicon] = useState(0);
  const [specializations, setSpecializations] = useState<SpecializationScreen[]>([]);


  const handleNavigateToSpecialization = () => {
    navigate('/patient/Specializations');
  };

  const   handleNavigateToSpecializationDoctors = (spec: SpecializationScreen | SpecializationScreenDoctor) => {
      navigate('/patient/DoctorsList', { state: { specialization: spec.name } });
    };
  

  const handleDoctorClick = (doctorId: string) => {
    navigate('/patient/DoctorDetailsPagePatient', { state: { doctorId } });
  };

  const fetchNearbyDoctors = async () => {
    try {
      const response = await api.get(`/patients/getNearbyDoctors/${patientId}?radius=100`);
      const doctorIds = response.data.doctors.map((doctor: HomeScreenDoctor) => doctor._id);
      setDoctors(response.data.doctors || []);
      if (doctorIds.length > 0) {
        fetchDoctorRatings(doctorIds);
      }
    } catch (error) {
      console.error('Error fetching nearby doctors:', error);
    }
  };

  const fetchDoctorRatings = async (doctorIds: string[]) => {
    try {
      const response = await api.get(`/patients/getDoctorAverageRatingformultipleDoctors/${doctorIds.join(',')}`);
      const ratingsMap = new Map(response.data.averageRatings.map((item: any) => [item.doctorId, item.averageRating]));
      
      setDoctors((prevDoctors) => 
        prevDoctors.map((doctor) => {
          const rating = ratingsMap.get(doctor._id);
          return {
            ...doctor,
            averageRating: typeof rating === 'number' ? rating : null, // Ensure rating is a number or null
          };
        })
      );
    } catch (error) {
      console.error('Error fetching doctor ratings:', error);
    }
  };


  useEffect(() => {
    if (patientId) {
      fetchNearbyDoctors();
    }
  }, [patientId]);



  useEffect(() => {
    // Simulating fetching unread notifications every 5 seconds
    const interval = setInterval(() => {
      setUnreadNotifications(prev => prev + 1); // Increment unread notifications as an example
    },1000);
  
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);
  

  const fetchUnreadNotifications = async (patientId: string) => {
    try {
      const response = await api.get(`/patients/getNotifications/${patientId}`);
      return response.data.unreadCount; // Return only the unread count
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return 0; // Default to 0 if there's an error
    }
  };
  
  useEffect(() => {
    const interval = setInterval(async () => {
      if (patientId) {
        const count = await fetchUnreadNotifications(patientId);
        setunreadNotificationsforbellicon(count); // Update unread count
      }
    }, 4000); // Poll every 5 seconds
  
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [patientId]);
  



  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/patients/specializations');
      setSpecializations(response.data.specializations || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  return (
    <>
      {/* Inline styles for hover effects */}
      <style>{`
        .card:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
        }
        .card-title {
          color: #007bff;
        }
        .card-title:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        .btn-outline-primary:hover {
          background-color: #007bff;
          color: #fff;
        }
      `}</style>

<div className="d-flex flex-column min-vh-100">
  {/* Welcome Section */}
  <div className="d-flex justify-content-between align-items-center container mt-5" style={{ gap: '2rem' }}>
    <div style={{ flex: 1 }}>
      <h1 className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
        Welcome to DocEasy, {user?.name || 'Patient'}
      </h1>
      <p className="text-black" style={{ fontSize: '1.5rem', fontStyle: 'italic' }}>
        Your health is our priority.
      </p>
      <p
        style={{
          fontSize: '1.2rem',
          lineHeight: '1.8',
          color: '#000',
          maxWidth: '800px',
          marginBottom: '2rem',
        }}
      >
        DocEasy is your trusted platform for seamless appointment booking and healthcare management. Whether it's
        scheduling slots with ease, managing medical records, or accessing healthcare insights, we make your
        experience simple and hassle-free. Our focus is on enhancing convenience and saving your time, so you can
        prioritize what truly matters — your health and well-being.
      </p>
    </div>

    {/* Image Section */}
    <div style={{ flex: 1, textAlign: 'right' }}>
      <img
        src="/assets/paediatrician-doctor-examining-child-comfortabe-medical-office-healthcare-childhood-medicine-protection-prevention-concept-little-boy-trust-doctor-feels-calm-positive-emotions.jpg"
        alt="Doctor and child"
        style={{
          maxWidth: '100%',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
        }}
      />
    </div>
  </div>

<Container className="py-5 flex-grow-1">
      {/* Section Heading */}
      <div className="text-center mb-5">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C3E50' }}>Our Services at a Glance</h2>
        <p style={{ fontSize: '1.2rem', color: '#7F8C8D' }}>
          Explore the services designed to make your healthcare journey seamless and hassle-free.
        </p>
      </div>

      {/* Service Cards */}
      <Row className="justify-content-center g-4">
        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <BsPersonCircle size={50} className="text-primary mb-3" />
              <Card.Title className="text-dark">My Profile</Card.Title>
              <Card.Text className="text-muted">View and update your personal information</Card.Text>
              <Button variant="primary" href="/patient/PatientProfileScreen">Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <BsBook size={50} className="text-primary mb-3" />
              <Card.Title className="text-dark">Need a Check-up?</Card.Title>
              <Card.Text className="text-muted">
                Book an appointment with your doctor at your convenience
              </Card.Text>
              <Button variant="primary" onClick={handleNavigateToSpecialization}>Book Appointment</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <div className="position-relative">
                <BsFillBellFill size={50} className="text-primary mb-3" />
                {unreadNotificationsforbellicon > 0 && (
                  <Badge bg="primary" className="position-absolute top-0 end-0 translate-middle badge rounded-pill">
                    {unreadNotificationsforbellicon}
                  </Badge>
                )}
              </div>
              <Card.Title className="text-dark">Notifications</Card.Title>
              <Card.Text className="text-muted">
                View your recent notifications and updates
              </Card.Text>
              <Button variant="primary" href="/patient/NotificationPage">View Notifications</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <BsCalendarCheck size={50} className="text-primary mb-3" />
              <Card.Title className="text-dark">Your Appointment History</Card.Title>
              <Card.Text className="text-muted">
                Check your previous consultations and follow-ups
              </Card.Text>
              <Button variant="primary" href="/patient/AppointmentHistoryScreen">View History</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <BsCalendar2Check size={50} className="text-primary mb-3" />
              <Card.Title className="text-dark">My Bookings</Card.Title>
              <Card.Text className="text-muted">View and manage your booked appointments</Card.Text>
              <Button variant="primary" href="/patient/BookedAppointmentsScreen">View Appointments</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-lg border-0 bg-white hover-effect">
            <Card.Body>
              <BsWallet size={50} className="text-primary mb-3" />
              <Card.Title className="text-dark">My Wallet</Card.Title>
              <Card.Text className="text-muted">View and manage your wallet and transactions</Card.Text>
              <Button variant="primary" href="/patient/WalletPage">View Wallet</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

    
{/* Nearby Doctors Section */}
<Container className="py-5">
  <h3 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2C3E50' }}>
    Nearby Doctors
    <p className="text-muted mt-2" style={{ fontSize: '1.1rem' }}>Find expert healthcare professionals near you</p>
  </h3>
  <Row className="g-4 mt-2">
    {doctors.length > 0 ? (
      doctors.map((doctor) => (
        <Col key={doctor._id} md={4}>
          <Card
            onClick={() => handleDoctorClick(doctor._id)}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.3s',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px', // Reduced border radius for a more compact look
              overflow: 'hidden', // Prevent overflow in compact cards
            }}
            className="bg-white h-100"
          >
            <Card.Img
              variant="top"
              src={`${doctor.profilePicture}`}
              alt={`${doctor.name}'s profile`}
              style={{
                height: '400px', // Reduced image height
                width: '100%',
                objectFit: 'cover', // Keeps aspect ratio intact
                objectPosition: 'top center', // Focus on the top part of the image (usually the face)
              }}
            />
            <Card.Body className="d-flex flex-column p-3"> {/* Reduced padding */}
              <Card.Title className="text-dark" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {doctor.name}
              </Card.Title>
              <Card.Subtitle className="mb-3 text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                {doctor.specialization}
              </Card.Subtitle>
              <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
                <strong>Experience:</strong> {doctor.experience} years <br />
                <strong>Contact:</strong> {doctor.contactNumber} <br />
                <strong>Clinic:</strong> {doctor.clinicAddress} <br />
                <strong>Locality:</strong> {doctor.locality}
              </Card.Text>

              {/* Specialization Highlight */}
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  padding: '6px 10px', // Slightly reduced padding
                  borderRadius: '15px',
                  display: 'inline-block',
                  fontSize: '0.85rem', // Smaller font for specialization
                  fontWeight: '600',
                  color: '#1e90ff',
                  marginTop: '10px',
                }}
              >
                <strong>{doctor.specialization}</strong>
              </div>

              {/* Render stars and numeric rating */}
              {doctor.averageRating !== undefined && doctor.averageRating !== null && (
                <div className="my-2">
                  <ReactStars
                    count={5}
                    size={20} // Smaller size for stars
                    value={doctor.averageRating}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                  <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
                    <strong>Rating:</strong> {doctor.averageRating.toFixed(1)} / 5
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <Col className="text-center">
        <p className="text-muted" style={{ fontSize: '1.2rem' }}>No nearby doctors available at the moment.</p>
      </Col>
    )}
  </Row>
</Container>


{/* Specializations Section */}
<Container className="py-5">
  <h3 className="text-center mb-4" style={{ fontSize: '2.5rem', fontWeight: '700', color: '#007bff' }}>
    Explore Specializations
    <p className="text-muted mt-2" style={{ fontSize: '1.1rem' }}>
      Choose from a variety of expert fields and discover the best doctors for your needs
    </p>
  </h3>
  <Row className="g-4 justify-content-center">
    {specializations.length > 0 ? (
      specializations.map((specialization) => (
        <Col
          key={specialization._id}
          md={4}
          lg={3}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Card
            onClick={() => handleNavigateToSpecializationDoctors(specialization)}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            }}
            className="specialization-card"
          >
            <Card.Img
              variant="top"
             src="/assets/spc.jpg"
              alt={specialization.name}
              style={{
                height: '150px',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            <Card.Body className="text-center p-3">
              <Card.Title style={{ fontSize: '1.5rem', fontWeight: '700', color: '#007bff' }}>
                {specialization.name}
              </Card.Title>
              <Card.Text className="text-muted" style={{ fontSize: '0.95rem' }}>
                {'Learn more about this specialization and find experts in the field.'}
              </Card.Text>
              <Button variant="outline-primary" size="sm">
                View Doctors
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <p className="text-center text-muted" style={{ fontSize: '1.2rem' }}>
        No specializations available at the moment.
      </p>
    )}
  </Row>
</Container>
    </div>
    </>
  );
};

export default HomeScreen;














