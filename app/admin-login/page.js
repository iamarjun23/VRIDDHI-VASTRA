import Navbar from "../components/Navbar"
import dbConnect from "../../lib/mongodb"
import SiteConfig from "../../models/SiteConfig"

export default async function AdminLogin() {
  await dbConnect();
  const config = await SiteConfig.findOne({ configId: "main" }).lean() || {};
  return (
    <main className="bg-[#f3efe6] min-h-screen relative flex items-center justify-center selection:bg-brand-green selection:text-white">
      
      {/* Background Checkered Pattern (subtle overlay from image) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px'
      }}></div>

      {/* Navbar with light theme - Absolute positioned at top */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar theme="light" logo={config.logo} />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10 flex justify-center mt-20">
        
        {/* Soft floating card */}
        <div className="bg-[#f3efe6] w-[460px] rounded-[32px] p-12 flex flex-col items-center shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-4 border-white/50">
          
          {/* Brand Logo */}
          <div className="w-[140px] h-[140px] rounded-full bg-brand-green flex flex-col items-center justify-center shadow-xl relative mb-10 overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer">
             {config.logo ? (
                <img src={config.logo} alt="Logo" className="w-full h-full object-cover" />
             ) : (
               <>
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                 
                 {/* Text "VRIDDHI VASTRA" */}
                 <div className="flex flex-col items-center mt-4">
                  <span className="font-serif text-[13px] text-brand-gold tracking-[0.2em] leading-tight text-center">
                    VRIDDHI<br/>VASTRA
                  </span>
                 </div>

                 {/* Small floating logo icon (approximation of ladybug/flower) */}
                 <div className="absolute top-[35%] w-full flex justify-center text-red-600">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-md"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                 </div>
               </>
             )}
             
             {/* Gold trim circle */}
             <div className="absolute inset-2 rounded-full border border-brand-gold/60"></div>
          </div>

          <h2 className="font-serif text-[38px] text-foreground font-medium mb-12 tracking-wide">
            Login
          </h2>

          <form className="w-full flex flex-col gap-6">
            
            <div className="w-full">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full py-4 px-6 rounded-[20px] bg-[#d3d5d9] text-[#1c1410] placeholder:text-[#1c1410]/50 font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 shadow-inner transition-all duration-300"
              />
            </div>

            <div className="w-full">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full py-4 px-6 rounded-[20px] bg-[#d3d5d9] text-[#1c1410] placeholder:text-[#1c1410]/50 font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-green/30 shadow-inner transition-all duration-300"
              />
            </div>

            <div className="flex justify-center mt-8 mb-6">
              <button 
                type="submit" 
                className="px-16 py-3.5 rounded-full bg-[#fdfaf3] border border-[#d3d5d9] shadow-[0_8px_20px_rgba(0,0,0,0.06)] text-brand-green font-sans font-medium text-[16px] tracking-[0.1em] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:bg-white transition-all duration-300"
              >
                LOGIN
              </button>
            </div>

          </form>

          <div className="flex flex-col items-center gap-3 mt-4 font-sans text-[13px] text-foreground/80">
            <a href="#" className="hover:text-brand-green transition-colors">Forgot Password?</a>
            <p>Don't have an account? <a href="#" className="text-foreground hover:text-brand-green font-medium transition-colors">Sign Up</a></p>
          </div>

        </div>

      </div>

    </main>
  )
}
