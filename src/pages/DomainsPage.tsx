import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, RefreshCw, Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface TLD {
  name: string;
  register: number;
  transfer: number;
  renew: number;
}

// Updated TLDs array (in ZAR)
const tlds: TLD[] = [
  { name: '.co.za', register: 99.00, transfer: 0.00, renew: 99.00 },
  { name: '.online', register: 30.00, transfer: 459.00, renew: 459.00 },
  { name: '.com', register: 299.00, transfer: 299.00, renew: 299.00 },
  { name: '.org', register: 189.00, transfer: 289.00, renew: 289.00 },
  { name: '.joburg', register: 319.00, transfer: 319.00, renew: 319.00 },
  { name: '.durban', register: 319.00, transfer: 319.00, renew: 319.00 },
  { name: '.capetown', register: 319.00, transfer: 319.00, renew: 319.00 },
  { name: '.africa', register: 199.00, transfer: 269.00, renew: 269.00 },
  { name: '.net', register: 329.00, transfer: 329.00, renew: 329.00 },
  { name: '.co', register: 739.00, transfer: 739.00, renew: 739.00 },
  { name: '.org.za', register: 99.00, transfer: 0.00, renew: 99.00 },
  { name: '.net.za', register: 99.00, transfer: 0.00, renew: 99.00 },
  { name: '.web.za', register: 99.00, transfer: 0.00, renew: 99.00 },
  { name: '.tv', register: 1079.00, transfer: 1079.00, renew: 1079.00 },
  { name: '.blog', register: 879.00, transfer: 879.00, renew: 879.00 },
  { name: '.us', register: 289.00, transfer: 289.00, renew: 289.00 },
  { name: '.mobi', register: 129.00, transfer: 849.00, renew: 849.00 },
  { name: '.xxx', register: 2979.00, transfer: 2979.00, renew: 2979.00 },
  { name: '.info', register: 99.00, transfer: 539.00, renew: 539.00 },
  { name: '.biz', register: 459.00, transfer: 459.00, renew: 459.00 },
  { name: '.name', register: 399.00, transfer: 399.00, renew: 399.00 },
  { name: '.xyz', register: 20.00, transfer: 319.00, renew: 319.00 },
  { name: '.pw', register: 429.00, transfer: 429.00, renew: 429.00 },
  { name: '.bar', register: 1419.00, transfer: 1419.00, renew: 1419.00 },
  { name: '.bz', register: 849.00, transfer: 849.00, renew: 849.00 },
  { name: '.cash', register: 219.00, transfer: 709.00, renew: 709.00 },
  { name: '.africa.com', register: 229.00, transfer: 229.00, renew: 229.00 },
  { name: '.ink', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.rest', register: 709.00, transfer: 709.00, renew: 709.00 },
  { name: '.us.com', register: 429.00, transfer: 429.00, renew: 429.00 },
  { name: '.wiki', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.host', register: 2129.00, transfer: 2129.00, renew: 2129.00 },
  { name: '.website', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.store', register: 80.00, transfer: 879.00, renew: 879.00 },
  { name: '.site', register: 30.00, transfer: 459.00, renew: 459.00 },
  { name: '.party', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.design', register: 45.00, transfer: 1165.00, renew: 1165.00 },
  { name: '.fans', register: 229.00, transfer: 229.00, renew: 229.00 },
  { name: '.rent', register: 429.00, transfer: 1419.00, renew: 1419.00 },
  { name: '.space', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.tech', register: 80.00, transfer: 879.00, renew: 879.00 },
  { name: '.click', register: 39.00, transfer: 309.00, renew: 309.00 },
  { name: '.help', register: 59.00, transfer: 629.00, renew: 629.00 },
  { name: '.property', register: 2829.00, transfer: 2829.00, renew: 2829.00 },
  { name: '.bid', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.trade', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.webcam', register: 289.00, transfer: 289.00, renew: 289.00 },
  { name: '.cricket', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.science', register: 289.00, transfer: 289.00, renew: 289.00 },
  { name: '.faith', register: 289.00, transfer: 289.00, renew: 289.00 },
  { name: '.accountant', register: 569.00, transfer: 569.00, renew: 569.00 },
  { name: '.loan', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.win', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.stream', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.date', register: 119.00, transfer: 119.00, renew: 149.00 },
  { name: '.community', register: 799.00, transfer: 799.00, renew: 799.00 },
  { name: '.fm', register: 1839.00, transfer: 1839.00, renew: 1839.00 },
  { name: '.school', register: 709.00, transfer: 709.00, renew: 709.00 },
  { name: '.business', register: 359.00, transfer: 359.00, renew: 359.00 },
  { name: '.builders', register: 769.00, transfer: 769.00, renew: 769.00 },
  { name: '.coffee', register: 199.00, transfer: 769.00, renew: 769.00 },
  { name: '.computer', register: 429.00, transfer: 769.00, renew: 769.00 },
  { name: '.deals', register: 769.00, transfer: 769.00, renew: 769.00 },
  { name: '.directory', register: 119.00, transfer: 509.00, renew: 509.00 },
  { name: '.domains', register: 849.00, transfer: 849.00, renew: 849.00 },
  { name: '.email', register: 89.00, transfer: 599.00, renew: 599.00 },
  { name: '.estate', register: 219.00, transfer: 769.00, renew: 769.00 },
  { name: '.events', register: 319.00, transfer: 799.00, renew: 799.00 },
  { name: '.fitness', register: 149.00, transfer: 799.00, renew: 799.00 },
  { name: '.gifts', register: 709.00, transfer: 709.00, renew: 709.00 },
  { name: '.guru', register: 89.00, transfer: 829.00, renew: 829.00 },
  { name: '.live', register: 59.00, transfer: 659.00, renew: 659.00 },
  { name: '.marketing', register: 799.00, transfer: 799.00, renew: 799.00 },
  { name: '.media', register: 119.00, transfer: 909.00, renew: 909.00 },
  { name: '.network', register: 129.00, transfer: 679.00, renew: 679.00 },
  { name: '.organic', register: 359.00, transfer: 1669.00, renew: 1669.00 },
  { name: '.rocks', register: 79.00, transfer: 429.00, renew: 429.00 },
  { name: '.services', register: 169.00, transfer: 799.00, renew: 799.00 },
  { name: '.sale', register: 149.00, transfer: 769.00, renew: 769.00 },
  { name: '.shopping', register: 659.00, transfer: 659.00, renew: 659.00 },
  { name: '.support', register: 169.00, transfer: 539.00, renew: 539.00 },
  { name: '.tours', register: 1249.00, transfer: 1249.00, renew: 1249.00 },
  { name: '.wine', register: 149.00, transfer: 1159.00, renew: 1159.00 },
  { name: '.wtf', register: 149.00, transfer: 709.00, renew: 709.00 },
  { name: '.zone', register: 219.00, transfer: 769.00, renew: 769.00 },
  { name: '.io', register: 1279.00, transfer: 1279.00, renew: 1279.00 },
  { name: '.pro', register: 79.00, transfer: 539.00, renew: 539.00 },
  { name: '.bet', register: 219.00, transfer: 509.00, renew: 509.00 },
  { name: '.taxi', register: 159.00, transfer: 1279.00, renew: 1279.00 },
  { name: '.systems', register: 389.00, transfer: 679.00, renew: 679.00 },
  { name: '.black', register: 429.00, transfer: 1309.00, renew: 1309.00 },
  { name: '.investments', register: 219.00, transfer: 2549.00, renew: 2549.00 },
  { name: '.studio', register: 319.00, transfer: 879.00, renew: 879.00 }
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