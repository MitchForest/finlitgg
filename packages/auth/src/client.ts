/**
 * better-auth client configuration
 */

export interface AuthClient {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<unknown>;
}

// Placeholder - will be implemented with actual better-auth
export const createAuthClient = (baseUrl: string): AuthClient => {
  console.log('Auth client base URL:', baseUrl);
  return {
    signIn: async () => {
      throw new Error('Auth client not implemented yet');
    },
    signUp: async () => {
      throw new Error('Auth client not implemented yet');
    },
    signOut: async () => {
      throw new Error('Auth client not implemented yet');
    },
    getSession: async () => {
      throw new Error('Auth client not implemented yet');
    },
  };
};
