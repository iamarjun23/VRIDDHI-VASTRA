"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import ConfirmDialog from "../../components/ConfirmDialog"

function InquiriesAdminContent() {
  const searchParams = useSearchParams();
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeInquiry, setActiveInquiry] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

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
        if (items.length > 0 && !activeInquiry) {
          setActiveInquiry(items[0])
        }
      }
    } catch (err) {
      toast.error("Failed to load inquiries")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteInquiry = async () => {
    if (!inquiryToDelete) return
    setIsDeleting(true)
    
    try {
      const res = await fetch(`/api/inquiries?id=${inquiryToDelete._id}`, {
        method: "DELETE"
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success("Client record permanently removed")
        setInquiries(prev => prev.filter(i => i._id !== inquiryToDelete._id))
        if (activeInquiry?._id === inquiryToDelete._id) {
          setActiveInquiry(null)
        }
      } else {
        toast.error(data.message || "Removal failed")
      }
    } catch (err) {
      toast.error("An error occurred during removal")
    } finally {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Luxury Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E5E0D8] pb-6 shrink-0">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">Concierge Desk</span>
          <h1 className="text-4xl font-bold font-display text-gray-900">Inquiries</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 border border-[#E5E0D8] shadow-sm flex items-center gap-3">
             <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
             <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{inquiries.length} Pending Actions</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-white border border-[#E5E0D8] shadow-xl shadow-black/5 mt-6 rounded-none">
        
        {/* Left Pane - List */}
        <div className="w-[380px] shrink-0 border-r border-[#E5E0D8] bg-[#FAF9F6] flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-5 border-b border-[#E5E0D8] bg-white">
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] pl-11 pr-4 py-3.5 text-[13px] font-medium text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <svg className="w-8 h-8 text-[#E5E0D8] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Inbox Clear</span>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E0D8]">
                {filteredInquiries.map(inq => {
                  const isActive = activeInquiry?._id === inq._id;
                  return (
                    <button
                      key={inq._id}
                      onClick={() => setActiveInquiry(inq)}
                      className={`w-full text-left p-5 transition-all duration-500 relative group hover:-translate-y-0.5 ${isActive ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10' : 'hover:bg-white/60 hover:shadow-sm'}`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]" />}
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 transition-colors duration-500 ${isActive ? 'bg-[#1A1A1A] text-[#D4AF37]' : 'bg-[#E5E0D8] text-gray-600'}`}>
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className={`text-[15px] font-bold font-display truncate pr-2 tracking-tight ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>{inq.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest shrink-0 uppercase">
                              {new Date(inq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase truncate block transition-colors duration-500 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                            {inq.productName || 'General Inquiry'}
                          </span>
                        </div>
                      </div>
                      <p className={`text-[13px] line-clamp-2 pl-14 leading-relaxed transition-colors duration-500 ${isActive ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                        {inq.message}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Detail */}
        <div className="flex-1 bg-white flex flex-col relative">
          {activeInquiry ? (
            <div key={activeInquiry._id} className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
              {/* Detail Header */}
              <div className="p-8 lg:p-12 border-b border-[#E5E0D8] bg-[#FAF9F6] shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-bold shrink-0 bg-[#1A1A1A] text-[#D4AF37] shadow-xl shadow-black/5">
                    {activeInquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-[28px] font-bold font-display text-gray-900 tracking-tight">{activeInquiry.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="px-3 py-1 bg-white border border-[#E5E0D8] text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                        {activeInquiry.source || 'Direct Contact'}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
                        {new Date(activeInquiry.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {activeInquiry.phoneNumber && (
                    <a 
                      href={`https://wa.me/${activeInquiry.phoneNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#25D366] hover:bg-[#1EBE53] text-white text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
                      Quick Reply
                    </a>
                  )}
                  <button 
                    onClick={() => {
                      setInquiryToDelete(activeInquiry)
                      setIsConfirmOpen(true)
                    }}
                    className="w-12 h-12 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-300"
                    title="Eradicate Record"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                
                <div className="max-w-3xl space-y-12">
                   
                   {/* Contact Profile */}
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] border-b border-[#E5E0D8] pb-3">Client Contact Profile</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeInquiry.phoneNumber && (
                          <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 flex items-center justify-between group hover:border-[#D4AF37] transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white border border-[#E5E0D8] flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Phone Number</span>
                                <span className="text-[15px] font-mono text-gray-900 font-medium">{activeInquiry.phoneNumber}</span>
                              </div>
                            </div>
                            <button onClick={() => copyToClipboard(activeInquiry.phoneNumber)} className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors opacity-0 group-hover:opacity-100" title="Copy">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                          </div>
                        )}
                        {activeInquiry.email && (
                          <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 flex items-center justify-between group hover:border-[#D4AF37] transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white border border-[#E5E0D8] flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Email Address</span>
                                <span className="text-[15px] text-gray-900 font-medium">{activeInquiry.email}</span>
                              </div>
                            </div>
                            <button onClick={() => copyToClipboard(activeInquiry.email)} className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors opacity-0 group-hover:opacity-100" title="Copy">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                   </div>

                   {/* Product Context */}
                   {activeInquiry.productName && (
                     <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] border-b border-[#E5E0D8] pb-3">Collection Piece Context</h3>
                       <div className="bg-white border border-[#E5E0D8] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-5">
                         <div className="w-14 h-14 bg-[#FAF9F6] border border-[#E5E0D8] flex items-center justify-center shrink-0 text-[#D4AF37]">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                         </div>
                         <div>
                           <p className="text-[18px] font-bold font-display text-gray-900 tracking-tight">{activeInquiry.productName}</p>
                           <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-1">Archive Serial: {activeInquiry.productSerial}</p>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Message */}
                   <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] border-b border-[#E5E0D8] pb-3">Message Transcript</h3>
                      <div className="bg-[#FAF9F6] border border-[#E5E0D8] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                        <p className="text-[16px] md:text-[18px] leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
                          &quot;{activeInquiry.message}&quot;
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-[#FAF9F6]/50">
              <div className="w-24 h-24 bg-white border border-[#E5E0D8] rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-10 h-10 text-[#E5E0D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="text-2xl font-bold font-display text-gray-900 mb-3 tracking-tight">Concierge Inbox</h3>
              <p className="text-[14px] font-medium max-w-sm leading-relaxed">Select a client inquiry from the manifest to view contact details and coordinate a response.</p>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog 
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteInquiry}
        title="Eradicate Record"
        message={inquiryToDelete ? `Permanently remove the inquiry from "${inquiryToDelete.name}"? This will destroy the record in the database.` : "Confirm deletion?"}
      />
    </div>
  )
}

export default function InquiriesAdmin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    }>
      <InquiriesAdminContent />
    </Suspense>
  )
}
