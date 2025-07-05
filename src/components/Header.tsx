import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import AuthDialog from './auth/AuthDialog';
import { Button } from './ui/button';
import { AnimatedShinyText } from '../components/magicui/animated-shiny-text';

interface HeaderProps {
  toggleCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleCart }) => {
  const [navOpen, setNavOpen] = React.useState(false);
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const [authDialogTab, setAuthDialogTab] = React.useState<'signin' | 'signup'>('signin');
  const { cartItems } = useCart();
  const { user, signOut, loading } = useAuth();

  const handleAuthClick = (tab: 'signin' | 'signup') => {
    setAuthDialogTab(tab);
    setAuthDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Handle cart click with coming soon message
  const handleCartClick = () => {
    alert('Cart functionality is coming soon!');
  };
  
  return (
    <>
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-2">
                  <img 
                    src="https://i.imghippo.com/files/XSY6887eA.jpeg" 
                    alt="VibePage Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-2xl font-bold tracking-tight mr-9"><span className="tapered">Vibe</span>Page</div>
              </Link>
              <nav className="hidden md:block">
                <ul className="flex space-x-8">
                  <li><Link to="/domains" className="hover:text-amber-300 transition-colors duration-200">Domains</Link></li>
                  <li><Link to="/pricing" className="hover:text-amber-300 transition-colors duration-200">Pricing</Link></li>
                  <li>
                    <Link 
                      to={user ? "/card-studio/editor" : "/card-studio"} 
                      className="hover:text-amber-300 transition-colors duration-200"
                    >
                      Card Studio
                    </Link>
                  </li>
                  <li><Link to="/support" className="hover:text-amber-300 transition-colors duration-200">Support</Link></li>
                </ul>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <CurrencySelector />
              
              <button 
                onClick={handleCartClick}
                disabled={true}
                className="relative p-2 hover:bg-purple-700 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems?.length || 0}
                  </span>
                )}
              </button>
              
              {!loading && (
                <>
                  {user ? (
                    <div className="hidden md:flex items-center space-x-2">
                      <Link to="/dashboard" className="flex items-center hover:bg-purple-700 rounded-full p-2 transition-colors duration-200">
                        <User size={20} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-white hover:bg-purple-700"
                      >
                        <LogOut size={16} className="mr-1" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAuthClick('signin')}
                        className="text-white hover:bg-purple-700"
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAuthClick('signup')}
                        className="border-white text-white hover:bg-white hover:text-indigo-600"
                      >
                        <AnimatedShinyText className="text-indigo-600 !mx-0 !max-w-none">
                          Sign Up
                        </AnimatedShinyText>
                      </Button>
                    </div>
                  )}
                </>
              )}
              
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
                <li><Link to="/domains" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">Domains</Link></li>
                <li><Link to="/pricing" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">Pricing</Link></li>
                <li>
                  <Link 
                    to={user ? "/card-studio/editor" : "/card-studio"} 
                    className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200"
                  >
                    Card Studio
                  </Link>
                </li>
                <li><Link to="/support" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">Support</Link></li>
                {user ? (
                  <>
                    <li><Link to="/dashboard" className="block py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200">Account</Link></li>
                    <li>
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button 
                        onClick={() => handleAuthClick('signin')}
                        className="block w-full text-left py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleAuthClick('signup')}
                        className="block w-full text-left py-2 hover:bg-purple-700 px-3 rounded transition-colors duration-200"
                      >
                        <AnimatedShinyText className="text-white !mx-0 !max-w-none">
                          Sign Up
                        </AnimatedShinyText>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        defaultTab={authDialogTab}
      />
    </>
  );
}

export default Header