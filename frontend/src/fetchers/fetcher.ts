export class FetchError extends Error {
    status?: number;
    info?: unknown;
  
    constructor(message: string) {
      super(message);
      this.name = 'FetchError';
    }
}

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new FetchError(errorData.message || `Error ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.info = errorData;
      throw error;
    }
    
    return response.json();
};  