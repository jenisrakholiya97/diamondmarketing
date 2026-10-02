/**
 * Utility to check whether the application is running on a local development environment (localhost / 127.0.0.1 / local LAN IP)
 * @returns {boolean} True if running on localhost / local development, false if on live / production site.
 */
export const isLocalhost = () => {
  if (typeof window === 'undefined') return true;
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname === '' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.')
  );
};
