"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  
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

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      alert("Image upload failed. Try again.")
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
      tags: tagsArray
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        router.refresh()
        router.push("/admin/products")
      } else {
        const errData = await res.json()
        alert(`Failed to create product: ${errData.error || errData.message}`)
      }
    } catch (error) {
      alert("Error occurred: " + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-10 py-6">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-bold font-display text-gray-900 tracking-tight">Register Masterpiece</h1>
             <p className="text-[11px] text-brand-green/70 tracking-[0.4em] uppercase font-bold mt-1.5 ml-0.5">Initiating Archive Entry</p>
          </div>
          <div className="flex items-center gap-10">
            <button type="button" onClick={() => router.back()} className="text-[11px] font-bold tracking-[0.4em] text-gray-400 uppercase hover:text-gray-900 transition-colors">
              Discard Draft
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || uploadingImage !== null} 
              className="bg-black hover:bg-brand-green text-white px-12 py-4 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl shadow-black/10 active:scale-95 disabled:opacity-50 min-w-[220px]"
            >
              {loading ? "Archiving..." : uploadingImage ? "Uploading Asset..." : "Commit to Archive"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-10 py-16 space-y-16 pb-48 animate-in slide-in-from-bottom-8 duration-1000">
        
        {/* Basic Information Card */}
        <section className="bg-white rounded-[56px] p-14 border border-gray-100 shadow-sm space-y-14 group hover:shadow-2xl transition-all duration-1000">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-900 border border-gray-100 shadow-inner group-hover:bg-brand-green group-hover:text-white transition-all duration-700">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
               <h3 className="text-3xl font-bold font-display text-gray-900">Archive Definition</h3>
               <p className="text-md text-gray-400 font-medium mt-1.5">Establishing the unique identity of this heritage asset.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Master Serial / ID *</label>
              <input 
                required 
                name="serial" 
                value={formData.serial} 
                onChange={handleChange} 
                placeholder="e.g. KS-1005"
                className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] px-8 py-5 font-bold tracking-[0.3em] uppercase text-sm focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Primary Archive *</label>
              <div className="relative group/dropdown">
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-white border-2 rounded-[24px] px-8 py-5 font-bold tracking-[0.3em] uppercase text-sm transition-all duration-500 cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${isDropdownOpen ? 'border-brand-green ring-4 ring-brand-green/5' : 'border-gray-100 hover:border-brand-green/30'}`}
                >
                  <span className={formData.category ? 'text-gray-900' : 'text-gray-300'}>
                    {formData.category || "Select Archive"}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Custom Options Menu */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-xl bg-white/95">
                      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        {categories.map((cat, idx) => (
                          <div
                            key={cat}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, category: cat }));
                              setIsDropdownOpen(false);
                            }}
                            className={`px-8 py-4 text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer flex items-center justify-between group/opt ${formData.category === cat ? 'bg-brand-green text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-green'}`}
                          >
                            <span>{cat}</span>
                            {formData.category === cat && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Masterpiece Title *</label>
            <input 
              required 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. MAGENTA PURE SILK KANCHIPURAM"
              className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] px-8 py-6 font-bold font-display text-3xl text-gray-900 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm" 
            />
          </div>

          <div className="space-y-4">
            <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Design Narrative *</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={5}
              placeholder="Tell the story of this saree's craftsmanship and weave..."
              className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[40px] px-10 py-8 text-gray-600 font-medium leading-relaxed text-lg focus:border-brand-green focus:bg-white transition-all outline-none resize-none shadow-sm" 
            />
          </div>
        </section>

        {/* Pricing Card */}
        <section className="bg-white rounded-[56px] p-14 border border-gray-100 shadow-sm space-y-14 group hover:shadow-2xl transition-all duration-1000">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-900 border border-gray-100 shadow-inner group-hover:bg-brand-gold group-hover:text-white transition-all duration-700">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.599-1c.51-.598.599-1.33.599-2s-.09-1.402-.599-1M12 16c-1.11 0-2.08-.402-2.599-1M12 16V15" /></svg>
            </div>
            <div>
               <h3 className="text-3xl font-bold font-display text-gray-900">Commercial Strategy</h3>
               <p className="text-md text-gray-400 font-medium mt-1.5">Configuring market valuation and discovery tags.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Selling Valuation (INR) *</label>
              <div className="relative">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-gold font-display text-2xl">₹</span>
                <input 
                  required 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] pl-16 pr-8 py-5 font-bold text-xl text-gray-900 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Original MRP (INR)</label>
              <div className="relative">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 font-display text-2xl">₹</span>
                <input 
                  type="number" 
                  name="originalPrice" 
                  value={formData.originalPrice} 
                  onChange={handleChange} 
                  className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] pl-16 pr-8 py-5 font-bold text-xl text-gray-900 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[12px] font-bold tracking-[0.4em] text-gray-400 uppercase block pl-2">Exhibition Categories (Comma Separated)</label>
            <input 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange} 
              placeholder="e.g. BRIDAL, WEDDING, SILK, LUXURY"
              className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] px-8 py-6 font-bold tracking-[0.4em] uppercase text-sm text-gray-600 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm" 
            />
          </div>
        </section>

        {/* Media Assets Card */}
        <section className="bg-white rounded-[56px] p-14 border border-gray-100 shadow-sm space-y-14 group hover:shadow-2xl transition-all duration-1000">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-zinc-50 rounded-[24px] flex items-center justify-center text-zinc-900 border border-gray-100 shadow-inner group-hover:bg-brand-green group-hover:text-white transition-all duration-700">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                 <h3 className="text-3xl font-bold font-display text-gray-900">Atmospheric Imagery</h3>
                 <p className="text-md text-gray-400 font-medium mt-1.5">Acquiring high-resolution visual documentation.</p>
              </div>
            </div>
            <div className="px-8 py-3 bg-blue-50/50 border border-blue-100/50 rounded-full flex items-center gap-4 shadow-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.4)]"></div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-blue-600 uppercase">CDN SYNC ACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {[
              { field: 'image1', label: 'Primary Portfolio Shot', desc: 'The leading perspective for the collection search.' },
              { field: 'image2', label: 'Secondary Angle', desc: 'Detail focus on texture and weaving patterns.' }
            ].map((img, i) => (
              <div key={img.field} className="space-y-8">
                <div>
                  <h4 className="text-[12px] font-bold tracking-[0.5em] text-gray-900 uppercase">ASSET 0{i+1}. {img.label}</h4>
                  <p className="text-sm text-gray-400 mt-2.5 font-medium leading-relaxed">{img.desc}</p>
                </div>
                
                <div className="relative aspect-[4/5] w-full rounded-[48px] bg-[#F9F8F6]/50 border-2 border-dashed border-gray-100 hover:border-brand-green transition-all duration-1000 flex items-center justify-center overflow-hidden group shadow-inner cursor-pointer">
                  {uploadingImage === img.field ? (
                    <div className="flex flex-col items-center gap-8">
                       <div className="animate-spin h-14 w-14 border-b-2 border-brand-green rounded-full"></div>
                       <span className="text-[12px] font-bold tracking-[0.4em] text-brand-green uppercase animate-pulse">Acquiring Asset...</span>
                    </div>
                  ) : formData[img.field] ? (
                    <>
                      <img src={formData[img.field]} className="w-full h-full object-contain p-14 transform group-hover:scale-110 transition-transform duration-[2s]" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center pointer-events-none">
                         <span className="text-[12px] font-bold tracking-[0.5em] text-white uppercase bg-black/30 backdrop-blur-xl px-12 py-5 rounded-full border border-white/20 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700">Replace Master Asset</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-10">
                       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl text-gray-100 border border-gray-100 group-hover:scale-110 transition-transform duration-700">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                       </div>
                       <div className="text-center space-y-3">
                          <p className="text-sm font-bold text-gray-900 tracking-[0.3em] uppercase">Upload High-Res Portrait</p>
                          <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed font-medium">PNG, JPG or WEBP<br/>Vertical Orientation Preferred</p>
                       </div>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, img.field)} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                    disabled={uploadingImage !== null}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
