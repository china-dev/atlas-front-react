import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, speed: 300, minimum: 0.08 })

let activeRequests = 0

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  // SECURITY: Token stored in localStorage is readable by any JS on this page (XSS risk).
  // Migration to HttpOnly cookie requires coordinated backend changes — deferred.
  const token = localStorage.getItem('atlas-token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`

  if (activeRequests === 0) NProgress.start()
  activeRequests++

  return config
})

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1)
    if (activeRequests === 0) NProgress.done()
    return response
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1)
    if (activeRequests === 0) NProgress.done()

    if (error.response?.status === 401) {
      localStorage.removeItem('atlas-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
