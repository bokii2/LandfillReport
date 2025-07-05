export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('authToken');
    
    const headersInit: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };
    
    if (token) {
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
    
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    return response;
  };