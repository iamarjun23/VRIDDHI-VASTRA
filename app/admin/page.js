import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import Link from "next/link"
import dbConnect from "../../lib/mongodb"

export const dynamic = 'force-dynamic';
import Product from "../../models/Product"
import SiteConfig from "../../models/SiteConfig"
import ContactSubmission from "../../models/ContactSubmission"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await dbConnect()

  // Fetch basic statistics for the dashboard
  const productCount = await Product.countDocuments()

  // Use aggregation to group products by category and get accurate counts
  const categoryCountsAgg = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ])

  const categoryCount = categoryCountsAgg.length

  let recentProducts = await Product.find().sort({ createdAt: -1 }).limit(3).lean()
  let recentSubmissions = await ContactSubmission.find().sort({ createdAt: -1 }).limit(4).lean()

  let configData = await SiteConfig.findOne({ configId: "main" }).lean()
  const activeBannersCount = configData?.lookbookBlocks?.filter(b => b.image).length || 0

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Dynamic Header Section */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 md:px-10 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900 tracking-tight">Command Center</h1>
            <p className="text-[10px] md:text-[11px] text-brand-green/70 tracking-[0.4em] uppercase font-bold mt-1 md:mt-1.5 ml-0.5">Vriddhi Vastra Operations</p>
          </div>
          <div className="flex items-center">
            <div className="px-4 md:px-6 py-2 md:py-2.5 bg-green-50/50 border border-green-100/50 rounded-full flex items-center gap-3 md:gap-4 shadow-sm">
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.4)]"></div>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-green-700 uppercase whitespace-nowrap">SYSTEM ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-10 py-8 md:py-12 space-y-8 md:space-y-16 pb-24 md:pb-32 animate-in slide-in-from-bottom-6 duration-1000">

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,2vw,2.5rem)]">
          {[
            { label: 'Total Inventory', value: productCount, color: 'brand-green' },
            { label: 'Categories', value: categoryCount, color: 'brand-gold' },
            { label: 'Showcase', value: `${activeBannersCount} / 5`, color: 'amber-500' },
            { label: 'New Inquiries', value: recentSubmissions.length, color: 'red-500' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-[clamp(1.25rem,2vw,2.5rem)] rounded-[clamp(24px,3vw,56px)] border border-gray-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group flex flex-col justify-center min-w-0">
              <p className={`text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase group-hover:text-${stat.color} transition-colors truncate`}>{stat.label}</p>
              <h3 className="text-[clamp(24px,2.5vw,48px)] font-bold font-display text-gray-900 mt-3 md:mt-6 tracking-tighter truncate">{stat.value}</h3>
              <div className={`w-8 md:w-16 h-[2px] md:h-[3px] shrink-0 bg-gray-100 mt-4 md:mt-8 group-hover:w-full group-hover:bg-${stat.color}/20 transition-all duration-1000`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
          {/* Recent Products */}
          <div className="xl:col-span-2 bg-white rounded-[40px] md:rounded-[64px] shadow-sm border border-gray-100/80 overflow-hidden flex flex-col group/card hover:shadow-2xl transition-all duration-1000">
            <div className="px-6 md:px-14 py-8 md:py-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50/20">
              <div>
                <h3 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900 tracking-tight">Recent Masterpieces</h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2 md:mt-3 font-medium">Monitoring the latest additions to your digital archive.</p>
              </div>
              <Link href="/admin/products" className="w-full md:w-auto text-center px-6 md:px-10 py-3 md:py-3.5 bg-black text-white rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-brand-green transition-all shadow-xl shadow-black/10 active:scale-95">Archive Access</Link>
            </div>
            <div className="p-4 md:p-6">
              <ul className="space-y-4">
                {recentProducts.length === 0 ? (
                  <li className="p-16 md:p-32 text-center text-sm text-gray-400 italic font-medium">No recent additions detected.</li>
                ) : (
                  recentProducts.map((p) => (
                    <li key={p._id.toString()} className="px-4 md:px-10 py-6 md:py-8 rounded-[24px] md:rounded-[40px] hover:bg-[#F9F8F6] transition-all flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group">
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-[20px] md:rounded-[28px] bg-white overflow-hidden shrink-0 border border-gray-100 shadow-sm flex items-center justify-center p-3 md:p-4">
                        {p.image1 ? (
                          <img src={p.image1} alt={p.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <div className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">Void</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[clamp(16px,1.3vw,24px)] font-bold font-display text-gray-900 md:truncate tracking-tight">{p.name}</p>
                        <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-3">
                          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-gray-400 uppercase">SERIAL: {p.serial}</span>
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-gold/40 rounded-full"></span>
                          <span className="text-md md:text-lg font-bold text-brand-green tracking-tight font-sans">₹{p.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <Link href={`/admin/products/${p.serial}`} className="w-full md:w-auto text-center text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-gray-400 uppercase bg-white border border-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-brand-green hover:text-white hover:border-brand-green transition-all shadow-sm active:scale-95">
                        REFINE
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-[40px] md:rounded-[64px] shadow-sm border border-gray-100/80 overflow-hidden flex flex-col group/card hover:shadow-2xl transition-all duration-1000">
            <div className="px-8 md:px-12 py-8 md:py-12 border-b border-gray-50 bg-gray-50/20">
              <h3 className="text-2xl md:text-3xl font-bold font-display text-gray-900 tracking-tight">Recent Inquiries</h3>
              <p className="text-xs md:text-sm text-gray-400 mt-2 md:mt-3 font-medium">Latest connections from the world.</p>
            </div>
            <div className="p-4 md:p-6 flex-1">
              <div className="space-y-4 md:space-y-6">
                {recentSubmissions.length === 0 ? (
                  <div className="p-16 md:p-32 text-center text-sm text-gray-400 italic font-medium">Silence in the digital realm.</div>
                ) : (
                  recentSubmissions.map((s) => (
                    <div key={s._id.toString()} className="p-4 md:p-8 rounded-[16px] md:rounded-[32px] bg-[#F9F8F6]/50 hover:bg-[#F9F8F6] border border-transparent hover:border-gray-100 transition-all group">
                      <div className="flex justify-between items-start mb-2 md:mb-4">
                        <p className="text-base md:text-lg font-bold font-display text-gray-900 tracking-tight">{s.name}</p>
                        <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em]">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[8px] md:text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-2 md:mb-4">{s.phoneNumber}</p>
                      <div className="p-3 md:p-5 bg-white rounded-xl md:rounded-2xl border border-gray-100/50 shadow-sm italic text-gray-500 text-[9px] md:text-[11px] leading-relaxed group-hover:border-brand-gold/20 transition-all font-medium">
                        "{s.message}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-4 md:p-8 border-t border-gray-50">
              <Link href="/admin/inquiries" className="flex items-center justify-center gap-2 md:gap-3 w-full py-3 md:py-4 bg-gray-900 text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-white uppercase rounded-[16px] md:rounded-[24px] hover:bg-brand-gold transition-all shadow-2xl shadow-black/10 active:scale-95 group">
                Open Message Vault <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-2 transition-transform duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <Link href="/admin/products/create" className="group p-8 md:p-14 bg-white border border-gray-100 rounded-[48px] md:rounded-[72px] hover:border-brand-green/30 hover:shadow-2xl hover:shadow-brand-green/10 transition-all duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-brand-green/5 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24 group-hover:scale-150 transition-transform duration-[2s]"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-bold font-display text-brand-green group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-700">Curate New Piece</h3>
              <p className="text-sm md:text-md text-gray-400 mt-4 md:mt-6 font-medium leading-relaxed group-hover:text-gray-600 transition-colors max-w-md">Introduce a new masterpiece to the digital archive with cinematic high-fidelity presentation.</p>
              <div className="mt-8 md:mt-12 flex items-center gap-4 md:gap-6 text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-brand-green uppercase group-hover:gap-6 md:group-hover:gap-8 transition-all">
                Initiate Curation <span className="text-xl md:text-2xl font-light">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/settings" className="group p-8 md:p-14 bg-white border border-gray-100 rounded-[48px] md:rounded-[72px] hover:border-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-1000 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 bg-brand-gold/5 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24 group-hover:scale-150 transition-transform duration-[2s]"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-bold font-display text-brand-gold group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-700">Studio Configuration</h3>
              <p className="text-sm md:text-md text-gray-400 mt-4 md:mt-6 font-medium leading-relaxed group-hover:text-gray-600 transition-colors max-w-md">Refine the digital atmosphere, brand narratives, and structural aesthetics of your world.</p>
              <div className="mt-8 md:mt-12 flex items-center gap-4 md:gap-6 text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-brand-gold uppercase group-hover:gap-6 md:group-hover:gap-8 transition-all">
                Access Studio <span className="text-xl md:text-2xl font-light">→</span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}