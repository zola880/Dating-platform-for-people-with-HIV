// Configuration for API and asset URLs
const defaultApiHost = process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '';
const defaultSocketHost = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001'
  : typeof window !== 'undefined'
    ? window.location.origin
    : '';

const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || defaultApiHost,
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || defaultSocketHost,
  getUploadUrl: (path) => {
    const base = config.API_BASE_URL || '';
    return `${base}/uploads/${path}`;
  },
  getApiUrl: (endpoint) => {
    const base = config.API_BASE_URL || '';
    return `${base}/api${endpoint}`;
  },
};

export default config;