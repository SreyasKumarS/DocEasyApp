import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 
import ReactStars from 'react-rating-stars-component'; 
import api from '../../axios';

const DoctorProfileDocside: React.FC = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const [averageRating, setAverageRating] = useState<number | null>(null);


  const fetchDoctorDetails = async () => {
    try {
      const response = await api.get(
        `/doctor/fetchDoctorById/${doctorId}`);
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };


  const fetchAverageRating = async () => {
    try {
      const ratingResponse = await api.get(`/patients/getDoctorAverageRating/${doctorId}`);
      setAverageRating(ratingResponse.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };
  



  useEffect(() => {
    fetchDoctorDetails();
    fetchAverageRating();
  }, [doctorId]);

  if (!doctor) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-lg">
        <div className="card-header bg-dark text-white p-4 text-center">
          <h2 className="mb-0">Doctor Profile</h2>
        </div>
        <div className="card-body">
          {/* Doctor Details */}
          <div className="row">
            <div className="col-lg-4 text-center">
              <img
                src={`${doctor.profilePicture}`}
                alt={`${doctor.name}'s Profile`}
                className="img-fluid rounded-circle shadow-sm mb-4"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h4 className="text-primary">{doctor.name}</h4>
              <p className="text-muted">{doctor.specialization}</p>
            </div>
            <div className="col-lg-8">
              {/* Personal Information */}
              <h5 className="border-bottom pb-2 text-muted">Personal Information</h5>
              <div className="row">
                <div className="col-sm-6"><strong>Email:</strong> {doctor.email}</div>
                <div className="col-sm-6 mt-2"><strong>License Number:</strong> {doctor.licenseNumber}</div>
                <div className="col-sm-6 mt-2"><strong>Contact:</strong> {doctor.contactNumber}</div>
                <div className="col-sm-6 mt-2"><strong>Experience:</strong> {doctor.experience} years</div>
                <div className="col-sm-6 mt-2"><strong>Clinic Address:</strong> {doctor.clinicAddress}</div>
                <div className="col-sm-6 mt-2"><strong>consultation Fee:</strong> {doctor.consultationFee}</div>
                <div className="col-sm-6 mt-2"><strong>Locality:</strong> {doctor.locality}</div>
                <div className="col-sm-6 mt-2"><strong>Joining Date:</strong> {new Date(doctor.createdAt).toLocaleDateString('en-GB')}</div>
                <div className="col-sm-6 mt-2">{averageRating !== null && (
                            <div>
                              <p>
                                <strong>Average Rating:</strong> {averageRating.toFixed(1)}
                              </p>
                              <ReactStars
                                count={5}
                                size={24}
                                value={averageRating}
                                edit={false}
                                isHalf={true}
                                activeColor="#ffd700"
                              />
                            </div>
                          )}</div>  
              </div>
              <h5 className="border-bottom pb-2 text-muted mt-4">Biography</h5>
              <p className="text-justify">{doctor.biography}</p>
              
              {/* Display License and ID Proof */}
              <h5 className="border-bottom pb-2 text-muted mt-4">Documents</h5>
              <div className="row">
                <div className="col-lg-6 text-center">
                  <h6>License Proof</h6>
                  <img
                    src={`${doctor.medicalLicense}`}
                    alt="License Proof"
                    className="img-fluid shadow-sm mb-3"
                    style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-lg-6 text-center">
                  <h6>ID Proof</h6>
                  <img
                    src={`${doctor.idProof}`}
                    alt="ID Proof"
                    className="img-fluid shadow-sm mb-3"
                    style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/doctor/DoctorProfileEdit', { state: { doctor } })}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDocside;
