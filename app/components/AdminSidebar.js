"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  {
    name: 'Dashboard', path: '/admin',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    name: 'Inventory', path: '/admin/products',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  },
  {
    name: 'Inquiries', path: '/admin/inquiries',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  },
  {
    name: 'Settings', path: '/admin/settings',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const [logo, setLogo] = useState(null)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d?.logo) setLogo(d.logo) })
      .catch(() => {})
  }, [])

  const isActive = (path) => pathname === path || (path !== '/admin' && pathname.startsWith(path))

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 flex flex-col shrink-0
      bg-[#0F0F0F] border-r border-white/[0.05]
      transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:h-screen
      ${isOpen ? 'translate-x-0 shadow-[24px_0_48px_rgba(0,0,0,0.4)]' : '-translate-x-full'}
    `}>

      {/* Header */}
      <div className="h-16 sm:h-[72px] flex items-center justify-between px-5 sm:px-6 shrink-0 border-b border-white/[0.05]">
        <Link href="/admin" onClick={() => { if (window.innerWidth < 1024) onClose() }} className="flex items-center gap-3 group min-w-0">
          {logo && !logoError ? (
            <div className="h-7 w-auto flex items-center shrink-0 max-w-[100px]">
              <img src={logo} alt="Logo" className="max-h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity" onError={() => setLogoError(true)} />
            </div>
          ) : (
            <div className="w-7 h-7 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-[#D4AF37] font-dm-serif font-bold">V</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[11px] font-dm-sans font-bold text-white/80 tracking-[0.2em] uppercase leading-none">Vriddhi</p>
            <p className="text-[8px] font-dm-sans text-white/30 tracking-[0.3em] uppercase mt-0.5">Platform</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 rounded transition-all shrink-0 ml-2"
          aria-label="Close sidebar"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Nav section label */}
      <div className="px-5 sm:px-6 pt-6 pb-2">
        <p className="text-[9px] font-dm-sans font-bold text-white/20 uppercase tracking-[0.35em]">Operations</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose() }}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-dm-sans font-semibold tracking-[0.12em] uppercase transition-all duration-200
                ${active
                  ? 'bg-white/8 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'}
              `}
            >
              {active && (
                <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#D4AF37] rounded-r-full" />
              )}
              <span className={`shrink-0 transition-colors ${active ? 'text-[#D4AF37]' : 'text-white/30 group-hover:text-white/50'}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="px-3 py-4 shrink-0 border-t border-white/[0.05] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 w-full py-3 px-4 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all text-[10px] font-dm-sans font-semibold tracking-[0.12em] uppercase group"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          <span>View Site</span>
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
          }}
          className="flex items-center gap-3 w-full py-3 px-4 text-white/30 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all text-[10px] font-dm-sans font-semibold tracking-[0.12em] uppercase"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}