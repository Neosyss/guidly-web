"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient, SessionResponse, MessageResponse, ConversationResponse, CreateSessionRequest } from '@/lib/api'
import { useAuth } from './AuthContext'

// Types for session management
export type CounselingType = 'mental_wellbeing' | 'career_guidance' | 'entrepreneurship_guidance'

interface SessionContextType {
  // Session state
  currentSession: SessionResponse | null
  sessions: SessionResponse[]
  messages: MessageResponse[]
  isLoading: boolean
  error: string | null

  // Session actions
  createSession: (counselingType: CounselingType) => Promise<SessionResponse | null>
  loadSessions: () => Promise<void>
  switchSession: (sessionId: string) => Promise<void>
  sendMessage: (content: string) => Promise<ConversationResponse | null>
  closeSession: (sessionId: string) => Promise<void>
  clearCurrentSession: () => void
  clearError: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [currentSession, setCurrentSession] = useState<SessionResponse | null>(null)
  const [sessions, setSessions] = useState<SessionResponse[]>([])
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, isAuthenticated } = useAuth()

  // Load sessions when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSessions()
    } else {
      // Clear session state when not authenticated
      setCurrentSession(null)
      setSessions([])
      setMessages([])
    }
  }, [isAuthenticated, user])

  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage = error?.detail || error?.message || defaultMessage
    setError(errorMessage)
    console.error(defaultMessage, error)
  }

  const clearError = () => {
    setError(null)
  }

  const createSession = async (counselingType: CounselingType): Promise<SessionResponse | null> => {
    if (!isAuthenticated) return null

    setIsLoading(true)
    clearError()

    try {
      // Clear current session first to avoid conflicts
      setCurrentSession(null)
      setMessages([])
      
      // Create new session (backend will automatically close existing active sessions)
      const sessionData: CreateSessionRequest = { counseling_type: counselingType }
      const newSession = await apiClient.createSession(sessionData)
      
      // Update sessions list - mark all others as inactive
      setSessions(prev => [newSession, ...prev.map(s => ({ ...s, is_active: false }))])
      
      // Set as current session
      setCurrentSession(newSession)
      
      console.log('SessionContext: Created new session:', newSession.id, 'Type:', counselingType, 'Active:', newSession.is_active)
      
      // Wait for React state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return newSession
    } catch (error) {
      handleError(error, 'Failed to create session')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const loadSessions = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    clearError()

    try {
      const userSessions = await apiClient.getSessions()
      setSessions(userSessions)
      
      // Only auto-load the active session if we don't have a current session
      // This prevents interference when starting new conversations
      if (!currentSession && userSessions.length > 0) {
        const activeSession = userSessions.find(s => s.is_active)
        if (activeSession) {
          await switchSession(activeSession.id)
        }
      }
    } catch (error) {
      handleError(error, 'Failed to load sessions')
    } finally {
      setIsLoading(false)
    }
  }

  const switchSession = async (sessionId: string) => {
    if (!isAuthenticated) return

    setIsLoading(true)
    clearError()

    try {
      // Get session details
      const session = await apiClient.getSession(sessionId)
      setCurrentSession(session)
      
      // Load messages for this session
      const sessionMessages = await apiClient.getSessionMessages(sessionId)
      setMessages(sessionMessages)
    } catch (error) {
      handleError(error, 'Failed to switch session')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (content: string): Promise<ConversationResponse | null> => {
    if (!isAuthenticated) {
      setError('Not authenticated')
      return null
    }

    if (!currentSession) {
      setError('No active session available')
      return null
    }

    setIsLoading(true)
    clearError()

    try {
      console.log('SessionContext: Sending message to session:', currentSession.id, 'Active:', currentSession.is_active)
      
      // Check if session is still active before sending
      if (!currentSession.is_active) {
        throw new Error('Session is no longer active')
      }
      
      const response = await apiClient.sendMessage(currentSession.id, { content })
      
      // Add both user and AI messages to the messages list
      const newMessages: MessageResponse[] = []
      if (response.user_message) {
        newMessages.push(response.user_message)
      }
      if (response.ai_message) {
        newMessages.push(response.ai_message)
      }
      
      setMessages(prev => [...prev, ...newMessages])
      
      console.log('SessionContext: Message sent successfully, received AI response')
      return response
    } catch (error: any) {
      console.error('SessionContext: Error sending message:', error)
      
      // Handle inactive session error specifically
      if (error?.detail?.includes('inactive session') || error?.message?.includes('inactive session')) {
        setError('Session is no longer active. Please start a new conversation.')
        setCurrentSession(null)
        setMessages([])
      } else {
        handleError(error, 'Failed to send message')
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const closeSession = async (sessionId: string) => {
    if (!isAuthenticated) return

    setIsLoading(true)
    clearError()

    try {
      await apiClient.closeSession(sessionId)
      
      // Update sessions list
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, is_active: false } : s
      ))
      
      // If closing current session, clear it
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
      }
    } catch (error) {
      handleError(error, 'Failed to close session')
    } finally {
      setIsLoading(false)
    }
  }

  const clearCurrentSession = () => {
    setCurrentSession(null)
    setSessions([])
    setMessages([])
  }

  const value: SessionContextType = {
    currentSession,
    sessions,
    messages,
    isLoading,
    error,
    createSession,
    loadSessions,
    switchSession,
    sendMessage,
    closeSession,
    clearCurrentSession,
    clearError,
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
} 