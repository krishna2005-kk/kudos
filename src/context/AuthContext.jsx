import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function applyAuth(data) {
    localStorage.setItem('kudos_access_token', data.accessToken)
    setUser(data.user)
    return data.user
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return applyAuth(response.data.data)
  }

  async function signup(values) {
    const response = await api.post('/auth/signup', values)
    return applyAuth(response.data.data)
  }

  async function loginWithGoogle(credential) {
    const response = await api.post('/auth/google', { credential })
    return applyAuth(response.data.data)
  }

  async function logout() {
    try { await api.post('/auth/logout') } finally {
      localStorage.removeItem('kudos_access_token')
      setUser(null)
    }
  }

  async function refreshUser() {
    const response = await api.get('/users/me')
    setUser(response.data.data.user)
    return response.data.data.user
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = localStorage.getItem('kudos_access_token')
        if (!token) {
          const refreshed = await api.post('/auth/refresh-token')
          await applyAuth(refreshed.data.data)
        } else {
          await refreshUser()
        }
      } catch {
        localStorage.removeItem('kudos_access_token')
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  return <AuthContext.Provider value={{ user, setUser, loading, login, signup, loginWithGoogle, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
