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
  Facebook,
  MessageCircle,
  Plus,
  Minus,
  Volume2,
  Users,
  RefreshCw,
  Share2,
  Settings,
  LogOut,
  Film,
  Link as LinkIcon,
  Heart,
  Layers,
  Smartphone,
  PhoneCall,
  Box,
  ScanFace,
  HandMetal,
  TrendingUp,
  Clock,
  DollarSign,
  Smile,
  Aperture,
  Camera
} from 'lucide-react';

// --- Types & Interfaces ---

interface Template {
  id: string;
  title: string;
  category: 'Fashion' | 'Tech' | 'Food' | 'Beauty' | 'Home' | 'Fitness' | 'Gaming';
  platform: 'TikTok' | 'Shopee' | 'Instagram' | 'Facebook';
  duration: string;
  thumbnailUrl: string;
}

interface Project {
  id: string;
  templateId: string;
  templateTitle: string;
  videoUrl: string;
  thumbnailUrl: string; // Usually the source image or template thumb
  createdAt: Date;
  platform: 'TikTok' | 'Shopee' | 'Instagram' | 'Facebook';
}

type Language = 'en' | 'id';
type UserPlan = 'free' | 'basic' | 'pro' | 'max';

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
  navUseCase: { en: "Features", id: "Fitur" },
  navPricing: { en: "Pricing", id: "Harga" },
  navTemplates: { en: "Templates", id: "Templat" },
  navLogin: { en: "Login", id: "Masuk" },
  navProfile: { en: "Profile", id: "Profil" },
  navLogout: { en: "Logout", id: "Keluar" },
  navProjects: { en: "My Projects", id: "Proyek Saya" },
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
};

const MOCK_TEMPLATES: Template[] = [
  { id: '1', title: 'Viral Fashion Haul', category: 'Fashion', platform: 'TikTok', duration: '15s', thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
  { id: '2', title: 'Tech Review Fast', category: 'Tech', platform: 'Instagram', duration: '30s', thumbnailUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80' },
  { id: '3', title: 'Food ASMR', category: 'Food', platform: 'TikTok', duration: '10s', thumbnailUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: '4', title: 'Skincare Routine', category: 'Beauty', platform: 'Shopee', duration: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: '5', title: 'Gadget Unboxing', category: 'Tech', platform: 'TikTok', duration: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1593341646261-fa50669169a6?w=400&q=80' },
  { id: '6', title: 'Street Style', category: 'Fashion', platform: 'Instagram', duration: '15s', thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
  { id: '7', title: 'Coffee Brewing', category: 'Food', platform: 'Facebook', duration: '25s', thumbnailUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
  { id: '8', title: 'Setup Tour', category: 'Tech', platform: 'TikTok', duration: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&q=80' },
  { id: '9', title: 'Fitness Motivation', category: 'Fitness', platform: 'Facebook', duration: '20s', thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80' },
  { id: '10', title: 'Gaming Highlights', category: 'Gaming', platform: 'Facebook', duration: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' },
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
    { q: "Is it free to start?", a: "We offer a Basic plan at just $23/month. We do not have a free tier, but our pricing is designed to be affordable for affiliates scaling their revenue." },
    { q: "Can I use my own footage?", a: "Yes! You can upload your own product photos and videos. Alternatively, you can use our AI models to present your product for you." },
    { q: "What languages do you support?", a: "Currently, we support English and Bahasa Indonesia, with optimized voiceovers for both markets." },
    { q: "Which platforms are supported?", a: "Our templates are optimized for TikTok, Shopee Video, Instagram Reels, and Facebook Video." },
];

// --- Context ---

interface ConnectedAccounts {
  instagram: boolean;
  tiktok: boolean;
  facebook: boolean;
  youtube: boolean;
}

interface UserState {
  isLoggedIn: boolean;
  email: string | null;
  plan: UserPlan;
  connectedAccounts: ConnectedAccounts;
  hasOnboarded: boolean;
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (k: string) => string;
  user: UserState;
  login: (email: string) => void;
  logout: () => void;
  upgradePlan: (plan: UserPlan) => void;
  toggleSocialConnection: (platform: keyof ConnectedAccounts) => void;
  completeOnboarding: () => void;
  showPricingModal: boolean;
  setShowPricingModal: (show: boolean) => void;
  projects: Project[];
  addProject: (p: Project) => void;
}

const AppContext = createContext<AppContextType>({
  lang: 'en',
  setLang: () => {},
  t: () => '',
  user: { 
    isLoggedIn: false, 
    email: null, 
    plan: 'free',
    connectedAccounts: { instagram: false, tiktok: false, facebook: false, youtube: false },
    hasOnboarded: false
  },
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
  toggleSocialConnection: () => {},
  completeOnboarding: () => {},
  showPricingModal: false,
  setShowPricingModal: () => {},
  projects: [],
  addProject: () => {},
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

const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const getApiKey = (): string => {
  // @ts-ignore
  return import.meta.env.VITE_API_KEY || "";
}

// --- Visual Components ---

const AmbientBackground = ({ mode = 'hero' }: { mode?: 'hero' | 'pricing' | 'dashboard' | 'subtle' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-white">
      {/* Primary Vuca Blue Gradient Background */}
      
      {mode === 'hero' && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-vuca-blue/20 rounded-full mix-blend-multiply filter blur-[120px] animate-morph opacity-60" />
          <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-vuca-purple/30 rounded-full mix-blend-multiply filter blur-[100px] animate-float opacity-50" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-vuca-yellow/20 rounded-full mix-blend-multiply filter blur-[130px] animate-pulse-slow opacity-40" />
          <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-vuca-cyan/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000" />
        </>
      )}

      {(mode === 'pricing') && (
        <>
           <div className="absolute inset-0 bg-gradient-to-tr from-vuca-blue/5 via-white to-vuca-yellow/5 animate-aurora opacity-80" style={{ backgroundSize: '200% 200%' }} />
           <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-vuca-blue/10 rounded-[100%] blur-[120px]" />
           <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-vuca-purple/10 rounded-full blur-[150px] animate-pulse-slow" />
        </>
      )}

      {(mode === 'dashboard' || mode === 'subtle') && (
        <>
           <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-vuca-blue/5 rounded-full mix-blend-multiply filter blur-[150px]" />
           <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-vuca-purple/5 rounded-full mix-blend-multiply filter blur-[150px]" />
        </>
      )}
      
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" 
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setProfileMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToSection = (id: string) => {
      onViewChange('landing');
      setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }, 100);
      setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'premium-glass py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => user.isLoggedIn ? onViewChange('dashboard') : scrollToSection('hero')}>
            <div className="flex items-center gap-2 md:gap-3">
               <div className="w-10 h-10 md:w-12 md:h-12 relative flex items-center justify-center filter drop-shadow-md">
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform group-hover:scale-105">
                    <path d="M25 25 L45 55 A 5 5 0 0 0 50 60 L 50 60 L 50 40 L 35 15 Z" fill="#0047FF" stroke="#0047FF" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 60 L 80 25" stroke="#FFD33C" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
               </div>
               <span className="font-heading font-extrabold text-2xl md:text-3xl tracking-tight text-vuca-navy group-hover:opacity-80 transition-opacity">
                 <span className="text-vuca-navy">VUCA</span>
                 <span className="text-gradient-vuca">.AI</span>
               </span>
            </div>
          </div>
          
          {/* Main Navigation - Hidden when logged in */}
          {!user.isLoggedIn && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
                <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-vuca-blue px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white">{t('navHome')}</button>
                <button onClick={() => scrollToSection('use-case')} className="text-gray-600 hover:text-vuca-blue px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white">{t('navUseCase')}</button>
                <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-vuca-blue px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white">{t('navPricing')}</button>
                <button onClick={() => onViewChange('auth')} className="text-gray-600 hover:text-vuca-blue px-5 py-2 rounded-full text-sm font-semibold transition-all hover:bg-white">{t('navTemplates')}</button>
              </div>
            </div>
          )}

          {/* User & Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
             <button 
                onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
                className="flex items-center gap-1 text-gray-500 hover:text-vuca-blue text-xs uppercase font-bold px-2 py-1 rounded hover:bg-gray-100 transition-all"
             >
                <Globe size={14} />
                {lang}
             </button>
             
             {user.isLoggedIn ? (
               <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                 <div 
                    className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                 >
                     <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">Welcome,</span>
                        <span className="text-sm font-bold text-vuca-navy">{user.email?.split('@')[0]}</span>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-vuca-blue flex items-center justify-center text-white font-bold ring-2 ring-white">
                        {user.email?.[0].toUpperCase()}
                     </div>
                 </div>

                 {profileMenuOpen && (
                     <div className="absolute top-14 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden animate-fade-in-up">
                        <button onClick={() => { onViewChange('profile'); setProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-vuca-blue hover:bg-gray-50 flex items-center gap-2">
                             <User size={16} /> {t('navProfile')}
                        </button>
                        <button onClick={() => { onViewChange('dashboard'); setProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-vuca-blue hover:bg-gray-50 flex items-center gap-2">
                             <Film size={16} /> {t('navProjects')}
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                             <LogOut size={16} /> {t('navLogout')}
                        </button>
                     </div>
                 )}
               </div>
             ) : (
                <>
                  <button onClick={() => onViewChange('auth')} className="text-gray-600 hover:text-vuca-blue transition-colors font-bold text-sm px-3">
                      {t('navLogin')}
                  </button>
                  <button onClick={() => onViewChange('auth')} className="relative group overflow-hidden bg-vuca-blue text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_4px_14px_rgba(0,71,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,71,255,0.4)] hover:-translate-y-0.5">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-vuca-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">{t('ctaStart')} <ChevronRight size={14} /></span>
                  </button>
                </>
             )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-vuca-blue hover:bg-gray-100 focus:outline-none">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full backdrop-blur-xl bg-opacity-95 z-50 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
             {!user.isLoggedIn && (
               <>
                 <button onClick={() => scrollToSection('hero')} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navHome')}</button>
                 <button onClick={() => scrollToSection('use-case')} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navUseCase')}</button>
                 <button onClick={() => scrollToSection('pricing')} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navPricing')}</button>
                 <button onClick={() => { onViewChange('auth'); setMobileMenuOpen(false); }} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navTemplates')}</button>
               </>
             )}
             
             {user.isLoggedIn && (
               <>
                 <button onClick={() => { onViewChange('dashboard'); setMobileMenuOpen(false); }} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('dashboardTitle')}</button>
                 <button onClick={() => { onViewChange('profile'); setMobileMenuOpen(false); }} className="text-gray-800 hover:text-vuca-blue block px-3 py-3 rounded-md text-lg font-medium w-full text-left">{t('navProfile')}</button>
               </>
             )}
             
             <div className="border-t border-gray-100 my-4 pt-4">
               {user.isLoggedIn ? (
                 <button onClick={logout} className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl font-bold mb-4">{t('navLogout')}</button>
               ) : (
                 <button onClick={() => { onViewChange('auth'); setMobileMenuOpen(false); }} className="w-full bg-vuca-blue text-white px-4 py-3 rounded-xl font-bold mb-4 shadow-lg shadow-blue-500/30">{t('ctaStart')}</button>
               )}
               <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')} className="text-gray-500 uppercase font-bold border border-gray-200 px-4 py-2 rounded-lg text-sm">{lang}</button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onStart }: { onStart: () => void }) => {
  const { t } = useAppContext();
  return (
    <div id="hero" className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <AmbientBackground mode="hero" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-fade-in-up">
           <span className="flex h-2 w-2 rounded-full bg-vuca-blue animate-pulse"></span>
           <span className="text-xs font-semibold text-gray-600">Vuca AI: The Solution to Your Content Scaling Problems</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-vuca-navy tracking-tight mb-8 animate-fade-in-up animation-delay-200">
          {t('heroTitle').split('.')[0]}.
          <br />
          <span className="text-gradient-vuca animate-gradient-x">
            {t('heroTitle').split('.')[1]}
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 animate-fade-in-up animation-delay-400 font-medium">
          {t('heroSubtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-vuca-blue rounded-full font-bold text-white shadow-[0_10px_40px_rgba(0,71,255,0.3)] hover:shadow-[0_15px_50px_rgba(0,71,255,0.4)] transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine" />
            <span className="relative flex items-center gap-2 text-lg">
              {t('ctaStart')} <Zap size={20} fill="currentColor" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const UseCaseSection = () => {
  return (
    <section id="use-case" className="py-24 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
                <div className="inline-block px-3 py-1 bg-blue-50 text-vuca-blue text-xs font-bold rounded-full mb-6">Built-in tools</div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-vuca-navy mb-4">Everything you need to create</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Explore Vuca's main creation tools: simple, fast, and ready for scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 grid-rows-[auto_auto]">
                
                {/* Talking Actors */}
                <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group h-[340px]">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                             <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-vuca-blue mb-4">
                                 <Mic size={24} />
                             </div>
                             <h3 className="text-2xl font-bold text-vuca-navy mb-2">Talking Actors</h3>
                             <p className="text-gray-500 text-sm max-w-xs">Realistic AI actors perform your script with natural expression and voice.</p>
                        </div>
                    </div>
                     <div className="absolute top-8 right-[-20px] w-48 h-64 bg-gray-100 rounded-xl transform rotate-6 border border-gray-200 overflow-hidden shadow-lg group-hover:rotate-0 transition-transform duration-500">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80" alt="Actor" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* B-roll */}
                <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group h-[340px]">
                     <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                             <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
                                 <Film size={24} />
                             </div>
                             <h3 className="text-2xl font-bold text-vuca-navy mb-2">Smart B-roll</h3>
                             <p className="text-gray-500 text-sm max-w-xs">Generate cinematic background footage or motion scenes that match your story.</p>
                         </div>
                     </div>
                     <div className="absolute top-10 right-10 w-40 h-40 bg-gray-100 rounded-2xl transform rotate-[-12deg] border border-gray-200 overflow-hidden shadow-lg group-hover:rotate-0 transition-transform duration-500">
                         <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&q=80" alt="B-roll" className="w-full h-full object-cover" />
                     </div>
                </div>

                {/* Custom AI Avatar */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group h-[400px]">
                     <div className="relative z-10">
                         <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                             <ScanFace size={24} />
                         </div>
                         <h3 className="text-xl font-bold text-vuca-navy mb-2">Custom AI Avatar</h3>
                         <p className="text-gray-500 text-sm mb-6">Bring lifelike digital avatars into your videos — fully customizable and brand-ready.</p>
                     </div>
                     <div className="absolute bottom-[-20px] right-[-20px] left-[-20px]">
                          <div className="grid grid-cols-2 gap-2 p-6">
                              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" className="rounded-xl border border-white shadow-sm transform translate-y-4" alt="Avatar 1" />
                              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" className="rounded-xl border border-white shadow-sm transform -translate-y-4" alt="Avatar 2" />
                          </div>
                     </div>
                </div>

                {/* Product in Hand */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group h-[400px]">
                     <div className="relative z-10">
                         <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                             <Box size={24} />
                         </div>
                         <h3 className="text-xl font-bold text-vuca-navy mb-2">Product in Hand</h3>
                         <p className="text-gray-500 text-sm mb-6">Turn one image into a realistic demo where the creator naturally holds your product.</p>
                     </div>
                     <div className="absolute bottom-0 right-0 w-3/4 h-1/2">
                          <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&q=80" className="w-full h-full object-cover rounded-tl-2xl border-t border-l border-gray-100" alt="Product Demo" />
                     </div>
                </div>

                {/* Gestures */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group h-[400px]">
                     <div className="relative z-10">
                         <div className="flex items-center gap-2 mb-4">
                             <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                                 <HandMetal size={24} />
                             </div>
                             <span className="bg-vuca-blue text-white text-[10px] font-bold px-2 py-1 rounded-full">NEW</span>
                         </div>
                         <h3 className="text-xl font-bold text-vuca-navy mb-2">Gestures</h3>
                         <p className="text-gray-500 text-sm mb-6">Add expressive body and face movements that make it feel human and dynamic.</p>
                     </div>
                     <div className="absolute bottom-0 right-0 left-0 h-1/2 overflow-hidden flex justify-center items-end">
                         <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" className="h-full object-cover w-full opacity-80" alt="Gestures" />
                     </div>
                </div>

            </div>
        </div>
    </section>
  );
};

const SolutionSection = () => {
    const { t } = useAppContext();
    
    // Updated data to look like mobile screenshots / templates gallery
    const viralTemplates = [
        { id: 1, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80', title: "Politeness Check", type: "Quiz", views: '2.4M', badge: "Trending" },
        { id: 2, img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80', title: "Tinder Dating App", type: "App Demo", views: '850K', badge: "New" },
        { id: 3, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', title: "Viral Reaction", type: "Reaction", views: '1.1M', badge: "Popular" },
        { id: 4, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80', title: "Unboxing Tech", type: "Unboxing", views: '3.2M', badge: "Hot" },
        { id: 5, img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80', title: "Daily Routine", type: "Vlog", views: '500K', badge: "Classic" },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden relative border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 text-center mb-12 relative z-20">
                 <h2 className="text-3xl md:text-5xl font-heading font-bold text-vuca-navy mb-6 animate-fade-in-up">
                    Viral Video Templates
                 </h2>
                 <p className="text-gray-500 max-w-2xl mx-auto text-lg animate-fade-in-up animation-delay-200">
                    High-performing templates modeled after viral hits. Select one, customize, and go viral.
                 </p>
            </div>
            
            <div className="relative w-full py-10">
                {/* Marquee Container */}
                <div className="flex gap-8 animate-marquee w-max hover:pause px-4">
                    {[...viralTemplates, ...viralTemplates].map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="relative w-[300px] h-[550px] rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl flex-shrink-0 group transform transition-all duration-300 border-[8px] border-white ring-1 ring-gray-200">
                             
                             {/* Background Image */}
                             <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                             
                             {/* Gradient Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
                             
                             {/* UI Header */}
                             <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-20">
                                 <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                                     <div className="w-6 h-6 rounded-full overflow-hidden bg-white">
                                         <img src={`https://api.dicebear.com/7.x/icons/svg?seed=${item.type}`} alt="icon" />
                                     </div>
                                     <span className="text-xs font-bold text-white tracking-wide">{item.title}</span>
                                 </div>
                                 {item.badge && (
                                     <span className="bg-vuca-blue text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">{item.badge}</span>
                                 )}
                             </div>

                             {/* Playback Progress Bar (Simulated Video) */}
                             <div className="absolute top-2 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden z-30">
                                <div className="h-full bg-white animate-progress origin-left"></div>
                             </div>

                             {/* Center Play Button (On Hover) */}
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform">
                                     <Play size={32} fill="white" className="text-white ml-1" />
                                 </div>
                             </div>

                             {/* Right Side Interaction Bar */}
                             <div className="absolute right-4 bottom-24 flex flex-col gap-5 items-center z-20">
                                 <div className="flex flex-col items-center gap-1">
                                     <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer">
                                         <Heart size={20} fill="white" className="text-white" />
                                     </div>
                                     <span className="text-white text-[10px] font-bold">{item.views}</span>
                                 </div>
                                 <div className="flex flex-col items-center gap-1">
                                     <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                                         <MessageCircle size={20} fill="white" className="text-white" />
                                     </div>
                                     <span className="text-white text-[10px] font-bold">1.2k</span>
                                 </div>
                                 <div className="flex flex-col items-center gap-1">
                                     <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                                         <Share2 size={20} fill="white" className="text-white" />
                                     </div>
                                     <span className="text-white text-[10px] font-bold">Share</span>
                                 </div>
                             </div>

                             {/* Bottom Caption */}
                             <div className="absolute bottom-0 left-0 w-full p-5 pb-8 z-20">
                                <p className="text-white font-medium text-sm leading-snug drop-shadow-md pr-12 line-clamp-2">
                                    {item.title} template generated with #VucaAI. Create yours in seconds! 🚀
                                </p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const HomePricing = () => {
  const { t } = useAppContext();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
      {
          id: 'basic',
          name: 'Basic',
          price: billingCycle === 'monthly' ? 23 : 18,
          features: ['15 Videos / Month', '720p Export', 'Basic Templates', 'Standard Support', 'Personal License'],
          cta: 'Select Basic',
          highlight: false
      },
      {
          id: 'pro',
          name: 'Pro',
          price: billingCycle === 'monthly' ? 49 : 39,
          features: ['40 Videos / Month', '1080p Export', 'No Watermark', 'Premium Templates', 'Commercial License', 'Priority Support'],
          cta: 'Select Pro',
          highlight: true
      },
      {
          id: 'max',
          name: 'Max',
          price: 'Custom',
          features: ['Unlimited Videos', 'API Access', 'Dedicated Account Manager', 'Custom Branding', 'SLA Support', 'Team Access'],
          cta: 'Talk to Sales',
          highlight: false
      }
  ];

  const handleTalkToSales = () => {
      window.open('https://wa.me/6285157626264', '_blank');
  };

  return (
    <section id="pricing" className="py-24 bg-white relative">
        <AmbientBackground mode="pricing" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
                 <h2 className="text-3xl md:text-5xl font-heading font-bold text-vuca-navy mb-4">{t('pricingTitle')}</h2>
                 <p className="text-gray-500 text-lg max-w-xl mx-auto">{t('pricingSubtitle')}</p>
            </div>
            
            {/* Billing Toggle */}
            <div className="flex justify-center mb-16">
                <div className="bg-gray-100 p-1 rounded-full flex items-center relative">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${billingCycle === 'monthly' ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${billingCycle === 'yearly' ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500'}`}
                    >
                        Yearly
                    </button>
                    {billingCycle === 'yearly' && (
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                            SAVE 20%
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {plans.map((plan) => (
                     <div key={plan.id} className={`p-8 rounded-3xl border transition-all hover:-translate-y-2 relative flex flex-col ${plan.highlight ? 'bg-vuca-navy border-vuca-navy shadow-2xl scale-105 z-20 text-white' : 'bg-white border-gray-200 shadow-lg hover:shadow-xl text-vuca-navy'}`}>
                          {plan.highlight && (
                              <div className="absolute top-0 right-0 bg-vuca-blue text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                          )}
                          <div className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-vuca-navy'}`}>{plan.name}</div>
                          <div className={`text-4xl font-bold mb-6 ${plan.highlight ? 'text-white' : 'text-vuca-navy'}`}>
                              {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                              {typeof plan.price === 'number' && <span className={`text-sm font-normal ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>}
                          </div>
                          
                          <ul className="space-y-4 mb-8 flex-grow">
                              {plan.features.map((feature, idx) => (
                                  <li key={idx} className={`flex items-center gap-3 ${plan.highlight ? 'text-gray-300' : 'text-gray-600'}`}>
                                      <CheckCircle className={plan.highlight ? 'text-vuca-yellow' : 'text-vuca-blue'} size={18} /> 
                                      <span className={feature.includes('Videos') ? 'font-bold' : ''}>{feature}</span>
                                  </li>
                              ))}
                          </ul>
                          
                          <button 
                            onClick={() => plan.id === 'max' && handleTalkToSales()}
                            className={`w-full py-3 rounded-xl font-bold transition-colors ${
                              plan.highlight 
                              ? 'bg-vuca-blue text-white hover:bg-blue-600 shadow-lg shadow-blue-900/50' 
                              : plan.id === 'max' 
                                ? 'bg-vuca-navy text-white hover:bg-gray-800' 
                                : 'border-2 border-vuca-blue text-vuca-blue hover:bg-vuca-blue hover:text-white'
                          }`}>
                              {plan.cta}
                          </button>
                     </div>
                 ))}
            </div>
        </div>
    </section>
  );
}

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    return (
        <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold text-vuca-navy text-center mb-12">FAQ</h2>
                <div className="space-y-4">
                    {FAQ_DATA.map((item, i) => (
                        <div key={i} className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-vuca-navy hover:text-vuca-blue transition-colors"
                            >
                                {item.q}
                                {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                            </button>
                            {openIndex === i && (
                                <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const Footer = () => {
    return (
        <footer className="border-t border-gray-100 py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="text-2xl font-heading font-bold text-vuca-navy">VUCA<span className="text-vuca-blue">.AI</span></div>
                 <div className="text-gray-500 text-sm">© 2024 Vuca AI. All rights reserved.</div>
                 <div className="flex gap-4">
                     <Twitter className="text-gray-400 hover:text-vuca-blue cursor-pointer" size={20} />
                     <Instagram className="text-gray-400 hover:text-vuca-blue cursor-pointer" size={20} />
                     <Youtube className="text-gray-400 hover:text-vuca-blue cursor-pointer" size={20} />
                 </div>
            </div>
        </footer>
    );
}

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const AuthPage = () => {
    const { login, t } = useAppContext();
    const [email, setEmail] = useState('');
    const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up as per request
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(email) login(email);
    };

    const handleGoogleLogin = () => {
        // Simulate Google Login
        login('user@gmail.com');
    }

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative">
             <AmbientBackground mode="subtle" />
             <div className="w-10 h-10 md:w-12 md:h-12 absolute top-6 left-6 flex items-center justify-center filter drop-shadow-md md:hidden">
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M25 25 L45 55 A 5 5 0 0 0 50 60 L 50 60 L 50 40 L 35 15 Z" fill="#0047FF" stroke="#0047FF" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M50 60 L 80 25" stroke="#FFD33C" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
             </div>
             <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
                 
                 {/* Toggle Switch */}
                 <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                     <button 
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        Login
                     </button>
                     <button 
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                     >
                        Sign Up
                     </button>
                 </div>

                 <div className="text-center mb-6">
                     <h2 className="text-2xl font-heading font-bold text-vuca-navy mb-2">
                         {isSignUp ? 'Create your account' : 'Welcome back'}
                     </h2>
                     <p className="text-gray-500 text-sm">
                         {isSignUp ? 'Get started with Vuca AI today.' : 'Enter your details to access your dashboard.'}
                     </p>
                 </div>
                 
                 {/* Google Login Button - Highlighted */}
                 <button 
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-blue-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-blue-50/50 transition-all mb-4 shadow-sm group relative overflow-hidden"
                 >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                     <GoogleIcon />
                     <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
                 </button>

                 <div className="relative my-6">
                     <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-gray-200"></div>
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                         <span className="bg-white px-2 text-gray-400 font-medium">Or continue with email</span>
                     </div>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                         <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-vuca-blue focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="name@work.com"
                            required
                         />
                     </div>
                     {isSignUp && (
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                             <input 
                                type="text" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-vuca-blue focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="John Doe"
                             />
                         </div>
                     )}
                     {!isSignUp && (
                         <div className="flex justify-end">
                             <a href="#" className="text-xs font-bold text-vuca-blue hover:underline">Forgot password?</a>
                         </div>
                     )}
                     <button type="submit" className="w-full bg-vuca-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                         {isSignUp ? 'Create Account' : 'Sign In'}
                     </button>
                 </form>
                 
                 <div className="mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto">
                     By continuing, you agree to our Terms of Service and Privacy Policy.
                 </div>
             </div>
        </div>
    );
}

const ProfilePage = () => {
    const { user, toggleSocialConnection } = useAppContext();
    return (
        <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-heading font-bold text-vuca-navy mb-8">Profile Settings</h1>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 mb-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-vuca-blue flex items-center justify-center text-white text-3xl font-bold ring-4 ring-blue-50">
                        {user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-vuca-navy">{user.email?.split('@')[0]}</h2>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-vuca-blue rounded-full text-xs font-bold uppercase">
                            {user.plan} Plan
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-vuca-navy mb-4 flex items-center gap-2">
                    <Share2 size={18} /> Connected Accounts
                </h3>
                <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white"><span className="font-bold">Tk</span></div>
                            <span className="font-medium text-gray-700">TikTok</span>
                        </div>
                        <button 
                            onClick={() => toggleSocialConnection('tiktok')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${user.connectedAccounts.tiktok ? 'bg-red-100 text-red-600' : 'bg-vuca-blue text-white'}`}
                        >
                            {user.connectedAccounts.tiktok ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white"><Instagram size={20} /></div>
                            <span className="font-medium text-gray-700">Instagram</span>
                        </div>
                        <button 
                            onClick={() => toggleSocialConnection('instagram')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${user.connectedAccounts.instagram ? 'bg-red-100 text-red-600' : 'bg-vuca-blue text-white'}`}
                        >
                            {user.connectedAccounts.instagram ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                     <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><Facebook size={20} /></div>
                            <span className="font-medium text-gray-700">Facebook</span>
                        </div>
                        <button 
                            onClick={() => toggleSocialConnection('facebook')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${user.connectedAccounts.facebook ? 'bg-red-100 text-red-600' : 'bg-vuca-blue text-white'}`}
                        >
                            {user.connectedAccounts.facebook ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TemplateCard: React.FC<{ template: Template; onClick: () => void }> = ({ template, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer h-[320px]"
    >
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        <img 
            src={template.thumbnailUrl} 
            alt={template.title} 
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
        
        <div className="absolute top-3 left-3">
             <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                 {template.category}
             </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-transform">
                <Play size={24} fill="white" className="text-white ml-1" />
            </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <h3 className="text-white font-bold text-lg mb-1 leading-tight">{template.title}</h3>
            <div className="flex items-center justify-between text-gray-300 text-xs font-medium">
                <span className="flex items-center gap-1"><Smartphone size={12} /> {template.platform}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {template.duration}</span>
            </div>
        </div>
    </div>
);

const PricingModal = () => {
    const { showPricingModal, setShowPricingModal, upgradePlan } = useAppContext();
    if (!showPricingModal) return null;

    const handleSelect = (planId: string) => {
        if(planId === 'max') {
             window.open('https://wa.me/6285157626264', '_blank');
        } else {
            upgradePlan(planId as UserPlan);
            setShowPricingModal(false);
            alert(`Switched to ${planId.toUpperCase()} plan!`);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPricingModal(false)} />
            <div className="bg-white rounded-[2rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in-up shadow-2xl">
                 <button onClick={() => setShowPricingModal(false)} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                     <X size={20} />
                 </button>
                 
                 <div className="p-8 md:p-12 text-center">
                     <h2 className="text-3xl font-heading font-bold text-vuca-navy mb-4">Upgrade to Pro</h2>
                     <p className="text-gray-500 mb-12">Remove limits and generate viral videos instantly.</p>
                     
                     <div className="grid md:grid-cols-3 gap-6">
                         <div className="p-6 rounded-3xl border border-gray-200 bg-gray-50 text-left">
                             <div className="text-xl font-bold text-vuca-navy mb-2">Basic</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-6">$23<span className="text-sm font-normal text-gray-500">/mo</span></div>
                             <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> 15 Videos/mo</li>
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> 720p Export</li>
                             </ul>
                             <button onClick={() => handleSelect('basic')} className="w-full py-3 rounded-xl border-2 border-vuca-blue text-vuca-blue font-bold hover:bg-blue-50">Select Basic</button>
                         </div>
                         
                         <div className="p-6 rounded-3xl border-2 border-vuca-blue bg-white text-left relative shadow-xl transform scale-105">
                             <div className="absolute top-0 right-0 bg-vuca-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                             <div className="text-xl font-bold text-vuca-navy mb-2">Pro</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-6">$49<span className="text-sm font-normal text-gray-500">/mo</span></div>
                             <ul className="space-y-3 mb-8 text-sm text-gray-600 font-medium">
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> 40 Videos/mo</li>
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> 1080p Export</li>
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> No Watermark</li>
                             </ul>
                             <button onClick={() => handleSelect('pro')} className="w-full py-3 rounded-xl bg-vuca-blue text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30">Upgrade Now</button>
                         </div>
                         
                         <div className="p-6 rounded-3xl border border-gray-200 bg-gray-50 text-left">
                             <div className="text-xl font-bold text-vuca-navy mb-2">Max</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-6">Custom</div>
                             <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> Unlimited Videos</li>
                                 <li className="flex gap-2"><Check size={16} className="text-vuca-blue" /> API Access</li>
                             </ul>
                             <button onClick={() => handleSelect('max')} className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100">Contact Sales</button>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
         <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
             <img src={project.thumbnailUrl} alt={project.templateTitle} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40 mr-2">
                     <Play size={20} fill="white" />
                 </button>
                 <button className="p-3 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40">
                     <Share2 size={20} />
                 </button>
             </div>
             <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded">
                 {project.platform}
             </div>
         </div>
         <div className="p-3">
             <h4 className="font-bold text-vuca-navy truncate">{project.templateTitle}</h4>
             <p className="text-xs text-gray-500 mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
         </div>
    </div>
);

const OnboardingModal = () => {
    const { user, completeOnboarding, toggleSocialConnection } = useAppContext();
    
    // Only show if logged in AND has NOT onboarded
    if (!user.isLoggedIn || user.hasOnboarded) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
             <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 relative z-20 animate-fade-in-up shadow-2xl">
                 <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-blue-100 text-vuca-blue rounded-full flex items-center justify-center mx-auto mb-4">
                         <Share2 size={32} />
                     </div>
                     <h2 className="text-2xl font-bold text-vuca-navy mb-2">Connect Your Socials</h2>
                     <p className="text-gray-500">Connect your accounts to publish content directly.</p>
                 </div>

                 <div className="space-y-4 mb-8">
                      <button 
                          onClick={() => toggleSocialConnection('tiktok')}
                          className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${user.connectedAccounts.tiktok ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                          <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">Tk</div>
                               <span className="font-bold text-gray-800">TikTok</span>
                          </div>
                          {user.connectedAccounts.tiktok ? <CheckCircle className="text-green-500" /> : <span className="text-sm font-bold text-vuca-blue">Connect</span>}
                      </button>

                      <button 
                          onClick={() => toggleSocialConnection('instagram')}
                          className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${user.connectedAccounts.instagram ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                          <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white"><Instagram size={16} /></div>
                               <span className="font-bold text-gray-800">Instagram</span>
                          </div>
                          {user.connectedAccounts.instagram ? <CheckCircle className="text-green-500" /> : <span className="text-sm font-bold text-vuca-blue">Connect</span>}
                      </button>
                 </div>

                 <button 
                    onClick={completeOnboarding}
                    className="w-full py-3.5 bg-vuca-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                 >
                     Continue to Dashboard
                 </button>
                 <button 
                    onClick={completeOnboarding}
                    className="w-full py-3 text-gray-400 font-bold text-sm mt-2 hover:text-gray-600"
                 >
                     Skip for now
                 </button>
             </div>
        </div>
    );
};

const ProductAnalyzer = ({ onRecommend }: { onRecommend: (category: string) => void }) => {
    const [description, setDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if(!description) return;
        setIsAnalyzing(true);
        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                // Fallback analysis if API Key is missing for seamless UX
                setTimeout(() => {
                    const desc = description.toLowerCase();
                    let cat = 'Tech';
                    if (desc.includes('dress') || desc.includes('shirt') || desc.includes('wear')) cat = 'Fashion';
                    else if (desc.includes('food') || desc.includes('eat') || desc.includes('drink')) cat = 'Food';
                    else if (desc.includes('skin') || desc.includes('face') || desc.includes('makeup')) cat = 'Beauty';
                    onRecommend(cat);
                    setIsAnalyzing(false);
                }, 1000);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Analyze this product description: "${description}". 
            Recommend the SINGLE best video category from this list: [Fashion, Tech, Food, Beauty, Home, Fitness, Gaming]. 
            Return ONLY the category name.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            const category = response.text?.trim();
            if(category) {
                 const validCategories = ['Fashion', 'Tech', 'Food', 'Beauty', 'Home', 'Fitness', 'Gaming'];
                 const match = validCategories.find(c => category.includes(c)) || 'Fashion';
                 onRecommend(match);
            }
        } catch (e) {
            console.error(e);
            // Fallback
            onRecommend('Tech');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-vuca-navy to-blue-900 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-4">
                     <Sparkles className="text-vuca-yellow animate-pulse" size={20} />
                     <h3 className="font-bold text-lg">AI Template Recommender</h3>
                 </div>
                 <p className="text-gray-300 mb-6 max-w-xl">Tell us about your product, and we'll instantly find the highest converting templates for your niche.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                     <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. A fast charging power bank for travelers..."
                        className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-all"
                     />
                     <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !description}
                        className="bg-vuca-blue hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/50 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                     >
                        {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                        Find Best Templates
                     </button>
                 </div>
             </div>
        </div>
    );
};

const Editor = ({ templateId, onBack }: { templateId: string, onBack: () => void }) => {
    const { t, setShowPricingModal, addProject } = useAppContext();
    const template = MOCK_TEMPLATES.find(t => t.id === templateId) || MOCK_TEMPLATES[0];
    
    const [step, setStep] = useState(1);
    const [productUrl, setProductUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [script, setScript] = useState('');
    
    // Step 2 State
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [customAvatar, setCustomAvatar] = useState<string | null>(null);
    const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [hasSubtitles, setHasSubtitles] = useState(true);
    const [visualMode, setVisualMode] = useState<'upload' | 'avatar'>('upload');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'script' | 'visual' | 'audio'>('visual');

    // Step 3 (Generation)
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [generationProgress, setGenerationProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const MOCK_SCRIPT = `[Hook]: Stop scrolling! Check this out.
[Value]: This is the ultimate solution for your daily needs.
[CTA]: Click the link to grab yours now!`;

    const handleGenerateScript = async () => {
        if (!productUrl) return;
        setIsGenerating(true);
        
        try {
            const apiKey = getApiKey();
            if (!apiKey) {
                // FALLBACK MODE
                setTimeout(() => {
                    setScript(MOCK_SCRIPT);
                    setStep(2);
                    setIsGenerating(false);
                    alert("Demo Mode: Using placeholder script (API Key missing).");
                }, 1500);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `Create a viral short video script (Hook, Value, CTA) for a product described as: ${productUrl}. 
            The template style is ${template.title}. Keep it under ${template.duration}. 
            Language: English. Format:
            [Scene 1]: Visual - Audio
            [Scene 2]: Visual - Audio`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const text = response.text;
            
            if (text) {
                setScript(text);
                setStep(2);
            } else {
                 throw new Error("Empty response");
            }
        } catch (error: any) {
            console.error("Generation Error:", error);
            // Fallback on error to ensure user flow isn't blocked
            setScript(MOCK_SCRIPT);
            setStep(2);
            alert("Switched to Demo Script due to API connection issue.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            files.slice(0, 5 - uploadedImages.length).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setUploadedImages(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
            setVisualMode('upload');
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomAvatar(reader.result as string);
                setSelectedAvatar('custom'); // select the new custom avatar
            };
            reader.readAsDataURL(file);
        }
    }

    const handleGenerateAudio = async () => {
        const apiKey = getApiKey();
        if (!apiKey) {
             setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); 
             return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: script.substring(0, 200) || "Hello! This is a test." }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: selectedVoice }
                        }
                    }
                }
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const binaryString = window.atob(base64Audio);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: 'audio/mp3' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            } else {
                throw new Error("No audio data");
            }
        } catch (e) {
            console.error("TTS Error", e);
            setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Fallback
        }
    };

    const handleGenerateVideo = async () => {
         setIsGenerating(true);
         setStep(3);
         
         // Robust simulation of video processing steps
         let progress = 0;
         const interval = setInterval(() => {
             progress += Math.random() * 10;
             if (progress > 100) progress = 100;
             setGenerationProgress(Math.floor(progress));
             
             if(progress >= 100) {
                 clearInterval(interval);
                 setIsGenerating(false);
                 setGeneratedVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
                 
                 // Save to Projects
                 addProject({
                     id: Date.now().toString(),
                     templateId: template.id,
                     templateTitle: template.title,
                     videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                     thumbnailUrl: uploadedImages[0] || template.thumbnailUrl,
                     createdAt: new Date(),
                     platform: template.platform
                 });
             }
         }, 400);
    };

    const handleExport = () => {
        setShowPricingModal(true);
    };

    return (
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto h-screen flex flex-col">
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {step} of 3</div>
              <h1 className="text-2xl font-heading font-bold text-vuca-navy">Create Video</h1>
          </div>
        </div>

        <div className="flex-grow grid lg:grid-cols-12 gap-8 h-full min-h-0">
           {/* Left Panel - Controls */}
           <div className="lg:col-span-7 flex flex-col h-full overflow-y-auto pr-2 scrollbar-hide">
              
              {/* Step 1: Script */}
              {step === 1 && (
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg animate-fade-in-up">
                      <h2 className="text-xl font-bold text-vuca-navy mb-4">Product Details</h2>
                      <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">What are you promoting?</label>
                          <textarea 
                             className="w-full h-40 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-vuca-blue focus:border-vuca-blue transition-all resize-none"
                             placeholder="Paste your product URL or describe the product features, benefits, and target audience..."
                             value={productUrl}
                             onChange={(e) => setProductUrl(e.target.value)}
                          />
                          <button 
                             onClick={handleGenerateScript}
                             disabled={isGenerating || !productUrl}
                             className="w-full bg-vuca-blue text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                          >
                              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                              Generate Script with AI
                          </button>
                      </div>
                  </div>
              )}

              {/* Step 2: Customization */}
              {step === 2 && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-lg flex flex-col h-full overflow-hidden animate-fade-in-up">
                      {/* Tabs */}
                      <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
                          <button 
                            onClick={() => setActiveTab('visual')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'visual' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                          >
                             <ImageIcon size={16} /> Visuals
                          </button>
                          <button 
                            onClick={() => setActiveTab('audio')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'audio' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                          >
                             <Mic size={16} /> Audio
                          </button>
                          <button 
                            onClick={() => setActiveTab('script')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'script' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                          >
                             <Type size={16} /> Script
                          </button>
                      </div>

                      <div className="p-6 overflow-y-auto flex-grow">
                          {activeTab === 'visual' && (
                              <div className="space-y-6">
                                  <div className="flex gap-4">
                                      <button 
                                        onClick={() => setVisualMode('upload')}
                                        className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${visualMode === 'upload' ? 'border-vuca-blue bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                                      >
                                          <div className="font-bold text-gray-900 mb-1">Product Photos</div>
                                          <div className="text-xs text-gray-500">Upload your own assets</div>
                                      </button>
                                      <button 
                                        onClick={() => setVisualMode('avatar')}
                                        className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${visualMode === 'avatar' ? 'border-vuca-blue bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                                      >
                                          <div className="font-bold text-gray-900 mb-1">AI Avatar</div>
                                          <div className="text-xs text-gray-500">Use a digital presenter</div>
                                      </button>
                                  </div>

                                  {visualMode === 'upload' ? (
                                      <div className="space-y-4">
                                          <div 
                                            onClick={() => uploadedImages.length < 5 && fileInputRef.current?.click()}
                                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${uploadedImages.length >= 5 ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50' : 'border-gray-200 cursor-pointer hover:bg-gray-50'}`}
                                          >
                                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                                              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-vuca-blue mb-4">
                                                  <Upload size={24} />
                                              </div>
                                              <h3 className="font-bold text-gray-900">Click to upload images</h3>
                                              <p className="text-xs text-gray-500 mt-1">Up to 5 photos (JPG, PNG)</p>
                                          </div>
                                          
                                          {uploadedImages.length > 0 && (
                                              <div className="grid grid-cols-5 gap-2">
                                                  {uploadedImages.map((img, idx) => (
                                                      <div key={idx} className="relative group w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                          <img src={img} className="w-full h-full object-cover" />
                                                          <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                                                            }} 
                                                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                                                          >
                                                              <Trash2 size={16} />
                                                          </button>
                                                      </div>
                                                  ))}
                                              </div>
                                          )}
                                      </div>
                                  ) : (
                                      <div className="grid grid-cols-2 gap-4">
                                          {/* Custom Avatar Upload Card */}
                                          <div 
                                              onClick={() => avatarInputRef.current?.click()}
                                              className={`relative rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 hover:border-vuca-blue hover:bg-blue-50 transition-all h-48 flex flex-col items-center justify-center ${selectedAvatar === 'custom' ? 'border-vuca-blue bg-blue-50' : ''}`}
                                          >
                                              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                              {customAvatar ? (
                                                  <>
                                                    <img src={customAvatar} className="w-full h-full object-cover absolute inset-0" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 transition-opacity">Change</div>
                                                  </>
                                              ) : (
                                                  <>
                                                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-vuca-blue mb-2"><Upload size={18} /></div>
                                                    <span className="text-sm font-bold text-gray-600">Upload Custom</span>
                                                  </>
                                              )}
                                              {customAvatar && selectedAvatar === 'custom' && (
                                                  <div className="absolute top-2 right-2 bg-vuca-blue text-white p-1 rounded-full"><Check size={12} /></div>
                                              )}
                                          </div>

                                          {AVATARS.map(avatar => (
                                              <div 
                                                key={avatar.id}
                                                onClick={() => setSelectedAvatar(avatar.id)}
                                                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-48 ${selectedAvatar === avatar.id ? 'border-vuca-blue ring-2 ring-blue-100' : 'border-transparent'}`}
                                              >
                                                  <img src={avatar.url} className="w-full h-full object-cover" />
                                                  <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2 text-white text-xs font-bold backdrop-blur-sm">
                                                      {avatar.name}
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          )}

                          {activeTab === 'audio' && (
                              <div className="space-y-6">
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-2">AI Voice</label>
                                      <div className="grid gap-2">
                                          {VOICES.map(voice => (
                                              <div 
                                                key={voice.id}
                                                onClick={() => setSelectedVoice(voice.id)}
                                                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedVoice === voice.id ? 'border-vuca-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                              >
                                                  <div className="flex items-center gap-3">
                                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedVoice === voice.id ? 'bg-vuca-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                          <Play size={16} fill="currentColor" />
                                                      </div>
                                                      <div>
                                                          <div className="font-bold text-sm text-gray-900">{voice.name}</div>
                                                          <div className="text-xs text-gray-500">English • Natural</div>
                                                      </div>
                                                  </div>
                                                  {selectedVoice === voice.id && <CheckCircle size={20} className="text-vuca-blue" />}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                      <span className="text-sm font-bold text-gray-700">Generate Subtitles</span>
                                      <button 
                                        onClick={() => setHasSubtitles(!hasSubtitles)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${hasSubtitles ? 'bg-vuca-blue' : 'bg-gray-300'}`}
                                      >
                                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${hasSubtitles ? 'left-7' : 'left-1'}`} />
                                      </button>
                                  </div>

                                  <button onClick={handleGenerateAudio} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800">
                                      Generate Audio Preview
                                  </button>
                                  {audioUrl && (
                                      <div className="bg-green-50 text-green-700 p-3 rounded-lg text-xs font-bold flex items-center gap-2 mt-2">
                                          <div className="flex items-center gap-2 w-full">
                                            <Check size={14} /> 
                                            <span>Ready to play</span>
                                            <audio controls src={audioUrl} className="h-8 ml-auto w-32" />
                                          </div>
                                      </div>
                                  )}
                              </div>
                          )}

                          {activeTab === 'script' && (
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-2">Edit Script</label>
                                  <textarea 
                                      value={script}
                                      onChange={(e) => setScript(e.target.value)}
                                      className="w-full h-80 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm leading-relaxed focus:ring-2 focus:ring-vuca-blue focus:border-vuca-blue"
                                  />
                              </div>
                          )}
                      </div>

                      <div className="p-6 border-t border-gray-100 bg-white">
                          <button 
                            onClick={handleGenerateVideo}
                            className="w-full bg-vuca-blue text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                          >
                              <Video size={20} /> Generate Video
                          </button>
                      </div>
                  </div>
              )}

              {/* Step 3: Loading / Result */}
              {step === 3 && (
                   <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 flex flex-col items-center justify-center text-center h-full animate-fade-in-up">
                       {isGenerating ? (
                           <div className="space-y-6 w-full max-w-sm">
                               <div className="relative w-24 h-24 mx-auto">
                                   <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                   <div className="absolute inset-0 border-4 border-vuca-blue rounded-full border-t-transparent animate-spin"></div>
                               </div>
                               <div>
                                   <h2 className="text-2xl font-bold text-vuca-navy mb-2">Creating Magic...</h2>
                                   <p className="text-gray-500">Synthesizing visuals, audio, and subtitles.</p>
                                   <div className="mt-2 text-xs font-bold text-vuca-blue uppercase">
                                       {generationProgress < 30 ? 'Analyzing Script' : generationProgress < 60 ? 'Generating Voiceover' : 'Rendering Video'}
                                   </div>
                               </div>
                               <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                   <div className="h-full bg-vuca-blue transition-all duration-300" style={{ width: `${generationProgress}%` }}></div>
                               </div>
                           </div>
                       ) : (
                           <div className="space-y-6 w-full max-w-md">
                               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto animate-bounce">
                                   <Check size={40} />
                               </div>
                               <h2 className="text-3xl font-bold text-vuca-navy">Video Ready!</h2>
                               <p className="text-gray-500">Your viral video has been generated and saved to your projects.</p>
                               
                               <div className="grid grid-cols-2 gap-4 pt-6">
                                   <button 
                                     onClick={handleExport}
                                     className="py-3 px-6 bg-vuca-blue text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:bg-blue-600"
                                   >
                                       <Download size={18} /> Export Video
                                   </button>
                                   <button 
                                     onClick={() => {
                                         // Share Logic
                                         alert("Opening share dialog...");
                                     }}
                                     className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2"
                                   >
                                       <Share2 size={18} /> Share
                                   </button>
                               </div>
                           </div>
                       )}
                   </div>
              )}

           </div>

           {/* Right Panel - Preview */}
           <div className="lg:col-span-5 hidden lg:block h-full">
               <div className="sticky top-6">
                   <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative aspect-[9/16] max-h-[80vh] mx-auto">
                       {/* Preview Content */}
                       {step === 3 && generatedVideoUrl ? (
                           <video src={generatedVideoUrl} controls autoPlay className="w-full h-full object-cover" />
                       ) : (
                           <>
                               {visualMode === 'upload' && uploadedImages.length > 0 ? (
                                   // Mock Slideshow effect for multiple images
                                   <div className="relative w-full h-full">
                                       <img 
                                           src={uploadedImages[0]} 
                                           className="w-full h-full object-cover opacity-90"
                                           alt="Preview"
                                       />
                                       {uploadedImages.length > 1 && (
                                           <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                                               + {uploadedImages.length - 1} more
                                           </div>
                                       )}
                                   </div>
                               ) : visualMode === 'avatar' && (selectedAvatar || customAvatar) ? (
                                    <img 
                                        src={selectedAvatar === 'custom' && customAvatar ? customAvatar : AVATARS.find(a => a.id === selectedAvatar)?.url}
                                        className="w-full h-full object-cover opacity-90"
                                        alt="Avatar Preview"
                                    />
                               ) : (
                                    <img 
                                        src={template.thumbnailUrl} 
                                        className="w-full h-full object-cover opacity-90"
                                        alt="Template Preview"
                                    />
                               )}
                               
                               {/* UI Overlay */}
                               <div className="absolute top-6 right-4 flex flex-col gap-3">
                                   <div className="w-10 h-10 bg-black/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                                       <Globe size={20} />
                                   </div>
                               </div>

                               {hasSubtitles && script && (
                                   <div className="absolute bottom-32 left-8 right-8 text-center">
                                       <span className="inline-block bg-black/60 backdrop-blur-sm text-white font-bold text-lg px-4 py-2 rounded-xl shadow-lg leading-snug">
                                           {script.substring(0, 50)}...
                                       </span>
                                   </div>
                               )}

                               {/* Progress Bar Mock */}
                               <div className="absolute bottom-20 left-6 right-6 h-1 bg-white/30 rounded-full">
                                   <div className="w-1/3 h-full bg-white rounded-full"></div>
                               </div>

                               <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white"></div>
                                   <div className="h-2 w-24 bg-gray-200/50 rounded-full"></div>
                               </div>
                           </>
                       )}
                   </div>
               </div>
           </div>
        </div>
      </div>
    );
}

const Dashboard = () => {
    const { t, projects } = useAppContext();
    const [filter, setFilter] = useState('All');
    const [view, setView] = useState<'templates' | 'projects'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    if (selectedTemplate) {
        return <Editor templateId={selectedTemplate} onBack={() => setSelectedTemplate(null)} />;
    }

    const filteredTemplates = filter === 'All' 
        ? MOCK_TEMPLATES 
        : MOCK_TEMPLATES.filter(t => t.category === filter);

    return (
        <div className="min-h-screen pt-24 px-4 bg-gray-50/30">
            <AmbientBackground mode="dashboard" />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-vuca-navy">{t('dashboardTitle')}</h1>
                        <p className="text-gray-500">Welcome back, Creator. Ready to go viral?</p>
                    </div>
                    
                    <div className="bg-gray-100 p-1 rounded-xl flex gap-1 self-start">
                        <button 
                            onClick={() => setView('templates')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'templates' ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Explore Templates
                        </button>
                        <button 
                            onClick={() => setView('projects')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'projects' ? 'bg-white text-vuca-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            My Projects
                        </button>
                    </div>
                </div>

                {view === 'templates' ? (
                    <>
                        {/* AI Product Analyzer Section */}
                        <ProductAnalyzer onRecommend={(category) => setFilter(category)} />

                        {/* Search & Filter */}
                        <div className="relative z-20 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-vuca-blue focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                {['All', 'Fashion', 'Tech', 'Food', 'Beauty', 'Gaming'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${filter === cat ? 'bg-vuca-navy text-white border-vuca-navy' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                            {filteredTemplates.map(template => (
                                <TemplateCard 
                                    key={template.id} 
                                    template={template} 
                                    onClick={() => setSelectedTemplate(template.id)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 pb-20">
                        {projects.length > 0 ? (
                            projects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Film size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No projects yet</h3>
                                <p className="text-gray-500 mb-6">Create your first video from templates.</p>
                                <button onClick={() => setView('templates')} className="text-vuca-blue font-bold hover:underline">Browse Templates</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
  const [view, setView] = useState('landing'); // landing, auth, dashboard, profile
  
  // App State
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<UserState>({ 
      isLoggedIn: false, 
      email: null, 
      plan: 'free',
      connectedAccounts: { instagram: false, tiktok: false, facebook: false, youtube: false },
      hasOnboarded: false
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  const login = (email: string) => {
      // Logic for demo: reset onboarding on login to demonstrate feature
      setUser({ ...user, isLoggedIn: true, email, plan: 'basic', hasOnboarded: false });
      setView('dashboard');
  };

  const logout = () => {
      setUser({ ...user, isLoggedIn: false, email: null });
      setView('landing');
  };

  const upgradePlan = (plan: UserPlan) => {
      setUser(prev => ({ ...prev, plan }));
  };

  const toggleSocialConnection = (platform: keyof ConnectedAccounts) => {
      setUser(prev => ({
          ...prev,
          connectedAccounts: {
              ...prev.connectedAccounts,
              [platform]: !prev.connectedAccounts[platform]
          }
      }));
  };

  const completeOnboarding = () => {
      setUser(prev => ({ ...prev, hasOnboarded: true }));
  };
  
  const addProject = (p: Project) => {
      setProjects(prev => [p, ...prev]);
  };

  // Scroll to top on view change
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [view]);

  return (
    <AppContext.Provider value={{ lang, setLang, t, user, login, logout, upgradePlan, toggleSocialConnection, completeOnboarding, showPricingModal, setShowPricingModal, projects, addProject }}>
      <div className="min-h-screen bg-white text-vuca-navy font-sans selection:bg-vuca-blue selection:text-white">
        
        {/* Navbar Logic: Show minimal navbar for Auth/Dashboard/Profile, Full for Landing */}
        <Navbar onViewChange={setView} />
        
        <main>
          {view === 'landing' && (
            <>
              <Hero onStart={() => setView('auth')} />
              <SolutionSection /> {/* Viral Templates Marquee */}
              <UseCaseSection /> {/* Built-in Tools */}
              <HomePricing />
              <FAQ />
              <Footer />
            </>
          )}
          
          {view === 'auth' && <AuthPage />}
          
          {view === 'dashboard' && <Dashboard />}
          
          {view === 'profile' && <ProfilePage />}
        </main>

        <PricingModal />
        <OnboardingModal />
        <WhatsAppFloat />
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);