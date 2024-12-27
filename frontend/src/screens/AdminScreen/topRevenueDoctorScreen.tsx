import React, { useState, useEffect } from 'react';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {TopRevenueDoctorScreen} from '../../../interfaces/adminInterfaces'


const TopDoctors = () => {
  const [doctors, setDoctors] = useState<TopRevenueDoctorScreen []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate(); 

  const fetchDoctors = async (page: number) => {
    try {
      const response = await api.get(`/admin/TopRevenueDoctors?page=${page}&limit=10`, {
        withCredentials: true,
      });
      setDoctors(response.data.data);
      setTotalPages(Math.max(1, Math.ceil(response.data.totalCount / 10))); // Ensure at least 1 page
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Inline styles for customization
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '30px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center' as 'center',
    color: '#343a40',
    marginBottom: '20px',
    fontWeight: 'bold',
  };

  const tableStyle: React.CSSProperties = {
    textAlign: 'center' as 'center',
    marginTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 16px',
    margin: '0 5px',
  };

  const activePageStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#007bff',
  };


  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };



  return (
    <div className="container" style={containerStyle}>

       <button style={buttonStyle} className="btn" onClick={handleBack}>
        Back
      </button> {/* Highlighted: Back button added here */}

      <h2 style={headerStyle}>Top Revenue-Generating Doctors</h2>
      <table className="table table-striped" style={tableStyle}>
        <thead className="thead-dark">
          <tr>
            <th>Index</th>
            <th>Doctor Name</th>
            <th>Specialization</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Total Revenue</th>
            <th>DocEasy Profit</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={doctor.doctorId}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{doctor.doctorName}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.contactNumber}</td>
                <td>{doctor.email}</td>
                <td>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(doctor.totalRevenue)}
                </td>
                <td>
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(doctor.adminProfit)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No doctors found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center">
        <button
          style={buttonStyle}
          className="btn"
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <span style={activePageStyle}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          style={buttonStyle}
          className="btn"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
