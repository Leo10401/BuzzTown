'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "react-hot-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import useAppContext from '@/context/AppContext';
import './profile.css';

const ProfilePage = () => {
    const { currentUser, setCurrentUser } = useAppContext();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        contact: currentUser?.contact || '',
        address: currentUser?.address || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': currentUser?.token || ''
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = { ...currentUser, ...formData };
                setCurrentUser(updatedUser);
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('user', JSON.stringify(updatedUser));
                }
                toast.success('Profile Updated successfully');
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="container mx-auto max-w-2xl p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input
                                id="contact"
                                name="contact"
                                type="tel"
                                value={formData.contact}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <Separator />
                        
                        <Button type="submit" className="w-full">
                            Update Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;