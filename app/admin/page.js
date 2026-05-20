"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

function AdminDashboardContent() {
  const searchParams = useSearchParams()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState("Good morning")
  const [now, setNow] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
    setNow(new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))

    fetch('/api/analytics', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading Workspace</p>
    </div>
  )

  // Compute derived stats
  const totalProducts = stats?.totalProducts || 0
  const totalViews = stats?.totalClicks || 0
  const totalInquiries = stats?.recentInquiries?.length || 0
  const avgViewsPerProduct = totalProducts > 0 ? Math.round(totalViews / totalProducts) : 0
  const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(1) : "0.0"

  const statCards = [
    {
      label: "Active Pieces",
      value: totalProducts,
      sub: "In the catalog",
      trend: null,
      href: "/admin/products",
      color: "blue",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      sub: `Avg ${avgViewsPerProduct} per piece`,
      trend: null,
      href: null,
      color: "gold",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: "Inquiries",
      value: totalInquiries,
      sub: "Awaiting response",
      trend: null,
      href: "/admin/inquiries",
      color: "green",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      sub: "Inquiries / Views",
      trend: null,
      href: null,
      color: "purple",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    }
  ]

  const colorMap = {
    blue:   { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-500" },
    gold:   { bg: "bg-[#D4AF37]/8", border: "border-[#D4AF37]/20", text: "text-[#D4AF37]" },
    green:  { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-500" },
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div>
          <p className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-1">{now}</p>
          <h1 className="font-dm-serif text-[clamp(1.5rem,3.5vw,2.4rem)] text-gray-900 leading-tight">{greeting}, Vriddhi.</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10 whitespace-nowrap"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Piece
          </Link>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E8E2D9] text-gray-700 text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:border-gray-300 transition-all whitespace-nowrap"
          >
            View Inquiries
          </Link>
        </div>
      </div>

      {/* Stat Cards — 4 column */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const c = colorMap[stat.color]
          const CardWrapper = stat.href ? Link : 'div'
          const wrapperProps = stat.href ? { href: stat.href } : {}
          return (
            <CardWrapper
              key={i}
              {...wrapperProps}
              className={`bg-white rounded-2xl border border-[#E8E2D9] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${stat.href ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
                  {stat.icon}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 animate-pulse" />
              </div>
              <p className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-[1.8rem] font-dm-serif font-bold text-gray-900 leading-none">{stat.value}</p>
              <p className="text-[11px] font-dm-sans text-gray-400 mt-1">{stat.sub}</p>
            </CardWrapper>
          )
        })}
      </div>

      {/* Main Grid — Trending + Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Trending Pieces — links to product page */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
            <div>
              <h2 className="font-dm-serif text-[17px] text-gray-900">Top Engaging Pieces</h2>
              <p className="text-[10px] font-dm-sans text-gray-400 mt-0.5">Click any piece to view on storefront</p>
            </div>
            <Link href="/admin/products" className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-wider hover:text-gray-900 transition-colors whitespace-nowrap">
              Manage All →
            </Link>
          </div>

          {stats?.trendingProducts && stats.trendingProducts.length > 0 ? (
            <div className="divide-y divide-[#F5F2EE]">
              {stats.trendingProducts.map((p, i) => (
                <a
                  key={i}
                  href={`/product/${p.serial}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors group cursor-pointer"
                >
                  {/* Rank */}
                  <span className={`text-[13px] font-dm-serif font-bold w-5 shrink-0 ${i === 0 ? 'text-[#D4AF37]' : 'text-gray-300'}`}>{i + 1}</span>

                  {/* Image */}
                  <div className="relative w-10 h-14 bg-[#F7F4EF] rounded-xl overflow-hidden border border-[#E8E2D9] shrink-0">
                    {p.image && !p.image.includes('placeholder') ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-dm-sans font-semibold text-gray-900 truncate group-hover:text-[#D4AF37] transition-colors">{p.name}</p>
                    <p className="text-[10px] font-dm-sans text-gray-400 mt-0.5 font-mono tracking-wider">{p.serial}</p>
                  </div>

                  {/* Views bar */}
                  <div className="shrink-0 text-right flex flex-col items-end gap-1">
                    <span className="text-[13px] font-dm-sans font-bold text-gray-700">{p.clicks.toLocaleString()}</span>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (p.clicks / (stats.trendingProducts[0]?.clicks || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-dm-sans text-gray-400 uppercase tracking-wider">views</span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#D4AF37] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <p className="font-dm-serif text-[16px] text-gray-900 mb-1">No Engagement Data Yet</p>
              <p className="text-[12px] font-dm-sans text-gray-400 max-w-xs">Analytics will appear here as clients explore your showroom.</p>
            </div>
          )}
        </div>

        {/* Right Column — Inquiries + Quick Actions */}
        <div className="flex flex-col gap-5">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5">
            <h2 className="font-dm-serif text-[17px] text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add New Piece", sub: "Catalog a new product", href: "/admin/products/create", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg> },
                { label: "Manage Catalog", sub: "Edit existing products", href: "/admin/products", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
                { label: "View Inquiries", sub: "Respond to clients", href: "/admin/inquiries", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> },
                { label: "Settings", sub: "Update branding & content", href: "/admin/settings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { label: "View Showroom", sub: "Open live storefront", href: "/", external: true, icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F4EF] transition-all group border border-transparent hover:border-[#E8E2D9]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center text-gray-500 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/30 transition-all shrink-0">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-dm-sans font-semibold text-gray-800 group-hover:text-gray-900">{action.label}</p>
                    <p className="text-[11px] font-dm-sans text-gray-400">{action.sub}</p>
                  </div>
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#D4AF37] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
              <h2 className="font-dm-serif text-[17px] text-gray-900">Recent Inquiries</h2>
              <Link href="/admin/inquiries" className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-wider hover:text-gray-900 transition-colors">
                Inbox →
              </Link>
            </div>
            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              <div className="divide-y divide-[#F5F2EE]">
                {stats.recentInquiries.slice(0, 5).map((inq) => (
                  <Link key={inq._id} href="/admin/inquiries" className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center text-[12px] font-dm-sans font-bold shrink-0 mt-0.5">
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <p className="text-[13px] font-dm-sans font-semibold text-gray-900 truncate">{inq.name}</p>
                        <span className="text-[10px] font-dm-sans text-gray-400 shrink-0">
                          {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] font-dm-sans text-[#D4AF37] truncate">{inq.productName || 'General Inquiry'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                <p className="font-dm-serif text-[15px] text-gray-900 mb-1">Inbox Clear</p>
                <p className="text-[12px] font-dm-sans text-gray-400">No pending requests.</p>
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
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}