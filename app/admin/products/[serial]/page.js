"use client"

import { useState, useEffect, use, Suspense } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const inputCls = "w-full bg-[#F7F4EF] border border-[#E8E2D9] rounded-xl px-4 py-3 text-[14px] font-dm-sans text-gray-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 focus:bg-white outline-none transition-all placeholder-gray-400"

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
      {/* Main image */}
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#1A1A1A] min-h-0 group cursor-pointer" style={{ minHeight: '320px' }}>
        <input type="file" accept="image/*" onChange={e => onUpload(e, active)} className="absolute inset-0 opacity-0 cursor-pointer z-30" disabled={uploadingImage !== null} />
        {uploadingImage === active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-dm-sans font-bold text-white/60 uppercase tracking-widest">Uploading...</span>
          </div>
        ) : (active === 'image1' ? image1 : image2) ? (
          <>
            <img src={active === 'image1' ? image1 : image2} alt="Product" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white text-gray-900 text-[10px] font-dm-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-xl">Replace Image</span>
            </div>
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
        {['image1', 'image2'].map(key => {
          const img = key === 'image1' ? image1 : image2
          const label = key === 'image1' ? 'Primary' : 'Secondary'
          const isActive = active === key
          const isUploading = uploadingImage === key
          return (
            <button key={key} type="button" onClick={() => setActive(key)} className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${isActive ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20' : 'border-[#E8E2D9] hover:border-gray-300'}`}>
              {isUploading ? (
                <div className="absolute inset-0 bg-[#F7F4EF] flex items-center justify-center"><div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>
              ) : img && !img.includes('placeholder') ? (
                <>
                  <img src={img} alt={label} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-[#D4AF37]/20' : 'bg-black/0'}`} />
                </>
              ) : (
                <div className="absolute inset-0 bg-[#F7F4EF] flex items-center justify-center"><span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider">No Image</span></div>
              )}
              <div className={`absolute bottom-0 left-0 right-0 py-1 text-[8px] font-dm-sans font-bold uppercase tracking-wider text-center ${isActive ? 'bg-[#D4AF37] text-black' : 'bg-black/40 text-white'}`}>{label}</div>
            </button>
          )
        })}
      </div>

      {/* Secondary upload trigger */}
      <div className="relative">
        <input type="file" accept="image/*" onChange={e => { setActive('image2'); onUpload(e, 'image2') }} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={uploadingImage !== null} />
        <button type="button" className="w-full py-2.5 border-2 border-dashed border-[#444] hover:border-[#D4AF37] rounded-xl text-[10px] font-dm-sans font-bold uppercase tracking-wider text-white/30 hover:text-[#D4AF37] transition-all">
          + Upload Secondary Image
        </button>
      </div>
    </div>
  )
}

// ── Edit Content ────────────────────────────────────────────────────────────────

function EditProductContent({ params }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          fetch(`/api/products/${unwrappedParams.serial}`),
          fetch("/api/settings", { cache: "no-store" })
        ])
        const settings = await settingsRes.json()
        setCategories(settings.collectionsCategories || [])
        if (productRes.ok) {
          const product = await productRes.json()
          setFormData({ ...product, originalPrice: product.originalPrice || "", tags: product.tags ? product.tags.join(", ") : "" })
        } else {
          toast.error("Product not found")
          router.push("/admin/products")
        }
      } catch (err) { console.error(err) } finally { setFetchLoading(false) }
    }
    fetchProduct()
  }, [unwrappedParams.serial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
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
    setLoading(true)
    const tagsArray = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      rating: Number(formData.rating || 0),
      numReviews: Number(formData.numReviews || 0),
      tags: tagsArray
    }
    try {
      const res = await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (res.ok) {
        toast.success("Piece updated successfully")
        router.refresh()
        router.push("/admin/products")
      } else {
        toast.error("Failed to update piece")
      }
    } catch { toast.error("Error occurred") }
    setLoading(false)
  }

  if (fetchLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
    </div>
  )
  if (!formData) return null

  const discount = formData.originalPrice && formData.price
    ? Math.round((1 - Number(formData.price) / Number(formData.originalPrice)) * 100)
    : 0

  return (
    <div className="pb-12">

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F7F4EF] py-3 -mx-4 sm:-mx-5 lg:-mx-6 xl:-mx-8 px-4 sm:px-5 lg:px-6 xl:px-8 border-b border-[#E8E2D9] flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E8E2D9] bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="min-w-0">
            <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] hidden sm:block">Curation Studio</p>
            <h1 className="font-dm-serif text-[16px] sm:text-[20px] text-gray-900 leading-tight truncate">{formData.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a href={`/product/${formData.serial}`} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-dm-sans font-bold text-gray-500 uppercase tracking-wider border border-[#E8E2D9] rounded-xl hover:border-gray-300 hover:text-gray-700 transition-all">
            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Preview
          </a>
          <button type="button" onClick={() => router.back()} className="hidden sm:block px-4 py-2 text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors">Discard</button>
          <button onClick={handleSubmit} disabled={loading || uploadingImage !== null} className="px-5 sm:px-6 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/10">
            {loading ? "Saving..." : uploadingImage ? "Uploading..." : "Save Changes"}
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
          {/* Serial badge */}
          <div className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl">
            <span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-wider">Serial</span>
            <span className="font-mono text-[13px] font-bold text-gray-700 tracking-wider">{formData.serial}</span>
            <span className="text-[8px] font-dm-sans font-bold text-gray-300 uppercase bg-gray-100 px-1.5 py-0.5 rounded">Locked</span>
          </div>
        </div>

        {/* Right — Form */}
        <div className="space-y-4">

          {/* Identity */}
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#F0EBE3]">
              <div className="w-1.5 h-5 bg-[#D4AF37] rounded-full" />
              <h2 className="font-dm-serif text-[17px] text-gray-900">Identity</h2>
            </div>
            <div className="space-y-4">
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
                    {formData.category && !categories.includes(formData.category) && (
                      <option value={formData.category}>{formData.category} (Legacy)</option>
                    )}
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
              <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} className={`${inputCls} resize-y leading-relaxed`} placeholder="Detail the weave, origin, and characteristics..." />
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
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-[12px] font-dm-sans font-semibold text-emerald-700">{discount}% discount applied on this piece</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F0EBE3]">
              <div>
                <Label hint="0.0 – 5.0">Rating Override</Label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating || ""} onChange={handleChange} className={inputCls} placeholder="e.g. 4.8" />
              </div>
              <div>
                <Label>Review Count</Label>
                <input type="number" name="numReviews" value={formData.numReviews || ""} onChange={handleChange} className={inputCls} placeholder="0" />
              </div>
            </div>
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

export default function EditProduct({ params }) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
      </div>
    }>
      <EditProductContent params={params} />
    </Suspense>
  )
}
