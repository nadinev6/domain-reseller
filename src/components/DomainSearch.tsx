import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchDomains } from '../utils/domainUtils';
import { DomainResult } from '../types';
import { useTranslation } from 'react-i18next';

interface DomainSearchProps {
  onSearch: (results: DomainResult[]) => void;
}

const DomainSearch: React.FC<DomainSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = searchDomains(searchTerm);
      onSearch(results);
      setIsSearching(false);
    }, 800);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8 md:mt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {t('search.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t('search.subtitle')}
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full p-4 pl-5 pr-16 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
        />
        <button
          type="submit"
          disabled={isSearching}
          className={`absolute right-2 top-2 bottom-2 px-4 rounded-lg ${
            isSearching ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors duration-200 flex items-center justify-center`}
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Search size={20} className="mr-1" />
              <span className="hidden md:inline">{t('search.button')}</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.co.za</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.za.com</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.com</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.net</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.biz</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.help</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.net</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.mobi</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.pw</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors duration-200">.mg</span>
        <span className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">...and more</span>
      </div>
    </div>
  );
};

export default DomainSearch;