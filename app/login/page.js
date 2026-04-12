"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-700">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <h1 className="text-[10px] md:text-[11px] font-bold tracking-[0.5em] text-brand-green/60 uppercase mb-4">Vriddhi Vastra</h1>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-gray-900 tracking-tighter">Admin Portal</h2>
          <p className="text-gray-400 mt-4 text-[12px] md:text-[13px] font-medium tracking-wide text-balance">Enter your credentials to access the digital archive.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] md:rounded-[56px] shadow-2xl shadow-black/5 border border-gray-100/50 p-8 md:p-12 relative overflow-hidden group">
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-1000 group-hover:bg-brand-gold/10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-green/5 rounded-full -ml-16 -mb-16 blur-3xl transition-all duration-1000 group-hover:bg-brand-green/10"></div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            
            {error && (
              <div className="bg-red-50 text-red-500 text-[11px] font-bold tracking-wider uppercase p-4 rounded-2xl text-center border border-red-100 animate-in shake duration-500">
                {error}
              </div>
            )}


            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase ml-4">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#F9F8F6] border border-transparent rounded-3xl pl-8 pr-16 py-5 text-gray-900 placeholder-gray-300 focus:bg-white focus:border-brand-green/20 focus:ring-4 focus:ring-brand-green/5 transition-all outline-none font-medium text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black hover:bg-brand-green text-white py-6 rounded-3xl text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 group/btn overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating
                  </>
                ) : (
                  <>
                    Unlock Access
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-[9px] md:text-[10px] text-gray-300 font-bold tracking-[0.3em] uppercase opacity-60">
          Protected by vriddhi vastra security protocols
        </div>
      </div>
    </div>
  )
}