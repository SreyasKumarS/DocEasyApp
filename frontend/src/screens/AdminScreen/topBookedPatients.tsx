import React, { useState, useEffect } from 'react';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


type Patient = {
  patientId: string;
  patientName: string;
  contactNumber: string;
  email: string;
  gender: string;
  totalSlots: number;
};

const TopPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate(); 

  const fetchPatients = async (page: number) => {
    try {
      const response = await api.get<{
        data: Patient[];
        totalCount: number;
      }>(
        `/admin/getTopPatients?page=${page}&limit=10`,
        { withCredentials: true }
      );
      setPatients(response.data.data);
      setTotalPages(Math.ceil(response.data.totalCount / 10));
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };



  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff', // Blue color
    color: '#fff', // White text
    border: 'none', // No border
    borderRadius: '5px', // Rounded corners
    padding: '10px 20px', // Padding
    marginBottom: '15px', // Add spacing from top
    cursor: 'pointer', // Pointer cursor
  };


  return (
    <div className="container mt-5">
      
      <button style={buttonStyle} className="btn" onClick={handleBack}>
        Back
      </button> {/* Highlighted: Back button added here */}
      
      <h2 className="text-center text-primary mb-4">Top Slot-Booked Patients</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Index</th>
              <th>Patient Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Total Slots Booked</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.patientId}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{patient.patientName}</td>
                <td>{patient.contactNumber}</td>
                <td>{patient.email}</td>
                <td>{patient.gender}</td>
                <td>{patient.totalSlots}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <span className="text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopPatients;
