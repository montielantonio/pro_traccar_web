/**
 * Safely constructs a URL from a relative path and optional base URL.
 * Falls back to window.location.origin if base URL is not provided or invalid.
 * 
 * @param {string} path - Relative path (e.g., "/api/positions")
 * @param {string|null|undefined} baseUrl - Base URL (optional)
 * @returns {string} - Absolute URL
 */
export const buildApiUrl = (path, baseUrl = null) => {
  // If path is already absolute, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Use provided baseUrl if valid, otherwise use window.location.origin
  let base = baseUrl;
  
  if (!base || base === '' || base === 'undefined') {
    base = window.location.origin;
  }
  
  // Ensure base URL is valid
  try {
    new URL(base);
  } catch {
    // If base URL is invalid, use window.location.origin
    base = window.location.origin;
  }
  
  // Construct and return the full URL
  try {
    return new URL(path, base).href;
  } catch (error) {
    // Fallback: simple concatenation if URL constructor fails
    const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;
    const pathClean = path.startsWith('/') ? path : `/${path}`;
    return `${baseClean}${pathClean}`;
  }
};

/**
 * Gets the server URL from Redux state or falls back to window.location.origin
 * 
 * @param {object} serverState - Server state from Redux (state.session.server)
 * @returns {string} - Server URL
 */
export const getServerUrl = (serverState) => {
  if (serverState?.url) {
    return serverState.url;
  }
  return window.location.origin;
};
