 src/pages/AdvancedCardStudioEditor.tsx
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
import { useTambo, useTamboStreamingProps } from '@tambo-ai/react';
import { MessageInput } from '../components/tambo/message-input';

const AdvancedCardStudioEditorContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Tambo-managed state for the editor
  const [elements, setElements] = useTamboStreamingProps<CardElement[]>('CardStudioEditor', 'elements', []);
  const [selectedElement, setSelectedElement] = useTamboStreamingProps<CardElement | null>('CardStudioEditor', 'selectedElement', null);
  const [multiSelectedElementIds, setMultiSelectedElementIds] = useTamboStreamingProps<string[]>('CardStudioEditor', 'multiSelectedElementIds', []);
  const [canvasSettings, setCanvasSettings] = useTamboStreamingProps('CardStudioEditor', 'canvasSettings', {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  const [historyIndex, setHistoryIndex] = useTamboStreamingProps('CardStudioEditor', 'historyIndex', 0);
  const [isSaving, setIsSaving] = useTamboStreamingProps('CardStudioEditor', 'isSaving', false);

  // Local state for history (not managed by Tambo directly)
  const [history, setHistory] = useState<CardElement[][]>([[]]);

  // Tambo actions for the CardStudioEditor component
  const { addElement, updateElement, deleteElement, loadTemplate, saveCard, undo: tamboUndo, redo: tamboRedo, setCanvasSettings: tamboSetCanvasSettings } = useTambo('CardStudioEditor');

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
        // Use the Tambo action to load the template
        loadTemplate(loadedElements, loadedCanvasSettings);
        
        // Also update local history
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

  const handleAddElement = useCallback((elementType: CardElement['type'], x: number, y: number) => {
    // Use Tambo action
    addElement(elementType, x, y);
    // Update local history
    const newElements = [...elements, { /* new element structure, should match what addElement creates */ id: `temp-${Date.now()}`, type: elementType, x, y, width: 100, height: 100, zIndex: elements.length + 1 }]; // Simplified for history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex, addElement]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CardElement>, isDrag: boolean = false) => {
    // Use Tambo action
    updateElement(id, updates);
    // Update local history (only if not dragging to avoid excessive history entries)
    if (!isDrag) {
      const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [elements, history, historyIndex, updateElement]);

  const handleDeleteElement = useCallback((id: string) => {
    // Use Tambo action
    deleteElement(id);
    // Update local history
    const newElements = elements.filter(el => el.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex, deleteElement]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]); // Directly set elements from local history
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
      tamboUndo(); // Also trigger Tambo's undo if it has internal state
    }
  }, [history, historyIndex, tamboUndo, setElements, setSelectedElement, setMultiSelectedElementIds, setHistoryIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]); // Directly set elements from local history
      setSelectedElement(null);
      setMultiSelectedElementIds([]);
      tamboRedo(); // Also trigger Tambo's redo if it has internal state
    }
  }, [history, historyIndex, tamboRedo, setElements, setSelectedElement, setMultiSelectedElementIds, setHistoryIndex]);

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
      // Use Tambo action to save
      await saveCard(); // This action should handle the Supabase interaction
      alert(`Card "${title}" saved successfully!`);
    } catch (error) {
      console.error('Error saving card:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [user, saveCard, setIsSaving]);

  const handleExportCard = useCallback(() => {
    alert('Export feature coming soon!');
  }, []);

  const handleCanvasSettingsUpdate = useCallback((settings: any) => {
    tamboSetCanvasSettings(settings);
  }, [tamboSetCanvasSettings]);

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
          <Toolbox onAddElement={handleAddElement} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto bg-gray-50 p-8">
            <EditorCanvas
              elements={elements}
              selectedElement={selectedElement}
              multiSelectedElementIds={multiSelectedElementIds}
              onElementClick={handleElementClick}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onAddElement={handleAddElement}
              canvasSettings={canvasSettings}
            />
          </div>
          {/* MessageInput for AI interaction */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <MessageInput componentName="CardStudioEditor" />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            canvasSettings={canvasSettings}
            onUpdateCanvasSettings={handleCanvasSettingsUpdate}
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
