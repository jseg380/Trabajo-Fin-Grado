export const BACKEND_URL = new URL('http://192.168.1.110:5000');
export const API_URL = new URL('/api/', BACKEND_URL);
// Trailing slash is important for URL construction, otherwise it will replace
// the last segment of the path when appending new paths.

// Development and production API URL can be set based on an environment var.
// export const API_URL =
//   process.env.NODE_ENV === 'development'
//     ? 'http://192.168.1.34:3000'
//     : 'https://your-api.com';
