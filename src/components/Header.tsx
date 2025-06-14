import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useTranslation } from 'react-i18next';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  toggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const [navOpen, setNavOpen] = React.useState(false);
  const { cartItems } = useCart();
  const { t } = useTranslation();
  
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                <img 
                  src="https://i.imghippo.com/files/XSY6887eA.jpeg" 
                  alt="Namely Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-2xl font-bold tracking-tight mr-9"><span className="tapered">Name</span>ly</div>
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><Link to="/domains" className="hover:text-amber-300 transition-colors duration-200">{t('header.domains')}</Link></li>
                <li><Link to="/pricing" className="hover:text-amber-300 transition-colors duration-200">{t('header.pricing')}</Link></li>
                <li><Link to="/link-in-bio" className="hover:text-amber-300 transition-colors duration-200">{t('header.linkInBio')}</Link></li>
                <li><Link to="/support" className="hover:text-amber-300 transition-colors duration-200">{t('header.support')}</Link></li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <CurrencySelector />
            
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:bg-purple-700 rounded-full transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            <Link to="/dashboard" className="hidden md:flex items-center hover:bg-purple-700 rounded-full p-2 transition-colors duration-200">
              <User size={20} />
            </Link>
            
            <button 
              className="md:hidden p-2 hover:bg-purple-700 rounded-full transition-colors duration-200"
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {navOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="space-y-2">
              <li><Link to="/domains" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">{t('header.domains')}</Link></li>
              <li><Link to="/pricing" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">{t('header.pricing')}</Link></li>
              <li><Link to="/link-in-bio" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">{t('header.linkInBio')}</Link></li>
              <li><Link to="/support" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">{t('header.support')}</Link></li>
              <li><Link to="/dashboard" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">{t('header.account')}</Link></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header