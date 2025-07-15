@@ .. @@
-import { useState } from 'react';
+import React, { useState } from 'react';
 import { Zap, Copy, Check, Target, MessageSquare, User, Sparkles, TrendingUp } from 'lucide-react';
 import { Button } from '../components/ui/button';
 import { Input } from '../components/ui/input';
 import { Label } from '../components/ui/label';
-import {
-  Dialog,
-  DialogContent,
-  DialogDescription,
-  DialogHeader,
-  DialogTitle,
-} from '../ui/dialog';

 const TRANSLATIONS = {
   "en-US": {
-    "ctaScriptGenerator": "CTA Generator",
-    "transformIdeasDescription": "Transform your ideas into compelling CTAs and persuasive scripts that convert visitors into customers",
+    "ctaScriptGenerator": "CopyForge Studio",
+    "transformIdeasDescription": "AI-powered copywriting studio that transforms your ideas into compelling CTAs, persuasive scripts, and high-converting copy",
     "yourOfferGoals": "Your Offer & Goals",
     "offerPlaceholder": "Describe what you're selling or promoting... Your product, service, benefit, target action - just get your ideas down!",
     "tipKeyboardShortcut": "💡 Tip: Press Cmd/Ctrl + Enter to generate your CTAs",
@@ .. @@
   },
   "es-ES": {
-    "ctaScriptGenerator": "Generador de CTAs y Scripts",
-    "transformIdeasDescription": "Transforma tus ideas en CTAs convincentes y scripts persuasivos que convierten visitantes en clientes",
+    "ctaScriptGenerator": "CopyForge Studio",
+    "transformIdeasDescription": "Estudio de copywriting impulsado por IA que transforma tus ideas en CTAs convincentes, scripts persuasivos y copy de alta conversión",
     "yourOfferGoals": "Tu Oferta y Objetivos",
@@ .. @@
 const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
 const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

-export default function CTAGenerator() {
+const CopyForgeStudio: React.FC = () => {
   const [rawOffer, setRawOffer] = useState('');
@@ .. @@
       try {
-        const response = await window.claude.complete(prompt);
+        // Placeholder for AI integration - you can add your preferred AI service here
+        const response = await generateWithAI(prompt);
         setGeneratedContent(response.trim());
       } catch (error) {
         console.error('Error generating CTAs:', error);
@@ .. @@
     }
   };

+  // Placeholder function for AI integration
+  const generateWithAI = async (prompt: string): Promise<string> => {
+    // This is where you would integrate with your preferred AI service
+    // For now, returning a placeholder response
+    return `Generated copy will appear here once AI integration is added.\n\nPrompt received: ${prompt.substring(0, 100)}...`;
+  };
+
   const copyToClipboard = async () => {
@@ .. @@
   };

   return (
-    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
+    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
       {/* Header */}
       <div className="relative overflow-hidden">
@@ .. @@
         </div>
       </div>
-    </div>
+    </main>
   );
-}