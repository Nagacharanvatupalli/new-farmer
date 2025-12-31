
import React, { useEffect, useState, useRef } from 'react';
import { 
  Leaf, Sprout, CloudSun, TrendingUp, ShieldCheck, Users, MapPin, 
  Phone, Mail, ChevronRight, Menu, X, Tractor, Droplets, Microscope, 
  LogIn, LogOut, MessageCircle, Send, User, Globe, CheckCircle2, 
  MapIcon, Wheat, Building2, LayoutDashboard, Search, UserPlus
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

// --- Extended Location Data ---
const locationData: any = {
  "Andhra Pradesh": {
    districts: {
      "Guntur": ["Guntur Mandal 1", "Guntur Mandal 2", "Other"],
      "Krishna": ["Vijayawada", "Machilipatnam", "Other"],
      "Visakhapatnam": ["Visakhapatnam Urban", "Visakhapatnam Rural", "Other"],
      "Anantapur": ["Anantapur", "Dharmavaram", "Other"],
      "Other": ["Other"]
    }
  },
  "Telangana": {
    districts: {
      "Hyderabad": ["Ameerpet", "Madhapur", "Kukatpally", "Other"],
      "Warangal": ["Warangal Urban", "Warangal Rural", "Other"],
      "Khammam": ["Khammam", "Wyra", "Other"],
      "Nizamabad": ["Nizamabad", "Armur", "Other"],
      "Other": ["Other"]
    }
  },
  "Karnataka": {
    districts: {
      "Bangalore": ["Bangalore North", "Bangalore South", "Other"],
      "Mysore": ["Mysore", "Hunsur", "Other"],
      "Belagavi": ["Belagavi", "Gokak", "Other"],
      "Other": ["Other"]
    }
  },
  "Tamil Nadu": {
    districts: {
      "Chennai": ["Chennai Central", "Chennai North", "Other"],
      "Coimbatore": ["Coimbatore North", "Coimbatore South", "Other"],
      "Madurai": ["Madurai North", "Other"],
      "Other": ["Other"]
    }
  },
  "Other": {
    districts: {
      "Other": ["Other"]
    }
  }
};

const cropOptions = ["Paddy", "Wheat", "Cotton", "Chilli", "Turmeric", "Maize", "Groundnut", "Tomato", "Onion", "Sugarcane", "Other"];

// --- Translations ---
const translations = {
  en: {
    nav: { 
      home: 'Home', 
      cropDetails: 'Crops', 
      weather: 'Weather', 
      dashboard: 'Dashboard', 
      suggestions: 'Suggestions',
      login: 'Login', 
      register: 'Register',
      logout: 'Logout' 
    },
    hero: { badge: 'Empowering Indian Agriculture', title: 'Cultivate the Future Today', desc: 'KisanPortal is the definitive ecosystem for modern growers. We bridge legacy farming wisdom with state-of-the-art analytics.', join: 'Join the Network', explore: 'Explore Services' },
    importance: { badge: 'The Backbone of Earth', title: 'Feeding Nations, Building Futures', desc: 'Every revolution in human history started with a surplus of food. KisanPortal honors this legacy by providing digital armor for guardians of the soil.', quote: 'Farmers are the only essential workers that create something out of nothing but a seed and hard work.' },
    tech: { badge: 'The Digital Harvest', title: 'High-Tech Solutions', subtitle: 'Deep-Rooted Traditions', desc: 'Harnessing the power of AI and IoT to create a sustainable agricultural future.' },
    features: { title: 'Everything You Need To Thrive', weather: 'Satellite Weather', market: 'Market Analytics', coop: 'Cooperative Lab', insurance: 'Smart Insurance' },
    auth: {
      titleLogin: 'Welcome Back',
      titleRegister: 'New Registration',
      subtitle: 'Secure access to KisanPortal',
      phone: 'Phone Number',
      phonePlaceholder: '98765 43210',
      sendOtp: 'Send Verification Code',
      otp: 'Enter Verification Code',
      verify: 'Verify OTP',
      profile: 'Complete Your Profile',
      name: 'Full Name',
      state: 'State',
      district: 'District',
      mandal: 'Mandal',
      crop: 'Crop Details',
      otherCrop: 'Enter Crop Name',
      otherLocation: 'Specify Location',
      submit: 'Save & Enter Portal',
      back: 'Go Back',
      switchLogin: 'Already have an account? Log In',
      switchRegister: 'Need an account? Register',
      error: 'Something went wrong. Please try again.',
      userNotFound: 'Account not found. Please Register instead.'
    },
    chat: { 
      name: 'Kisan AI Assistant', 
      status: 'Online • 24/7 Support', 
      welcome: 'Namaste! Welcome back to KisanPortal. How can I help you optimize your harvest today? 🌾', 
      placeholder: 'Type your message...', 
      quickActions: 'Quick Actions',
      actions: { weather: 'Weather', soil: 'Soil', market: 'Market', seed: 'Seeds' }
    },
    toast: { welcome: 'Namaste', status: 'AI Assistant Online' }
  },
  hi: {
    nav: { home: 'मुख्य', cropDetails: 'फसल', weather: 'मौसम', dashboard: 'डैशबोर्ड', suggestions: 'सुझाव', login: 'लॉगिन', register: 'पंजीकरण', logout: 'लॉगआउट' },
    auth: { titleLogin: 'वापसी पर स्वागत है', titleRegister: 'नया पंजीकरण', subtitle: 'किसापोर्टल तक सुरक्षित पहुंच', switchLogin: 'पहले से खाता है? लॉगिन करें', switchRegister: 'खाता नहीं है? पंजीकरण करें', phone: 'फ़ोन नंबर', phonePlaceholder: '98765 43210', sendOtp: 'कोड भेजें', otp: 'कोड दर्ज करें', verify: 'ओटीपी सत्यापित करें', profile: 'प्रोफ़ाइल पूरी करें', name: 'पूरा नाम', state: 'राज्य', district: 'जिला', mandal: 'मंडल', crop: 'फसल', otherCrop: 'फसल का नाम लिखें', otherLocation: 'स्थान निर्दिष्ट करें', submit: 'सहेजें और प्रवेश करें', back: 'वापस जाएं', error: 'त्रुटि हुई।', userNotFound: 'खाता नहीं मिला। कृपया पंजीकरण करें।' },
    hero: { badge: 'भारतीय कृषि का सशक्तिकरण', title: 'आज ही भविष्य की खेती करें', desc: 'किसानपोर्टल आधुनिक उत्पादकों के लिए एक निश्चित पारिस्थितिकी तंत्र है।' },
    chat: { name: 'किसान एआई सहायक', status: 'ऑनलाइन', welcome: 'नमस्ते! किसानपोर्टल पर वापस स्वागत है।', actions: { weather: 'मौसम', soil: 'मिट्टी', market: 'बाजार', seed: 'बीज' } },
    toast: { welcome: 'नमस्ते', status: 'सहायक ऑनलाइन' }
  }
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
];

// --- Authentication Modal ---

const AuthModal = ({ isOpen, onClose, lang, t, onAuthSuccess, initialMode = 'login' }: any) => {
  const [mode, setMode] = useState(initialMode); 
  const [step, setStep] = useState('phone'); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const [profile, setProfile] = useState({ 
    name: '', 
    state: '', 
    district: '', 
    mandal: '', 
    crop: '',
    otherState: '',
    otherDistrict: '',
    otherMandal: '',
    otherCrop: ''
  });

  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, [isOpen]);

  useEffect(() => {
    setMode(initialMode);
    setStep('phone');
    setError('');
    setLoading(false);
  }, [isOpen, initialMode]);

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+91${formattedPhone}`;
      }
      const appVerifier = recaptchaVerifierRef.current;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err) {
      setError(t.auth.error);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await confirmationResult.confirm(otp);
      const uid = result.user.uid;
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        onAuthSuccess(userData);
        onClose();
      } else {
        if (mode === 'login') {
          setError(t.auth.userNotFound);
        } else {
          setStep('profile');
        }
      }
    } catch (err) {
      setError(t.auth.error);
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No user authenticated");

      const finalProfile = {
        name: profile.name,
        state: profile.state === 'Other' ? profile.otherState : profile.state,
        district: profile.district === 'Other' ? profile.otherDistrict : profile.district,
        mandal: profile.mandal === 'Other' ? profile.otherMandal : profile.mandal,
        crop: profile.crop === 'Other' ? profile.otherCrop : profile.crop,
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
        registeredAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), finalProfile);
      onAuthSuccess(finalProfile);
      onClose();
    } catch (err) {
      setError(t.auth.error);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-8 bg-green-50 border-b border-green-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-green-900">{mode === 'login' ? t.auth.titleLogin : t.auth.titleRegister}</h2>
            <p className="text-sm text-green-700/70">{t.auth.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full text-green-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{error}</div>}
          
          {step === 'phone' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t.auth.phone}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-slate-300 group-focus-within:text-green-600 transition-colors" />
                    <span className="text-slate-400 font-bold border-r border-slate-200 pr-2">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t.auth.phonePlaceholder}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-24 pr-4 focus:border-green-500 focus:bg-white transition-all outline-none font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={handleSendOtp}
                disabled={loading || !phoneNumber}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-200"
              >
                {loading ? 'Processing...' : t.auth.sendOtp}
              </button>
              <div className="text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-sm font-bold text-green-700 hover:underline"
                >
                  {mode === 'login' ? t.auth.switchRegister : t.auth.switchLogin}
                </button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">{t.auth.otp}</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-4 text-center text-3xl tracking-[1em] focus:border-green-500 focus:bg-white transition-all outline-none font-black"
                />
              </div>
              <button 
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-200"
              >
                {loading ? 'Verifying...' : t.auth.verify}
              </button>
              <button onClick={() => setStep('phone')} className="w-full text-slate-400 font-bold hover:text-green-600 transition-colors">{t.auth.back}</button>
            </div>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Phone Verified
                </div>
                <h3 className="text-xl font-bold text-slate-800">{t.auth.profile}</h3>
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.name}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3 pl-10 pr-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.state}</label>
                <select 
                  required 
                  value={profile.state} 
                  onChange={(e) => setProfile({...profile, state: e.target.value, district: '', mandal: ''})}
                  className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select State</option>
                  {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {profile.state === 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (State)</label>
                  <input required type="text" value={profile.otherState} onChange={(e) => setProfile({...profile, otherState: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              {profile.state && profile.state !== 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.district}</label>
                  <select 
                    required 
                    value={profile.district} 
                    onChange={(e) => setProfile({...profile, district: e.target.value, mandal: ''})}
                    className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {Object.keys(locationData[profile.state].districts).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}

              {profile.district === 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (District)</label>
                  <input required type="text" value={profile.otherDistrict} onChange={(e) => setProfile({...profile, otherDistrict: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              {profile.district && profile.district !== 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.mandal}</label>
                  <select 
                    required 
                    value={profile.mandal} 
                    onChange={(e) => setProfile({...profile, mandal: e.target.value})}
                    className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select Mandal</option>
                    {locationData[profile.state].districts[profile.district].map((m: string) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}

              {profile.mandal === 'Other' && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (Mandal)</label>
                  <input required type="text" value={profile.otherMandal} onChange={(e) => setProfile({...profile, otherMandal: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.crop}</label>
                <select 
                  required 
                  value={profile.crop} 
                  onChange={(e) => setProfile({...profile, crop: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select Primary Crop</option>
                  {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {profile.crop === 'Other' && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherCrop}</label>
                  <input required type="text" value={profile.otherCrop} onChange={(e) => setProfile({...profile, otherCrop: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="md:col-span-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-green-200 transition-all"
              >
                {loading ? 'Saving Profile...' : t.auth.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Scroll Reveal Hook ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    const targets = document.querySelectorAll('.fade-in');
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
};

// --- Main Components ---

const Chatbot = ({ isOpen, toggleChat, isLoggedIn, t }: any) => {
  if (!isLoggedIn) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <div className={`chatbot-window mb-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-green-700 p-5 text-white flex justify-between items-center shadow-lg shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Sprout className="w-6 h-6" /></div>
            <div>
              <span className="font-bold block">{t.chat.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-green-200">{t.chat.status}</span>
            </div>
          </div>
          <button onClick={toggleChat} className="hover:bg-black/10 p-2 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="h-[450px] p-6 overflow-y-auto bg-slate-50 space-y-5">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 flex-shrink-0 shadow-sm"><Leaf className="w-5 h-5" /></div>
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm text-sm text-slate-700 border border-slate-100 leading-relaxed max-w-[85%]">{t.chat.welcome}</div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-400 font-bold uppercase ml-12">{t.chat.quickActions}</p>
            <div className="flex flex-wrap gap-2 ml-10">
              {Object.entries((t.chat as any).actions).map(([key, label]: [string, any]) => (
                <button key={key} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-green-500 hover:text-green-600 transition-all shadow-sm">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 bg-white border-t border-slate-100 flex gap-3 items-center shrink-0">
          <input type="text" placeholder={t.chat.placeholder} className="flex-1 text-sm bg-slate-100 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all outline-none" />
          <button className="bg-green-600 text-white p-3 rounded-2xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200"><Send className="w-5 h-5" /></button>
        </div>
      </div>
      <button onClick={toggleChat} className={`pulse-btn relative w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 hover:scale-110 transition-all duration-500 z-[61] ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};

const Navbar = ({ isLoggedIn, userProfile, onOpenAuth, onLogout, lang, setLang, t }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', icon: Leaf },
    { key: 'cropDetails', icon: Wheat },
    { key: 'weather', icon: CloudSun },
    { key: 'dashboard', icon: LayoutDashboard },
    { key: 'suggestions', icon: Search }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md py-2 md:py-3' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="bg-green-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-md"><Sprout className="text-white w-5 h-5 md:w-6 md:h-6" /></div>
          <span className={`text-lg md:text-xl font-black tracking-tighter ${scrolled ? 'text-green-900' : 'text-white'}`}>KisanPortal</span>
        </div>

        <div className="hidden xl:flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center space-x-4 mr-2">
            {navItems.map((item) => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all hover:text-green-500 flex items-center gap-1.5 whitespace-nowrap ${scrolled ? 'text-slate-600' : 'text-slate-100'}`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {(t.nav as any)[item.key]}
              </a>
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-400/20"></div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${scrolled ? 'border-slate-200 text-slate-700 bg-slate-50' : 'border-white/20 text-white bg-white/10 hover:bg-white/20'}`}>
                <Globe className="w-3.5 h-3.5" />
                {languages.find(l => l.code === lang)?.name || 'Lang'}
              </button>
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-xl border border-slate-100 overflow-hidden w-28 py-1.5">
                  {languages.map(l => <button key={l.code} onClick={() => { setLang(l.code); setIsLangOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[10px] hover:bg-green-50 transition-colors ${lang === l.code ? 'text-green-600 font-bold bg-green-50/50' : 'text-slate-600'}`}>{l.name}</button>)}
                </div>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button onClick={() => onOpenAuth('login')} className="flex items-center gap-2 bg-white/10 border border-white/30 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-white/20 transition-all whitespace-nowrap"><LogIn className="w-3.5 h-3.5" />{t.nav.login}</button>
                <button onClick={() => onOpenAuth('register')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-lg hover:shadow-green-300/40 transition-all whitespace-nowrap"><UserPlus className="w-3.5 h-3.5" />{t.nav.register}</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${scrolled ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white/10 border-white/20 text-white'}`}>
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white"><User className="w-3 h-3" /></div>
                  <span className="text-[9px] font-black uppercase tracking-wider max-w-[80px] truncate">{userProfile?.name || 'Farmer'}</span>
                </div>
                <button onClick={onLogout} className={`flex items-center gap-1.5 font-black text-[10px] hover:text-red-600 transition-all ${scrolled ? 'text-slate-500' : 'text-white/70'}`}><LogOut className="w-3.5 h-3.5" />{t.nav.logout}</button>
              </div>
            )}
          </div>
        </div>

        <button className="xl:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className={scrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-slate-900' : 'text-white'} />}</button>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-white border-b absolute w-full left-0 p-6 space-y-6 shadow-2xl animate-fadeIn overflow-y-auto max-h-[80vh]">
          {navItems.map((item) => <a key={item.key} href={`#${item.key}`} className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase py-2" onClick={() => setIsOpen(false)}><item.icon className="w-5 h-5" />{(t.nav as any)[item.key]}</a>)}
          {!isLoggedIn ? (
            <div className="space-y-3">
              <button onClick={() => {onOpenAuth('login'); setIsOpen(false)}} className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><LogIn className="w-6 h-6" /> {t.nav.login}</button>
              <button onClick={() => {onOpenAuth('register'); setIsOpen(false)}} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><UserPlus className="w-6 h-6" /> {t.nav.register}</button>
            </div>
          ) : (
            <button onClick={() => {onLogout(); setIsOpen(false)}} className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><LogOut className="w-6 h-6" /> {t.nav.logout}</button>
          )}
        </div>
      )}
    </nav>
  );
};

// --- Landing Sections ---

const SectionHero = ({ t }: any) => (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-32">
    <div className="absolute inset-0 z-0 scale-105 animate-[slowZoom_20s_infinite_alternate]">
      <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400" alt="Field" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
    </div>
    <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 text-white w-full">
      <div className="max-w-4xl pt-8 lg:pt-0">
        <div className="inline-flex items-center gap-3 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-full px-4 py-1.5 mb-8 animate-[fadeInLeft_1s_ease-out]">
          <div className="bg-green-400 w-1.5 h-1.5 rounded-full animate-pulse"></div>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-green-300">{(t.hero as any).badge}</span>
        </div>
        <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif leading-[1.1] mb-8 animate-[fadeInUp_1s_ease-out] drop-shadow-2xl">
          {(t.hero as any).title.split(' ')[0]} <br /><span className="text-green-400">{(t.hero as any).title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed font-light opacity-90 drop-shadow-lg">{(t.hero as any).desc}</p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-green-900/40 hover:-translate-y-1">
            {(t.hero as any).join} <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-2xl hover:-translate-y-1">{(t.hero as any).explore}</button>
        </div>
      </div>
    </div>
  </section>
);

const SectionImportance = ({ t }: any) => (
  <section id="backbone" className="py-24 md:py-32 bg-white">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
      <div className="fade-in relative">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-60"></div>
        <div className="relative z-10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1200" alt="Farmer" className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform" />
        </div>
        <div className="absolute -bottom-12 -right-12 bg-green-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-sm hidden xl:block z-20 border-8 border-white">
          <p className="italic text-lg md:text-xl mb-6 leading-relaxed">"{(t.importance as any).quote}"</p>
          <div className="h-px w-12 bg-green-400 mb-4"></div>
          <span className="font-black text-green-400 uppercase tracking-widest text-sm">— KisanPortal Insights</span>
        </div>
      </div>
      <div className="fade-in">
        <span className="text-green-600 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">{(t.importance as any).badge}</span>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-slate-900 mb-8 leading-tight">{(t.importance as any).title}</h2>
        <p className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-light">{(t.importance as any).desc}</p>
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {[ShieldCheck, Users, TrendingUp, Sprout].map((Icon, idx) => (
            <div key={idx} className="flex flex-col gap-4 p-5 md:p-6 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm"><Icon className="w-6 h-6 md:w-7 md:h-7" /></div>
              <h3 className="text-base md:text-lg font-black text-slate-900">Resource {idx + 1}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const SectionTech = ({ t }: any) => (
  <section id="tech" className="py-24 md:py-32 bg-slate-50 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="flex flex-col lg:flex-row justify-between items-end mb-16 md:mb-20 gap-8 md:gap-12 fade-in">
        <div className="max-w-2xl">
          <span className="text-green-600 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">{(t.tech as any).badge}</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-tight">{(t.tech as any).title} <span className="text-green-600 italic">{(t.tech as any).subtitle}</span></h2>
        </div>
        <p className="text-slate-500 text-lg md:text-xl max-w-md lg:text-right font-light leading-relaxed">{(t.tech as any).desc}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {[Tractor, Droplets, Microscope].map((Icon, idx) => (
          <div key={idx} className="fade-in group bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-200/50 p-8 md:p-10">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 mb-8 group-hover:bg-green-600 group-hover:text-white transition-all"><Icon className="w-7 h-7 md:w-8 md:h-8" /></div>
            <h3 className="text-xl md:text-2xl font-black mb-4">Innovation {idx + 1}</h3>
            <p className="text-slate-500 leading-relaxed text-base md:text-lg font-light">Advanced digital infrastructure for modern farming needs.</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SectionFeatures = ({ t }: any) => (
  <section id="features" className="py-24 md:py-32 bg-green-950 text-white relative overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
      <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 fade-in">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif mb-8 leading-tight">{(t.features as any).title}</h2>
        <div className="h-1 w-24 md:w-32 bg-green-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {[{icon: CloudSun, key: 'weather'}, {icon: TrendingUp, key: 'market'}, {icon: Users, key: 'coop'}, {icon: ShieldCheck, key: 'insurance'}].map((item, idx) => (
          <div key={idx} className="fade-in border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] transition-all group hover:-translate-y-2">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-400 mb-8 group-hover:scale-110 group-hover:bg-green-500 transition-all shadow-lg"><item.icon className="w-8 h-8 md:w-9 md:h-9" /></div>
            <h3 className="text-xl md:text-2xl font-black mb-4">{(t.features as any)[item.key]}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ t }: any) => (
  <footer className="bg-slate-950 pt-24 md:pt-32 pb-12 text-slate-400 text-center shrink-0">
    <div className="max-w-[1600px] mx-auto px-6 md:px-12">
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="bg-green-600 p-2 rounded-2xl"><Sprout className="text-white w-6 h-6 md:w-8 md:h-8" /></div>
        <span className="text-2xl md:text-3xl font-black text-white">KisanPortal</span>
        <p className="max-w-xl text-base md:text-lg opacity-60 leading-relaxed">Dedicated to the digital transformation of agriculture in India.</p>
      </div>
      <div className="pt-12 border-t border-slate-900 text-[10px] font-bold uppercase tracking-widest flex justify-center gap-8 md:gap-10">
        <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
      </div>
    </div>
  </footer>
);

// --- App Root ---

const App: React.FC = () => {
  useScrollReveal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
  const [lang, setLang] = useState<string>('en');
  const [userProfile, setUserProfile] = useState<any>(null);

  const t = (translations as any)[lang] || translations.en;

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          setIsLoggedIn(true);
        } else {
          // Trigger registration profile setup if user exists in Auth but not in Firestore
          setAuthModal({ isOpen: true, mode: 'register' });
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });
  }, []);

  const handleAuthSuccess = (profile: any) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col selection:bg-green-100 selection:text-green-900">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userProfile={userProfile}
        onOpenAuth={(mode: 'login' | 'register') => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout} 
        lang={lang}
        setLang={setLang}
        t={t}
      />
      
      <main className="w-full flex-1">
        <SectionHero t={t} />
        <SectionImportance t={t} />
        <SectionTech t={t} />
        <SectionFeatures t={t} />
      </main>
      
      <Footer t={t} />
      
      <Chatbot 
        isLoggedIn={isLoggedIn} 
        isOpen={isChatOpen} 
        toggleChat={() => setIsChatOpen(!isChatOpen)} 
        t={t}
      />

      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        lang={lang} 
        t={t} 
        onAuthSuccess={handleAuthSuccess}
      />
      
      {isLoggedIn && !isChatOpen && (
        <div className="fixed bottom-24 right-10 bg-white border border-green-100 shadow-2xl p-5 md:p-6 rounded-[2rem] animate-[bounceIn_0.6s_ease-out] z-50 flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <Users className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-base md:text-lg font-black text-slate-800">{(t.toast as any).welcome}, {userProfile?.name?.split(' ')[0] || 'Farmer'}!</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{(t.toast as any).status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
