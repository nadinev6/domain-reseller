import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import CardRenderer from '../components/card-studio/CardRenderer';
import { CardElement } from '../types';

interface CardData {
  elements: CardElement[];
  canvasSettings: {
    width: number;
    height: number;
    backgroundColor: string;
  };
}

const CardPreviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCardData = () => {
      try {
        const encodedData = searchParams.get('data');
        
        if (!encodedData) {
          setError('No card data found in URL');
          setLoading(false);
          return;
        }

        // Decode the data: first decode URI component, then decode base64, then parse JSON
        const decodedData = decodeURIComponent(encodedData);
        const jsonString = atob(decodedData);
        const parsedData = JSON.parse(jsonString);

        // Validate the structure
        if (!parsedData.elements || !parsedData.canvasSettings) {
          setError('Invalid card data structure');
          setLoading(false);
          return;
        }

        setCardData(parsedData);
        setError(null);
      } catch (err) {
        console.error('Error loading card data:', err);
        setError('Failed to load card data. The preview link may be invalid or corrupted.');
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview Error</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to load the card preview.'}
          </p>
          <Link to="/card-studio/editor">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenInNewTab = () => {
    const currentUrl = window.location.href;
    window.open(currentUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/card-studio/editor">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Editor
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Card Preview</h1>
            <p className="text-sm text-gray-500">
              Canvas: {cardData.canvasSettings.width} × {cardData.canvasSettings.height}px
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <CardRenderer
              elements={cardData.elements}
              canvasSettings={cardData.canvasSettings}
              isPreview={true}
            />
          </div>
        </div>
        
        {/* Card Info */}
        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Elements:</span>
              <span className="ml-2 text-gray-600">{cardData.elements.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Canvas Size:</span>
              <span className="ml-2 text-gray-600">
                {cardData.canvasSettings.width} × {cardData.canvasSettings.height}px
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Background:</span>
              <span className="ml-2 text-gray-600 flex items-center">
                {cardData.canvasSettings.backgroundColor}
                <div 
                  className="w-4 h-4 rounded border border-gray-300 ml-2"
                  style={{ backgroundColor: cardData.canvasSettings.backgroundColor }}
                />
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Element Types:</span>
              <span className="ml-2 text-gray-600">
                {Array.from(new Set(cardData.elements.map(el => el.type))).join(', ') || 'None'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> This is a live preview of your card. Interactive elements like buttons will work as expected when published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreviewPage;