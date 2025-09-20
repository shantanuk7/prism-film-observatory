import { createContext, useContext, useEffect, useState } from 'react'
import axios from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/auth/me')
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // --- MODIFIED: Login function now just sets the user state ---
  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await axios.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)