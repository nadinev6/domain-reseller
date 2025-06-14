import React from 'react';
import { CreditCard, Download } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const BillingSection: React.FC = () => {
  const { formatPrice } = useCurrency();
  
  const invoices = [
    { id: 'INV-2024-001', date: '2024-02-15', amount: 299.99 },
    { id: 'INV-2024-002', date: '2024-01-15', amount: 299.99 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Billing & Payments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Account Balance</h3>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(0)}</p>
        </div>
        
        <div className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Next Payment</h3>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(299.99)}</p>
          <p className="text-sm text-gray-500 mt-1">Due on March 15, 2024</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Payment Method</h3>
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CreditCard size={20} className="text-gray-400 mr-3" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Update
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Invoices</h3>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div>
                <p className="font-medium">{invoice.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">{formatPrice(invoice.amount)}</span>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingSection;