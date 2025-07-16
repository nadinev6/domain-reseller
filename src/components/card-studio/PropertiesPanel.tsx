import React, { useState, useEffect } from 'react';
import { Settings, Palette, Type, Image, Square, MousePointer, Save, Smile, RotateCcw, Zap, Maximize2 } from 'lucide-react';
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
  onMagicResize?: (preset: any, resizeMode: 'scale' | 'fit') => void;
  socialMediaPresets?: Array<{
    name: string;
    width: number;
    height: number;
    aspectRatio: string;
    description: string;
  }>;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  canvasSettings,
  onUpdateCanvasSettings,
  onMagicResize,
  socialMediaPresets = []
}) => {

  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<keyof typeof EMOJI_CATEGORIES>('faces');
  const [selectedResizeMode, setSelectedResizeMode] = useState<'scale' | 'fit'>('scale');

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
            <Label htmlFor="x">X Position</Label>
            <Input
              id="x"
              type="number"
              value={selectedElement.x}
              onChange={(e) => handleElementUpdate('x', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="y">Y Position</Label>
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
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={selectedElement.width}
              onChange={(e) => handleElementUpdate('width', parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={selectedElement.height}
              onChange={(e) => handleElementUpdate('height', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rotation">Rotation</Label>
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
              <h3 className="font-semibold">Text Properties</h3>
            </div>
            
            <div>
              <Label htmlFor="content">Text Content</Label>
              <div className="relative">
                <textarea
                  id="content"
                  className="w-full p-2 pr-10 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  value={selectedElement.content || ''}
                  onChange={(e) => handleElementUpdate('content', e.target.value)}
                  placeholder="Type your text here... Press Enter for new lines"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  title="Add emoji"
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
                        {category.charAt(0).toUpperCase() + category.slice(1)}
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
                    Close
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  type="number"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => handleElementUpdate('fontSize', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="fontWeight">Font Weight</Label>
                <select
                  id="fontWeight"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedElement.fontWeight || '400'}
                  onChange={(e) => handleElementUpdate('fontWeight', e.target.value)}
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="700">Bold</option>
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
                <Label htmlFor="gradientToggle" className="text-sm">Enable Gradient Text</Label>
              </div>
              
              {selectedElement.isGradientText ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gradientColor1" className="text-xs">Color 1</Label>
                      <Input
                        id="gradientColor1"
                        type="color"
                        value={selectedElement.gradientColor1 || '#3b82f6'}
                        onChange={(e) => handleElementUpdate('gradientColor1', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradientColor2" className="text-xs">Color 2</Label>
                      <Input
                        id="gradientColor2"
                        type="color"
                        value={selectedElement.gradientColor2 || '#8b5cf6'}
                        onChange={(e) => handleElementUpdate('gradientColor2', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gradientDirection" className="text-xs">Direction</Label>
                    <select
                      id="gradientDirection"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={selectedElement.gradientDirection || 'to right'}
                      onChange={(e) => handleElementUpdate('gradientDirection', e.target.value)}
                    >
                      <option value="to right">Left to Right</option>
                      <option value="to left">Right to Left</option>
                      <option value="to bottom">Top to Bottom</option>
                      <option value="to top">Bottom to Top</option>
                      <option value="45deg">Diagonal ↗</option>
                      <option value="-45deg">Diagonal ↘</option>
                      <option value="135deg">Diagonal ↖</option>
                      <option value="-135deg">Diagonal ↙</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="color">Text Color</Label>
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
              <Label htmlFor="textAlign">Text Align</Label>
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
              <h3 className="font-semibold">Image Properties</h3>
            </div>
            
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                type="url"
                value={selectedElement.src || ''}
                onChange={(e) => handleElementUpdate('src', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={selectedElement.alt || ''}
                onChange={(e) => handleElementUpdate('alt', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="objectFit">Object Fit</Label>
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
              <Label htmlFor="borderRadius">Border Radius</Label>
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
              <h3 className="font-semibold">Shape Properties</h3>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={selectedElement.backgroundColor || '#3b82f6'}
                onChange={(e) => handleElementUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="borderRadius">Border Radius</Label>
              <Input
                id="borderRadius"
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => handleElementUpdate('borderRadius', parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={selectedElement.borderWidth || 0}
                  onChange={(e) => handleElementUpdate('borderWidth', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="borderColor">Border Color</Label>
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
              <h3 className="font-semibold">Button Properties</h3>
            </div>
            
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={selectedElement.buttonText || ''}
                onChange={(e) => handleElementUpdate('buttonText', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="buttonColor">Button Color</Label>
                <Input
                  id="buttonColor"
                  type="color"
                  value={selectedElement.buttonColor || '#3b82f6'}
                  onChange={(e) => handleElementUpdate('buttonColor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={selectedElement.buttonTextColor || '#ffffff'}
                  onChange={(e) => handleElementUpdate('buttonTextColor', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="href">Button Link</Label>
              <Input
                id="href"
                type="url"
                value={selectedElement.href || ''}
                onChange={(e) => handleElementUpdate('href', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="borderRadius">Border Radius</Label>
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
          Properties
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Canvas Settings */}
        <div>
          <div className="flex items-center space-x-2 text-gray-700 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="font-semibold">Canvas Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="canvasWidth">Canvas Width</Label>
                <Input
                  id="canvasWidth"
                  type="number"
                  value={canvasSettings.width}
                  onChange={(e) => handleCanvasUpdate('width', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="canvasHeight">Canvas Height</Label>
                <Input
                  id="canvasHeight"
                  type="number"
                  value={canvasSettings.height}
                  onChange={(e) => handleCanvasUpdate('height', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="canvasBackground">Canvas Background</Label>
              <Input
                id="canvasBackground"
                type="color"
                value={canvasSettings.backgroundColor}
                onChange={(e) => handleCanvasUpdate('backgroundColor', e.target.value)}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Color Palette</Label>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCurrentColor}
                    className="flex items-center text-xs"
                    title="Save current canvas background color"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetColorPalette}
                    className="flex items-center text-xs"
                    title="Reset color palette"
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
                      title={color ? `Apply color: ${color}` : 'Empty slot'}
                    />
                  );
                })}
              </div>
              {savedColors.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Save colors to quickly apply them to your canvas background
                </p>
              )}
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

        {/* Magic Resize Section */}
        {onMagicResize && socialMediaPresets.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 mb-4">
              <Zap className="w-5 h-5" />
              <h3 className="font-semibold">Magic Resize</h3>
            </div>
            
            <div className="space-y-4">
              {/* Resize Mode Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Resize Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedResizeMode('scale')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedResizeMode === 'scale'
                        ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                        : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    Scale & Crop
                  </button>
                  <button
                    onClick={() => setSelectedResizeMode('fit')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedResizeMode === 'fit'
                        ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300'
                        : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Square className="w-4 h-4" />
                    </div>
                    Fit to Canvas
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedResizeMode === 'scale' 
                    ? 'Elements scale proportionally and may be cropped'
                    : 'Elements fit within canvas and are centered'
                  }
                </p>
              </div>

              {/* Social Media Presets */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Social Media Formats</Label>
                <div className="space-y-2">
                  {socialMediaPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => onMagicResize(preset, selectedResizeMode)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-indigo-900">
                            {preset.name}
                          </div>
                          <div className="text-xs text-gray-500 group-hover:text-indigo-600 mt-1">
                            {preset.aspectRatio} • {preset.width}×{preset.height}
                          </div>
                          <div className="text-xs text-gray-400 group-hover:text-indigo-500">
                            {preset.description}
                          </div>
                        </div>
                        <div className="ml-3">
                          <Zap className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Canvas Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-medium text-gray-700 mb-1">Current Canvas</div>
                <div className="text-xs text-gray-600">
                  {canvasSettings.width}×{canvasSettings.height} • 
                  {(canvasSettings.width / canvasSettings.height).toFixed(2)}:1 ratio
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Element Properties */}
        {selectedElement ? (
          renderElementProperties()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No Element Selected</p>
            <p className="text-sm">Click on an element to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;