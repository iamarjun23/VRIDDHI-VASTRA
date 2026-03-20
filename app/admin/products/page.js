"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ConfirmDialog from "../../components/ConfirmDialog"

export default function ProductsAdmin() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ serial: productToDelete.serial })
    })

    await fetchProducts();
    setIsDeleting(false);
    setIsConfirmOpen(false);
    setProductToDelete(null);
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Sticky Header Section */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 md:px-10 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 tracking-tight">Product Archive</h1>
             <p className="text-[10px] md:text-[11px] text-brand-green/70 tracking-[0.4em] uppercase font-bold mt-1 md:mt-1.5 ml-0.5">Vriddhi Vastra Inventory</p>
          </div>
          <div className="flex items-center">
            <Link href="/admin/products/create" className="bg-black hover:bg-brand-green text-white px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-2xl shadow-black/10 active:scale-95 flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              Register Piece
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-10 py-8 md:py-12 space-y-8 md:space-y-16 pb-24 md:pb-32 animate-in slide-in-from-bottom-6 duration-1000">
        
        {/* Stats Section with Expansive Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100/80 p-6 md:p-10 flex items-center justify-between group hover:shadow-2xl transition-all duration-700">
            <div>
              <p className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase">Inventory Size</p>
              <p className="mt-2 md:mt-4 text-3xl md:text-5xl font-bold font-display text-gray-900 tracking-tighter">{products.length}</p>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-green/5 rounded-[20px] md:rounded-[28px] flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-700 shadow-inner">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100/80 p-6 md:p-10 flex items-center justify-between group hover:shadow-2xl transition-all duration-700">
            <div>
              <p className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase">Distinct Categories</p>
              <p className="mt-2 md:mt-4 text-3xl md:text-5xl font-bold font-display text-gray-900 tracking-tighter">{new Set(products.map(p => p.category)).size}</p>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gold/5 rounded-[20px] md:rounded-[28px] flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-700 shadow-inner">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
          </div>
          <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100/80 p-6 md:p-10 flex items-center justify-between group hover:shadow-2xl transition-all duration-700">
            <div>
              <p className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase">Asset Sync Status</p>
              <div className="mt-2 md:mt-4 flex items-center gap-4 md:gap-6">
                <span className="text-3xl md:text-5xl font-bold font-display text-gray-900 tracking-tighter whitespace-nowrap">Active</span>
                <span className="relative flex h-3.5 w-3.5 md:h-4 md:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 md:h-4 md:w-4 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]"></span>
                </span>
              </div>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50/50 rounded-[20px] md:rounded-[28px] flex items-center justify-center text-green-600 shadow-inner">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        {loading ? (
          <div className="bg-white rounded-[40px] md:rounded-[64px] p-24 md:p-48 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="animate-spin h-12 w-12 md:h-16 md:w-16 border-b-2 border-brand-green rounded-full mb-6 md:mb-10"></div>
            <p className="font-bold font-display text-xl md:text-2xl text-gray-300 italic">Accessing digital archives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-12">
            {products.map(product => (
              <div key={product.serial} className="bg-white rounded-[40px] md:rounded-[64px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-1000 group flex flex-col hover:-translate-y-2 md:hover:-translate-y-3">
                {/* Image Area */}
                <Link href={`/admin/products/${product.serial}`} className="relative aspect-[4/5] bg-[#F9F8F6]/50 overflow-hidden rounded-[24px] md:rounded-[40px] shadow-inner flex items-center justify-center group/img cursor-pointer">
                  {product.image1 && !product.image1.includes('placeholder') ? (
                    <img className="w-full h-full object-contain p-6 md:p-12 transform group-hover/img:scale-110 transition-transform duration-[1.5s]" src={product.image1} alt={product.name} />
                  ) : (
                    <div className="flex flex-col items-center gap-4 md:gap-8 text-gray-100">
                      <svg className="w-16 h-16 md:w-32 md:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[9px] md:text-[11px] uppercase font-bold tracking-[0.4em] md:tracking-[0.6em]">ASSET MISSING</span>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute top-4 md:top-12 left-4 md:left-12">
                    <span className={`inline-flex items-center px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase backdrop-blur-xl border shadow-sm ${product.image1 && !product.image1.includes('placeholder') ? 'bg-white/90 text-green-700 border-green-100/50' : 'bg-white/90 text-brand-gold border-brand-gold/20'}`}>
                      {product.image1 && !product.image1.includes('placeholder') ? 'LIVE' : 'PENDING'}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 md:bottom-12 right-4 md:right-12">
                    <div className="bg-black/90 backdrop-blur-2xl text-white px-6 md:px-10 py-3 md:py-5 rounded-[24px] md:rounded-[40px] shadow-2xl flex flex-col items-center border border-white/10 group-hover:scale-110 transition-transform duration-700">
                      <span className="text-lg md:text-2xl font-bold tracking-tight font-sans">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] md:text-[12px] text-gray-400 line-through mt-0.5 md:mt-1.5 opacity-60">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Hover Edit Overlay */}
                  <div className="absolute inset-0 bg-brand-green/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <span className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-white uppercase bg-black/40 backdrop-blur-xl px-8 md:px-12 py-3 md:py-5 rounded-full border border-white/20 shadow-2xl scale-90 group-hover/img:scale-100 transition-transform duration-700">Refine</span>
                  </div>
                </Link>

                {/* Info Area */}
                <div className="p-6 md:p-12 flex-1 flex flex-col justify-between space-y-6 md:space-y-12 bg-white">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold font-display text-gray-900 group-hover:text-brand-green transition-colors duration-700 truncate pr-4 md:pr-8 leading-[1.3]">{product.name}</h2>
                    <div className="flex items-center gap-3 md:gap-6 mt-2 md:mt-4">
                        <span className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-brand-gold uppercase">{product.category}</span>
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-100 rounded-full"></span>
                        <span className="text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-gray-300 uppercase truncate">ARC {product.serial}</span>
                    </div>
                    
                    <div className="flex gap-2 md:gap-3 flex-wrap mt-6 md:mt-10">
                      {product.tags && product.tags.length > 0 ? product.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase bg-[#F9F8F6] text-gray-400 border border-gray-100 transition-all group-hover:bg-brand-green/10 group-hover:text-brand-green group-hover:border-brand-green/20">
                          {tag}
                        </span>
                      )) : <span className="text-[9px] md:text-[11px] italic text-gray-200 uppercase tracking-widest pl-1 font-medium">No Editorial Tags</span>}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex justify-end pt-6 md:pt-10 border-t border-gray-50/50">
                    <button 
                      onClick={() => {
                        setProductToDelete(product);
                        setIsConfirmOpen(true);
                      }} 
                      className="p-4 md:p-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-[24px] md:rounded-[32px] transition-all duration-700 hover:scale-110 active:scale-95 shadow-sm group/del"
                    >
                      <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-full bg-white rounded-[40px] md:rounded-[80px] p-16 md:p-48 border border-gray-50 shadow-sm text-center">
                 <div className="w-20 h-20 md:w-32 md:h-32 bg-[#F9F8F6] rounded-full flex items-center justify-center mx-auto mb-10 md:mb-16 text-gray-200 shadow-inner group hover:scale-110 transition-transform duration-700">
                    <svg className="w-10 h-10 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                 </div>
                 <h3 className="text-3xl md:text-5xl font-bold font-display text-gray-900 mb-4 md:mb-6 tracking-tight">Archive is Vacant</h3>
                 <p className="text-gray-400 mb-10 md:mb-16 max-w-lg mx-auto leading-relaxed text-md md:text-lg font-medium px-4">Elevate your collection. Begin your brand's digital journey by registering a new masterpiece into the vault.</p>
                 <Link href="/admin/products/create" className="bg-black text-white px-10 md:px-16 py-4 md:py-6 rounded-full text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase hover:bg-brand-green transition-all shadow-2xl shadow-black/30 active:scale-95 inline-block">
                   Initiate Registration
                 </Link>
              </div>
            )}
          </div>
        )}
        
        <ConfirmDialog 
          isOpen={isConfirmOpen}
          isLoading={isDeleting}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={deleteProduct}
          title="Vault Decommissioning"
          message={productToDelete ? `Are you sure you wish to permanently decommission "${productToDelete.name}"? This action erases the heritage asset from the digital archive and cannot be reversed.` : "Confirm asset decommissioning?"}
        />
      </main>
    </div>
  )
}