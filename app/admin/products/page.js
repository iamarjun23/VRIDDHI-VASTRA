"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import ConfirmDialog from "../../components/ConfirmDialog"
import toast from "react-hot-toast"

function ProductsAdminContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [categories, setCategories] = useState([])

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
      setFilteredProducts(data)

      const cats = new Set(data.map(p => p.category).filter(Boolean))
      setCategories(["All", ...Array.from(cats)])
    } catch (err) {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = products;
    if (activeFilter !== "All") {
      result = result.filter(p => p.category === activeFilter)
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.serial.toLowerCase().includes(q)
      )
    }
    setFilteredProducts(result)
  }, [searchQuery, activeFilter, products])

  const deleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial: productToDelete.serial })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        toast.success("Piece permanently deleted")
        setProducts(prev => prev.filter(p => p.serial !== productToDelete.serial))
      } else {
        toast.error(data.message || "Deletion failed")
      }
    } catch (err) {
      toast.error("An error occurred during deletion")
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setProductToDelete(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Showroom</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Luxury Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5E0D8] pb-8 px-1">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-luxury block mb-3">Inventory Operations</span>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold font-display text-gray-900 leading-none">Catalog</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:flex-1 lg:w-[320px]">
            <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5E0D8] pl-11 pr-4 py-3.5 text-[14px] font-medium text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none shadow-sm transition-all"
            />
          </div>
          <Link
            href="/admin/products/create"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-luxury uppercase rounded-none hover:bg-black transition-all duration-300 active:scale-[0.98] shrink-0 shadow-xl shadow-black/10"
          >
            Add Piece
          </Link>
        </div>
      </div>

      {/* Filter Ribbon - Luxury Optimized */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-[#E5E0D8]/40 -mx-3 px-3 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`whitespace-nowrap px-6 py-4 text-[9px] font-bold uppercase tracking-luxury transition-all duration-500 relative ${activeFilter === cat ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {cat}
            {activeFilter === cat && (
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#D4AF37] animate-in slide-in-from-left-full duration-500" />
            )}
          </button>
        ))}
      </div>

      {/* Hybrid Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-24 text-center flex flex-col items-center justify-center bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <svg className="w-12 h-12 text-[#E5E0D8] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h3 className="text-[20px] font-bold font-display text-gray-900 mb-2">No results found</h3>
          <p className="text-[14px] text-gray-500 mb-6 max-w-sm font-medium">Try adjusting your search criteria or category filters to find the intended piece.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.serial} style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }} className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white border border-[#E5E0D8] group hover:border-[#D4AF37] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex flex-col hover:-translate-y-1 relative z-10 hover:z-20">

              {/* Product Thumbnail (4:5 Aspect) */}
              <div className="relative w-full aspect-[4/5] bg-[#FAF9F6] overflow-hidden border-b border-[#E5E0D8]">
                {product.image1 && !product.image1.includes('placeholder') ? (
                  <Image src={product.image1} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#E5E0D8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {product.image1 && !product.image1.includes('placeholder') ? (
                    <span className="flex items-center justify-center w-5 h-5 bg-white border border-[#E5E0D8] rounded-full shadow-sm" title="Live">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-5 h-5 bg-white border border-[#E5E0D8] rounded-full shadow-sm" title="Draft">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    </span>
                  )}
                </div>

                {/* Desktop Hover Actions Overlay */}
                <div className="hidden lg:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Link
                    href={`/admin/products/${product.serial}`}
                    className="w-3/4 py-2.5 bg-white text-gray-900 text-[10px] font-bold tracking-widest uppercase text-center border border-white hover:bg-[#1A1A1A] hover:border-[#1A1A1A] hover:text-[#D4AF37] transition-all duration-300 shadow-sm"
                  >
                    Edit Details
                  </Link>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
                      setIsConfirmOpen(true);
                    }}
                    className="w-3/4 py-2.5 bg-red-600/90 text-white text-[10px] font-bold tracking-widest uppercase text-center border border-red-500/50 hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] truncate">{product.category}</span>
                <p className="text-[13px] font-bold font-display text-gray-900 truncate tracking-tight">{product.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-mono text-gray-400">{product.serial}</p>
                  <p className="text-[13px] font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                </div>
                {/* Mobile Actions */}
                <div className="flex lg:hidden gap-2 mt-3 pt-3 border-t border-[#E5E0D8]">
                  <Link href={`/admin/products/${product.serial}`} className="flex-1 py-2 bg-[#FAF9F6] text-center text-[10px] font-bold uppercase tracking-widest text-gray-900 border border-[#E5E0D8] active:bg-gray-100">
                    Edit
                  </Link>
                  <button onClick={() => { setProductToDelete(product); setIsConfirmOpen(true); }} className="w-10 flex items-center justify-center border border-red-100 text-red-500 bg-red-50 active:bg-red-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteProduct}
        title="Remove Piece"
        message={productToDelete ? `Are you sure you want to completely erase "${productToDelete.name}" from the inventory archive? This action cannot be undone.` : "Confirm deletion?"}
      />
    </div>
  )
}

export default function ProductsAdmin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
        <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Showroom</p>
      </div>
    }>
      <ProductsAdminContent />
    </Suspense>
  )
}