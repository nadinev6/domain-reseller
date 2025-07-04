import React from 'react';
import { useLingo } from 'lingo.dev/react';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'mg', name: 'Malagasy' }
];

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useLingo();
  
  return (
    <div className="relative flex items-center">
      <Languages size={16} className="absolute left-2 text-gray-400" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="pl-8 pr-4 py-1 appearance-none bg-transparent border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;