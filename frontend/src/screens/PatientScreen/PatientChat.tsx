import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import {DoctorDetailsPatientChatScreen} from '../../../interfaces/patientInterfaces'
import api from '../../axios';
const backend_URL= import.meta.env.VITE_BACKEND_URL
const socket = io(`${backend_URL}`); 

// Helper function to format timestamps
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

const ChatWithDoctor: React.FC = () => {
  const location = useLocation();
  const { doctorId, patientId } = location.state || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string | null>(null); // Track last message to prevent duplicat
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetailsPatientChatScreen | null>(null);


  const chatBoxRef = useRef<HTMLDivElement>(null); // Ref for the chat box

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        console.log(doctorId,'iddddddddddddddddddddd');
        const response = await api.get(`/patients/getDoctorDetails/${doctorId}`);
        const data = response.data; // Access the response data directly
        console.log(data,'rstttttttttttttttttttttttttttttt')
        if (data.success) {
          setDoctorDetails(data.data); // Assuming data.data contains the doctor details
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };
    
    fetchDoctorDetails();

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${backend_URL}/api/patients/getChatHistory/${patientId}/${doctorId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    socket.emit('joinRoom', { patientId, doctorId });

    socket.on('receiveChatMessage', (message) => {
      if (message.message !== lastMessage) {
        setMessages((prevMessages) => [...prevMessages, message]);
        setLastMessage(message.message);
      }
    });

    return () => {
      socket.off('receiveChatMessage');
      socket.emit('leaveRoom', { patientId, doctorId });
    };
  }, [doctorId, patientId, lastMessage]);


  
  useEffect(() => {
    // Scroll to the bottom whenever messages are updated
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Triggered whenever the `messages` array changes

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      patientId,
      doctorId,
      message: newMessage,
      sender: 'patient',
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setLastMessage(newMessage);
    setNewMessage('');

    socket.emit('sendChatMessage', messageData);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };
    return (
      <div className="container mt-5">
        <div className="row">
          {/* Doctor Details Section */}
          <div className="col-md-4">
            <div className="doctor-details card p-3">
              {doctorDetails ? (
                <div>
                  <h5 className="card-title">{doctorDetails.name}</h5>
                  <p className="card-text">
                    <strong>Specialization:</strong> {doctorDetails.specialization}
                  </p>
                  <p className="card-text">
                    <strong>Clinic Address:</strong> {doctorDetails.clinicAddress}
                  </p>
                  <p className="card-text">
                    <strong>Contact:</strong> {doctorDetails.contactNumber}
                  </p>
                  <p className="card-text">
                    <strong>Experience:</strong> {doctorDetails.experience} years
                  </p>
                </div>
              ) : (
                <p>Loading doctor details...</p>
              )}
            </div>
          </div>
  
          {/* Chat Section */}
          <div className="col-md-8">
            <h2>Chat with Doctor</h2>
            <div
              ref={chatBoxRef} // Attach the ref to the chat box
              className="chat-box border p-3 mb-3"
              style={{ height: '400px', overflowY: 'scroll', backgroundColor: '#f9f9f9' }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender}`}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: msg.sender === 'patient' ? '#A0E1FF' : '#D3D3D3',
                      padding: '10px',
                      borderRadius: '20px',
                      maxWidth: '60%',
                      wordWrap: 'break-word',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    <strong>{msg.sender === 'patient' ? 'You' : 'Doctor'}:</strong> {msg.message}
                    {msg.timestamp && (
                      <div
                        style={{
                          fontSize: '0.75em',
                          color: '#555',
                          marginTop: '5px',
                          textAlign: 'right',
                        }}
                      >
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
  
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
              />
              <button className="btn btn-primary" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


export default ChatWithDoctor;












