import React, { useState, useEffect } from 'react';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the Doctor type
interface Doctor {
  doctorId: string;
  name: string;
  specialization: string;
  contactNumber: string;
  email: string;
  averageRating: number;
}

const TopRatedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate(); 

  const fetchDoctors = async (page: number) => {
    try {
      const response = await api.get(`/admin/getTopRatedDoctors?page=${page}&limit=10`, { withCredentials: true });
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

      <h2 className="text-center mb-4">Top Rated Doctors</h2>
      <table className="table table-bordered table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Index</th>
            <th>Doctor Name</th>
            <th>Specialization</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={doctor.doctorId}>
              <td>{(currentPage - 1) * 10 + index + 1}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.contactNumber}</td>
              <td>{doctor.email}</td>
              <td>
                <span
                  style={{
                    backgroundColor: doctor.averageRating >= 4.5 ? '#28a745' : doctor.averageRating >= 3 ? '#ffc107' : '#dc3545',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  {doctor.averageRating.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <span>
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

export default TopRatedDoctors;
