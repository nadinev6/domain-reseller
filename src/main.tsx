import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TamboProvider } from '@tambo-ai/react';
import { z } from 'zod';
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
        timestamp: z.date(),
        suggestions: z.array(z.object({
          text: z.string(),
          action: z.string()
        })).optional()
      })).optional().describe('Chat message history'),
      isTyping: z.boolean().optional().describe('Whether the bot is currently typing a response')
    }),
    actionsSchema: z.object({
      sendMessage: z.function()
        .args(z.string())
        .returns(z.void())
        .describe('Send a message to the bot'),
      sendSuggestions: z.function()
        .args(z.string(), z.array(z.object({
          text: z.string(),
          action: z.string()
        })))
        .returns(z.void())
        .describe('Send a bot message with clickable suggestions'),
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
      <App />
    </TamboProvider>
  </StrictMode>,
);