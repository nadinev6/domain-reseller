import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Palette, Type, Image, Square, MousePointer } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CardElement } from '../../types';

interface PropertiesPanelProps {
  selectedElement: CardElement | null;
  onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
  canvasSettings: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  onUpdateCanvasSettings: (settings: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  canvasSettings,
  onUpdateCanvasSettings
}) => {
  const { t } = useTranslation();

  const handleElementUpdate = (field: string, value: any) => {
    if (selectedElement) {
      onUpdateElement(selectedElement.id, { [field]: value });
    }
  };

  const handleCanvasUpdate = (field: string, value: any) => {
    onUpdateCanvasSettings({
      ...canvasSettings,
      [field]: value
    });
  };

  const renderElementProperties = () => {
    if (!selectedElement) return null;

    const commonProperties = (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="x">{t('cardStudio.editor.positionX')}</Label>
            <Input
              id="x"
              type="number"
              value={selectedElement.x}
              onChange={(e) => handleElementUpdate('x', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="y">{t('cardStudio.editor.positionY')}</Label>
            <Input
              id="y"
              type="number"
              value={selectedElement.y}
              onChange={(e) => handleElementUpdate('y', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="width">{t('cardStudio.editor.width')}</Label>
            <Input
              id="width"
              type="number"
              value={selectedElement.width}
              onChange={(e) => handleElementUpdate('width', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="height">{t('cardStudio.editor.height')}</Label>
            <Input
              id="height"
              type="number"
              value={selectedElement.height}
              onChange={(e) => handleElementUpdate('height', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rotation">{t('cardStudio.editor.rotation')}</Label>
          <Input
            id="rotation"
            type="number"
            value={selectedElement.rotation || 0}
            onChange={(e) => handleElementUpdate('rotation', parseInt(e.target.value))}
          />
        </div>
      </div>
    );

    switch (selectedElement.type) {
      case 'text':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Type className="w-5 h-5" />
              <h3 className="font-semibold">{t('cardStudio.editor.textProperties')}</h3>
            </div>
            
            <div>
              <Label htmlFor="content">{t('cardStudio.editor.textContent')}</Label>
              <textarea
                id="content"
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={selectedElement.content || ''}
                onChange={(e) => handleElementUpdate('content', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="fontSize">{t('cardStudio.editor.fontSize')}</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => handleElementUpdate('fontSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fontWeight">{t('cardStudio.editor.fontWeight')}</Label>
                <select
                  id="fontWeight"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedElement.fontWeight || 'normal'}
                  onChange={(e) => handleElementUpdate('fontWeight', e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Light</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="color">{t('cardStudio.editor.textColor')}</Label>
              <Input
                id="color"
                type="color"
                value={selectedElement.color || '#000000'}
                onChange={(e) => handleElementUpdate('color', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="textAlign">{t('cardStudio.editor.textAlign')}</Label>
              <select
                id="textAlign"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedElement.textAlign || 'left'}
                onChange={(e) => handleElementUpdate('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            {commonProperties}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-purple-600">
              <Image className="w-5 h-5" />
              <h3 className="font-semibold">{t('cardStudio.editor.imageProperties')}</h3>
            </div>
            
            <div>
              <Label htmlFor="src">{t('cardStudio.editor.imageUrl')}</Label>
              <Input
                id="src"
                type="url"
                value={selectedElement.src || ''}
                onChange={(e) => handleElementUpdate('src', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="alt">{t('cardStudio.editor.altText')}</Label>
              <Input
                id="alt"
                value={selectedElement.alt || ''}
                onChange={(e) => handleElementUpdate('alt', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="objectFit">{t('cardStudio.editor.objectFit')}</Label>
              <select
                id="objectFit"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedElement.objectFit || 'cover'}
                onChange={(e) => handleElementUpdate('objectFit', e.target.value)}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>

            <div>
              <Label htmlFor="borderRadius">{t('cardStudio.editor.borderRadius')}</Label>
              <Input
                id="borderRadius"
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => handleElementUpdate('borderRadius', parseInt(e.target.value))}
              />
            </div>

            {commonProperties}
          </div>
        );

      case 'shape':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-green-600">
              <Square className="w-5 h-5" />
              <h3 className="font-semibold">{t('cardStudio.editor.shapeProperties')}</h3>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor">{t('cardStudio.editor.backgroundColor')}</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={selectedElement.backgroundColor || '#3b82f6'}
                onChange={(e) => handleElementUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="borderRadius">{t('cardStudio.editor.borderRadius')}</Label>
              <Input
                id="borderRadius"
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => handleElementUpdate('borderRadius', parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="borderWidth">{t('cardStudio.editor.borderWidth')}</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={selectedElement.borderWidth || 0}
                  onChange={(e) => handleElementUpdate('borderWidth', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="borderColor">{t('cardStudio.editor.borderColor')}</Label>
                <Input
                  id="borderColor"
                  type="color"
                  value={selectedElement.borderColor || '#000000'}
                  onChange={(e) => handleElementUpdate('borderColor', e.target.value)}
                />
              </div>
            </div>

            {commonProperties}
          </div>
        );

      case 'button':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-orange-600">
              <MousePointer className="w-5 h-5" />
              <h3 className="font-semibold">{t('cardStudio.editor.buttonProperties')}</h3>
            </div>
            
            <div>
              <Label htmlFor="buttonText">{t('cardStudio.editor.buttonText')}</Label>
              <Input
                id="buttonText"
                value={selectedElement.buttonText || ''}
                onChange={(e) => handleElementUpdate('buttonText', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="buttonColor">{t('cardStudio.editor.buttonColor')}</Label>
                <Input
                  id="buttonColor"
                  type="color"
                  value={selectedElement.buttonColor || '#3b82f6'}
                  onChange={(e) => handleElementUpdate('buttonColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buttonTextColor">{t('cardStudio.editor.buttonTextColor')}</Label>
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={selectedElement.buttonTextColor || '#ffffff'}
                  onChange={(e) => handleElementUpdate('buttonTextColor', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="href">{t('cardStudio.editor.buttonLink')}</Label>
              <Input
                id="href"
                type="url"
                value={selectedElement.href || ''}
                onChange={(e) => handleElementUpdate('href', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="borderRadius">{t('cardStudio.editor.borderRadius')}</Label>
              <Input
                id="borderRadius"
                type="number"
                value={selectedElement.borderRadius || 6}
                onChange={(e) => handleElementUpdate('borderRadius', parseInt(e.target.value))}
              />
            </div>

            {commonProperties}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('cardStudio.editor.properties')}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Canvas Settings */}
        <div>
          <div className="flex items-center space-x-2 text-gray-700 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold">{t('cardStudio.editor.canvasSettings')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="canvasWidth">{t('cardStudio.editor.canvasWidth')}</Label>
                <Input
                  id="canvasWidth"
                  type="number"
                  value={canvasSettings.width}
                  onChange={(e) => handleCanvasUpdate('width', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="canvasHeight">{t('cardStudio.editor.canvasHeight')}</Label>
                <Input
                  id="canvasHeight"
                  type="number"
                  value={canvasSettings.height}
                  onChange={(e) => handleCanvasUpdate('height', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="canvasBackground">{t('cardStudio.editor.canvasBackground')}</Label>
              <Input
                id="canvasBackground"
                type="color"
                value={canvasSettings.backgroundColor}
                onChange={(e) => handleCanvasUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 800, height: 600, backgroundColor: canvasSettings.backgroundColor })}
              >
                16:9
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 600, height: 600, backgroundColor: canvasSettings.backgroundColor })}
              >
                1:1
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 600, height: 800, backgroundColor: canvasSettings.backgroundColor })}
              >
                3:4
              </Button>
            </div>
          </div>
        </div>

        {/* Element Properties */}
        {selectedElement ? (
          renderElementProperties()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">{t('cardStudio.editor.noElementSelected')}</p>
            <p className="text-sm">{t('cardStudio.editor.selectElementToEdit')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;