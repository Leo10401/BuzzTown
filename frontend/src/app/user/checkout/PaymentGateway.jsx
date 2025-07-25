import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from "axios";
import useCartContext from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

const PaymentGateway = () => {
  const [currentUser] = useState(
    JSON.parse(typeof window !== "undefined" ? sessionStorage.getItem("user") : null)
  );
  const [errorMessage, setErrorMessage] = useState(null);
  const { cartItems, cartTotalAmount } = useCartContext();
  const router = useRouter();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setErrorMessage("Failed to load Razorpay script. Please try again.");
      return;
    }

    const options = {
      key:'rzp_test_bk0zjM7KLBpw2q',
      amount: cartTotalAmount * 100, // Amount in paise
      currency: "INR",
      name: "BUZZTOWN",
      description: "Bill Payment",
      image: "logobuzz.png",
      handler: async function (response) {
        // Place order after successful payment
        try {
          const items = cartItems.map(item => ({
            type: item.selectedTicket?.type || item.tickets[0]?.type,
            quantity: item.quantity,
            price: item.selectedTicket?.price || item.tickets[0]?.price
          }));
          const product = cartItems[0]?._id;
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/order/add`,
            { product, items },
            { headers: { 'x-auth-token': currentUser?.token || '' } }
          );
          if (res.status === 200 && res.data) {
            // Generate QR code for entryPassKey
            const entryPassKey = res.data.entryPassKey;
            const eventDetails = cartItems[0];
            // Redirect to ticket-booked page with order info
            router.push(`/user/ticket-booked?entryPassKey=${encodeURIComponent(entryPassKey)}&event=${encodeURIComponent(eventDetails.title)}&date=${encodeURIComponent(eventDetails.date)}`);
          } else {
            alert('Payment succeeded, but order placement failed.');
          }
        } catch (err) {
          alert('Payment succeeded, but order placement failed.');
        }
      },
      prefill: {
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        contact: currentUser?.contact || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Card className="p-8 mt-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Secure Payment Gateway</h3>
        <Separator className="my-2" />
      </div>
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <div className="mb-4">Bill Amount: ₹{cartTotalAmount.toFixed(2)}</div>
      <Button onClick={handlePayment} className="w-full" variant="default">
        Pay ₹{cartTotalAmount.toFixed(2)}
      </Button>
    </Card>
  );
};

export default PaymentGateway;