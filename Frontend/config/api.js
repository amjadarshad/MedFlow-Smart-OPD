export const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";
