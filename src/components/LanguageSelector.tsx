import React from 'react';
import { LocaleSwitcher } from 'lingo.dev/react/client';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {  
  return (
    <div className="relative flex items-center">
      <Languages size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <LocaleSwitcher
        locales={["en", "fr"]}
        className="pl-8 pr-4 py-1 appearance-none bg-gray border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer disabled:opacity-50"
      />
    </div>
  );
};

export default LanguageSelector;