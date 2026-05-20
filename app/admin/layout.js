"use client"
import { useState, useEffect } from "react"
import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logo, setLogo] = useState(null)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d?.logo) setLogo(d.logo) })
      .catch(() => {})
  }, [])

  return (
    <div className="flex h-screen bg-[#F7F4EF] overflow-hidden font-dm-sans text-gray-900 selection:bg-[#D4AF37]/20">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-[#E8E2D9] z-40 h-14 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          {logo && !logoError ? (
            <div className="h-6 w-auto flex items-center shrink-0">
              <img src={logo} alt="Logo" className="max-h-full w-auto object-contain" onError={() => setLogoError(true)} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <span className="text-[9px] text-[#D4AF37] font-bold">V</span>
            </div>
          )}
          <span className="text-[12px] font-dm-sans font-bold tracking-[0.18em] uppercase text-gray-900 truncate">Vriddhi Vastra</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          aria-label="Open menu"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto pt-14 lg:pt-0 custom-scrollbar">
        <div className="flex-1 w-full p-4 sm:p-5 lg:p-6 xl:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}