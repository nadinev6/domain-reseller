import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DomainSearch from './components/DomainSearch';
import DomainResults from './components/DomainResults';
import Cart from './components/Cart';
import GameElement from './components/GameElement';
import DomainsPage from './pages/DomainsPage';
import SocialMediaCardStudio from './pages/SocialMediaCardStudio';
import Dashboard from './components/dashboard/Dashboard';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  
  const userGameData = {
    points: 230,
    profileCompleteness: 65,
    badges: ['First Purchase', 'Premium Domain']
  };
  
  const handleSearch = (results) => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };
  
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Header toggleCart={() => setIsCartOpen(!isCartOpen)} />
              <Routes>
                <Route path="/domains" element={<DomainsPage />} />
                <Route path="/card-studio" element={<SocialMediaCardStudio />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={
                  <main>
                    <DomainSearch onSearch={handleSearch} />
                    <DomainResults results={searchResults} loading={isSearching} />
                    {(searchResults.length > 0 && !isSearching) && (
                      <GameElement 
                        points={userGameData.points}
                        profileCompleteness={userGameData.profileCompleteness}
                        badges={userGameData.badges}
                      />
                    )}
                  </main>
                } />
              </Routes>
              <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;