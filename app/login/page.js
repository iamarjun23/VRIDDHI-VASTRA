"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  const [view, setView] = useState('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

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
        if (data && data.logo) setLogo(data.logo)
      })
      .catch(() => {})

    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setLoading(true); setError(""); setMessage("")
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
    } catch {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault()
    setLoading(true); setError(""); setMessage("")
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
    } catch {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault()
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return }
    setLoading(true); setError(""); setMessage("")
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
    } catch {
      setError("A connection error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-dm-sans selection:bg-[#c39b56]/30 selection:text-[#F5F5F0] overflow-hidden relative flex flex-col md:flex-row">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,20,10,0.6)_0%,rgba(10,10,10,1)_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-[#c39b56]/6 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c39b56]/3 rounded-full blur-[120px]" />
      </div>

      {/* ─── LEFT: Brand Panel (md and up) ──────────────────────────────── */}
      <div className="hidden md:flex relative z-10 w-[52%] lg:w-[58%] shrink-0 flex-col justify-between p-10 lg:p-20 border-r border-white/[0.04]">

        {/* Brand top */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <div className="relative w-12 h-12 shrink-0">
            <div className="absolute inset-0 bg-[#c39b56]/25 rounded-full blur-xl" />
            <Image
              src={logo && !logoError ? logo : "/images/Lotus.png"}
              alt="Vriddhi Vastra"
              fill
              className="object-contain relative z-10 brightness-110"
              onError={() => setLogoError(true)}
              priority
            />
          </div>
          <div>
            <p className="font-dm-serif text-[17px] tracking-[0.2em] uppercase text-[#F5F5F0]">Vriddhi Vastra</p>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#c39b56]/70 mt-0.5 font-dm-sans">Admin Panel</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-dm-serif text-[clamp(3rem,5vw,5.5rem)] leading-[1.05] text-balance text-[#F5F5F0]">
            Curating the<br />
            <span className="text-[#c39b56]/70 italic">Digital Archive</span>
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-[#c39b56]/60 to-transparent mt-8" />
          <p className="mt-6 text-[13px] text-[#F5F5F0]/40 font-dm-sans leading-relaxed max-w-sm">
            Secure access to your luxury saree management platform. All data is encrypted and session-protected.
          </p>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#F5F5F0]/30 font-dm-sans">System Time</span>
            <span className="text-[12px] font-mono tracking-widest text-[#F5F5F0]/60">{currentTime}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#F5F5F0]/30 font-dm-sans">Secured Platform</span>
          </div>
        </motion.div>
      </div>

      {/* ─── RIGHT: Auth Panel ───────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-screen p-5 sm:p-8 md:p-12">

        {/* Mobile-only brand header */}
        <motion.div
          className="md:hidden flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 bg-[#c39b56]/20 rounded-full blur-xl" />
            <Image
              src={logo && !logoError ? logo : "/images/Lotus.png"}
              alt="Vriddhi Vastra"
              fill
              className="object-contain relative z-10 brightness-110"
              onError={() => setLogoError(true)}
            />
          </div>
          <p className="font-dm-serif text-[18px] tracking-[0.25em] uppercase text-[#F5F5F0]">Vriddhi Vastra</p>
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#c39b56]/60 mt-1 font-dm-sans">Admin Panel</p>
          <div className="w-12 h-px bg-[#c39b56]/30 mt-4" />
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[440px]"
        >
          <div className="relative bg-[#141414] border border-white/[0.08] rounded-3xl p-7 sm:p-10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.7)]">
            {/* Gold top edge */}
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#c39b56]/50 to-transparent rounded-full" />

            {/* Header */}
            <div className="mb-8">
              <h2 className="font-dm-serif text-[clamp(22px,4vw,30px)] text-[#F5F5F0] leading-tight">
                {view === 'login' && 'Sign In'}
                {view === 'forgot' && 'Forgot Password'}
                {view === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-[11px] text-[#F5F5F0]/40 mt-2 tracking-[0.15em] uppercase font-dm-sans">
                {view === 'login' && "Enter your password to continue"}
                {view === 'forgot' && "We'll send a reset code to your email"}
                {view === 'reset' && "Enter the code and choose a new password"}
              </p>
            </div>

            {/* Alert Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-dm-sans font-semibold tracking-wider p-4 rounded-2xl text-center">
                    {error}
                  </div>
                </motion.div>
              )}
              {message && (
                <motion.div
                  key="msg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="bg-[#c39b56]/10 border border-[#c39b56]/20 text-[#c39b56] text-[11px] font-dm-sans font-semibold tracking-wider p-4 rounded-2xl text-center">
                    {message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Views */}
            <AnimatePresence mode="wait">
              {view === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-6"
                >
                  <FieldInput
                    label="Password"
                    id="security-key"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#F5F5F0]/30 hover:text-[#c39b56] transition-colors"
                        tabIndex={-1}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    }
                  />

                  <div className="flex justify-end -mt-2">
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(""); setMessage("") }}
                      className="text-[10px] font-dm-sans font-semibold tracking-[0.15em] text-[#F5F5F0]/35 hover:text-[#c39b56] transition-colors uppercase"
                    >
                      Forgot Password
                    </button>
                  </div>

                  <PrimaryButton loading={loading} label="Sign In" />
                </motion.form>
              )}

              {view === 'forgot' && (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleForgotPassword}
                  className="flex flex-col gap-6"
                >
                  <FieldInput
                    label="Admin Email"
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <PrimaryButton loading={loading} label="Send Reset Code" />
                  <BackLink onClick={() => { setView('login'); setError(""); setMessage("") }} label="Back to Sign In" />
                </motion.form>
              )}

              {view === 'reset' && (
                <motion.form
                  key="reset"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleResetPassword}
                  className="flex flex-col gap-5"
                >
                  <FieldInput
                    label="Reset Code"
                    id="otp"
                    type="text"
                    maxLength={8}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    centered
                  />
                  <FieldInput
                    label="New Password"
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <FieldInput
                    label="Confirm Password"
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <PrimaryButton loading={loading} label="Reset Password" />
                  <BackLink onClick={() => { setView('login'); setError(""); setMessage("") }} label="Cancel" />
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile system time */}
          <p className="md:hidden text-center mt-6 font-mono text-[10px] text-[#F5F5F0]/20 tracking-widest">
            {currentTime}
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function FieldInput({ label, id, type, value, onChange, required, maxLength, rightSlot, centered }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-[10px] font-dm-sans font-bold tracking-[0.25em] uppercase text-[#c39b56]/70 mb-2"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          className={`w-full bg-[#0D0D0D] border border-[#2A2A2A] focus:border-[#c39b56]/60 focus:ring-2 focus:ring-[#c39b56]/10 rounded-xl px-4 py-3.5 text-[#F5F5F0] text-[14px] font-dm-sans outline-none transition-all placeholder-[#F5F5F0]/20 ${centered ? 'text-center tracking-[0.5em] font-bold text-lg' : ''} ${rightSlot ? 'pr-12' : ''}`}
          placeholder={centered ? "• • • • • • • •" : ""}
          autoComplete="off"
        />
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  )
}

function PrimaryButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="relative w-full bg-[#F5F5F0] hover:bg-white text-[#0A0A0A] py-4 rounded-xl text-[11px] font-dm-sans font-bold tracking-[0.35em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group mt-1"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c39b56]/20 to-transparent -translate-x-full group-hover:[animation:shimmer_1.5s_ease_forwards]" />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-[#0A0A0A]/20 border-t-[#0A0A0A] rounded-full animate-spin" />
        ) : (
          <>
            {label}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </span>
    </button>
  )
}

function BackLink({ onClick, label }) {
  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onClick}
        className="text-[10px] font-dm-sans font-semibold tracking-[0.2em] text-[#F5F5F0]/30 hover:text-[#F5F5F0]/60 transition-colors uppercase"
      >
        {label}
      </button>
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