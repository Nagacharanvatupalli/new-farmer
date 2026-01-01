
import React, { useEffect, useState, useRef } from 'react';
import { 
  Leaf, Sprout, CloudSun, TrendingUp, ShieldCheck, Users, MapPin, 
  ChevronRight, Menu, X, Tractor, Droplets, Microscope, 
  LogIn, LogOut, User, Globe, Wheat, LayoutDashboard, Search, 
  UserPlus, Info, Sparkles, Thermometer, Wind, Droplet, ArrowRight, 
  Calendar, Send, RefreshCw, AlertTriangle, BarChart3, Database, Target, Zap
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyB2x7yczlRk9UM9eloFRdBmIOeZjzpf3xw",
  authDomain: "login-for-bank-emmp.firebaseapp.com",
  projectId: "login-for-bank-emmp",
  storageBucket: "login-for-bank-emmp.firebasestorage.app",
  messagingSenderId: "493920867634",
  appId: "1:493920867634:web:cb49dba2c43b2afd15f32b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Constants ---
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' }
];

const cropOptions = [
  { name: "Paddy", season: "Kharif", cycle: "120 days" },
  { name: "Wheat", season: "Rabi", cycle: "110 days" },
  { name: "Cotton", season: "Kharif", cycle: "180 days" },
  { name: "Chilli", season: "Year-round", cycle: "150 days" },
  { name: "Turmeric", season: "Kharif", cycle: "240 days" },
  { name: "Maize", season: "Kharif/Rabi", cycle: "100 days" },
  { name: "Tomato", season: "Year-round", cycle: "90 days" },
  { name: "Sugarcane", season: "Perennial", cycle: "365 days" }
];

const translations: any = {
  en: {
    nav: { home: 'Home', crops: 'Crops', weather: 'Weather', dashboard: 'Dashboard', suggestions: 'AI Advice', login: 'Login', register: 'Register', logout: 'Logout' },
    hero: { badge: 'Empowering Precision Agriculture', title: 'Smart Farming for a Greener Future', desc: 'Harness the power of AI, real-time weather data, and expert crop catalogs to maximize your yield through data-driven intelligence.', join: 'Get Started', explore: 'Our Services' },
    auth: { titleLogin: 'Sign In', titleRegister: 'Create Account', subtitle: 'Access your Kisan Dashboard', phonePlaceholder: 'Mobile Number', sendOtp: 'Send OTP', verify: 'Verify', profile: 'Setup Your Farm', name: 'Farmer Full Name', state: 'Select State', district: 'Select District', crop: 'Primary Crop', submit: 'Finish Setup' },
    weather: { title: 'Weather Dashboard', desc: 'Localized forecasts for precision planning.', humidity: 'Humidity', wind: 'Wind Speed', temp: 'Temperature', advice: 'AI Agricultural Insight' },
    crops: { title: 'Crop Repository', desc: 'Expert guidelines for optimized cultivation.', search: 'Search crops...' },
    ai: { title: 'Kisan AI Expert', desc: 'Ask anything about pests, soil, or market prices.', placeholder: 'E.g., How to treat leaf rust in wheat?', ask: 'Consult AI' }
  },
  hi: {
    nav: { home: 'होम', crops: 'फसलें', weather: 'मौसम', dashboard: 'डैशबोर्ड', suggestions: 'एआई सलाह', login: 'लॉगिन', register: 'रजिस्टर', logout: 'लॉगआउट' },
    hero: { badge: 'सटीक कृषि सशक्तिकरण', title: 'हरित भविष्य के लिए स्मार्ट खेती', desc: 'अपनी पैदावार को अधिकतम करने के लिए एआई, मौसम डेटा और विशेषज्ञ फसल कैटलॉग की शक्ति का उपयोग करें।' },
    auth: { titleLogin: 'लॉगिन', titleRegister: 'खाता बनाएं', profile: 'फार्म सेटअप', name: 'किसान का पूरा नाम', state: 'राज्य चुनें', crop: 'मुख्य फसल', submit: 'सेटअप पूरा करें' }
  }
};

// --- View Components ---

const WeatherView = ({ userProfile, t }: any) => {
  const [weatherData] = useState({ temp: 32, humidity: 65, wind: 12, condition: 'Partly Cloudy' });
  
  return (
    <div className="pt-24 pb-10 w-full max-w-[1440px] mx-auto px-8 animate-fadeInUp">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-serif text-slate-900 mb-2">{t.weather.title}</h2>
          <p className="text-slate-500 text-sm">{t.weather.desc}</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-full flex items-center gap-2 border border-green-100">
          <MapPin className="text-green-600 w-4 h-4" />
          <span className="text-green-900 font-bold text-xs">{userProfile?.state || 'Local Region'}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard icon={<Thermometer size={24} />} label={t.weather.temp} value={`${weatherData.temp}°C`} color="blue" />
        <StatCard icon={<Droplet size={24} />} label={t.weather.humidity} value={`${weatherData.humidity}%`} color="cyan" />
        <StatCard icon={<Wind size={24} />} label={t.weather.wind} value={`${weatherData.wind} km/h`} color="slate" />
        <StatCard icon={<CloudSun size={24} />} label="Condition" value={weatherData.condition} color="yellow" />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
    <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <span className="text-slate-400 text-[10px] font-black uppercase mb-1">{label}</span>
    <span className="text-2xl font-black">{value}</span>
  </div>
);

const CropsView = ({ t }: any) => {
  const [search, setSearch] = useState('');
  const filtered = cropOptions.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pt-24 pb-10 w-full max-w-[1440px] mx-auto px-8 animate-fadeInUp">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-left">
          <h2 className="text-3xl font-serif text-slate-900 mb-2">{t.crops.title}</h2>
          <p className="text-slate-500 text-sm">{t.crops.desc}</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder={t.crops.search} 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-green-500 shadow-sm font-medium text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(crop => (
          <div key={crop.name} className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-28 bg-slate-50 flex items-center justify-center">
              <Wheat className="text-green-600/40 group-hover:scale-110 transition-transform" size={40} />
            </div>
            <div className="p-5">
              <span className="text-[9px] uppercase font-black tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full mb-3 inline-block">{crop.season}</span>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{crop.name}</h4>
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Cycle: {crop.cycle}</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, initialMode, onClose, t, onAuthSuccess }: any) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    state: '',
    district: '',
    crop: ''
  });

  if (!isOpen) return null;

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await verificationId.confirm(otp);
      const user = result.user;
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        onAuthSuccess(docSnap.data());
      } else {
        if (mode === 'register') {
          setStep('profile');
        } else {
          setError('User profile not found. Please register.');
          await signOut(auth);
        }
      }
    } catch (err: any) {
      setError('Invalid OTP or verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      const data = { ...profile, uid: user.uid, phone: user.phoneNumber };
      await setDoc(doc(db, 'users', user.uid), data);
      onAuthSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm rounded-[1.5rem] p-8 relative shadow-2xl animate-scaleIn">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
        <h3 className="text-2xl font-serif text-slate-900 mb-2">
          {step === 'profile' ? t.auth.profile : (mode === 'login' ? t.auth.titleLogin : t.auth.titleRegister)}
        </h3>
        <p className="text-slate-500 text-sm mb-6">{t.auth.subtitle}</p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 border border-red-100">
          <AlertTriangle size={14} /> {error}
        </div>}
        {step === 'phone' && (
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="tel" placeholder={t.auth.phonePlaceholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button disabled={loading} onClick={handleSendOtp} className="w-full bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.sendOtp}
            </button>
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="w-full text-slate-500 font-bold text-[11px] text-center mt-2 uppercase tracking-wide">
              {mode === 'login' ? "New here? Create account" : "Have account? Sign In"}
            </button>
          </div>
        )}
        {step === 'otp' && (
          <div className="space-y-3">
            <input type="text" placeholder="6-digit OTP" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-center text-xl tracking-[0.4em]" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value)} />
            <button disabled={loading} onClick={handleVerifyOtp} className="w-full bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.verify}
            </button>
          </div>
        )}
        {step === 'profile' && (
          <div className="space-y-3">
            <input type="text" placeholder={t.auth.name} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-sm" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
            <input type="text" placeholder={t.auth.state} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-sm" value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value})} />
            <input type="text" placeholder={t.auth.district} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-sm" value={profile.district} onChange={(e) => setProfile({...profile, district: e.target.value})} />
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-green-500 font-medium text-sm" value={profile.crop} onChange={(e) => setProfile({...profile, crop: e.target.value})}>
              <option value="">{t.auth.crop}</option>
              {cropOptions.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <button disabled={loading} onClick={handleProfileSubmit} className="w-full bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.submit}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestionsView = ({ t, userProfile }: any) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: `User Profile: ${JSON.stringify(userProfile)}. User Question: ${userMsg}` }] }],
        config: {
          systemInstruction: "You are a world-class agricultural expert specialized in Indian farming. Provide actionable, concise, and scientific advice. Use markdown for lists and emphasis.",
          temperature: 0.7,
        }
      });
      const text = response.text || "I apologize, but I couldn't generate a response right now.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Service temporarily unavailable. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-10 w-full max-w-[1200px] mx-auto px-8 animate-fadeInUp">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-slate-900 mb-1">{t.ai.title}</h2>
        <p className="text-slate-500 text-sm">{t.ai.desc}</p>
      </div>
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col h-[500px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Sparkles className="text-green-600 mb-4" size={36} />
              <p className="text-slate-600 font-bold">AI Assistant Online</p>
              <p className="text-slate-400 text-xs">Localized agricultural intelligence at your fingertips.</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-[1.2rem] text-sm ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none shadow-md' : 'bg-slate-50 text-slate-900 rounded-tl-none border border-slate-100'}`}>
                <p className="whitespace-pre-wrap leading-relaxed font-medium">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-slate-50 p-4 rounded-[1.2rem] rounded-tl-none border border-slate-100 animate-pulse text-slate-400 font-bold text-xs uppercase tracking-widest">AI Thinking...</div></div>}
        </div>
        <div className="p-5 bg-slate-50/50 border-t border-slate-100">
          <div className="relative">
            <input type="text" placeholder={t.ai.placeholder} className="w-full bg-white border border-slate-200 rounded-[1.2rem] pl-6 pr-24 py-4 outline-none focus:ring-4 ring-green-500/10 focus:border-green-500 shadow-sm text-sm" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAsk()} />
            <button onClick={handleAsk} disabled={loading || !query.trim()} className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-green-700 transition-all disabled:opacity-50">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ isLoggedIn, currentView, onNav, lang, setLang, t, onLogout, onOpenAuth }: any) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const menuItems = [
    { key: 'home', label: t.nav.home },
    { key: 'crops', label: t.nav.crops },
    { key: 'weather', label: t.nav.weather },
    { key: 'suggestions', label: t.nav.suggestions },
    { key: 'dashboard', label: t.nav.dashboard }
  ];

  const handleNavigate = (view: string) => {
    onNav(view);
    setMobileMenuOpen(false);
  };

  const isHome = currentView === 'home';
  const navTextColor = scrolled || !isHome ? 'text-slate-900' : 'text-white';
  const navBg = scrolled || !isHome ? 'bg-white/98 backdrop-blur-xl shadow-md py-3' : 'bg-transparent py-6';

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${navBg}`}>
        <div className="w-full px-8 flex justify-between items-center">
          <div className="flex flex-col items-start cursor-pointer group shrink-0" onClick={() => handleNavigate('home')}>
            <div className="flex items-center gap-2">
              <div className="bg-green-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-green-600/20">
                <Sprout className="text-white w-4 h-4" />
              </div>
              <span className={`text-xl font-black tracking-tighter ${navTextColor}`}>KisanPortal</span>
            </div>
            <span className="mt-0.5 text-green-500 text-[8px] font-black uppercase tracking-[0.3em] leading-none pl-1 opacity-80 whitespace-nowrap">
              Precision Systems
            </span>
          </div>

          <div className="flex items-center gap-6 xl:gap-10">
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map(item => (
                <button 
                  key={item.key} 
                  onClick={() => handleNavigate(item.key)}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                    currentView === item.key 
                      ? 'text-green-600' 
                      : (scrolled || !isHome ? 'text-slate-500 hover:text-slate-900' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-600 transition-all ${currentView === item.key ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
              ))}
            </div>

            <div className={`flex items-center p-1 rounded-lg border transition-colors ${scrolled || !isHome ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'}`}>
              <Globe className={`w-3 h-3 mx-1 ${scrolled || !isHome ? 'text-slate-400' : 'text-white/60'}`} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className={`bg-transparent text-[9px] font-black uppercase outline-none pr-1 cursor-pointer ${scrolled || !isHome ? 'text-slate-900' : 'text-white'}`}
              >
                {languages.map(l => <option key={l.code} value={l.code} className="text-slate-900">{l.code}</option>)}
              </select>
            </div>

            <div className="hidden sm:block">
              {!isLoggedIn ? (
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-green-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {t.nav.login}
                </button>
              ) : (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 text-red-500 font-black text-[9px] uppercase tracking-widest group px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  {t.nav.logout}
                </button>
              )}
            </div>

            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg ${scrolled || !isHome ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-72 h-full bg-white transition-transform duration-500 p-6 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
             <span className="text-lg font-black text-slate-900 tracking-tighter">Menu</span>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-900"><X size={18}/></button>
          </div>
          <div className="space-y-3">
             {menuItems.map(item => (
               <button 
                key={item.key} 
                onClick={() => handleNavigate(item.key)}
                className={`flex items-center gap-3 w-full text-left text-base font-bold p-3 rounded-xl ${currentView === item.key ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {item.label}
               </button>
             ))}
          </div>
        </div>
      </div>
    </>
  );
};

const HomeView = ({ t, onNav }: any) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover" alt="Vibrant Green Field" />
           <div className="absolute inset-0 bg-gradient-to-br from-slate-900/98 via-slate-900/85 to-slate-900/40"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-12 grid lg:grid-cols-2 gap-20 items-center pt-20">
          <div className="animate-fadeInLeft text-left">
             <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 px-3 py-1.5 rounded-full mb-8">
                <Sparkles className="text-green-400 w-3 h-3" />
                <span className="text-green-100 text-[9px] font-black uppercase tracking-[0.2em]">{t.hero.badge}</span>
             </div>
             <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white mb-8 leading-[1] tracking-tight">
               {t.hero.title}
             </h1>
             <p className="text-lg text-slate-300 mb-10 max-w-lg font-light leading-relaxed">
               {t.hero.desc}
             </p>
             <div className="flex flex-wrap gap-6">
               <button onClick={() => onNav('dashboard')} className="bg-green-600 text-white px-10 py-4.5 rounded-[1.5rem] font-black text-base shadow-2xl shadow-green-600/30 hover:bg-green-700 hover:-translate-y-1 transition-all">
                 {t.hero.join}
               </button>
               <button onClick={() => onNav('crops')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4.5 rounded-[1.5rem] font-black text-base hover:bg-white/20 transition-all">
                 {t.hero.explore}
               </button>
             </div>
          </div>

          <div className="hidden lg:flex justify-end animate-fadeInUp delay-300">
             <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] space-y-8 w-full max-w-md">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                         <BarChart3 className="text-white" size={24} />
                      </div>
                      <div>
                         <p className="text-white text-base font-bold">Market Intelligence</p>
                         <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Real-time Pulse</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black uppercase rounded-full border border-green-500/30">Optimal</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-2">Regional Yield</p>
                      <p className="text-2xl font-black text-white">+18.5%</p>
                   </div>
                   <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-2">Irrigation</p>
                      <p className="text-2xl font-black text-white">Active</p>
                   </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl">
                   <Sparkles className="text-green-400 shrink-0 mt-0.5" size={20} />
                   <p className="text-green-50 text-xs font-medium leading-relaxed">AI Expert suggests soil enrichment before the next cycle based on current humidity patterns.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-12 text-left relative z-10">
          <div className="mb-16">
            <h2 className="text-5xl font-serif text-slate-900 mb-4 tracking-tight">Innovative Agriculture</h2>
            <p className="text-slate-500 text-lg max-w-2xl font-light">We bridge the gap between traditional wisdom and modern precision through a suite of advanced digital tools.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: "Data-Driven Insights", desc: "Access historical crop performance and soil health analytics for your specific region." },
              { icon: Target, title: "Precision Planning", desc: "Plan your irrigation, seeding, and harvest cycles with scientific accuracy using AI modeling." },
              { icon: Zap, title: "Real-Time Response", desc: "Get instant alerts about pest outbreaks or drastic weather changes via the Kisan Dashboard." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-green-900 transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-green-800 transition-all">
                  <feature.icon className="text-green-600 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-xl font-serif text-slate-900 mb-3 group-hover:text-white">{feature.title}</h3>
                <p className="text-slate-500 group-hover:text-green-100 leading-relaxed font-medium text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Process */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-12 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl font-serif text-slate-900 tracking-tight leading-tight">A Smarter Cycle for Every Season</h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Smart Registration", desc: "Sign up with your mobile and pinpoint your farm location for localized intelligence." },
                { step: "02", title: "Crop Profiling", desc: "Select your primary crops to receive tailored advice on seed selection and spacing." },
                { step: "03", title: "Yield Optimization", desc: "Follow AI-driven daily tasks and irrigation schedules to ensure maximum growth." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <span className="text-3xl font-serif text-green-600/30 group-hover:text-green-600 transition-colors shrink-0">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed font-medium text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-green-900/10 rounded-[3rem] rotate-2 -z-10"></div>
            <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1200" className="rounded-[3rem] shadow-xl" alt="Farmer examining crop" />
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        <div className="max-w-[1440px] mx-auto px-12 text-center relative z-10">
          <h2 className="text-6xl font-serif mb-16 leading-tight">National Impact, <br/><span className="text-green-500">Local Precision.</span></h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { val: "50k+", label: "Farmers Empowered" },
              { val: "30%", label: "Yield Increase" },
              { val: "12M+", label: "Liters Saved" },
              { val: "98%", label: "Satisfaction" }
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <p className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.val}</p>
                <p className="text-green-400 font-black uppercase tracking-widest text-[10px]">{stat.label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onNav('dashboard')} className="mt-16 bg-green-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-green-700 transition-all shadow-2xl shadow-green-600/20">
            Join the Revolution
          </button>
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
  const [lang, setLang] = useState('en');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState('home');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setIsLoggedIn(true);
        } else if (!authModal.isOpen) {
          await signOut(auth);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, [authModal.isOpen]);

  const handleNav = (v: string) => {
    if (['dashboard', 'weather', 'suggestions'].includes(v) && !isLoggedIn) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    setCurrentView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-green-200">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        currentView={currentView} 
        onNav={handleNav} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        onLogout={() => signOut(auth)}
        onOpenAuth={(mode: any) => setAuthModal({ isOpen: true, mode })}
      />
      
      <main>
        {currentView === 'home' && <HomeView t={t} onNav={handleNav} />}
        {currentView === 'dashboard' && (
          <div className="pt-32 pb-16 p-8 w-full max-w-[1440px] mx-auto text-left">
            <h1 className="text-5xl font-serif text-slate-900 mb-6 tracking-tight">Command Center</h1>
            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
               <p className="text-slate-500 text-lg">Welcome back, <span className="text-slate-900 font-bold">{userProfile?.name}</span>. Your localized agricultural dashboard is loading.</p>
               <div className="mt-10 grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                     <p className="text-xl font-bold text-slate-900">{userProfile?.state}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Crop</p>
                     <p className="text-xl font-bold text-slate-900">{userProfile?.crop}</p>
                  </div>
                  <div className="p-6 bg-green-600 rounded-2xl text-white">
                     <p className="text-[10px] font-black text-green-200 uppercase tracking-widest mb-1">Account Status</p>
                     <p className="text-xl font-bold">Verified Farmer</p>
                  </div>
               </div>
            </div>
          </div>
        )}
        {currentView === 'weather' && <WeatherView userProfile={userProfile} t={t} />}
        {currentView === 'crops' && <CropsView t={t} />}
        {currentView === 'suggestions' && <SuggestionsView t={t} userProfile={userProfile} />}
      </main>

      <footer className="bg-slate-900 pt-24 pb-12 px-8 mt-20">
        <div className="w-full max-w-[1440px] mx-auto grid md:grid-cols-4 gap-16 text-slate-400">
           <div className="col-span-2 text-left">
              <div className="flex items-center gap-2 mb-8">
                <Sprout className="text-green-500 w-8 h-8" />
                <span className="text-3xl font-black text-white tracking-tighter">KisanPortal</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed mb-8">Precision technology for the future of farming. Join thousands of modern farmers optimizing their yield with AI and real-time data across India.</p>
           </div>
           <div className="text-left">
              <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-8">Platform</h4>
              <ul className="space-y-3 text-sm font-bold">
                <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('crops')}>Crop Catalogs</li>
                <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('weather')}>Weather Analytics</li>
                <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('suggestions')}>AI Assistant</li>
              </ul>
           </div>
           <div className="text-left">
              <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-8">Connect</h4>
              <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Support Helpline</p>
              <p className="text-2xl font-black text-white tracking-tighter">1800-KISAN-PRO</p>
           </div>
        </div>
        <div className="w-full max-w-[1440px] mx-auto border-t border-white/5 mt-16 pt-8 text-[9px] font-black uppercase tracking-[0.3em] opacity-30 flex justify-between">
           <span>&copy; 2024 KisanPortal Precision Systems</span>
           <span>Privacy & Legal</span>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode} 
        onClose={() => setAuthModal({...authModal, isOpen: false})} 
        t={t} 
        onAuthSuccess={(p: any) => { 
          setUserProfile(p); 
          setIsLoggedIn(true); 
          setAuthModal({...authModal, isOpen: false}); 
          setCurrentView('dashboard'); 
        }} 
      />
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default App;
