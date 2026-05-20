"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const inputCls = "w-full bg-[#F7F4EF] border border-[#E8E2D9] rounded-xl px-4 py-3 text-[14px] font-dm-sans text-gray-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 focus:bg-white outline-none transition-all placeholder-gray-400";

function SectionTitle({ label, description }) {
  return (
    <div className="border-b border-[#E8E2D9] pb-4 mb-5">
      <h2 className="font-dm-serif text-[20px] text-gray-900">{label}</h2>
      {description && <p className="text-[12px] font-dm-sans text-gray-400 mt-1">{description}</p>}
    </div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="mb-2">
      <label className="block text-[10px] font-dm-sans font-bold text-gray-500 uppercase tracking-[0.22em]">{children}</label>
      {hint && <p className="text-[11px] font-dm-sans text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function ImageUploadZone({ label, description, image, onUpload, isUploading, aspect = "aspect-video", objectFit = "cover", compact = false }) {
  return (
    <div className="space-y-3">
      {label && (
        <div>
          <p className="text-[10px] font-dm-sans font-bold text-gray-500 uppercase tracking-[0.22em]">{label}</p>
          {description && <p className="text-[11px] font-dm-sans text-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <div className={`relative ${aspect} w-full rounded-2xl overflow-hidden border-2 border-dashed border-[#E8E2D9] bg-[#F7F4EF] hover:border-[#D4AF37] hover:bg-white transition-all duration-300 cursor-pointer group`}>
        <input type="file" accept="image/*" onChange={onUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full" />
        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80">
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-dm-sans font-bold text-gray-500 uppercase tracking-widest">Uploading...</span>
          </div>
        ) : image ? (
          <>
            <img src={image} alt="Preview" className={`w-full h-full ${objectFit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
              <span className="bg-white text-gray-900 text-[10px] font-dm-sans font-bold uppercase tracking-widest px-4 py-2 rounded-xl">Replace Image</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 group-hover:text-[#D4AF37] transition-colors">
            <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl border-2 border-dashed border-current flex items-center justify-center`}>
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            </div>
            <span className="text-[10px] font-dm-sans font-bold uppercase tracking-widest">Upload Image</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E8E2D9] p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFields, setUploadingFields] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "hero");
  const [editingTileIdx, setEditingTileIdx] = useState(null);

  const [formData, setFormData] = useState({
    heroImage: "",
    featuredBlocks: Array(4).fill({ title: "", image: "" }),
    lookbookBlocks: Array(5).fill({ title: "", image: "" }),
    logo: "",
    promoBanner: { image: "", heading: "", subtext: "" },
    whatsappNumber: "",
    footerImage: "",
    contactHeroImage: "",
    collectionsCategories: [],
  });

  const tabs = [
    { id: "hero", label: "Branding", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
    { id: "categories", label: "Collections", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "lookbook", label: "Lookbook", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: "filters", label: "Tags", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg> },
    { id: "contact", label: "Atmosphere", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  ];

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setFormData({
            heroImage: data.heroImage || "",
            logo: data.logo || "",
            collectionsCategories: data.collectionsCategories || [],
            featuredBlocks: data.featuredBlocks?.length === 4 ? data.featuredBlocks : Array(4).fill({ title: "", image: "" }),
            lookbookBlocks: data.lookbookBlocks?.length === 5 ? data.lookbookBlocks : Array(5).fill({ title: "", image: "" }),
            promoBanner: { image: data.promoBanner?.image || "", heading: data.promoBanner?.heading || "", subtext: data.promoBanner?.subtext || "" },
            whatsappNumber: data.whatsappNumber || "919000000000",
            footerImage: data.footerImage || "",
            contactHeroImage: data.contactHeroImage || ""
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const saveSettings = async (currentData) => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = { ...currentData, collectionsCategories: currentData.collectionsCategories.filter(Boolean) };
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save settings");
      setMessage({ type: "success", text: "Saved" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      router.refresh();
      return true;
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      return false;
    } finally { setIsSaving(false); }
  };

  const handleGenericUpload = async (file, fieldKey) => {
    if (!file) return null;
    setUploadingFields(p => ({ ...p, [fieldKey]: true }));
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } finally { setUploadingFields(p => ({ ...p, [fieldKey]: false })); }
  };

  const saveSettingsRef = useRef(null);
  const debouncedSave = useCallback((data) => {
    if (saveSettingsRef.current) clearTimeout(saveSettingsRef.current);
    saveSettingsRef.current = setTimeout(() => { saveSettings(data); }, 800);
  }, []);

  const handleBlockChange = (type, index, field, value) => {
    setFormData(prev => {
      const newBlocks = [...prev[type]];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      const newData = { ...prev, [type]: newBlocks };
      if (field === 'title') debouncedSave(newData);
      return newData;
    });
  };

  const handleBlockImageUpload = async (type, index, e) => {
    const fieldKey = `${type}-image-${index}`;
    const url = await handleGenericUpload(e.target.files?.[0], fieldKey);
    if (url) {
      setFormData(prev => {
        const newBlocks = [...prev[type]];
        newBlocks[index] = { ...newBlocks[index], image: url };
        const newData = { ...prev, [type]: newBlocks };
        saveSettings(newData);
        return newData;
      });
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading Settings</p>
    </div>
  );

  const isAnyUploading = Object.values(uploadingFields).some(Boolean);
  const LOOKBOOK_FALLBACKS = ['BRIDAL COLLECTION', 'CEREMONY VIBE', 'VALUE FOR MONEY', 'FRESH FROM LOOMS', 'FESTIVE VIBE'];

  return (
    <div className="space-y-6 pb-12">

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F7F4EF] py-3 -mx-4 sm:-mx-5 lg:-mx-6 xl:-mx-8 px-4 sm:px-5 lg:px-6 xl:px-8 border-b border-[#E8E2D9] flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] hidden sm:block">Platform Configuration</p>
          <h1 className="font-dm-serif text-[20px] sm:text-[24px] text-gray-900">Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          {message.text && (
            <span className={`hidden sm:block px-3 py-1.5 text-[10px] font-dm-sans font-bold tracking-wider uppercase rounded-xl border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={() => saveSettings(formData)}
            disabled={isSaving || isAnyUploading}
            className="px-5 sm:px-6 py-2.5 bg-[#1A1A1A] text-white text-[11px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/10 whitespace-nowrap"
          >
            {isSaving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Tab Nav */}
        <div className="lg:sticky lg:top-[76px] w-full lg:w-52 shrink-0">
          <div className="flex lg:flex-col flex-row overflow-x-auto lg:overflow-x-visible gap-1 pb-1 lg:pb-0 bg-white lg:bg-transparent rounded-2xl lg:rounded-none border lg:border-0 border-[#E8E2D9] p-1.5 lg:p-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); window.history.pushState(null, '', `?tab=${tab.id}`); }}
                className={`flex-shrink-0 lg:flex-shrink flex items-center gap-2.5 px-3.5 lg:px-4 py-2.5 lg:py-3 rounded-xl text-[11px] font-dm-sans font-semibold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-[#F7F4EF]'}`}
              >
                <span className={activeTab === tab.id ? 'text-[#D4AF37]' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── BRANDING ─────────────────────────────────────────── */}
          {activeTab === 'hero' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <SectionTitle label="Identity & Communication" description="Core brand configuration." />
                <FieldLabel hint="Format: country code + number (e.g. 919876543210)">WhatsApp Contact Number</FieldLabel>
                <input type="text" placeholder="e.g. 919000000000" value={formData.whatsappNumber} onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))} className={`${inputCls} font-mono`} />
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Card>
                  <SectionTitle label="Official Logo" />
                  <ImageUploadZone image={formData.logo} aspect="aspect-[3/1]" objectFit="contain" compact={true} isUploading={uploadingFields["logo"]} onUpload={async (e) => { const url = await handleGenericUpload(e.target.files?.[0], "logo"); if (url) setFormData(p => { const d = { ...p, logo: url }; saveSettings(d); return d; }); }} />
                </Card>
                <Card>
                  <SectionTitle label="Hero Image" />
                  <ImageUploadZone image={formData.heroImage} aspect="aspect-video" compact={true} isUploading={uploadingFields["heroImage"]} onUpload={async (e) => { const url = await handleGenericUpload(e.target.files?.[0], "heroImage"); if (url) setFormData(p => { const d = { ...p, heroImage: url }; saveSettings(d); return d; }); }} />
                </Card>
              </div>
              <Card>
                <SectionTitle label="Promotional Banner" description="Appears as a site-wide announcement banner." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Banner Heading</FieldLabel>
                      <input type="text" placeholder="e.g. End of Season Archive" value={formData.promoBanner.heading} onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, heading: e.target.value } }))} className={inputCls} />
                    </div>
                    <div>
                      <FieldLabel>Subtext</FieldLabel>
                      <textarea rows={3} placeholder="Add promotional details..." value={formData.promoBanner.subtext} onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, subtext: e.target.value } }))} className={`${inputCls} resize-none leading-relaxed`} />
                    </div>
                  </div>
                  <ImageUploadZone label="Banner Image" image={formData.promoBanner.image} aspect="aspect-[21/9]" isUploading={uploadingFields["promoBanner"]} onUpload={async (e) => { const url = await handleGenericUpload(e.target.files?.[0], "promoBanner"); if (url) setFormData(p => { const d = { ...p, promoBanner: { ...p.promoBanner, image: url } }; saveSettings(d); return d; }); }} />
                </div>
              </Card>
            </div>
          )}

          {/* ── COLLECTIONS ──────────────────────────────────────── */}
          {activeTab === 'categories' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4">
                <p className="text-[10px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.22em] mb-1">Preview</p>
                <p className="text-[12px] font-dm-sans text-gray-500">Each block appears as an arch-framed image in the homepage "Shop By Categories" section. Click any arch to upload.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.featuredBlocks.map((block, index) => (
                  <div key={`feat-${index}`} className="flex flex-col items-center">
                    <span className="text-[9px] font-dm-sans font-bold tracking-[0.25em] uppercase text-[#D4AF37] mb-3">Block 0{index + 1}</span>
                    <div className="relative w-[75%] aspect-[3/6] overflow-hidden bg-[#E8E2D9] border-2 border-dashed border-[#E8E2D9] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer group mb-3" style={{ borderRadius: '100% 100% 0 0 / 50% 50% 0 0' }}>
                      <input type="file" accept="image/*" onChange={e => handleBlockImageUpload("featuredBlocks", index, e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                      {uploadingFields[`featuredBlocks-image-${index}`] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80"><div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>
                      ) : block.image ? (
                        <>
                          <img src={block.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Collection" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                            <span className="text-white text-[10px] font-dm-sans font-bold uppercase tracking-wider bg-black/30 px-3 py-1.5 rounded-lg">Replace</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                          <span className="text-[9px] font-dm-sans font-bold uppercase tracking-wider">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="text" placeholder="e.g. KANCHIPURAM"
                      value={block.title}
                      onChange={e => handleBlockChange("featuredBlocks", index, "title", e.target.value)}
                      className="w-full bg-[#F7F4EF] border border-[#E8E2D9] rounded-xl px-3 py-2.5 text-[12px] font-dm-sans font-semibold text-gray-900 text-center focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 focus:bg-white outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LOOKBOOK ─────────────────────────────────────────── */}
          {activeTab === 'lookbook' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Header */}
              <div className="bg-white rounded-2xl border border-[#E8E2D9] px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-0.5">Lookbook Canvas</p>
                  <p className="text-[12px] font-dm-sans text-gray-500">
                    Click the image to upload · Click <span className="text-[#D4AF37] font-bold">✎</span> to rename a tile · Changes save automatically
                  </p>
                </div>
                <span className="text-[9px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-wider border border-[#D4AF37]/30 px-2.5 py-1.5 rounded-lg shrink-0">5 Tiles</span>
              </div>

              {/* Tile cards — 2-column grid, each tile fully visible */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { idx: 0, fallback: 'BRIDAL COLLECTION', position: 'Large · Left Column',  aspect: 'aspect-[3/4]' },
                  { idx: 4, fallback: 'FESTIVE VIBE',       position: 'Large · Right Column', aspect: 'aspect-[3/4]' },
                  { idx: 1, fallback: 'CEREMONY VIBE',      position: 'Small · Left Column',  aspect: 'aspect-[4/3]' },
                  { idx: 3, fallback: 'FRESH FROM LOOMS',   position: 'Small · Right Column', aspect: 'aspect-[4/3]' },
                  { idx: 2, fallback: 'VALUE FOR MONEY',    position: 'Small · Left Column',  aspect: 'aspect-[4/3]' },
                ].map(({ idx, fallback, position, aspect }) => {
                  const block = formData.lookbookBlocks[idx];
                  const isUploading = uploadingFields[`lookbookBlocks-image-${idx}`];
                  const hasTitle = !!(block?.title);
                  const displayTitle = block?.title || fallback;
                  const isEditingThis = editingTileIdx === idx;
                  return (
                    <div key={`lb-card-${idx}`} className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">

                      {/* Image zone */}
                      <div className={`relative ${aspect} w-full bg-[#E0D9CE] overflow-hidden group`}>

                        {/* Upload label covers image area (disabled during inline rename) */}
                        {!isEditingThis && (
                          <label className="absolute inset-0 z-20 cursor-pointer">
                            <input type="file" accept="image/*" onChange={e => handleBlockImageUpload("lookbookBlocks", idx, e)} className="sr-only" disabled={isUploading} />
                            {!isUploading && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <span className="bg-white text-gray-900 text-[10px] font-dm-sans font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow-xl">
                                  {block?.image ? '↻ Replace Image' : '↑ Upload Image'}
                                </span>
                              </div>
                            )}
                          </label>
                        )}

                        {/* Image or placeholder */}
                        {block?.image
                          ? <img src={block.image} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" alt="" />
                          : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#B8AFA0]">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                              <p className="text-[10px] font-dm-sans font-bold uppercase tracking-widest">No image yet</p>
                            </div>
                          )
                        }

                        {/* Darken overlay when image present */}
                        {block?.image && <div className="absolute inset-0 bg-black/20" />}

                        {/* Upload spinner */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 z-30">
                            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[9px] font-dm-sans font-bold text-white/60 uppercase tracking-widest">Uploading</span>
                          </div>
                        )}

                        {/* Title bar at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-3 bg-gradient-to-t from-black/65 to-transparent flex items-end gap-2 min-h-[56px]">
                          {isEditingThis ? (
                            <input
                              autoFocus
                              type="text"
                              value={formData.lookbookBlocks[idx]?.title || ''}
                              placeholder={fallback}
                              onChange={e => handleBlockChange("lookbookBlocks", idx, "title", e.target.value)}
                              onBlur={() => setEditingTileIdx(null)}
                              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTileIdx(null); }}
                              className="flex-1 bg-transparent text-white placeholder-white/40 font-dm-serif text-[15px] sm:text-[17px] uppercase tracking-wider border-0 border-b-2 border-[#D4AF37] outline-none py-1 min-w-0"
                            />
                          ) : (
                            <p className={`flex-1 font-dm-serif text-[15px] sm:text-[17px] tracking-wide truncate ${hasTitle ? 'text-white' : 'text-white/35'}`}>
                              {displayTitle}
                            </p>
                          )}
                          {/* Pencil button — always visible, turns gold when editing */}
                          {!isUploading && (
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setEditingTileIdx(isEditingThis ? null : idx); }}
                              title="Rename tile"
                              className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isEditingThis ? 'bg-[#D4AF37] text-black' : 'bg-white/15 backdrop-blur-sm text-white hover:bg-[#D4AF37] hover:text-black'
                              }`}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                            </button>
                          )}
                        </div>

                        {/* Tile badge */}
                        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[9px] font-dm-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg z-10">
                          Tile {idx + 1}
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="px-4 py-3 flex items-center justify-between border-t border-[#F0EBE3]">
                        <div className="min-w-0">
                          <p className="text-[10px] font-dm-sans font-bold text-gray-800 uppercase tracking-[0.15em] truncate">
                            {hasTitle ? formData.lookbookBlocks[idx].title : <span className="text-gray-300 font-normal normal-case tracking-normal">No custom name — using default</span>}
                          </p>
                          <p className="text-[9px] font-dm-sans text-gray-400 mt-0.5">{position}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {block?.image
                            ? <span className="flex items-center gap-1 text-[9px] font-dm-sans text-emerald-600 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Image</span>
                            : <span className="flex items-center gap-1 text-[9px] font-dm-sans text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-gray-200 inline-block" />No image</span>
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Info note */}
              <p className="text-[11px] font-dm-sans text-gray-400 px-1">
                Tile order matches the landing page layout. Large tiles (3:4) appear in the far left and far right positions; smaller tiles (4:3) fill the middle rows.
              </p>
            </div>
          )}

          {/* ── TAGS ─────────────────────────────────────────────── */}
          {activeTab === 'filters' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Header */}
              <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                <div className="px-6 pt-6 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-dm-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em] mb-1">Navigation &amp; Filtering</p>
                    <h2 className="font-dm-serif text-[22px] text-gray-900 leading-tight">Collection Tags</h2>
                    <p className="text-[12px] font-dm-sans text-gray-400 mt-1.5 max-w-md leading-relaxed">
                      Tags appear in the storefront sidebar, the &ldquo;Shop By&rdquo; dropdown, and filter products into collections.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormData(p => ({ ...p, collectionsCategories: [...p.collectionsCategories, ""] }))}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95 shrink-0"
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    New Tag
                  </button>
                </div>
                <div className="px-6 py-3 bg-[#F7F4EF] border-t border-[#E8E2D9] flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="text-[11px] font-dm-sans font-semibold text-gray-700">{formData.collectionsCategories.filter(Boolean).length} active tags</span>
                  </div>
                  <div className="h-3 w-px bg-gray-200" />
                  <span className="text-[11px] font-dm-sans text-gray-400">Shown in sidebar + &ldquo;Shop By&rdquo; dropdown</span>
                </div>
              </div>

              {/* Tag list */}
              {formData.collectionsCategories.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E2D9] py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F4EF] border border-[#E8E2D9] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>
                  </div>
                  <p className="font-dm-serif text-[20px] text-gray-700 mb-1">No Tags Yet</p>
                  <p className="text-[13px] font-dm-sans text-gray-400 max-w-xs leading-relaxed">Create your first tag to start organizing products and enabling storefront filters.</p>
                  <button
                    onClick={() => setFormData(p => ({ ...p, collectionsCategories: [""] }))}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-dm-sans font-bold tracking-[0.18em] uppercase rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
                  >
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Create First Tag
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E8E2D9] overflow-hidden">
                  <div className="grid grid-cols-[40px_1fr_auto] items-center px-5 py-2.5 bg-[#F7F4EF] border-b border-[#E8E2D9]">
                    <span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">#</span>
                    <span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Tag Name</span>
                    <span className="text-[9px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em] pr-1">Del</span>
                  </div>
                  <div className="divide-y divide-[#F7F4EF]">
                    {formData.collectionsCategories.map((cat, index) => (
                      <div key={`tag-row-${index}`} className="grid grid-cols-[40px_1fr_auto] items-center px-5 py-3.5 hover:bg-[#FDFCFA] transition-colors">
                        <span className="text-[11px] font-dm-sans font-bold text-[#D4AF37]">{String(index + 1).padStart(2, '0')}</span>
                        <div className="flex items-center gap-3 mr-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                          <input
                            type="text"
                            value={cat}
                            onChange={(e) => {
                              const newCats = [...formData.collectionsCategories];
                              newCats[index] = e.target.value;
                              setFormData(p => ({ ...p, collectionsCategories: newCats }));
                            }}
                            placeholder="TAG NAME"
                            className="flex-1 bg-transparent text-[13px] font-dm-sans font-bold uppercase tracking-[0.12em] text-gray-900 outline-none placeholder-gray-300 border-b-2 border-transparent focus:border-[#D4AF37] transition-all py-0.5"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newCats = formData.collectionsCategories.filter((_, i) => i !== index);
                            setFormData(p => ({ ...p, collectionsCategories: newCats }));
                          }}
                          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#E8E2D9]">
                    <button
                      onClick={() => setFormData(p => ({ ...p, collectionsCategories: [...p.collectionsCategories, ""] }))}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-gray-400 hover:text-gray-600 hover:bg-[#F7F4EF] transition-all text-left"
                    >
                      <span className="w-7 h-7 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      </span>
                      <span className="text-[12px] font-dm-sans font-semibold uppercase tracking-wider">Add another tag</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Storefront preview */}
              <div className="bg-white rounded-2xl border border-[#E8E2D9] p-5">
                <p className="text-[10px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.22em] mb-4">Storefront Sidebar Preview</p>
                <div className="flex gap-6 items-start">
                  <div className="w-40 bg-[#FFFAEE] rounded-xl border border-[#E8E2D9] p-4 shrink-0">
                    <p className="text-[8px] font-dm-sans font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">Search by Tags</p>
                    <div className="space-y-2">
                      <p className="text-[10px] font-dm-sans font-bold uppercase tracking-wider text-gray-900">All Archive</p>
                      <div className="w-8 h-px bg-[#D4AF37]/30" />
                      {formData.collectionsCategories.filter(Boolean).slice(0, 5).map((cat, i) => (
                        <p key={i} className="text-[10px] font-dm-sans font-bold uppercase tracking-wider text-gray-400">{cat}</p>
                      ))}
                      {formData.collectionsCategories.filter(Boolean).length > 5 && (
                        <p className="text-[9px] font-dm-sans text-gray-300">+{formData.collectionsCategories.filter(Boolean).length - 5} more</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-dm-sans text-gray-400 leading-relaxed mb-3">
                      Tags appear in the sidebar on the &ldquo;/tags&rdquo; page in the order listed. HOT OFFERS and BEST SELLER are always shown first.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['HOT OFFERS', 'BEST SELLER', ...formData.collectionsCategories.filter(Boolean)].map((cat, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#F7F4EF] border border-[#E8E2D9] rounded-full text-[9px] font-dm-sans font-bold uppercase tracking-wider text-gray-600">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ATMOSPHERE ───────────────────────────────────────── */}
          {activeTab === 'contact' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <SectionTitle label="Contact Page Hero" description="Background image for the cinematic contact form page." />
                <ImageUploadZone image={formData.contactHeroImage} aspect="aspect-video" isUploading={uploadingFields["contactHeroImage"]} onUpload={async (e) => { const url = await handleGenericUpload(e.target.files?.[0], "contactHeroImage"); if (url) setFormData(p => { const d = { ...p, contactHeroImage: url }; saveSettings(d); return d; }); }} />
              </Card>
              <Card>
                <SectionTitle label="Footer Background" description="The defining image for the brand's footer section." />
                <ImageUploadZone image={formData.footerImage} aspect="aspect-[21/9]" isUploading={uploadingFields["footerImage"]} onUpload={async (e) => { const url = await handleGenericUpload(e.target.files?.[0], "footerImage"); if (url) setFormData(p => { const d = { ...p, footerImage: url }; saveSettings(d); return d; }); }} />
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-[11px] font-dm-sans font-bold text-gray-400 uppercase tracking-[0.25em]">Loading Settings</p>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
