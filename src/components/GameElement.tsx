import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';

interface GameElementProps {
  points: number;
  profileCompleteness: number;
  badges: string[];
}

const GameElement: React.FC<GameElementProps> = ({ points, profileCompleteness, badges }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy size={20} className="mr-2 text-amber-500" />
        Your Name Claim
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <Star size={16} className="mr-2 text-amber-500" />
            Points
          </h3>
          <div className="text-3xl font-bold text-indigo-600">{points}</div>
          <p className="text-sm text-gray-500 mt-1">Earn more with each purchase!</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-2">Profile Completeness</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100">
                  {profileCompleteness}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  Complete your profile
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
              <div
                style={{ width: `${profileCompleteness}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500 ease-in-out"
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Unlock rewards at 100%!</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center">
            <Award size={16} className="mr-2 text-amber-500" />
            Badges
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <div 
                  key={index}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold"
                  title={badge}
                >
                  {badge.substring(0, 2).toUpperCase()}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Complete actions to earn badges!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameElement;