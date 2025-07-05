import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TamboProvider } from '@tambo-ai/react';
import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react-client";
import { z } from 'zod';
import './index.css';

// Zod schemas for Tambo component integration
const DomainResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  available: z.boolean(),
  price: z.number(),
  tld: z.string()
});

const CardElementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'shape', 'button']),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional(),
  zIndex: z.number(),
  content: z.string().optional(),
  fontSize: z.number().optional(),
  fontWeight: z.string().optional(),
  color: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  fontFamily: z.string().optional(),
  isGradientText: z.boolean().optional(),
  gradientColor1: z.string().optional(),
  gradientColor2: z.string().optional(),
  gradientDirection: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
  backgroundColor: z.string().optional(),
  borderRadius: z.number().optional(),
  borderWidth: z.number().optional(),
  borderColor: z.string().optional(),
  buttonText: z.string().optional(),
  buttonColor: z.string().optional(),
  buttonTextColor: z.string().optional(),
  href: z.string().optional()
});

const CanvasSettingsSchema = z.object({
  width: z.number(),
  height: z.number(),
  backgroundColor: z.string()
});

// Component schemas for Tambo integration
const tamboComponents = [
  {
    name: 'DomainSearch',
    description: 'Component for searching domain names and displaying results. Users can enter domain names to check availability and pricing.',
    propsSchema: z.object({
      searchTerm: z.string().describe('Current search term entered by user'),
      isSearching: z.boolean().describe('Whether a search is currently in progress'),
      results: z.array(DomainResultSchema).optional().describe('Array of domain search results')
    }),
    actionsSchema: z.object({
      setSearchTerm: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Update the search term'),
      performSearch: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Perform a domain search with the given term')
    })
  },
  {
    name: 'CardStudioEditor',
    description: 'Advanced drag-and-drop editor for creating social media cards. Users can add text, images, shapes, and buttons with full customization.',
    propsSchema: z.object({
      elements: z.array(CardElementSchema).describe('Array of card elements (text, images, shapes, buttons)'),
      selectedElement: CardElementSchema.nullable().optional().describe('Currently selected element for editing'),
      multiSelectedElementIds: z.array(z.string()).optional().describe('Array of IDs for multi-selected elements'),
      canvasSettings: CanvasSettingsSchema.describe('Canvas configuration including size and background'),
      historyIndex: z.number().describe('Current position in undo/redo history'),
      isSaving: z.boolean().describe('Whether the card is currently being saved')
    }),
    actionsSchema: z.object({
      addElement: z.function()
        .args(z.enum(['text', 'image', 'shape', 'button']), z.number(), z.number())
        .returns(z.void())
        .describe('Add a new element to the canvas'),
      updateElement: z.function()
        .args(z.string(), z.record(z.any()))
        .returns(z.void())
        .describe('Update an existing element by ID'),
      deleteElement: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Delete an element by ID'),
      saveCard: z.function()
        .args()
        .returns(z.void())
        .describe('Save the current card design'),
      undo: z.function()
        .args()
        .returns(z.void())
        .describe('Undo the last action'),
      redo: z.function()
        .args()
        .returns(z.void())
        .describe('Redo the last undone action'),
      setCanvasSettings: z.function()
        .args(CanvasSettingsSchema)
        .returns(z.void())
        .describe('Update canvas settings')
    })
  },
  {
    name: 'Cart',
    description: 'Shopping cart component for managing domain purchases. Shows items, pricing, and checkout functionality.',
    propsSchema: z.object({
      items: z.array(DomainResultSchema).describe('Array of items in the shopping cart'),
      total: z.number().describe('Total price of all items in cart'),
      itemCount: z.number().describe('Number of items in cart'),
      isOpen: z.boolean().optional().describe('Whether the cart is currently open/visible')
    }),
    actionsSchema: z.object({
      addToCart: z.function()
        .args(DomainResultSchema)
        .returns(z.void())
        .describe('Add a domain to the cart'),
      removeFromCart: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Remove a domain from cart by ID'),
      clearCart: z.function()
        .args()
        .returns(z.void())
        .describe('Clear all items from cart')
    })
  },
  {
    name: 'Dashboard',
    description: 'User dashboard showing domain portfolio, saved cards, billing information, and account management.',
    propsSchema: z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        user_metadata: z.object({
          full_name: z.string().optional(),
          avatar_url: z.string().optional()
        }).optional()
      }).nullable().optional().describe('Current authenticated user'),
      domains: z.array(z.object({
        name: z.string(),
        status: z.enum(['active', 'pending', 'expired']),
        expiresAt: z.string()
      })).optional().describe('User\'s domain portfolio'),
      savedCards: z.array(z.object({
        id: z.string(),
        title: z.string(),
        created_at: z.string()
      })).optional().describe('User\'s saved card designs')
    })
  },
  {
    name: 'BotInterface',
    description: 'AI assistant chat interface for helping users with domain searches, card creation, and general questions.',
    propsSchema: z.object({
      isCollapsed: z.boolean().describe('Whether the bot interface is minimized'),
      messages: z.array(z.object({
        id: z.string(),
        type: z.enum(['user', 'bot']),
        content: z.string(),
        timestamp: z.date()
      })).optional().describe('Chat message history'),
      isTyping: z.boolean().optional().describe('Whether the bot is currently typing a response')
    }),
    actionsSchema: z.object({
      sendMessage: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Send a message to the bot'),
      onToggleCollapse: z.function()
        .args()
        .returns(z.void())
        .describe('Toggle the bot interface collapsed state')
    })
  }
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboProvider
      apiKey={import.meta.env.VITE_TAMBO_API_KEY || 'demo-key'}
      components={tamboComponents}
    >
      <LingoProviderWrapper loadDictionary={(locale) => loadDictionary(locale)}>
        <App />
      </LingoProviderWrapper>
    </TamboProvider>
  </StrictMode>,
);