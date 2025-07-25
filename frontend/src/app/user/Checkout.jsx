import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import PaymentGateway from './checkout/PaymentGateway';
import { Elements } from '@stripe/react-stripe-js';
// Remove Mantine imports
// import { Box, Button, Container, Flex, Loader, NumberInput, Text, TextInput, Title } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const appearance = {
    theme: 'stripe'
};

const Checkout = () => {
    // Remove useParams from react-router-dom, use Next.js router if needed
    // const { tutorid } = useParams();
    // For now, assume tutorid is passed as a prop or from context
    const [tutorid, setTutorid] = useState(null); // Placeholder, update as needed
    const hasRun = useRef(false);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    const [clientSecret, setClientSecret] = useState('');
    const [tutorDetails, setTutorDetails] = useState(null);
    const [selHrs, setSelHrs] = useState(10);
    const [loading, setLoading] = useState(false);

    const fetchTutorData = async () => {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutor/getbyid/${tutorid}`);
        const data = await response.json();
        setTutorDetails(data);
        setLoading(false);
    };

    useEffect(() => {
        if (tutorid) fetchTutorData();
    }, [tutorid]);

    const getPaymentIntent = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: tutorDetails.pricing * selHrs })
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
    };

    const displayTutorDetails = () => {
        if (loading) {
            return <Skeleton className="h-32 w-full" />;
        }
        if (tutorDetails !== null) {
            return (
                <Card className="my-10 p-6">
                    <h3 className="text-xl font-semibold mb-4">Paying To</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <img style={{objectFit: 'contain'}} width={200} src={`${process.env.NEXT_PUBLIC_API_URL}/${tutorDetails.avatar}`} alt={tutorDetails.name} />
                        <div>
                            <div className="text-lg font-bold">{tutorDetails.name}</div>
                            <div className="text-base">{tutorDetails.email}</div>
                            <div className="text-base">{tutorDetails.experience}+ years of experience</div>
                            <div className="text-lg font-bold">Pricing: ₹{tutorDetails.pricing}</div>
                            <div className="flex items-center gap-2 my-4">
                                <span className="text-lg">Paying for:</span>
                                <Input type="number" value={selHrs} onChange={e => setSelHrs(Number(e.target.value))} min={5} max={60} className="w-20" />
                                <span className="text-lg">Hours</span>
                            </div>
                            <div className="text-lg font-bold">Total Amount: ₹{tutorDetails.pricing * selHrs}</div>
                            <Button className="mt-6" onClick={getPaymentIntent}>Pay Now</Button>
                        </div>
                    </div>
                </Card>
            );
        } else {
            return <Skeleton className="h-32 w-full" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-2">
            {displayTutorDetails()}
            {clientSecret && (
                <Elements stripe={stripePromise} options={{
                    clientSecret,
                    appearance
                }}>
                    <PaymentGateway tutorid={tutorid} />
                </Elements>
            )}
        </div>
    );
};

export default Checkout;