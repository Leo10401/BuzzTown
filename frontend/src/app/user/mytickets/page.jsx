"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  IconCircleCheckFilled, 
  IconTruckLoading, 
  IconTruck, 
  IconPackageExport 
} from '@tabler/icons-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useMemo } from 'react';

const timelineSteps = [
  {
    title: 'Order Placed',
    icon: <IconCircleCheckFilled size={16} />, 
    description: 'Order has been placed successfully.'
  },
  {
    title: 'Shipped',
    icon: <IconTruckLoading size={16} />, 
    description: 'Product has been shipped and is on the way to the customer.'
  },
  {
    title: 'On the Way',
    icon: <IconTruck size={16} />, 
    description: 'Product is on the way to the customer.'
  },
  {
    title: 'Delivered',
    icon: <IconPackageExport size={16} />, 
    description: 'Product has been delivered to the customer.'
  }
];

const statusToStep = {
  placed: 0,
  shipped: 1,
  ontheway: 2,
  delivered: 3
};

const OrderHistory = () => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(typeof window !== 'undefined' ? sessionStorage.getItem('user') : null)
  );
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderIdx, setSelectedOrderIdx] = useState(0);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/getbyuser`, {
      headers: {
        'x-auth-token': currentUser.token
      }
    });
    const data = await response.json();
    setPaymentData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPaymentHistory();
    // eslint-disable-next-line
  }, []);

  // Sort orders by date (newest to oldest)
  const sortedOrders = useMemo(() => {
    return [...paymentData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [paymentData]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 flex gap-6">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4 h-fit sticky top-8">
        <h2 className="text-xl font-bold mb-4">All Tickets</h2>
        <div className="flex flex-col gap-2">
          {sortedOrders.length === 0 ? (
            <div className="text-muted-foreground text-sm">No tickets found.</div>
          ) : (
            sortedOrders.map((order, idx) => (
              <button
                key={order._id}
                className={`text-left px-3 py-2 rounded transition-colors border border-transparent ${
                  idx === selectedOrderIdx ? 'bg-blue-100 border-blue-500 font-semibold' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedOrderIdx(idx)}
              >
                <div className="truncate text-sm">{order.entryPassKey}</div>
                <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</div>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Main Ticket Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center mb-8">My Tickets</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center text-muted-foreground">No tickets found.</div>
        ) : (
          <Card key={sortedOrders[selectedOrderIdx]._id} className="mb-8 p-6 flex flex-col items-center">
            <div className="mb-4">
              <QRCodeCanvas value={sortedOrders[selectedOrderIdx].entryPassKey || ''} size={160} />
            </div>
            <div className="mb-2 text-lg font-semibold">Entry Pass Key:</div>
            <div className="mb-4 text-blue-600 font-mono break-all">{sortedOrders[selectedOrderIdx].entryPassKey}</div>
            <div className="mb-2 text-lg font-semibold">Tickets:</div>
            <ul className="mb-4">
              {sortedOrders[selectedOrderIdx].items.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  Type: <span className="font-semibold">{item.type}</span> | Quantity: <span className="font-semibold">{item.quantity}</span> | Price: ₹{item.price}
                </li>
              ))}
            </ul>
            <div className="mb-2 text-lg font-semibold">Order Date:</div>
            <div className="mb-4">{sortedOrders[selectedOrderIdx].createdAt ? new Date(sortedOrders[selectedOrderIdx].createdAt).toLocaleString() : ''}</div>
            <div className="mt-2 text-green-600 font-bold">Show this QR code at the event entrance for entry.</div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;