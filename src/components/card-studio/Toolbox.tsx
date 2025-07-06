import React from 'react';
import { Type, Image, Square, MousePointer } from 'lucide-react';
import { t } from 'lingo.dev/react';
import { CardElement } from '../../types';

interface ToolboxProps {
  onAddElement: (type: CardElement['type'], x: number, y: number) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onAddElement }) => {

  const tools = [
    {
      type: 'text' as const,
      icon: <Type className="w-5 h-5" />,
      label: <>{t('cardStudio.editor.textElement')}</>,
      description: t('cardStudio.editor.textElementDesc')
    },
    {
      type: 'image' as const,
      icon: <Image className="w-5 h-5" />,
      label: <>{t('cardStudio.editor.imageElement')}</>,
      description: t('cardStudio.editor.imageElementDesc')
    },
    {
      type: 'shape' as const,
      icon: <Square className="w-5 h-5" />,
      label: <>{t('cardStudio.editor.shapeElement')}</>,
      description: t('cardStudio.editor.shapeElementDesc')
    },
    {
      type: 'button' as const,
      icon: <MousePointer className="w-5 h-5" />,
      label: <>{t('cardStudio.editor.buttonElement')}</>,
      description: t('cardStudio.editor.buttonElementDesc')
    }
  ];

  const handleDragStart = (e: React.DragEvent, elementType: CardElement['type']) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: elementType,
      source: 'toolbox'
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (elementType: CardElement['type']) => {
    // Add element to center of canvas when clicked
    onAddElement(elementType, 300, 200);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('cardStudio.editor.toolbox')}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {t('cardStudio.editor.toolboxDesc')}
        </p>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {tools.map((tool) => (
          <div
            key={tool.type}
            draggable
            onDragStart={(e) => handleDragStart(e, tool.type)}
            onClick={() => handleClick(tool.type)}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                {tool.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 group-hover:text-indigo-900">
                  {tool.label}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-indigo-600 mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">{t('cardStudio.editor.howToUse')}</p>
          <ul className="space-y-1">
            <li>• {t('cardStudio.editor.dragToCanvas')}</li>
            <li>• {t('cardStudio.editor.clickToAdd')}</li>
            <li>• {t('cardStudio.editor.selectToEdit')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;