import { useEffect } from 'react';
import { useTambo } from '@tambo-ai/react';
import { z } from 'zod';

interface UseTamboStateOptions {
  componentName: string;
  state: Record<string, any>;
  actions?: Record<string, Function>;
  schema?: z.ZodSchema;
}

export const useTamboState = ({ componentName, state, actions = {}, schema }: UseTamboStateOptions) => {
  const tambo = useTambo();

  useEffect(() => {
    if (tambo) {
      // Validate state against schema if provided
      if (schema) {
        try {
          schema.parse(state);
        } catch (error) {
          console.warn(`Tambo state validation failed for ${componentName}:`, error);
        }
      }
      
      // Register component state with Tambo
      tambo.registerState(componentName, {
        state,
        actions,
        timestamp: Date.now(),
        validated: !!schema
      });
    }
  }, [tambo, componentName, state, actions, schema]);

  return tambo;
};