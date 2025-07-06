import React from 'react';
import { CardElement } from '../../types';

interface CardRendererProps {
  elements: CardElement[];
  canvasSettings: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  isPreview?: boolean;
}

const CardRenderer: React.FC<CardRendererProps> = ({
  elements,
  canvasSettings,
  isPreview = false
}) => {
  // Defensive check for elements array
  const safeElements = elements || [];

  const renderElement = (element: CardElement) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
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
          const rawTextContent = element.content || 'Your text here';
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
            <div style={textStyle}>
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
            <div style={textStyle}>
              {element.content || 'Your text here'}
            </div>
          );
        }
        break;
        
      case 'image':
        content = (
          <div style={baseStyle}>
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
              justifyContent: 'center',
              cursor: isPreview ? 'pointer' : 'default'
            }}
            onClick={isPreview && element.href ? () => window.open(element.href, '_blank') : undefined}
          >
            {element.buttonText || 'Click me'}
          </button>
        );
        break;
        
      default:
        content = null;
    }

    return <div key={element.id}>{content}</div>;
  };

  return (
    <div
      className={`relative ${isPreview ? '' : 'border border-gray-300 shadow-lg'}`}
      style={{
        width: canvasSettings.width,
        height: canvasSettings.height,
        backgroundColor: canvasSettings.backgroundColor
      }}
    >
      {safeElements.map(renderElement)}
      
      {safeElements.length === 0 && !isPreview && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-lg font-medium">Start Creating</p>
            <p className="text-sm">Drag elements from the toolbox or click to add them</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardRenderer;