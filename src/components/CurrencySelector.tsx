import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Globe } from 'lucide-react';

const currencies = [
  { code: 'MGA', name: 'Malagasy Ariary' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency, isLoading } = useCurrency();
  
  return (
    <div className="relative flex items-center">
      <Globe size={16} className="absolute left-2 text-gray-400" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        disabled={isLoading}
        className="pl-8 pr-4 py-1 appearance-none bg-transparent border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer disabled:opacity-50"
      >
        {currencies.map(({ code, name }) => (
          <option key={code} value={code}>
            {code} - {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;