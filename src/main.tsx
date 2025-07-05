import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TamboProvider } from '@tambo-ai/react';
import { LingoProviderWrapper, loadDictionary } from "lingo.dev/react-client";
import './index.css';

// Component schemas for Tambo integration
const tamboComponents = [
  {
    name: 'DomainSearch',
    description: 'Component for searching domain names and displaying results',
    props: {
      type: 'object',
      properties: {
        searchTerm: { 
          type: 'string', 
          description: 'Current search term entered by user' 
        },
        isSearching: { 
          type: 'boolean', 
          description: 'Whether a search is currently in progress' 
        },
        results: { 
          type: 'array', 
          description: 'Array of domain search results',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              available: { type: 'boolean' },
              price: { type: 'number' },
              tld: { type: 'string' }
            }
          }
        }
      }
    }
  },
  {
    name: 'CardStudioEditor',
    description: 'Component for editing social media cards with drag-and-drop functionality',
    props: {
      type: 'object',
      properties: {
        elements: { 
          type: 'array', 
          description: 'Array of card elements (text, images, shapes, buttons)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string', enum: ['text', 'image', 'shape', 'button'] },
              x: { type: 'number' },
              y: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' },
              content: { type: 'string' },
              color: { type: 'string' },
              fontSize: { type: 'number' }
            }
          }
        },
        selectedElement: { 
          type: 'object', 
          description: 'Currently selected element for editing',
          nullable: true
        },
        canvasSettings: { 
          type: 'object', 
          description: 'Canvas configuration including size and background',
          properties: {
            width: { type: 'number' },
            height: { type: 'number' },
            backgroundColor: { type: 'string' }
          }
        },
        historyIndex: { 
          type: 'number', 
          description: 'Current position in undo/redo history' 
        },
        isSaving: { 
          type: 'boolean', 
          description: 'Whether the card is currently being saved' 
        }
      }
    }
  },
  {
    name: 'Cart',
    description: 'Shopping cart component for managing domain purchases',
    props: {
      type: 'object',
      properties: {
        items: { 
          type: 'array', 
          description: 'Array of items in the shopping cart',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              price: { type: 'number' },
              available: { type: 'boolean' }
            }
          }
        },
        total: { 
          type: 'number', 
          description: 'Total price of all items in cart' 
        },
        itemCount: { 
          type: 'number', 
          description: 'Number of items in cart' 
        }
      }
    }
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