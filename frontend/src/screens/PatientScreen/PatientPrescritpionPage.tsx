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
        className="card shadow-lg p-4 border-0"
        style={{
          borderRadius: "15px",
          background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
        }}
      >
        {/* Header */}
        <h1
          className="text-center mb-4"
          style={{
            fontWeight: "700",
            color: "#007BFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <FaClipboardList style={{ marginRight: "8px" }} />
          Prescription Details
        </h1>
    
        {/* Appointment Details */}
        <div className="mb-5">
          <div
            className="p-3 mb-4"
            style={{
              borderRadius: "10px",
              backgroundColor: "#e9f5ff",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5
              className="mb-3 d-flex align-items-center"
              style={{
                fontWeight: "600",
                color: "#007BFF",
              }}
            >
              <FaUser style={{ marginRight: "8px" }} />
              Appointment Information
            </h5>
            <div className="row">
              <div className="col-md-6">
                <p className="fs-5">
                  <strong>Patient Name:</strong> {patientName}
                </p>
                <p className="fs-5">
                  <strong>Doctor Name:</strong> {doctorName}
                </p>
                <p className="fs-5">
                  <strong>Specialization:</strong> {specialization}
                </p>
                <p className="fs-5">
                  <strong>Slot Time:</strong> {formatTime(slotTime)}
                </p>
              </div>
              <div className="col-md-6">
                <p className="fs-5">
                  <strong>Clinic Address:</strong> {clinicAddress}
                </p>
                <p className="fs-5">
                  <strong>Locality:</strong> {locality}
                </p>
                <p className="fs-5">
                  <strong>Experience:</strong> {experience} years
                </p>
                <p className="fs-5">
                  <strong>Slot Date:</strong> {date}
                </p>
              </div>
            </div>
          </div>
        </div>
    
        {/* Prescription Section */}
        {prescription ? (
          <>
            <div className="mb-4">
              <div
                className="p-3"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f2f2f2",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5
                  className="mb-3 d-flex align-items-center"
                  style={{
                    fontWeight: "600",
                    color: "#007BFF",
                  }}
                >
                  <FaFileMedical style={{ marginRight: "8px" }} />
                  Diagnosis
                </h5>
                <p className="fs-5">{prescription.diagnosis}</p>
              </div>
            </div>
    
            <div className="mb-4">
              <div
                className="p-3"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f2f2f2",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5
                  className="mb-3 d-flex align-items-center"
                  style={{
                    fontWeight: "600",
                    color: "#007BFF",
                  }}
                >
                  <FaClipboardList style={{ marginRight: "8px" }} />
                  Medications
                </h5>
                <ul className="list-group">
                  {prescription.medications?.length > 0 ? (
                    prescription.medications.map((med, index) => (
                      <li
                        key={index}
                        className="list-group-item"
                        style={{
                          border: "none",
                          borderRadius: "8px",
                          background: "#ffffff",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          marginBottom: "10px",
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>Name:</strong> {med.name}
                          </span>
                          <span>
                            <strong>Dosage:</strong> {med.dosage}
                          </span>
                          <span>
                            <strong>Duration:</strong> {med.duration}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted">No medications prescribed.</p>
                  )}
                </ul>
              </div>
            </div>
    
            <div className="mb-4">
              <div
                className="p-3"
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#f2f2f2",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5
                  className="mb-3 d-flex align-items-center"
                  style={{
                    fontWeight: "600",
                    color: "#007BFF",
                  }}
                >
                  <FaNotesMedical style={{ marginRight: "8px" }} />
                  Additional Notes
                </h5>
                <p className="fs-5">{prescription.additionalNotes}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-muted fs-5">No prescription data available.</p>
        )}
    
        {/* Footer */}
        <footer className="text-center mt-5">
          <p
            style={{
              fontWeight: "700",
              color: "#007BFF",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Doceasy - Your Health Companion
          </p>
          <p className="small text-muted">
            For support, contact:{" "}
            <a href="mailto:support@doceasy.com" className="text-decoration-none text-primary">
              support@doceasy.com
            </a>
          </p>
          <p className="small text-muted">© 2024 Doceasy. All rights reserved.</p>
        </footer>
      </div>
    </div>
    

  );
};

export default PatientPrescriptionScreen;
