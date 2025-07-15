import React, { useState, useEffect } from 'react';
import { Zap, Copy, Check, Target, User, Sparkles, TrendingUp, Loader2, AlertCircle, Plus, Trash2, Hash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Locale helpers
const getBrowserLocale = (): string => {
  return navigator.language || navigator.languages?.[0] || 'en-US';
};

const findMatchingLocale = (locale: string): string => {
  const supportedLocales = ['en-US', 'es-ES'];
  return supportedLocales.includes(locale) ? locale : 'en-US';
};

const TRANSLATIONS = {
  "en-US": {
    "ctaScriptGenerator": "CopyForge Studio",
    "transformIdeasDescription": "AI-powered copywriting studio that transforms your ideas into compelling CTAs, persuasive scripts, and high-converting copy",
    "yourOfferGoals": "Your Offer & Goals",
    "offerPlaceholder": "Describe what you're selling or promoting... Your product, service, benefit, target action - just get your ideas down!",
    "tipKeyboardShortcut": "💡 Tip: Press Cmd/Ctrl + Enter to generate your CTAs",
    "generateCTAs": "Generate CTAs",
    "generatingCTAs": "Generating...",
    "copyToClipboard": "Copy to Clipboard",
    "copied": "Copied!",
    "targetAudience": "Target Audience",
    "audiencePlaceholder": "Who is your ideal customer? (e.g., small business owners, fitness enthusiasts, busy parents)",
    "ctaStyle": "CTA Style",
    "urgent": "Urgent",
    "friendly": "Friendly",
    "professional": "Professional",
    "playful": "Playful",
    "generatedContent": "Generated Content",
    "noContentGenerated": "No content generated yet. Fill out the form above and click 'Generate CTAs' to get started!",
    "errorOccurred": "An error occurred while generating content. Please try again.",
    "fillAllFields": "Please fill in your offer description to generate CTAs.",
    "aiNotAvailable": "AI service is not available. Please check your setup.",
    "mySavedHashtags": "My Saved Hashtags",
    "addHashtag": "Add Hashtag",
    "hashtagPlaceholder": "Enter hashtag (without #)",
    "pasteHashtag": "Paste",
    "removeHashtag": "Remove",
    "noSavedHashtags": "No saved hashtags yet. Add some hashtags to get started!",
    "hashtagExists": "This hashtag already exists in your saved list.",
    "hashtagAdded": "Hashtag added successfully!",
    "hashtagRemoved": "Hashtag removed successfully!",
    "hashtagPasted": "Hashtag pasted to content!"
  },
  "es-ES": {
    "ctaScriptGenerator": "CopyForge Studio",
    "transformIdeasDescription": "Estudio de copywriting impulsado por IA que transforma tus ideas en CTAs convincentes, scripts persuasivos y copy de alta conversión",
    "yourOfferGoals": "Tu Oferta y Objetivos",
    "generateCTAs": "Generar CTAs",
    "generatingCTAs": "Generando...",
    "copyToClipboard": "Copiar al Portapapeles",
    "copied": "¡Copiado!",
    "mySavedHashtags": "Mis Hashtags Guardados",
    "addHashtag": "Agregar Hashtag"
  }
};

const currentLocale = findMatchingLocale(getBrowserLocale());
const t = (key: string): string => TRANSLATIONS[currentLocale]?.[key] || TRANSLATIONS['en-US'][key] || key;

const CopyForgeStudioContent: React.FC = () => {
  const { user } = useAuth();
  
  // Form state
  const [rawOffer, setRawOffer] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [ctaStyle, setCtaStyle] = useState('professional');
  
  // AI and UI state
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');

  // Hashtag state
  const [savedHashtags, setSavedHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [isLoadingSavedHashtags, setIsLoadingSavedHashtags] = useState(false);
  const [savedHashtagsError, setSavedHashtagsError] = useState('');
  const [hashtagFeedback, setHashtagFeedback] = useState('');

  // Load saved hashtags on component mount
  useEffect(() => {
    if (user) {
      fetchSavedHashtags();
    }
  }, [user]);

  // Fetch user's saved hashtags from Supabase
  const fetchSavedHashtags = async () => {
    if (!user) return;

    setIsLoadingSavedHashtags(true);
    setSavedHashtagsError('');

    try {
      const { data, error } = await supabase
        .from('user_hashtags')
        .select('hashtags')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      setSavedHashtags(data?.hashtags || []);
    } catch (error) {
      console.error('Error fetching saved hashtags:', error);
      setSavedHashtagsError('Failed to load saved hashtags');
    } finally {
      setIsLoadingSavedHashtags(false);
    }
  };

  // Add a new hashtag
  const addHashtag = async () => {
    if (!user || !newHashtag.trim()) return;

    const cleanHashtag = newHashtag.trim().replace(/^#/, ''); // Remove # if user added it
    
    // Check if hashtag already exists
    if (savedHashtags.includes(cleanHashtag)) {
      setHashtagFeedback(t('hashtagExists'));
      setTimeout(() => setHashtagFeedback(''), 3000);
      return;
    }

    try {
      const updatedHashtags = [...savedHashtags, cleanHashtag];

      const { error } = await supabase
        .from('user_hashtags')
        .upsert({
          user_id: user.id,
          hashtags: updatedHashtags,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSavedHashtags(updatedHashtags);
      setNewHashtag('');
      setHashtagFeedback(t('hashtagAdded'));
      setTimeout(() => setHashtagFeedback(''), 3000);
    } catch (error) {
      console.error('Error adding hashtag:', error);
      setSavedHashtagsError('Failed to add hashtag');
    }
  };

  // Remove a hashtag
  const removeHashtag = async (hashtagToRemove: string) => {
    if (!user) return;

    try {
      const updatedHashtags = savedHashtags.filter(tag => tag !== hashtagToRemove);

      const { error } = await supabase
        .from('user_hashtags')
        .upsert({
          user_id: user.id,
          hashtags: updatedHashtags,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSavedHashtags(updatedHashtags);
      setHashtagFeedback(t('hashtagRemoved'));
      setTimeout(() => setHashtagFeedback(''), 3000);
    } catch (error) {
      console.error('Error removing hashtag:', error);
      setSavedHashtagsError('Failed to remove hashtag');
    }
  };

  // Paste hashtag to generated content
  const handlePasteHashtag = (hashtag: string) => {
    const hashtagWithSymbol = `#${hashtag}`;
    const currentContent = generatedContent;
    const newContent = currentContent ? `${currentContent}\n\n${hashtagWithSymbol}` : hashtagWithSymbol;
    
    setGeneratedContent(newContent);
    setHashtagFeedback(t('hashtagPasted'));
    setTimeout(() => setHashtagFeedback(''), 2000);
  };

  // AI Integration Function
  const generateWithAI = async (prompt: string): Promise<string> => {
    try {
      // Check if OpenAI API key is available
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
      
      // Check if Claude is available as fallback
      if (typeof window !== 'undefined' && (window as any).claude) {
        const response = await (window as any).claude.complete(prompt);
        return response.trim();
      }
      
      throw new Error('AI service not available. Please check your OpenAI API key configuration.');
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error;
    }
  };

  // Generate CTAs Handler
  const handleGenerateCTAs = async () => {
    // Validation
    if (!rawOffer.trim()) {
      setError(t('fillAllFields'));
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      // Construct detailed prompt
      const prompt = `You are a professional copywriter specializing in high-converting CTAs and persuasive copy. 

TASK: Create compelling call-to-action copy based on the following information:

OFFER/PRODUCT: ${rawOffer}
TARGET AUDIENCE: ${targetAudience || 'General audience'}
STYLE: ${ctaStyle}

Please generate:
1. 5 different CTA headlines (short, punchy, action-oriented)
2. 3 longer persuasive copy blocks (2-3 sentences each)
3. 2 urgency-driven CTAs
4. 1 benefit-focused CTA

Format your response clearly with headers for each section. Make the copy compelling, action-oriented, and tailored to the specified style and audience.

Focus on:
- Clear value proposition
- Strong action verbs
- Emotional triggers
- Urgency when appropriate
- Benefits over features`;

      const aiResponse = await generateWithAI(prompt);
      setGeneratedContent(aiResponse);
    } catch (error) {
      console.error('Error generating CTAs:', error);
      setError(error instanceof Error ? error.message : t('errorOccurred'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to Clipboard Handler
  const copyToClipboard = async () => {
    if (!generatedContent) return;

    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setError('Failed to copy to clipboard');
    }
  };

  // Keyboard shortcut handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerateCTAs();
    }
  };

  // Handle hashtag input key press
  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 via-red-600 to-pink-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Zap className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('ctaScriptGenerator')}
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {t('transformIdeasDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Offer & Goals */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('yourOfferGoals')}
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rawOffer" className="text-sm font-medium text-gray-700">
                    Offer Description *
                  </Label>
                  <textarea
                    id="rawOffer"
                    value={rawOffer}
                    onChange={(e) => setRawOffer(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={t('offerPlaceholder')}
                    className="mt-1 w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {t('tipKeyboardShortcut')}
                </p>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('targetAudience')}
                </h2>
              </div>
              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700">
                  Who is your ideal customer?
                </Label>
                <Input
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder={t('audiencePlaceholder')}
                  className="mt-1"
                />
              </div>
            </div>

            {/* CTA Style */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('ctaStyle')}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['urgent', 'friendly', 'professional', 'playful'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setCtaStyle(style)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      ctaStyle === style
                        ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                        : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {t(style)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCTAs}
              disabled={isGenerating || !rawOffer.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('generatingCTAs')}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {t('generateCTAs')}
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Generated Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('generatedContent')}
                  </h2>
                </div>
                {generatedContent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-600" />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        {t('copyToClipboard')}
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Generated Content Display */}
              <div className="relative">
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  placeholder={generatedContent ? '' : t('noContentGenerated')}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono text-sm"
                  readOnly={isGenerating}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{t('generatingCTAs')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* My Saved Hashtags */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
              <div className="flex items-center mb-4">
                <Hash className="w-5 h-5 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('mySavedHashtags')}
                </h2>
              </div>

              {/* Add New Hashtag */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyDown={handleHashtagKeyPress}
                  placeholder={t('hashtagPlaceholder')}
                  className="flex-1"
                />
                <Button
                  onClick={addHashtag}
                  disabled={!newHashtag.trim()}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t('addHashtag')}
                </Button>
              </div>

              {/* Feedback Messages */}
              {hashtagFeedback && (
                <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">{hashtagFeedback}</p>
                </div>
              )}

              {/* Error Display */}
              {savedHashtagsError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{savedHashtagsError}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoadingSavedHashtags ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600 mr-2" />
                  <span className="text-gray-600">Loading hashtags...</span>
                </div>
              ) : (
                /* Hashtags List */
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedHashtags.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      {t('noSavedHashtags')}
                    </p>
                  ) : (
                    savedHashtags.map((hashtag, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-mono text-sm">#{hashtag}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePasteHashtag(hashtag)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {t('pasteHashtag')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeHashtag(hashtag)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {t('removeHashtag')}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const CopyForgeStudio: React.FC = () => {
  return (
    <ProtectedRoute>
      <CopyForgeStudioContent />
    </ProtectedRoute>
  );
};

export default CopyForgeStudio;