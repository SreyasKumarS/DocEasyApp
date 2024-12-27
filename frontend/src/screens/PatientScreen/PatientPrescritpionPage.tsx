import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import {PatientPrescritpionPage} from '../../../interfaces/patientInterfaces'

const PatientPrescriptionScreen = () => {
  const location = useLocation();
  const {
    bookingId,
    patientName,
    contactNumber,
    doctorName,
    slotTime,
    date,
    specialization,
    clinicAddress,
    locality,
    experience,
  } = location.state || {}; // Safely destructure the passed data

  const [prescription, setPrescription] = useState<PatientPrescritpionPage | null>(null);

  useEffect(() => {
    if (!bookingId) {
      console.error('Booking ID is missing');
      return;
    }

    const fetchPrescription = async () => {
      try {
        const response = await api.get(
          `/doctor/getPrescription/${bookingId}`
        );

        const prescriptionData = response.data.prescription;

        const parsedPrescription: PatientPrescritpionPage =
          typeof prescriptionData === 'string'
            ? JSON.parse(prescriptionData)
            : prescriptionData;

        setPrescription(parsedPrescription);
      } catch (err) {
        console.error('Error fetching prescription details:', err);
      }
    };

    fetchPrescription();
  }, [bookingId]);



 const formatTime = (time: string): string => {
  if (!time) return 'Invalid Time';

  const times = time.split(' - '); 
  if (times.length !== 2) return 'Invalid Time'; 

  const [startTime, endTime] = times.map((t) => {
    const date = new Date(t.trim());
    if (isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  });

  if (!startTime || !endTime) return 'Invalid Time'; 
  return `${startTime} to ${endTime}`;
};


  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h1 className="text-center text-primary mb-4">Patient Details</h1>

        {/* Display Appointment Details */}
        <div className="mb-3">
          <h5 className="text-secondary">Appointment Information:</h5>
          <p className="fs-5">
            <strong>Patient Name:</strong> {patientName}
          </p>
          <p className="fs-5">
            <strong>Doctor Name:</strong> {doctorName}
          </p>
          <p className="fs-5">
            <strong>specialization:</strong> {specialization}
          </p>
          <p className="fs-5">
            <strong>clinicAddress:</strong> {clinicAddress}
          </p>
          <p className="fs-5">
            <strong>locality:</strong> {locality}
          </p>
          <p className="fs-5">
            <strong>experience:</strong> {experience}
          </p>
          <p className="fs-5">
          <strong>SlotTime:</strong>  {formatTime(slotTime)}
          </p>
          <p className="fs-5">
            <strong>Slot Date:</strong> {date}
          </p>
        </div>
        <hr />

        {/* Prescription Section */}
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
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
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
            <strong>Doceasy</strong> - Your Health Companion
          </p>
          <p className="small text-muted">
            Thank you for trusting Doceasy! <br />
            For support, contact: <a href="mailto:support@doceasy.com">support@doceasy.com</a>
          </p>
          <p className="small text-muted">© 2024 Doceasy. All rights reserved</p>
        </footer>
      </div>
    </div>
  );
};

export default PatientPrescriptionScreen;
