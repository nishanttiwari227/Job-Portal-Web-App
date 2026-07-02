import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach Authorization header from localStorage when available.
// If no access token is present but a refresh cookie exists, try to obtain a new access token.
let isRefreshing = false;
const pendingRefreshPromises = [];

const runPendingRefreshPromises = (err) => {
  pendingRefreshPromises.forEach((p) => (err ? p.reject(err) : p.resolve()));
  pendingRefreshPromises.length = 0;
};

apiClient.interceptors.request.use(async (config) => {
  // don't attempt refresh for auth endpoints to avoid loops
  const skipRefresh = config.url && config.url.includes('/auth/refresh-token');

  const authDataRaw = typeof window !== 'undefined' ? window.localStorage.getItem('jobPortalUser') : null;
  const authData = authDataRaw ? JSON.parse(authDataRaw) : null;

  if (authData?.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authData.accessToken}`,
    };
    return config;
  }

  if (skipRefresh) {
    return config;
  }

  // Try to refresh access token only if a refresh cookie exists
  const hasRefreshCookie = typeof document !== 'undefined' && document.cookie.includes('refreshToken=');

  if (!hasRefreshCookie) {
    return config;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const resp = await apiClient.post('/auth/refresh-token');
      const newAccessToken = resp?.data?.data?.accessToken;
      const newUser = resp?.data?.data?.user || null;

      if (newAccessToken) {
        // merge and store
        const storeObj = newUser ? { ...newUser, accessToken: newAccessToken } : { accessToken: newAccessToken };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('jobPortalUser', JSON.stringify(storeObj));
        }
      }

      runPendingRefreshPromises();
    } catch (err) {
      runPendingRefreshPromises(err);
    } finally {
      isRefreshing = false;
    }
  } else {
    // wait for the refresher to finish
    await new Promise((resolve, reject) => pendingRefreshPromises.push({ resolve, reject }));
  }

  // after refresh attempt, attach token if available
  const recheck = typeof window !== 'undefined' ? window.localStorage.getItem('jobPortalUser') : null;
  const parsed = recheck ? JSON.parse(recheck) : null;
  if (parsed?.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${parsed.accessToken}`,
    };
  }

  return config;
});

export default apiClient;