import React, { useState, useEffect } from 'react';
import api from '../../axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {TopBookedDoctorScreen} from '../../../interfaces/adminInterfaces'




const TopBookedDoctors = () => {
  const [doctors, setDoctors] = useState<TopBookedDoctorScreen[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate(); 

  const fetchDoctors = async (page: number) => {
    try {
      const response = await api.get(`/admin/getTopBookedDoctors?page=${page}&limit=10`, { withCredentials: true });
      setDoctors(response.data.data);
      setTotalPages(Math.ceil(response.data.totalCount / 10));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage);
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

      <h2 className="text-center text-primary mb-4" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Top Booked Doctors</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <thead className="thead-dark" style={{ backgroundColor: '#343a40', color: 'white', fontWeight: 'bold' }}>
            <tr>
              <th>Rank</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Total Bookings</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={doctor.doctorId} style={{ fontSize: '16px' }}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{doctor.doctorName}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.contactNumber}</td>
                <td>{doctor.email}</td>
                <td>{doctor.totalBookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4" style={{ fontSize: '16px' }}>
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={handlePrevious}
          style={{ borderRadius: '5px', padding: '10px 20px' }}
        >
          Previous
        </button>
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={handleNext}
          style={{ borderRadius: '5px', padding: '10px 20px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopBookedDoctors;
