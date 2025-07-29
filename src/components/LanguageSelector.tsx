import React from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'compact';
  showFlag?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showFlag = true,
  className = ''
}) => {
  const { currentLanguage, changeLanguage, supportedLanguages, getLanguageInfo } = useI18n();
  const currentLangInfo = getLanguageInfo();

  if (variant === 'compact') {
    return (
      <div className={`relative flex items-center ${className}`}>
        <Globe size={16} className="absolute left-2 text-gray-400" />
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="pl-8 pr-4 py-1 appearance-none bg-transparent border border-purple-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {showFlag ? `${lang.flag} ${lang.nativeName}` : lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
      <SelectTrigger className={`w-auto min-w-[140px] ${className}`}>
        <div className="flex items-center space-x-2">
          <Globe size={16} className="text-gray-500" />
          <SelectValue>
            <div className="flex items-center space-x-2">
              {showFlag && <span>{currentLangInfo.flag}</span>}
              <span>{currentLangInfo.nativeName}</span>
            </div>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                {showFlag && <span className="text-lg">{lang.flag}</span>}
                <div>
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
              </div>
              {currentLanguage === lang.code && (
                <Check size={16} className="text-green-600" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;