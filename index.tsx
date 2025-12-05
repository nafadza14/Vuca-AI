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
  PhoneCall
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
  navUseCase: { en: "Use Case", id: "Kegunaan" },
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
    connectedAccounts: { instagram: false, tiktok: false, facebook: false, youtube: false } 
  },
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
  toggleSocialConnection: () => {},
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
    <section id="use-case" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
           <h2 className="text-3xl md:text-4xl font-heading font-bold text-vuca-navy mb-4">From Photos to Viral Video</h2>
           <p className="text-gray-500 text-lg max-w-2xl mx-auto">Create high-converting UGC content without filming a single second.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start relative">
           {/* Connecting Line */}
           <div className="hidden md:block absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-vuca-blue/20 to-gray-100 -z-10"></div>

           {/* Step 1 */}
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm relative">
                  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80" alt="Script Writing" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 bg-vuca-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">1</div>
              </div>
              <h3 className="text-xl font-bold text-vuca-navy mb-3">Choose Template, AI Script</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Select from our viral library and let our AI generate a high-converting Hook-Value-CTA script for your product.</p>
           </div>

           {/* Step 2 */}
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm relative">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80" alt="Upload Photos" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 bg-vuca-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">2</div>
              </div>
              <h3 className="text-xl font-bold text-vuca-navy mb-3">Upload Photos & Customize</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Upload your product photos, choose a template model (or upload your own), and select a professional AI voice.</p>
           </div>

           {/* Step 3 */}
           <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col">
              <div className="w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm relative">
                   <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80" alt="Video Generated" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                           <Play fill="white" size={20} />
                       </div>
                   </div>
                   <div className="absolute top-2 left-2 bg-vuca-yellow text-vuca-navy w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">3</div>
              </div>
              <h3 className="text-xl font-bold text-vuca-navy mb-3">Video Generated</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Get a fully edited video with dynamic captions and effects, ready to go viral on TikTok, Reels, or Facebook.</p>
           </div>
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
    const { t } = useAppContext();
    const viralResults = [
        { id: 1, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', views: '2.4M', platform: 'TikTok' },
        { id: 2, img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80', views: '850K', platform: 'Facebook' },
        { id: 3, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80', views: '1.1M', platform: 'Instagram' },
        { id: 4, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', views: '3.2M', platform: 'TikTok' },
        { id: 5, img: 'https://images.unsplash.com/photo-1593341646261-fa50669169a6?w=400&q=80', views: '500K', platform: 'Instagram' },
        { id: 6, img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', views: '1.5M', platform: 'Facebook' },
    ];

    const marqueeItems = [...viralResults, ...viralResults];

    return (
        <section className="py-24 bg-gray-50/50 overflow-hidden relative border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 text-center mb-12 relative z-20">
                 <h2 className="text-3xl md:text-5xl font-heading font-bold text-vuca-navy mb-6 animate-fade-in-up">
                    Viral Results Across Platforms
                 </h2>
                 <p className="text-gray-500 max-w-2xl mx-auto text-lg animate-fade-in-up animation-delay-200">
                    See what creators are generating with Vuca AI. Our videos are optimized for maximum engagement.
                 </p>
            </div>
            
            <div className="relative w-full py-10">
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none"></div>

                <div className="flex gap-6 animate-marquee w-max hover:pause">
                    {marqueeItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="relative w-[200px] h-[350px] md:w-[240px] md:h-[420px] rounded-2xl overflow-hidden bg-white shadow-xl flex-shrink-0 group transform transition-all duration-300 border border-gray-100">
                             <img src={item.img} alt="Viral Content" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                             
                             {/* Playback Simulation - Progress Bar */}
                             <div className="absolute bottom-1 left-2 right-2 h-1 bg-white/30 rounded-full overflow-hidden z-30">
                                <div className="h-full bg-white animate-progress origin-left"></div>
                             </div>

                             {/* Floating Hearts Animation (Simulated) */}
                             <div className="absolute bottom-20 right-4 flex flex-col items-center gap-4 z-30">
                                 <div className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white animate-pulse-slow">
                                     <Heart fill="#ef4444" className="text-red-500" size={20} />
                                     <span className="text-[10px] font-bold mt-1 block text-center">12k</span>
                                 </div>
                             </div>

                             <div className="absolute bottom-4 left-4 right-4 z-20">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md ${item.platform === 'TikTok' ? 'bg-black border border-gray-700' : item.platform === 'Facebook' ? 'bg-blue-600' : 'bg-gradient-to-tr from-yellow-400 to-purple-600'}`}>
                                        {item.platform === 'TikTok' ? 'TT' : item.platform === 'Facebook' ? <Facebook size={12} /> : <Instagram size={12} />}
                                    </div>
                                    <span className="text-xs font-bold text-white drop-shadow-md">{item.platform}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-2xl font-bold text-white leading-none drop-shadow-lg">{item.views}</div>
                                        <div className="text-[10px] text-white/80 uppercase font-bold tracking-wider mt-1">Views</div>
                                    </div>
                                </div>
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

const AuthPage = () => {
    const { login, t } = useAppContext();
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(email) login(email);
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative">
             <AmbientBackground mode="subtle" />
             <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl animate-fade-in-up">
                 <h2 className="text-2xl font-bold text-vuca-navy mb-6 text-center">{t('navLogin')}</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                         <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-vuca-blue focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="you@example.com"
                            required
                         />
                     </div>
                     <button type="submit" className="w-full bg-vuca-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                         Continue with Email
                     </button>
                 </form>
                 <div className="mt-6 text-center text-xs text-gray-400">
                     By continuing, you agree to our Terms of Service.
                 </div>
             </div>
        </div>
    );
}

const ProfilePage = () => {
    const { user, toggleSocialConnection } = useAppContext();
    const socialPlatforms = [
        { id: 'instagram', name: 'Instagram', icon: <Instagram size={20} />, color: 'bg-gradient-to-tr from-yellow-400 to-purple-600' },
        { id: 'tiktok', name: 'TikTok', icon: <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded text-[10px] font-bold border border-gray-700">TT</div>, color: 'bg-black' },
        { id: 'facebook', name: 'Facebook', icon: <Facebook size={20} />, color: 'bg-blue-600' },
        { id: 'youtube', name: 'YouTube', icon: <Youtube size={20} />, color: 'bg-red-600' }
    ];

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <AmbientBackground mode="subtle" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-heading font-bold text-vuca-navy mb-2">My Profile</h1>
                <p className="text-gray-500 mb-10">Manage your account and connected platforms.</p>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="glass-card p-6 rounded-3xl text-center bg-white border border-gray-100">
                            <div className="w-24 h-24 mx-auto bg-vuca-blue rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 ring-4 ring-blue-50">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-vuca-navy mb-1">{user.email?.split('@')[0]}</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                            
                            <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100">
                                <div className="text-xs text-gray-400 uppercase mb-1">Current Plan</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-vuca-blue font-bold uppercase">{user.plan}</span>
                                    {user.plan === 'free' && <button className="text-xs bg-vuca-blue px-2 py-1 rounded text-white shadow-sm">Upgrade</button>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings & Connections */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Connected Accounts */}
                        <div className="glass-card p-8 rounded-3xl bg-white border border-gray-100">
                            <h3 className="text-xl font-bold text-vuca-navy mb-6 flex items-center gap-2">
                                <Share2 size={20} className="text-vuca-blue" /> Connected Accounts
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Connect your social profiles to share videos directly from your dashboard.
                            </p>
                            
                            <div className="space-y-4">
                                {socialPlatforms.map(platform => {
                                    const isConnected = user.connectedAccounts[platform.id as keyof ConnectedAccounts];
                                    return (
                                        <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${platform.color}`}>
                                                    {platform.icon}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-vuca-navy">{platform.name}</div>
                                                    <div className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Not connected'}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleSocialConnection(platform.id as keyof ConnectedAccounts)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                    isConnected 
                                                    ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100' 
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
                                                }`}
                                            >
                                                {isConnected ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* API Key Placeholder */}
                        <div className="glass-card p-8 rounded-3xl bg-white border border-gray-100 opacity-60">
                            <h3 className="text-xl font-bold text-vuca-navy mb-4 flex items-center gap-2">
                                <Lock size={20} className="text-gray-400" /> API Settings
                            </h3>
                            <p className="text-sm text-gray-500">API Access is available on the Pro plan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TemplateCard = ({ template, onSelect }: { template: Template; onSelect: (t: Template) => void }) => {
    return (
        <div onClick={() => onSelect(template)} className="group cursor-pointer">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-3 border border-gray-100 group-hover:border-vuca-blue/50 transition-all shadow-md group-hover:shadow-xl group-hover:shadow-blue-500/10">
                <img src={template.thumbnailUrl} alt={template.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1">
                    <Play size={10} fill="currentColor" /> {template.duration}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                     <span className="text-[10px] font-bold text-white bg-vuca-blue/80 backdrop-blur-sm px-2 py-0.5 rounded-full mb-2 inline-block">
                        {template.category}
                     </span>
                     <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                        {template.platform === 'TikTok' && <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center font-bold text-[8px] text-white border border-gray-700">TT</div>}
                        {template.platform === 'Instagram' && <Instagram size={14} />}
                        {template.platform === 'Facebook' && <Facebook size={14} />}
                        {template.platform}
                     </div>
                </div>
                
                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </div>
                </div>
            </div>
            <h3 className="text-vuca-navy font-bold text-sm leading-tight group-hover:text-vuca-blue transition-colors">{template.title}</h3>
        </div>
    );
};

const PricingModal = ({ onClose, onUpgrade }: { onClose: () => void; onUpgrade: (plan: UserPlan) => void }) => {
    const { t } = useAppContext();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md animate-fade-in">
             <div className="relative w-full max-w-5xl bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-vuca-navy z-20"><X size={24} /></button>
                 
                 <div className="p-8 bg-gray-50 border-b border-gray-100 flex flex-col items-center">
                     <h2 className="text-3xl font-heading font-bold text-vuca-navy mb-2">{t('pricingTitle')}</h2>
                     <p className="text-gray-500 mb-6">{t('pricingSubtitle')}</p>
                     
                     <div className="bg-white p-1 rounded-full flex items-center relative border border-gray-200">
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-vuca-navy text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-vuca-navy text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            Yearly
                        </button>
                     </div>
                 </div>
                 
                 <div className="p-8 overflow-y-auto bg-white flex-grow">
                     <div className="grid md:grid-cols-3 gap-6">
                         {/* Basic Plan */}
                         <div className="border border-gray-200 rounded-2xl p-6 hover:border-vuca-blue/50 transition-all cursor-pointer group bg-gray-50 hover:bg-white hover:shadow-xl flex flex-col" onClick={() => onUpgrade('basic')}>
                             <div className="text-xl font-bold text-vuca-navy mb-2">Basic</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-4">${billingCycle === 'monthly' ? 23 : 18}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
                             <ul className="space-y-3 mb-6 flex-grow">
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> 15 Videos / Month</li>
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> 720p Export</li>
                             </ul>
                             <button className="w-full py-3 rounded-xl border border-gray-300 text-vuca-navy font-bold group-hover:border-vuca-blue group-hover:text-vuca-blue transition-colors">Choose Basic</button>
                         </div>
                         
                         {/* Pro Plan */}
                         <div className="border-2 border-vuca-blue rounded-2xl p-6 relative bg-white cursor-pointer transform hover:scale-105 transition-all shadow-lg flex flex-col" onClick={() => onUpgrade('pro')}>
                             <div className="absolute top-0 right-0 bg-vuca-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                             <div className="text-xl font-bold text-vuca-navy mb-2">Pro</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-4">${billingCycle === 'monthly' ? 49 : 39}<span className="text-sm text-gray-500 font-normal">/mo</span></div>
                             <ul className="space-y-3 mb-6 flex-grow">
                                 <li className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Check size={16} className="text-vuca-blue"/> 40 Videos / Month</li>
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> 1080p Export</li>
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> No Watermark</li>
                             </ul>
                             <button className="w-full py-3 rounded-xl bg-vuca-blue text-white font-bold shadow-lg shadow-blue-500/30">Choose Pro</button>
                         </div>

                         {/* Max Plan */}
                         <div className="border border-gray-200 rounded-2xl p-6 transition-all bg-gray-50 flex flex-col">
                             <div className="text-xl font-bold text-vuca-navy mb-2">Max</div>
                             <div className="text-3xl font-bold text-vuca-navy mb-4">Custom</div>
                             <ul className="space-y-3 mb-6 flex-grow">
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> Unlimited Videos</li>
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> API Access</li>
                                 <li className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-vuca-blue"/> Dedicated Manager</li>
                             </ul>
                             <button 
                                onClick={() => window.open('https://wa.me/6285157626264', '_blank')}
                                className="w-full py-3 rounded-xl bg-vuca-navy text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                             >
                                <PhoneCall size={16} /> Talk to Sales
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="gradient-border-card rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow bg-white">
            <div className="aspect-[9/16] relative bg-gray-100 rounded-xl overflow-hidden">
                <img src={project.thumbnailUrl} alt={project.templateTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg">
                    READY
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                    <span className="text-[10px] text-gray-300 mb-1 block">{project.createdAt.toLocaleDateString()}</span>
                    <h3 className="text-white font-heading font-semibold text-sm leading-tight mb-3">{project.templateTitle}</h3>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 backdrop-blur-sm">
                            <Download size={12} /> Save
                        </button>
                        <button className="flex-1 bg-vuca-blue hover:bg-blue-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-lg">
                            <Share2 size={12} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Editor = ({ template, onBack }: { template: Template; onBack: () => void }) => {
    const { t, user, setShowPricingModal, lang, addProject } = useAppContext();
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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerateScript = async () => {
        if (!prompt) return;
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Write a short, engaging video script (under 60 seconds) for a ${template.platform} video about: "${prompt}". 
                The category is ${template.category}.
                Tone: Friendly, Simple, Confident.
                Structure: Hook, Value, Call to Action.
                Language: ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}.
                Format the output simply as the spoken script text.`,
                config: { systemInstruction: "You are an expert viral content scripter." }
            });
            
            const generatedText = response.text;
            if (generatedText) {
                setScript(generatedText);
                setStep(2);
            } else {
                 alert("AI generated empty response. Please try again.");
            }
        } catch (e) {
            console.error("Script generation error:", e);
            alert("Error generating script. Please check your connection or try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: imagePrompt }] },
                config: { tools: [{ googleSearch: {} }] }
            });

            let foundImage = null;
             if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        foundImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }

            if (foundImage) setGeneratedImage(foundImage);
            else alert("No image generated. Please try a different prompt.");
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
                  contents: [{ parts: [{ text: script.substring(0, 300) }] }],
                  config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } },
                    },
                  },
             });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const audioBlob = await (await fetch(`data:audio/mp3;base64,${base64Audio}`)).blob();
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                const audio = new Audio(url);
                audio.play();
            }
        } catch (e) {
            console.error("Audio generation error:", e);
        } finally {
            setIsGeneratingAudio(false);
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
        }
    };

    const handleGenerateVideo = async () => {
        if (user.plan === 'free') {
            setShowPricingModal(true);
            return;
        }

        if (!await (window as any).aistudio.hasSelectedApiKey()) {
             await (window as any).aistudio.openSelectKey();
        }

        setIsGeneratingVideo(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let sourceImageBase64 = '';
            let thumbUrl = template.thumbnailUrl;
            
            if (visualMode === 'upload' && uploadedImage) {
                sourceImageBase64 = await urlToBase64(uploadedImage);
                thumbUrl = uploadedImage;
            } else if (visualMode === 'avatar') {
                const currentAvatar = AVATARS.find(a => a.id === selectedAvatar);
                if (currentAvatar) {
                    sourceImageBase64 = await urlToBase64(currentAvatar.url);
                    thumbUrl = currentAvatar.url;
                }
            } else if (visualMode === 'generate' && generatedImage) {
                sourceImageBase64 = generatedImage.split(',')[1];
                thumbUrl = generatedImage;
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
                    mimeType: 'image/png',
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '9:16'
                }
            });

            while (!operation.done) {
                 await new Promise(resolve => setTimeout(resolve, 5000));
                 operation = await ai.operations.getVideosOperation({operation: operation});
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                 const finalVideoUrl = `${downloadLink}&key=${process.env.API_KEY}`;
                 setGeneratedVideoUrl(finalVideoUrl);
                 
                 // Save to My Projects
                 const newProject: Project = {
                     id: Math.random().toString(36).substr(2, 9),
                     templateId: template.id,
                     templateTitle: template.title,
                     videoUrl: finalVideoUrl,
                     thumbnailUrl: thumbUrl,
                     createdAt: new Date(),
                     platform: template.platform
                 };
                 addProject(newProject);
                 setShowSuccessModal(true);
            }

        } catch (e) {
            console.error("Video generation failed:", e);
            alert("Failed to generate video. Please try again later.");
        } finally {
            setIsGeneratingVideo(false);
        }
    };
    
    const currentAvatar = AVATARS.find(a => a.id === selectedAvatar);
    let previewImageSrc = template.thumbnailUrl;
    if (visualMode === 'upload' && uploadedImage) previewImageSrc = uploadedImage;
    if (visualMode === 'avatar' && currentAvatar) previewImageSrc = currentAvatar.url;
    if (visualMode === 'generate' && generatedImage) previewImageSrc = generatedImage;

    const handleSocialShare = (platform: string) => {
        alert(`Sharing video to ${platform}! (Integration simulated)`);
    };

    return (
        <div className="min-h-screen pt-20 flex flex-col md:flex-row bg-white">
             <AmbientBackground mode="subtle" />
            
            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md animate-fade-in-up">
                    <div className="bg-white border border-gray-100 p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vuca-blue to-vuca-yellow"></div>
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-vuca-navy mb-2">Video Generated!</h2>
                        <p className="text-gray-500 mb-8">Your video has been saved to "My Projects".</p>
                        
                        <div className="grid grid-cols-3 gap-3 mb-8">
                             {['Instagram', 'TikTok', 'Facebook'].map(p => (
                                 <button key={p} onClick={() => handleSocialShare(p)} className="flex flex-col items-center gap-2 group">
                                     <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-vuca-blue group-hover:text-white flex items-center justify-center transition-all border border-gray-100 shadow-sm">
                                         <Share2 size={18} />
                                     </div>
                                     <span className="text-[10px] text-gray-500 group-hover:text-vuca-navy uppercase font-bold">{p}</span>
                                 </button>
                             ))}
                        </div>
                        
                        <div className="flex gap-3">
                             <button onClick={() => setShowSuccessModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Close</button>
                             <button onClick={onBack} className="flex-1 py-3 bg-vuca-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30">Go to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 border-r border-gray-100 p-6 md:p-8 overflow-y-auto z-10 bg-white/95 backdrop-blur-xl h-auto md:h-[calc(100vh-80px)]">
                <button onClick={onBack} className="flex items-center text-gray-500 hover:text-vuca-blue mb-8 text-sm group transition-colors">
                    <ChevronRight className="rotate-180 mr-1 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Templates
                </button>
                
                 <div className="mb-8">
                     <span className="text-xs font-bold text-vuca-purple px-2.5 py-1 bg-purple-50 rounded-full border border-purple-100">STEP {step} OF 3</span>
                     <h2 className="text-3xl font-heading font-bold text-vuca-navy mt-4 mb-2">Create Video</h2>
                     <p className="text-sm text-gray-500">Template: <span className="text-vuca-blue font-medium">{template.title}</span></p>
                </div>
                
                 <div className="space-y-6">
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    {t('productUrl')}
                                </label>
                                <div className="gradient-border-card rounded-xl p-[1px] shadow-sm">
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Example: Review of the new Sony headphones with noise cancellation..."
                                        className="w-full bg-white rounded-xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none min-h-[140px] resize-none block transition-all"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGenerateScript}
                                disabled={loading || !prompt}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                                    loading || !prompt ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-vuca-blue hover:bg-blue-600 text-white shadow-blue-500/30 hover:-translate-y-1'
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
                                <h3 className="text-lg font-bold text-vuca-navy mb-4">1. Visual Source</h3>
                                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                                    <button 
                                        onClick={() => setVisualMode('upload')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'upload' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Upload
                                    </button>
                                    <button 
                                        onClick={() => setVisualMode('avatar')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'avatar' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Model
                                    </button>
                                    <button 
                                        onClick={() => setVisualMode('generate')}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${visualMode === 'generate' ? 'bg-white text-vuca-blue shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Generate
                                    </button>
                                </div>
                                {visualMode === 'upload' && (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-vuca-blue/50 hover:bg-blue-50/50 transition-all group relative overflow-hidden h-32 bg-gray-50"
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
                                                <Upload size={20} className="text-vuca-navy mb-2" />
                                                <span className="text-xs font-bold text-vuca-navy">Change Image</span>
                                            </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-vuca-blue flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Upload size={20} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500">Upload Product Photo</span>
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
                                                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${selectedAvatar === avatar.id ? 'border-vuca-blue shadow-md' : 'border-transparent hover:border-gray-200'}`}
                                            >
                                                <img src={avatar.url} alt={avatar.name} className="w-full h-24 object-cover" />
                                                <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm p-1.5 text-center">
                                                    <span className="text-[10px] font-bold text-vuca-navy block">{avatar.name}</span>
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
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-vuca-blue shadow-sm"
                                        />
                                        <button 
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage || !imagePrompt}
                                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                        >
                                            {isGeneratingImage ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                                            Generate Visual
                                        </button>
                                        {generatedImage && (
                                            <div className="relative rounded-xl overflow-hidden border border-vuca-blue/50 shadow-md">
                                                <img src={generatedImage} alt="Generated" className="w-full h-32 object-cover" />
                                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-vuca-navy font-bold shadow-sm">Generated</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Script Editor Section */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Type size={14} /> 2. Edit Script
                                </label>
                                <textarea 
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-700 text-sm leading-relaxed font-mono shadow-inner focus:outline-none focus:border-vuca-blue transition-colors min-h-[120px]"
                                />
                            </div>

                            {/* Audio & Subtitles */}
                            <div className="border-t border-gray-100 pt-6 space-y-6">
                                <h3 className="text-lg font-bold text-vuca-navy flex items-center gap-2">
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
                                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-vuca-blue cursor-pointer hover:bg-gray-50 shadow-sm"
                                                >
                                                    {VOICES.filter(v => v.lang === lang).map(voice => (
                                                        <option key={voice.id} value={voice.id}>{voice.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <ChevronRight className="rotate-90" size={14} />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handleGenerateAudio}
                                                disabled={isGeneratingAudio}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-xl transition-colors flex items-center justify-center tooltip-trigger shadow-sm"
                                                title="Preview Voice"
                                            >
                                                {isGeneratingAudio ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    {/* Subtitle Toggle */}
                                    <div 
                                        onClick={() => setHasSubtitles(!hasSubtitles)}
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Type size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-700 font-medium">Auto-Captions</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${hasSubtitles ? 'bg-vuca-blue' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${hasSubtitles ? 'left-6' : 'left-1'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    onClick={handleGenerateVideo} 
                                    disabled={isGeneratingVideo}
                                    className="w-full py-4 bg-vuca-yellow text-vuca-navy font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingVideo ? <><Loader2 className="animate-spin" /> Generating Video...</> : <>Export Video <ChevronRight size={18}/></>}
                                </button>
                                <button onClick={() => setStep(1)} className="w-full py-3 text-gray-400 text-sm hover:text-vuca-navy transition-colors">Start Over</button>
                            </div>
                         </div>
                    )}
                 </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gray-100 p-4 md:p-8 min-h-[600px] md:min-h-[calc(100vh-80px)]">
                {/* Phone Frame */}
                <div className="relative w-[300px] h-[600px] md:w-[340px] md:h-[680px] border-[10px] md:border-[12px] border-white rounded-[3rem] md:rounded-[3.5rem] bg-black overflow-hidden shadow-2xl ring-1 ring-gray-200 transform transition-transform">
                     {/* ... (Same preview logic) */}
                    <div className="absolute top-0 w-full h-8 bg-black flex justify-center z-20 rounded-b-xl">
                        <div className="w-16 md:w-20 h-5 bg-black rounded-b-xl"></div>
                    </div>

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
            </div>
        </div>
    );
};

const Dashboard = ({ onSelectTemplate }: { onSelectTemplate: (t: Template) => void }) => {
    const { t, user, projects } = useAppContext();
    const [activeTab, setActiveTab] = useState<'explore' | 'projects'>('explore');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Fashion', 'Tech', 'Food', 'Beauty', 'Home', 'Fitness', 'Gaming'];
    
    const filteredTemplates = MOCK_TEMPLATES.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-20 pb-12 bg-white">
            <AmbientBackground mode="dashboard" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Dashboard Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-vuca-navy mb-2">{t('dashboardTitle')}</h1>
                    <p className="text-gray-500">Welcome back, <span className="text-vuca-blue font-bold">{user.email?.split('@')[0]}</span>. Create your next viral hit.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-100 mb-8">
                    <button 
                        onClick={() => setActiveTab('explore')}
                        className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'explore' ? 'text-vuca-blue' : 'text-gray-500 hover:text-vuca-navy'}`}
                    >
                        Explore Templates
                        {activeTab === 'explore' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vuca-blue rounded-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`pb-4 px-2 font-bold text-sm transition-all relative flex items-center gap-2 ${activeTab === 'projects' ? 'text-vuca-blue' : 'text-gray-500 hover:text-vuca-navy'}`}
                    >
                        My Projects
                        <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full text-gray-600">{projects.length}</span>
                        {activeTab === 'projects' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vuca-blue rounded-full"></div>}
                    </button>
                </div>

                {activeTab === 'explore' ? (
                    <>
                        {/* Search & Filter Bar */}
                        <div className="relative z-20 mb-10 flex flex-col md:flex-row gap-4 animate-fade-in-up animation-delay-2000">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-gray-800 focus:outline-none focus:border-vuca-blue shadow-lg shadow-gray-200/50 transition-all"
                                />
                            </div>
                            
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {categories.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                                            selectedCategory === cat 
                                            ? 'bg-vuca-blue text-white border-vuca-blue shadow-md shadow-blue-500/20' 
                                            : 'bg-white text-gray-500 border-gray-100 hover:text-vuca-navy hover:border-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Templates Grid */}
                        {filteredTemplates.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up animation-delay-4000">
                                {filteredTemplates.map(template => (
                                    <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 animate-fade-in-up">
                                <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 border border-gray-100">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-vuca-navy mb-2">No templates found</h3>
                                <p className="text-gray-500">Try adjusting your search or category filter.</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                    className="mt-6 text-vuca-blue font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Projects Grid
                    <div className="animate-fade-in-up">
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {projects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <div className="inline-block p-4 rounded-full bg-white mb-4 border border-gray-100 shadow-sm">
                                    <Film size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-vuca-navy mb-2">No projects yet</h3>
                                <p className="text-gray-500 mb-6">Create your first video to start building your library.</p>
                                <button 
                                    onClick={() => setActiveTab('explore')}
                                    className="bg-vuca-blue text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Create New Video
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<UserState>({ 
      isLoggedIn: false, 
      email: null, 
      plan: 'free',
      connectedAccounts: { instagram: false, tiktok: false, facebook: false, youtube: false } 
  });
  const [view, setView] = useState('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  const login = (email: string) => {
      setUser({ ...user, isLoggedIn: true, email, plan: 'free' });
      setView('dashboard');
  };

  const logout = () => {
      setUser({ ...user, isLoggedIn: false, email: null, plan: 'free' });
      setView('landing');
  };

  const upgradePlan = (plan: UserPlan) => {
      setUser({ ...user, plan });
      setShowPricingModal(false);
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
  
  const addProject = (project: Project) => {
      setProjects(prev => [project, ...prev]);
  };
  
  const handleTemplateSelect = (template: Template) => {
      setSelectedTemplate(template);
      setView('editor');
  };

  return (
    <AppContext.Provider value={{ lang, setLang, t, user, login, logout, upgradePlan, toggleSocialConnection, showPricingModal, setShowPricingModal, projects, addProject }}>
      <div className="min-h-screen font-sans text-vuca-navy bg-white">
        <Navbar onViewChange={setView} />
        
        <main>
          {view === 'landing' && (
            <>
                <Hero onStart={() => setView('auth')} />
                <SolutionSection />
                <UseCaseSection />
                <HomePricing />
                <FAQ />
                <Footer />
            </>
          )}
          
          {view === 'auth' && <AuthPage />}
          
          {view === 'profile' && <ProfilePage />}
          
          {view === 'dashboard' && <Dashboard onSelectTemplate={handleTemplateSelect} />}
          
          {view === 'editor' && selectedTemplate && (
            <Editor template={selectedTemplate} onBack={() => setView('dashboard')} />
          )}
        </main>

        <WhatsAppFloat />

        {showPricingModal && (
            <PricingModal onClose={() => setShowPricingModal(false)} onUpgrade={upgradePlan} />
        )}
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);