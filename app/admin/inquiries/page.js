"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import ConfirmDialog from "../../components/ConfirmDialog"

function InquiriesAdminContent() {
  const searchParams = useSearchParams()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeInquiry, setActiveInquiry] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileDetailView, setIsMobileDetailView] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [inquiryToDelete, setInquiryToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries")
      if (res.ok) {
        const data = await res.json()
        const items = data.inquiries || []
        setInquiries(items)
        if (items.length > 0 && !activeInquiry) setActiveInquiry(items[0])
      }
    } catch { toast.error("Failed to load inquiries") } finally { setLoading(false) }
  }

  useEffect(() => { fetchInquiries() }, [])

  const deleteInquiry = async () => {
    if (!inquiryToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/inquiries?id=${inquiryToDelete._id}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Inquiry removed")
        setInquiries(prev => prev.filter(i => i._id !== inquiryToDelete._id))
        if (activeInquiry?._id === inquiryToDelete._id) {
          setActiveInquiry(null)
          setIsMobileDetailView(false)
        }
      } else { toast.error(data.message || "Removal failed") }
    } catch { toast.error("An error occurred") } finally {
      setIsDeleting(false)
      setIsConfirmOpen(false)
      setInquiryToDelete(null)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const filteredInquiries = inquiries.filter(inq =>
    inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inq.phoneNumber && inq.phoneNumber.includes(searchQuery)) ||
    (inq.productName && inq.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
    </div>
  )

  return (
    <div className="flex flex-col pb-6 space-y-5">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-5 pt-2">
        <div>
          <p className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-1.5">Concierge Desk</p>
          <h1 className="font-dm-serif text-[clamp(1.6rem,3.5vw,2.4rem)] text-gray-900">Inquiries</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#E8E2D9]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-dm-sans font-semibold text-gray-600">{inquiries.length} Total</span>
          </div>
        </div>
      </div>

      {/* Split Panel */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden flex flex-col lg:flex-row" style={{ minHeight: 'clamp(500px, 70vh, 800px)' }}>

        {/* Left: List Pane */}
        <div className={`w-full lg:w-[300px] xl:w-[340px] shrink-0 lg:border-r border-[#E8E2D9] flex flex-col ${isMobileDetailView ? 'hidden lg:flex' : 'flex'}`}>

          {/* Search */}
          <div className="p-4 border-b border-[#E8E2D9] bg-[#FAFAF8]">
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-dm-sans text-gray-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredInquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-[12px] font-dm-sans font-semibold text-gray-500">Inbox Clear</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0EBE3]">
                {filteredInquiries.map(inq => {
                  const isActive = activeInquiry?._id === inq._id
                  return (
                    <button
                      key={inq._id}
                      onClick={() => { setActiveInquiry(inq); setIsMobileDetailView(true) }}
                      className={`w-full text-left p-4 transition-all relative ${isActive ? 'bg-[#FAFAF8]' : 'hover:bg-[#FAFAF8]'}`}
                    >
                      {isActive && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#D4AF37] rounded-r-full" />}
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-dm-sans font-bold shrink-0 transition-colors ${isActive ? 'bg-[#1A1A1A] text-[#D4AF37]' : 'bg-[#F0EBE3] text-gray-600'}`}>
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-0.5">
                            <span className={`text-[14px] font-dm-sans font-semibold truncate ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{inq.name}</span>
                            <span className="text-[10px] font-dm-sans text-gray-400 shrink-0">
                              {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <span className={`text-[10px] font-dm-sans font-semibold uppercase tracking-wider truncate block ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                            {inq.productName || 'General Inquiry'}
                          </span>
                        </div>
                      </div>
                      <p className={`text-[12px] font-dm-sans line-clamp-1 mt-2 pl-12 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>{inq.message}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail Pane */}
        <div className={`flex-1 flex-col bg-white ${!isMobileDetailView ? 'hidden lg:flex' : 'flex'}`}>
          {activeInquiry ? (
            <div key={activeInquiry._id} className="h-full flex flex-col">

              {/* Detail Header */}
              <div className="p-5 sm:p-8 border-b border-[#E8E2D9] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shrink-0">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsMobileDetailView(false)}
                    className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[#E8E2D9] bg-white text-gray-500 hover:text-gray-900 transition-all shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center text-[18px] font-dm-sans font-bold shrink-0">
                    {activeInquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-dm-serif text-[22px] sm:text-[26px] text-gray-900 leading-tight">{activeInquiry.name}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="text-[9px] font-dm-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37]">{activeInquiry.source || 'Direct Contact'}</span>
                      <span className="text-[11px] font-dm-sans text-gray-400">
                        {new Date(activeInquiry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeInquiry.phoneNumber && (
                    <a
                      href={`https://wa.me/${activeInquiry.phoneNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE53] text-white text-[11px] font-dm-sans font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-green-500/15"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
                      Reply
                    </a>
                  )}
                  <button
                    onClick={() => { setInquiryToDelete(activeInquiry); setIsConfirmOpen(true) }}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                <div className="max-w-2xl space-y-8">

                  {/* Contact Cards */}
                  <div>
                    <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4 border-b border-[#F0EBE3] pb-3">Contact Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeInquiry.phoneNumber && (
                        <div className="flex items-center justify-between p-4 bg-[#F7F4EF] rounded-xl border border-[#E8E2D9] hover:border-[#D4AF37] transition-all group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center shrink-0">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                              <p className="text-[13px] font-mono text-gray-900 font-semibold truncate">{activeInquiry.phoneNumber}</p>
                            </div>
                          </div>
                          <button onClick={() => copyToClipboard(activeInquiry.phoneNumber)} className="text-gray-300 hover:text-[#D4AF37] transition-colors shrink-0 ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      )}
                      {activeInquiry.email && (
                        <div className="flex items-center justify-between p-4 bg-[#F7F4EF] rounded-xl border border-[#E8E2D9] hover:border-[#D4AF37] transition-all group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#E8E2D9] flex items-center justify-center shrink-0">
                              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider">Email</p>
                              <p className="text-[13px] font-dm-sans text-gray-900 font-semibold truncate">{activeInquiry.email}</p>
                            </div>
                          </div>
                          <button onClick={() => copyToClipboard(activeInquiry.email)} className="text-gray-300 hover:text-[#D4AF37] transition-colors shrink-0 ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Context */}
                  {activeInquiry.productName && (
                    <div>
                      <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4 border-b border-[#F0EBE3] pb-3">Piece of Interest</p>
                      <div className="flex items-center gap-4 p-4 bg-[#F7F4EF] rounded-xl border border-[#E8E2D9]">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E2D9] flex items-center justify-center text-[#D4AF37] shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div>
                          <p className="font-dm-serif text-[16px] text-gray-900">{activeInquiry.productName}</p>
                          <p className="text-[10px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider mt-0.5">Serial: {activeInquiry.productSerial}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-4 border-b border-[#F0EBE3] pb-3">Message</p>
                    <div className="bg-[#F7F4EF] rounded-2xl border border-[#E8E2D9] p-5 sm:p-6">
                      <p className="text-[15px] font-dm-sans text-gray-800 whitespace-pre-wrap leading-relaxed">
                        &ldquo;{activeInquiry.message}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="font-dm-serif text-[20px] text-gray-900 mb-2">Concierge Inbox</h3>
              <p className="text-[13px] font-dm-sans text-gray-400 max-w-xs">Select a client inquiry from the list to view their message and contact details.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteInquiry}
        title="Remove Inquiry"
        message={inquiryToDelete ? `Permanently remove the inquiry from "${inquiryToDelete.name}"?` : "Confirm deletion?"}
      />
    </div>
  )
}

export default function InquiriesAdmin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
      </div>
    }>
      <InquiriesAdminContent />
    </Suspense>
  )
}
