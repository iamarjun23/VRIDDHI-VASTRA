"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

const inputCls = "w-full bg-[#F7F4EF] border border-[#E8E2D9] rounded-xl px-4 py-3 text-[14px] font-dm-sans text-gray-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 focus:bg-white outline-none transition-all placeholder-gray-400"
const inputClsError = "w-full bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-[14px] font-dm-sans text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-200 focus:bg-white outline-none transition-all placeholder-gray-400"

function Label({ children, hint, error }) {
  return (
    <div className="mb-1.5">
      <label className="block text-[10px] font-dm-sans font-bold text-gray-500 uppercase tracking-[0.22em]">{children}</label>
      {hint && <p className="text-[11px] font-dm-sans text-gray-400 mt-0.5">{hint}</p>}
      {error && <p className="text-[11px] font-dm-sans text-red-500 mt-0.5 font-semibold">{error}</p>}
    </div>
  )
}

// ── Dual Image Canvas ───────────────────────────────────────────────────────────
function ImageCanvas({ image1, image2, uploadingImage, onUpload }) {
  const [active, setActive] = useState('image1')

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Main large image */}
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#1A1A1A] min-h-0 group cursor-pointer" style={{ minHeight: '320px' }}>
        <input type="file" accept="image/*" onChange={e => onUpload(e, active)} className="absolute inset-0 opacity-0 cursor-pointer z-30" disabled={uploadingImage !== null} />
        {uploadingImage === active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-dm-sans font-bold text-white/60 uppercase tracking-widest">Uploading...</span>
          </div>
        ) : (active === 'image1' ? image1 : image2) ? (
          <>
            <img
              src={active === 'image1' ? image1 : image2}
              alt="Product"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white text-gray-900 text-[10px] font-dm-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-xl">Replace Image</span>
            </div>
            {/* Active image label */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-dm-sans font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg z-10">
              {active === 'image1' ? 'Primary Image' : 'Secondary Image'}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/30 group-hover:text-white/60 transition-colors">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </div>
            <div className="text-center">
              <p className="text-[12px] font-dm-sans font-bold uppercase tracking-widest">{active === 'image1' ? 'Upload Primary' : 'Upload Secondary'}</p>
              <p className="text-[10px] font-dm-sans mt-1">Click to browse files</p>
            </div>
          </div>
        )}
      </div>

      {/* Toggle strip */}
      <div className="grid grid-cols-2 gap-2">
        {['image1', 'image2'].map((key, i) => {
          const img = key === 'image1' ? image1 : image2
          const label = key === 'image1' ? 'Primary' : 'Secondary'
          const isActive = active === key
          const isUploading = uploadingImage === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${isActive ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' : 'border-[#E8E2D9] hover:border-gray-300'}`}
            >
              {isUploading ? (
                <div className="absolute inset-0 bg-[#F7F4EF] flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : img ? (
                <>
                  <img src={img} alt={label} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-[#D4AF37]/20' : 'bg-black/0'}`} />
                </>
              ) : (
                <div className="absolute inset-0 bg-[#F7F4EF] flex items-center justify-center">
                  <span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider">No Image</span>
                </div>
              )}
              <div className={`absolute bottom-0 left-0 right-0 py-1 text-[8px] font-dm-sans font-bold uppercase tracking-wider text-center ${isActive ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white'}`}>
                {label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Upload secondary trigger */}
      <div className="relative">
        <input type="file" accept="image/*" onChange={e => { setActive('image2'); onUpload(e, 'image2') }} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={uploadingImage !== null} />
        <button type="button" className="w-full py-2.5 border-2 border-dashed border-[#E8E2D9] hover:border-[#D4AF37] rounded-xl text-[10px] font-dm-sans font-bold uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-all">
          + Upload Secondary Image
        </button>
      </div>
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────

function CreateProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [serialError, setSerialError] = useState("")
  const [checkingSerial, setCheckingSerial] = useState(false)
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    serial: "", name: "", description: "", price: "", originalPrice: "",
    category: "", tags: "", image1: "", image2: ""
  })

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(cfg => {
        if (cfg?.collectionsCategories?.length) {
          setCategories(cfg.collectionsCategories)
          setFormData(p => ({ ...p, category: cfg.collectionsCategories[0] }))
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (name === "serial") setSerialError("")
  }

  const handleSerialBlur = async () => {
    const serial = formData.serial.trim()
    if (!serial) return
    setCheckingSerial(true)
    try {
      const res = await fetch(`/api/products/check-serial?serial=${encodeURIComponent(serial)}`)
      const data = await res.json()
      if (!data.available) setSerialError("A product with this serial already exists.")
      else setSerialError("")
    } catch { } finally { setCheckingSerial(false) }
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(field)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const json = await res.json()
      if (json.url) setFormData(p => ({ ...p, [field]: json.url }))
    } catch { toast.error("Image upload failed.") }
    setUploadingImage(null)
  }

  const handleSubmit = async () => {
    if (serialError || checkingSerial) return
    setLoading(true)
    const tagsArray = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
    const payload = { ...formData, serial: formData.serial.trim(), price: Number(formData.price), originalPrice: Number(formData.originalPrice || formData.price), tags: tagsArray }
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (res.ok) {
        toast.success("Piece cataloged successfully")
        router.refresh()
        router.push("/admin/products")
      } else if (data.field === "serial") {
        setSerialError(data.error)
        toast.error(data.error)
      } else {
        toast.error(data.error || "Failed to catalog piece")
      }
    } catch (err) {
      toast.error("Error: " + err.message)
    }
    setLoading(false)
  }

  const discount = formData.originalPrice && formData.price
    ? Math.round((1 - Number(formData.price) / Number(formData.originalPrice)) * 100)
    : 0

  return (
    <div className="pb-12">

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F7F4EF] py-3 -mx-4 sm:-mx-5 lg:-mx-6 xl:-mx-8 px-4 sm:px-5 lg:px-6 xl:px-8 border-b border-[#E8E2D9] flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E8E2D9] bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] hidden sm:block">Catalog Expansion</p>
            <h1 className="font-dm-serif text-[18px] sm:text-[22px] text-gray-900 leading-tight">Curate New Piece</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => router.back()} className="hidden sm:block px-4 py-2 text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">Discard</button>
          <button
            onClick={handleSubmit}
            disabled={loading || uploadingImage !== null || !!serialError || checkingSerial}
            className="px-5 sm:px-6 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/10"
          >
            {loading ? "Saving..." : uploadingImage ? "Uploading..." : "Publish Piece"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

        {/* Left — Image Canvas */}
        <div className="lg:sticky lg:top-[76px]">
          <div className="bg-[#111] rounded-3xl p-4 shadow-2xl shadow-black/30" style={{ minHeight: '600px' }}>
            <ImageCanvas
              image1={formData.image1}
              image2={formData.image2}
              uploadingImage={uploadingImage}
              onUpload={handleImageUpload}
            />
          </div>
        </div>

        {/* Right — Form */}
        <div className="space-y-4">

          {/* Identification */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#F0EBE3]">
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
              <h2 className="font-dm-serif text-[17px] text-gray-900">Identification</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label error={serialError} hint={checkingSerial ? "Checking availability..." : ""}>Archive Serial *</Label>
                <input
                  name="serial" required value={formData.serial}
                  onChange={handleChange} onBlur={handleSerialBlur}
                  className={serialError ? inputClsError : `${inputCls} font-mono tracking-wider`}
                  placeholder="e.g. VV-1001"
                />
              </div>
              <div>
                <Label>Piece Title *</Label>
                <input name="name" required value={formData.name} onChange={handleChange} className={inputCls} placeholder="e.g. Kanchipuram Silk Saree" />
              </div>
              <div>
                <Label>Collection *</Label>
                <div className="relative">
                  <select name="category" value={formData.category} onChange={handleChange} className={`${inputCls} appearance-none pr-10`}>
                    <option value="" disabled>Assign Collection</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#F0EBE3]">
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
              <h2 className="font-dm-serif text-[17px] text-gray-900">Description</h2>
            </div>
            <div>
              <Label>Piece Description *</Label>
              <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} className={`${inputCls} resize-y leading-relaxed`} placeholder="Detail the weave, origin, zari work, and key characteristics of this piece..." />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#F0EBE3]">
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
              <h2 className="font-dm-serif text-[17px] text-gray-900">Pricing</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Sale Price (₹) *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-dm-sans font-semibold text-[14px]">₹</span>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className={`${inputCls} pl-8`} placeholder="0" />
                </div>
              </div>
              <div>
                <Label hint="Leave blank to match sale price">Original MRP (₹)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-dm-sans font-semibold text-[14px]">₹</span>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className={`${inputCls} pl-8`} placeholder="0" />
                </div>
              </div>
            </div>
            {discount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-[12px] font-dm-sans font-semibold text-emerald-700">{discount}% discount applied on this piece</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#F0EBE3]">
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
              <h2 className="font-dm-serif text-[17px] text-gray-900">Tags & Discovery</h2>
            </div>
            <div>
              <Label hint="Comma-separated. Used for search, filtering, and collections.">Tags</Label>
              <input name="tags" value={formData.tags} onChange={handleChange} className={inputCls} placeholder="e.g. Bridal, Handwoven, Zari, NEW ARRIVALS" />
            </div>
            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {formData.tags.split(",").map(t => t.trim()).filter(Boolean).map((t, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#F7F4EF] border border-[#E8E2D9] rounded-full text-[10px] font-dm-sans font-bold uppercase tracking-wider text-gray-700">{t}</span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default function CreateProductPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-60"><div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>}>
      <CreateProductContent />
    </Suspense>
  )
}
