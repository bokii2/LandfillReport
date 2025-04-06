export class FetchError extends Error {
    status?: number;
    info?: unknown;
  
    constructor(message: string) {
      super(message);
      this.name = 'FetchError';
    }
}

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Get the authentication token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  // Create headers with proper typing
  const headers = new Headers(options?.headers || {});
  
  // Set default content type
  if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
  }

  // Add Authorization header if token exists
  if (token) {
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers.set('Authorization', authToken);
  }
  
  const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers
  });
  
  if (!response.ok) {
      // Handle unauthorized responses by redirecting to login
      if (response.status === 401 && typeof window !== 'undefined') {
          // Redirect to login page if not already there
          if (window.location.pathname !== '/login') {
              window.location.href = '/login';
              return {} as T; // Return empty object to avoid errors
          }
      }
      
      const errorData = await response.json().catch(() => ({}));
      const error = new FetchError(errorData.message || `Error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.info = errorData;
      throw error;
  }
  
  return response.json();
};