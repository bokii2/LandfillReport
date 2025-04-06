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
      
      const response = await fetch(`${swrKeys.reports.replace('/reports', '/send-report')}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        // Don't set Content-Type header when sending FormData
      });
      
      if (!response.ok) {
        const error = new FetchError(`Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }
      
      return response.text();
    },
    
    // Update report status
    updateReportStatus: async (id: number | string, status: string) => {
      const formData = new FormData();
      formData.append('status', status);
      
      const response = await fetch(`${swrKeys.reports.replace('/reports', `/report/${id}/update-status`)}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = new FetchError(`Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        throw error;
      }
      
      return response.text();
    },
    
    // Get all locations
    getLocations: () => {
      return fetcher<Location[]>(swrKeys.locations);
    }
  };