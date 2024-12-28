import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import Header from './components/patientComponents/Header';
import Footer from './components/patientComponents/footer'; 
import Headerd from './components/doctorComponent/Header';
import Headera from './components/adminComponent/Header';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store, { persistor } from '../store';
import useSocket from './hooks/useSocket'; // Import the custom hook

const App: React.FC = () => {
  const location = useLocation();
  const { notifications, removeNotification } = useSocket(); // Add a removeNotification function in the hook

  const [showModal, setShowModal] = useState(false);
  const [notificationToShow, setNotificationToShow] = useState<any>(null);

  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPatientRoute = location.pathname.startsWith('/patient');

  // Handle opening modal with notification
  const handleShowModal = (notification: any) => {
    setNotificationToShow(notification);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // When modal is closed, remove the notification
    if (notificationToShow) {
      removeNotification(notificationToShow);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {isAdminRoute ? <Headera /> : isDoctorRoute ? <Headerd /> : <Header />}
        <div style={{ marginBottom: '90px' }}> {/* Adjust margin as needed */}
        <Outlet />
        </div>

 {/* Conditionally render Footer for Patient Route */}
 {isPatientRoute && <Footer />} {/* Highlighted change: render footer on patient route */}



        
        {/* Keep ToastContainer for other functionalities */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Modal Popup for Notifications (Appears on the top-right) */}
        {isPatientRoute && notifications.length > 0 && (
          <div className="notification-container" style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1050 }}>
            {notifications.map((notification, index) => (
              <Button key={index} onClick={() => handleShowModal(notification)}>
                Show Notification {index + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Bootstrap Modal */}
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          className="notification-modal"
          style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1060 }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Appointment Canceled</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{notificationToShow?.message}</p>
            <p>Refund Status: {notificationToShow?.refundStatus}</p>
            <p>Refund Amount: {notificationToShow?.refundAmount}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </PersistGate>
    </Provider>
  );
};

export default App;
