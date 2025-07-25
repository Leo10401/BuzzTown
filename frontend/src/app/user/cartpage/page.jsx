'use client';
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/context/CartContext';
import { IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

const CartPage = () => {
  const { cartItems, cartTotalAmount, updateItemQuantity, removeItem, clearItem, clearCart } = useCartContext();

  console.log(cartItems);
  const handleRemoveItem = (item) => {
    removeItem(item);
  };

  const handleInputChange = (itemId, newQuantity) => {
    updateItemQuantity(itemId, newQuantity);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is currently empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <Card key={item._id + '-' + (item.selectedTicket?.type || '')} className="w-full">
                <CardContent className="p-0">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2">
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/${item.image[0]}`} alt={item.name} className="w-full rounded" />
                    </div>
                    <div className="col-span-6 py-5">
                      <span className="text-xs font-semibold uppercase text-gray-400">{item.category}</span>
                      <div className="font-semibold text-lg">{item.title}</div>
                      <div className="text-md font-semibold">Type: {item.selectedTicket?.type || item.tickets[0]?.type}</div>
                      <div className="text-xl font-bold">₹{((item.selectedTicket?.price || item.tickets[0]?.price) * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className="col-span-4 flex flex-col items-end gap-2 py-5">
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleRemoveItem(item)}>
                        <IconTrash size={16} />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        label="Quantity"
                        placeholder="1"
                        value={item.quantity.toString()}
                        onChange={(e) => handleInputChange(item._id, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="flex flex-row justify-between items-center">
            <span className="text-lg font-semibold">Total: ₹{cartTotalAmount.toFixed(2)}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
              <Button asChild>
                <Link href="/user/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
