export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    
    // Use the HeadersInit type
    const headersInit: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    
    if (token) {
      // Create a Headers object for type safety
      const headers = new Headers(headersInit);
      headers.set('Authorization', `Bearer ${token}`);
      
      options = {
        ...options,
        headers
      };
    } else {
      options = {
        ...options,
        headers: headersInit
      };
    }
    
    const response = await fetch(url, options);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    return response;
  };