import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  // SECURITY: Token stored in localStorage is readable by any JS on this page (XSS risk).
  // Migration to HttpOnly cookie requires coordinated backend changes — deferred.
  // See .memory/plan/2026-04-08-fix-blockers-analise.md (B7).
  const token = localStorage.getItem('atlas-token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('atlas-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
