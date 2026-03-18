"use client"

import { useState } from "react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    message: ""
  })
  const [status, setStatus] = useState("idle") // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("submitting")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus("success")
        setFormData({ name: "", phoneNumber: "", message: "" })
        setTimeout(() => setStatus("idle"), 5000)
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setStatus("error")
    }
  }

  return (
    <div className="w-full md:w-[480px] p-8 md:p-10 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-4 right-4 text-brand-gold/40 z-0">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-50"><path d="M12 2L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 2Z"/></svg>
      </div>
      
      {status === "success" ? (
        <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <h3 className="text-2xl font-serif text-white mb-2">Message Received</h3>
          <p className="text-white/70 font-sans tracking-wide">We'll reach out to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#e6e2da] uppercase">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="Your Name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full py-4 px-6 rounded-full bg-white/10 text-white placeholder:text-white/30 border border-white/10 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white/20 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#e6e2da] uppercase">Phone Number</label>
            <input 
              required
              type="tel" 
              placeholder="Your Phone Number" 
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full py-4 px-6 rounded-full bg-white/10 text-white placeholder:text-white/30 border border-white/10 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white/20 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#e6e2da] uppercase">Your Message</label>
            <textarea 
              required
              placeholder="How can we assist you today?" 
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full py-4 px-6 rounded-[24px] bg-white/10 text-white placeholder:text-white/30 border border-white/10 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white/20 shadow-inner resize-none transition-all duration-300"
            ></textarea>
          </div>

          <div className="mt-4 flex">
            <button 
              type="submit" 
              disabled={status === "submitting"}
              className="w-full py-5 rounded-full bg-white text-[#1c1410] font-sans text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-brand-gold hover:text-white transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1c1410] border-t-transparent rounded-full animate-spin"></div>
                  Dispatching...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send Inquiry <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </span>
              )}
            </button>
          </div>
          
          {status === "error" && (
            <p className="text-red-400 text-xs text-center font-bold tracking-widest uppercase">Failed to send. Please try again.</p>
          )}
        </form>
      )}
    </div>
  )
}
