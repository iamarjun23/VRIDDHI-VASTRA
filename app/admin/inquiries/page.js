import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import dbConnect from "../../../lib/mongodb"

export const dynamic = 'force-dynamic';
import ContactSubmission from "../../../models/ContactSubmission"
import Link from "next/link"

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await dbConnect()
  const inquiries = await ContactSubmission.find().sort({ createdAt: -1 }).lean()

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 md:px-10 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 tracking-tight">Client Inquiries</h1>
            <p className="text-[10px] md:text-[11px] text-brand-gold/70 tracking-[0.4em] uppercase font-bold mt-1 md:mt-1.5 ml-0.5">Vriddhi Vastra Communication Archive</p>
          </div>
          <div className="px-6 md:px-8 py-2 md:py-3 bg-brand-gold/5 border border-brand-gold/10 rounded-full shadow-sm">
            <span className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] text-brand-gold uppercase">{inquiries.length} SIGNALS ARCHIVED</span>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-10 py-8 md:py-16 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-12 md:pb-24">
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-[32px] md:rounded-[64px] p-12 md:p-32 text-center border border-gray-100/80 shadow-sm animate-in zoom-in-95 duration-1000">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 text-gray-200 shadow-inner">
               <svg fill="none" stroke="currentColor" strokeWidth="0.5" viewBox="0 0 24 24" className="w-8 h-8 md:w-12 md:h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
            </div>
            <p className="text-xl md:text-2xl font-bold font-display text-gray-300 italic tracking-wide">The archive is currently silent.</p>
          </div>
        ) : (
          inquiries.map((s) => (
            <div key={s._id.toString()} className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-8 border border-gray-100/80 shadow-sm hover:shadow-2xl transition-all duration-1000 group animate-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-50/50">
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold font-display text-gray-900 group-hover:text-brand-green transition-colors duration-700 tracking-tight">{s.name}</h3>
                  <div className="flex items-center flex-wrap gap-4 md:gap-6 mt-3 md:mt-4">
                    <p className="text-xs md:text-sm font-bold text-brand-gold uppercase tracking-[0.3em]">{s.phoneNumber}</p>
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-100/50 rounded-full"></span>
                    <span className="text-[9px] md:text-[11px] font-bold text-gray-300 uppercase tracking-widest">Verified Signal</span>
                  </div>
                </div>
                <div className="lg:text-right w-full lg:w-auto mt-4 lg:mt-0">
                  <div className="flex flex-col lg:items-end gap-2">
                    <span className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.4em]">ARCHIVE TIMESTAMP</span>
                    <span className="text-xs md:text-sm font-sans font-bold text-gray-900 bg-[#F9F8F6] px-4 md:px-6 py-2 md:py-3 rounded-full border border-gray-100 shadow-sm inline-block w-fit">
                      {new Date(s.createdAt).toLocaleDateString()} — {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F9F8F6]/80 p-5 md:p-8 rounded-[20px] md:rounded-[32px] border border-gray-100/50 shadow-inner group-hover:border-brand-gold/20 transition-all duration-1000">
                 <div className="flex gap-3 md:gap-5">
                    <span className="text-3xl md:text-5xl text-brand-gold/10 font-serif leading-none h-fit -mt-2">“</span>
                    <p className="text-gray-600 leading-relaxed font-medium font-sans text-sm md:text-base pt-1 md:pt-2 pr-2 md:pr-6 italic">{s.message}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
