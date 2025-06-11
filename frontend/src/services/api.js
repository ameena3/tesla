const API_BASE_URL = '/api'; // Nginx will proxy this

async function request(endpoint, options = {}) {
  // Ensure the endpoint starts with a slash if it's not already part of API_BASE_URL construction
  // Or ensure endpoint is like '/stats' or '/dev/stats'
  const url = `${API_BASE_URL}${endpoint}`; // e.g. /api/stats or /api/dev/stats
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") { // No Content
        return null;
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error; // Re-throw to be caught by the component
  }
}

export const getStats = async (isDevMode, apiKey) => {
  const endpoint = isDevMode ? '/dev/stats' : '/stats';
  const headers = !isDevMode && apiKey ? { 'X-API-KEY': apiKey } : {};
  return request(endpoint, { headers });
};

export const lockVehicle = async (isDevMode, apiKey) => {
  const endpoint = isDevMode ? '/dev/lock' : '/lock';
  const headers = !isDevMode && apiKey ? { 'X-API-KEY': apiKey } : {};
  return request(endpoint, { method: 'POST', headers });
};

export const unlockVehicle = async (isDevMode, apiKey) => {
  const endpoint = isDevMode ? '/dev/unlock' : '/unlock';
  const headers = !isDevMode && apiKey ? { 'X-API-KEY': apiKey } : {};
  return request(endpoint, { method: 'POST', headers });
};

export const getCameraFeed = async (isDevMode, apiKey) => {
  const endpoint = isDevMode ? '/dev/camera' : '/camera';
  const headers = !isDevMode && apiKey ? { 'X-API-KEY': apiKey } : {};
  return request(endpoint, { headers });
};
