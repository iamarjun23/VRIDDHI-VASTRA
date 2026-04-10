"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-gray-100/50 flex flex-col shrink-0 shadow-[20px_0_40px_rgba(0,0,0,0.01)]
        transition-transform duration-500 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-10 border-b border-gray-100/50 flex items-center justify-between">
          <h2 className="text-3xl font-bold font-display text-gray-900 tracking-tight">
            Admin
          </h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 px-6 py-12 flex flex-col gap-4 overflow-y-auto">
          <Link
            href="/admin"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center gap-5 px-8 py-5 rounded-[32px] text-[12px] font-medium tracking-[0.4em] uppercase transition-all duration-700 ${pathname === '/admin' ? 'text-brand-green bg-[#F9F8F6] shadow-xl shadow-black/5 scale-[1.02]' : 'text-gray-400 hover:text-gray-900 hover:bg-[#F9F8F6]'}`}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center gap-5 px-8 py-5 rounded-[32px] text-[12px] font-medium tracking-[0.4em] uppercase transition-all duration-700 ${isActive('/admin/products') ? 'text-brand-green bg-[#F9F8F6] shadow-xl shadow-black/5 scale-[1.02]' : 'text-gray-400 hover:text-gray-900 hover:bg-[#F9F8F6]'}`}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
            Archive
          </Link>
          <Link
            href="/admin/inquiries"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center gap-5 px-8 py-5 rounded-[32px] text-[12px] font-medium tracking-[0.4em] uppercase transition-all duration-700 ${isActive('/admin/inquiries') ? 'text-brand-green bg-[#F9F8F6] shadow-xl shadow-black/5 scale-[1.02]' : 'text-gray-400 hover:text-gray-900 hover:bg-[#F9F8F6]'}`}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
            Inquiries
          </Link>
          <Link
            href="/admin/settings"
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={`flex items-center gap-5 px-8 py-5 rounded-[32px] text-[12px] font-medium tracking-[0.4em] uppercase transition-all duration-700 ${isActive('/admin/settings') ? 'text-brand-green bg-[#F9F8F6] shadow-xl shadow-black/5 scale-[1.02]' : 'text-gray-400 hover:text-gray-900 hover:bg-[#F9F8F6]'}`}
          >
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.054-2.073.021am.534.534 0 0 0-.46.52v.003c0 .324.267.585.59.585.6.004 1.203.013 1.801.033A11.396 11.396 0 0 0 16.5 14.25v-1.12a.534.534 0 0 0-.585-.533 11.332 11.332 0 0 0-2.859.355Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            Site Settings
          </Link>
        </div>

        <div className="p-10 border-t border-gray-100/50 bg-[#F9F8F6]/30 flex flex-col gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-4 w-full py-5 px-8 bg-black text-white rounded-[32px] hover:bg-brand-green transition-all duration-700 text-[12px] font-bold tracking-[0.4em] uppercase shadow-2xl shadow-black/20 active:scale-95 group"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-700"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            Live Site
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.push('/');
            }}
            className="flex items-center justify-center gap-4 w-full py-5 px-8 bg-red-50 text-red-600 rounded-[32px] hover:bg-red-600 hover:text-white transition-all duration-700 text-[12px] font-bold tracking-[0.4em] uppercase border border-red-100 hover:border-red-600 active:scale-95 group"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-700"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}