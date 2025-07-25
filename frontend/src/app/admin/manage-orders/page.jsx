'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/getall`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/update/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusBodyTemplate = (rowData) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'placed': return 'bg-yellow-100 text-yellow-800';
        case 'confirmed': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Select
        defaultValue={rowData.status}
        onValueChange={(value) => updateOrderStatus(rowData._id, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <Badge className={getStatusColor(rowData.status)}>
              {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="placed">Placed</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleDateString();
  };

  const itemsBodyTemplate = (rowData) => {
    return rowData.items.map((item, index) => (
      <div key={index} className="mb-1">
        {item.type} x {item.quantity} @ ₹{item.price}
      </div>
    ));
  };

  const totalAmountBodyTemplate = (rowData) => {
    const total = rowData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    return `₹${total}`;
  };

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      <DataTable 
        value={orders} 
        loading={loading}
        paginator 
        rows={10} 
        className="p-datatable-striped"
      >
        <Column field="entryPassKey" header="Entry Pass" sortable />
        <Column field="items" header="Items" body={itemsBodyTemplate} />
        <Column header="Total Amount" body={totalAmountBodyTemplate} sortable />
        <Column field="status" header="Status" body={statusBodyTemplate} sortable />
        <Column field="createdAt" header="Order Date" body={dateBodyTemplate} sortable />
      </DataTable>
    </Card>
  );
};

export default ManageOrders;