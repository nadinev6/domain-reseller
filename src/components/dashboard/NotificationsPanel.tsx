import React from 'react';
import { Bell, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const NotificationsPanel: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Card design saved successfully',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Card template updated with new features',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'New feature: Link shortener integration',
      time: '2 days ago'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-amber-500" />;
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          Mark all as read
        </button>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="mt-0.5 mr-3">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-sm text-center w-full text-gray-600 hover:text-indigo-600 transition-colors duration-200">
        View all notifications
      </button>
    </div>
  );
};

export default NotificationsPanel;