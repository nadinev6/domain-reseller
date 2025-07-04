import React, { useState, useCallback } from 'react';
import { t } from 'lingo.dev/react';
import { Save, Download, Undo, Redo, Eye, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Toolbox from '../components/card-studio/Toolbox';
import EditorCanvas from '../components/card-studio/EditorCanvas';
import PropertiesPanel from '../components/card-studio/PropertiesPanel';
import { CardElement } from '../types';

const CardStudioEditorContent: React.FC = () => {
  const [elements, setElements] = useState<CardElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CardElement | null>(null);
  const [canvasSettings, setCanvasSettings] = useState({
    width: 800,
    height: 600,
    backgroundColor: '#ffffff'
  });
  const [history, setHistory] = useState<CardElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

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
        content: t('cardStudio.editor.defaultText'),
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left' as const,
        fontFamily: 'Inter, sans-serif'
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
        buttonText: t('cardStudio.editor.defaultButtonText'),
        buttonColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        href: '#',
        borderRadius: 6
      })
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex, t]);

  const updateElement = useCallback((id: string, updates: Partial<CardElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, selectedElement, history, historyIndex]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, selectedElement, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const saveCard = useCallback(() => {
    const cardData = {
      elements,
      canvasSettings,
      timestamp: new Date().toISOString()
    };
    
    // For now, save to localStorage
    const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    savedCards.push(cardData);
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
    
    // TODO: Implement actual save to Supabase
    alert(t('cardStudio.editor.cardSaved'));
  }, [elements, canvasSettings, t]);

  const exportCard = useCallback(() => {
    // TODO: Implement export functionality
    alert(t('cardStudio.editor.exportFeatureComingSoon'));
  }, [t]);

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
            <Save className="w-4 h-4 mr-1" />
            {t('cardStudio.editor.save')}
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
              onSelectElement={setSelectedElement}
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