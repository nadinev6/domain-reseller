import React, { useRef, useCallback, useState } from 'react';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { CardElement } from '../../types';
import CardRenderer from './CardRenderer';

interface EditorCanvasProps {
  elements: CardElement[];
  selectedElement: CardElement | null;
  multiSelectedElementIds: string[];
  onElementClick: (element: CardElement | null, event: React.MouseEvent) => void;
  onUpdateElement: (id: string, updates: Partial<CardElement>, isDrag?: boolean) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (type: CardElement['type'], x: number, y: number) => void;
  canvasSettings: {
    width: number;
    height: number;
    backgroundColor: string;
  };
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  elements,
  selectedElement,
  multiSelectedElementIds,
  onElementClick,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  canvasSettings
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    elementId: string | null;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    elementId: null
  });

  // Grid guidelines state
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [horizontalGuideY, setHorizontalGuideY] = useState(0);
  const [verticalGuideX, setVerticalGuideX] = useState(0);

  // Defensive check for elements array
  const safeElements = elements || [];
  const safeMultiSelectedElementIds = multiSelectedElementIds || [];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.source === 'toolbox' && data.type) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          onAddElement(data.type, x, y);
        }
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  }, [onAddElement]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: CardElement) => {
    e.stopPropagation();
    onElementClick(element, e);
    
    // Get the canvas bounding rect to calculate relative positions
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate mouse position relative to canvas
    const canvasMouseX = e.clientX - rect.left;
    const canvasMouseY = e.clientY - rect.top;
    
    dragRef.current = {
      isDragging: true,
      startX: canvasMouseX - element.x,
      startY: canvasMouseY - element.y,
      elementId: element.id
    };
  }, [onElementClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current.isDragging && dragRef.current.elementId) {
      // Get the canvas bounding rect to calculate relative positions
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate mouse position relative to canvas
      const canvasMouseX = e.clientX - rect.left;
      const canvasMouseY = e.clientY - rect.top;
      
      const newX = canvasMouseX - dragRef.current.startX;
      const newY = canvasMouseY - dragRef.current.startY;
      
      // Get the current element to use its actual dimensions
      const currentElement = safeElements.find(el => el.id === dragRef.current.elementId);
      const elementWidth = currentElement?.width || 100;
      const elementHeight = currentElement?.height || 100;
      
      // Constrain to canvas bounds using actual element dimensions
      const constrainedX = Math.max(0, Math.min(newX, canvasSettings.width - elementWidth));
      const constrainedY = Math.max(0, Math.min(newY, canvasSettings.height - elementHeight));
      
      // Calculate element center for grid guidelines
      const elementCenterX = constrainedX + elementWidth / 2;
      const elementCenterY = constrainedY + elementHeight / 2;
      
      // Canvas center
      const canvasCenterX = canvasSettings.width / 2;
      const canvasCenterY = canvasSettings.height / 2;
      
      // Check alignment with center (within 5px threshold)
      const threshold = 5;
      const isAlignedVertically = Math.abs(elementCenterX - canvasCenterX) <= threshold;
      const isAlignedHorizontally = Math.abs(elementCenterY - canvasCenterY) <= threshold;
      
      setShowVerticalGuide(isAlignedVertically);
      setShowHorizontalGuide(isAlignedHorizontally);
      setVerticalGuideX(canvasCenterX);
      setHorizontalGuideY(canvasCenterY);
      
      onUpdateElement(dragRef.current.elementId, {
        x: constrainedX,
        y: constrainedY
      }, true);
    }
  }, [onUpdateElement, canvasSettings, safeElements]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false;
    dragRef.current.elementId = null;
    
    // Hide grid guidelines
    setShowHorizontalGuide(false);
    setShowVerticalGuide(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onElementClick(null, e);
    }
  }, [onElementClick]);

  const duplicateElement = useCallback((element: CardElement) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: safeElements.length + 1
    };
    
    onAddElement(newElement.type, newElement.x, newElement.y);
  }, [safeElements.length, onAddElement]);

  return (
    <div className="flex justify-center">
      <div
        ref={canvasRef}
        className="relative"
        style={{
          width: canvasSettings.width,
          height: canvasSettings.height,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Render the card using CardRenderer */}
        <CardRenderer 
          elements={safeElements} 
          canvasSettings={canvasSettings} 
        />
        
        {/* Overlay interactive elements for editing */}
        {safeElements.map((element) => {
          const isSelected = selectedElement?.id === element.id;
          const isMultiSelected = safeMultiSelectedElementIds.includes(element.id);
          
          return (
            <div key={`overlay-${element.id}`} className="absolute pointer-events-none">
              {/* Interactive overlay for each element */}
              <div
                className="absolute pointer-events-auto cursor-move"
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                  zIndex: element.zIndex + 1000, // Ensure overlay is above rendered elements
                  border: isSelected 
                    ? '2px solid #3b82f6' 
                    : isMultiSelected 
                    ? '2px solid #8b5cf6' 
                    : '2px solid transparent',
                  borderRadius: element.borderRadius || 0,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element)}
              />
              
              {/* Control buttons */}
              {(isSelected || isMultiSelected) && (
                <div 
                  className="absolute pointer-events-auto flex space-x-1 bg-white border border-gray-200 rounded shadow-lg p-1"
                  style={{
                    left: element.x,
                    top: element.y - 32,
                    zIndex: element.zIndex + 1001,
                  }}
                >
                  <button
                    onClick={() => duplicateElement(element)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onUpdateElement(element.id, { rotation: (element.rotation || 0) + 15 })}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Rotate"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeleteElement(element.id)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Grid Guidelines */}
        {showVerticalGuide && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-indigo-400 pointer-events-none z-50"
            style={{ left: verticalGuideX }}
          />
        )}
        {showHorizontalGuide && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-indigo-400 pointer-events-none z-50"
            style={{ top: horizontalGuideY }}
          />
        )}
      </div>
    </div>
  );
};

export default EditorCanvas; 