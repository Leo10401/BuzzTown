'use client';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import classes from './Checkoutpage.module.css';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import PaymentGateway from './PaymentGateway';
import useCartContext from '@/context/CartContext';
import useAppContext from '@/context/AppContext';
import { useRouter } from 'next/navigation';

const appearance = {
    theme: 'day'
};

function CheckoutPage() {

    const [selFile, setSelFile] = useState('');
    const hasRun = useRef(false);
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const [clientSecret, setClientSecret] = useState('');
    const [tutorDetails, setTutorDetails] = useState(null);
    const { cartTotalAmount, cartItems } = useCartContext();
    const { currentUser } = useAppContext();
    const router = useRouter();

    // Order placement handler
    const handlePlaceOrder = async () => {
        try {
            const items = cartItems.map(item => ({
                type: item.selectedTicket?.type || item.tickets[0]?.type,
                quantity: item.quantity,
                price: item.selectedTicket?.price || item.tickets[0]?.price
            }));
            const product = cartItems[0]?._id;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': currentUser?.token || ''
                },
                body: JSON.stringify({
                    product,
                    items,
                })
            });
            if (res.ok) {
                toast.success('Order placed successfully!');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Order failed');
            }
        } catch (error) {
            toast.error('Order failed');
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Ticket Details</h4>
                        <Separator className="my-2" />
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div className="flex items-start justify-between" key={item._id}>
                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image[0]}`} alt={item.name} width={50} />
                                    <div className="flex-1 px-2">
                                        <div className="font-bold">{item.title}</div>
                                        <div>Type: {item.selectedTicket?.type || item.tickets[0]?.type}</div>
                                        <div>Quantity: {item.quantity}</div>
                                        <div>Price: ₹{item.selectedTicket?.price || item.tickets[0]?.price}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            ₹{(item.selectedTicket?.price || item.tickets[0]?.price) * item.quantity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Payment Summary</h4>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{cartTotalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>₹{cartTotalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <PaymentGateway />
        </div>
    );
}

export default CheckoutPage;  