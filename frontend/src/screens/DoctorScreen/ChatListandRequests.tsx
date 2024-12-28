import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {PatientChatListAndRequestScreen} from '../../../interfaces/doctorInterfaces'
const backend_URL= import.meta.env.VITE_BACKEND_URL

const ChatList: React.FC = () => {
  const [patients, setPatients] = useState<PatientChatListAndRequestScreen[]>([]);
  const doctorId = useSelector((state: RootState) => state.DoctorAuth.user?.id);
  const navigate = useNavigate(); // To programmatically navigate

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await fetch(`${backend_URL}/api/doctor/getChatList/${doctorId}`);
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChatList();
  }, [doctorId]);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Patient Chat Requests</h2>
      <div className="list-group">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <div
              key={patient.patientId}
              className="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded p-3 mb-3"
              style={{
                backgroundColor: '#f8f9fa',
                borderLeft: '5px solid #007bff',
              }}
            >
              {/* Patient Info Section */}
              <div>
                <h5 className="mb-1 text-dark">{patient.patientName}</h5>
                <p className="mb-1 text-muted small">
                  {new Date(patient.latestTimestamp).toLocaleString()} - {patient.latestMessage}
                </p>
              </div>

              {/* Chat Button */}
              <button
                className="btn btn-primary btn-sm"
                style={{
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  padding: '5px 15px',
                }}
                onClick={() =>
                  navigate('/doctor/DoctorSideChat', {
                    state: {
                      doctorId, 
                      patientId:patient.patientId,                      
                    },
                  })
                }// Navigate on click
              >
                Chat
              </button>
            </div>
          ))
        ) : (
          <div
            className="text-center p-4"
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '10px',
            }}
          >
            <p className="text-muted mb-0">No chat requests available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
