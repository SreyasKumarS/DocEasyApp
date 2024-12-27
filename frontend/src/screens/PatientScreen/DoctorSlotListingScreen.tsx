import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import api from '../../axios'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DoctorSlots = () => {
  const location = useLocation();
  const doctorId = location.state?.doctorId;
  const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [adminFees, setAdminFees] = useState<{ fixedFee: number | null; percentageFee: number | null }>({
    fixedFee: null,
    percentageFee: null,
  });
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setIsRazorpayLoaded(true);
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await api.get(`/patients/getSlots/${doctorId}/${formattedDate}`);
        setSlots(response.data.slots || []);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setSlots([]);
      }
    };

    fetchSlots();
  }, [doctorId, selectedDate]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const adminResponse = await api.get('/patients/getPlatformFee');
        setAdminFees(adminResponse.data);

        const doctorResponse = await api.get(`/patients/getConsultationFee/${doctorId}`);
        setConsultationFee(doctorResponse.data.consultationFee);
      } catch (error) {
        console.error('Error fetching fees:', error);
      }
    };

    fetchFees();
  }, [doctorId]);

  const calculateTotalAmount = () => {
    const { fixedFee, percentageFee } = adminFees;
    if (fixedFee !== null) {
      return consultationFee + fixedFee;
    } else if (percentageFee !== null) {
      return consultationFee + (consultationFee * percentageFee) / 100;
    }
    return consultationFee; // Default to consultation fee if no admin fee
  };

  const handleBookNow = (slot: any) => {
    setSelectedSlot(slot);
    setShowPaymentModal(true);
  };

  const handleRazorpayPayment = async () => {
    const totalAmount = calculateTotalAmount();

//----
    const { fixedFee, percentageFee } = adminFees;
    const adminFee = fixedFee !== null ? fixedFee : (consultationFee * (percentageFee || 0)) / 100;



    if (!isRazorpayLoaded) {
      toast.error('Payment system is not ready yet. Please try again later.');
      return;
    }

    try {
      const { data } = await api.post('/patients/createOrder', {
        slotId: selectedSlot._id,
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Doctor Booking',
        description: 'Slot Booking Payment',
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            await api.post('/patients/confirmPayment', {
              paymentId: response.razorpay_payment_id,
              orderId: data.orderId,
              slotId: selectedSlot._id,
              doctorId,
              patientId,
              totalAmount,
              adminFee,
              consultationFee, 
            });
            toast.success('Payment successful! Slot booked.');
            setSlots((prevSlots) =>
              prevSlots.map((s) => (s._id === selectedSlot._id ? { ...s, status: 'booked' } : s))
            );
            setShowPaymentModal(false);


            navigate('/patient/BookingSuccessScreen', {
              state: {
                slotId: selectedSlot._id,
              },
            });
       
 
          } catch (error) {
            console.error('Error confirming payment:', error);
          }
        },
        prefill: {
          name: 'Patient Name',
          email: 'patient@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleWalletPayment = async () => {
    try {
      const totalAmount = calculateTotalAmount();


      const { fixedFee, percentageFee } = adminFees;
      const adminFee = fixedFee !== null ? fixedFee : (consultationFee * (percentageFee || 0)) / 100;
    




      await api.post('/patients/confirmWalletPayment', {
        slotId: selectedSlot._id,
        doctorId,
        patientId,
        totalAmount,
        adminFee,
        consultationFee,

      });
      toast.success('Payment successful! Slot booked using wallet.');
      setSlots((prevSlots) =>
        prevSlots.map((s) => (s._id === selectedSlot._id ? { ...s, status: 'booked' } : s))
      );
      setShowPaymentModal(false);



      navigate('/patient/BookingSuccessScreen', {
        state: {
          slotId: selectedSlot._id,
        },
      });





    } catch (error) {
      console.error('Error processing wallet payment:', error);
      toast.error('Wallet payment failed. Please try again.');
    }
  };

  return (
    <Container className="py-4">
      <h2>Available Slots</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => date && setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="form-control mb-3"
      />
      <Row className="mt-3">
        {slots.length === 0 ? (
          <Col>
            <p>No available slots for this date.</p>
          </Col>
        ) : (
          slots.map((slot) => (
            <Col key={slot._id} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    Date: {formatDate(slot.date)} <br />
                    Time: {new Date(slot.startTime).toLocaleTimeString()} -{' '}
                    {new Date(slot.endTime).toLocaleTimeString()}
                  </Card.Title>
                  <Card.Text>Status: {slot.status === 'available' ? 'Available' : 'Booked'}</Card.Text>
                  <Button
                    variant="success"
                    onClick={() => handleBookNow(slot)}
                    disabled={slot.status !== 'available'}
                  >
                    {slot.status === 'available' ? 'Book Now' : 'Unavailable'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" className="mb-3 w-100" onClick={handleRazorpayPayment}>
            Pay via Razorpay
          </Button>
          <Button variant="secondary" className="w-100" onClick={handleWalletPayment}>
            Pay via Wallet
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DoctorSlots;
