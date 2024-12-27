// DoctorProfileEdit.tsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'

const DoctorProfileEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor || {};
  const [formData, setFormData] = useState(doctor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/doctor/updateDoctorProfile/${doctor._id}`, formData, {
        withCredentials: true,
      });
      toast.success('Profile updated successfully');
      navigate('/doctor/DoctorProfileDocside');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Doctor Profile</h2>
      <form onSubmit={handleUpdate} className="card p-4 shadow-lg border-0">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            className="form-control"
            value={formData.licenseNumber || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            className="form-control"
            value={formData.contactNumber || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Experience (years)</label>
          <input
            type="number"
            name="experience"
            className="form-control"
            value={formData.experience || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Clinic Address</label>
          <textarea
            name="clinicAddress"
            className="form-control"
            value={formData.clinicAddress || ''}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>
        <div className="form-group mt-3">
          <label className="form-label">locality</label>
          <textarea
            name="locality"
            className="form-control"
            value={formData.locality || ''}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>
        <div className="form-group mt-3">
          <label className="form-label">consultationFee</label>
          <input
            type="number"
            name="consultationFee"
            className="form-control"
            value={formData.consultationFee || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mt-3">
          <label className="form-label">Biography</label>
          <textarea
            name="biography"
            className="form-control"
            value={formData.biography || ''}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfileEdit;
