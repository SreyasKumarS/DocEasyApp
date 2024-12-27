import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import {PatientDetailsDoctorChatScreen } from '../../../interfaces/doctorInterfaces';
import api from '../../axios';

const socket = io('http://localhost:5000'); // Your backend URL for the Socket.IO server

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

const ChatPage: React.FC = () => {
  const location = useLocation();
  const { doctorId, patientId } = location.state || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<PatientDetailsDoctorChatScreen | null>(null);
  // Ref for chat box
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {


    const fetchPatientDetails = async () => {
      try {
        const response = await api.get(`/doctor/fetchPatientDetails/${patientId}`);
        const data = response.data; // Access the response data directly

        if (data.success) {
          setPatientDetails(data.data); // Assuming data.data contains the doctor details
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };
    
    fetchPatientDetails();





    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/getChatHistory/${patientId}/${doctorId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    socket.emit('joinRoom', { patientId, doctorId });

    socket.on('receiveChatMessage', (message) => {
      // Only update state when a new message comes in
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveChatMessage');
      socket.emit('leaveRoom', { patientId, doctorId });
    };
  }, [patientId, doctorId]);

  useEffect(() => {
    // Scroll to the bottom of the chat box when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      patientId,
      doctorId,
      message: newMessage,
      sender: 'doctor',
      timestamp: new Date().toISOString(),
    };

    // Emit message to the server, but don't add it to the state yet
    socket.emit('sendChatMessage', messageData);

    setNewMessage('');  // Clear input
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

    return (
      <div className="container mt-5">
        <div className="row">
          {/* Patient Details Section */}
          <div className="col-md-4">
            <div className="patient-details card p-3">
              {patientDetails ? (
                <div>
                  <h5 className="card-title">{patientDetails.name}</h5>
                  <p className="card-text">
                    <strong>Contact Number:</strong> {patientDetails.contactNumber}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {patientDetails.email}
                  </p>
                  <p className="card-text">
                    <strong>Gender:</strong> {patientDetails.gender}
                  </p>
                </div>
              ) : (
                <p>Loading patient details...</p>
              )}
            </div>
          </div>
  
          {/* Chat Section */}
          <div className="col-md-8">
            <h2>Chat with Patient</h2>
            <div
              ref={chatBoxRef} // Attach the ref to the chat box
              className="chat-box border p-3 mb-3"
              style={{ height: "400px", overflowY: "scroll", backgroundColor: "#f9f9f9" }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender}`}
                  style={{
                    display: "flex",
                    justifyContent: msg.sender === "doctor" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: msg.sender === "doctor" ? "#A0E1FF" : "#D3D3D3",
                      padding: "10px",
                      borderRadius: "20px",
                      maxWidth: "60%",
                      wordWrap: "break-word",
                      textAlign: "left",
                    }}
                  >
                    <strong>{msg.sender === "doctor" ? "You" : "Patient"}:</strong> {msg.message}
                    {msg.timestamp && (
                      <div
                        style={{
                          fontSize: "0.75em",
                          color: "#555",
                          marginTop: "5px",
                          textAlign: "right",
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
  
  export default ChatPage;