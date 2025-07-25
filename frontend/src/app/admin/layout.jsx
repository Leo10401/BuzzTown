'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from 'react-hot-toast';
import { Menu, LogOut, Shirt, ShoppingCart, User, Package, BarChart2, Plus } from 'lucide-react';
import classes from './sidebar.module.css';
import useAppContext from '@/context/AppContext';

const data = [
    { link: '/admin/dashboard', label: 'Dashboard', icon: BarChart2 },
    { link: '/admin/manageproduct', label: 'Manage Product', icon: Shirt },
    { link: '/admin/manageuser', label: 'Manage User', icon: User },
    { link: '/admin/addproduct', label: 'Add Product', icon: Plus },
    { link: '/admin/manage-orders', label: 'Manage Orders', icon: ShoppingCart },
];

const Layout = ({ children }) => {
    const [active, setActive] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAppContext();

    const links = data.map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
                setSidebarOpen(false);
            }}
        >
            <item.icon className={classes.linkIcon} strokeWidth={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-center" />
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4">
                <h3 className="text-lg font-bold mb-6">Admin Options</h3>
                <nav className="flex-1 flex flex-col gap-2">{links}</nav>
                <div className="mt-auto pt-4">
                    <Button variant="destructive" className="w-full flex items-center gap-2" onClick={logout}>
                        <LogOut className="w-4 h-4" /> Logout
                    </Button>
                </div>
            </aside>
            {/* Sidebar for mobile */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden m-2" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4 w-64">
                    <h3 className="text-lg font-bold mb-6">Admin Options</h3>
                    <nav className="flex flex-col gap-2">{links}</nav>
                    <div className="mt-auto pt-4">
                        <Button variant="destructive" className="w-full flex items-center gap-2" onClick={logout}>
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
            {/* Main content */}
            <main className="flex-1 bg-gray-50 p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;