export class FetchError extends Error {
  status?: number;
  info?: unknown;

  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export const fetcher = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const headers = new Headers(options?.headers || {});

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    headers.set("Authorization", authToken);
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
        return {} as T;
      }
    }

    const errorData = await response.json().catch(() => ({}));
    const error = new FetchError(
      errorData.message || `Error ${response.status}: ${response.statusText}`
    );
    error.status = response.status;
    error.info = errorData;
    throw error;
  }

  return response.json();
};