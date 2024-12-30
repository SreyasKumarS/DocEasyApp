import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {MyPatientPrescriptionScreen} from '../../../interfaces/doctorInterfaces'
import { FaUser, FaPhone, FaClock, FaCalendarAlt, FaNotesMedical, FaPills } from 'react-icons/fa';

const ViewPrescription = () => {
  const location = useLocation();
  const {
    bookingId,
    patientName,
    contactNumber,
    slotStartTime,
    slotEndTime,
    date,
  } = location.state || {};


  const [prescription, setPrescription] = useState<MyPatientPrescriptionScreen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      console.error('Booking ID is missing');
      setLoading(false);
      return;
    }

    const fetchPrescription = async () => {
      try {
        const response = await api.get(
          `/doctor/getPrescription/${bookingId}`
        );

        const prescriptionData = response.data.prescription;

        // Parse the JSON string in the prescription field
        const parsedPrescription: MyPatientPrescriptionScreen = typeof prescriptionData === 'string'
          ? JSON.parse(prescriptionData)
          : prescriptionData;

        setPrescription(parsedPrescription); // Store parsed data
      } catch (err) {
        console.error('Error fetching prescription details:', err);
        setError('Failed to fetch prescription details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-5">Loading prescription details...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;


  const formatTime = (time: string): string => {
    const date = new Date(time);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  

  return (

  

    <div className="container my-5">
      <div className="card shadow-lg p-5 border-0" style={{ borderRadius: '10px' }}>
        <h1 className="text-center text-primary mb-5" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          Prescription Details
        </h1>
    
        {/* Display Patient Details */}
        <div className="mb-4">
          <h5 className="text-secondary" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
            <FaUser className="me-2 text-primary" /> Patient Details
          </h5>
          <p className="mb-2">
            <FaUser className="me-2 text-secondary" />
            <strong>Name:</strong> {patientName}
          </p>
          <p className="mb-2">
            <FaPhone className="me-2 text-secondary" />
            <strong>Contact Number:</strong> {contactNumber}
          </p>
          <p className="mb-2">
            <FaClock className="me-2 text-secondary" />
            <strong>Slot Time:</strong> {formatTime(slotStartTime)} to {formatTime(slotEndTime)}
          </p>
          <p>
            <FaCalendarAlt className="me-2 text-secondary" />
            <strong>Date:</strong> {date}
          </p>
        </div>
    
        <hr className="mb-5" />
    
        {/* Display Prescription Details */}
        {prescription ? (
          <>
            <div className="mb-4">
              <h5 className="text-secondary" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                <FaNotesMedical className="me-2 text-primary" /> Diagnosis
              </h5>
              <p style={{ fontSize: '1.1rem' }}>{prescription.diagnosis}</p>
            </div>
    
            <div className="mb-4">
              <h5 className="text-secondary" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                <FaPills className="me-2 text-primary" /> Medications
              </h5>
              <ul className="list-group">
                {prescription.medications?.length > 0 ? (
                  prescription.medications.map((med, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}
                    >
                      <span><strong>Name:</strong> {med.name}</span>
                      <span><strong>Dosage:</strong> {med.dosage}</span>
                      <span><strong>Duration:</strong> {med.duration}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-muted">No medications prescribed.</p>
                )}
              </ul>
            </div>
    
            <div className="mb-4">
              <h5 className="text-secondary" style={{ fontWeight: '600', fontSize: '1.2rem' }}>
                <FaNotesMedical className="me-2 text-primary" /> Additional Notes
              </h5>
              <p style={{ fontSize: '1.1rem' }}>{prescription.additionalNotes}</p>
            </div>
          </>
        ) : (
          <p className="text-center text-muted" style={{ fontSize: '1.2rem' }}>
            No prescription data available.
          </p>
        )}
    
        <hr className="mt-4 mb-5" />
      {/* </div>
    </div> */}
    

    {/* Footer */}
    <footer className="text-center">
      <p className="mb-3" style={{ fontWeight: '600', fontSize: '1rem', color: '#3A9F98' }}>
        <strong>DocEasy</strong> - Health is Our Priority
      </p>
      <p className="small text-muted mb-2">
        Thank you for choosing DocEasy! We value your trust. <br />
        For support, contact us at: <a href="mailto:support@doceasy.com" className="text-primary">support@doceasy.com</a>
      </p>
      <p className="small text-muted">
        &copy; 2024 DocEasy. All rights reserved.
      </p>
    </footer>
  </div>
</div>

  );
};


export default ViewPrescription;
