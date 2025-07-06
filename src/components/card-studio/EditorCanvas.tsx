import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { CardElement } from '../../types'; // Assuming this path is correct
import CardRenderer from './CardRenderer'; // Assuming this path is correct

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

  // --- Event Handlers for Drag & Drop from Toolbox ---
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

  // --- Global Mouse Move and Mouse Up Handlers ---
  // These are defined outside of useCallback to be stable for window event listeners
  const globalMouseMoveHandler = useCallback((e: MouseEvent) => {
    if (dragRef.current.isDragging && dragRef.current.elementId) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const canvasMouseX = e.clientX - rect.left;
      const canvasMouseY = e.clientY - rect.top;
      
      const newX = canvasMouseX - dragRef.current.startX;
      const newY = canvasMouseY - dragRef.current.startY;
      
      const currentElement = safeElements.find(el => el.id === dragRef.current.elementId);
      const elementWidth = currentElement?.width || 100;
      const elementHeight = currentElement?.height || 100;
      
      // Constrain to canvas bounds
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
      }, true); // Pass true for isDrag
    }
  }, [onUpdateElement, canvasSettings, safeElements]);

  const globalMouseUpHandler = useCallback(() => {
    dragRef.current.isDragging = false;
    dragRef.current.elementId = null;
    
    // Hide grid guidelines
    setShowHorizontalGuide(false);
    setShowVerticalGuide(false);

    // Remove global event listeners
    window.removeEventListener('mousemove', globalMouseMoveHandler);
    window.removeEventListener('mouseup', globalMouseUpHandler);
  }, [globalMouseMoveHandler]);

  // --- Element Mouse Down Handler (Initiates Drag) ---
  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: CardElement) => {
    e.stopPropagation(); // Prevent canvas click from firing
    onElementClick(element, e);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const canvasMouseX = e.clientX - rect.left;
    const canvasMouseY = e.clientY - rect.top;
    
    dragRef.current = {
      isDragging: true,
      startX: canvasMouseX - element.x,
      startY: canvasMouseY - element.y,
      elementId: element.id
    };

    // Attach global event listeners when drag starts
    window.addEventListener('mousemove', globalMouseMoveHandler);
    window.addEventListener('mouseup', globalMouseUpHandler);
  }, [onElementClick, globalMouseMoveHandler, globalMouseUpHandler]);

  // --- Canvas Click Handler (Deselects Elements) ---
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if the click target is the canvas itself, not an element on it
    if (e.target === e.currentTarget) {
      onElementClick(null, e);
    }
  }, [onElementClick]);

  // --- Element Manipulation Functions ---
  const duplicateElement = useCallback((element: CardElement) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: element.x + 20, // Offset duplicated element slightly
      y: element.y + 20,
      zIndex: safeElements.length + 1 // Place duplicated element on top
    };
    
    onAddElement(newElement.type, newElement.x, newElement.y);
  }, [safeElements.length, onAddElement]);

  // --- Cleanup Effect ---
  useEffect(() => {
    // Cleanup global event listeners if component unmounts while dragging
    return () => {
      window.removeEventListener('mousemove', globalMouseMoveHandler);
      window.removeEventListener('mouseup', globalMouseUpHandler);
    };
  }, [globalMouseMoveHandler, globalMouseUpHandler]);

  return (
    <div className="flex justify-center">
      <div
        ref={canvasRef}
        className="relative overflow-hidden border border-gray-300 shadow-lg rounded-lg" // Added some basic styling
        style={{
          width: canvasSettings.width,
          height: canvasSettings.height,
          backgroundColor: canvasSettings.backgroundColor || '#fff', // Use canvas background color
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
            <div 
              key={`overlay-${element.id}`} 
              className="absolute" // This div acts as a container for the interactive overlay and controls
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex + 1000, // Ensure overlay is above rendered elements
                // Add transform for rotation here if needed, or let the inner div handle it
              }}
            >
              {/* Interactive overlay for each element */}
              <div
                className="absolute w-full h-full cursor-move"
                style={{
                  border: isSelected 
                    ? '2px solid #3b82f6' 
                    : isMultiSelected 
                    ? '2px solid #8b5cf6' 
                    : '2px solid transparent',
                  borderRadius: element.borderRadius || 0,
                  transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none', // Apply rotation to the interactive div
                  // Background for easier clicking (can be transparent)
                  backgroundColor: 'rgba(0,0,0,0.0)', // Make it slightly visible for debugging, or fully transparent
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element)}
              />
              
              {/* Control buttons */}
              {(isSelected || isMultiSelected) && (
                <div 
                  className="absolute flex space-x-1 bg-white border border-gray-200 rounded shadow-lg p-1"
                  style={{
                    // Position controls relative to the element's top-left corner
                    left: 0, // Relative to the parent overlay div
                    top: -32, // Adjust as needed to place above the element
                    zIndex: 1001, // Ensure controls are above the element overlay
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
