/**
 * Safely constructs a URL for fetch requests.
 * Handles relative paths and ensures valid URLs.
 */
const safeUrl = (input) => {
  // If input is already a full URL, return it
  if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
    return input;
  }
  
  // For relative paths, use window.location.origin as base
  if (typeof input === 'string' && input.startsWith('/')) {
    try {
      return new URL(input, window.location.origin).href;
    } catch {
      // Fallback if URL constructor fails
      return `${window.location.origin}${input}`;
    }
  }
  
  // Return as-is for other cases (Request objects, etc.)
  return input;
};

export default async (input, init) => {
  const url = safeUrl(input);
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};
