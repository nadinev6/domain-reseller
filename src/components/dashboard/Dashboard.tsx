import React from 'react';
import { Shield, CreditCard, HelpCircle, ChevronRight, Bell, Palette } from 'lucide-react';
import SupportSection from './SupportSection';
import SecuritySection from './SecuritySection';
import NotificationsPanel from './NotificationsPanel';
import SavedCardsSection from './SavedCardsSection';
import LinkShortener from '../LinkShortener';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Sarah!</h1>
          <p className="text-indigo-100">Manage your VibePage cards and account settings</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <SavedCardsSection />
            <LinkShortener />
            <SupportSection />
            <SecuritySection />
          </div>
          
          <div className="space-y-6">
            <NotificationsPanel />
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors duration-200">
                  <span className="flex items-center">
                    <Palette size={18} className="text-indigo-600 mr-3" />
                    Create New Card
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                </button>
                
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors duration-200">
                  <span className="flex items-center">
                    <HelpCircle size={18} className="text-indigo-600 mr-3" />
                    Open Support Ticket
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                </button>
                
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors duration-200">
                  <span className="flex items-center">
                    <Shield size={18} className="text-indigo-600 mr-3" />
                    Security Settings
                  </span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;