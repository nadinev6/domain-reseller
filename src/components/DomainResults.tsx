import React from 'react';
import DomainCard from './DomainCard';
import { DomainResult } from '../types';

interface DomainResultsProps {
  results: DomainResult[];
  loading: boolean;
}

const DomainResults: React.FC<DomainResultsProps> = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching for domains...</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
      <div className="space-y-4">
        {results.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
};

export default DomainResults;