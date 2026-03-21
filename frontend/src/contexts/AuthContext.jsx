import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, loginWithGoogle, getMe } from '../api'

const AuthContext = createContext(null)

const hasStoredToken = () => Boolean(localStorage.getItem('auth_token'))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(hasStoredToken)

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password })
    localStorage.setItem('auth_token', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const loginGoogle = useCallback(async (googleToken) => {
    const res = await loginWithGoogle({ token: googleToken })
    localStorage.setItem('auth_token', res.data.access_token)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }, [])

  const isAdmin = user?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
