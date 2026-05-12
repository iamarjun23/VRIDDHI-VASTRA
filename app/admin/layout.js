"use client"
import { useState, useEffect } from "react"
import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logo, setLogo] = useState(null)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.logo) {
          setLogo(data.logo);
        }
      })
      .catch(err => console.error("Failed to load header logo", err));
  }, []);

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden font-sans text-gray-900 selection:bg-[#D4AF37]/20 selection:text-gray-900">

      {/* Mobile Header - Luxury Optimized */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-[#D4AF37]/20 z-[40] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {logo && !logoError ? (
            <div className="h-8 w-auto flex items-center">
              <img 
                src={logo} 
                alt="Brand Logo" 
                className="max-h-full w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 bg-[#1A1A1A]">
               <span className="text-[10px] text-[#D4AF37] font-bold font-display">V</span>
            </div>
          )}
          <h2 className="text-[14px] font-bold font-display tracking-[0.2em] uppercase text-gray-900 mt-0.5">Vriddhi Vastra</h2>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 bg-[#FAF9F6] border border-[#E5E0D8] active:scale-95 transition-all"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[45] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto pt-[82px] sm:pt-[100px] lg:pt-0 relative z-10 custom-scrollbar">
        <div className="flex-1 w-full max-w-[2000px] mx-auto p-6 sm:p-10 lg:p-16">
          {children}
        </div>
      </div>
    </div>
  )
}