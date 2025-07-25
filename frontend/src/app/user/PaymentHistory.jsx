import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

const PaymentHistory = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(typeof window !== 'undefined' ? sessionStorage.getItem('user') : null)
  );
  const [paymentData, setPaymentData] = useState([]);

  const fetchPaymentHistory = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/getbyuser/${currentUser._id}`);
    const data = await response.json();
    setPaymentData(data);
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const displayPaymentHistory = () => {
    if (paymentData.length === 0) {
      return <div className="text-center text-muted-foreground">No payment history found.</div>;
    }
    return paymentData.map((payment, index) => (
      <Card key={index} className="mb-4 p-4">
        <div className="font-semibold">{payment.tutor?.name}</div>
        <div>Amount: ₹{payment.details?.amount / 100}</div>
        <div>Date: {new Date(payment.createdAt).toLocaleString()}</div>
      </Card>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      {displayPaymentHistory()}
    </div>
  );
};

export default PaymentHistory;