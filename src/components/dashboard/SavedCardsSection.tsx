import React, { useState, useEffect } from 'react';
import { Palette, Eye, Edit, Trash2, Plus, Loader2, Globe, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { SavedCard } from '../../types';
import { Link } from 'react-router-dom';

// Simulated user domains (in a real app, this would come from the database)
const SIMULATED_USER_DOMAINS = [
  { id: '1', name: 'myawesome.com', status: 'active' },
  { id: '2', name: 'creativestudio.co.za', status: 'active' },
  { id: '3', name: 'portfolio.net', status: 'active' },
  { id: '4', name: 'business.org', status: 'pending' }
];

const SavedCardsSection: React.FC = () => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingCardId, setPublishingCardId] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
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
  const handlePublishToDomain = async () => {
    if (!publishingCardId || !selectedDomain) return;

    try {
      // In a real implementation, you would update the database here
      // For now, we'll just update the local state and show an alert
      
      setSavedCards(prev => prev.map(card => 
        card.id === publishingCardId 
          ? { ...card, published_domain: selectedDomain }
          : card
      ));

      // Also update localStorage backup
      const localCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
      const updatedLocalCards = localCards.map((card: any) => 
        card.id === publishingCardId 
          ? { ...card, published_domain: selectedDomain }
          : card
      );
      localStorage.setItem('savedCards', JSON.stringify(updatedLocalCards));
  };
      alert(`Page successfully published to ${selectedDomain}! 
      
Note: For actual persistence, a database column 'published_domain' would need to be added to the 'user_cards' table and updated via Supabase.`);
      
      setPublishingCardId(null);
      setSelectedDomain('');
    } catch (error) {
      console.error('Error publishing to domain:', error);
      alert('Failed to publish to domain. Please try again.');
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
          Manage your saved page designs
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
              Create your first page to get started
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
                        {card.published_domain && (
                          <div className="flex items-center text-green-600">
                            <Globe className="w-3 h-3 mr-1" />
                            <span className="text-xs">Published to {card.published_domain}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {card.published_domain ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50"
                        title={`Visit ${card.published_domain}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPublishingCardId(card.id)}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        title="Publish to domain"
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
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

      {/* Publish to Domain Dialog */}
      <Dialog open={!!publishingCardId} onOpenChange={() => setPublishingCardId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Page to Domain</DialogTitle>
            <DialogDescription>
              Select one of your domains to publish this page to. Your page will be live at the selected domain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Choose a domain...</option>
                {SIMULATED_USER_DOMAINS.map((domain) => (
                  <option key={domain.id} value={domain.name} disabled={domain.status !== 'active'}>
                    {domain.name} {domain.status !== 'active' ? '(Pending)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {SIMULATED_USER_DOMAINS.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">You don't have any domains yet.</p>
                <Link to="/domains">
                  <Button variant="outline">
                    Register a Domain
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setPublishingCardId(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePublishToDomain}
                disabled={!selectedDomain}
                className="flex items-center"
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish to Domain
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SavedCardsSection;