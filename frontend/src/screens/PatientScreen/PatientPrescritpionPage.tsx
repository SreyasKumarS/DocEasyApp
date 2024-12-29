import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import {PatientPrescritpionPage} from '../../../interfaces/patientInterfaces'
import { FaUser, FaClinicMedical, FaClipboardList, FaFileMedical, FaNotesMedical } from "react-icons/fa";

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
      <div
        className="card shadow-lg p-4"
        style={{
          borderRadius: "15px",
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
        }}
      >
        <h1 className="text-center text-primary mb-4">Prescription Details</h1>
    
        {/* Appointment Information Section */}
        <div className="p-3 mb-4" style={{ border: "1px solid #ddd", borderRadius: "10px" }}>
          <h5 className="text-secondary mb-3">
            <FaClipboardList className="me-2 text-primary" />
            Appointment Information
          </h5>
          <div className="fs-5 text-dark">
            <p>
              <strong>Patient Name:</strong> {patientName}
            </p>
            <p>

              <strong>Doctor Name:</strong> {doctorName}
            </p>
            <p>
              <strong>Specialization:</strong> {specialization}
            </p>
            <p>
  
              <strong>Clinic Address:</strong> {clinicAddress}
            </p>
            <p>
              <strong>Locality:</strong> {locality}
            </p>
            <p>
              <strong>Experience:</strong> {experience}
            </p>
            <p>
              <strong>Slot Time:</strong> {formatTime(slotTime)}
            </p>
            <p>
              <strong>Slot Date:</strong> {date}
            </p>
          </div>
        </div>
    
        {/* Prescription Section */}
        <div className="p-3 mb-4" style={{ border: "1px solid #ddd", borderRadius: "10px" }}>
          <h3 className="text-secondary mb-3">
            <FaFileMedical className="me-2 text-primary" />
            Prescriptions and Diagnosis
          </h3>
          {prescription ? (
            <>
              <div className="mb-3">
                <h6 className="text-secondary">
                  <FaFileMedical className="me-2 text-muted" />
                  Diagnosis:
                </h6>
                <p className="fs-5 text-dark">{prescription.diagnosis}</p>
              </div>
    
              <div className="mb-3">
                <h6 className="text-secondary">
                  <FaNotesMedical className="me-2 text-muted" />
                  Medications:
                </h6>
                <ul className="list-group">
                  {prescription.medications?.length > 0 ? (
                    prescription.medications.map((med, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          marginBottom: "8px",
                        }}
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
                    <p className="text-muted">No medications prescribed.</p>
                  )}
                </ul>
              </div>
    
              <div className="mb-3">
                <h6 className="text-secondary">
                  <FaNotesMedical className="me-2 text-muted" />
                  Additional Notes:
                </h6>
                <p className="fs-5 text-dark">{prescription.additionalNotes}</p>
              </div>
            </>
          ) : (
            <p className="text-center text-muted">No prescription data available.</p>
          )}
        </div>
    
        {/* Footer Section */}
        <footer className="text-center mt-4">
          <p className="mb-2 text-primary fw-bold">
            <strong>Doceasy</strong> - Your Health Companion
          </p>
          <p className="small text-muted">
            Thank you for trusting Doceasy! <br />
            For support, contact:{" "}
            <a href="mailto:support@doceasy.com" className="text-primary">
              support@doceasy.com
            </a>
          </p>
          <p className="small text-muted">© 2024 Doceasy. All rights reserved</p>
        </footer>
      </div>
    </div>
    



);
};


export default PatientPrescriptionScreen;










