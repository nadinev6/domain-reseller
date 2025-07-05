import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Home, LayoutDashboard, DollarSign, Euro, PoundSterling, Megaphone, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Ensure this import is present
import { useCurrency } from '../context/CurrencyContext';
import LanguageSelector from './LanguageSelector'; // Assuming this component exists

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cartItems } = useCart(); // Get cartItems from the context
  const { currency, setCurrency } = useCurrency();

  // This is the fix for the TypeError: Cannot read properties of undefined (reading 'length')
  // It ensures that if cartItems is undefined or null, it defaults to an empty array []
  const cartItemCount = (cartItems ?? []).length;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Logo or Site Title */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
          VibePage
        </Link>

        {/* Primary Navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Domains
          </Link>
          <Link to="/card-studio" className="text-gray-600 hover:text-indigo-600 flex items-center">
            <Palette className="w-4 h-4 mr-1" />
            Card Studio
          </Link>
          {/* Add more navigation links as needed */}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Currency Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              {currency === 'MGA' && 'MGA'}
              {currency === 'ZAR' && 'ZAR'}
              {currency === 'USD' && <DollarSign className="w-4 h-4" />}
              {currency === 'EUR' && <Euro className="w-4 h-4" />}
              {currency === 'GBP' && <PoundSterling className="w-4 h-4" />}
              <span className="ml-1">{currency}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCurrency('MGA')}>MGA</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrency('ZAR')}>ZAR</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrency('USD')}>USD</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrency('EUR')}>EUR</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrency('GBP')}>GBP</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Cart Button */}
        <Button variant="ghost" size="sm" className="relative"
          // This is where you might add a "coming soon" message or disable
          onClick={() => alert('Cart functionality is coming soon!')} // Example: temporary alert
          disabled={true} // Example: disable the button if not ready
        >
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          {/* Display cart item count using the safely accessed variable */}
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>

        {/* User Authentication */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <User className="w-5 h-5 text-gray-600" />
                <span className="hidden sm:inline">{user.email || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to="/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={signOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
