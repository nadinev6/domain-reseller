import React, { useState, useEffect } from 'react';
import { Settings, Palette, Type, Image, Square, MousePointer, Save, Smile, RotateCcw } from 'lucide-react';
import { t } from 'lingo.dev/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CardElement } from '../../types';

// Common emojis for the magic box
const EMOJI_CATEGORIES = {
  faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  symbols: ['✨', '⭐', '🌟', '💫', '⚡', '🔥', '💥', '💢', '💯', '✅', '❌', '⚠️', '🚀', '🎯', '🎪', '🎨', '🎭', '🎪'],
  objects: ['💎', '👑', '🏆', '🎁', '🎉', '🎊', '🎈', '🎀', '💰', '💳', '📱', '💻', '⌚', '📷', '🎵', '🎶', '🔔', '💡']
};

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

  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<keyof typeof EMOJI_CATEGORIES>('faces');

  // Load saved colors from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('vibepage-saved-colors');
    if (stored) {
      try {
        const colors = JSON.parse(stored);
        setSavedColors(Array.isArray(colors) ? colors : []);
      } catch (error) {
        console.error('Error loading saved colors:', error);
        setSavedColors([]);
      }
    }
  }, []);

  // Save current canvas background color to palette
  const saveCurrentColor = () => {
    const currentColor = canvasSettings.backgroundColor;
    const newColors = [...savedColors];
    
    // If color already exists, don't add it again
    if (newColors.includes(currentColor)) {
      return;
    }
    
    // Add new color, keep only 5 colors max (remove oldest if needed)
    newColors.push(currentColor);
    if (newColors.length > 5) {
      newColors.shift(); // Remove the oldest color
    }
    
    setSavedColors(newColors);
    localStorage.setItem('vibepage-saved-colors', JSON.stringify(newColors));
  };

  // Reset color palette
  const resetColorPalette = () => {
    setSavedColors([]);
    localStorage.removeItem('vibepage-saved-colors');
  };

  // Apply saved color to canvas background
  const applySavedColor = (color: string) => {
    handleCanvasUpdate('backgroundColor', color);
  };

  // Add emoji to text content
  const addEmoji = (emoji: string) => {
    if (selectedElement && selectedElement.type === 'text') {
      const currentContent = selectedElement.content || '';
      handleElementUpdate('content', currentContent + emoji);
      setShowEmojiPicker(false);
    }
  };

  const handleElementUpdate = (field: string, value: any) => {
    if (selectedElement && onUpdateElement) {
      onUpdateElement(selectedElement.id, { [field]: value });
    }
  };

  const handleCanvasUpdate = (field: string, value: any) => {
    if (onUpdateCanvasSettings && canvasSettings) {
      onUpdateCanvasSettings({
        ...canvasSettings,
        [field]: value
      });
    }
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
              <div className="relative">
                <textarea
                  id="content"
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  value={selectedElement.content || ''}
                  onChange={(e) => handleElementUpdate('content', e.target.value)}
                  placeholder={t('cardStudio.editor.textContentPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  title={t('cardStudio.editor.addEmoji')}
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
                  <div className="flex space-x-1 mb-2">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveEmojiCategory(category as keyof typeof EMOJI_CATEGORIES)}
                        className={`px-2 py-1 text-xs rounded transition-colors duration-200 ${
                          activeEmojiCategory === category
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {t(`cardStudio.editor.emojiCategories.${category}`)}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                    {EMOJI_CATEGORIES[activeEmojiCategory].map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="p-1 text-lg hover:bg-gray-100 rounded transition-colors duration-200"
                        title={`Add ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {t('cardStudio.editor.closeEmoji')}
                  </button>
                </div>
              )}
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
                  value={selectedElement.fontWeight || '400'}
                  onChange={(e) => handleElementUpdate('fontWeight', e.target.value)}
                >
                  <option value="300">{t('cardStudio.editor.fontWeights.light')}</option>
                  <option value="400">{t('cardStudio.editor.fontWeights.normal')}</option>
                  <option value="700">{t('cardStudio.editor.fontWeights.bold')}</option>
                </select>
              </div>
            </div>

            {/* Text Color / Gradient Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="gradientToggle"
                  checked={selectedElement.isGradientText || false}
                  onChange={(e) => handleElementUpdate('isGradientText', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="gradientToggle" className="text-sm">{t('cardStudio.editor.enableGradient')}</Label>
              </div>
              
              {selectedElement.isGradientText ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gradientColor1" className="text-xs">{t('cardStudio.editor.gradientColor1')}</Label>
                      <Input
                        id="gradientColor1"
                        type="color"
                        value={selectedElement.gradientColor1 || '#3b82f6'}
                        onChange={(e) => handleElementUpdate('gradientColor1', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradientColor2" className="text-xs">{t('cardStudio.editor.gradientColor2')}</Label>
                      <Input
                        id="gradientColor2"
                        type="color"
                        value={selectedElement.gradientColor2 || '#8b5cf6'}
                        onChange={(e) => handleElementUpdate('gradientColor2', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gradientDirection" className="text-xs">{t('cardStudio.editor.gradientDirection')}</Label>
                    <select
                      id="gradientDirection"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={selectedElement.gradientDirection || 'to right'}
                      onChange={(e) => handleElementUpdate('gradientDirection', e.target.value)}
                    >
                      <option value="to right">{t('cardStudio.editor.gradientDirections.toRight')}</option>
                      <option value="to left">{t('cardStudio.editor.gradientDirections.toLeft')}</option>
                      <option value="to bottom">{t('cardStudio.editor.gradientDirections.toBottom')}</option>
                      <option value="to top">{t('cardStudio.editor.gradientDirections.toTop')}</option>
                      <option value="45deg">{t('cardStudio.editor.gradientDirections.diagonal1')}</option>
                      <option value="-45deg">{t('cardStudio.editor.gradientDirections.diagonal2')}</option>
                      <option value="135deg">{t('cardStudio.editor.gradientDirections.diagonal3')}</option>
                      <option value="-135deg">{t('cardStudio.editor.gradientDirections.diagonal4')}</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="color">{t('cardStudio.editor.textColor')}</Label>
                  <Input
                    id="color"
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => handleElementUpdate('color', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="textAlign">{t('cardStudio.editor.textAlign')}</Label>
              <select
                id="textAlign"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedElement.textAlign || 'left'}
                onChange={(e) => handleElementUpdate('textAlign', e.target.value)}
              >
                <option value="left">{t('cardStudio.editor.textAlignments.left')}</option>
                <option value="center">{t('cardStudio.editor.textAlignments.center')}</option>
                <option value="right">{t('cardStudio.editor.textAlignments.right')}</option>
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
                <option value="cover">{t('cardStudio.editor.objectFits.cover')}</option>
                <option value="contain">{t('cardStudio.editor.objectFits.contain')}</option>
                <option value="fill">{t('cardStudio.editor.objectFits.fill')}</option>
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

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">{t('cardStudio.editor.colorPalette')}</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCurrentColor}
                    className="flex items-center text-xs"
                    title={t('cardStudio.editor.saveColorTitle')}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {t('cardStudio.editor.saveColor')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetColorPalette}
                    className="flex items-center text-xs"
                    title={t('cardStudio.editor.resetPalette')}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const color = savedColors[index];
                  return (
                    <button
                      key={index}
                      onClick={() => color && applySavedColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-all duration-200 ${
                        color 
                          ? 'border-gray-300 hover:border-indigo-400 hover:scale-110' 
                          : 'border-dashed border-gray-200 bg-gray-50'
                      }`}
                      style={{ 
                        backgroundColor: color || 'transparent',
                        cursor: color ? 'pointer' : 'default'
                      }}
                      disabled={!color}
                      title={color ? t('cardStudio.editor.applyColor', { color }) : t('cardStudio.editor.emptySlot')}
                    />
                  );
                })}
              </div>
              {savedColors.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {t('cardStudio.editor.emptyPaletteDesc')}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 800, height: 600, backgroundColor: canvasSettings.backgroundColor })}
              >
                {t('cardStudio.editor.presets.16:9')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 600, height: 600, backgroundColor: canvasSettings.backgroundColor })}
              >
                {t('cardStudio.editor.presets.1:1')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateCanvasSettings({ width: 600, height: 800, backgroundColor: canvasSettings.backgroundColor })}
              >
                {t('cardStudio.editor.presets.3:4')}
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