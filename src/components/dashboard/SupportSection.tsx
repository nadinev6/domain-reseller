import React from 'react';
import { MessageCircleQuestionMark, MessageCircle, Clock } from 'lucide-react';

const SupportSection: React.FC = () => {
  const tickets = [
    { id: 'TIC-001', subject: 'Domain Transfer Issue', status: 'open', updatedAt: '2024-02-15' },
    { id: 'TIC-002', subject: 'Billing Question', status: 'pending', updatedAt: '2024-02-14' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Support</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center">
          <MessageCircleQuestionMark size={16} className="mr-2" />
          New Ticket
        </button>
      </div>
      
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <MessageCircle size={20} className="text-indigo-600" />
              <div>
                <h3 className="font-medium">{ticket.subject}</h3>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    ticket.status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  <span className="flex items-center text-sm text-gray-500 ml-3">
                    <Clock size={14} className="mr-1" />
                    Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 rounded-lg bg-indigo-50 flex items-start">
        <MessageCircleQuestionMark size={20} className="text-indigo-600 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-indigo-900">Need Help?</h3>
          <p className="text-sm text-indigo-700 mt-1">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;