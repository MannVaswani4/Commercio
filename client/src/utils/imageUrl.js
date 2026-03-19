/**
 * Returns the full URL for a product image.
 * In production, relative paths like /images/airpods.jpg are served by
 * the Railway backend, not Vercel — so we prefix VITE_SERVER_URL.
 * In development, the Vite proxy handles /images → localhost:5001.
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute
  const serverUrl = import.meta.env.VITE_SERVER_URL || '';
  return `${serverUrl}${path}`;
};
