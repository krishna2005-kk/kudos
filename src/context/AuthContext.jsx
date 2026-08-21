import { useEffect, useState } from 'react'
import api from '../lib/api'
import AuthContext from './authContextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  function getUserFromResponse(response) {
    return response.data.data.user
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const loggedInUser = getUserFromResponse(response)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function signup(values) {
    const response = await api.post('/auth/signup', values)
    const signedUpUser = getUserFromResponse(response)
    setUser(signedUpUser)
    return signedUpUser
  }

  async function loginWithGoogle(credential) {
    const response = await api.post('/auth/google', { credential })
    const loggedInUser = getUserFromResponse(response)
    setUser(loggedInUser)
    return loggedInUser
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }

  async function refreshUser() {
    const response = await api.get('/users/me')
    const refreshedUser = getUserFromResponse(response)
    setUser(refreshedUser)
    return refreshedUser
  }

  useEffect(() => {
    async function restoreUser() {
      try {
        await refreshUser()
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
