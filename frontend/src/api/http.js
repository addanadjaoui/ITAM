// VERSION ALPHA
// src/api/http.js
const API_BASE_URL = "http://192.168.56.110:8000/api";
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  try {
    const res = await fetch(url, defaultOptions);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || res.statusText);
    }
    return res.json();
  } catch (err) {
    console.error("API Fetch Error:", err);
    throw err;
  }
}

