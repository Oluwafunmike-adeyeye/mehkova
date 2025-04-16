"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '@/lib/firebase'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user)
        setLoading(false)
        setError(null)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    error
  }), [user, loading, error])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}