"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

function CreateProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [serialError, setSerialError] = useState("")
  const [checkingSerial, setCheckingSerial] = useState(false)
  
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    serial: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    tags: "",
    image1: "",
    image2: ""
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" })
        if (res.ok) {
          const config = await res.json()
          const cats = config.collectionsCategories || []
          setCategories(cats)
          if (cats.length > 0) {
            setFormData(prev => ({ ...prev, category: cats[0] }))
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err)
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === "serial") {
      setSerialError("")
    }
  }

  const handleSerialBlur = async () => {
    const serial = formData.serial.trim()
    if (!serial) return
    setCheckingSerial(true)
    try {
      const res = await fetch(`/api/products/check-serial?serial=${encodeURIComponent(serial)}`)
      const data = await res.json()
      if (!data.available) {
        setSerialError("A product with this serial already exists.")
      } else {
        setSerialError("")
      }
    } catch {
      // silently ignore network errors during check
    } finally {
      setCheckingSerial(false)
    }
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
      toast.error("Image upload failed. Try again.")
    }
    setUploadingImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (serialError || checkingSerial) return
    setLoading(true)

    const tagsArray = formData.tags
      ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      : []

    const payload = {
      ...formData,
      serial:        formData.serial.trim(),
      price:         Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      tags:          tagsArray
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

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
    } catch (error) {
      toast.error("Error occurred: " + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Luxury Header Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6 sticky top-0 bg-[#FAF9F6] z-30 py-4 -my-4 mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center border border-[#E5E0D8] text-gray-500 bg-white hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-1">Catalog Expansion</span>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 tracking-tight">Curate New Piece</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 text-[11px] font-bold text-gray-600 bg-transparent uppercase tracking-widest hover:text-gray-900 transition-all hidden sm:block">
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || uploadingImage !== null || !!serialError || checkingSerial} 
            className="w-full sm:w-auto px-8 py-3 text-[11px] font-bold text-white bg-[#1A1A1A] tracking-widest uppercase hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
          >
            {loading ? "Archiving..." : uploadingImage ? "Uploading..." : "Publish Piece"}
          </button>
        </div>
      </div>

      {/* Split Immersive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane - Gallery Workspace */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-[120px]">
           <div className="bg-white border border-[#E5E0D8] shadow-sm p-5 space-y-5">
              <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-widest">Gallery Assets</h2>
              
              <div className="space-y-5">
                {[
                  { field: 'image1', label: 'Primary Feature' },
                  { field: 'image2', label: 'Detail View' }
                ].map((img) => (
                  <div key={img.field} className="group relative aspect-[4/5] w-full bg-[#FAF9F6] border-2 border-dashed border-[#E5E0D8] hover:border-[#D4AF37] transition-all flex items-center justify-center overflow-hidden">
                    {uploadingImage === img.field ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mb-3"></div>
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Syncing...</span>
                      </div>
                    ) : formData[img.field] ? (
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
          
          <div className="bg-white border border-[#E5E0D8] shadow-sm p-8 space-y-6">
            <h2 className="text-[18px] font-bold font-display text-gray-900 border-b border-[#E5E0D8] pb-4">Essential Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Title / Name *</label>
                <input 
                  required 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 focus:border-[#D4AF37] focus:bg-white transition-all outline-none" 
                  placeholder="e.g. Kanchipuram Silk Saree"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Archive Serial *</label>
                  <input 
                    required 
                    name="serial" 
                    value={formData.serial} 
                    onChange={handleChange}
                    onBlur={handleSerialBlur}
                    className={`w-full bg-[#FAF9F6] border px-5 py-3.5 text-[14px] font-bold text-gray-900 focus:bg-white transition-all outline-none font-mono tracking-wider ${serialError ? 'border-red-400 focus:border-red-400' : 'border-[#E5E0D8] focus:border-[#D4AF37]'}`}
                    placeholder="e.g. VV-1001"
                  />
                  {checkingSerial && (
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Checking availability...</p>
                  )}
                  {serialError && (
                    <p className="text-[10px] text-red-500 mt-1.5 font-bold">{serialError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Collection *</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 focus:border-[#D4AF37] focus:bg-white transition-all outline-none appearance-none"
                    >
                      <option value="" disabled>Assign Collection</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
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
                  className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-medium text-gray-800 focus:border-[#D4AF37] focus:bg-white transition-all outline-none resize-y leading-relaxed" 
                  placeholder="Detail the weave, origin, and characteristics..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E0D8] shadow-sm p-8 space-y-6">
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
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] pl-10 pr-5 py-3.5 text-[14px] font-bold text-gray-900 focus:border-[#D4AF37] focus:bg-white transition-all outline-none" 
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
                    className="w-full bg-[#FAF9F6] border border-[#E5E0D8] pl-10 pr-5 py-3.5 text-[14px] font-bold text-gray-900 focus:border-[#D4AF37] focus:bg-white transition-all outline-none" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-[#E5E0D8] pt-6 mt-2">
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Taxonomy Tags</label>
              <input 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 focus:border-[#D4AF37] focus:bg-white transition-all outline-none" 
                placeholder="e.g. Bridal, Handwoven (Comma separated)"
              />
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Used for advanced filtering and search indexing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateProduct() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    }>
      <CreateProductContent />
    </Suspense>
  )
}
