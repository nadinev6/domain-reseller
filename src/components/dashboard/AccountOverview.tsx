import React from 'react';
import { Globe, Clock, CheckCircle } from 'lucide-react';

const AccountOverview: React.FC = () => {
  const domains = [
    { name: 'example.co.za', status: 'active', expiresAt: '2025-03-15' },
    { name: 'mysite.com', status: 'active', expiresAt: '2025-06-22' },
    { name: 'newproject.dev', status: 'pending', expiresAt: '2025-04-01' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Domain Portfolio</h2>
      
      <div className="space-y-4">
        {domains.map((domain) => (
          <div key={domain.name} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <Globe size={20} className="text-indigo-600" />
              <div>
                <h3 className="font-medium text-gray-900">{domain.name}</h3>
                <div className="flex items-center mt-1">
                  {domain.status === 'active' ? (
                    <span className="flex items-center text-sm text-green-600">
                      <CheckCircle size={14} className="mr-1" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-amber-600">
                      <Clock size={14} className="mr-1" /> Pending
                    </span>
                  )}
                  <span className="text-sm text-gray-500 ml-3">
                    Expires: {new Date(domain.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
              Manage
            </button>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-600 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center">
        <Globe size={16} className="mr-2" />
        Add New Domain
      </button>
    </div>
  );
};

export default AccountOverview;