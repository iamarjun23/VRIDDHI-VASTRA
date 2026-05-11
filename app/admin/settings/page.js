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
    { id: "hero", label: "Branding Core", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0-2.455-2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22.25l-.394-1.683a2.25 2.25 0 0 0-1.573-1.573L12.85 18.6l1.683-.394a2.25 2.25 0 0 0 1.573-1.573l.394-1.683.394 1.683a2.25 2.25 0 0 0 1.573 1.573l1.683.394-1.683.394a2.25 2.25 0 0 0-1.573 1.573Z" /></svg> },
    { id: "categories", label: "Collections", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: "lookbook", label: "Lookbook", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'filters', label: 'Sidebar Tags', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg> },
    { id: 'contact', label: 'Atmosphere', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
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
      setMessage({ type: "success", text: "Configuration synchronized" });
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
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
         <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    );
  }

  const isAnyUploading = Object.values(uploadingFields).some(Boolean);

  const LocalImageUploader = ({ label, desc, image, onUpload, aspect, isUploadingKey, compact = false }) => (
    <div className={`bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 group flex flex-col justify-between`}>
      <div className="mb-6 shrink-0 border-b border-[#E5E0D8] pb-4">
        <h3 className={`font-bold font-display text-gray-900 ${compact ? 'text-[18px]' : 'text-[22px]'}`}>{label}</h3>
        {desc && <p className="text-[13px] text-gray-500 mt-1 font-medium">{desc}</p>}
      </div>

      <div className="space-y-8">
        <div className={`relative ${aspect} w-full bg-[#FAF9F6] border-2 border-dashed border-[#E5E0D8] flex items-center justify-center group-hover:border-[#D4AF37] group-hover:bg-white transition-all duration-500 cursor-pointer overflow-hidden`}>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            disabled={uploadingFields[isUploadingKey]}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
          {uploadingFields[isUploadingKey] && (
            <div className="absolute inset-0 z-20 bg-white/70 flex flex-col items-center justify-center">
               <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mb-3"></div>
               <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Syncing...</span>
            </div>
          )}
          {image ? (
            <img src={image} alt="Preview" className={`w-full h-full object-contain ${compact ? 'p-4' : 'p-6'} transform group-hover:scale-105 transition-transform duration-700`} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
              <svg className={compact ? 'w-8 h-8' : 'w-10 h-10'} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
              <div className="text-[10px] uppercase font-bold tracking-widest">Upload Asset</div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
            <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-black/20 border border-white/40 px-6 py-2">Replace Asset</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Luxury Header Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6 sticky top-0 bg-[#FAF9F6] z-40 py-4 -my-4 mb-4">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] block mb-2">Platform Configuration</span>
          <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Settings</h1>
        </div>
        <div className="flex items-center gap-4">
          {message.text && (
            <span className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-opacity border ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-gray-900 border-[#E5E0D8]'}`}>
              {message.text}
            </span>
          )}
          <button
            onClick={() => saveSettings(formData)}
            disabled={isSaving || isAnyUploading}
            className="bg-[#1A1A1A] text-white px-8 py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-[#111111] transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 active:scale-95 disabled:opacity-50 w-full sm:w-auto"
          >
            {isSaving ? "Synchronizing..." : "Save Configuration"}
          </button>
        </div>
      </div>

      {/* Split Immersive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane - Navigation */}
        <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-[140px]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.history.pushState(null, '', `?tab=${tab.id}`);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-300 relative group ${activeTab === tab.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E5E0D8]' : 'bg-transparent border border-transparent hover:bg-[#FAF9F6]'}`}
            >
              {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]" />}
              <span className={`transition-transform duration-300 ${activeTab === tab.id ? 'text-[#D4AF37] scale-110' : 'text-gray-400 group-hover:text-gray-600'}`}>{tab.icon}</span>
              <span className={`text-[11px] font-bold tracking-widest uppercase ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500'}`}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Pane - Content */}
        <div className="lg:col-span-9 space-y-6">

          {/* BRANDING CORE TAB */}
          {activeTab === 'hero' && (
            <div key="hero" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10">
                <h2 className="text-[18px] font-bold font-display text-gray-900 border-b border-[#E5E0D8] pb-4 mb-6">Identity & Communication</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">WhatsApp Contact Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 919000000000"
                      value={formData.whatsappNumber}
                      onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))}
                      className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold font-mono text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none"
                    />
                    <p className="text-[11px] text-gray-400 font-medium mt-2">Format: Country code followed by number (e.g., 91 for India).</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                
                <LocalImageUploader
                  label="Master Cinematography"
                  desc="Dominant visual experience for the homepage archive."
                  image={formData.heroImage}
                  aspect="aspect-[16/9]"
                  compact={true}
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
              </div>

              <div className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10 space-y-6 flex flex-col xl:flex-row gap-8">
                <div className="w-full xl:w-1/2">
                  <h3 className="text-[18px] font-bold font-display text-gray-900 border-b border-[#E5E0D8] pb-4 mb-6">Promotional Narrative</h3>
                  
                  <div className="space-y-5 flex-1 flex flex-col justify-end">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Banner Heading</label>
                      <input
                        type="text"
                        placeholder="e.g. End of Season Archive"
                        value={formData.promoBanner.heading}
                        onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, heading: e.target.value } }))}
                        className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Narrative Subtext</label>
                      <textarea
                        rows={3}
                        placeholder="Detail the promotion..."
                        value={formData.promoBanner.subtext}
                        onChange={e => setFormData(p => ({ ...p, promoBanner: { ...p.promoBanner, subtext: e.target.value } }))}
                        className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3.5 text-[14px] font-medium text-gray-800 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-[0.2em] opacity-0 pointer-events-none">Banner Image</label>
                  <div className="relative aspect-[21/9] w-full bg-[#FAF9F6] border-2 border-dashed border-[#E5E0D8] hover:border-[#D4AF37] hover:bg-white transition-all duration-500 cursor-pointer overflow-hidden group">
                    {uploadingFields['promoBanner'] && (
                      <div className="absolute inset-0 z-20 bg-white/70 flex flex-col items-center justify-center">
                        <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mb-3"></div>
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Syncing...</span>
                      </div>
                    )}
                    {formData.promoBanner.image ? (
                      <>
                        <img src={formData.promoBanner.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
                          <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-black/20 border border-white/40 px-6 py-2">Replace Asset</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Upload Cinematic Asset</span>
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
                </div>
              </div>
            </div>
          )}

          {/* COLLECTIONS TAB */}
          {activeTab === 'categories' && (
            <div key="categories" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {formData.featuredBlocks.map((block, index) => (
                <div key={`feat-${index}`} className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10 group">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">Archetype 0{index + 1}</span>
                  </div>
                  <div className="space-y-8">
                    <div className="relative group/circle w-full aspect-square max-w-[240px] mx-auto">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-dashed border-[#E5E0D8] group-hover/circle:border-[#D4AF37] group-hover/circle:bg-white transition-all duration-500 relative flex items-center justify-center bg-[#FAF9F6]">
                        {uploadingFields[`featuredBlocks-${index}`] && (
                          <div className="absolute inset-0 z-20 bg-white/70 flex flex-col items-center justify-center rounded-full">
                            <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full mb-3"></div>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload("featuredBlocks", index, e)} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                        {block.image ? (
                          <>
                            <img src={block.image} className="w-full h-full object-contain p-6 transform group-hover/circle:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/circle:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
                               <span className="text-[10px] font-bold tracking-widest text-white uppercase">Replace</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-[#D4AF37] opacity-60 group-hover/circle:opacity-100 transition-opacity">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em] text-center">Collection Identity</label>
                      <input
                        type="text"
                        placeholder="e.g. KANCHIPURAM LUXURY"
                        value={block.title}
                        onChange={(e) => handleBlockChange("featuredBlocks", index, "title", e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3 text-[14px] font-bold text-gray-900 text-center hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOOKBOOK TAB */}
          {activeTab === 'lookbook' && (
            <div key="lookbook" className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {formData.lookbookBlocks.map((block, index) => (
                <div key={`look-${index}`} className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 lg:p-8 group flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3 shrink-0">
                    <div className="relative group/tile w-full aspect-[16/10] overflow-hidden bg-[#FAF9F6] border-2 border-dashed border-[#E5E0D8] hover:border-[#D4AF37] hover:bg-white flex items-center justify-center transition-all duration-500 cursor-pointer">
                      {uploadingFields[`lookbookBlocks-${index}`] && (
                        <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                          <div className="animate-spin h-6 w-6 border-b-2 border-gray-900 rounded-full"></div>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleBlockImageUpload("lookbookBlocks", index, e)} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                      {block.image ? (
                        <>
                          <img src={block.image} className="w-full h-full object-cover transform group-hover/tile:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/tile:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
                             <span className="text-[10px] font-bold tracking-widest text-white uppercase">Replace</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[#D4AF37] opacity-60 group-hover/tile:opacity-100 transition-opacity">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" /></svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">Tile Archive 0{index + 1}</span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Exhibition Title</label>
                      <input
                        type="text"
                        placeholder="e.g. BRIDAL COLLECTION"
                        value={block.title}
                        onChange={(e) => handleBlockChange("lookbookBlocks", index, "title", e.target.value)}
                        className="w-full bg-[#FAF9F6] border border-[#E5E0D8] px-5 py-3 text-[14px] font-bold text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FILTERS TAB */}
          {activeTab === 'filters' && (
            <div key="filters" className="bg-white border border-[#E5E0D8] shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-8 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
                <div>
                  <h3 className="text-[18px] font-bold font-display text-gray-900">Active Navigation Tags</h3>
                  <p className="text-[13px] text-gray-500 mt-1 font-medium">Manage the structural tags for sidebar navigation.</p>
                </div>
                <button
                  onClick={() => setFormData(p => ({ ...p, collectionsCategories: [...p.collectionsCategories, ""] }))}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-white hover:bg-[#111111] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 active:scale-95 shrink-0"
                >
                  + Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.collectionsCategories.map((cat, index) => (
                  <div key={`col-cat-${index}`} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={cat}
                      onChange={(e) => {
                        const newCats = [...formData.collectionsCategories];
                        newCats[index] = e.target.value;
                        setFormData(p => ({ ...p, collectionsCategories: newCats }));
                      }}
                      placeholder="e.g. NEW ARRIVALS"
                      className="flex-1 bg-[#FAF9F6] border border-[#E5E0D8] px-4 py-3 font-bold tracking-widest uppercase text-[12px] text-gray-900 hover:border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 focus:bg-white transition-all duration-300 outline-none"
                    />
                    <button
                      onClick={() => {
                        const newCats = formData.collectionsCategories.filter((_, i) => i !== index);
                        setFormData(p => ({ ...p, collectionsCategories: newCats }));
                      }}
                      className="w-10 h-10 flex items-center justify-center shrink-0 border border-transparent text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === 'contact' && (
            <div key="contact" className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
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

        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-24 h-[60vh]">
         <div className="w-8 h-8 border-t-2 border-[#D4AF37] border-r-2 border-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">Loading Workspace</p>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  );
}
