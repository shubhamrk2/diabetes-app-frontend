// src/lib/utils.js

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('accessToken');

  if (isTokenExpired(token)) {
    const refreshResponse = await fetch('/api/token/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      token = data.accessToken;
      localStorage.setItem('accessToken', token);
    } else {
      throw new Error('Session expired, please log in again.');
    }
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, options);
}

// You should also define or import `isTokenExpired`
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
