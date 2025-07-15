import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BotInterface from './BotInterface';

const BotInterfaceWrapper: React.FC = () => {
  const [isBotCollapsed, setIsBotCollapsed] = useState(true);
  const location = useLocation();
  
  // Determine if BotInterface should be hidden based on current route
  const hideBotInterface = location.pathname.startsWith('/card-studio/editor') || 
                          location.pathname.startsWith('/card-studio/advanced-editor');
  
  // Don't render BotInterface on editor pages
  if (hideBotInterface) {
    return null;
  }
  
  return (
    <BotInterface 
      isCollapsed={isBotCollapsed}
      onToggleCollapse={() => setIsBotCollapsed(!isBotCollapsed)}
    />
  );
};

export default BotInterfaceWrapper;