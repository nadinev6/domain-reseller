// src/pages/AdvancedCardStudioEditor.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Save, Download, Undo, Redo, Eye, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Toolbox from '../components/card-studio/Toolbox';
import EditorCanvas from '../components/card-studio/EditorCanvas';
import PropertiesPanel from '../components/card-studio/PropertiesPanel';
import { CardElement } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Social Media Presets for Magic Resize
const SOCIAL_MEDIA_PRESETS = [
  {
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Vertical story format'
  },
  {
    name: 'Facebook Post',
    width: 1200,
    height: 1200,
    aspectRatio: '1:1',
    description: 'Square post format'
  },
  {
    name: 'Landscape Post',
    width: 1200,
    height: 628,
    aspectRatio: '1.91:1',
    description: 'For links and images'
  },
  {
    name: 'Portrait Post',
    width: 628,
    height: 1200,
    aspectRatio: '1:1.91',
    description: 'Vertical post format'
  },
  {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'Widescreen format'
  }
];

const AdvancedCardStudioEditorContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Standard React state management (no Tambo)
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

  // Load card from URL parameter if provided
  useEffect(() => {
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
        alert('Failed to load card. It may have been deleted or you may not have permission to access it.');
        return;
      }

      if (data) {
        const { elements: loadedElements, canvasSettings: loadedCanvasSettings } = data.card_data;
        setElements(loadedElements);
        // Ensure backward compatibility with old canvas settings
        const updatedCanvasSettings = {
          ...loadedCanvasSettings,
          backgroundLayers: loadedCanvasSettings.backgroundLayers || [
            {
              id: 'layer-1',
              type: 'linear' as const,
              colors: [
                { color: loadedCanvasSettings.backgroundColor || '#ffffff', position: 0 },
                { color: loadedCanvasSettings.backgroundColor || '#ffffff', position: 100 }
              ],
              direction: 'to bottom',
              opacity: 1
            }
          ]
        };
        setCanvasSettings(updatedCanvasSettings);
        
        // Reset history with loaded state
        setHistory([loadedElements]);
        setHistoryIndex(0);
        setSelectedElement(null);
        setMultiSelectedElementIds([]);
      }
    } catch (error) {
      console.error('Unexpected error loading card:', error);
      alert('An unexpected error occurred while loading the card.');
    }
  };

  const handleElementClick = useCallback((element: CardElement | null, event: React.MouseEvent) => {
    if (!element) {
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
      return;
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    if (isCtrlOrCmd) {
      if (multiSelectedElementIds.includes(element.id)) {
        const newSelection = multiSelectedElementIds.filter(id => id !== element.id);
        setMultiSelectedElementIds(newSelection);
        if (selectedElement?.id === element.id) {
          const remainingElement = elements.find(el => newSelection.includes(el.id));
          setSelectedElement(remainingElement || null);
        }
      } else {
        setMultiSelectedElementIds(prev => [...prev, element.id]);
        setSelectedElement(element);
      }
    } else {
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
        gradientDirection: 'to right',
        textDecoration: 'none',
        textTransform: 'none'
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

  const handleMagicResize = useCallback((preset: typeof SOCIAL_MEDIA_PRESETS[0], resizeMode: 'scale' | 'fit' = 'scale') => {
    const oldWidth = canvasSettings.width;
    const oldHeight = canvasSettings.height;
    const newWidth = preset.width;
    const newHeight = preset.height;

    // Update canvas settings
    setCanvasSettings({
      ...canvasSettings,
      width: newWidth,
      height: newHeight
    });

    if (elements.length === 0) {
      // No elements to scale, just update canvas
      return;
    }

    let scaledElements: CardElement[];

    if (resizeMode === 'scale') {
      // Scale and crop mode - scale elements proportionally
      const scaleX = newWidth / oldWidth;
      const scaleY = newHeight / oldHeight;
      const scaleFactor = Math.min(scaleX, scaleY); // Use smaller scale to fit within bounds

      scaledElements = elements.map(element => ({
        ...element,
        x: Math.round(element.x * scaleFactor),
        y: Math.round(element.y * scaleFactor),
        width: Math.round(element.width * scaleFactor),
        height: Math.round(element.height * scaleFactor)
      }));
    } else {
      // Fit to canvas mode - center elements and maintain proportions
      const scaleX = newWidth / oldWidth;
      const scaleY = newHeight / oldHeight;
      const scaleFactor = Math.min(scaleX, scaleY);
      
      // Calculate offset to center content
      const offsetX = (newWidth - (oldWidth * scaleFactor)) / 2;
      const offsetY = (newHeight - (oldHeight * scaleFactor)) / 2;

      scaledElements = elements.map(element => ({
        ...element,
        x: Math.round((element.x * scaleFactor) + offsetX),
        y: Math.round((element.y * scaleFactor) + offsetY),
        width: Math.round(element.width * scaleFactor),
        height: Math.round(element.height * scaleFactor)
      }));
    }

    setElements(scaledElements);
    setSelectedElement(null);
    setMultiSelectedElementIds([]);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(scaledElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [canvasSettings, elements, history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
    }
  }, [history, historyIndex]);

  const handleSaveCard = useCallback(async () => {
    if (!user) {
      alert('You must be signed in to save cards');
      return;
    }

    const title = window.prompt('Enter a name for your card:', 'My Card');
    if (!title || title.trim() === '') {
      return;
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
        alert('Failed to save card. Please try again.');
        return;
      }

      // Success feedback
      alert(`Card "${title}" saved successfully!`);
      
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
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [elements, canvasSettings, user]);

  const handleExportCard = useCallback(() => {
    alert('Export feature coming soon!');
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Advanced Card Studio Editor
          </h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="flex items-center"
            >
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="flex items-center"
            >
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCard} className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={handleSaveCard} className="flex items-center">
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            {isSaving ? 'Saving...' : 'Save'}
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
            onMagicResize={handleMagicResize}
            socialMediaPresets={SOCIAL_MEDIA_PRESETS}
          />
        </div>
      </div>
    </div>
  );
};

const AdvancedCardStudioEditor: React.FC = () => {
  return (
    <ProtectedRoute>
      <AdvancedCardStudioEditorContent />
    </ProtectedRoute>
  );
};

export default AdvancedCardStudioEditor;