"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/analytics', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    )
  }

  const statCards = [
    { label: "Curated Collection", value: stats?.totalProducts || 0, icon: "cube", trend: "+12%", up: true },
    { label: "Total Engagements", value: stats?.totalClicks || 0, icon: "eye", trend: "+24%", up: true },
    { label: "Pending Inquiries", value: stats?.recentInquiries?.length || 0, icon: "inbox", trend: "-5%", up: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Luxury Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D8] pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">Workspace Overview</span>
          <h1 className="text-4xl font-bold font-display text-gray-900">Good morning, Vriddhi.</h1>
        </div>
        <Link 
          href="/admin/products/create" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white text-[12px] font-bold tracking-widest uppercase rounded-sm hover:bg-black transition-all active:scale-[0.98]"
        >
          Add Product
        </Link>
      </div>

      {/* Restrained Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 border border-[#E5E0D8] shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-display font-bold text-gray-900">{stat.value.toLocaleString()}</span>
                  <span className={`text-[12px] font-medium ${stat.up ? 'text-emerald-700' : 'text-gray-400'}`}>{stat.trend}</span>
                </div>
              </div>
              <div className="text-[#D4AF37]/50">
                {stat.icon === "cube" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                {stat.icon === "eye" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                {stat.icon === "inbox" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trending Widget */}
        <div style={{ animationDelay: `300ms`, animationFillMode: 'backwards' }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 xl:col-span-2 bg-white border border-[#E5E0D8] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#E5E0D8] flex items-center justify-between">
            <h2 className="text-[18px] font-display font-bold text-gray-900 tracking-tight">Top Engaging Pieces</h2>
            <Link href="/admin/products" className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-gray-900 transition-colors">View Catalog &rarr;</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            {stats?.trendingProducts && stats.trendingProducts.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF9F6]">
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4 border-b border-[#E5E0D8]">Saree Details</th>
                    <th className="px-6 py-4 border-b border-[#E5E0D8] text-right">Interactions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  {stats.trendingProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-[#FAF9F6] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <span className="text-[12px] font-medium text-gray-300 w-4">{i + 1}</span>
                          <div className="relative w-12 h-16 bg-[#FAF9F6] flex items-center justify-center overflow-hidden border border-[#E5E0D8]">
                             {p.image && !p.image.includes('placeholder') ? (
                                <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                             ) : (
                               <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                             )}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors">{p.name}</p>
                            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-1">{p.serial}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[13px] font-medium text-gray-600">
                          {p.clicks} views
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-4 border border-[#E5E0D8]">
                  <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-2">No Engagement Data</h3>
                <p className="text-[12px] text-gray-500 font-medium max-w-sm">Pieces will populate here as clients explore and interact with your showroom.</p>
              </div>
            )}
          </div>
        </div>

        {/* Unified Inbox Activity */}
        <div style={{ animationDelay: `400ms`, animationFillMode: 'backwards' }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border border-[#E5E0D8] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#E5E0D8] flex items-center justify-between">
            <h2 className="text-[18px] font-display font-bold text-gray-900 tracking-tight">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest hover:text-gray-900 transition-colors">Inquiries Desk &rarr;</Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              <div className="divide-y divide-[#E5E0D8]">
                {stats.recentInquiries.map((inq) => (
                  <div key={inq._id} className="p-5 hover:bg-[#FAF9F6] transition-colors group cursor-pointer">
                     <div className="flex items-start justify-between gap-3 mb-2">
                       <p className="text-[14px] font-bold text-gray-900">{inq.name}</p>
                       <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase shrink-0">
                         {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </span>
                     </div>
                     <p className="text-[12px] font-medium text-[#D4AF37] truncate">{inq.productName || 'General Inquiry'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-4 border border-[#E5E0D8]">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-widest mb-2">Inbox Clear</h3>
                <p className="text-[12px] text-gray-500 font-medium max-w-sm">No pending client requests at this time. Operations are running smoothly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}