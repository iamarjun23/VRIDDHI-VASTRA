"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFields, setUploadingFields] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "hero");

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

  // Tabs configuration
  const tabs = [
    { id: "hero", label: "Branding Core", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0-2.455-2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22.25l-.394-1.683a2.25 2.25 0 0 0-1.573-1.573L12.85 18.6l1.683-.394a2.25 2.25 0 0 0 1.573-1.573l.394-1.683.394 1.683a2.25 2.25 0 0 0 1.573 1.573l1.683.394-1.683.394a2.25 2.25 0 0 0-1.573 1.573Z" /></svg> },
    { id: "categories", label: "Collections", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "lookbook", label: "Lookbook", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'filters', label: 'Sidebar Tags', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg> },
    { id: 'contact', label: 'Atmosphere', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
  ];

  // Fetch settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            heroImage: data.heroImage || "",
            logo: data.logo || "",
            collectionsCategories: data.collectionsCategories || [],
            featuredBlocks: data.featuredBlocks?.length === 4 ? data.featuredBlocks : Array(4).fill({ title: "", image: "" }),
            lookbookBlocks: data.lookbookBlocks?.length === 5 ? data.lookbookBlocks : Array(5).fill({ title: "", image: "" }),
            promoBanner: {
              image: data.promoBanner?.image || "",
              heading: data.promoBanner?.heading || "",
              subtext: data.promoBanner?.subtext || ""
            },
            whatsappNumber: data.whatsappNumber || "919000000000",
            footerImage: data.footerImage || "",
            contactHeroImage: data.contactHeroImage || ""
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const saveSettings = async (currentData) => {
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Specifically ensure contactHeroImage is in the payload
      const payload = {
        ...currentData,
        collectionsCategories: currentData.collectionsCategories.filter(Boolean),
        contactHeroImage: currentData.contactHeroImage
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setMessage({ type: "success", text: "Brand settings synchronized" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      router.refresh();
      return true;
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      return false;
    } finally {
      setIsSaving(false);
    }
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
    } finally {
      setUploadingFields(p => ({ ...p, [fieldKey]: false }));
    }
  };

  const handleBlockChange = (type, index, field, value) => {
    setFormData(prev => {
      const newBlocks = [...prev[type]];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prev, [type]: newBlocks };
    });
  };

  const handleBlockImageUpload = async (type, index, e, field = "image") => {
    const fieldKey = `${type}-${field}-${index}`;
    const url = await handleGenericUpload(e.target.files?.[0], fieldKey);
    if (url) {
      setFormData(prev => {
        const newBlocks = [...prev[type]];
        newBlocks[index] = { ...newBlocks[index], [field]: url };
        const newData = { ...prev, [type]: newBlocks };
        saveSettings(newData);
        return newData;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-brand-green"></div>
          <p className="text-gray-300 font-bold font-display text-2xl italic tracking-widest">Retrieving brand aesthetics...</p>
        </div>
      </div>
    );
  }

  const isAnyUploading = Object.values(uploadingFields).some(Boolean);

  const LocalImageUploader = ({ label, desc, image, onUpload, aspect, isUploadingKey, compact = false }) => (
    <div className={`bg-white rounded-[clamp(24px,3vw,56px)] border border-gray-100/80 shadow-sm hover:shadow-2xl transition-all duration-1000 p-[clamp(1.25rem,2.5vw,3.5rem)] group flex flex-col justify-between`}>
      <div className="mb-[clamp(1.5rem,2vw,3rem)] shrink-0">
        <h3 className={`font-bold font-display text-gray-900 ${compact ? 'text-[clamp(18px,1.6vw,30px)]' : 'text-[clamp(20px,1.8vw,32px)]'}`}>{label}</h3>
        {desc && <p className="text-sm md:text-lg text-gray-400 mt-2 md:mt-4 font-medium leading-relaxed">{desc}</p>}
      </div>

      <div className={compact ? 'space-y-6 md:space-y-10' : 'space-y-8 md:space-y-16'}>
        <div className={`relative ${aspect} w-full rounded-[24px] md:rounded-[48px] overflow-hidden bg-[#F9F8F6]/50 border border-gray-100 flex items-center justify-center group-hover:border-brand-gold/30 shadow-inner transition-all duration-1000 cursor-pointer`}>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            disabled={uploadingFields[isUploadingKey]}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
          {uploadingFields[isUploadingKey] && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 md:h-16 md:w-16 border-b-2 border-brand-green"></div>
            </div>
          )}
          {image ? (
            <img src={image} alt="Preview" className={`w-full h-full object-contain ${compact ? 'p-4 md:p-8' : 'p-6 md:p-14'} transform group-hover:scale-110 transition-transform duration-[1.5s]`} />
          ) : (
            <div className="flex flex-col items-center gap-4 md:gap-10">
              <svg className={compact ? 'w-12 h-12 md:w-20 md:h-20 text-gray-100/50' : 'w-16 h-16 md:w-32 md:h-32 text-gray-100/50'} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <div className="text-gray-200 text-[9px] md:text-[11px] uppercase font-bold tracking-[0.4em] md:tracking-[0.6em]">MISSING ASSET</div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center pointer-events-none z-10">
            <span className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-white uppercase bg-black/30 backdrop-blur-xl px-8 md:px-12 py-3 md:py-5 rounded-full border border-white/20 shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700">Sync Archive</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Settings Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900 tracking-tight">Curation Studio</h1>
            <p className="text-[10px] md:text-[11px] text-brand-green/70 tracking-[0.4em] uppercase font-bold mt-1 md:mt-1.5 ml-0.5">Refining Vriddhi Vastra Aesthetics</p>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            {message.text && (
              <span className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase animate-in fade-in slide-in-from-right duration-700 shadow-sm border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                {message.text}
              </span>
            )}
            <button
              onClick={() => saveSettings(formData)}
              disabled={isSaving || isAnyUploading}
              className="bg-black hover:bg-brand-green text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase transition-all shadow-2xl shadow-black/20 active:scale-95 disabled:opacity-50 w-full md:w-auto"
            >
              {isSaving ? "Synchronizing..." : "Synchronize Brand"}
            </button>
          </div>
        </div>
      </header>

      <div className="px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,3rem)] space-y-[clamp(2rem,4vw,3rem)] pb-[clamp(6rem,10vw,12rem)]">
        {/* Horizontal Navigation */}
        <nav className="flex items-center gap-[clamp(0.5rem,1vw,1rem)] p-[clamp(0.5rem,1vw,1rem)] bg-white/80 rounded-[clamp(24px,3vw,48px)] border border-gray-100 shadow-sm sticky top-[80px] md:top-[92px] z-30 backdrop-blur-2xl overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.history.pushState(null, '', `?tab=${tab.id}`);
              }}
              className={`flex-1 min-w-[80px] md:min-w-0 flex items-center justify-center gap-[clamp(0.5rem,1vw,1.25rem)] px-[clamp(1rem,2vw,2.5rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] rounded-[clamp(16px,2vw,36px)] text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-700 ${activeTab === tab.id ? 'bg-black text-white shadow-2xl shadow-black/10 scale-[1.02]' : 'text-gray-400 hover:text-gray-700 hover:bg-[#F9F8F6]'}`}
            >
              <span className={`transition-all duration-700 transform ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
              <span className="hidden xl:block font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="animate-in slide-in-from-bottom-8 duration-1000">

          {/* BRANDING CORE TAB */}
          {activeTab === 'hero' && (
            <div className="space-y-10 md:space-y-16">
              <div className="space-y-4 px-2">
                <h2 className="text-[clamp(28px,2.5vw,48px)] font-bold font-display text-gray-900 tracking-tight">Identity & Atmosphere</h2>
                <p className="text-gray-500 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">Coordinate the primary visual assets and brand identity of your digital vault.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-[clamp(1.5rem,3vw,3rem)]">
                <LocalImageUploader
                  label="Official Logotype"
                  desc="High-fidelity vector or transparent identity asset."
                  image={formData.logo}
                  aspect="aspect-[3/1]"
                  compact={true}
                  isUploadingKey="logo"
                  onUpload={async (e) => {
                    const url = await handleGenericUpload(e.target.files?.[0], "logo");
                    if (url) {
                      setFormData(p => {
                        const newData = { ...p, logo: url };
                        saveSettings(newData);
                        return newData;
                      });
                    }
                  }}
                />

                <div className="bg-white rounded-[clamp(24px,3vw,56px)] p-[clamp(1.25rem,2.5vw,3.5rem)] border border-gray-100 shadow-sm space-y-[clamp(1.5rem,2vw,2.5rem)] group">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900">Communication</h3>
                    <div className="w-[clamp(2rem,2.5vw,3rem)] h-[clamp(2rem,2.5vw,3rem)] bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.123.554 4.197 1.606 6.04L0 24l6.117-1.605a11.787 11.787 0 005.925 1.585h.005c6.64 0 12.042-5.402 12.045-12.043a11.794 11.794 0 00-3.418-8.525z" /></svg>
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <label className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.4em] text-gray-400 uppercase block pl-2">WhatsApp Contact Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 919000000000"
                      value={formData.whatsappNumber}
                      onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))}
                      className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[16px] md:rounded-[24px] px-6 md:px-8 py-4 md:py-5 text-lg md:text-2xl font-bold font-sans text-gray-900 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm"
                    />
                    <p className="text-xs md:text-sm text-gray-400 font-medium pl-2 italic">Format: Country code followed by number (e.g., 91 for India).</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-[clamp(1.5rem,3vw,3rem)]">
                <LocalImageUploader
                  label="Master Cinematography"
                  desc="Dominant visual experience for the homepage archive."
                  image={formData.heroImage}
                  aspect="aspect-[16/9]"
                  isUploadingKey="heroImage"
                  onUpload={async (e) => {
                    const url = await handleGenericUpload(e.target.files?.[0], "heroImage");
                    if (url) {
                      setFormData(p => {
                        const newData = { ...p, heroImage: url };
                        saveSettings(newData);
                        return newData;
                      });
                    }
                  }}
                />

                <div className="bg-white rounded-[clamp(24px,3vw,56px)] p-[clamp(1.25rem,2.5vw,3.5rem)] border border-gray-100 shadow-sm space-y-[clamp(1.5rem,2vw,2.5rem)] flex flex-col">
                  <div>
                    <h3 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900">Promotional Narrative</h3>
                    <p className="text-sm md:text-lg text-gray-400 mt-2 md:mt-3 font-medium leading-relaxed">Widescreen curated promotion for high-impact discovery.</p>
                  </div>

                  <div className="relative aspect-[21/9] w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#F9F8F6]/50 border border-gray-100 group shadow-inner">
                    {uploadingFields['promoBanner'] && (
                      <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-xl flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
                      </div>
                    )}
                    {formData.promoBanner.image ? (
                      <img src={formData.promoBanner.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-4 md:gap-6">
                        <svg className="w-10 h-10 md:w-16 md:h-16 text-gray-100/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                        <span className="text-[9px] md:text-[11px] font-bold text-gray-200 uppercase tracking-[0.3em] md:tracking-[0.6em] text-center px-4">Add Cinematic Asset</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const url = await handleGenericUpload(e.target.files?.[0], "promoBanner");
                        if (url) {
                          setFormData(p => {
                            const newData = { ...p, promoBanner: { ...p.promoBanner, image: url } };
                            saveSettings(newData);
                            return newData;
                          });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-30"
                    />
                  </div>

                  <div className="space-y-4 md:space-y-8 flex-1 flex flex-col justify-end">
                    <input
                      type="text"
                      placeholder="Banner Heading (DM Serif Display)"
                      value={formData.promoBanner.heading}
                      onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, heading: e.target.value } }))}
                      className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[16px] md:rounded-[24px] px-6 md:px-8 py-4 md:py-5 text-xl md:text-2xl font-bold font-display text-gray-900 focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm"
                    />
                    <textarea
                      rows={3}
                      placeholder="Narrative Subtext (Outfit)"
                      value={formData.promoBanner.subtext}
                      onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, subtext: e.target.value } }))}
                      className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[24px] md:rounded-[32px] px-6 md:px-8 py-4 md:py-6 text-sm md:text-lg text-gray-600 font-medium focus:border-brand-green focus:bg-white transition-all outline-none resize-none shadow-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold font-display text-gray-900 tracking-tight">Curated Circles</h2>
                <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">Synchronize the signature collection archetypes displayed in the primary discovery grid.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {formData.featuredBlocks.map((block, index) => (
                  <div key={`feat-${index}`} className="bg-white rounded-[clamp(24px,3vw,56px)] p-[clamp(1.5rem,2.5vw,3rem)] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-1000 group">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                      <span className="text-[9px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase text-brand-gold bg-brand-gold/5 px-6 md:px-8 py-2 md:py-3.5 rounded-full border border-brand-gold/10">ARCHETYPE 0{index + 1}</span>
                    </div>
                    <div className="space-y-8 md:space-y-12">
                      <div className="relative group/circle w-full aspect-square max-w-[240px] md:max-w-[320px] mx-auto">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-dashed border-gray-100 group-hover/circle:border-brand-green transition-all duration-1000 relative flex items-center justify-center bg-[#F9F8F6]/50 shadow-inner">
                          {uploadingFields[`featuredBlocks-${index}`] && (
                            <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center rounded-full backdrop-blur-xl">
                              <div className="animate-spin rounded-full h-10 w-10 md:h-14 md:w-14 border-b-2 border-brand-green"></div>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload("featuredBlocks", index, e)} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                          {block.image ? (
                            <img src={block.image} className="w-full h-full object-contain p-6 md:p-10 transform group-hover/circle:scale-110 transition-transform duration-[1.5s]" />
                          ) : (
                            <svg className="w-10 h-10 md:w-16 md:h-16 text-gray-100/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M12 4v16m8-8H4" /></svg>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                        <label className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-gray-400 uppercase block pl-2">Collection Identity</label>
                        <input
                          type="text"
                          placeholder="e.g. KANCHIPURAM LUXURY"
                          value={block.title}
                          onChange={(e) => handleBlockChange("featuredBlocks", index, "title", e.target.value)}
                          className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[16px] md:rounded-[24px] px-6 md:px-8 py-4 md:py-5 font-bold font-display text-2xl md:text-3xl tracking-tight focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOOKBOOK TAB */}
          {activeTab === 'lookbook' && (
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold font-display text-gray-900 tracking-tight">Master Lookbook Archives</h2>
                <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">Refine the large-scale editorial tiles that anchor the lower discovery section.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {formData.lookbookBlocks.map((block, index) => (
                  <div key={`look-${index}`} className="bg-white rounded-[clamp(24px,3vw,56px)] p-[clamp(1.5rem,2.5vw,3rem)] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-1000 group">
                    <div className="flex items-center justify-between mb-8 md:mb-12">
                      <span className="text-[9px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase text-brand-green bg-brand-green/5 px-6 md:px-8 py-2 md:py-3.5 rounded-full border border-brand-green/10">TILE ARCHIVE 0{index + 1}</span>
                    </div>
                    <div className="space-y-8 md:space-y-12">
                      <div className="relative group/tile w-full aspect-[16/10] rounded-[24px] md:rounded-[48px] overflow-hidden bg-[#F9F8F6]/50 border border-gray-100 flex items-center justify-center shadow-inner transition-all duration-1000 cursor-pointer">
                        {uploadingFields[`lookbookBlocks-${index}`] && (
                          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-xl flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 md:h-16 md:w-16 border-b-2 border-brand-green"></div>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload("lookbookBlocks", index, e)} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                        {block.image ? (
                          <img src={block.image} className="w-full h-full object-cover transform group-hover/tile:scale-110 transition-transform duration-[2s]" />
                        ) : (
                          <div className="flex flex-col items-center gap-4 md:gap-8">
                            <svg className="w-12 h-12 md:w-20 md:h-20 text-gray-100/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M12 4v16m8-8H4" /></svg>
                            <span className="text-[9px] md:text-[12px] font-bold text-gray-200 uppercase tracking-[0.3em] md:tracking-[0.6em]">Synchronize Motion</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 md:space-y-6 pt-2 md:pt-4">
                        <label className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-gray-400 uppercase block pl-2">Exhibition Title</label>
                        <input
                          type="text"
                          placeholder="e.g. BRIDAL COLLECTION"
                          value={block.title}
                          onChange={(e) => handleBlockChange("lookbookBlocks", index, "title", e.target.value)}
                          className="w-full bg-[#F9F8F6]/50 border-gray-100 border-2 rounded-[16px] md:rounded-[24px] px-6 md:px-8 py-4 md:py-5 font-bold font-display text-2xl md:text-4xl tracking-tight focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTERS TAB */}
          {activeTab === 'filters' && (
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold font-display text-gray-900 tracking-tight">Sidebar Taxonomy</h2>
                <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">Manage the structural tags and filter hierarchy of your collection archves.</p>
              </div>

              <div className="bg-white rounded-[clamp(24px,3vw,64px)] p-[clamp(1.5rem,2.5vw,5rem)] border border-gray-100 shadow-sm space-y-[clamp(2rem,3vw,4rem)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[clamp(16rem,20vw,30rem)] h-[clamp(16rem,20vw,30rem)] bg-brand-gold/5 rounded-full -mr-[clamp(5rem,10vw,10rem)] -mt-[clamp(5rem,10vw,10rem)] group-hover:scale-110 transition-transform duration-[2s]"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-[clamp(1.5rem,2vw,2.5rem)] relative z-10">
                  <div>
                    <h3 className="text-[clamp(24px,2vw,36px)] font-bold font-display text-gray-900 tracking-tight">Active Navigation Tags</h3>
                    <p className="text-[clamp(14px,1.2vw,18px)] text-gray-400 mt-[clamp(0.5rem,1vw,1rem)] font-medium leading-relaxed max-w-xl">The definitive list of categories for sidebar navigation and archive discovery.</p>
                  </div>
                  <button
                    onClick={() => setFormData(p => ({ ...p, collectionsCategories: [...p.collectionsCategories, ""] }))}
                    className="px-[clamp(1.5rem,2.5vw,3rem)] py-[clamp(0.75rem,2vw,1.25rem)] bg-black text-white rounded-[clamp(16px,2vw,24px)] text-[clamp(10px,1vw,12px)] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase hover:bg-brand-green transition-all shadow-2xl shadow-black/20 active:scale-95 whitespace-nowrap w-full md:w-auto"
                  >
                    + Add New Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[clamp(1rem,2vw,2rem)] relative z-10">
                  {formData.collectionsCategories.map((cat, index) => (
                    <div key={`col-cat-bottom-${index}`} className="flex items-center gap-[clamp(0.75rem,1vw,1.25rem)] animate-in fade-in slide-in-from-left duration-700">
                      <input
                        type="text"
                        value={cat}
                        onChange={(e) => {
                          const newCats = [...formData.collectionsCategories];
                          newCats[index] = e.target.value;
                          setFormData(p => ({ ...p, collectionsCategories: newCats }));
                        }}
                        placeholder="e.g. NEW ARRIVALS"
                        className="flex-1 min-w-0 bg-[#F9F8F6]/80 border-gray-100 border-2 rounded-[clamp(16px,1.5vw,24px)] px-[clamp(1rem,1.5vw,2rem)] py-[clamp(0.75rem,1.5vw,1.25rem)] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase text-[clamp(10px,1vw,14px)] focus:border-brand-green focus:bg-white transition-all outline-none shadow-sm"
                      />
                      <button
                        onClick={() => {
                          const newCats = formData.collectionsCategories.filter((_, i) => i !== index);
                          setFormData(p => ({ ...p, collectionsCategories: newCats }));
                        }}
                        className="p-[clamp(0.75rem,1.5vw,1.25rem)] flex-shrink-0 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-[clamp(12px,1.5vw,20px)] transition-all shadow-sm group/del"
                      >
                        <svg className="w-[clamp(1.25rem,1.5vw,1.5rem)] h-[clamp(1.25rem,1.5vw,1.5rem)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div className="space-y-16">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold font-display text-gray-900 tracking-tight">Cinematic Atmosphere</h2>
                <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">Define the environmental photography for your high-end contact portal.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-[clamp(1.5rem,3vw,3rem)]">
                <LocalImageUploader
                  label="Portal Environment"
                  desc="Atmospheric backdrop for the cinematic glassmorphic form."
                  image={formData.contactHeroImage}
                  aspect="aspect-[16/9]"
                  isUploadingKey="contactHeroImage"
                  onUpload={async (e) => {
                    const url = await handleGenericUpload(e.target.files?.[0], "contactHeroImage");
                    if (url) {
                      setFormData(p => {
                        const newData = { ...p, contactHeroImage: url };
                        saveSettings(newData);
                        return newData;
                      });
                    }
                  }}
                />

                <div className="bg-white rounded-[clamp(24px,3vw,56px)] p-[clamp(1.5rem,2.5vw,3.5rem)] border border-gray-100 shadow-sm flex flex-col justify-center relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-[clamp(12rem,16vw,16rem)] h-[clamp(12rem,16vw,16rem)] bg-brand-gold/5 rounded-full -mr-[clamp(4rem,6vw,6rem)] -mt-[clamp(4rem,6vw,6rem)] group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <h3 className="text-[clamp(20px,1.6vw,30px)] font-bold font-display text-gray-900">Environmental Essence</h3>
                    <p className="text-[clamp(14px,1.2vw,18px)] text-gray-400 mt-[clamp(1rem,1.5vw,1.5rem)] leading-relaxed font-medium">The contact portal photography serves as the foundational depth for the glassmorphic interface. Select imagery that conveys the raw heritage and cinematic texture of the brand.</p>

                    <div className="mt-[clamp(2rem,3vw,3.5rem)] p-[clamp(1.5rem,2vw,2.5rem)] bg-[#F9F8F6]/80 rounded-[clamp(24px,2.5vw,40px)] border border-gray-100 shadow-inner">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[clamp(1rem,1.5vw,1.5rem)]">
                        <span className="text-[clamp(12px,1vw,16px)] text-gray-500 font-bold tracking-[0.2em] uppercase">Render Engine:</span>
                        <span className="text-[clamp(12px,1vw,14px)] font-bold text-gray-900 tracking-[0.2em] md:tracking-[0.4em] uppercase bg-white px-[clamp(1rem,2vw,2rem)] py-[clamp(0.5rem,1vw,0.875rem)] rounded-[clamp(16px,2vw,99px)] border border-gray-100 shadow-sm md:w-auto w-max">GLASS-ARCH V2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <LocalImageUploader
                label="Footer Signature Background"
                desc="Defining the light & shadow of the brand's final touchpoint."
                image={formData.footerImage}
                aspect="aspect-[21/9]"
                isUploadingKey="footerImage"
                onUpload={async (e) => {
                  const url = await handleGenericUpload(e.target.files?.[0], "footerImage");
                  if (url) {
                    setFormData(p => {
                      const newData = { ...p, footerImage: url };
                      saveSettings(newData);
                      return newData;
                    });
                  }
                }}
              />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-brand-green"></div>
          <p className="text-gray-300 font-bold font-display text-2xl italic tracking-widest">Loading studio...</p>
        </div>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
