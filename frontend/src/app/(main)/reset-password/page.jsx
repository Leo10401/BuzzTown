'use client'
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('OTP sent successfully');
                setStep(2);
            } else {
                toast.error('Email not registered');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/verifyotp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('OTP verified successfully');
                setStep(3);
            } else {
                toast.error('Invalid OTP');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password updated successfully');
                // Redirect to login page
                window.location.href = '/authenticate';
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">
                            Reset Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </Button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div>
                                    <Label htmlFor="otp">OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        placeholder="Enter OTP"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </Button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        )}

                        <Separator className="my-4" />
                        
                        <div className="text-center">
                            <a href="/authenticate" className="text-sm text-blue-600 hover:text-blue-500">
                                Back to Login
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;