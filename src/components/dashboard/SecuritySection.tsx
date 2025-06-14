import React from 'react';
import { Shield, Key, Smartphone } from 'lucide-react';

const SecuritySection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <Key size={20} className="text-indigo-600" />
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
            </div>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Update
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <Smartphone size={20} className="text-indigo-600" />
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Not enabled</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200">
            Enable
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <Shield size={20} className="text-indigo-600" />
            <div>
              <h3 className="font-medium">Login History</h3>
              <p className="text-sm text-gray-500">View recent account activity</p>
            </div>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;