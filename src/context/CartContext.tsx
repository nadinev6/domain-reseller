import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DomainResult } from '../types';
import { useTamboState } from '../hooks/useTamboState';
import { z } from 'zod';

// Zod schema for cart state
const CartStateSchema = z.object({
  items: z.array(z.any()), // Using z.any() for now since DomainResult is imported
  total: z.number(),
  itemCount: z.number()
});

interface CartContextType {
  cartItems: DomainResult[];
  addToCart: (domain: DomainResult) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<DomainResult[]>([]);
  
  const addToCart = (domain: DomainResult) => {
    setCartItems((prev) => {
      // Avoid duplicates
      if (prev.some(item => item.id === domain.id)) {
        return prev;
      }
      return [...prev, domain];
    });
  };
  
  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const isInCart = (id: string) => {
    return cartItems.some(item => item.id === id);
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };
  
  // Register cart state with Tambo
  useTamboState({
    componentName: 'Cart',
    state: {
      items: cartItems,
      total: getTotalPrice(),
      itemCount: cartItems.length
    },
    actions: {
      addToCart,
      removeFromCart,
      clearCart
    },
    schema: CartStateSchema
  });
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext }