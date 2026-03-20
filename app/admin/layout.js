"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminSidebar from "../components/AdminSidebar"

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-brand-green rounded-full"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex relative min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-[49] px-6 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold font-display text-gray-900 tracking-tight">Admin</h2>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-gray-600 hover:text-brand-green transition-colors"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[45]" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 bg-[#F9F8F6] min-h-screen overflow-x-hidden pt-20 lg:pt-0">
        {children}
      </div>
    </div>
  )
}