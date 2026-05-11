"use client"

import { useState, useEffect, use, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

function EditProductContent({ params }) {
  const unwrappedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  const [formData, setFormData] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings", { cache: "no-store" })
        ])
        
        const products = await productsRes.json()
        const settings = await settingsRes.json()
        
        setCategories(settings.collectionsCategories || [])

        const product = products.find(p => p.serial === unwrappedParams.serial)
        if (product) {
          setFormData({
            ...product,
            originalPrice: product.originalPrice || "",
            tags: product.tags ? product.tags.join(", ") : ""
          })
        } else {
          toast.error("Product not found")
          router.push("/admin/products")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchProduct()
  }, [unwrappedParams.serial, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e, imageField) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(imageField)
    const data = new FormData()
    data.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data
      })
      const json = await res.json()
      if (json.url) {
        setFormData(prev => ({ ...prev, [imageField]: json.url }))
      }
    } catch (error) {
      toast.error("Image upload failed.")
    }
    setUploadingImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const tagsArray = formData.tags
      ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      rating: Number(formData.rating || 0),
      numReviews: Number(formData.numReviews || 0),
      tags: tagsArray
    }

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Piece updated successfully")
        router.refresh()
        router.push("/admin/products")
      } else {
        toast.error("Failed to update piece")
      }
    } catch (error) {
      toast.error("Error occurred")
    }
    setLoading(false)
  }

  if (fetchLoading) return (
    <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
       <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
    </div>
  )
  if (!formData) return null

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Luxury Header Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6 sticky top-0 bg-[#FAF9F6] z-30 py-4 -my-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center border border-[#E5E0D8] text-gray-500 bg-white hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-1">Curation Studio</span>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 tracking-tight truncate max-w-sm lg:max-w-md">{formData.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-[11px] font-bold text-gray-600 bg-transparent uppercase tracking-widest hover:text-gray-900 transition-all hidden sm:block">
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || uploadingImage !== null} 
            className="w-full sm:w-auto px-8 py-3 text-[11px] font-bold text-white bg-[#1A1A1A] tracking-widest uppercase hover:bg-[#111111] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 flex justify-center items-center gap-2"
          >
            {loading ? "Synchronizing..." : uploadingImage ? "Uploading..." : "Save Modifications"}
          </button>
        </div>
      </div>

      {/* Split Immersive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Left Pane - Gallery Workspace */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-[120px]">
           <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 space-y-6">
              <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest">Gallery Assets</h2>
              
              <div className="space-y-5">
                {[
                  { field: 'image1', label: 'Primary Feature' },
                  { field: 'image2', label: 'Detail View' }
                ].map((img) => (
                  <div key={img.field} className="group relative aspect-[4/5] w-full bg-[#FAF9F6] border-2 border-dashed border-[#E5E0D8] hover:border-[#D4AF37] hover:bg-white transition-all duration-500 flex items-center justify-center overflow-hidden">
                    {uploadingImage === img.field ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mb-3"></div>
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Syncing...</span>
                      </div>
                    ) : formData[img.field] && !formData[img.field].includes('placeholder') ? (
                      <>
                        <img src={formData[img.field]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
                           <span className="text-[10px] font-bold tracking-widest text-white uppercase mb-2">{img.label}</span>
                           <span className="text-[10px] font-bold tracking-widest text-gray-900 uppercase bg-white px-6 py-2">Replace</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-[10px] font-bold tracking-widest uppercase">Add {img.label}</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, img.field)} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      disabled={uploadingImage !== null}
                    />
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Right Pane - Forms */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10 space-y-8">
            <h2 className="text-[18px] font-bold font-display text-gray-900 border-b border-[#E5E0D8] pb-4">Essential Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Title / Name *</label>
                <input 
                  required 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                  placeholder="e.g. Kanchipuram Silk Saree"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">
                    Archive Serial 
                    <span className="px-1.5 py-0.5 border border-[#E5E0D8] text-[8px] bg-gray-50 tracking-widest text-gray-400">LOCKED</span>
                  </label>
                  <input 
                    disabled 
                    value={formData.serial} 
                    className="w-full bg-gray-50/50 border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-400 cursor-not-allowed outline-none font-mono tracking-wider" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Collection *</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none appearance-none"
                    >
                      <option value="" disabled>Assign Collection</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {formData.category && !categories.includes(formData.category) && (
                        <option value={formData.category}>{formData.category} (Legacy)</option>
                      )}
                    </select>
                    <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Curator's Notes *</label>
                <textarea 
                  required 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={6}
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-medium text-gray-800 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none resize-y leading-relaxed" 
                  placeholder="Detail the weave, origin, and characteristics..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10 space-y-8">
            <h2 className="text-[18px] font-bold font-display text-gray-900 border-b border-[#E5E0D8] pb-4">Commerce & Discovery</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Valuation (₹) *</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input 
                    required 
                    type="number"
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] pl-10 pr-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Original MRP (₹)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input 
                    type="number"
                    name="originalPrice" 
                    value={formData.originalPrice} 
                    onChange={handleChange} 
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] pl-10 pr-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#E5E0D8] pt-6 mt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Rating Overwrite</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating" 
                  value={formData.rating || ""} 
                  onChange={handleChange} 
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                  placeholder="e.g. 4.8"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Reviews Count</label>
                <input 
                  type="number"
                  name="numReviews" 
                  value={formData.numReviews || ""} 
                  onChange={handleChange} 
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                  placeholder="0"
                />
              </div>
            </div>

            <div className="border-t border-[#E5E0D8] pt-6 mt-2">
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Taxonomy Tags</label>
              <input 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none" 
                placeholder="e.g. Bridal, Handwoven, Zari (Comma separated)"
              />
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Used for advanced filtering and search indexing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProduct({ params }) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    }>
      <EditProductContent params={params} />
    </Suspense>
  )
}
