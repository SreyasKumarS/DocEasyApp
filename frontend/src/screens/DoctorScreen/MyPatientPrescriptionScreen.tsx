import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {MyPatientPrescriptionScreen} from '../../../interfaces/doctorInterfaces'


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

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center text-primary mb-4">Prescription Details</h1>

        {/* Display Patient Details */}
        <div className="mb-3">
          <h5 className="text-secondary">Patient Details:</h5>
          <p className="fs-5">
            <strong>Name:</strong> {patientName}
          </p>
          <p className="fs-5">
            <strong>Contact Number:</strong> {contactNumber}
          </p>
          <p className="fs-5">
            <strong>Slot Time:</strong> {slotStartTime} to {slotEndTime}
          </p>
          <p className="fs-5">
            <strong>Date:</strong> {date}
          </p>
        </div>

        <hr />

        {/* Display Prescription Details */}
        {prescription ? (
          <>
            <div className="mb-3">
              <h5 className="text-secondary">Diagnosis:</h5>
              <p className="fs-5">{prescription.diagnosis}</p>
            </div>

            <div className="mb-3">
              <h5 className="text-secondary">Medications:</h5>
              <ul className="list-group">
                {prescription.medications?.length > 0 ? (
                  prescription.medications.map((med, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <strong>Name:</strong> {med.name}
                      </span>
                      <span>
                        <strong>Dosage:</strong> {med.dosage}
                      </span>
                      <span>
                        <strong>Duration:</strong> {med.duration}
                      </span>
                    </li>
                  ))
                ) : (
                  <p>No medications prescribed.</p>
                )}
              </ul>
            </div>

            <div className="mb-3">
              <h5 className="text-secondary">Additional Notes:</h5>
              <p className="fs-5">{prescription.additionalNotes}</p>
            </div>
          </>
        ) : (
          <p className="text-center">No prescription data available.</p>
        )}

        <hr />
        <footer className="text-center">
          <p className="mb-2">
            <strong>Doceasy</strong> - Health is Our Priority
          </p>
          <p className="small text-muted">
            Thank you for choosing Doceasy! We value your trust. <br />
            For support, contact us at: <a href="mailto:support@doceasy.com">support@doceasy.com</a>
          </p>
          <p className="small text-muted">© 2024 Doceasy. All rights reserved</p>
        </footer>
      </div>
    </div>
  );
};


export default ViewPrescription;
