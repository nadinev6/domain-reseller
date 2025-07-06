import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, RefreshCw, Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface TLD {
  name: string;
  register: number;
  transfer: number;
  renew: number;
}

const tlds: TLD[] = [
  { name: '.africa.com', register: 29.99, transfer: 29.99, renew: 29.99 },
  { name: '.biz', register: 12.99, transfer: 12.99, renew: 12.99 },
  { name: '.pw', register: 9.99, transfer: 9.99, renew: 9.99 },
  { name: '.bar', register: 69.99, transfer: 69.99, renew: 69.99 },
  { name: '.info', register: 14.99, transfer: 14.99, renew: 14.99 },
  { name: '.science', register: 24.99, transfer: 24.99, renew: 24.99 },
  { name: '.accountant', register: 29.99, transfer: 29.99, renew: 29.99 },
  { name: '.stream', register: 19.99, transfer: 19.99, renew: 19.99 },
  { name: '.click', register: 7.99, transfer: 7.99, renew: 7.99 },
  { name: '.help', register: 39.99, transfer: 39.99, renew: 39.99 },
  { name: '.co.za', register: 11.99, transfer: 11.99, renew: 11.99 },
  { name: '.property', register: 149.99, transfer: 149.99, renew: 149.99 },
  { name: '.com', register: 12.99, transfer: 12.99, renew: 12.99 },
  { name: '.net', register: 14.99, transfer: 14.99, renew: 14.99 },
  { name: '.mobi', register: 19.99, transfer: 19.99, renew: 19.99 },
  { name: '.za.com', register: 19.99, transfer: 19.99, renew: 19.99 },
  { name: '.mg', register: 89.99, transfer: 89.99, renew: 89.99 }
];

const DomainsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTld, setSelectedTld] = useState<TLD | null>(null);
  const [years, setYears] = useState(1);
  const [operation, setOperation] = useState<'register' | 'transfer' | 'renew'>('register');
  const { formatPrice, currency } = useCurrency();

  const filteredTlds = useMemo(() => {
    return tlds.filter(tld => 
      tld.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, currency]);

  const calculatePrice = (tld: TLD) => {
    const basePrice = tld[operation];
    return basePrice * years;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Domain Pricing</h1>
          <p className="text-indigo-100">Find the perfect domain extension for your online presence</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-6">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search TLDs..."
              className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TLD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Register</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renew</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTlds.map((tld) => (
                  <tr 
                    key={tld.name}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => setSelectedTld(tld)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tld.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatPrice(tld.register)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatPrice(tld.transfer)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatPrice(tld.renew)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedTld && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Domain Calculator - {selectedTld.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as 'register' | 'transfer' | 'renew')}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="register">Register</option>
                  <option value="transfer">Transfer</option>
                  <option value="renew">Renew</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatPrice(calculatePrice(selectedTld))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                <RefreshCw size={16} className="mr-2" />
                Reset
              </button>
              <button className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                <Download size={16} className="mr-2" />
                Download Price List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainsPage;