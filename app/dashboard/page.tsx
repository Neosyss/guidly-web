"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import {
  ArrowUp,
  MessageSquare,
  FileText,
  Search,
  Brain,
  Briefcase,
  TrendingUp,
  Plus,
  Sparkles,
  Settings,
  LogOut,
  Sidebar,
  ArrowLeft,
  Send,
  User,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Save,
  X,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useAuth, WithAuth } from "@/contexts/AuthContext"
import { useSession, CounselingType } from "@/contexts/SessionContext"
import { MessageResponse, apiClient } from "@/lib/api"

interface UserProfile {
  fullName: string
  email: string
  age?: number
}

// Map frontend types to backend types
const mapCounselingType = (frontendType: string): CounselingType => {
  switch (frontendType) {
    case "mental": return "mental_wellbeing"
    case "career": return "career_guidance"
    case "entrepreneurship": return "entrepreneurship_guidance"
    default: return "mental_wellbeing"
  }
}

type CounsellingType = "mental" | "career" | "entrepreneurship"

function DashboardComponent() {
  const [message, setMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHeaderButton, setShowHeaderButton] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<CounsellingType>("mental")
  const [chatStarted, setChatStarted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [tempProfile, setTempProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    age: undefined,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  // Use auth context
  const { user, logout, refreshUser } = useAuth()

  // Use session context
  const { 
    currentSession, 
    sessions, 
    messages, 
    isLoading, 
    error,
    createSession, 
    sendMessage,
    switchSession,
    clearError,
    clearCurrentSession,
  } = useSession()

  // Clear errors when session changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000) // Clear error after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  // Initialize temp profile when user data changes
  useEffect(() => {
    if (user) {
      setTempProfile({
        fullName: user.name,
        email: user.email,
        age: user.age,
      })
    }
  }, [user])

  // Update chat started state based on current session
  useEffect(() => {
    setChatStarted(!!currentSession)
  }, [currentSession])

  // Only show theme toggle after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sidebar toggle with proper timing
  const handleSidebarToggle = (open: boolean) => {
    if (open) {
      setShowHeaderButton(false)
      setTimeout(() => setSidebarOpen(true), 50)
    } else {
      setSidebarOpen(false)
      setTimeout(() => setShowHeaderButton(true), 500)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Logout will still happen even if API call fails
    }
  }

  // Handle settings save
  const handleSettingsSave = async () => {
    try {
      // Note: In a full implementation, you would call an API to update user profile
      // For now, we'll just close the dialog since we don't have a profile update endpoint yet
      setSettingsOpen(false)
      
      // TODO: Implement profile update API call
      // await updateUserProfile(tempProfile)
      // await refreshUser()
      
      console.log('Profile update not yet implemented in backend')
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  // Handle settings cancel
  const handleSettingsCancel = () => {
    if (user) {
      setTempProfile({
        fullName: user.name,
        email: user.email,
        age: user.age,
      })
    }
    setSettingsOpen(false)
    setShowEmail(false)
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Calculate age from date of birth (if we had birth date)
  const getDisplayAge = (): string => {
    if (user?.age) {
      return user.age.toString()
    }
    return "Not provided"
  }

  // Get counselling context based on active tab
  const getCounsellingContext = (type: CounsellingType) => {
    const contexts = {
      mental: {
        title: "Mental Wellness Support",
        icon: Brain,
        greeting:
          "Hello! I'm here to support your mental wellness journey. I can help you with stress management, mindfulness practices, emotional regulation, and building resilience. What's on your mind today?",
        placeholder: "Share what's on your mind...",
      },
      career: {
        title: "Career Guidance",
        icon: Briefcase,
        greeting:
          "Hi there! I'm your career guidance counselor. I can help you with career transitions, skill development, interview preparation, resume building, and strategic career planning. What career challenge can I help you with?",
        placeholder: "Tell me about your career goals...",
      },
      entrepreneurship: {
        title: "Entrepreneurship Guidance",
        icon: TrendingUp,
        greeting:
          "Welcome! I'm here to help you on your entrepreneurial journey. I can assist with business strategy, funding advice, market analysis, growth planning, and turning your ideas into successful ventures. What's your business idea or challenge?",
        placeholder: "Describe your business idea or challenge...",
      },
    }
    return contexts[type]
  }

  // Handle new session creation
  const handleStartNewSession = async () => {
    const counselingType = mapCounselingType(activeTab)
    console.log('Creating new session for type:', counselingType)
    const newSession = await createSession(counselingType)
    if (newSession) {
      console.log('New session created successfully:', newSession.id)
      setChatStarted(true)
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 200))
    } else {
      console.error('Failed to create new session')
    }
    return newSession
  }

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const messageContent = message.trim()
    setMessage("") // Clear message immediately to prevent double submission

    try {
      // If we're on the welcome screen (not chatStarted), always create a new session
      if (!chatStarted) {
        console.log('Starting new conversation - creating new session...')
        const newSession = await handleStartNewSession()
        if (!newSession) {
          console.error('Failed to create session')
          setMessage(messageContent)
          return
        }
        
        // Send message directly using the API with the new session ID
        console.log('Sending first message to new session:', newSession.id)
        try {
          const response = await apiClient.sendMessage(newSession.id, { content: messageContent })
          
          // Load the session with messages to update the UI
          console.log('Loading session messages...')
          await switchSession(newSession.id)
          
          console.log('First message sent successfully')
        } catch (error) {
          console.error('Failed to send first message:', error)
          setMessage(messageContent)
        }
        return
      }

      // If we're already in chat mode, ensure we have an active session
      if (!currentSession || !currentSession.is_active) {
        console.log('No active session - creating new session...')
        const newSession = await createSession(mapCounselingType(activeTab))
        if (!newSession) {
          console.error('Failed to create session')
          setMessage(messageContent) // Restore message on failure
          return
        }
        // Wait for session to be set
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      console.log('Sending message to current session:', currentSession?.id)
      const result = await sendMessage(messageContent)
      if (result) {
        console.log('Message sent successfully')
      } else {
        console.error('Failed to send message')
        setMessage(messageContent) // Restore message on failure
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setMessage(messageContent) // Restore message on error
    }
  }

  // Handle key press for Enter to submit
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  if (chatStarted) {
    const context = getCounsellingContext(activeTab)
    const IconComponent = context.icon

    return (
      <div className="flex h-screen overflow-hidden app-bg relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-96 lg:w-96 md:w-80 sm:w-72" : "w-0"} sidebar-bg backdrop-blur-3xl border-r shadow-2xl relative z-50 transition-all duration-500 ease-in-out overflow-hidden`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="p-4 rounded-2xl transition-all duration-500 group-hover:scale-105">
                    <Sparkles className="h-8 w-8 text-primary drop-shadow-lg group-hover:rotate-12 transition-all duration-500" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold text-primary group-hover:scale-105 transition-all duration-500 drop-shadow-sm">
                    Guidly
                  </h1>
                  <p className="text-xs text-muted font-medium tracking-wider opacity-70 group-hover:opacity-100 transition-all duration-300">
                    AI Assistant
                  </p>
                </div>
              </div>

              <div className="relative group/tooltip">
                <Button
                  variant="ghost"
                  className="h-16 w-16 p-0 rounded-2xl hover:bg-white/10 hover:scale-110 transition-all duration-300 text-primary/80 hover:text-primary"
                  onClick={() => handleSidebarToggle(false)}
                >
                  <Sidebar className="h-10 w-10" />
                </Button>
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Close sidebar
                  <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
                </div>
              </div>
            </div>

            {/* Current Session */}
            <div className="glass-panel rounded-2xl p-4 mb-6 border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="glass-panel p-2 rounded-xl shadow-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-primary font-semibold text-sm">Current Session</p>
                  <p className="text-muted text-xs">{context.title}</p>
                </div>
              </div>
              <Button
                onClick={() => setChatStarted(false)}
                variant="ghost"
                className="w-full justify-start gap-2 h-8 text-secondary hover:text-primary rounded-lg text-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Main
              </Button>
            </div>

            {/* Rest of sidebar content... */}
            <Button 
              onClick={async () => {
                // Close current session and start fresh
                clearCurrentSession()
                setChatStarted(false)
                setMessage("")
              }}
              className="glass-button w-full justify-start gap-4 h-12 glass-panel shadow-xl rounded-2xl font-semibold text-lg text-primary hover:bg-white/10 dark:hover:bg-white/5"
            >
              <Plus className="h-6 w-6" />
              Start New Session
            </Button>

            <div className="mt-6">
              <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Navigation</h2>
              <div className="space-y-2">
                <Button className="sidebar-item w-full justify-start gap-4 h-10 bg-white/20 dark:bg-white/10 backdrop-blur-xl shadow-lg rounded-xl font-medium animate-fade-in-up text-primary hover:bg-white/30 dark:hover:bg-white/15 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <MessageSquare className="h-5 w-5" />
                  AI Counselling
                </Button>
                <Button
                  variant="ghost"
                  className="sidebar-item w-full justify-start gap-4 h-10 text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 rounded-xl font-medium animate-fade-in-up transition-all duration-300 border-0"
                >
                  <FileText className="h-5 w-5" />
                  Resume Builder
                </Button>
                <Button
                  variant="ghost"
                  className="sidebar-item w-full justify-start gap-4 h-10 text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 rounded-xl font-medium animate-fade-in-up transition-all duration-300 border-0"
                >
                  <Search className="h-5 w-5" />
                  AI Search
                </Button>
              </div>
            </div>

            <div className="mt-6 flex-1 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Recent Sessions</h2>
                <span className="text-xs text-muted">{sessions.length} total</span>
              </div>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-muted text-sm text-center py-4">No sessions yet</p>
                ) : (
                  sessions.slice(0, 10).map((session) => {
                    const sessionIcon = session.counseling_type === 'mental_wellbeing' ? Brain :
                                       session.counseling_type === 'career_guidance' ? Briefcase : TrendingUp
                    const SessionIcon = sessionIcon
                    const isActive = currentSession?.id === session.id
                    
                    return (
                      <div 
                        key={session.id}
                        onClick={async () => {
                          await switchSession(session.id)
                          setChatStarted(true)
                        }}
                        className={`${
                          isActive 
                            ? 'bg-white/15 dark:bg-white/10 border-white/30 dark:border-white/20' 
                            : 'bg-white/5 dark:bg-white/3 border-white/10 dark:border-white/5'
                        } backdrop-blur-xl border rounded-2xl p-3 cursor-pointer group hover:bg-white/12 dark:hover:bg-white/8 hover:scale-[1.02] hover:shadow-lg hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-sm`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`glass-panel p-2 rounded-xl shadow-lg group-hover:bg-white/20 dark:group-hover:bg-white/10 group-hover:shadow-xl transition-all duration-300 flex-shrink-0 ${
                            isActive ? 'bg-white/20 dark:bg-white/15' : ''
                          }`}>
                            <SessionIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-primary font-medium mb-1 truncate">
                              {session.counseling_type === 'mental_wellbeing' ? 'Mental wellness session' :
                               session.counseling_type === 'career_guidance' ? 'Career guidance session' :
                               'Entrepreneurship session'}
                            </p>
                            <p className="text-muted text-xs">
                              {new Date(session.created_at).toLocaleDateString()} • 
                              {session.is_active ? ' Active' : ' Completed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-4 h-10 text-secondary hover:text-primary rounded-xl font-medium transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-lg rounded-3xl p-0 overflow-hidden">
                  <div className="relative">
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 border-b border-gray-200/30 dark:border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-primary text-2xl font-bold flex items-center gap-3">
                          <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl shadow-lg">
                            <Settings className="h-6 w-6 text-primary" />
                          </div>
                          Profile Settings
                        </DialogTitle>
                        <p className="text-secondary text-sm mt-2">Manage your personal information and preferences</p>
                      </DialogHeader>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Profile Avatar Section */}
                      <div className="text-center pb-4 border-b border-gray-200/30 dark:border-white/10">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-3 shadow-lg border-4 border-white dark:border-gray-800">
                          {getUserInitials(tempProfile.fullName)}
                        </div>
                        <h3 className="text-primary font-semibold text-lg">{tempProfile.fullName}</h3>
                        <p className="text-muted text-sm">Member since 2024</p>
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <label className="text-primary font-semibold text-sm flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </label>
                          <div className="relative">
                            <Input
                              value={tempProfile.fullName}
                              onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                              className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-white/20 rounded-xl h-12 text-primary placeholder:text-primary/50 pl-4 pr-4 shadow-sm focus:shadow-md transition-all duration-300 focus:border-primary/50"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                          <label className="text-primary font-semibold text-sm flex items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Age
                            </div>
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                              {getDisplayAge()}
                            </span>
                          </label>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label className="text-primary font-semibold text-sm flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowEmail(!showEmail)}
                              className="text-primary/70 hover:text-primary h-7 px-3 rounded-lg hover:bg-primary/5"
                            >
                              {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="ml-1 text-xs">{showEmail ? "Hide" : "Show"}</span>
                            </Button>
                          </label>
                          <div className="relative">
                            <Input
                              type={showEmail ? "email" : "password"}
                              value={tempProfile.email}
                              readOnly
                              className="bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-white/20 rounded-xl h-12 text-primary/70 placeholder:text-primary/50 pl-4 pr-4 cursor-not-allowed opacity-75"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="bg-gray-200/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-md font-medium">
                                Read-only
                              </div>
                            </div>
                          </div>
                          <p className="text-muted text-xs flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Email cannot be changed for security reasons
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-6 border-t border-gray-200/30 dark:border-white/10">
                        <Button
                          onClick={handleSettingsSave}
                          className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl h-12 font-semibold border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleSettingsCancel}
                          variant="outline"
                          className="flex-1 bg-white/80 dark:bg-gray-800/80 text-secondary hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-white/20 rounded-xl h-12 font-semibold hover:shadow-md transition-all duration-300"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                className="w-full justify-start gap-4 h-10 text-secondary hover:text-primary rounded-xl font-medium transition-all duration-300"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
          {/* Chat Header */}
          <div className="h-16 flex items-center px-4 md:px-8 glass-panel backdrop-blur-2xl relative overflow-hidden border-b border-white/10">
            {!sidebarOpen && showHeaderButton && (
              <div className="relative group/tooltip mr-4 animate-fade-in-up">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center h-12 w-12 p-0 rounded-2xl hover:bg-white/10 hover:scale-110 transition-all duration-300 text-primary/80 hover:text-primary"
                  onClick={() => handleSidebarToggle(true)}
                >
                  <Sidebar className="h-10 w-10" />
                </Button>
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Open sidebar
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/80"></div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="glass-panel p-2 rounded-xl shadow-lg">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-primary font-semibold">{context.title}</h2>
                <p className="text-muted text-sm">AI Counselor</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-400 dark:to-gray-600 flex items-center justify-center text-primary font-bold shadow-xl border-2 border-gray-100 dark:border-white/20 hover:scale-110 transition-all duration-300 p-0"
                  >
                    {getUserInitials(tempProfile.fullName)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="glass-panel backdrop-blur-3xl border border-white/20 shadow-2xl w-56"
                  align="end"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-primary font-semibold">{tempProfile.fullName}</p>
                    <p className="text-muted text-xs">{tempProfile.email}</p>
                  </div>
                  <DropdownMenuItem
                    onClick={() => setSettingsOpen(true)}
                    className="text-secondary hover:text-primary hover:bg-primary/5 cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/5 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user" ? "bg-blue-500/80 text-white ml-12" : "glass-panel mr-12"
                    } shadow-lg`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="glass-panel p-1 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-primary font-medium text-sm">AI Counselor</span>
                      </div>
                    )}
                    <p className={`${msg.role === "user" ? "text-white" : "text-primary"} leading-relaxed`}>
                      {msg.content}
                    </p>
                    <p className={`text-xs mt-2 ${msg.role === "user" ? "text-white/70" : "text-muted"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="glass-panel rounded-2xl p-4 mr-12 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="glass-panel p-1 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-primary font-medium text-sm">AI Counselor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-muted text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center animate-fade-in-up">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 max-w-md text-center">
                    <div className="flex items-center gap-2 justify-center mb-2">
                      <X className="h-5 w-5 text-red-500" />
                      <span className="text-red-500 font-medium text-sm">Error</span>
                    </div>
                    <p className="text-red-500 text-sm">{error}</p>
                    <Button
                      onClick={clearError}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-400 hover:bg-red-500/5"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 md:p-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="input-container backdrop-blur-3xl border rounded-3xl flex items-center p-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-3xl"></div>

                  <MessageSquare className="h-5 w-5 text-muted ml-4 mr-3 relative z-10" />
                  <Input
                    type="text"
                    placeholder={context.placeholder}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-muted text-base font-medium relative z-10 h-10 py-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isLoading}
                    className="glass-button rounded-xl button-gradient text-white dark:text-white shadow-xl h-10 w-10 relative z-10 border border-gray-200 dark:border-white/20 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original welcome screen
  return (
    <div className="flex h-screen overflow-hidden app-bg relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-96 lg:w-96 md:w-80 sm:w-72" : "w-0"} sidebar-bg backdrop-blur-3xl border-r shadow-2xl relative z-50 transition-all duration-500 ease-in-out overflow-hidden`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="p-4 rounded-2xl transition-all duration-500 group-hover:scale-105">
                  <Sparkles className="h-8 w-8 text-primary drop-shadow-lg group-hover:rotate-12 transition-all duration-500" />
                </div>
              </div>

              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-primary group-hover:scale-105 transition-all duration-500 drop-shadow-sm">
                  Guidly
                </h1>
                <p className="text-xs text-muted font-medium tracking-wider opacity-70 group-hover:opacity-100 transition-all duration-300">
                  AI Assistant
                </p>
              </div>
            </div>

            <div className="relative group/tooltip">
              <Button
                variant="ghost"
                className="h-16 w-16 p-0 rounded-2xl hover:bg-white/10 hover:scale-110 transition-all duration-300 text-primary/80 hover:text-primary"
                onClick={() => handleSidebarToggle(false)}
              >
                <Sidebar className="h-10 w-10" />
              </Button>
              <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Close sidebar
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
              </div>
            </div>
          </div>

          {/* Start New Button */}
          <Button 
            onClick={async () => {
              // Close current session and start fresh
              clearCurrentSession()
              setChatStarted(false)
              setMessage("")
            }}
            className="glass-button w-full justify-start gap-4 h-12 glass-panel shadow-xl rounded-2xl font-semibold text-lg text-primary hover:bg-white/10 dark:hover:bg-white/5"
          >
            <Plus className="h-6 w-6" />
            Start New Session
          </Button>

          {/* Navigation */}
          <div className="mt-6">
            <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Navigation</h2>
            <div className="space-y-2">
              <Button className="sidebar-item w-full justify-start gap-4 h-10 bg-white/20 dark:bg-white/10 backdrop-blur-xl shadow-lg rounded-xl font-medium animate-fade-in-up text-primary hover:bg-white/30 dark:hover:bg-white/15 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <MessageSquare className="h-5 w-5" />
                AI Counselling
              </Button>
              <Button
                variant="ghost"
                className="sidebar-item w-full justify-start gap-4 h-10 text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 rounded-xl font-medium animate-fade-in-up transition-all duration-300 border-0"
              >
                <FileText className="h-5 w-5" />
                Resume Builder
              </Button>
              <Button
                variant="ghost"
                className="sidebar-item w-full justify-start gap-4 h-10 text-secondary hover:text-primary hover:bg-white/10 dark:hover:bg-white/5 rounded-xl font-medium animate-fade-in-up transition-all duration-300 border-0"
              >
                <Search className="h-5 w-5" />
                AI Search
              </Button>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mt-6 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-muted uppercase tracking-wider">Recent Sessions</h2>
              <span className="text-xs text-muted">{sessions.length} total</span>
            </div>
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-muted text-sm text-center py-4">No sessions yet</p>
              ) : (
                sessions.slice(0, 10).map((session) => {
                  const sessionIcon = session.counseling_type === 'mental_wellbeing' ? Brain :
                                     session.counseling_type === 'career_guidance' ? Briefcase : TrendingUp
                  const SessionIcon = sessionIcon
                  const isActive = currentSession?.id === session.id
                  
                  return (
                    <div 
                      key={session.id}
                      onClick={async () => {
                        await switchSession(session.id)
                        setChatStarted(true)
                      }}
                      className={`${
                        isActive 
                          ? 'bg-white/15 dark:bg-white/10 border-white/30 dark:border-white/20' 
                          : 'bg-white/5 dark:bg-white/3 border-white/10 dark:border-white/5'
                      } backdrop-blur-xl border rounded-2xl p-3 cursor-pointer group hover:bg-white/12 dark:hover:bg-white/8 hover:scale-[1.02] hover:shadow-lg hover:border-white/20 dark:hover:border-white/10 transition-all duration-300 shadow-sm`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`glass-panel p-2 rounded-xl shadow-lg group-hover:bg-white/20 dark:group-hover:bg-white/10 group-hover:shadow-xl transition-all duration-300 flex-shrink-0 ${
                          isActive ? 'bg-white/20 dark:bg-white/15' : ''
                        }`}>
                          <SessionIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-primary font-medium mb-1 truncate">
                            {session.counseling_type === 'mental_wellbeing' ? 'Mental wellness session' :
                             session.counseling_type === 'career_guidance' ? 'Career guidance session' :
                             'Entrepreneurship session'}
                          </p>
                          <p className="text-muted text-xs">
                            {new Date(session.created_at).toLocaleDateString()} • 
                            {session.is_active ? ' Active' : ' Completed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-4 space-y-2">
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 h-10 text-secondary hover:text-primary rounded-xl font-medium transition-all duration-300"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl border border-gray-200/50 dark:border-white/20 shadow-2xl max-w-lg rounded-3xl p-0 overflow-hidden">
                <div className="relative">
                  {/* Header with gradient background */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 border-b border-gray-200/30 dark:border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-primary text-2xl font-bold flex items-center gap-3">
                        <div className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-xl shadow-lg">
                          <Settings className="h-6 w-6 text-primary" />
                        </div>
                        Profile Settings
                      </DialogTitle>
                      <p className="text-secondary text-sm mt-2">Manage your personal information and preferences</p>
                    </DialogHeader>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Profile Avatar Section */}
                    <div className="text-center pb-4 border-b border-gray-200/30 dark:border-white/10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-2xl mx-auto mb-3 shadow-lg border-4 border-white dark:border-gray-800">
                        {getUserInitials(tempProfile.fullName)}
                      </div>
                      <h3 className="text-primary font-semibold text-lg">{tempProfile.fullName}</h3>
                      <p className="text-muted text-sm">Member since 2024</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-primary font-semibold text-sm flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </label>
                        <div className="relative">
                          <Input
                            value={tempProfile.fullName}
                            onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                            className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-white/20 rounded-xl h-12 text-primary placeholder:text-primary/50 pl-4 pr-4 shadow-sm focus:shadow-md transition-all duration-300 focus:border-primary/50"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      {/* Age */}
                      <div className="space-y-2">
                        <label className="text-primary font-semibold text-sm flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Age
                          </div>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                            {getDisplayAge()}
                          </span>
                        </label>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-primary font-semibold text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEmail(!showEmail)}
                            className="text-primary/70 hover:text-primary h-7 px-3 rounded-lg hover:bg-primary/5"
                          >
                            {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="ml-1 text-xs">{showEmail ? "Hide" : "Show"}</span>
                          </Button>
                        </label>
                        <div className="relative">
                          <Input
                            type={showEmail ? "email" : "password"}
                            value={tempProfile.email}
                            readOnly
                            className="bg-gray-50/80 dark:bg-gray-800/50 border-gray-200 dark:border-white/20 rounded-xl h-12 text-primary/70 placeholder:text-primary/50 pl-4 pr-4 cursor-not-allowed opacity-75"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="bg-gray-200/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-md font-medium">
                              Read-only
                            </div>
                          </div>
                        </div>
                        <p className="text-muted text-xs flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Email cannot be changed for security reasons
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200/30 dark:border-white/10">
                      <Button
                        onClick={handleSettingsSave}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl h-12 font-semibold border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleSettingsCancel}
                        variant="outline"
                        className="flex-1 bg-white/80 dark:bg-gray-800/80 text-secondary hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-white/20 rounded-xl h-12 font-semibold hover:shadow-md transition-all duration-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              className="w-full justify-start gap-4 h-10 text-secondary hover:text-primary rounded-xl font-medium transition-all duration-300"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        {/* Header */}
        <div className="h-16 flex items-center px-4 md:px-8 glass-panel backdrop-blur-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {!sidebarOpen && showHeaderButton && (
            <div className="relative group/tooltip mr-4 animate-fade-in-up">
              <Button
                variant="ghost"
                className="flex items-center justify-center h-12 w-12 p-0 rounded-2xl hover:bg-white/10 hover:scale-110 transition-all duration-300 text-primary/80 hover:text-primary"
                onClick={() => handleSidebarToggle(true)}
              >
                <Sidebar className="h-10 w-10" />
              </Button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Open sidebar
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black/80"></div>
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-400 dark:to-gray-600 flex items-center justify-center text-primary font-bold shadow-xl border-2 border-gray-100 dark:border-white/20 hover:scale-110 transition-all duration-300 p-0"
                >
                  {getUserInitials(tempProfile.fullName)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="glass-panel backdrop-blur-3xl border border-white/20 shadow-2xl w-56"
                align="end"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-primary font-semibold">{tempProfile.fullName}</p>
                  <p className="text-muted text-xs">{tempProfile.email}</p>
                </div>
                <DropdownMenuItem
                  onClick={() => setSettingsOpen(true)}
                  className="text-secondary hover:text-primary hover:bg-primary/5 cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col px-4 md:px-8 overflow-hidden">
          <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
            <div className="text-center mt-6 mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-primary mb-2 leading-tight">
                How can I help you today?
              </h1>
              <p className="text-secondary text-lg">Choose your counselling journey to begin</p>
            </div>

            <div className="glass-panel hover:scale-[1.01] hover:shadow-2xl rounded-3xl p-4 md:p-6 mb-6 relative overflow-hidden animate-fade-in-up transition-all duration-500 ease-out group flex-1 flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 dark:to-transparent rounded-3xl pointer-events-none"></div>
              <div className="absolute inset-0 animate-pulse-glow rounded-3xl pointer-events-none"></div>

              <Tabs
                defaultValue="mental"
                className="w-full relative z-10 flex flex-col h-full"
                onValueChange={(value) => setActiveTab(value as CounsellingType)}
              >
                <TabsList className="grid w-full grid-cols-3 glass-panel rounded-2xl p-2 shadow-2xl h-16 gap-2 group-hover:bg-white/10 group-hover:backdrop-blur-xl transition-all duration-300">
                  <TabsTrigger
                    value="mental"
                    className="tab-trigger focus:outline-none data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-lg text-secondary data-[state=active]:text-primary font-semibold rounded-xl py-2 px-3 hover:scale-[1.01] hover:bg-white/10 hover:shadow-lg flex items-center justify-center gap-2 mx-1 transition-all duration-300 ease-out group-hover:!bg-white/10 group-hover:data-[state=active]:!bg-white/10 group-hover:data-[state=active]:border-white/30 group-hover:data-[state=active]:border"
                  >
                    <Brain className="h-5 w-5 flex-shrink-0 transition-colors duration-300" />
                    <span className="hidden lg:inline transition-colors duration-300">Mental Wellness</span>
                    <span className="lg:hidden hidden sm:inline transition-colors duration-300">Mental</span>
                    <span className="sm:hidden">🧠</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="career"
                    className="tab-trigger focus:outline-none data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-lg text-secondary data-[state=active]:text-primary font-semibold rounded-xl py-2 px-3 hover:scale-[1.01] hover:bg-white/10 hover:shadow-lg flex items-center justify-center gap-2 mx-1 transition-all duration-300 ease-out group-hover:!bg-white/10 group-hover:data-[state=active]:!bg-white/10 group-hover:data-[state=active]:border-white/30 group-hover:data-[state=active]:border"
                  >
                    <Briefcase className="h-5 w-5 flex-shrink-0 transition-colors duration-300" />
                    <span className="hidden lg:inline transition-colors duration-300">Career Guidance</span>
                    <span className="lg:hidden hidden sm:inline transition-colors duration-300">Career</span>
                    <span className="sm:hidden">💼</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="entrepreneurship"
                    className="tab-trigger focus:outline-none data-[state=active]:bg-white/30 data-[state=active]:backdrop-blur-xl data-[state=active]:shadow-lg text-secondary data-[state=active]:text-primary font-semibold rounded-xl py-2 px-3 hover:scale-[1.01] hover:bg-white/10 hover:shadow-lg flex items-center justify-center gap-2 mx-1 transition-all duration-300 ease-out group-hover:!bg-white/10 group-hover:data-[state=active]:!bg-white/10 group-hover:data-[state=active]:border-white/30 group-hover:data-[state=active]:border"
                  >
                    <TrendingUp className="h-5 w-5 flex-shrink-0 transition-colors duration-300" />
                    <span className="hidden lg:inline transition-colors duration-300">Entrepreneurship</span>
                    <span className="lg:hidden hidden sm:inline transition-colors duration-300">Business</span>
                    <span className="sm:hidden">📈</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mental" className="mt-6 tab-content group/tab flex-1 overflow-auto">
                  <div className="text-center py-6">
                    <div className="glass-panel rounded-3xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl animate-gentle-bounce group-hover:scale-[1.05] group-hover:shadow-3xl group-hover:bg-white/10 group-hover/tab:scale-[1.05] group-hover/tab:shadow-3xl transition-all duration-500 ease-out">
                      <Brain className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Mental Wellness Support</h3>
                    <p className="text-secondary text-base leading-relaxed max-w-2xl mx-auto">
                      Navigate your emotional journey with personalized guidance for stress management, mindfulness
                      practices, and building resilience for a healthier mindset.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="career" className="mt-6 tab-content group/tab flex-1 overflow-auto">
                  <div className="text-center py-6">
                    <div className="glass-panel rounded-3xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl animate-gentle-bounce group-hover:scale-[1.05] group-hover:shadow-3xl group-hover:bg-white/10 group-hover/tab:scale-[1.05] group-hover/tab:shadow-3xl transition-all duration-500 ease-out">
                      <Briefcase className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Career Guidance</h3>
                    <p className="text-secondary text-base leading-relaxed max-w-2xl mx-auto">
                      Unlock your professional potential with expert advice on career transitions, skill development,
                      interview preparation, and strategic career planning.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="entrepreneurship" className="mt-6 tab-content group/tab flex-1 overflow-auto">
                  <div className="text-center py-6">
                    <div className="glass-panel rounded-3xl p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-2xl animate-gentle-bounce group-hover:scale-[1.05] group-hover:shadow-3xl group-hover:bg-white/10 group-hover/tab:scale-[1.05] group-hover/tab:shadow-3xl transition-all duration-500 ease-out">
                      <TrendingUp className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Entrepreneurship Guidance</h3>
                    <p className="text-secondary text-base leading-relaxed max-w-2xl mx-auto">
                      Transform your innovative ideas into successful ventures with comprehensive guidance on business
                      strategy, funding, market analysis, and growth planning.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mb-6">
              <form onSubmit={handleSubmit}>
                <div className="input-container backdrop-blur-3xl border rounded-3xl flex items-center p-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-3xl"></div>

                  <MessageSquare className="h-5 w-5 text-muted ml-4 mr-3 relative z-10" />
                  <Input
                    type="text"
                    placeholder="Share what's on your mind..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-muted text-base font-medium relative z-10 h-10 py-2"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim()}
                    className="glass-button rounded-xl button-gradient text-white dark:text-white shadow-xl h-10 w-10 relative z-10 border border-gray-200 dark:border-white/20 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="quick-action glass-panel rounded-xl p-2 shadow-lg cursor-pointer">
                <p className="text-secondary text-xs">💭 Quick mood check</p>
              </div>
              <div className="quick-action glass-panel rounded-xl p-2 shadow-lg cursor-pointer">
                <p className="text-secondary text-xs">🎯 Set career goals</p>
              </div>
              <div className="quick-action glass-panel rounded-xl p-2 shadow-lg cursor-pointer">
                <p className="text-secondary text-xs">🚀 Business idea validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <WithAuth>
      <DashboardComponent />
    </WithAuth>
  )
}
