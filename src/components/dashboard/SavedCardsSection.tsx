import React, { useState, useEffect } from 'react';
import { Palette, Eye, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SavedCard } from '../../types';
import { Link } from 'react-router-dom';

const SavedCardsSection: React.FC = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedCards();
    }
  }, [user]);

  const fetchSavedCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved cards:', error);
        return;
      }

      setSavedCards(data || []);
    } catch (error) {
      console.error('Unexpected error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    setDeletingId(cardId);

    try {
      const { error } = await supabase
        .from('user_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error deleting card:', error);
        alert('Failed to delete card. Please try again.');
        return;
      }

      // Remove from local state
      setSavedCards(prev => prev.filter(card => card.id !== cardId));
      
      // Also remove from localStorage backup if it exists
      const localCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
      const updatedLocalCards = localCards.filter((card: any) => card.id !== cardId);
      localStorage.setItem('savedCards', JSON.stringify(updatedLocalCards));

    } catch (error) {
      console.error('Unexpected error deleting card:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardPreview = (card: SavedCard) => {
    const { elements, canvasSettings } = card.card_data;
    const hasText = elements.some(el => el.type === 'text');
    const hasImage = elements.some(el => el.type === 'image');
    const hasShape = elements.some(el => el.type === 'shape');
    const hasButton = elements.some(el => el.type === 'button');

    const elementTypes = [];
    if (hasText) elementTypes.push('Text');
    if (hasImage) elementTypes.push('Image');
    if (hasShape) elementTypes.push('Shape');
    if (hasButton) elementTypes.push('Button');

    return {
      elementCount: elements.length,
      elementTypes: elementTypes.join(', ') || 'Empty',
      canvasSize: `${canvasSettings.width}×${canvasSettings.height}`,
      backgroundColor: canvasSettings.backgroundColor
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Saved Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading your saved cards...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Saved Cards
          </CardTitle>
          <Link to="/card-studio/editor">
            <Button size="sm" className="flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              New Card
            </Button>
          </Link>
        </div>
        <CardDescription>
          Manage your saved social media card designs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {savedCards.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Palette className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved cards yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first social media card to get started
            </p>
            <Link to="/card-studio/editor">
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Card
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedCards.map((card) => {
              const preview = getCardPreview(card);
              return (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 flex items-center justify-center text-xs font-medium"
                      style={{ backgroundColor: preview.backgroundColor }}
                    >
                      {preview.elementCount}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{card.title}</h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Elements: {preview.elementTypes}</p>
                        <p>Size: {preview.canvasSize} • Created: {formatDate(card.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      title="Preview card"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Link to={`/card-studio/editor?load=${card.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        title="Edit card"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCard(card.id)}
                      disabled={deletingId === card.id}
                      className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete card"
                    >
                      {deletingId === card.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedCardsSection;