import React, { useRef, useCallback } from 'react';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { CardElement } from '../../types';

interface EditorCanvasProps {
  elements: CardElement[];
  selectedElement: CardElement | null;
  onSelectElement: (element: CardElement | null) => void;
  onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
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
  onSelectElement,
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
    onSelectElement(element);
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX - element.x,
      startY: e.clientY - element.y,
      elementId: element.id
    };
  }, [onSelectElement]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current.isDragging && dragRef.current.elementId) {
      const newX = e.clientX - dragRef.current.startX;
      const newY = e.clientY - dragRef.current.startY;
      
      onUpdateElement(dragRef.current.elementId, {
        x: Math.max(0, Math.min(newX, canvasSettings.width - 100)),
        y: Math.max(0, Math.min(newY, canvasSettings.height - 100))
      });
    }
  }, [onUpdateElement, canvasSettings]);

  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false;
    dragRef.current.elementId = null;
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

  const duplicateElement = useCallback((element: CardElement) => {
    const newElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: elements.length + 1
    };
    
    onAddElement(newElement.type, newElement.x, newElement.y);
  }, [elements.length, onAddElement]);

  const renderElement = (element: CardElement) => {
    const isSelected = selectedElement?.id === element.id;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      cursor: 'move',
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      borderRadius: element.borderRadius || 0
    };

    let content;
    
    switch (element.type) {
      case 'text':
        const textStyle: React.CSSProperties = {
          ...baseStyle,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          textAlign: element.textAlign,
          fontFamily: element.fontFamily,
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
          backgroundColor: 'transparent',
          overflow: 'hidden'
        };

        // Apply gradient or solid color
        if (element.isGradientText && element.gradientColor1 && element.gradientColor2) {
          textStyle.background = `linear-gradient(${element.gradientDirection || 'to right'}, ${element.gradientColor1}, ${element.gradientColor2})`;
          textStyle.WebkitBackgroundClip = 'text';
          textStyle.WebkitTextFillColor = 'transparent';
          textStyle.backgroundClip = 'text';
        } else {
          textStyle.color = element.color;
        }

        content = (
          <div
            style={textStyle}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            {element.content || 'Your text here'}
          </div>
        );
        break;
        
      case 'image':
        content = (
          <div
            style={baseStyle}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <img
              src={element.src}
              alt={element.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.objectFit || 'cover',
                borderRadius: element.borderRadius || 0
              }}
              draggable={false}
            />
          </div>
        );
        break;
        
      case 'shape':
        content = (
          <div
            style={{
              ...baseStyle,
              backgroundColor: element.backgroundColor,
              borderWidth: element.borderWidth,
              borderColor: element.borderColor,
              borderStyle: element.borderWidth ? 'solid' : 'none'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          />
        );
        break;
        
      case 'button':
        content = (
          <button
            style={{
              ...baseStyle,
              backgroundColor: element.buttonColor,
              color: element.buttonTextColor,
              border: 'none',
              borderRadius: element.borderRadius || 6,
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            {element.buttonText || 'Click me'}
          </button>
        );
        break;
        
      default:
        content = null;
    }

    return (
      <div key={element.id} className="relative">
        {content}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex space-x-1 bg-white border border-gray-200 rounded shadow-lg p-1">
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
  };

  return (
    <div className="flex justify-center">
      <div
        ref={canvasRef}
        className="relative border border-gray-300 shadow-lg"
        style={{
          width: canvasSettings.width,
          height: canvasSettings.height,
          backgroundColor: canvasSettings.backgroundColor
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {elements.map(renderElement)}
        
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-lg font-medium">Start Creating</p>
              <p className="text-sm">Drag elements from the toolbox or click to add them</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;