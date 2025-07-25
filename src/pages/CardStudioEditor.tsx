import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Download, Undo, Redo, Eye, Loader2 } from 'lucide-react';
import { t } from 'lingo.dev/react';
import { Button } from '../components/ui/button';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Toolbox from '../components/card-studio/Toolbox';
import EditorCanvas from '../components/card-studio/EditorCanvas';
import PropertiesPanel from '../components/card-studio/PropertiesPanel';
import { CardElement } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CardStudioEditorContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [elements, setElements] = useState<CardElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CardElement | null>(null);
  const [multiSelectedElementIds, setMultiSelectedElementIds] = useState<string[]>([]);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  const [history, setHistory] = useState<CardElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Load card from URL parameter if provided
  React.useEffect(() => {
    const loadCardId = searchParams.get('load');
    if (loadCardId && user) {
      loadSavedCard(loadCardId);
    }
  }, [searchParams, user]);

  const loadSavedCard = async (cardId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select('*')
        .eq('id', cardId)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error loading card:', error);
        alert(t('cardStudio.savedCards.loadError'));
        return;
      }

      if (data) {
        const { elements: loadedElements, canvasSettings: loadedCanvasSettings } = data.card_data;
        setElements(loadedElements);
        setCanvasSettings(loadedCanvasSettings);
        
        // Reset history with loaded state
        setHistory([loadedElements]);
        setHistoryIndex(0);
        setSelectedElement(null);
        setMultiSelectedElementIds([]);
      }
    } catch (error) {
      console.error('Unexpected error loading card:', error);
      alert(t('cardStudio.savedCards.loadUnexpectedError'));
    }
  };

  const handleElementClick = useCallback((element: CardElement | null, event: React.MouseEvent) => {
    if (!element) {
      // Clicked on canvas background - clear all selections
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
      return;
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    if (isCtrlOrCmd) {
      // Multi-select mode
      if (multiSelectedElementIds.includes(element.id)) {
        // Remove from multi-selection
        const newSelection = multiSelectedElementIds.filter(id => id !== element.id);
        setMultiSelectedElementIds(newSelection);
        
        // If this was the selected element, clear it or set to another selected element
        if (selectedElement?.id === element.id) {
          const remainingElement = elements.find(el => newSelection.includes(el.id));
          setSelectedElement(remainingElement || null);
        }
      } else {
        // Add to multi-selection
        setMultiSelectedElementIds(prev => [...prev, element.id]);
        setSelectedElement(element);
      }
    } else {
      // Single select mode
      setSelectedElement(element);
      setMultiSelectedElementIds([]);
    }
  }, [multiSelectedElementIds, selectedElement, elements]);

  const addElement = useCallback((elementType: CardElement['type'], x: number, y: number) => {
    const newElement: CardElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: elementType,
      x,
      y,
      width: elementType === 'text' ? 200 : elementType === 'button' ? 150 : 100,
      height: elementType === 'text' ? 40 : elementType === 'button' ? 40 : 100,
      zIndex: elements.length + 1,
      // Default properties based on type
      ...(elementType === 'text' && {
        content: 'Your text here',
        fontSize: 16,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'left' as const,
        fontFamily: 'Inter, sans-serif',
        isGradientText: false,
        gradientColor1: '#3b82f6',
        gradientColor2: '#8b5cf6',
        gradientDirection: 'to right'
      }),
      ...(elementType === 'image' && {
        src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Placeholder image',
        objectFit: 'cover' as const
      }),
      ...(elementType === 'shape' && {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        borderWidth: 0,
        borderColor: '#000000'
      }),
      ...(elementType === 'button' && {
        buttonText: 'Click me',
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        href: '#',
        borderRadius: 6
      })
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    setMultiSelectedElementIds([]);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  const updateElement = useCallback((id: string, updates: Partial<CardElement>, isDrag: boolean = false) => {
    let newElements;
    
    if (isDrag && multiSelectedElementIds.length > 0 && multiSelectedElementIds.includes(id)) {
      // Apply drag delta to all multi-selected elements
      const currentElement = elements.find(el => el.id === id);
      const deltaX = updates.x !== undefined && currentElement ? updates.x - currentElement.x : 0;
      const deltaY = updates.y !== undefined && currentElement ? updates.y - currentElement.y : 0;
      
      newElements = elements.map(el => {
        if (multiSelectedElementIds.includes(el.id)) {
          return {
            ...el,
            x: el.x + deltaX,
            y: el.y + deltaY
          };
        }
        return el;
      });
    } else {
      // Single element update
      newElements = elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
    }
    
    setElements(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }

    // Add to history (but not for every drag movement to avoid performance issues)
    if (!isDrag) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [elements, selectedElement, multiSelectedElementIds, history, historyIndex]);

  const deleteElement = useCallback((id: string) => {
    let elementsToDelete: string[];
    
    if (multiSelectedElementIds.length > 0) {
      // Delete all multi-selected elements
      elementsToDelete = multiSelectedElementIds;
    } else {
      // Delete single element
      elementsToDelete = [id];
    }
    
    const newElements = elements.filter(el => !elementsToDelete.includes(el.id));
    setElements(newElements);
    
    // Clear selections if any deleted element was selected
    if (selectedElement && elementsToDelete.includes(selectedElement.id)) {
      setSelectedElement(null);
    }
    setMultiSelectedElementIds([]);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, selectedElement, multiSelectedElementIds, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
    }
  }, [history, historyIndex]);

  const saveCard = useCallback(async () => {
    if (!user) {
      alert(t('cardStudio.editor.signInToSave'));
      return;
    }

    // Prompt user for card title
    const title = window.prompt(t('cardStudio.editor.enterCardName'), t('cardStudio.editor.defaultCardName'));
    if (!title || title.trim() === '') {
      return; // User cancelled or entered empty title
    }

    setIsSaving(true);

    try {
      // Prepare card data
      const cardData = {
        elements,
        canvasSettings,
        timestamp: new Date().toISOString()
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('user_cards')
        .insert({
          user_id: user.id,
          title: title.trim(),
          card_data: cardData
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving card:', error);
        alert(t('cardStudio.editor.saveError'));
        return;
      }

      // Success feedback
      alert(t('cardStudio.editor.cardSaved', { title }));
      
      // Optional: Also save to localStorage as backup
      const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
      savedCards.push({
        id: data.id,
        title: data.title,
        ...cardData
      });
      localStorage.setItem('savedCards', JSON.stringify(savedCards));

    } catch (error) {
      console.error('Unexpected error saving card:', error);
      alert(t('cardStudio.editor.unexpectedError'));
    } finally {
      setIsSaving(false);
    }
  }, [elements, canvasSettings, user]);

  const exportCard = useCallback(() => {
    // TODO: Implement export functionality
    alert(t('cardStudio.editor.exportFeatureComingSoon'));
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {t('cardStudio.editor.title')}
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex items-center"
            >
              <Undo className="w-4 h-4 mr-1" />
              {t('cardStudio.editor.undo')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center"
            >
              <Redo className="w-4 h-4 mr-1" />
              {t('cardStudio.editor.redo')}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {t('cardStudio.editor.preview')}
          </Button>
          <Button variant="outline" size="sm" onClick={exportCard} className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            {t('cardStudio.editor.export')}
          </Button>
          <Button size="sm" onClick={saveCard} className="flex items-center">
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isSaving ? t('cardStudio.editor.saving') : t('cardStudio.editor.save')}
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <Toolbox onAddElement={addElement} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto bg-gray-50 p-8">
            <EditorCanvas
              elements={elements}
              selectedElement={selectedElement}
              multiSelectedElementIds={multiSelectedElementIds}
              onElementClick={handleElementClick}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onAddElement={addElement}
              canvasSettings={canvasSettings}
            />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={updateElement}
            canvasSettings={canvasSettings}
            onUpdateCanvasSettings={setCanvasSettings}
          />
        </div>
      </div>
    </div>
  );
};

const CardStudioEditor: React.FC = () => {
  return (
    <ProtectedRoute>
      <CardStudioEditorContent />
    </ProtectedRoute>
  );
};

export default CardStudioEditor;