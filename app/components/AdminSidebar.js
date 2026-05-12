"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { name: 'Inventory', path: '/admin/products', icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { name: 'Inquiries', path: '/admin/inquiries', icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { name: 'Settings', path: '/admin/settings', icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logo, setLogo] = useState(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.logo) {
          setLogo(data.logo);
        }
      })
      .catch(err => console.error("Failed to load sidebar logo", err));
  }, []);

  const isActive = (path) => pathname === path || (path !== '/admin' && pathname.startsWith(path));

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[260px] flex flex-col shrink-0
      bg-[#121212] border-r border-[#2A2A2A]
      transition-transform duration-500 lg:translate-x-0 lg:static lg:h-screen
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
    `}>
      {/* Sidebar Header */}
      <div className="h-[100px] sm:h-[120px] flex items-center justify-between px-6 sm:px-8 shrink-0 border-b border-[#2A2A2A]/40 bg-[#0F0F0F]">
        <Link href="/admin" className="flex items-center gap-3 sm:gap-4 group w-full">
          {logo && !logoError ? (
            <div className="flex items-center justify-start shrink-0 h-9 sm:h-10 w-auto max-w-[100px] sm:max-w-[120px] opacity-90 group-hover:opacity-100 transition-opacity duration-500">
              <img
                src={logo}
                alt="Brand Logo"
                onError={() => setLogoError(true)}
                className="max-h-full w-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 border border-[#2A2A2A] flex items-center justify-center shrink-0">
              <span className="text-[10px] text-[#D4AF37] font-bold font-display">V</span>
            </div>
          )}
          <div className="flex flex-col border-l border-[#2A2A2A] pl-3 sm:pl-4">
            <span className="text-[11px] sm:text-[12px] font-display font-bold text-white tracking-[0.2em] uppercase leading-tight">Vriddhi</span>
            <span className="text-[7px] sm:text-[8px] font-medium text-gray-500 tracking-[0.3em] uppercase mt-1">Platform</span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors shrink-0"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-8 sm:py-10 px-4 sm:px-5 flex flex-col gap-1 sm:gap-2 custom-scrollbar">
        <p className="px-4 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-3 sm:mb-4">Operations</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={`
                relative flex items-center gap-3 sm:gap-4 px-4 py-3 sm:py-3.5 text-[10px] font-bold tracking-widest uppercase transition-all duration-500 group
                ${active
                  ? 'text-white bg-[#1A1A1A]'
                  : 'text-gray-500 hover:text-white hover:bg-[#1A1A1A]/50'}
              `}
            >
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D4AF37]" />
              )}
              <div className={`transition-colors duration-500 ${active ? 'text-[#D4AF37]' : 'text-gray-600 group-hover:text-gray-400'}`}>
                {item.icon}
              </div>
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-6 shrink-0 border-t border-[#2A2A2A]/40 bg-[#0F0F0F]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 w-full py-3 px-4 text-gray-500 hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 text-[10px] font-bold tracking-widest uppercase group"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          <span className="mt-0.5">Live Showroom</span>
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
          }}
          className="flex items-center gap-3 w-full py-3 px-4 mt-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-500 text-[10px] font-bold tracking-widest uppercase group"
        >
          <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-4 h-4 text-gray-600 group-hover:text-red-400 transition-colors duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="mt-0.5">Secure Logout</span>
        </button>
      </div>
    </aside>
  );
}