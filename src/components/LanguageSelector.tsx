import React from 'react';
import { LocaleSwitcher } from 'lingo.dev/react/client';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {  
  return (
    <div className="relative flex items-center">
      <Languages size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <LocaleSwitcher
        locales={["en", "fr"]}
        className="pl-8 pr-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none shadow-sm min-w-[90px] cursor-pointer"
      />
    </div>
  );
};

export default LanguageSelector;