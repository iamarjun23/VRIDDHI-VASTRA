"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  // Views: 'login', 'forgot', 'reset'
  const [view, setView] = useState('login')

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [logo, setLogo] = useState(null)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.logo) {
          setLogo(data.logo);
        }
      })
      .catch(err => console.error("Failed to load login logo", err));

    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push("/admin")
      } else {
        const data = await res.json()
        setError(data.error || "Invalid credentials. Access denied.")
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || "OTP sent to email")
        setView('reset')
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Password reset successfully. You can now login.")
        setView('login')
        setPassword("")
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans selection:bg-[#c39b56]/30 selection:text-[#F5F5F0] overflow-hidden relative flex flex-col md:flex-row">

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(19,19,19,0)_0%,rgba(10,10,10,1)_100%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(300px,80vw,800px)] h-[clamp(300px,80vw,800px)] bg-[#c39b56]/5 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Mobile-Only Header */}
      <div className="md:hidden relative z-20 flex flex-col items-center pt-12 pb-4 px-6">
        <div className="relative w-16 h-16 mb-4">
          <Image 
            src={logo && !logoError ? logo : "/images/Lotus.png"} 
            alt="Vriddhi Vastra" 
            fill 
            className="object-contain brightness-[1.2]" 
            onError={() => setLogoError(true)}
          />
        </div>
        <h1 className="text-xl font-display tracking-[0.3em] uppercase text-[#F5F5F0]">Vriddhi Vastra</h1>
        <div className="w-12 h-[1px] bg-[#c39b56] mt-3 opacity-50"></div>
      </div>

      {/* Left Side: Brand Atmosphere (Desktop ONLY) */}
      <div className="hidden md:flex relative z-10 w-full md:w-1/2 lg:w-[60%] flex-col justify-between p-8 md:p-16 lg:p-24 overflow-hidden">

        {/* Top: Logo & System Identity */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 group">
            <div className="absolute inset-0 bg-[#c39b56]/20 rounded-full blur-2xl group-hover:bg-[#c39b56]/30 transition-all duration-1000"></div>
            <Image
              src={logo && !logoError ? logo : "/images/Lotus.png"}
              alt="Vriddhi Vastra"
              fill
              className="object-contain relative z-10 brightness-[1.2]"
              onError={() => setLogoError(true)}
              priority
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display tracking-[0.3em] uppercase text-[#F5F5F0]">Vriddhi Vastra</h1>
            <p className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-[#c39b56] mt-2 font-medium">Private Operations Console</p>
          </div>
        </motion.div>

        {/* Middle: Cinematic Statement */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="my-12 md:my-0"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.1] text-balance">
            Curating the <br />
            <span className="text-[#c39b56]/80 italic">Digital Archive</span>
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-[#c39b56] to-transparent mt-8"></div>
        </motion.div>

        {/* Bottom: Operational Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-4 md:gap-8 items-center"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#F5F5F0]/40">System Time</span>
            <span className="text-xs font-mono tracking-widest text-[#F5F5F0]/80">{currentTime}</span>
          </div>

          <div className="flex gap-3">
            <StatusPill label="Secure Session" active />
            <StatusPill label="MongoDB" active />
            <StatusPill label="Cloudinary" active />
            <StatusPill label="Production" active gold />
          </div>
        </motion.div>
      </div>

      {/* Right Side: Auth Panel (Centered on Mobile) */}
      <div className="relative z-10 w-full md:w-1/2 lg:w-[40%] flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[480px] relative"
        >
          {/* Glass Card */}
          <div className="relative bg-[#1A1A1A]/60 backdrop-blur-3xl rounded-[32px] border border-[#F5F5F0]/10 p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden group">

            {/* Subtle Gold Edge Lighting */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c39b56]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#c39b56]/20 to-transparent"></div>

            {/* Form Header */}
            <div className="mb-10">
              <h3 className="text-3xl font-display tracking-tight text-[#F5F5F0] leading-tight">Access Platform</h3>
              <p className="text-[11px] text-[#F5F5F0]/50 mt-3 tracking-luxury uppercase">
                {view === 'login' && "Authentication required for secure access"}
                {view === 'forgot' && "Initiate administrative recovery"}
                {view === 'reset' && "Verification complete. Define security"}
              </p>
            </div>

            {/* Error/Message Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold tracking-widest uppercase p-4 rounded-xl text-center">
                    {error}
                  </div>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-[#c39b56]/10 border border-[#c39b56]/20 text-[#c39b56] text-[10px] font-bold tracking-widest uppercase p-4 rounded-xl text-center">
                    {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Views */}
            <AnimatePresence mode="wait">
              {view === 'login' && (
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleLogin}
                  className="space-y-8"
                >
                  <div className="relative group">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-[#0A0A0A]/40 border border-[#F5F5F0]/10 rounded-2xl px-6 py-5 text-[#F5F5F0] outline-none transition-all focus:border-[#c39b56]/50 focus:bg-[#0A0A0A]/60 focus:ring-4 focus:ring-[#c39b56]/5 placeholder-transparent"
                    />
                    <label className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 uppercase transition-all pointer-events-none peer-focus:top-0 peer-focus:text-[#c39b56] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[#c39b56]">
                      Security Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[#F5F5F0]/30 hover:text-[#c39b56] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(""); setMessage(""); }}
                      className="text-[9px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 hover:text-[#c39b56] transition-colors uppercase"
                    >
                      Recovery Access
                    </button>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="group/btn relative w-full bg-[#F5F5F0] hover:bg-white text-[#0A0A0A] py-5 rounded-2xl text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-500 overflow-hidden disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c39b56]/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                    <span className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-[#0A0A0A]/20 border-t-[#0A0A0A] rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Enter Console
                          <ArrowRightIcon className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </motion.form>
              )}

              {view === 'forgot' && (
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-8"
                >
                  <div className="relative group">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-[#0A0A0A]/40 border border-[#F5F5F0]/10 rounded-2xl px-6 py-5 text-[#F5F5F0] outline-none transition-all focus:border-[#c39b56]/50 focus:bg-[#0A0A0A]/60 focus:ring-4 focus:ring-[#c39b56]/5 placeholder-transparent"
                    />
                    <label className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 uppercase transition-all pointer-events-none peer-focus:top-0 peer-focus:text-[#c39b56] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[#c39b56]">
                      Admin Email
                    </label>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#F5F5F0] hover:bg-white text-[#0A0A0A] py-5 rounded-2xl text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-500 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Initiate Recovery"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError(""); setMessage(""); }}
                      className="text-[9px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors uppercase"
                    >
                      Return to Console
                    </button>
                  </div>
                </motion.form>
              )}

              {view === 'reset' && (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-[#0A0A0A]/40 border border-[#F5F5F0]/10 rounded-2xl px-6 py-5 text-[#F5F5F0] outline-none transition-all focus:border-[#c39b56]/50 focus:bg-[#0A0A0A]/60 focus:ring-4 focus:ring-[#c39b56]/5 text-center tracking-[1em] font-bold text-xl placeholder-transparent"
                    />
                    <label className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 uppercase transition-all pointer-events-none peer-focus:top-0 peer-focus:text-[#c39b56] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[#c39b56]">
                      Security OTP
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      required
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-[#0A0A0A]/40 border border-[#F5F5F0]/10 rounded-2xl px-6 py-5 text-[#F5F5F0] outline-none transition-all focus:border-[#c39b56]/50 focus:bg-[#0A0A0A]/60 focus:ring-4 focus:ring-[#c39b56]/5 placeholder-transparent"
                    />
                    <label className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 uppercase transition-all pointer-events-none peer-focus:top-0 peer-focus:text-[#c39b56] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[#c39b56]">
                      New Security Key
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=" "
                      className="peer w-full bg-[#0A0A0A]/40 border border-[#F5F5F0]/10 rounded-2xl px-6 py-5 text-[#F5F5F0] outline-none transition-all focus:border-[#c39b56]/50 focus:bg-[#0A0A0A]/60 focus:ring-4 focus:ring-[#c39b56]/5 placeholder-transparent"
                    />
                    <label className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 uppercase transition-all pointer-events-none peer-focus:top-0 peer-focus:text-[#c39b56] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[#c39b56]">
                      Confirm Key
                    </label>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-[#F5F5F0] hover:bg-white text-[#0A0A0A] py-5 rounded-2xl text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-500 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Establish Access"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError(""); setMessage(""); }}
                      className="text-[9px] font-bold tracking-[0.2em] text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Environment Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 flex justify-between items-center px-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-50">Session ID</span>
              <span className="text-[10px] font-mono tracking-widest uppercase">{Math.random().toString(36).substring(2, 10)}</span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-50 block">Encryption</span>
              <span className="text-[10px] font-mono tracking-widest uppercase">AES-256-GCM</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

function StatusPill({ label, active, gold }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${gold ? 'border-[#c39b56]/30 bg-[#c39b56]/5' : 'border-[#F5F5F0]/10 bg-[#F5F5F0]/5'} backdrop-blur-md`}>
      <div className={`w-1 h-1 rounded-full ${gold ? 'bg-[#c39b56]' : 'bg-green-400'} ${active ? 'animate-pulse' : ''} shadow-[0_0_8px_rgba(195,155,86,0.5)]`}></div>
      <span className={`text-[9px] font-bold tracking-widest uppercase ${gold ? 'text-[#c39b56]' : 'text-[#F5F5F0]/60'}`}>{label}</span>
    </div>
  )
}

function EyeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EyeOffIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}