
import React, { useEffect, useState } from 'react';
import api from '../../axios'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { toast } from 'react-toastify';
import {Wallet,TransactionWalletScreen} from '../../../interfaces/patientInterfaces'



const WalletPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.PatientAuth.user);
  const patientId = useSelector((state: RootState) => state.PatientAuth.user?.id);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<TransactionWalletScreen[]>([]);
  const [amount, setAmount] = useState<number>()
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);


  // Dynamically load Razorpay script
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

  // Fetch wallet details
  const fetchWalletDetails = async (page: number = 1) => {
    try {
      const response = await api.get(`/patients/getWalletDetails/${patientId}?page=${page}&limit=15`);
      setWallet(response.data.wallet);
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.totalTransactions / 15));
    } catch (error) {
      console.error('Error fetching wallet details:', error);
    }
  };
  

  // Handle wallet recharge with Razorpay
  const handleRecharge = async () => {
    if (!isRazorpayLoaded) {
      toast.success('Payment system is not ready yet. Please try again later.');
      return;
    }

    try {
      const { data } = await api.post('/patients/createWalletRechargeOrder', {
        patientId,
        amount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Access Razorpay key from environment variables
        amount: data.amount,
        currency: 'INR',
        name: 'Wallet Recharge',
        description: 'Recharge Wallet Balance',
        order_id: data.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await api.post('/patients/rechargeWallet', {
              paymentId: response.razorpay_payment_id,
              orderId: data.orderId,
              patientId,
              amount
            });
            toast.success('Recharge successful!');
            fetchWalletDetails();
          } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Recharge failed.');
          }
        },
        prefill: {
          name: user?.name || 'Patient',
          email: user?.email || 'patient@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Recharge initiation failed. Please try again.');
    }
  };

  // Fetch wallet details on component mount or patientId change
  useEffect(() => {
    if (patientId) fetchWalletDetails();
  }, [patientId]);



  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchWalletDetails(newPage);
  };
  

  return (
    <div className="container mt-4">
      <h1>Wallet</h1>

      {/* Display Wallet Balance */}
      {wallet && <h2 className="mb-4">Current Balance: ₹{wallet.balance.toFixed(2)}</h2>}

      {/* Recharge Section */}
      <div className="mb-4">
  <input
    type="number"
    className="form-control mb-2"
    value={amount}  // Display the current amount, initially set to 0 or blank
    onChange={(e) => setAmount(Number(e.target.value) || 0)}  // Ensures the value is always a number
    placeholder="Enter amount to recharge"  // Placeholder text for clarity
    min="0"  // Optional: Ensures only positive numbers can be entered
  />
  <button onClick={handleRecharge} className="btn btn-primary">
    Recharge Wallet
  </button>
</div>


      {/* Transactions Table */}
{/* Transactions Table */}
<h3 className="my-4 text-center" style={{ color: '#6c757d', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
  Transaction History
</h3>
      <table className="table table-hover table-striped table-bordered align-middle">
        <thead className="table-primary">
    <tr>
      <th className="text-center">Date & Time</th>
      <th className="text-center">Type</th>
      <th className="text-center">Debit / Credit</th>
      <th className="text-center">Amount</th>
      <th className="text-center">Status</th>
      <th className="text-center">Description</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map((transaction) => (
      <tr key={transaction._id}>
        <td className="text-center">
          {new Date(transaction.createdAt).toLocaleDateString('en-GB')},{' '}
          {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
        </td>
        <td className="text-center">{transaction.type}</td>
        <td className="text-center">
          {transaction.type === 'recharge' || transaction.type === 'refund'
            ? 'Credit'
            : transaction.type === 'no refund'
            ? 'Null'
            : 'Debit'}
        </td>
        <td className="text-center">₹{transaction.amount.toFixed(2)}</td>
        <td className={`text-center ${transaction.status === 'successful' ? 'text-success' : 'text-danger'}`}>
          {transaction.status}
        </td>
        <td className="text-center">{transaction.description}</td>
      </tr>
    ))}
  </tbody>
</table>



      <div className="pagination">
  <button
    className="btn btn-secondary"
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  >
    Previous
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button
    className="btn btn-secondary"
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
  >
    Next
  </button>
</div>
 </div>
  );
};

export default WalletPage;
