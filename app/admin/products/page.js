"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import ConfirmDialog from "../../components/ConfirmDialog"
import toast from "react-hot-toast"

function ProductsAdminContent() {
  const searchParams = useSearchParams()
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
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    let result = products
    if (activeFilter !== "All") result = result.filter(p => p.category === activeFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.serial.toLowerCase().includes(q))
    }
    setFilteredProducts(result)
  }, [searchQuery, activeFilter, products])

  const deleteProduct = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
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
    } catch {
      toast.error("An error occurred during deletion")
    } finally {
      setIsDeleting(false)
      setIsConfirmOpen(false)
      setProductToDelete(null)
    }
  }

  if (loading) return (
    <div className="space-y-5 pb-12">
      <div className="flex justify-between items-end border-b border-[#E8E2D9] pb-5 pt-1">
        <div className="space-y-2">
          <div className="h-2.5 w-24 bg-gray-200 animate-pulse rounded-full" />
          <div className="h-7 w-36 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
            <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-2.5 w-2/3 bg-gray-100 animate-pulse rounded-full" />
              <div className="h-3.5 w-full bg-gray-100 animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-5 pb-12">

      {/* Page Header */}
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D9] pb-4">
          <div>
            <p className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-1">Inventory Operations</p>
            <h1 className="font-dm-serif text-[clamp(1.5rem,3vw,2.2rem)] text-gray-900">Catalog</h1>
          </div>
          <Link
            href="/admin/products/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-black/10 self-start sm:self-auto"
          >
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Piece
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8E2D9] rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-dm-sans text-gray-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[10px] font-dm-sans font-bold tracking-[0.1em] uppercase transition-all ${
                  activeFilter === cat
                    ? 'bg-[#1A1A1A] text-white shadow-sm'
                    : 'bg-white border border-[#E8E2D9] text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-[11px] font-dm-sans text-gray-400">
        {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D9] py-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="font-dm-serif text-[18px] text-gray-900 mb-2">No results found</p>
          <p className="text-[13px] font-dm-sans text-gray-400 max-w-xs">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product, index) => {
            const hasPrimary = product.image1 && !product.image1.includes('placeholder')
            const hasSecondary = product.image2 && !product.image2.includes('placeholder')
            return (
              <div
                key={product.serial}
                className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* ── Image Zone ────────────────────────────────────────── */}
                <div className="relative w-full aspect-[4/5] bg-[#F7F4EF] overflow-hidden">

                  {hasPrimary ? (
                    <>
                      {/* Primary image */}
                      <Image
                        src={product.image1}
                        alt={product.name}
                        fill
                        className={`object-cover absolute inset-0 transition-all duration-500 ${hasSecondary ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      {/* Secondary image fades in on hover */}
                      {hasSecondary && (
                        <Image
                          src={product.image2}
                          alt={`${product.name} – detail`}
                          fill
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      )}
                      {/* Dot indicator — shows which image is visible */}
                      {hasSecondary && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-90 group-hover:opacity-40 transition-opacity shadow-sm" />
                          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-30 group-hover:opacity-90 transition-opacity shadow-sm" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}

                  {/* Image count badge */}
                  {hasSecondary && (
                    <div className="absolute top-2.5 left-2.5 bg-black/50 text-white text-[9px] font-dm-sans font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm z-10">
                      2 imgs
                    </div>
                  )}

                  {/* Active status dot */}
                  <div
                    className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 border-white shadow-sm z-10"
                    style={{ background: hasPrimary ? '#22c55e' : '#f59e0b' }}
                  />

                  {/* Desktop hover overlay — edit / delete */}
                  <div className="hidden lg:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-col items-center justify-end pb-4 gap-2 backdrop-blur-[2px] z-20">
                    <Link
                      href={`/admin/products/${product.serial}`}
                      onClick={e => e.stopPropagation()}
                      className="w-[78%] py-2 bg-white text-gray-900 text-[10px] font-dm-sans font-bold tracking-widest uppercase text-center rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all"
                    >
                      Edit Piece
                    </Link>
                    <button
                      onClick={e => { e.stopPropagation(); setProductToDelete(product); setIsConfirmOpen(true) }}
                      className="w-[78%] py-2 bg-red-600/90 text-white text-[10px] font-dm-sans font-bold tracking-widest uppercase text-center rounded-xl hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* ── Metadata ──────────────────────────────────────────── */}
                <div className="p-3">
                  {product.category && (
                    <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.18em] truncate mb-0.5">{product.category}</p>
                  )}
                  <p className="text-[13px] font-dm-sans font-semibold text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[10px] font-mono text-gray-400 truncate">{product.serial}</p>
                    <p className="text-[12px] font-dm-sans font-bold text-gray-900 shrink-0 ml-2">₹{product.price?.toLocaleString()}</p>
                  </div>

                  {/* Mobile actions */}
                  <div className="flex lg:hidden gap-2 mt-3 pt-3 border-t border-[#F0EBE3]">
                    <Link
                      href={`/admin/products/${product.serial}`}
                      className="flex-1 py-2 bg-[#F7F4EF] text-center text-[10px] font-dm-sans font-bold uppercase tracking-widest text-gray-700 rounded-xl border border-[#E8E2D9] active:bg-gray-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => { setProductToDelete(product); setIsConfirmOpen(true) }}
                      className="w-10 flex items-center justify-center border border-red-100 text-red-400 bg-red-50 rounded-xl active:bg-red-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={deleteProduct}
        title="Remove Piece"
        message={productToDelete ? `Are you sure you want to remove "${productToDelete.name}" from the inventory? This cannot be undone.` : "Confirm deletion?"}
      />
    </div>
  )
}

export default function ProductsAdmin() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading</p>
      </div>
    }>
      <ProductsAdminContent />
    </Suspense>
  )
}