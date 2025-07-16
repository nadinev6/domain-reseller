// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuroraText } from './components/magicui/aurora-text';
import Header from './components/Header';
import SocialMediaCardStudio from './pages/SocialMediaCardStudio';
import CardStudioEditor from './pages/CardStudioEditor';
import AdvancedCardStudioEditor from './pages/AdvancedCardStudioEditor';
import CopyForgeStudio from './pages/CopyForgeStudio';
import Dashboard from './components/dashboard/Dashboard';
import SolutionsPage from './pages/SolutionsPage';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <div className="min-h-screen bg-gray-50 relative">
            <Header />
            <Routes>
              <Route path="/card-studio" element={<SocialMediaCardStudio />} />
              <Route path="/card-studio/editor" element={<CardStudioEditor />} />
              <Route path="/card-studio/advanced-editor" element={<AdvancedCardStudioEditor />} />
              <Route path="/copyforge-studio" element={<CopyForgeStudio />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/" element={
                <main className="pt-20">
                  <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                      Welcome to <AuroraText colors={['#4f46e5', '#7c3aed', '#ec4899', '#06b6d4']}>VibePage</AuroraText>
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
          </div>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}