/**
 * React hooks for authentication
 * Placeholder implementation - will integrate with better-auth React SDK
 */

import type { AuthState } from './types';

export const useAuth = (): AuthState => {
  return {
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
  };
};

export const useSession = () => {
  return {
    session: null,
    isLoading: false,
  };
};

export const useUser = () => {
  return {
    user: null,
    isLoading: false,
  };
};


