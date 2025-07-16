import React, { useState, useEffect } from 'react';
import { Settings, Palette, Type, Image, Square, MousePointer, Save, Smile, RotateCcw, Zap, Maximize2, Plus, Trash2, Layers } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { CardElement, GradientLayer } from '../../types';

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
    backgroundLayers?: GradientLayer[];
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
  // Google Fonts selection
  const googleFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Playfair Display',
    'Poppins',
    'Source Sans Pro'
  ];


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

  // Gradient layer management functions
  const addGradientLayer = () => {
    const newLayer: GradientLayer = {
      id: `layer-${Date.now()}`,
      type: 'linear',
      colors: [
        { color: '#3b82f6', position: 0 },
        { color: '#8b5cf6', position: 100 }
      ],
      direction: 'to right',
      opacity: 0.8
    };

    const updatedLayers = [...(canvasSettings.backgroundLayers || []), newLayer];
    handleCanvasUpdate('backgroundLayers', updatedLayers);
  };

  const removeGradientLayer = (layerId: string) => {
    const updatedLayers = (canvasSettings.backgroundLayers || []).filter(layer => layer.id !== layerId);
    handleCanvasUpdate('backgroundLayers', updatedLayers);
  };

  const updateGradientLayer = (layerId: string, updates: Partial<GradientLayer>) => {
    const updatedLayers = (canvasSettings.backgroundLayers || []).map(layer =>
      layer.id === layerId ? { ...layer, ...updates } : layer
    );
    handleCanvasUpdate('backgroundLayers', updatedLayers);
  };

  const updateGradientColor = (layerId: string, colorIndex: number, newColor: string) => {
    const layer = canvasSettings.backgroundLayers?.find(l => l.id === layerId);
    if (!layer) return;

    const updatedColors = [...layer.colors];
    updatedColors[colorIndex] = { ...updatedColors[colorIndex], color: newColor };
    updateGradientLayer(layerId, { colors: updatedColors });
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
              <Label htmlFor="textDecoration">Text Decoration</Label>
              <Select
                value={selectedElement.textDecoration || 'none'}
                onValueChange={(value) => handleElementUpdate('textDecoration', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="underline">Underline</SelectItem>
                  <SelectItem value="overline">Overline</SelectItem>
                  <SelectItem value="line-through">Line Through</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="textTransform">Text Transform</Label>
              <Select
                value={selectedElement.textTransform || 'none'}
                onValueChange={(value) => handleElementUpdate('textTransform', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="uppercase">UPPERCASE</SelectItem>
                  <SelectItem value="capitalize">Capitalize</SelectItem>
                  <SelectItem value="lowercase">lowercase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Shadow Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Shadow</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="textShadowEnabled"
                    checked={!!selectedElement.isTextShadowEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleElementUpdate('isTextShadowEnabled', true);
                        handleElementUpdate('textShadowColor', '#000000');
                        handleElementUpdate('textShadowOffsetX', 2);
                        handleElementUpdate('textShadowOffsetY', 2);
                        handleElementUpdate('textShadowBlurRadius', 4);
                      } else {
                        handleElementUpdate('isTextShadowEnabled', false);
                        handleElementUpdate('textShadowColor', undefined);
                        handleElementUpdate('textShadowOffsetX', undefined);
                        handleElementUpdate('textShadowOffsetY', undefined);
                        handleElementUpdate('textShadowBlurRadius', undefined);
                      }
                    }}
                  />
                  <Label htmlFor="textShadowEnabled" className="text-sm">Enable</Label>
                </div>
              </div>
              
              {selectedElement.isTextShadowEnabled && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="textShadowColor" className="text-xs">Shadow Color</Label>
                    <Input
                      id="textShadowColor"
                      type="color"
                      value={selectedElement.textShadowColor || '#000000'}
                      onChange={(e) => handleElementUpdate('textShadowColor', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="textShadowOffsetX" className="text-xs">X Offset</Label>
                      <Input
                        id="textShadowOffsetX"
                        type="number"
                        value={selectedElement.textShadowOffsetX || 0}
                        onChange={(e) => handleElementUpdate('textShadowOffsetX', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="textShadowOffsetY" className="text-xs">Y Offset</Label>
                      <Input
                        id="textShadowOffsetY"
                        type="number"
                        value={selectedElement.textShadowOffsetY || 0}
                        onChange={(e) => handleElementUpdate('textShadowOffsetY', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="textShadowBlurRadius" className="text-xs">Blur</Label>
                      <Input
                        id="textShadowBlurRadius"
                        type="number"
                        min="0"
                        value={selectedElement.textShadowBlurRadius || 0}
                        onChange={(e) => handleElementUpdate('textShadowBlurRadius', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">Quick Presets:</p>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          handleElementUpdate('textShadowOffsetX', 2);
                          handleElementUpdate('textShadowOffsetY', 2);
                          handleElementUpdate('textShadowBlurRadius', 4);
                          handleElementUpdate('textShadowColor', '#000000');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Subtle
                      </button>
                      <button
                        onClick={() => {
                          handleElementUpdate('textShadowOffsetX', 4);
                          handleElementUpdate('textShadowOffsetY', 4);
                          handleElementUpdate('textShadowBlurRadius', 8);
                          handleElementUpdate('textShadowColor', '#000000');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Bold
                      </button>
                      <button
                        onClick={() => {
                          handleElementUpdate('textShadowOffsetX', 0);
                          handleElementUpdate('textShadowOffsetY', 0);
                          handleElementUpdate('textShadowBlurRadius', 10);
                          handleElementUpdate('textShadowColor', '#3b82f6');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Glow
                      </button>
                    </div>
                  </div>
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

            {/* Button Shadow Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="buttonShadowEnabled"
                  checked={selectedElement.isButtonBoxShadowEnabled || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleElementUpdate('isButtonBoxShadowEnabled', true);
                      handleElementUpdate('buttonBoxShadowColor', 'rgba(0, 0, 0, 0.1)');
                      handleElementUpdate('buttonBoxShadowOffsetX', 0);
                      handleElementUpdate('buttonBoxShadowOffsetY', 2);
                      handleElementUpdate('buttonBoxShadowBlurRadius', 4);
                      handleElementUpdate('buttonBoxShadowSpreadRadius', 0);
                    } else {
                      handleElementUpdate('isButtonBoxShadowEnabled', false);
                      handleElementUpdate('buttonBoxShadowColor', undefined);
                      handleElementUpdate('buttonBoxShadowOffsetX', undefined);
                      handleElementUpdate('buttonBoxShadowOffsetY', undefined);
                      handleElementUpdate('buttonBoxShadowBlurRadius', undefined);
                      handleElementUpdate('buttonBoxShadowSpreadRadius', undefined);
                    }
                  }}
                />
                <Label htmlFor="buttonShadowEnabled">Enable Button Shadow</Label>
              </div>
              
              {selectedElement.isButtonBoxShadowEnabled && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="buttonShadowColor" className="text-xs">Shadow Color</Label>
                    <Input
                      id="buttonShadowColor"
                      type="color"
                      value={selectedElement.buttonBoxShadowColor?.startsWith('rgba') ? '#000000' : selectedElement.buttonBoxShadowColor || '#000000'}
                      onChange={(e) => handleElementUpdate('buttonBoxShadowColor', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="buttonShadowOffsetX" className="text-xs">X Offset</Label>
                      <Input
                        id="buttonShadowOffsetX"
                        type="number"
                        value={selectedElement.buttonBoxShadowOffsetX || 0}
                        onChange={(e) => handleElementUpdate('buttonBoxShadowOffsetX', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonShadowOffsetY" className="text-xs">Y Offset</Label>
                      <Input
                        id="buttonShadowOffsetY"
                        type="number"
                        value={selectedElement.buttonBoxShadowOffsetY || 0}
                        onChange={(e) => handleElementUpdate('buttonBoxShadowOffsetY', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="buttonShadowBlur" className="text-xs">Blur Radius</Label>
                      <Input
                        id="buttonShadowBlur"
                        type="number"
                        min="0"
                        value={selectedElement.buttonBoxShadowBlurRadius || 0}
                        onChange={(e) => handleElementUpdate('buttonBoxShadowBlurRadius', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonShadowSpread" className="text-xs">Spread Radius</Label>
                      <Input
                        id="buttonShadowSpread"
                        type="number"
                        value={selectedElement.buttonBoxShadowSpreadRadius || 0}
                        onChange={(e) => handleElementUpdate('buttonBoxShadowSpreadRadius', parseInt(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p className="mb-1">Quick Presets:</p>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          handleElementUpdate('buttonBoxShadowOffsetX', 0);
                          handleElementUpdate('buttonBoxShadowOffsetY', 2);
                          handleElementUpdate('buttonBoxShadowBlurRadius', 4);
                          handleElementUpdate('buttonBoxShadowSpreadRadius', 0);
                          handleElementUpdate('buttonBoxShadowColor', 'rgba(0, 0, 0, 0.1)');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Subtle
                      </button>
                      <button
                        onClick={() => {
                          handleElementUpdate('buttonBoxShadowOffsetX', 0);
                          handleElementUpdate('buttonBoxShadowOffsetY', 4);
                          handleElementUpdate('buttonBoxShadowBlurRadius', 8);
                          handleElementUpdate('buttonBoxShadowSpreadRadius', 0);
                          handleElementUpdate('buttonBoxShadowColor', 'rgba(0, 0, 0, 0.15)');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Lifted
                      </button>
                      <button
                        onClick={() => {
                          handleElementUpdate('buttonBoxShadowOffsetX', 0);
                          handleElementUpdate('buttonBoxShadowOffsetY', 8);
                          handleElementUpdate('buttonBoxShadowBlurRadius', 16);
                          handleElementUpdate('buttonBoxShadowSpreadRadius', 0);
                          handleElementUpdate('buttonBoxShadowColor', 'rgba(0, 0, 0, 0.2)');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Strong
                      </button>
                      <button
                        onClick={() => {
                          handleElementUpdate('buttonBoxShadowOffsetX', 0);
                          handleElementUpdate('buttonBoxShadowOffsetY', 0);
                          handleElementUpdate('buttonBoxShadowBlurRadius', 0);
                          handleElementUpdate('buttonBoxShadowSpreadRadius', 2);
                          handleElementUpdate('buttonBoxShadowColor', '#3b82f6');
                        }}
                        className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-100 transition-colors"
                      >
                        Outline
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

        {/* Gradient Background Generator */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <Layers className="w-5 h-5" />
              <h3 className="font-semibold">Gradient Background</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addGradientLayer}
              className="flex items-center text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Layer
            </Button>
          </div>

          <div className="space-y-4">
            {/* Fallback Background Color */}
            <div>
              <Label htmlFor="fallbackBackground" className="text-xs">Fallback Background</Label>
              <Input
                id="fallbackBackground"
                type="color"
                value={canvasSettings.backgroundColor}
                onChange={(e) => handleCanvasUpdate('backgroundColor', e.target.value)}
              />
            </div>

            {/* Gradient Layers */}
            {canvasSettings.backgroundLayers && canvasSettings.backgroundLayers.length > 0 && (
              <div className="space-y-3">
                {canvasSettings.backgroundLayers.map((layer, index) => (
                  <div key={layer.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-700">
                        Layer {index + 1} ({layer.type})
                      </span>
                      {canvasSettings.backgroundLayers!.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGradientLayer(layer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Gradient Colors */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <Label className="text-xs">Start Color</Label>
                        <Input
                          type="color"
                          value={layer.colors[0]?.color || '#3b82f6'}
                          onChange={(e) => updateGradientColor(layer.id, 0, e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Color</Label>
                        <Input
                          type="color"
                          value={layer.colors[1]?.color || '#8b5cf6'}
                          onChange={(e) => updateGradientColor(layer.id, 1, e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Direction */}
                    <div className="mb-3">
                      <Label className="text-xs">Direction</Label>
                      <Select
                        value={layer.direction}
                        onValueChange={(value) => updateGradientLayer(layer.id, { direction: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="to right">Left to Right</SelectItem>
                          <SelectItem value="to left">Right to Left</SelectItem>
                          <SelectItem value="to bottom">Top to Bottom</SelectItem>
                          <SelectItem value="to top">Bottom to Top</SelectItem>
                          <SelectItem value="to bottom right">Top-Left to Bottom-Right</SelectItem>
                          <SelectItem value="to bottom left">Top-Right to Bottom-Left</SelectItem>
                          <SelectItem value="45deg">45° Diagonal</SelectItem>
                          <SelectItem value="90deg">90° Vertical</SelectItem>
                          <SelectItem value="135deg">135° Diagonal</SelectItem>
                          <SelectItem value="180deg">180° Horizontal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Opacity */}
                    <div>
                      <Label className="text-xs">Opacity: {Math.round(layer.opacity * 100)}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={layer.opacity}
                        onChange={(e) => updateGradientLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Gradient Presets */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset: GradientLayer = {
                      id: `preset-${Date.now()}`,
                      type: 'linear',
                      colors: [
                        { color: '#667eea', position: 0 },
                        { color: '#764ba2', position: 100 }
                      ],
                      direction: '45deg',
                      opacity: 1
                    };
                    handleCanvasUpdate('backgroundLayers', [preset]);
                  }}
                  className="text-xs"
                >
                  Purple Haze
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset: GradientLayer = {
                      id: `preset-${Date.now()}`,
                      type: 'linear',
                      colors: [
                        { color: '#f093fb', position: 0 },
                        { color: '#f5576c', position: 100 }
                      ],
                      direction: 'to right',
                      opacity: 1
                    };
                    handleCanvasUpdate('backgroundLayers', [preset]);
                  }}
                  className="text-xs"
                >
                  Pink Sunset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const preset: GradientLayer = {
                      id: `preset-${Date.now()}`,
                      type: 'linear',
                      colors: [
                        { color: '#4facfe', position: 0 },
                        { color: '#00f2fe', position: 100 }
                      ],
                      direction: 'to bottom',
                      opacity: 1
                    };
                    handleCanvasUpdate('backgroundLayers', [preset]);
                  }}
                  className="text-xs"
                >
                  Ocean Blue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const layers: GradientLayer[] = [
                      {
                        id: `layer-1-${Date.now()}`,
                        type: 'linear',
                        colors: [
                          { color: '#ff9a9e', position: 0 },
                          { color: '#fecfef', position: 100 }
                        ],
                        direction: 'to bottom',
                        opacity: 1
                      },
                      {
                        id: `layer-2-${Date.now()}`,
                        type: 'linear',
                        colors: [
                          { color: '#a8edea', position: 0 },
                          { color: '#fed6e3', position: 100 }
                        ],
                        direction: '45deg',
                        opacity: 0.6
                      }
                    ];
                    handleCanvasUpdate('backgroundLayers', layers);
                  }}
                  className="text-xs"
                >
                  Layered Dream
                </Button>
              </div>
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
                <Select onValueChange={(value) => {
                  const preset = socialMediaPresets.find(p => p.name === value);
                  if (preset) {
                    onMagicResize(preset, selectedResizeMode);
                  }
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a social media format..." />
                  </SelectTrigger>
                  <SelectContent>
                    {socialMediaPresets.map((preset, index) => (
                      <SelectItem key={index} value={preset.name}>
                        <div className="flex flex-col">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-gray-500">
                            {preset.aspectRatio} • {preset.width}×{preset.height}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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