import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";
import { 
  Play, 
  Layout, 
  Zap, 
  Globe, 
  ChevronRight, 
  Video, 
  CheckCircle, 
  Menu, 
  X,
  Search,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  Star,
  Shield,
  MousePointerClick,
  Wand2,
  Download,
  Lock,
  Mail,
  User,
  LogIn,
  Upload,
  Mic,
  Type,
  Image as ImageIcon,
  Trash2,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Plus,
  Minus,
  Volume2,
  Users,
  RefreshCw
} from 'lucide-react';

// --- Types & Interfaces ---

interface Template {
  id: string;
  title: string;
  category: 'Fashion' | 'Tech' | 'Food' | 'Beauty' | 'Home' | 'Fitness' | 'Gaming';
  platform: 'TikTok' | 'Shopee' | 'Instagram' | 'YouTube';
  duration: string;
  thumbnailUrl: string;
}

type Language = 'en' | 'id';
type UserPlan = 'free' | 'starter' | 'creator' | 'pro';

interface Translation {
  [key: string]: {
    en: string;
    id: string;
  };
}

// --- Constants & Data ---

const TRANSLATIONS: Translation = {
  heroTitle: {
    en: "Automate Your Content. Scale Your Revenue.",
    id: "Otomatisasi Konten Anda. Tingkatkan Pendapatan."
  },
  heroSubtitle: {
    en: "AI-powered UGC Video Generator for Affiliates. Create 10 videos in minutes.",
    id: "Generator Video UGC Berbasis AI untuk Afiliasi. Buat 10 video dalam hitungan menit."
  },
  ctaStart: {
    en: "Let's Start",
    id: "Mulai Sekarang"
  },
  ctaWaitlist: {
    en: "Join Beta Waitlist",
    id: "Gabung Waitlist Beta"
  },
  navHome: { en: "Home", id: "Beranda" },
  navTemplates: { en: "Templates", id: "Templat" },
  navPricing: { en: "Pricing", id: "Harga" },
  navLogin: { en: "Login", id: "Masuk" },
  navLogout: { en: "Logout", id: "Keluar" },
  featureSmart: { en: "Smart AI", id: "AI Pintar" },
  featureFast: { en: "Fast Generation", id: "Generasi Cepat" },
  dashboardTitle: { en: "Creator Dashboard", id: "Dasbor Kreator" },
  searchPlaceholder: { en: "Search 10,000+ templates...", id: "Cari 10.000+ templat..." },
  generateScript: { en: "Generate Script with AI", id: "Buat Skrip dengan AI" },
  productUrl: { en: "Product URL or Description", id: "URL Produk atau Deskripsi" },
  generating: { en: "Generating...", id: "Sedang Membuat..." },
  scriptResult: { en: "Generated Script", id: "Skrip Terbuat" },
  pricingTitle: { en: "Unlock Full Access", id: "Buka Akses Penuh" },
  pricingSubtitle: { en: "Choose a plan to generate unlimited videos.", id: "Pilih paket untuk membuat video tanpa batas." },
  howItWorksTitle: { en: "How It Works", id: "Cara Kerja" },
  howItWorksSubtitle: { en: "Create viral videos in 3 simple steps.", id: "Buat video viral dalam 3 langkah mudah." },
};

const MOCK_TEMPLATES: Template[] = [
  { id: '1', title: 'Viral Fashion Haul', category: 'Fashion', platform: 'TikTok', duration: '15s', thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
  { id: '2', title: 'Tech Review Fast', category: 'Tech', platform: 'Instagram', duration: '30s', thumbnailUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80' },
  { id: '3', title: 'Food ASMR', category: 'Food', platform: 'TikTok', duration: '10s', thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: '4', title: 'Skincare Routine', category: 'Beauty', platform: 'Shopee', duration: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: '5', title: 'Gadget Unboxing', category: 'Tech', platform: 'TikTok', duration: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1593341646261-fa50669169a6?w=400&q=80' },
  { id: '6', title: 'Street Style', category: 'Fashion', platform: 'Instagram', duration: '15s', thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
  { id: '7', title: 'Coffee Brewing', category: 'Food', platform: 'Instagram', duration: '25s', thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: '8', title: 'Setup Tour', category: 'Tech', platform: 'TikTok', duration: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&q=80' },
  { id: '9', title: 'Fitness Motivation', category: 'Fitness', platform: 'TikTok', duration: '20s', thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
  { id: '10', title: 'Gaming Highlights', category: 'Gaming', platform: 'YouTube', duration: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
  { id: '11', title: 'Home Decor', category: 'Home', platform: 'Instagram', duration: '15s', thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { id: '12', title: 'Makeup Tutorial', category: 'Beauty', platform: 'TikTok', duration: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&q=80' },
];

const VOICES = [
    { id: 'Aoede', name: 'Aoede (Confident)', lang: 'en' },
    { id: 'Charon', name: 'Charon (Deep)', lang: 'en' },
    { id: 'Kore', name: 'Kore (Friendly)', lang: 'en' },
    { id: 'Fenrir', name: 'Fenrir (Energetic)', lang: 'en' }
];

const AVATARS = [
    { id: 'sarah', name: 'Sarah (Asian)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
    { id: 'mike', name: 'Mike (Western)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
    { id: 'lisa', name: 'Lisa (Casual)', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    { id: 'david', name: 'David (Pro)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
];

const FAQ_DATA = [
    { q: "What is Vuca AI?", a: "Vuca AI is an automated video generation platform designed specifically for affiliate marketers. We help you turn product links into viral user-generated content (UGC) scripts and videos in minutes." },
    { q: "Is it free to start?", a: "We offer a Starter plan at just $10/month. We do not have a free tier, but our pricing is designed to be affordable for affiliates scaling their revenue." },
    { q: "Can I use my own footage?", a: "Yes! You can upload your own product photos and videos. Alternatively, you can use our AI models to present your product for you." },
    { q: "What languages do you support?", a: "Currently, we support English and Bahasa Indonesia, with optimized voiceovers for both markets." },
    { q: "Which platforms are supported?", a: "Our templates are optimized for TikTok, Shopee Video, Instagram Reels, and YouTube Shorts." },
];

// --- Context ---

interface UserState {
  isLoggedIn: boolean;
  email: string | null;
  plan: UserPlan;
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (k: string) => string;
  user: UserState;
  login: (email: string) => void;
  logout: () => void;
  upgradePlan: (plan: UserPlan) => void;
  showPricingModal: boolean;
  setShowPricingModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType>({
  lang: 'en',
  setLang: () => {},
  t: () => '',
  user: { isLoggedIn: false, email: null, plan: 'free' },
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
  showPricingModal: false,
  setShowPricingModal: () => {},
});

const useAppContext = () => useContext(AppContext);

// --- Helper Functions ---

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error("Failed to convert blob to base64"));
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const urlToBase64 = async (url: string): Promise<string> => {
  try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await blobToBase64(blob);
  } catch (error) {
      console.error("Error converting URL to base64:", error);
      throw error;
  }
};

// --- Visual Components ---

const AmbientBackground = ({ mode = 'hero' }: { mode?: 'hero' | 'pricing' | 'dashboard' | 'subtle' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className={`absolute top-0 left-0 w-full h-full bg-[#0A0F1F] transition-colors duration-1000`}></div>
      
      {mode === 'hero' && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-vuca-blue/40 rounded-full mix-blend-screen filter blur-[120px] animate-morph opacity-60" />
          <div className="absolute top-[20%] right-[-20%] w-[50vw] h-[50vw] bg-vuca-purple/30 rounded-full mix-blend-screen filter blur-[100px] animate-float opacity-50" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-vuca-yellow/20 rounded-full mix-blend-overlay filter blur-[130px] animate-pulse-slow opacity-30" />
          <div className="absolute top-[40%] left-[40%] w-[20vw] h-[20vw] bg-vuca-cyan/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-2000" />
        </>
      )}

      {(mode === 'pricing') && (
        <>
           <div className="absolute inset-0 bg-gradient-to-tr from-vuca-blue/20 via-vuca-purple/10 to-vuca-yellow/5 animate-aurora opacity-50" style={{ backgroundSize: '200% 200%' }} />
           <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-vuca-blue/30 rounded-[100%] blur-[120px]" />
           <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-vuca-purple/20 rounded-full blur-[150px] animate-pulse-slow" />
        </>
      )}

      {(mode === 'dashboard' || mode === 'subtle') && (
        <>
           <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-vuca-blue/10 rounded-full mix-blend-screen filter blur-[150px]" />
           <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-vuca-purple/10 rounded-full mix-blend-screen filter blur-[150px]" />
        </>
      )}
      
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
};

const WhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/6285157626264" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      <div className="relative bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-110 flex items-center justify-center">
         <MessageCircle size={28} fill="white" className="text-white" />
         <span className="absolute right-full mr-3 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
           Ask Me!
         </span>
      </div>
    </a>
  );
};

// --- Functional Components ---

const Navbar = ({ onViewChange }: { onViewChange: (view: string) => void }) => {
  const { lang, setLang, t, user, logout } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'premium-glass py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => onViewChange('landing')}>
            <div className="flex items-center gap-2 md:gap-3">
               <div className="w-8 h-8 md:w-10 md:h-10 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-vuca-blue to-blue-600 rounded-xl transform rotate-3 group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/30"></div>
                 <div className="absolute inset-0 bg-vuca-blue/40 rounded-xl transform -rotate-3 blur-sm group-hover:blur-md transition-all"></div>
                 <span className="relative text-vuca-yellow font-heading font-bold text-lg md:text-xl z-10 drop-shadow-md">V</span>
               </div>
               <span className="font-heading font-bold text-xl md:text-2xl tracking-tight text-white group-hover:text-gray-200 transition-colors">
                 VUCA<span className="text-vuca-blue">.AI</span>
               </span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
              <button onClick={() => onViewChange('landing')} className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10">{t('navHome')}</button>
              {user.isLoggedIn && (
                <button onClick={() => onViewChange('dashboard')} className="text-gray-300 hover:text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/10">{t('navTemplates')}</button>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button 
                onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
                className="flex items-center gap-1 text-gray-400 hover:text-white text-xs uppercase font-semibold px-2 py-1 rounded hover:bg-white/5 transition-all"
             >
                <Globe size={14} />
                {lang}
             </button>
             
             {user.isLoggedIn ? (
               <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Welcome,</span>
                    <span className="text-sm font-bold text-white">{user.email?.split('@')[0]}</span>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-vuca-blue flex items-center justify-center text-white font-bold">
                    {user.email?.[0].toUpperCase()}
                 </div>
                 <button onClick={logout} className="ml-2 text-gray-400 hover:text-white transition-colors">
                    <LogIn className="rotate-180" size={18} />
                 </button>
               </div>
             ) : (
                <>
                  <button onClick={() => onViewChange('auth')} className="text-white hover:text-vuca-yellow transition-colors font-medium text-sm px-3">
                      {t('navLogin')}
                  </button>
                  <button onClick={() => onViewChange('auth')} className="relative group overflow-hidden bg-vuca-blue text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_rgba(0,71,255,0.4)] hover:shadow-[0_0_30px_rgba(0,71,255,0.6)] hover:-translate-y-0.5">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-vuca-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">{t('ctaStart')} <ChevronRight size={14} /></span>
                  </button>
                </>
             )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0F1F] border-b border-white/10 absolute w-full backdrop-blur-xl bg-opacity-95 z-50">
          <div className="px-4 pt-4 pb-6 space-y-2">
             <button onClick={() => { onViewChange('landing'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navHome')}</button>
             {user.isLoggedIn && (
               <button onClick={() => { onViewChange('dashboard'); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navTemplates')}</button>
             )}
             
             <div className="border-t border-white/10 my-4 pt-4">
               {user.isLoggedIn ? (
                 <button onClick={logout} className="w-full bg-white/10 text-white px-4 py-3 rounded-xl font-bold mb-4">{t('navLogout')}</button>
               ) : (
                 <button onClick={() => { onViewChange('auth'); setMobileMenuOpen(false); }} className="w-full bg-vuca-blue text-white px-4 py-3 rounded-xl font-bold mb-4">{t('ctaStart')}</button>
               )}
               <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')} className="text-gray-400 uppercase font-bold border border-white/10 px-4 py-2 rounded-lg text-sm">{lang}</button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const SolutionSection = () => {
  return (
    <section className="py-24 bg-[#0A0F1F] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40vw] h-[40vw] bg-vuca-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
                 <div className="inline-block px-3 py-1 rounded-full bg-vuca-blue/10 border border-vuca-blue/20 text-vuca-blue text-xs font-bold uppercase tracking-wider mb-6">
                    Cost Efficiency
                 </div>
                 <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                    <span className="text-gradient-primary">Vuca AI</span> is the Solution.
                 </h2>
                 <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                    Ready to use UGC templates + AI voiceover + video generator, so you can focus on researching angles & scaling campaigns.
                 </p>
                 
                 <div className="space-y-8">
                    <div className="flex gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-[#131B2E] border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:border-vuca-blue/50 group-hover:bg-vuca-blue/10 transition-all shrink-0">
                            <Layout size={28} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-vuca-blue transition-colors">Ready-to-use Templates</h3>
                            <p className="text-gray-400 text-sm">Access 10,000+ viral structures. No more starting from scratch.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 group">
                        <div className="w-14 h-14 rounded-2xl bg-[#131B2E] border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:border-vuca-yellow/50 group-hover:bg-vuca-yellow/10 transition-all shrink-0">
                            <Zap size={28} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-vuca-yellow transition-colors">AI-Powered Production</h3>
                            <p className="text-gray-400 text-sm">Instant voiceovers, scripting, and editing. 10x your output.</p>
                        </div>
                    </div>
                 </div>
            </div>
            
            {/* Right Visual - Comparison Card */}
             <div className="relative animate-fade-in-up animation-delay-2000">
                 <div className="absolute inset-0 bg-gradient-to-br from-vuca-blue/20 to-vuca-purple/20 blur-2xl -z-10 rounded-3xl"></div>
                 <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Shield size={120} />
                     </div>
                     
                     <h3 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
                        <span className="w-2 h-6 bg-vuca-yellow rounded-full"></span>
                        Savings Breakdown
                     </h3>
                     
                     {/* Comparison 1: Time */}
                     <div className="mb-8">
                         <div className="flex justify-between text-sm mb-3">
                             <span className="text-gray-400">Time per Video</span>
                         </div>
                         <div className="space-y-3">
                             <div className="relative">
                                 <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                     <span>Manual Editing</span>
                                     <span>3-4 Hours</span>
                                 </div>
                                 <div className="h-10 bg-white/5 rounded-lg flex items-center px-3 relative overflow-hidden">
                                     <div className="absolute inset-y-0 left-0 bg-gray-700 w-full opacity-20"></div>
                                     <span className="relative z-10 text-gray-400 text-xs font-mono">TRADITIONAL</span>
                                 </div>
                             </div>
                             
                             <div className="relative">
                                 <div className="flex items-center justify-between text-xs text-vuca-blue mb-1">
                                     <span className="font-bold">Vuca AI</span>
                                     <span className="font-bold">5 Minutes</span>
                                 </div>
                                 <div className="h-10 bg-vuca-blue/10 border border-vuca-blue/30 rounded-lg flex items-center px-3 relative overflow-hidden">
                                      <div className="absolute inset-y-0 left-0 bg-vuca-blue w-[5%] shadow-[0_0_20px_#0047FF]"></div>
                                     <span className="relative z-10 text-white text-xs font-mono font-bold flex items-center gap-2">
                                         <Zap size={12} className="text-vuca-yellow fill-current" /> FAST
                                     </span>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Comparison 2: Cost */}
                     <div>
                         <div className="flex justify-between text-sm mb-3">
                             <span className="text-gray-400">Cost per Asset</span>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 rounded-xl p-4 text-center">
                                 <div className="text-gray-500 text-xs uppercase mb-1">Agency</div>
                                 <div className="text-2xl font-bold text-gray-400">$150</div>
                             </div>
                             <div className="bg-gradient-to-br from-vuca-blue/20 to-vuca-blue/10 border border-vuca-blue/30 rounded-xl p-4 text-center relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-8 h-8 bg-vuca-yellow blur-lg opacity-40"></div>
                                 <div className="text-vuca-blue text-xs uppercase mb-1 font-bold">Vuca AI</div>
                                 <div className="text-2xl font-bold text-white">$0.20</div>
                             </div>
                         </div>
                     </div>

                 </div>
                 
                 {/* Floating Badge */}
                 <div className="absolute -bottom-6 -right-6 bg-[#0E1529] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                         <div className="font-bold text-xs">+90%</div>
                     </div>
                     <div>
                         <div className="text-gray-400 text-xs">Margin Increase</div>
                         <div className="text-white font-bold text-sm">Guaranteed</div>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </section>
  );
}

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#080C19] relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-400">Everything you need to know about Vuca AI.</p>
                </div>
                
                <div className="space-y-4">
                    {FAQ_DATA.map((item, index) => (
                        <div key={index} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-all">
                            <button 
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-lg font-bold text-white">{item.q}</span>
                                {activeIndex === index ? <Minus size={20} className="text-vuca-blue" /> : <Plus size={20} className="text-gray-400" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${activeIndex === index ? 'max-h-48' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const { t } = useAppContext();
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-vuca-blue font-bold tracking-wider text-sm uppercase mb-2 block">Workflow</span>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">{t('howItWorksTitle')}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-vuca-blue/30 to-transparent -z-10"></div>

                    {[
                        { 
                            icon: <MousePointerClick size={32} className="text-white" />, 
                            title: "1. Select Template", 
                            desc: "Choose from 10,000+ viral templates optimized for TikTok, Shopee, and Instagram." 
                        },
                        { 
                            icon: <Wand2 size={32} className="text-white" />, 
                            title: "2. Generate AI Script", 
                            desc: "Input your product URL. Our AI writes high-converting Hook-Value-CTA scripts in seconds." 
                        },
                        { 
                            icon: <Download size={32} className="text-white" />, 
                            title: "3. Export & Post", 
                            desc: "Get your finished video ready to post. Scale your affiliate revenue effortlessly." 
                        }
                    ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 rounded-3xl bg-[#131B2E] border border-white/10 flex items-center justify-center mb-6 shadow-xl shadow-black/20 group-hover:border-vuca-blue/50 group-hover:scale-110 transition-all duration-300 relative">
                                <div className="absolute inset-0 bg-vuca-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {step.icon}
                                <div className="absolute -bottom-3 bg-[#0A0F1F] text-vuca-blue font-bold text-xs px-3 py-1 rounded-full border border-vuca-blue/30">
                                    STEP 0{idx + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const Footer = () => {
  return (
    <footer className="bg-[#0A0F1F] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <span className="font-heading font-bold text-2xl text-white block mb-4">VUCA<span className="text-vuca-blue">.AI</span></span>
                    <p className="text-gray-400 max-w-xs mb-6">Automate Your Content. Scale Your Revenue. The #1 AI UGC Video Generator for Affiliates.</p>
                    <div className="flex gap-4">
                        {[<Twitter size={20}/>, <Instagram size={20}/>, <Youtube size={20}/>].map((icon, i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-4">Product</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="hover:text-vuca-blue cursor-pointer">Templates</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Pricing</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Showcase</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Roadmap</li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="hover:text-vuca-blue cursor-pointer">About Us</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Contact</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-vuca-blue cursor-pointer">Terms of Service</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
                © 2025 Vuca AI. All rights reserved.
            </div>
        </div>
    </footer>
  );
}

const Hero = ({ onStart }: { onStart: () => void }) => {
  const { t } = useAppContext();
  
  return (
    <div className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col items-center">
      <AmbientBackground mode="hero" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 md:mb-10 animate-fade-in-up hover:bg-white/10 transition-colors cursor-default backdrop-blur-sm shadow-lg shadow-black/20">
           <span className="flex h-2.5 w-2.5 rounded-full bg-vuca-yellow shadow-[0_0_15px_#FFD33C] animate-pulse"></span>
           <span className="text-[10px] md:text-sm text-gray-300 font-medium tracking-wide">V 1.0 • 2025 RELEASE</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-[1.1] mb-6 md:mb-8 max-w-5xl mx-auto drop-shadow-2xl tracking-tight">
           <span className="text-gradient-primary block mb-2 md:mb-4">{t('heroTitle').split('.')[0]}.</span>
           <span className="text-white relative inline-block">
             {t('heroTitle').split('.')[1]}
             <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-vuca-blue opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
             </svg>
           </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-2xl text-gray-400 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up animation-delay-2000 px-4">
          {t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-4000 px-4 w-full sm:w-auto">
          <button 
            onClick={onStart}
            className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-vuca-yellow text-vuca-navy font-bold text-lg rounded-2xl overflow-hidden transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,211,60,0.3)] hover:shadow-[0_0_60px_rgba(255,211,60,0.5)]"
          >
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              {t('ctaStart')} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button className="group w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-white/5 text-white font-medium text-lg rounded-2xl hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-vuca-blue group-hover:text-white transition-colors">
              <Play size={14} fill="currentColor" /> 
            </div>
            Demo Video
          </button>
        </div>

        {/* Brand Proof / References */}
        <div className="mt-20 md:mt-28 pt-10 border-t border-white/5 relative w-full">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0F1F] px-6 text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] font-bold whitespace-nowrap">
              Trusted by 10,000+ Creators
           </div>
           <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 px-4">
              {['Shopee', 'TikTok', 'Tokopedia', 'Instagram', 'YouTube'].map((brand) => (
                <span key={brand} className="text-xl md:text-3xl font-heading font-bold text-white hover:text-vuca-blue transition-colors cursor-default select-none">{brand}</span>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Auth Component ---
const AuthPage = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      login(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative py-20 px-4">
      <AmbientBackground mode="subtle" />
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-[#0E1529]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Visual */}
        <div className="hidden md:flex flex-col justify-center p-12 relative bg-gradient-to-br from-vuca-blue/20 to-vuca-navy border-r border-white/5">
           <div className="absolute top-10 left-10">
             <span className="font-heading font-bold text-2xl text-white">VUCA<span className="text-vuca-blue">.AI</span></span>
           </div>
           
           <h2 className="text-3xl font-heading font-bold text-white mb-6">Start Creating Viral Content Today.</h2>
           <ul className="space-y-4">
              {['Access 10,000+ Templates', 'AI Script Generator', 'High Quality Export', 'Trend Analysis'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                   <div className="bg-vuca-blue/20 p-1 rounded-full text-vuca-blue"><Check size={14} /></div>
                   {item}
                </li>
              ))}
           </ul>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
           <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
           <p className="text-gray-400 mb-8">{isLoginView ? 'Enter your details to access your dashboard.' : 'Join thousands of creators scaling their revenue.'}</p>

           <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginView && (
                 <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                       <input type="text" className="w-full bg-[#0A0F1F] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-vuca-blue focus:outline-none transition-colors" placeholder="John Doe" />
                    </div>
                 </div>
              )}
              
              <div>
                 <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0A0F1F] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-vuca-blue focus:outline-none transition-colors" 
                      placeholder="john@example.com" 
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#0A0F1F] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-vuca-blue focus:outline-none transition-colors" 
                      placeholder="••••••••" 
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-vuca-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : (isLoginView ? 'Login' : 'Create Account')}
              </button>
           </form>

           <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                {isLoginView ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLoginView(!isLoginView)} className="text-vuca-yellow hover:underline font-bold">
                   {isLoginView ? 'Sign Up' : 'Login'}
                </button>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const PricingModal = ({ onClose, onUpgrade }: { onClose: () => void, onUpgrade: (plan: UserPlan) => void }) => {
    const { t } = useAppContext();
    
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-5xl bg-[#0E1529] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white z-10 p-2 bg-white/5 rounded-full">
                    <X size={24} />
                </button>

                <div className="p-8 md:p-12 relative overflow-hidden">
                    <AmbientBackground mode="pricing" />
                    <div className="text-center mb-10 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 drop-shadow-xl">{t('pricingTitle')}</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">{t('pricingSubtitle')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative z-10">
                        {/* Starter Plan */}
                        <div className="glass-card p-6 rounded-3xl flex flex-col border-white/5 hover:border-white/20 transition-all">
                            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-heading font-bold text-white">$10</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <div className="space-y-3 mb-8 flex-1">
                                {['15 AI Videos / month', 'Standard Templates', '720p Quality'].map((f) => (
                                    <div key={f} className="flex items-center gap-3 text-gray-400 text-sm"><Check size={14} />{f}</div>
                                ))}
                            </div>
                            <button onClick={() => onUpgrade('starter')} className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                                Select Starter
                            </button>
                        </div>

                        {/* Creator Plan */}
                        <div className="relative p-6 rounded-3xl flex flex-col bg-gradient-to-b from-[#1a233b] to-[#0A0F1F] border border-vuca-blue/50 shadow-2xl shadow-vuca-blue/20 transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vuca-blue text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">POPULAR</div>
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-white">Creator</h3>
                                <Sparkles size={16} className="text-vuca-yellow" />
                            </div>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-heading font-bold text-white">$29</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <div className="space-y-3 mb-8 flex-1">
                                {['50 AI Videos / month', 'Premium Templates', '1080p HD', 'No Watermark'].map((f) => (
                                    <div key={f} className="flex items-center gap-3 text-white text-sm font-medium"><Check size={14} className="text-vuca-blue" />{f}</div>
                                ))}
                            </div>
                            <button onClick={() => onUpgrade('creator')} className="w-full py-4 rounded-xl bg-vuca-blue text-white font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/50">
                                Get Creator Plan
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="glass-card p-6 rounded-3xl flex flex-col border-white/5 hover:border-white/20 transition-all">
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-heading font-bold text-white">$99</span>
                                <span className="text-gray-400">/mo</span>
                            </div>
                            <div className="space-y-3 mb-8 flex-1">
                                {['Unlimited Videos', 'API Access', '4K Quality', 'Priority Support'].map((f) => (
                                    <div key={f} className="flex items-center gap-3 text-gray-400 text-sm"><Check size={14} />{f}</div>
                                ))}
                            </div>
                            <button onClick={() => onUpgrade('pro')} className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                                Select Pro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TemplateCard: React.FC<{ template: Template; onSelect: (t: Template) => void }> = ({ template, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(template)}
            className="gradient-border-card rounded-xl overflow-hidden cursor-pointer group"
        >
            <div className="aspect-[9/16] relative bg-gray-800 rounded-xl overflow-hidden">
                <img src={template.thumbnailUrl} alt={template.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-xs font-mono text-white flex items-center gap-1.5 shadow-lg">
                    <Video size={10} /> {template.duration}
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {template.platform === 'TikTok' && <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded border border-gray-700 shadow-lg">TikTok</span>}
                    {template.platform === 'Shopee' && <span className="text-[10px] font-bold bg-[#EE4D2D] text-white px-2 py-0.5 rounded shadow-lg">Shopee</span>}
                    {template.platform === 'Instagram' && <span className="text-[10px] font-bold bg-gradient-to-tr from-yellow-400 to-purple-600 text-white px-2 py-0.5 rounded shadow-lg">IG</span>}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-5">
                    <span className="text-[10px] text-vuca-yellow font-bold mb-1.5 block uppercase tracking-wider">{template.category}</span>
                    <h3 className="text-white font-heading font-semibold text-lg leading-tight group-hover:text-vuca-blue transition-colors">{template.title}</h3>
                </div>
                
                {/* Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                    <div className="bg-vuca-blue text-white rounded-full p-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 shadow-xl shadow-blue-600/40">
                        <Zap fill="currentColor" size={24} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Editor = ({ template, onBack }: { template: Template; onBack: () => void }) => {
    const { t, user, setShowPricingModal, lang } = useAppContext();
    const [prompt, setPrompt] = useState('');
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
    
    // Step 2 Configurations
    const [visualMode, setVisualMode] = useState<'upload' | 'avatar' | 'generate'>('upload');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
    const [hasSubtitles, setHasSubtitles] = useState(true);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    
    // Image Generation
    const [imagePrompt, setImagePrompt] = useState('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // Final Video
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateScript = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Write a short, engaging video script (under 60 seconds) for a ${template.platform} video about: "${prompt}". 
                The category is ${template.category}.
                Tone: Friendly, Simple, Confident.
                Structure: Hook, Value, Call to Action.
                Language: ${useAppContext().lang === 'id' ? 'Bahasa Indonesia' : 'English'}.
                Format the output simply as the spoken script text.`,
                config: {
                    systemInstruction: "You are an expert viral content scripter.",
                }
            });
            
            setScript(response.text || "Failed to generate script.");
            setStep(2);
        } catch (e) {
            console.error(e);
            setScript("Error connecting to AI service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            // Using gemini-3-pro-image-preview for high quality generation
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: {
                   parts: [{ text: imagePrompt }]
                },
                config: {
                    tools: [{ googleSearch: {} }], // Enable search grounding for better context if needed
                }
            });

            // Extract image from parts
            let foundImage = null;
             if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        foundImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }

            if (foundImage) {
                setGeneratedImage(foundImage);
            } else {
                 alert("No image generated. Please try a different prompt.");
            }

        } catch (e) {
            console.error(e);
            alert("Image generation failed. Please try again.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleGenerateAudio = async () => {
        setIsGeneratingAudio(true);
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             const response = await ai.models.generateContent({
                  model: "gemini-2.5-flash-preview-tts",
                  contents: [{ parts: [{ text: script.substring(0, 300) }] }], // Limit char count for preview
                  config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: selectedVoice },
                        },
                    },
                  },
             });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBlob = await (await fetch(`data:audio/mp3;base64,${base64Audio}`)).blob();
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                
                // Play immediately
                const audio = new Audio(url);
                audio.play();
            }

        } catch (e) {
            console.error("Audio generation error:", e);
        } finally {
            setIsGeneratingAudio(false);
        }
    }

    const handleGenerateVideo = async () => {
        if (user.plan === 'free') {
            setShowPricingModal(true);
            return;
        }

        // Check for billing key for Veo
        // We cast to any to avoid TS errors if types are missing in this file context,
        // but the main fix is removing the return value check on openSelectKey().
        if (!await (window as any).aistudio.hasSelectedApiKey()) {
             await (window as any).aistudio.openSelectKey();
             // Race condition: wait slightly or re-instantiate logic if needed. 
             // We'll proceed assuming success as per guidelines.
        }

        setIsGeneratingVideo(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Determine source image
            let sourceImageBase64 = '';
            if (visualMode === 'upload' && uploadedImage) {
                // uploadedImage is a blob url, need to fetch it
                sourceImageBase64 = await urlToBase64(uploadedImage);
            } else if (visualMode === 'avatar') {
                const currentAvatar = AVATARS.find(a => a.id === selectedAvatar);
                if (currentAvatar) {
                    sourceImageBase64 = await urlToBase64(currentAvatar.url);
                }
            } else if (visualMode === 'generate' && generatedImage) {
                // generatedImage is already data url
                sourceImageBase64 = generatedImage.split(',')[1];
            }

            if (!sourceImageBase64) {
                alert("Please select or upload a visual source first.");
                setIsGeneratingVideo(false);
                return;
            }

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: `Cinematic video of this character/product. ${prompt.substring(0,100)}`,
                image: {
                    imageBytes: sourceImageBase64,
                    mimeType: 'image/png', // Assumption: standard image format
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '9:16' // Vertical for social media
                }
            });

            // Poll for completion
            while (!operation.done) {
                 await new Promise(resolve => setTimeout(resolve, 5000));
                 operation = await ai.operations.getVideosOperation({operation: operation});
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 // The URI requires the API key appended
                 const finalVideoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
                 setGeneratedVideoUrl(finalVideoUrl);
            }

        } catch (e) {
            console.error("Video generation failed:", e);
            alert("Failed to generate video. Please try again later.");
        } finally {
            setIsGeneratingVideo(false);
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
        }
    };
    
    const currentAvatar = AVATARS.find(a => a.id === selectedAvatar);
    
    // Determine preview image source for UI display
    let previewImageSrc = template.thumbnailUrl;
    if (visualMode === 'upload' && uploadedImage) previewImageSrc = uploadedImage;
    if (visualMode === 'avatar' && currentAvatar) previewImageSrc = currentAvatar.url;
    if (visualMode === 'generate' && generatedImage) previewImageSrc = generatedImage;

    return (
        <div className="min-h-screen pt-20 flex flex-col md:flex-row bg-[#0A0F1F]">
             <AmbientBackground mode="subtle" />
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 border-r border-white/5 p-6 md:p-8 overflow-y-auto z-10 bg-[#0A0F1F]/90 backdrop-blur-xl h-auto md:h-[calc(100vh-80px)]">
                <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-8 text-sm group transition-colors">
                    <ChevronRight className="rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Templates
                </button>
                
                <div className="mb-8">
                     <span className="text-xs font-bold text-vuca-purple px-2.5 py-1 bg-vuca-purple/10 rounded-full border border-vuca-purple/20">STEP {step} OF 2</span>
                     <h2 className="text-3xl font-heading font-bold text-white mt-4 mb-2">Create Video</h2>
                     <p className="text-sm text-gray-500">Template: <span className="text-vuca-yellow font-medium">{template.title}</span></p>
                </div>

                <div className="space-y-6">
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                                    {t('productUrl')}
                                </label>
                                <div className="gradient-border-card rounded-xl p-[1px]">
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Example: Review of the new Sony headphones with noise cancellation..."
                                        className="w-full bg-[#0E1529] rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none min-h-[140px] resize-none block transition-all"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGenerateScript}
                                disabled={loading || !prompt}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                                    loading || !prompt ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-vuca-blue hover:bg-blue-600 text-white shadow-blue-900/40 hover:shadow-blue-500/20 hover:-translate-y-1'
                                }`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                                {loading ? t('generating') : t('generateScript')}
                            </button>
                        </>
                    )}

                    {step >= 2 && (
                        <div className="animate-fade-in-up space-y-8">
                            
                            {/* Visual Source Selection */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">1. Visual Source</h3>
                                <div className="flex bg-white/5 p-1 rounded-xl mb-4">
                                    <button 
                                        onClick={() => setVisualMode('upload')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'upload' ? 'bg-vuca-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Upload
                                    </button>
                                    <button 
                                        onClick={() => setVisualMode('avatar')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'avatar' ? 'bg-vuca-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Avatar
                                    </button>
                                    <button 
                                        onClick={() => setVisualMode('generate')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'generate' ? 'bg-vuca-blue text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Generate
                                    </button>
                                </div>

                                {visualMode === 'upload' && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-vuca-blue/50 hover:bg-white/5 transition-all group relative overflow-hidden h-32"
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                        
                                        {uploadedImage ? (
                                            <>
                                            <img src={uploadedImage} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                            <div className="relative z-10 flex flex-col items-center">
                                                <Upload size={20} className="text-white mb-2" />
                                                <span className="text-xs font-bold text-white">Change Image</span>
                                            </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-vuca-blue/10 text-vuca-blue flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload size={20} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-300">Upload Product Photo</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {visualMode === 'avatar' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {AVATARS.map(avatar => (
                                            <div 
                                                key={avatar.id}
                                                onClick={() => setSelectedAvatar(avatar.id)}
                                                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedAvatar === avatar.id ? 'border-vuca-blue shadow-[0_0_15px_rgba(0,71,255,0.4)]' : 'border-transparent hover:border-white/20'}`}
                                            >
                                                <img src={avatar.url} alt={avatar.name} className="w-full h-24 object-cover" />
                                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-1.5 text-center">
                                                    <span className="text-[10px] font-bold text-white block">{avatar.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {visualMode === 'generate' && (
                                    <div className="space-y-3">
                                        <textarea
                                            value={imagePrompt}
                                            onChange={(e) => setImagePrompt(e.target.value)}
                                            placeholder="Describe the image you want (e.g., A cyberpunk product showcase of headphones on a neon table)"
                                            className="w-full bg-[#0E1529] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-vuca-blue"
                                        />
                                        <button 
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage || !imagePrompt}
                                            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                                        >
                                            {isGeneratingImage ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                            Generate Visual
                                        </button>
                                        {generatedImage && (
                                            <div className="relative rounded-xl overflow-hidden border border-vuca-blue/50">
                                                <img src={generatedImage} alt="Generated" className="w-full h-32 object-cover" />
                                                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">Generated</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Script Editor Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Type size={14} /> 2. Edit Script
                                </label>
                                <textarea 
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
                                    className="w-full bg-[#0E1529] border border-white/10 rounded-xl p-4 text-gray-300 text-sm leading-relaxed font-mono shadow-inner focus:outline-none focus:border-vuca-blue/50 transition-colors min-h-[120px]"
                                />
                            </div>

                            {/* Audio & Subtitles */}
                            <div className="border-t border-white/10 pt-6 space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    3. Audio & Captions
                                </h3>

                                <div className="space-y-4">
                                    {/* Voice Selector & Generator */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Voiceover</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select 
                                                    value={selectedVoice}
                                                    onChange={(e) => setSelectedVoice(e.target.value)}
                                                    className="w-full appearance-none bg-[#0E1529] border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-vuca-blue cursor-pointer hover:bg-white/5"
                                                >
                                                    {VOICES.filter(v => v.lang === lang).map(voice => (
                                                        <option key={voice.id} value={voice.id}>{voice.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <ChevronRight className="rotate-90" size={14} />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleGenerateAudio}
                                                disabled={isGeneratingAudio}
                                                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors flex items-center justify-center tooltip-trigger"
                                                title="Preview Voice"
                                            >
                                                {isGeneratingAudio ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtitle Toggle */}
                                    <div 
                                        onClick={() => setHasSubtitles(!hasSubtitles)}
                                        className="bg-[#0E1529] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Type size={18} className="text-gray-400" />
                                            <span className="text-sm text-white font-medium">Auto-Captions</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${hasSubtitles ? 'bg-vuca-blue' : 'bg-gray-700'}`}>
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${hasSubtitles ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    onClick={handleGenerateVideo} 
                                    disabled={isGeneratingVideo}
                                    className="w-full py-4 bg-vuca-yellow text-vuca-navy font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingVideo ? <><Loader2 className="animate-spin" /> Generating Video...</> : <>Export Video <ChevronRight size={18}/></>}
                                </button>
                                <button onClick={() => setStep(1)} className="w-full py-3 text-gray-400 text-sm hover:text-white transition-colors">Start Over</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black/50 backdrop-blur-sm p-4 md:p-8 min-h-[600px] md:min-h-[calc(100vh-80px)]">
                {/* Phone Frame */}
                <div className="relative w-[300px] h-[600px] md:w-[340px] md:h-[680px] border-[10px] md:border-[12px] border-[#1a1a1a] rounded-[3rem] md:rounded-[3.5rem] bg-gray-900 overflow-hidden shadow-2xl ring-1 ring-white/10 transform transition-transform">
                    <div className="absolute top-0 w-full h-8 bg-[#1a1a1a] flex justify-center z-20 rounded-b-xl">
                        <div className="w-16 md:w-20 h-5 bg-black rounded-b-xl"></div>
                    </div>

                    {/* Mock Content inside phone */}
                    {generatedVideoUrl ? (
                         <video 
                            src={generatedVideoUrl} 
                            className="absolute inset-0 w-full h-full object-cover" 
                            controls 
                            autoPlay 
                            loop 
                         />
                    ) : (
                         <img 
                            src={previewImageSrc} 
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500`} 
                            alt="Preview"
                        />
                    )}
                    
                    {!generatedVideoUrl && (
                        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-b from-black/40 via-transparent to-black/80">
                             <div className="mt-12 flex justify-between items-start">
                                 <div className="flex flex-col gap-2">
                                    {hasSubtitles && step >= 2 && (
                                         <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 inline-flex items-center gap-1">
                                             <Type size={10} className="text-vuca-yellow"/>
                                             <span className="text-[10px] font-bold text-white uppercase tracking-wider">CC On</span>
                                         </div>
                                    )}
                                 </div>
                                 
                                 <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                                     <Globe size={16} />
                                 </div>
                             </div>
                            
                            <div className="space-y-4">
                                 {step >= 2 && (
                                    <div className="animate-fade-in-up bg-black/60 backdrop-blur-md p-4 rounded-2xl border-l-4 border-vuca-yellow shadow-lg">
                                        <p className="text-white font-bold text-sm leading-snug">
                                            "{script.split('\n')[0].replace(/"/g, '') || "Hook text here..."}"
                                        </p>
                                    </div>
                                )}
    
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-white shadow-md" />
                                    <div className="flex flex-col">
                                        <div className="h-2.5 w-24 bg-gray-200/80 rounded mb-1.5 shadow-sm" />
                                        <div className="h-2 w-16 bg-gray-200/50 rounded shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Floating particles behind phone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vuca-blue/5 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow" />
            </div>
        </div>
    );
};

const Dashboard = ({ onSelectTemplate }: { onSelectTemplate: (t: Template) => void }) => {
    const { t } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Fashion', 'Tech', 'Food', 'Beauty', 'Home', 'Fitness'];

    const filteredTemplates = MOCK_TEMPLATES.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-20 px-4 md:px-8 bg-[#0A0F1F] pb-20">
             <AmbientBackground mode="dashboard" />
             
             <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">{t('dashboardTitle')}</h1>
                    <p className="text-gray-400">Select a viral template to get started.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-30 bg-[#0A0F1F]/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-filter-none">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#131B2E] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-vuca-blue shadow-lg"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                                    selectedCategory === cat 
                                    ? 'bg-vuca-blue text-white border-vuca-blue shadow-lg shadow-blue-900/30' 
                                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTemplates.map(template => (
                        <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
                    ))}
                </div>
             </div>
        </div>
    );
};

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState('landing'); // landing, auth, dashboard, editor
  const [user, setUser] = useState<UserState>({ isLoggedIn: false, email: null, plan: 'free' });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  const login = (email: string) => {
    setUser({ isLoggedIn: true, email, plan: 'free' });
    setView('dashboard');
  };

  const logout = () => {
    setUser({ isLoggedIn: false, email: null, plan: 'free' });
    setView('landing');
  };

  const upgradePlan = (plan: UserPlan) => {
    setUser(prev => ({ ...prev, plan }));
    setShowPricingModal(false);
  };
  
  const handleSelectTemplate = (template: Template) => {
      setSelectedTemplate(template);
      setView('editor');
  }

  const handleBackToDashboard = () => {
      setSelectedTemplate(null);
      setView('dashboard');
  }

  return (
    <AppContext.Provider value={{ lang, setLang, t, user, login, logout, upgradePlan, showPricingModal, setShowPricingModal }}>
      <div className="font-sans text-gray-100 min-h-screen">
        <Navbar onViewChange={setView} />
        
        {view === 'landing' && (
          <>
            <Hero onStart={() => setView('auth')} />
            <SolutionSection />
            <HowItWorks />
            <FAQ />
            <Footer />
            <WhatsAppFloat />
          </>
        )}

        {view === 'auth' && <AuthPage />}
        
        {view === 'dashboard' && <Dashboard onSelectTemplate={handleSelectTemplate} />}
        
        {view === 'editor' && selectedTemplate && (
            <Editor template={selectedTemplate} onBack={handleBackToDashboard} />
        )}

        {showPricingModal && (
            <PricingModal onClose={() => setShowPricingModal(false)} onUpgrade={upgradePlan} />
        )}
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);