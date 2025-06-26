// API Client Service for Neo-AI Counseling App
// Handles all communication with the FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Types for API requests and responses
export interface RegisterRequest {
  email: string
  password: string
  name: string
  age?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  email_verified: boolean
  name: string
  age?: number
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

// Session management types
export interface CreateSessionRequest {
  counseling_type: 'mental_wellbeing' | 'career_guidance' | 'entrepreneurship_guidance'
}

export interface SessionResponse {
  id: string
  profile_id: string
  counseling_type: string
  is_active: boolean
  created_at: string
  updated_at: string
  message_count?: number
}

export interface MessageResponse {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface SendMessageRequest {
  content: string
}

export interface ConversationResponse {
  user_message: MessageResponse
  ai_message: MessageResponse | null
}

export interface ApiError {
  detail: string
  status_code: number
}

// Token management utilities
class TokenManager {
  private static ACCESS_TOKEN_KEY = 'neo_ai_access_token'
  private static REFRESH_TOKEN_KEY = 'neo_ai_refresh_token'
  private static TOKEN_EXPIRY_KEY = 'neo_ai_token_expiry'

  static setTokens(tokenResponse: TokenResponse): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenResponse.access_token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenResponse.refresh_token)
    
    // Calculate expiry time (subtract 5 minutes for buffer)
    const expiryTime = Date.now() + (tokenResponse.expires_in * 60 * 1000) - (5 * 60 * 1000)
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiryTime) return true
    
    return Date.now() > parseInt(expiryTime)
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    // Also clear old localStorage keys for backward compatibility
    localStorage.removeItem('guidly_authenticated')
    localStorage.removeItem('guidly_user_profile')
  }

  static hasValidTokens(): boolean {
    return this.getAccessToken() !== null && !this.isTokenExpired()
  }
}

// API Client class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // Generic request method with automatic token refresh
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api/v1${endpoint}`
    
    // Add default headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add authorization header if token exists
    const accessToken = TokenManager.getAccessToken()
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle token expiry - attempt refresh
      if (response.status === 401 && TokenManager.getRefreshToken()) {
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Retry original request with new token
          const newAccessToken = TokenManager.getAccessToken()
          if (newAccessToken) {
            headers['Authorization'] = `Bearer ${newAccessToken}`
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            })
            return this.handleResponse<T>(retryResponse)
          }
        }
        // If refresh failed, clear tokens and redirect to login
        TokenManager.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/auth'
        }
        throw new Error('Authentication required')
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Handle API response and errors
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
      } catch (parseError) {
        // If JSON parsing fails, use the default error message
        console.warn('Failed to parse error response:', parseError)
      }

      const apiError: ApiError = {
        detail: errorMessage,
        status_code: response.status,
      }
      
      // Ensure the error is properly thrown with all properties
      const error = new Error(errorMessage) as Error & ApiError
      error.detail = errorMessage
      error.status_code = response.status
      
      throw error
    }

    // Handle empty responses (like logout)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }

    return response.json()
  }

  // Authentication methods
  async register(userData: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const tokenResponse = await this.request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Store tokens after successful login
    TokenManager.setTokens(tokenResponse)
    return tokenResponse
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = TokenManager.getRefreshToken()
      if (!refreshToken) return false

      const tokenResponse = await this.request<TokenResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      TokenManager.setTokens(tokenResponse)
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      TokenManager.clearTokens()
      return false
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/me')
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Always clear tokens on logout, even if API call fails
      TokenManager.clearTokens()
    }
  }

  // Session management methods
  async createSession(sessionData: CreateSessionRequest): Promise<SessionResponse> {
    return this.request<SessionResponse>('/sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  }

  async getSessions(): Promise<SessionResponse[]> {
    return this.request<SessionResponse[]>('/sessions/')
  }

  async getSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/sessions/${sessionId}`)
  }

  async getSessionMessages(sessionId: string): Promise<MessageResponse[]> {
    return this.request<MessageResponse[]>(`/sessions/${sessionId}/messages`)
  }

  async sendMessage(sessionId: string, messageData: SendMessageRequest): Promise<ConversationResponse> {
    return this.request<ConversationResponse>(`/sessions/${sessionId}/chat`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  async closeSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/sessions/${sessionId}/close`, {
      method: 'PUT',
    })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string; version: string; environment: string }> {
    const response = await fetch(`${this.baseURL}/health`)
    if (!response.ok) {
      throw new Error('Health check failed')
    }
    return response.json()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export utilities for use in components
export { TokenManager }

// Helper functions
export const isAuthenticated = (): boolean => {
  return TokenManager.hasValidTokens()
}

export const getStoredUser = (): UserResponse | null => {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('neo_ai_user_data')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export const setStoredUser = (user: UserResponse): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('neo_ai_user_data', JSON.stringify(user))
}

export const clearStoredUser = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('neo_ai_user_data')
} 