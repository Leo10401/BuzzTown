'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const runOnce = useRef(false);
    const [cartItems, setCartItems] = useState(JSON.parse(typeof window !== 'undefined' ? sessionStorage.getItem('cartItems') : null) || []);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);

    const [cartOpened, setCartOpened] = useState(false);
    const toggleCart = () => setCartOpened((prev) => !prev);

    // Helper to uniquely identify a cart item (event + ticket type)
    const getCartItemKey = (item) => `${item._id}__${item.selectedTicket?.type || ''}`;

    // Calculate total amount using consistent price field
    const calculateTotalAmount = (items) => {
        const total = items.reduce((total, item) => {
            const price = item.selectedTicket?.price || item.tickets?.[0]?.price || item.price || 0;
            const itemTotal = price * item.quantity;
            return total + itemTotal;
        }, 0);
        return total;
    };

    useEffect(() => {
        const totalAmount = calculateTotalAmount(cartItems);
        setCartTotalAmount(totalAmount);
    }, [cartItems]);

    useEffect(() => {
        if (typeof window !== 'undefined')
            sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add item: match by event _id and selectedTicket.type
    const addItem = (item) => {
        const itemKey = getCartItemKey(item);
        const existingItemIndex = cartItems.findIndex((cartItem) => getCartItemKey(cartItem) === itemKey);
        
        if (existingItemIndex !== -1) {
            const newCartItems = [...cartItems];
            const existingItem = newCartItems[existingItemIndex];
            if (item.selectedTicket?.type === existingItem.selectedTicket?.type) {
                newCartItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + 1
                };
            } else {
                newCartItems.push({ ...item, quantity: 1 });
            }
            setCartItems(newCartItems);
        } else {
            const newItem = { ...item, quantity: 1 };
            setCartItems([...cartItems, newItem]);
        }
    }

    // Update quantity: match by event _id and selectedTicket.type
    const updateItemQuantity = (itemId, ticketType, newQuantity) => {
        const itemKey = `${itemId}__${ticketType}`;
        if (newQuantity <= 0) {
            removeItem({ _id: itemId, selectedTicket: { type: ticketType } });
            return;
        }
        const updatedCartItems = cartItems.map((cartItem) => {
            if (getCartItemKey(cartItem) === itemKey) {
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });
        setCartItems(updatedCartItems);
    }

    // Remove item: match by event _id and selectedTicket.type
    const removeItem = (item) => {
        const itemKey = getCartItemKey(item);
        const existingItem = cartItems.find((cartItem) => getCartItemKey(cartItem) === itemKey);
        if (existingItem && existingItem.quantity === 1) {
            const updatedCartItems = cartItems.filter((cartItem) => getCartItemKey(cartItem) !== itemKey);
            setCartItems(updatedCartItems);
        } else {
            const updatedCartItems = cartItems.map((cartItem) => {
                if (getCartItemKey(cartItem) === itemKey) {
                    return { ...cartItem, quantity: cartItem.quantity - 1 };
                }
                return cartItem;
            });
            setCartItems(updatedCartItems);
        }
    }

    // Clear a specific item
    const clearItem = (item) => {
        const itemKey = getCartItemKey(item);
        const updatedCartItems = cartItems.filter((cartItem) => getCartItemKey(cartItem) !== itemKey);
        setCartItems(updatedCartItems);
    }

    const clearCart = () => {
        setCartItems([]);
    }

    // Check if a specific event+ticketType is in cart
    const checkItemExists = (id, ticketType = null) => {
        return cartItems.some((item) => {
            if (ticketType === null) {
                return item._id === id;
            }
            return item._id === id && item.selectedTicket?.type === ticketType;
        });
    }

    const getCartTotalAmount = () => {
        return calculateTotalAmount(cartItems);
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            cartTotalAmount,
            addItem,
            updateItemQuantity,
            removeItem,
            clearItem,
            clearCart,
            checkItemExists,
            cartOpened,
            toggleCart,
            getCartTotalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

const useCartContext = () => useContext(CartContext);

export default useCartContext;