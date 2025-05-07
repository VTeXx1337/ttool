// API service for interacting with backend endpoints

// Base API path - using relative URL to avoid CORS issues
const API_BASE = "/api";

// API endpoints
const ENDPOINTS = {
  PROXY_ROTATE: `${API_BASE}/proxy/rotate`,
  LIVE_START: `${API_BASE}/live/start`,
  LIVE_STOP: `${API_BASE}/live/stop`,
};

// Error handling wrapper for fetch
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error occurred" }));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during API request");
  }
}

// API methods
export const api = {
  // Rotate proxies to avoid rate limits
  rotateProxy: async (): Promise<{
    success: boolean;
    currentProxy?: string;
  }> => {
    return fetchWithErrorHandling(ENDPOINTS.PROXY_ROTATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  // Start a TikTok live stream connection
  startLiveStream: async (
    username: string,
  ): Promise<{ success: boolean; sessionId?: string }> => {
    return fetchWithErrorHandling(ENDPOINTS.LIVE_START, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
  },

  // Stop a TikTok live stream connection
  stopLiveStream: async (sessionId: string): Promise<{ success: boolean }> => {
    return fetchWithErrorHandling(ENDPOINTS.LIVE_STOP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });
  },
};
