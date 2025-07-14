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
  Users,
  CheckCircle,
  MessageSquare,
  Zap,
  Heart,
  Target,
  Award,
  ChevronDown,
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
            <div className="flex justify-between items-center h-16 gap-8 lg:gap-16">
              <div className="flex items-center gap-3">
                <div className="navbar-glass-panel p-2 rounded-xl shadow-lg animate-gentle-bounce">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="hidden md:flex items-center gap-12 flex-1 justify-center">
                <a href="#features" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors">
                  How it Works
                </a>
                <a href="#faq" className="text-secondary hover:text-[rgb(4,131,131)] transition-colors">
                  FAQ
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push("/auth")}
                  className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-xl rounded-xl px-6 py-2 font-semibold border border-primary/30 hover:scale-105 transition-all duration-300"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
                  Your AI-Powered
                  <br />
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    Life Companion
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-secondary leading-relaxed">
                  Navigate life's challenges with personalized AI guidance for career growth, resume building, and
                  entrepreneurial success.
                </p>
                <p className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed">
                  Available 24/7, completely private, and tailored just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    onClick={() => router.push("/auth?mode=register")}
                    className="bg-[rgb(4,131,131)] hover:bg-[rgb(3,110,110)] text-white shadow-2xl rounded-2xl px-8 py-4 text-md font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 group"
                  >
                    Start Your Journey Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-sm text-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Start free
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Instant career guidance
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
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
                        <div className="text-primary font-semibold">AI Counselor</div>
                        <div className="text-xs text-muted">Online now</div>
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

        {/* Trust Indicators */}
        <section id="why-users-love-guidly" className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Why You’ll Love Guidly</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Guidly is your personal career co-pilot — helping you explore career paths, craft standout resumes, and move forward with clarity.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-center">
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 w-full sm:w-1/2 md:w-1/3">
                <div className="text-3xl font-bold text-primary mb-2">AI-Powered Guidance</div>
                <div className="text-secondary text-sm">Personalized insights for your career journey</div>
              </div>
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 w-full sm:w-1/2 md:w-1/3">
                <div className="text-3xl font-bold text-primary mb-2">Resume Builder</div>
                <div className="text-secondary text-sm">Create compelling resumes in minutes</div>
              </div>
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 w-full sm:w-1/2 md:w-1/3">
                <div className="text-3xl font-bold text-primary mb-2">Always Available</div>
                <div className="text-secondary text-sm">Your 24/7 career assistant</div>
              </div>
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 w-full sm:w-1/2 md:w-1/3">
                <div className="text-3xl font-bold text-primary mb-2">Built for Everyone</div>
                <div className="text-secondary text-sm">From students to professionals to career switchers</div>
              </div>
              <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300 w-full sm:w-1/2 md:w-1/3">
                <div className="text-3xl font-bold text-primary mb-2">Zero Pressure</div>
                <div className="text-secondary text-sm">Start free, explore at your own pace</div>
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
                Get started in minutes and begin your transformation journey with AI-powered guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in-up">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Sign Up</h3>
                <p className="text-secondary leading-relaxed">
                  Create your account and tell us about your goals, challenges, and what you'd like to work on.
                </p>
              </div>

              <div className="text-center animate-fade-in-up delay-200">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">AI Analysis</h3>
                <p className="text-secondary leading-relaxed">
                  Our advanced AI analyzes your situation and creates a personalized guidance plan tailored to you.
                </p>
              </div>

              <div className="text-center animate-fade-in-up delay-400">
                <div className="glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[rgb(4,131,131)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">Grow & Thrive</h3>
                <p className="text-secondary leading-relaxed">
                  Receive ongoing support, track your progress, and achieve your personal and professional goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Three Pillars of Growth</h2>
              <p className="text-xl text-secondary max-w-3xl mx-auto">
                Comprehensive AI guidance tailored to your unique journey and aspirations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Mental Wellness */}
              <div className="glass-panel rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 group animate-fade-in-up">
                <div className="glass-panel rounded-3xl p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 text-center">Mental Wellness</h3>
                <p className="text-secondary text-center leading-relaxed mb-6">
                  Navigate emotional challenges with AI-powered mindfulness practices, stress management techniques, and
                  personalized mental health support.
                </p>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Stress & anxiety management
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Mindfulness & meditation guidance
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Emotional regulation techniques
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Crisis support & coping strategies
                  </li>
                </ul>
              </div>

              {/* Career Guidance */}
              <div className="glass-panel rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 group animate-fade-in-up delay-200">
                <div className="glass-panel rounded-3xl p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 text-center">Career Guidance</h3>
                <p className="text-secondary text-center leading-relaxed mb-6">
                  Accelerate your professional growth with strategic career planning, skill development, and interview
                  preparation powered by AI insights.
                </p>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Career transition planning
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Skill gap analysis & development
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Interview & resume optimization
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Salary negotiation strategies
                  </li>
                </ul>
              </div>

              {/* Entrepreneurship */}
              <div className="glass-panel rounded-3xl p-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 group animate-fade-in-up delay-400">
                <div className="glass-panel rounded-3xl p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4 text-center">Entrepreneurship</h3>
                <p className="text-secondary text-center leading-relaxed mb-6">
                  Transform innovative ideas into successful ventures with AI-driven business strategy, market analysis,
                  and growth planning.
                </p>
                <ul className="space-y-3 text-sm text-secondary">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Business idea validation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Market analysis & strategy
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Funding & growth planning
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Pitch deck & investor prep
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass-panel rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-panel rounded-xl p-3 w-12 h-12 mb-4 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2">{feature.title}</h4>
                  <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
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
                  question: "Is Guidly really free?",
                  answer:
                    "Yes! Guidly offers a comprehensive free plan that includes unlimited basic conversations with our AI counselor. Premium features like advanced analytics and priority support are available with our paid plans.",
                },
                {
                  question: "How private and secure are my conversations?",
                  answer:
                    "Your privacy is our top priority. All conversations are encrypted end-to-end, and we never share your personal information with third parties. Our AI processes your data locally and securely.",
                },
                {
                  question: "Can Guidly replace human therapy?",
                  answer:
                    "Guidly is designed to complement, not replace, professional therapy. While our AI provides valuable support and guidance, we always recommend consulting with licensed professionals for serious mental health concerns.",
                },
                {
                  question: "How does the AI understand my specific situation?",
                  answer:
                    "Our AI is trained on thousands of counseling sessions and psychological frameworks. It learns from your conversations to provide increasingly personalized guidance while maintaining complete privacy.",
                },
                {
                  question: "What if I need help outside business hours?",
                  answer:
                    "That's the beauty of AI! Guidly is available 24/7, 365 days a year. Whether it's 3 AM or during holidays, your AI counselor is always ready to help.",
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

        {/* Newsletter Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Stay Updated</h2>
              <p className="text-xl text-secondary mb-8">
                Get the latest tips, insights, and updates on personal growth and AI-powered guidance
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 glass-panel border-primary/20 rounded-xl h-12 text-primary placeholder:text-primary/50"
                  required
                />
                <Button
                  type="submit"
                  className="bg-primary/90 hover:bg-primary text-white shadow-xl rounded-xl px-6 py-3 font-semibold border border-primary/30 hover:scale-105 transition-all duration-300"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-secondary mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-panel rounded-3xl p-12 shadow-2xl animate-fade-in-up relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl"></div>
              <div className="relative z-10">
                <Award className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Ready to Transform Your Life?</h2>
                <p className="text-xl text-secondary mb-8 leading-relaxed">
                  Join thousands of users who have already started their journey towards personal and professional
                  growth with Guidly's AI-powered guidance. Your transformation begins with a single conversation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => router.push("/auth?mode=register")}
                    className="bg-primary/90 hover:bg-primary text-white shadow-2xl rounded-2xl px-12 py-4 text-xl font-semibold border border-primary/30 hover:scale-105 transition-all duration-300 group"
                  >
                    Start Your Journey Free
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <div className="text-sm text-secondary">✨ No credit card required • Free forever plan available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="glass-panel p-2 rounded-xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-primary">Guidly</span>
                    <div className="text-xs text-muted">AI Life Companion</div>
                  </div>
                </div>
                <p className="text-secondary mb-4 max-w-md">
                  Empowering lives through AI-powered guidance for mental wellness, career growth, and entrepreneurial
                  success.
                </p>
                <div className="flex items-center gap-4">
                  <div className="glass-panel p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="glass-panel p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="glass-panel p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-primary font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-secondary text-sm">
                  <li>
                    <a href="#features" className="hover:text-primary transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-primary font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-secondary text-sm">
                  <li>
                    <a href="#faq" className="hover:text-primary transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
              <div className="flex items-center gap-6 text-secondary text-sm mb-4 md:mb-0">
                <button className="hover:text-primary transition-colors">Privacy Policy</button>
                <button className="hover:text-primary transition-colors">Terms of Service</button>
                <button className="hover:text-primary transition-colors">Cookie Policy</button>
              </div>
              <div className="text-secondary text-sm">
                © 2024 Guidly. All rights reserved. Made with ❤️ for human growth.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
