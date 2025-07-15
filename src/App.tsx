// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BotInterfaceWrapper from './components/BotInterfaceWrapper';
import SocialMediaCardStudio from './pages/SocialMediaCardStudio';
import CardStudioEditor from './pages/CardStudioEditor';
import AdvancedCardStudioEditor from './pages/AdvancedCardStudioEditor';
import Dashboard from './components/dashboard/Dashboard';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = React.useState(false);
  
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <div className="min-h-screen bg-gray-50 relative">
            <Header 
              isCollapsed={isHeaderCollapsed}
              onToggleCollapse={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
            />
            <Routes>
              <Route path="/card-studio" element={<SocialMediaCardStudio />} />
              <Route path="/card-studio/editor" element={<CardStudioEditor />} />
              <Route path="/card-studio/advanced-editor" element={<AdvancedCardStudioEditor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={
                <main className="pt-20">
                  <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      Welcome to VibePage
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                      Create stunning social media cards and manage your online presence
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="/card-studio" 
                        className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-lg font-medium"
                      >
                        Get Started with VibePage Studio
                      </a>
                      <a 
                        href="/dashboard" 
                        className="inline-flex items-center px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 text-lg font-medium"
                      >
                        View Dashboard
                      </a>
                    </div>
                  </div>
                </main>
              } />
            </Routes>
            <BotInterfaceWrapper />
          </div>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}