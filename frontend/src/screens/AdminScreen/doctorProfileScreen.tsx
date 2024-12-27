
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import {DoctorProfileScreen } from '../../../interfaces/adminInterfaces'

const DoctorProfile: React.FC = () => {
  const location = useLocation();
  const { doctorId } = location.state as DoctorProfileScreen  || { doctorId: '' };
  const [doctor, setDoctor] = useState<any>(null);

  const fetchDoctorDetails = async () => {
    try {
      const response = await api.get(
        `/admin/fetchDoctorById/${doctorId}`,
        { withCredentials: true }
      );
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  if (!doctor) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0 rounded-lg">
   
        <div className="card-header bg-dark text-white p-4 text-center">
          <h2 className="mb-0">Doctor Profile</h2>
        </div>
        
      
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4 text-center">
              <img
                src={`${doctor.profilePicture}`}
                alt={`${doctor.name}'s Profile`}
                className="img-fluid rounded-circle shadow-sm mb-4"
                style={{ width: '150px', height: '150px', objectFit: 'cover'}}
              />
              <h4 className="text-primary">{doctor.name}</h4>
              <p className="text-muted">{doctor.specialization}</p>
            </div>
            
            <div className="col-lg-8">
              <h5 className="border-bottom pb-2 text-muted">Personal Information</h5>
              <div className="row">
                <div className="col-sm-6">
                  <strong>ID:</strong> {doctor._id}
                </div>
                <div className="col-sm-6">
                  <strong>Email:</strong> {doctor.email}
                </div>
                <div className="col-sm-6 mt-2">
                  <strong>License Number:</strong> {doctor.licenseNumber}
                </div>
                <div className="col-sm-6 mt-2">
                  <strong>Contact:</strong> {doctor.contactNumber}
                </div>
                <div className="col-sm-6 mt-2">
                  <strong>Experience:</strong> {doctor.experience} years
                </div>
                <div className="col-sm-6 mt-2">
                  <strong>Clinic Address:</strong> {doctor.clinicAddress}
                </div>
              </div>

              <h5 className="border-bottom pb-2 text-muted mt-4">Biography</h5>
              <p className="text-justify">{doctor.biography}</p>
            </div>
          </div>
          
      
          <div className="row mt-4">
            <div className="col-md-6 text-center">
              <h5 className="text-muted">Medical License</h5>
              <img
                src={`${doctor.medicalLicense}`}
                alt="Medical License"
                className="img-fluid rounded shadow-sm border mt-2"
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
            </div>
            <div className="col-md-6 text-center">
              <h5 className="text-muted">ID Proof</h5>
              <img
                src={`${doctor.idProof}`}
                alt="ID Proof"
                className="img-fluid rounded shadow-sm border mt-2"
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
            </div>
          </div>
        </div>

      
        <div className="card-footer text-muted text-center p-3">
          <small>Contact us for more information about this doctor</small>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
