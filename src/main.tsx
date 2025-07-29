import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TamboProvider } from '@tambo-ai/react';
import { z } from 'zod';
import './i18n'; // Initialize i18n
import './index.css';

// Component schemas for Tambo integration
const tamboComponents = [
  {
    name: 'LinkShortener',
    description: 'URL shortening tool that creates short, trackable links using Kutt.it API. Users can create custom URLs, set passwords, expiration dates, and view analytics.',
    propsSchema: z.object({
      longUrl: z.string().optional().describe('The original long URL to be shortened'),
      customUrl: z.string().optional().describe('Custom short URL suffix'),
      password: z.string().optional().describe('Password protection for the link'),
      expireDate: z.string().optional().describe('Expiration date for the link'),
      description: z.string().optional().describe('Description of the shortened link'),
      shortenedResult: z.object({
        id: z.string(),
        link: z.string(),
        target: z.string()
      }).nullable().optional().describe('Result of the URL shortening operation'),
      userLinks: z.array(z.object({
        id: z.string(),
        link: z.string(),
        target: z.string(),
        visit_count: z.number(),
        created_at: z.string()
      })).optional().describe('List of user\'s shortened links'),
      isShortening: z.boolean().optional().describe('Whether a URL is currently being shortened'),
      isLoadingStats: z.boolean().optional().describe('Whether link statistics are being loaded'),
      isLoadingLinks: z.boolean().optional().describe('Whether user links are being loaded')
    }),
    actionsSchema: z.object({
      shortenUrl: z.function()
        .args(z.string(), z.string().optional(), z.string().optional(), z.string().optional(), z.string().optional())
        .returns(z.void())
        .describe('Shorten a URL with optional custom URL, password, expiration, and description'),
      getLinkStats: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Get statistics for a shortened link by ID'),
      deleteLink: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Delete a shortened link by ID'),
      copyToClipboard: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Copy a URL to the clipboard')
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
      savedCards: z.array(z.object({
        id: z.string(),
        title: z.string(),
        created_at: z.string()
      })).optional().describe('User\'s saved card designs')
    })
  }
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboProvider
      apiKey={import.meta.env.VITE_TAMBO_API_KEY || 'demo-key'}
      components={tamboComponents}
    >
      <App />
    </TamboProvider>
  </StrictMode>,
);