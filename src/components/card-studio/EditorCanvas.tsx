import React, { useRef, useCallback, useState } from 'react';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { t } from 'lingo.dev/react';
import { CardElement } from '../../types';


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
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX - element.x,
      startY: e.clientY - element.y,
      elementId: element.id
    };
  }, [onElementClick]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current.isDragging && dragRef.current.elementId) {
      const newX = e.clientX - dragRef.current.startX;
      const newY = e.clientY - dragRef.current.startY;
      
      // Constrain to canvas bounds
      const constrainedX = Math.max(0, Math.min(newX, canvasSettings.width - 100));
      const constrainedY = Math.max(0, Math.min(newY, canvasSettings.height - 100));
      
      // Calculate element center for grid guidelines
      const currentElement = safeElements.find(el => el.id === dragRef.current.elementId);
      const elementWidth = currentElement?.width || 100;
      const elementHeight = currentElement?.height || 100;
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
  }, [onUpdateElement, canvasSettings, elements]);

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

  const renderElement = (element: CardElement) => {
    const isSelected = selectedElement?.id === element.id;
    const isMultiSelected = safeMultiSelectedElementIds.includes(element.id);
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      cursor: 'move',
      border: isSelected 
        ? '2px solid #3b82f6' 
        : isMultiSelected 
        ? '2px solid #8b5cf6' 
        : '1px solid transparent',
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
          overflow: 'hidden',
          whiteSpace: 'pre-wrap'
        };

        // Apply gradient or solid color
        if (element.isGradientText && element.gradientColor1 && element.gradientColor2) {
          // For gradient text, we need to handle emojis separately
          const rawTextContent = element.content || t('cardStudio.editor.defaultText');
          const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
          
          // Split content into parts (text and emojis)
          const parts = [];
          let lastIndex = 0;
          let match;
          
          while ((match = emojiRegex.exec(rawTextContent)) !== null) {
            // Add text before emoji
            if (match.index > lastIndex) {
              parts.push({
                type: 'text',
                content: rawTextContent.slice(lastIndex, match.index)
              });
            }
            // Add emoji
            parts.push({
              type: 'emoji',
              content: match[0]
            });
            lastIndex = match.index + match[0].length;
          }
          
          // Add remaining text
          if (lastIndex < rawTextContent.length) {
            parts.push({
              type: 'text',
              content: rawTextContent.slice(lastIndex)
            });
          }
          
          // If no emojis found, treat as single text part
          if (parts.length === 0) {
            parts.push({
              type: 'text',
              content: rawTextContent
            });
          }
          
          content = (
            <div
              style={textStyle}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
            >
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={part.type === 'text' ? {
                    background: `linear-gradient(${element.gradientDirection || 'to right'}, ${element.gradientColor1}, ${element.gradientColor2})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  } : {
                    color: 'inherit'
                  }}
                >
                  {part.content}
                </span>
              ))}
            </div>
          );
        } else {
          textStyle.color = element.color;
          content = (
            <div
              style={textStyle}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
            >
              {element.content || t('cardStudio.editor.defaultText')}
            </div>
          );
        }

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
            {element.buttonText || t('cardStudio.editor.defaultButtonText')}
          </button>
        );
        break;
        
      default:
        content = null;
    }

    return (
      <div key={element.id} className="relative">
        {content}
        {(isSelected || isMultiSelected) && (
          <div className="absolute -top-8 left-0 flex space-x-1 bg-white border border-gray-200 rounded shadow-lg p-1">
            <button
              onClick={() => duplicateElement(element)}
              className="p-1 hover:bg-gray-100 rounded"
              title={t('cardStudio.editor.duplicate')}
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => onUpdateElement(element.id, { rotation: (element.rotation || 0) + 15 })}
              className="p-1 hover:bg-gray-100 rounded"
              title={t('cardStudio.editor.rotate')}
            >
              <RotateCw className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDeleteElement(element.id)}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
              title={t('cardStudio.editor.delete')}
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
        {safeElements.map(renderElement)}
        
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
        
        {safeElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-lg font-medium">{t('cardStudio.editor.emptyCanvas')}</p>
              <p className="text-sm">{t('cardStudio.editor.emptyCanvasDesc')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;