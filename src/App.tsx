import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BotInterface from './components/BotInterface';
import DomainSearch from './components/DomainSearch';
import DomainResults from './components/DomainResults';
import Cart from './components/Cart';
import GameElement from './components/GameElement';
import DomainsPage from './pages/DomainsPage';
import SocialMediaCardStudio from './pages/SocialMediaCardStudio';
import CardStudioEditor from './pages/CardStudioEditor';
import CardPreviewPage from './pages/CardPreviewPage';
import PricingPage from './pages/PricingPage';
import SupportPage from './pages/SupportPage';
import Dashboard from './components/dashboard/Dashboard';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = React.useState(false);
  const [isBotCollapsed, setIsBotCollapsed] = React.useState(true);
  
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
    <div className="min-h-screen bg-gray-50 relative">
      <Header 
        toggleCart={() => setIsCartOpen(!isCartOpen)}
        isCollapsed={isHeaderCollapsed}
        onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
      />
      <Routes>
        <Route path="/domains" element={<DomainsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/card-studio" element={<SocialMediaCardStudio />} />
        <Route path="/card-studio/editor" element={<CardStudioEditor />} />
        <Route path="/card-studio/preview" element={<CardPreviewPage />} />
        <Route path="/support" element={<SupportPage />} />
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
      
      {/* Only show BotInterface on the main page */}
      {location.pathname === '/' && (
        <BotInterface 
          isCollapsed={isBotCollapsed}
          onToggleCollapse={() => setIsBotCollapsed(!isBotCollapsed)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}
