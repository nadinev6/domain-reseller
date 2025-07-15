import { useState } from 'react';
import { Zap, Copy, Check, Target, MessageSquare, User, Sparkles, TrendingUp } from 'lucide-react';

import React, { useState } from 'react';
import { Zap, Copy, Check, Target, MessageSquare, User, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const TRANSLATIONS = {
  "en-US": {
    "ctaScriptGenerator": "CTA & Script Generator",
    "transformIdeasDescription": "Transform your ideas into compelling CTAs and persuasive scripts that convert visitors into customers",
    "yourOfferGoals": "Your Offer & Goals",
    "offerPlaceholder": "Describe what you're selling or promoting... Your product, service, benefit, target action - just get your ideas down!",
    "tipKeyboardShortcut": "💡 Tip: Press Cmd/Ctrl + Enter to generate your CTAs",
    "ctaStyle": "CTA Style",
    "urgentStyle": "Urgent",
    "urgentDescription": "Creates immediate action",
    "benefitStyle": "Benefit-Focused",
    "benefitDescription": "Highlights value proposition",
    "socialProofStyle": "Social Proof",
    "socialProofDescription": "Leverages trust signals",
    "curiosityStyle": "Curiosity-Driven",
    "curiosityDescription": "Sparks interest and intrigue",
    "exclusiveStyle": "Exclusive",
    "exclusiveDescription": "Creates FOMO and scarcity",
    "directStyle": "Direct",
    "directDescription": "Clear and straightforward",
    "targetAudience": "Target Audience (Optional)",
    "hide": "Hide",
    "show": "Show",
    "audienceDescription": "Describe your ideal customer for more targeted messaging",
    "audiencePlaceholder": "Who are you targeting? (age, pain points, desires, etc.)",
    "craftingCtas": "Crafting your CTAs...",
    "generateCtas": "Generate CTAs & Scripts",
    "generatedContent": "Generated Content",
    "copied": "Copied!",
    "copy": "Copy",
    "contentWillAppearHere": "Your CTAs and scripts will appear here",
    "getStartedPrompt": "Enter your offer details and select a style to get started",
    "proTips": "✨ Pro Tips",
    "tipBeSpecific": "• Be specific about the action you want users to take",
    "tipIncludeBenefits": "• Include key benefits and value propositions",
    "tipTryStyles": "• Try different styles to see what resonates",
    "tipTestVariations": "• Test multiple variations to optimize conversion",
    "headlines": "Headlines",
    "subheadings": "Subheadings", 
    "buttons": "Button Text",
    "scripts": "Persuasive Scripts",
    "microcopy": "Microcopy"
  },
  "es-ES": {
    "ctaScriptGenerator": "Generador de CTAs y Scripts",
    "transformIdeasDescription": "Transforma tus ideas en CTAs convincentes y scripts persuasivos que convierten visitantes en clientes",
    "yourOfferGoals": "Tu Oferta y Objetivos",
    "offerPlaceholder": "Describe lo que estás vendiendo o promocionando... Tu producto, servicio, beneficio, acción objetivo - ¡solo plasma tus ideas!",
    "tipKeyboardShortcut": "💡 Consejo: Presiona Cmd/Ctrl + Enter para generar tus CTAs",
    "ctaStyle": "Estilo de CTA",
    "urgentStyle": "Urgente",
    "urgentDescription": "Crea acción inmediata",
    "benefitStyle": "Enfocado en Beneficios",
    "benefitDescription": "Destaca propuesta de valor",
    "socialProofStyle": "Prueba Social",
    "socialProofDescription": "Aprovecha señales de confianza",
    "curiosityStyle": "Impulsado por Curiosidad",
    "curiosityDescription": "Despierta interés e intriga",
    "exclusiveStyle": "Exclusivo",
    "exclusiveDescription": "Crea FOMO y escasez",
    "directStyle": "Directo",
    "directDescription": "Claro y directo",
    "targetAudience": "Audiencia Objetivo (Opcional)",
    "hide": "Ocultar",
    "show": "Mostrar",
    "audienceDescription": "Describe tu cliente ideal para mensajes más dirigidos",
    "audiencePlaceholder": "¿A quién te diriges? (edad, puntos de dolor, deseos, etc.)",
    "craftingCtas": "Creando tus CTAs...",
    "generateCtas": "Generar CTAs y Scripts",
    "generatedContent": "Contenido Generado",
    "copied": "¡Copiado!",
    "copy": "Copiar",
    "contentWillAppearHere": "Tus CTAs y scripts aparecerán aquí",
    "getStartedPrompt": "Ingresa los detalles de tu oferta y selecciona un estilo para comenzar",
    "proTips": "✨ Consejos Pro",
    "tipBeSpecific": "• Sé específico sobre la acción que quieres que tomen los usuarios",
    "tipIncludeBenefits": "• Incluye beneficios clave y propuestas de valor",
    "tipTryStyles": "• Prueba diferentes estilos para ver qué resuena",
    "tipTestVariations": "• Prueba múltiples variaciones para optimizar conversión",
    "headlines": "Titulares",
    "subheadings": "Subtítulos",
    "buttons": "Texto de Botones",
    "scripts": "Scripts Persuasivos",
    "microcopy": "Microtexto"
  }
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

export default function CTAGenerator() {
  const [rawOffer, setRawOffer] = useState('');
  const [ctaStyle, setCTAStyle] = useState('urgent');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAudience, setShowAudience] = useState(false);

  const styles = [
    { value: 'urgent', label: t('urgentStyle'), description: t('urgentDescription') },
    { value: 'benefit', label: t('benefitStyle'), description: t('benefitDescription') },
    { value: 'social', label: t('socialProofStyle'), description: t('socialProofDescription') },
    { value: 'curiosity', label: t('curiosityStyle'), description: t('curiosityDescription') },
    { value: 'exclusive', label: t('exclusiveStyle'), description: t('exclusiveDescription') },
    { value: 'direct', label: t('directStyle'), description: t('directDescription') }
  ];

  const generateCTAs = async () => {
    if (!rawOffer.trim()) return;

    setIsLoading(true);
    try {
      const audiencePart = targetAudience.trim() 
        ? `\n\nTarget Audience: ${targetAudience}\n\n`
        : '';

      const prompt = `You are an expert copywriter specializing in high-converting CTAs and persuasive scripts for landing pages. Generate compelling copy using a ${ctaStyle} style.

Offer/Product: "${rawOffer}"${audiencePart}

Create the following sections:

1. HEADLINES (5 variations)
   - Powerful, attention-grabbing headlines
   - Each should be 5-12 words
   - Focus on main benefit or hook

2. SUBHEADINGS (5 variations)
   - Support the headline with more detail
   - Each should be 8-20 words
   - Clarify the value proposition

3. BUTTON TEXT (8 variations)
   - Action-oriented button copy
   - Each should be 1-4 words
   - Create urgency and desire

4. PERSUASIVE SCRIPTS (3 variations)
   - Short persuasive paragraphs (50-100 words each)
   - Use ${ctaStyle} psychology
   - Include emotional triggers and benefits

5. MICROCOPY (5 variations)
   - Small supporting text elements
   - Each should be 3-8 words
   - Use for form fields, disclaimers, trust signals

Style: ${ctaStyle}
- Use ${ctaStyle} psychology throughout
- Make it conversion-focused
- Include power words and emotional triggers
- Ensure all copy is benefit-driven

Format as clean sections with bullet points for easy copying.

Please respond in ${locale} language.`;

      const response = await window.claude.complete(prompt);
      setGeneratedContent(response.trim());
    } catch (error) {
      console.error('Error generating CTAs:', error);
      setGeneratedContent('Sorry, there was an error generating your CTAs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateCTAs();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-6 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              {t('ctaScriptGenerator')}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('transformIdeasDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">{t('yourOfferGoals')}</h2>
              </div>
              
              <textarea
                value={rawOffer}
                onChange={(e) => setRawOffer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('offerPlaceholder')}
                className="w-full h-40 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-700 placeholder-slate-400"
              />
              
              <div className="mt-4 text-sm text-slate-500">
                {t('tipKeyboardShortcut')}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">{t('ctaStyle')}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {styles.map((styleOption) => (
                  <button
                    key={styleOption.value}
                    onClick={() => setCTAStyle(styleOption.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      ctaStyle === styleOption.value
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/70'
                    }`}
                  >
                    <div className="font-medium text-slate-800">{styleOption.label}</div>
                    <div className="text-sm text-slate-600 mt-1">{styleOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">{t('targetAudience')}</h2>
                </div>
                <button
                  onClick={() => setShowAudience(!showAudience)}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  {showAudience ? t('hide') : t('show')}
                </button>
              </div>
              
              {showAudience && (
                <>
                  <p className="text-slate-600 mb-4">
                    {t('audienceDescription')}
                  </p>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder={t('audiencePlaceholder')}
                    className="w-full h-32 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-slate-700 placeholder-slate-400"
                  />
                </>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCTAs}
              disabled={isLoading || !rawOffer.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('craftingCtas')}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {t('generateCtas')}
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 min-h-96">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">{t('generatedContent')}</h2>
                </div>
                
                {generatedContent && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('copy')}
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {generatedContent ? (
                <div className="bg-white/80 rounded-xl p-6 border border-slate-200 max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {generatedContent}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Target className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">{t('contentWillAppearHere')}</p>
                  <p className="text-sm mt-2">{t('getStartedPrompt')}</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-semibold text-slate-800 mb-3">{t('proTips')}</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>{t('tipBeSpecific')}</li>
                <li>{t('tipIncludeBenefits')}</li>
                <li>{t('tipTryStyles')}</li>
                <li>{t('tipTestVariations')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}