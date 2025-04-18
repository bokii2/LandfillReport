import { fetcher, FetchError } from "./fetcher";
import { swrKeys } from "./swrKeys";

export const api = {

    // Get all reports or filter by status
    getReports: (status?: string) => {
      const url = status ? `${swrKeys.reports}?status=${status}` : swrKeys.reports;
      return fetcher<Report[]>(url);
    },
    
    // Get single report by ID
    getReportById: (id: number | string) => {
      return fetcher<Report>(`${swrKeys.reports}/${id}`);
    },
    
    // Get image by ID
    getImageUrl: (id: number | string) => {
      return `${swrKeys.images}/${id}`;
    },
    
    // Send a new report
    // Updated sendReport function with better error handling

  sendReport: async (data: {
    description: string,
    latitude: number,
    longitude: number,
    image: File
  }) => {
    const formData = new FormData();
    formData.append('description', data.description);
    formData.append('latitude', data.latitude.toString());
    formData.append('longitude', data.longitude.toString());
    formData.append('image', data.image);
    
    // Get the authentication token
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    // Create headers with authentication
    const headers = new Headers();
    
    // Add Authorization header if token exists
    if (token) {
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers.set('Authorization', authToken);
    }
    
    try {
      const response = await fetch(swrKeys.reports, {
        method: 'POST',
        credentials: 'include', // Include cookies for session-based auth
        headers,  // Add the headers
        body: formData,
      });
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        // Only try to parse as JSON if the content type is JSON
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing JSON response:', e);
          }
        } else {
          // If not JSON, get text content for debugging
          try {
            const textContent = await response.text();
            console.error('Non-JSON error response:', textContent.substring(0, 500) + '...');
          } catch (e) {
            console.error('Error reading response text:', e);
          }
        }
        
        const error = new FetchError(errorMessage);
        error.status = response.status;
        throw error;
      }
      
      // Only try to parse as JSON if we expect JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // For non-JSON responses (like success with no content)
        return { success: true, status: response.status };
      }
    } catch (error) {
      console.error('Error in sendReport:', error);
      throw error instanceof FetchError ? error : new FetchError(error instanceof Error ? error.message : String(error));
    }
  },
    
    // Update report status
    updateReportStatus: async (id: number | string, status: string) => {
      const response = await fetch(`${swrKeys.reports}/${id}/status?status=${status}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = new FetchError(`Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }
      
      return response.ok;
    },
    
    // Get all locations
    getLocations: () => {
      return fetcher<Location[]>(swrKeys.locations);
    }
  };