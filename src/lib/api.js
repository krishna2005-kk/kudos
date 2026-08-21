import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kudos_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function getApiError(error) {
  const details = error.response?.data?.errors
  if (details && Array.isArray(details)) return details.map((item) => item.message).join(', ')
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

export default api
