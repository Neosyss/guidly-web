"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  Brain,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Shield,
  Clock,
  User,
  FileText,
  Trophy,
  Users,
  CheckCircle,
  MessageSquare,
  Heart,
  Target,
  Award,
  ChevronDown,
  Linkedin,
  Instagram,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("guidly_authenticated")
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [router])

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Psychology",
      description: "Our AI is trained on thousands of counseling sessions and psychological frameworks",
    },
    {
      icon: Shield,
      title: "100% Private & Secure",
      description: "End-to-end encryption ensures your conversations remain completely confidential",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get support whenever you need it, day or night, across all time zones",
    },
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "AI adapts to your unique situation, goals, and communication style",
    },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
    // Show success message or handle signup
  }

  return (
    <div className="min-h-screen app-bg relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-900 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-green-200 dark:bg-green-900 opacity-15 dark:opacity-8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 dark:bg-yellow-900 opacity-10 dark:opacity-5 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Navigation - Fixed at top */}
        <nav className="navbar-glass-panel rounded-2xl fixed top-4 left-1/2 transform -translate-x-1/2 z-50 shadow-2xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-4 sm:gap-6 lg:gap-8 xl:gap-16">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl animate-gentle-bounce">
                  <img 
                    src="/guidly_logos/Guidly/Guidly-Logo.png" 
                    alt="Guidly Logo" 
                    className="h-10 min-h-[2.5rem] w-auto object-contain max-w-[160px] sm:max-w-[180px]"
                  />
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-12 flex-1 justify-center">
                <a href="#features" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors whitespace-nowrap">
                  Features
                </a>
                <a href="#why-users-love-guidly" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors whitespace-nowrap">
                  Why Choose Guidly
                </a>
                <a href="#how-it-works" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors whitespace-nowrap">
                  How it Works
                </a>
                <a href="#faq" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors whitespace-nowrap">
                  FAQ
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push("/auth")}
                  className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-xl rounded-xl px-6 py-2 font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section - Add top padding to account for fixed header */}
        <section className="pt-36 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
                  Your AI-Powered
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    Life Companion
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-secondary mb-4 leading-relaxed">
                  Navigate life's challenges with personalized AI guidance for career growth, resume building, and
                  entrepreneurial success.
                </p>
                <p className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed">
                  Available 24/7, completely private, and tailored just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    onClick={() => router.push("/auth?mode=register")}
                    className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-2xl rounded-2xl px-8 py-6 text-md font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 group"
                  >
                    Start Your Journey Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 text-sm text-secondary text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                    Start free
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                    Instant career guidance
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                    Cancel anytime
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="animate-fade-in-up delay-200">
                <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="glass-panel p-2 rounded-xl">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-primary font-semibold">Career Guidance</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="glass-panel rounded-2xl p-4 ml-8">
                        <p className="text-primary text-sm">
                          I'm feeling overwhelmed with my career transition. Can you help me create a plan?
                        </p>
                      </div>
                      <div className="glass-panel rounded-2xl p-4 mr-8 bg-primary/10">
                        <p className="text-primary text-sm">
                          I understand this is a challenging time. Let's break down your transition into manageable
                          steps. First, let's identify your core strengths and values...
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-muted text-xs">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[rgb(4,131,131)] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[rgb(4,131,131)] rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-[rgb(4,131,131)] rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span>AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why You'll Love Guidly - Enhanced Combined Section */}
        <section id="why-users-love-guidly" className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Why You'll Love Guidly</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Your complete career transformation toolkit with AI-powered resume building, personalized guidance, and round-the-clock support.
              </p>
            </div>
            
            {/* Main Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up">
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">AI Resume Builder</h4>
                <p className="text-secondary leading-relaxed">
                  Create professionally crafted resumes in minutes with AI optimization for your target roles and industries.
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Career Guidance</h4>
                <p className="text-secondary leading-relaxed">
                  Get personalized career advice, strategic planning, and skill development recommendations tailored to your goals.
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">24/7 Availability</h4>
                <p className="text-secondary leading-relaxed">
                  Get support whenever you need it, day or night, across all time zones. Your AI career coach never sleeps.
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">100% Private & Secure</h4>
                <p className="text-secondary leading-relaxed">
                  End-to-end encryption ensures your conversations and career information remain completely confidential.
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Interview Preparation</h4>
                <p className="text-secondary leading-relaxed">
                  Get ready for interviews with AI-powered practice sessions, common question prep, and confidence-building techniques.
                </p>
              </div>
              
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">Built for Everyone</h4>
                <p className="text-secondary leading-relaxed">
                  Whether you're a student, professional, or career changer, Guidly adapts to your experience level and goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">How Guidly Works</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Transform your career in three simple steps with AI-powered resume building and personalized career guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center animate-fade-in-up">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Tell Guidly Your Story</h3>
                <p className="text-secondary leading-relaxed">
                  Tell Guidly about your experience, skills, career goals, and the type of roles you're targeting. Guidly learns your unique profile.
                </p>
              </div>

              <div className="text-center animate-fade-in-up delay-200">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Guidly Crafts Your Path</h3>
                <p className="text-secondary leading-relaxed">
                  Guidly analyzes your profile and creates a personalized resume, career roadmap, and tailored strategies for your success.
                </p>
              </div>

              <div className="text-center animate-fade-in-up delay-400">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Guidly Helps You Win</h3>
                <p className="text-secondary leading-relaxed">
                  Land roles with confidence using your optimized resume, interview prep tips, and ongoing career support from Guidly.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12 animate-fade-in-up delay-600">
              <Button
                onClick={() => router.push("/auth?mode=register")}
                className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-2xl rounded-2xl px-8 py-6 text-lg font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 group"
              >
                Launch Your Career Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-primary mb-4 md:mb-6">Career-Ready Features, All in One Place</h2>
              <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto px-4">
                From building your resume to preparing for interviews, Guidly gives you the tools to take on every step with confidence.
              </p>
            </div>

            {/* Feature 1: Resume Builder - Text Left, Image Right */}
            <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8 md:mb-16 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                      <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">Resume Builder</h3>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-secondary leading-relaxed">
                    Create professional, ATS-optimized resumes in minutes with our AI-powered builder. Tailored for your industry, role, and experience level.
                  </p>
                  <ul className="space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg text-secondary">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      ATS-friendly templates optimized for modern hiring systems
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      AI-powered content suggestions based on your role
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Industry-specific keywords and formatting
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Real-time optimization and improvement suggestions
                    </li>
                  </ul>
                </div>
                <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
                  <img 
                    src="/placeholder.jpg" 
                    alt="AI Resume Builder Interface" 
                    className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg md:rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Feature 2: Career Guidance - Text Right, Image Left */}
            <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8 md:mb-16 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg lg:order-1">
                  <img 
                    src="/placeholder.jpg" 
                    alt="Personalized Career Guidance" 
                    className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg md:rounded-xl"
                  />
                </div>
                <div className="space-y-4 md:space-y-6 lg:order-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                      <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">Career Guidance</h3>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-secondary leading-relaxed">
                    Get personalized career advice from our AI counselor. Navigate career transitions, skill development, and strategic planning with confidence.
                  </p>
                  <ul className="space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg text-secondary">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Personalized career path recommendations
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Skills gap analysis and development roadmap
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Job market insights and salary negotiation tips
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Career transition support and strategic planning
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature 3: Mock Interview Coach - Text Left, Image Right */}
            <div className="glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8 md:mb-16 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">Mock Interview Coach</h3>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-secondary leading-relaxed">
                    Practice with our Mock Interview Coach, tailored to your role and experience. Get real-time feedback and build confidence before the big day.
                  </p>
                  <ul className="space-y-3 md:space-y-4 text-sm md:text-base lg:text-lg text-secondary">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Role-specific interview questions and scenarios
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Real-time feedback on your responses
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Behavioral and technical interview practice
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[rgb(4,131,131)] flex-shrink-0" />
                      Confidence building and communication improvement
                    </li>
                  </ul>
                </div>
                <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg">
                  <img 
                    src="/placeholder.jpg" 
                    alt="AI Mock Interview Session" 
                    className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg md:rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-secondary">Everything you need to know about Guidly</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Is Guidly free to use?",
                  answer:
                    "Guidly operates on a credit-based system. You can get started for free with a limited number of credits, which give you access to core features like resume building and basic career tools. Additional features and more usage are available through credit top-ups or subscriptions.",
                },
                {
                  question: "How does Guidly create my resume?",
                  answer:
                    "Guidly analyzes your background, skills, and target roles to create ATS-optimized resumes. It uses industry-specific templates and keywords to ensure your resume passes through applicant tracking systems and catches recruiters' attention.",
                },
                {
                  question: "What makes Guidly different from other career tools?",
                  answer:
                    "Guidly combines resume building, personalized career guidance, and interview preparation in one platform. Our AI learns your unique career story and provides tailored advice that evolves with your professional growth.",
                },
                {
                  question: "How private and secure are my conversations?",
                  answer:
                    "Your privacy is our top priority. All conversations are encrypted end-to-end, and we never share your personal information with third parties. Your career data is processed securely and remains completely confidential.",
                },
                {
                  question: "Can Guidly help me prepare for interviews?",
                  answer:
                    "Absolutely! Guidly offers personalized interview preparation including practice questions, feedback on your responses, and tips tailored to your specific role and industry. Our AI mock interviewer helps you build confidence before the real thing.",
                },
                {
                  question: "What if I need help outside business hours?",
                  answer:
                    "That's the beauty of Guidly! Our AI career companion is available 24/7, 365 days a year. Whether it's 3 AM or during holidays, Guidly is always ready to help with your career questions.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="glass-panel rounded-2xl p-6 shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <div className="flex justify-between items-center text-primary font-semibold text-lg">
                      {faq.question}
                      <ChevronDown 
                        className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                          openFaq === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openFaq === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                      }`}
                    >
                      <p className="text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-panel rounded-3xl p-12 shadow-2xl animate-fade-in-up relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl"></div>
              <div className="relative z-10">
                <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Ready to Transform Your Career?</h2>
                <p className="text-xl text-secondary mb-8 leading-relaxed">
                  Join thousands of users who have already started their journey towards career success with Guidly's AI-powered guidance. Your transformation begins with a single conversation.
                </p>
                <div className="flex flex-col gap-4 justify-center items-center">
                  <Button
                    onClick={() => router.push("/auth?mode=register")}
                    className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-2xl rounded-2xl px-8 py-6 text-md font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 group"
                  >
                    Start Your Journey Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <div className="flex items-center gap-6 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                      Start free
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                      Instant career guidance
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[rgb(4,131,131)]" />
                      Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Width Dark Grey Divider */}
        <div className="w-full">
          <hr className="border-t-2 border-gray-200" />
        </div>

        {/* Newsletter Section - Blended with Footer */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/5 dark:to-black/5">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Stay Updated</h2>
              <p className="text-xl text-secondary mb-8">
                Get the latest tips, insights, and updates on personal growth <br /> and AI-powered guidance
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 glass-panel border-primary/20 rounded-xl h-10 text-primary placeholder:text-[rgb(4,131,131)]/50"
                  required
                />
                <Button
                  type="submit"
                  className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-xl rounded-xl px-6 py-5 font-semibold border border-primary/30 hover:scale-105 transition-all duration-300"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-secondary mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
            </div>
          </div>
        </section>

        {/* Full Width Dark Grey Divider */}
        <div className="w-full">
          <hr className="border-t-2 border-gray-200" />
        </div>

        {/* Simple One-Liner Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-white/5 to-transparent dark:from-black/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Social Icons - Left */}
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="glass-panel p-2 rounded-full hover:scale-110 transition-all duration-300 shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-primary" />
                </a>
                <a 
                  href="#" 
                  className="glass-panel p-2 rounded-full hover:scale-110 transition-all duration-300 shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-primary" />
                </a>
              </div>

              {/* Company Name - Center */}
              <div className="flex items-center justify-center">
                <img 
                  src="/guidly_logos/Guidly/Guidly-Logo.png" 
                  alt="Guidly Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Copyright - Right */}
              <div className="text-secondary text-sm">
                ©2025 Guidly. All rights reserved
              </div>
              
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
