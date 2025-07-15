// Kutt.it API utility functions
// Documentation: https://docs.kutt.it/

const KUTT_API_BASE = 'https://kutt.it/api/v2';

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_KUTT_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_KUTT_API_KEY is not configured. Please add it to your .env file.');
  }
  return apiKey;
};

// Create headers for API requests
const createHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'X-API-KEY': getApiKey(),
});

/**
 * Shorten a URL using Kutt.it API
 * @param target - The original long URL to shorten
 * @param customUrl - Optional custom short URL (domain part will be kutt.it)
 * @param password - Optional password protection
 * @param expire - Optional expiration date (ISO string)
 * @param description - Optional description for the link
 * @returns Promise with the shortened URL data
 */
export const shortenUrl = async (
  target: string,
  customUrl?: string,
  password?: string,
  expire?: string,
  description?: string
): Promise<KuttShortenResponse> => {
  try {
    // Validate URL format
    new URL(target);
  } catch {
    throw new Error('Please enter a valid URL (including http:// or https://)');
  }

  const body: any = { target };
  
  if (customUrl) body.customurl = customUrl;
  if (password) body.password = password;
  if (expire) body.expire = expire;
  if (description) body.description = description;

  try {
    const response = await fetch(`${KUTT_API_BASE}/links`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific Kutt.it error messages
      if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid request. Please check your input.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 409) {
        throw new Error('Custom URL already exists. Please choose a different one.');
      } else {
        throw new Error(`Failed to shorten URL: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Get statistics for a shortened URL
 * @param id - The ID of the shortened URL (from Kutt.it response)
 * @returns Promise with the link statistics
 */
export const getLinkStats = async (id: string): Promise<KuttStatsResponse> => {
  if (!id) {
    throw new Error('Link ID is required to get statistics');
  }

  try {
    const response = await fetch(`${KUTT_API_BASE}/links/${id}/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Link not found. Please check the URL.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`Failed to get statistics: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Get all user's shortened links
 * @param limit - Number of links to retrieve (default: 10)
 * @param skip - Number of links to skip for pagination (default: 0)
 * @returns Promise with the list of user's links
 */
export const getUserLinks = async (limit: number = 10, skip: number = 0): Promise<KuttUserLinksResponse> => {
  try {
    const response = await fetch(`${KUTT_API_BASE}/links?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`Failed to get links: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Delete a shortened URL
 * @param id - The ID of the shortened URL to delete
 * @returns Promise that resolves when the link is deleted
 */
export const deleteLink = async (id: string): Promise<void> => {
  if (!id) {
    throw new Error('Link ID is required to delete a link');
  }

  try {
    const response = await fetch(`${KUTT_API_BASE}/links/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Link not found.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`Failed to delete link: ${response.status} ${response.statusText}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// Import the types (they will be defined in types.ts)
import type { KuttShortenResponse, KuttStatsResponse, KuttUserLinksResponse } from '../types';