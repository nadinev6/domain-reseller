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
    description: 'Component for searching domain names',
    props: {
      searchTerm: { type: 'string', description: 'Current search term' },
      results: { type: 'array', description: 'Search results' }
    }
  },
  {
    name: 'CardStudioEditor',
    description: 'Component for editing social media cards',
    props: {
      elements: { type: 'array', description: 'Card elements' },
      canvasSettings: { type: 'object', description: 'Canvas configuration' },
      selectedElement: { type: 'object', description: 'Currently selected element' }
    }
  },
  {
    name: 'Cart',
    description: 'Shopping cart component',
    props: {
      items: { type: 'array', description: 'Cart items' },
      total: { type: 'number', description: 'Total price' }
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