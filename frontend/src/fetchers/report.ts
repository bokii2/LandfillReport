import { fetcher, FetchError } from "./fetcher";
import { swrKeys } from "./swrKeys";

export const api = {
  getReports: (status?: string) => {
    const url = status
      ? `${swrKeys.reports}?status=${status}`
      : swrKeys.reports;
    return fetcher<Report[]>(url);
  },

  getReportById: (id: number | string) => {
    return fetcher<Report>(`${swrKeys.reports}/${id}`);
  },

  getImageUrl: (id: number | string) => {
    return `${swrKeys.images}/${id}`;
  },

  sendReport: async (data: {
    description: string;
    latitude: number;
    longitude: number;
    image: File;
  }) => {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    formData.append("image", data.image);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers = new Headers();

    if (token) {
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      headers.set("Authorization", authToken);
    }

    try {
      const response = await fetch(swrKeys.reports, {
        method: "POST",
        credentials: "include",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Error ${response.status}: ${response.statusText}`;

        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error("Error parsing JSON response:", e);
          }
        } else {
          try {
            const textContent = await response.text();
            console.error(
              "Non-JSON error response:",
              textContent.substring(0, 500) + "..."
            );
          } catch (e) {
            console.error("Error reading response text:", e);
          }
        }

        const error = new FetchError(errorMessage);
        error.status = response.status;
        throw error;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return { success: true, status: response.status };
      }
    } catch (error) {
      console.error("Error in sendReport:", error);
      throw error instanceof FetchError
        ? error
        : new FetchError(
            error instanceof Error ? error.message : String(error)
          );
    }
  },

  updateReportStatus: async (id: number | string, status: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers = new Headers();
    if (token) {
      const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      headers.set("Authorization", authToken);
    }

    const response = await fetch(
      `${swrKeys.reports}/${id}/status?status=${status}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      const error = new FetchError(
        `Error ${response.status}: ${errorText || response.statusText}`
      );
      error.status = response.status;
      throw error;
    }

    return true;
  },

  getLocations: () => {
    return fetcher<Location[]>(swrKeys.locations);
  },
};
