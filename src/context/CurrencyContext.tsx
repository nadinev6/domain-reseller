import React, { createContext, useContext, useState, ReactNode } from 'react';
import useSWR from 'swr';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('ZAR');
  
  const { data: rates, isLoading } = useSWR<ExchangeRates>(
    'https://open.er-api.com/v6/latest/USD',
    fetcher,
    { refreshInterval: 3600000 } // Refresh every hour
  );
  
  const convertPrice = (priceInUSD: number): number => {
    if (!rates) return priceInUSD;
    const rate = currency === 'USD' ? 1 : (rates[currency] || 1);
    return priceInUSD * rate;
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
      isLoading
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