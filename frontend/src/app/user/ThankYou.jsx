import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import React, { Suspense, useEffect, useRef, useState } from 'react';
// Remove react-router-dom imports
// import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRouter, useSearchParams } from 'next/navigation';

const ThankYou = () => {
  const hasRun = useRef();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(typeof window !== 'undefined' ? sessionStorage.getItem('user') : null)
  );
  // Use Next.js search params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const router = useRouter();
  // const { tutorid } = useParams();

  const savePayment = async () => {
    const paymentDetails = await retrievePaymentIntent();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: currentUser?._id,
        // tutor: tutorid, // Add if needed
        details: paymentDetails,
        intentId: searchParams.get('payment_intent'),
        // hours: selHrs
      })
    });
  };

  const retrievePaymentIntent = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/retrieve-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId: searchParams.get('payment_intent') }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      if (searchParams.get('redirect_status') === 'succeeded') {
        savePayment();
      }
    }
  }, []);

  return (
    <Suspense fallback={<Skeleton className="h-32 w-full" />}>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-lg p-8 flex flex-col items-center">
          {searchParams.get('redirect_status') === 'succeeded' ? (
            <>
              <IconCircleCheck size={100} color={'green'} />
              <div className="text-center py-8">
                <h1 className="text-2xl font-bold mb-2 text-green-600">Thank You For Your Purchase!</h1>
                <p className="text-base mb-1">Your order has been placed successfully.</p>
                <p className="text-base">We've sent a confirmation email to your email address.</p>
              </div>
              <Button className="mt-4" onClick={() => router.push('/')}>Go to Home</Button>
            </>
          ) : (
            <>
              <IconCircleX size={100} color={'red'} />
              <div className="text-center py-8">
                <div className="text-xl font-semibold mb-2">Payment Failed</div>
                <div className="text-base mb-1">Your payment was not successful. Please try again.</div>
                <div className="text-base">If the problem persists, please contact us.</div>
              </div>
              <Button className="mt-4" onClick={() => router.push('/')}>Go to Home</Button>
            </>
          )}
        </Card>
      </div>
    </Suspense>
  );
};

export default ThankYou;