import React, { createContext, useContext, useState, ReactNode } from 'react';

// Fixed exchange rates relative to ZAR
const FIXED_EXCHANGE_RATES = {
  ZAR: 1,        // 1 ZAR = 1 ZAR
  EUR: 0.05,     // 1 ZAR = 0.05 EUR
  USD: 0.06,     // 1 ZAR = 0.06 USD
  MGA: 255.00,   // 1 ZAR = 255.00 MGA
  GBP: 0.04      // 1 ZAR = 0.04 GBP (added for completeness)
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('ZAR');
  
  const convertPrice = (priceInZAR: number): number => {
    // If target currency is ZAR, return original price
    if (currency === 'ZAR') return priceInZAR;
    
    // Get the conversion rate for the target currency
    const rate = FIXED_EXCHANGE_RATES[currency as keyof typeof FIXED_EXCHANGE_RATES] || 1;
    
    // Convert ZAR to target currency and round down cents
    const convertedPrice = priceInZAR * rate;
    return Math.floor(convertedPrice * 100) / 100;
  };
  
  const formatPrice = (price: number): string => {
    const converted = convertPrice(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };
  
  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertPrice,
      formatPrice,
      isLoading: false // No loading since we use fixed rates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 