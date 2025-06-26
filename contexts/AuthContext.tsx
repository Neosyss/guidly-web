"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { 
  apiClient, 
  isAuthenticated, 
  getStoredUser, 
  setStoredUser, 
  clearStoredUser,
  TokenManager,
  UserResponse,
  RegisterRequest,
  LoginRequest,
  ApiError
} from '@/lib/api'

// Types
interface AuthContextType {
  user: UserResponse | null
  loading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize authentication state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check if user has valid tokens
      if (isAuthenticated()) {
        // Try to get stored user data first
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        // Refresh user data from server
        try {
          const currentUser = await apiClient.getCurrentUser()
          setUser(currentUser)
          setStoredUser(currentUser)
        } catch (error) {
          console.error('Failed to refresh user data:', error)
          // If server request fails but we have stored user, keep using it
          if (!storedUser) {
            // If no stored user and server fails, clear auth
            await handleLogout(false)
          }
        }
      } else {
        // No valid tokens, clear any stale data
        setUser(null)
        clearStoredUser()
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setUser(null)
      clearStoredUser()
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setLoading(true)
      
      console.log('Attempting login with:', { email: credentials.email })
      
      // Login and get tokens
      await apiClient.login(credentials)
      
      // Get user data
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
      setStoredUser(userData)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error type:', typeof error)
      console.error('Error keys:', error ? Object.keys(error) : 'no keys')
      
      // Re-throw the error with proper structure
      if (error && typeof error === 'object' && 'detail' in error) {
        throw error
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      setLoading(true)
      
      // Register user
      const newUser = await apiClient.register(userData)
      
      // Note: After registration, user needs to login
      // The backend returns user data but not tokens
      console.log('User registered successfully:', newUser)
      
      // Don't auto-login, let user login manually for security
      // This also matches the current UI flow
      
    } catch (error) {
      console.error('Registration error:', error)
      throw error // Re-throw to let the component handle the error display
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (callApi: boolean = true) => {
    try {
      setLoading(true)
      
      if (callApi) {
        // Call logout API
        await apiClient.logout()
      }
      
      // Clear local state and storage
      setUser(null)
      clearStoredUser()
      TokenManager.clearTokens()
      
      // Redirect to auth page
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear local state
      setUser(null)
      clearStoredUser()
      TokenManager.clearTokens()
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Not authenticated')
      }
      
      const userData = await apiClient.getCurrentUser()
      setUser(userData)
      setStoredUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, logout user
      await handleLogout(false)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
    isAuthenticated: isAuthenticated() && user !== null,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protected routes
interface WithAuthProps {
  children: ReactNode
  fallback?: ReactNode
}

export const WithAuth: React.FC<WithAuthProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <>{fallback}</>
  }

  if (!isAuthenticated) {
    return null // AuthProvider will handle redirect
  }

  return <>{children}</>
}

// Helper component for public routes (redirects if authenticated)
export const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
} 