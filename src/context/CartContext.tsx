import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DomainResult } from '../types';
import { useTamboComponentState } from '@tambo-ai/react';

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
  const [cartItems, setCartItems] = useTamboComponentState<DomainResult[]>([]);
  
  // Top-level check to ensure cartItems is initialized
  if (cartItems === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

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