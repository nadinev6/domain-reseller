import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { DomainResult } from '../types';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../context/CurrencyContext';

interface DomainCardProps {
  domain: DomainResult;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain }) => {
  const [expanded, setExpanded] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { formatPrice } = useCurrency();
  
  const inCart = isInCart(domain.id);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleCartAction = () => {
    if (inCart) {
      removeFromCart(domain.id);
    } else {
      addToCart(domain);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden"
      style={{
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">{domain.name}</h3>
            {domain.available ? (
              <span className="text-green-600 flex items-center text-sm">
                <Check size={16} className="mr-1" /> Available
              </span>
            ) : (
              <span className="text-red-500 flex items-center text-sm">
                <X size={16} className="mr-1" /> Taken
              </span>
            )}
          </div>
          
          {domain.available && (
            <div className="mt-2 flex items-baseline">
              <span className="text-xl font-bold text-indigo-600">
                {`${formatPrice(domain.price)}/year`}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {domain.available && (
            <button
              onClick={handleCartAction}
              className={`px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                inCart 
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <ShoppingCart size={16} className="mr-1" />
              {inCart ? 'Remove' : 'Add to Cart'}
            </button>
          )}
          
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 space-y-2">
          <p><strong>TLD:</strong> {domain.name.split('.').pop()}</p>
          <p><strong>WHOIS:</strong> {domain.available ? 'Not registered' : 'Registered on ' + new Date().toLocaleDateString()}</p>
          <p><strong>Points earned:</strong> <span className="text-amber-500">+{Math.floor(domain.price * 10)} points</span></p>
          {domain.available && (
            <div className="pt-2">
              <button className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium">
                View similar domains
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DomainCard;