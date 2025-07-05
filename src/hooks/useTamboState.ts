import { useEffect } from 'react';
import { useTambo } from '@tambo-ai/react';

interface UseTamboStateOptions {
  componentName: string;
  state: Record<string, any>;
  actions?: Record<string, Function>;
}

export const useTamboState = ({ componentName, state, actions = {} }: UseTamboStateOptions) => {
  const tambo = useTambo();

  useEffect(() => {
    if (tambo) {
      // Register component state with Tambo
      tambo.registerState(componentName, {
        state,
        actions,
        timestamp: Date.now()
      });
    }
  }, [tambo, componentName, state, actions]);

  return tambo;
};