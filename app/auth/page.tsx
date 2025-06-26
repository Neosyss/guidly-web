"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, CheckCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuth, PublicRoute } from "@/contexts/AuthContext"
import { ApiError } from "@/lib/api"

const AuthPage = () => {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "register"
  const [isLogin, setIsLogin] = useState(!initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    general: "",
  })
  const [success, setSuccess] = useState("")
  
  // Use auth context
  const { login, register, loading } = useAuth()

  const handleModeChange = () => {
    setIsLogin(!isLogin)
    setErrors({ email: "", password: "", confirmPassword: "", fullName: "", dateOfBirth: "", general: "" })
    setFormData({ email: "", password: "", confirmPassword: "", fullName: "", dateOfBirth: "" })
    setSuccess("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: "", general: "" })
  }



  const validateForm = (): boolean => {
    let isValid = true
    const newErrors = { ...errors }

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Full Name is required"
        isValid = false
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required"
        isValid = false
      } else {
        // Validate date format (MM/DD/YYYY)
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/
        if (!datePattern.test(formData.dateOfBirth)) {
          newErrors.dateOfBirth = "Please enter date in MM/DD/YYYY format"
          isValid = false
        } else {
          // Parse the date and validate age
          const [month, day, year] = formData.dateOfBirth.split('/').map(Number)
          const birthDate = new Date(year, month - 1, day)
          const today = new Date()
          
          // Check if the date is valid
          if (birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day || birthDate.getFullYear() !== year) {
            newErrors.dateOfBirth = "Please enter a valid date"
            isValid = false
          } else if (birthDate > today) {
            newErrors.dateOfBirth = "Date of birth cannot be in the future"
            isValid = false
          } else if (year < 1900) {
            newErrors.dateOfBirth = "Please enter a valid year"
            isValid = false
          } else {
            // Calculate age
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--
            }
            
            if (age < 13) {
              newErrors.dateOfBirth = "You must be at least 13 years old"
              isValid = false
            } else if (age > 120) {
              newErrors.dateOfBirth = "Please enter a valid date of birth"
              isValid = false
            }
          }
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm Password is required"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSuccess("")
    setErrors({ ...errors, general: "" })

    try {
      if (isLogin) {
        // Login with real API
        await login({
          email: formData.email,
          password: formData.password,
        })
        // Success message and redirect handled by AuthContext
        setSuccess("Welcome back! Redirecting to your dashboard...")
      } else {
        // Register with real API
        // Parse the date from MM/DD/YYYY format
        const [month, day, year] = formData.dateOfBirth.split('/').map(Number)
        const birthDate = new Date(year, month - 1, day)
        const age = calculateAge(birthDate)
        
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          age: age,
        })
        
        setSuccess("Account created successfully! Please sign in with your credentials.")
        // Switch to login mode after successful registration
        setTimeout(() => {
          setIsLogin(true)
          setFormData({ 
            email: formData.email, 
            password: "", 
            confirmPassword: "", 
            fullName: "", 
            dateOfBirth: "" 
          })
          setSuccess("")
        }, 2000)
      }
    } catch (error) {
      console.error('Auth error:', error)
      
      // Handle different types of errors
      let errorMessage = isLogin ? "Login failed. Please try again." : "Registration failed. Please try again."
      
      if (error && typeof error === 'object') {
        // Check for ApiError properties
        if ('detail' in error && typeof error.detail === 'string') {
          errorMessage = error.detail
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        } else if (error instanceof Error) {
          errorMessage = error.message
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      setErrors({ ...errors, general: errorMessage })
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen app-bg relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-green-200 dark:bg-green-900 opacity-15 dark:opacity-8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className={`w-full transition-all duration-500 ${isLogin ? "max-w-md" : "max-w-2xl"}`}>
            {/* Logo Section */}
            <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-primary mb-2 drop-shadow-sm">Welcome to Neo-AI</h1>
              <p className="text-secondary text-lg">
                {isLogin ? "Sign in to continue your journey" : "Start your journey with us"}
              </p>
            </div>

            {/* Main Auth Card */}
            <div className="glass-panel rounded-3xl p-8 shadow-2xl animate-fade-in-up relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 dark:to-transparent rounded-3xl pointer-events-none group-hover:from-white/15 group-hover:to-white/5 dark:group-hover:from-white/15 dark:group-hover:to-white/5 transition-all duration-500"></div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 glass-panel rounded-2xl p-4 border border-green-500/30 bg-green-500/10 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 glass-panel rounded-2xl p-4 border border-red-500/30 bg-red-500/10 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-red-600 dark:text-red-400 font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                  <p className="text-secondary">
                    {isLogin ? "Enter your credentials to access your account" : "Fill in your details to get started"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isLogin ? (
                    // Login Form - Single Column
                    <>
                      {/* Email Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="email" className="text-primary font-medium text-sm">
                          Email Address
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Mail className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm animate-fade-in-up">{errors.email}</p>}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="password" className="text-primary font-medium text-sm">
                          Password
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Lock className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 relative z-10 text-primary/70 hover:text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm animate-fade-in-up">{errors.password}</p>}
                      </div>
                    </>
                  ) : (
                    // Register Form - Two Column Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="fullName" className="text-primary font-medium text-sm">
                          Full Name
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <User className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                        </div>
                        {errors.fullName && <p className="text-red-500 text-sm animate-fade-in-up">{errors.fullName}</p>}
                      </div>

                      {/* Date of Birth Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="dateOfBirth" className="text-primary font-medium text-sm">
                          Date of Birth
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Calendar className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <input
                            type="text"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="flex-1 bg-transparent text-primary text-sm placeholder:text-primary/50 focus:outline-none relative z-10 h-10"
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm animate-fade-in-up">{errors.dateOfBirth}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2 animate-fade-in-up md:col-span-2">
                        <label htmlFor="email" className="text-primary font-medium text-sm">
                          Email Address
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Mail className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm animate-fade-in-up">{errors.email}</p>}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="password" className="text-primary font-medium text-sm">
                          Password
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Lock className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 relative z-10 text-primary/70 hover:text-primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm animate-fade-in-up">{errors.password}</p>}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-2 animate-fade-in-up">
                        <label htmlFor="confirmPassword" className="text-primary font-medium text-sm">
                          Confirm Password
                        </label>
                        <div className="input-container backdrop-blur-3xl border rounded-2xl flex items-center p-3 shadow-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl"></div>
                          <Lock className="h-5 w-5 text-primary/70 mr-3 relative z-10" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-primary placeholder:text-primary/50 relative z-10 h-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 relative z-10 text-primary/70 hover:text-primary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm animate-fade-in-up">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full glass-button bg-primary/90 hover:bg-primary text-white shadow-xl h-12 rounded-2xl font-semibold text-base border border-primary/30 disabled:opacity-50 group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          {isLogin ? "Signing In..." : "Creating Account..."}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          {isLogin ? "Sign In" : "Create Account"}
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Toggle Auth Mode */}
                  <div className="text-center pt-4 border-t border-white/10">
                    <p className="text-secondary text-sm mb-3">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleModeChange}
                      className="text-primary hover:text-primary font-semibold hover:bg-primary/5 rounded-xl px-4 py-2 transition-all duration-300 border border-primary/20 hover:border-primary/40 hover:shadow-lg"
                    >
                      {isLogin ? "Create one here" : "Sign in instead"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in-up">
              <div className="glass-panel rounded-2xl p-4 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="glass-panel p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-medium text-sm">AI Counseling</p>
                <p className="text-muted text-xs mt-1">Mental wellness support</p>
              </div>
              <div className="glass-panel rounded-2xl p-4 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="glass-panel p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-medium text-sm">Career Guidance</p>
                <p className="text-muted text-xs mt-1">Professional growth</p>
              </div>
              <div className="glass-panel rounded-2xl p-4 text-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="glass-panel p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <p className="text-primary font-medium text-sm">Business Ideas</p>
                <p className="text-muted text-xs mt-1">Entrepreneurship help</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 animate-fade-in-up">
              <p className="text-muted text-sm">
                By continuing, you agree to our{" "}
                <button className="text-primary hover:underline font-medium">Terms of Service</button> and{" "}
                <button className="text-primary hover:underline font-medium">Privacy Policy</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}

export default AuthPage
