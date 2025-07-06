import React from 'react';
// Simple fallback for LocaleSwitcher
const LocaleSwitcher = ({ locales, className }: { locales: string[]; className?: string }) => (
  <select className={className}>
    {locales.map(locale => (
      <option key={locale} value={locale}>{locale.toUpperCase()}</option>
    ))}
  </select>
);
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {  
  return (
    <div className="relative flex items-center">
      <Languages size={16} className="absolute left-2 text-gray-400" />
      <LocaleSwitcher
        locales={["en", "fr", "mg"]}
        className="pl-8 pr-4 py-1 appearance-none bg-transparent border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer disabled:opacity-50"
      />
    </div>
  );
};

export default LanguageSelector;