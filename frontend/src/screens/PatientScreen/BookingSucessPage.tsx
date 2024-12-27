import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../axios'
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf'; // Import jsPDF
import { Button, Card, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import { useNavigate } from 'react-router-dom';
import {BookingSucessPageScreen} from '../../../interfaces/patientInterfaces'


const BookingSuccess = () => {
  const location = useLocation();
  const { slotId } = location.state; // Extract slotId from navigate state
  const [bookingDetails, setBookingDetails] = useState<BookingSucessPageScreen | null>(null);

  const navigate = useNavigate(); 




  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const { data } = await api.get(`/patients/getBookingDetailsforSuccessPage/${slotId}`);
        setBookingDetails(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details.');
      }
    };

    fetchBookingDetails();
  }, [slotId]);

  if (!bookingDetails) {
    return <p>Loading booking details...</p>;
  }




  const handleDownload = () => {
    const doc = new jsPDF();
    

    doc.setFont("times", "normal"); 
    
    doc.setFillColor(0, 123, 255); 
    doc.rect(0, 0, 210, 40, "F"); 
    doc.setTextColor(255, 255, 255); 
    doc.setFontSize(30);
    doc.text("Doceasy", 105, 25, { align: "center" }); 
    doc.setFontSize(16);
    doc.text("Health is Our Priority", 105, 35, { align: "center" }); 
    
    const startY = 50;
    const lineHeight = 12;
    
 
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0); 
    doc.text("Invoice Details", 105, startY, { align: "center" });
  

    doc.setLineWidth(0.5);
    doc.line(20, startY + lineHeight * 1.5, 190, startY + lineHeight * 1.5); 
    

    const keyFontSize = 15; 
    const valueFontSize = 13; 
    doc.setFontSize(keyFontSize);
    

    doc.setFont("times", "bold"); 
    doc.text(`Doctor Name:`, 20, startY + lineHeight * 2);
    doc.setFont("times", "normal"); 
    doc.setFontSize(valueFontSize); 
    doc.text(`${bookingDetails.doctorName}`, 60, startY + lineHeight * 2);

    doc.setFontSize(keyFontSize); 
    doc.setFont("times", "bold");
    doc.text(`Doctor Address:`, 20, startY + lineHeight * 3);
    doc.setFont("times", "normal"); 
    doc.setFontSize(valueFontSize);
    doc.text(`${bookingDetails.doctorAddress}`, 60, startY + lineHeight * 3);
  
 
    doc.setFont("times", "bold"); 
    doc.setFontSize(keyFontSize);
    doc.text(`Date:`, 20, startY + lineHeight * 4);
    doc.setFont("times", "normal"); 
    doc.setFontSize(valueFontSize); 
    doc.text(`${new Date(bookingDetails.appointmentDate).toLocaleDateString()}`, 60, startY + lineHeight * 4);
  
  
    doc.setFontSize(keyFontSize);
    doc.setFont("times","bold");
    doc.text(
      `Slot Time:`,
      20,
      startY + lineHeight * 5
    );
    doc.setFont("times", "normal"); 
    doc.setFontSize(valueFontSize);
    doc.text(
      `${new Date(bookingDetails.appointmentStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(bookingDetails.appointmentEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      60,
      startY + lineHeight * 5
    );
  
  
    doc.setFontSize(keyFontSize);
    doc.setFont("times", "bold");
    doc.text(`Booking Amount:`, 20, startY + lineHeight * 6);
    doc.setFont("times", "normal");
    doc.setFontSize(valueFontSize);
    doc.text(`${bookingDetails.amount}`, 60, startY + lineHeight * 6);
  
doc.setFontSize(keyFontSize);
doc.setFont("times", "bold");
doc.text(`Payment Method:`, 20, startY + lineHeight * 7);
const keyWidth = doc.getTextWidth("Payment Method:"); 
const spaceBetween = 2; 
const valueX = 20 + keyWidth + spaceBetween;
doc.setFont("times", "normal");
doc.setFontSize(valueFontSize);
doc.text(`${bookingDetails.paymentMethod}`, valueX, startY + lineHeight * 7);

  
  
   
    doc.line(20, startY + lineHeight * 9, 190, startY + lineHeight * 9); 
    
    const footerY = 270; 
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); 
    doc.text("Thank you for choosing Doceasy! We value your trust.", 105, footerY, { align: "center" });
    doc.text("For support, contact us at: support@doceasy.com", 105, footerY + 10, { align: "center" });
    doc.text("© 2024 Doceasy. All rights reserved.", 105, footerY + 20, { align: "center" });
    

    doc.save("invoice.pdf");
  };
  
  



  const handleBack = () => {
    navigate(-1); 
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


      <h1 className="text-center">Appointment Successful</h1>
      <p className="text-center">Your appointment has been successfully booked.</p>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4>Booking Details</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Doctor Name:</strong> {bookingDetails.doctorName}</p>
              <p><strong>Doctor Address:</strong> {bookingDetails.doctorAddress}</p>
              <p><strong>Date:</strong> {new Date(bookingDetails.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Slot Time:</strong> 
                {`${new Date(bookingDetails.appointmentStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(bookingDetails.appointmentEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
              <p><strong>Booking Amount:</strong> ₹{bookingDetails.amount}</p>
              <p><strong>Payment Method:</strong> {bookingDetails.paymentMethod}</p>
              {/* <p><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</p> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Button to trigger the PDF download */}
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleDownload}>
          Download Invoice as PDF
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccess;
