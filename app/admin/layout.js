"use client"
import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#FAF9F6] overflow-hidden font-sans text-gray-900 selection:bg-[#D4AF37]/20 selection:text-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-[#E5E0D8] z-[40] px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="text-lg font-bold font-display tracking-tight text-gray-900">Vriddhi Vastra</h2>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-[#FAF9F6] rounded-md transition-colors"
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
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto pt-16 lg:pt-0 relative z-10 custom-scrollbar">
        <div className="flex-1 w-full max-w-[2000px] mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}