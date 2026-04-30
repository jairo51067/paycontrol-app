import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = authService.getSession()
    setUser(session)
    setLoading(false)
  }, [])

  const register = useCallback((data) => {
    const result = authService.register(data)
    if (result.success) {
      const loginResult = authService.login({ email: data.email, password: data.password })
      if (loginResult.success) {
        setUser(loginResult.user)
      }
    }
    return result
  }, [])

  const login = useCallback((credentials) => {
    const result = authService.login(credentials)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const hasAdmin = authService.hasAdmin()

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
    hasAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

