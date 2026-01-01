
import React, { useEffect, useState, useRef } from 'react';
import { 
  Sprout, CloudSun, MapPin, ChevronRight, Menu, X, LogOut, User, Globe, Wheat, 
  Search, Sparkles, Thermometer, Wind, Droplet, Send, RefreshCw, AlertTriangle, 
  BarChart3, Plus, Settings, Calendar, ShieldCheck, TrendingUp, ArrowRight, LayoutDashboard
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

// --- Constants & Data ---
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' }
];

const cropOptions = ["Paddy", "Wheat", "Cotton", "Chilli", "Turmeric", "Maize", "Tomato", "Sugarcane"];

const locationData: any = {
  "Andhra Pradesh": {
    "Visakhapatnam": ["Anandapuram", "Pendurthi", "Bheemunipatnam", "Gajuwaka"],
    "Guntur": ["Tenali", "Mangalagiri", "Ponnur", "Bapatla"],
    "Chittoor": ["Tirupati", "Madanapalle", "Palamaner", "Srikalahasti"]
  },
  "Telangana": {
    "Hyderabad": ["Ameerpet", "Khairatabad", "Secunderabad", "Gachibowli"],
    "Warangal": ["Hanamkonda", "Kazipet", "Dharmasagar", "Parkal"],
    "Nizamabad": ["Armoor", "Bodhan", "Balkonda", "Nizamabad Rural"]
  },
  "Maharashtra": {
    "Pune": ["Haveli", "Maval", "Mulshi", "Shirur"],
    "Nashik": ["Niphad", "Malegaon", "Sinnar", "Yeola"],
    "Nagpur": ["Katol", "Ramtek", "Saoner", "Kalmeshwar"]
  },
  "Tamil Nadu": {
    "Chennai": ["Egmore", "Mylapore", "Saidapet", "Tondiarpet"],
    "Coimbatore": ["Annur", "Mettupalayam", "Pollachi", "Sulur"],
    "Madurai": ["Melur", "Peraiyur", "Thirumangalam", "Vadipatti"]
  }
};

const translations: any = {
  en: {
    nav: { home: 'Home', crops: 'Crops', weather: 'Weather', dashboard: 'Dashboard', suggestions: 'AI Advice', login: 'Login', register: 'Register', logout: 'Logout' },
    hero: { badge: 'Precision Agriculture', title: 'Smart Farming for a Greener Future', desc: 'Harness AI and real-time data to maximize your yield.', join: 'Join Now', explore: 'Explore' },
    auth: { login: 'Sign In', register: 'Create Account', phone: 'Mobile Number', otp: 'Enter 6-digit OTP', send: 'Send OTP', verify: 'Verify & Continue', name: 'Full Name', state: 'Select State', district: 'Select District', mandal: 'Select Mandal', crop: 'Primary Crop', finish: 'Complete Profile' },
    dash: { welcome: 'Welcome back', addCrop: 'Add New Crop', status: 'Verified Farmer', location: 'Location Details', profile: 'Farmer Profile' }
  },
  hi: {
    nav: { home: 'होम', crops: 'फसलें', weather: 'मौसम', dashboard: 'डैशबोर्ड', suggestions: 'एआई सलाह', login: 'लॉगिन', register: 'रजिस्टर', logout: 'लॉगआउट' },
    hero: { badge: 'सटीक कृषि', title: 'बेहतर भविष्य के लिए स्मार्ट खेती', desc: 'अपनी पैदावार बढ़ाने के लिए एआई का उपयोग करें।', join: 'अभी जुड़ें', explore: 'एक्सप्लोर करें' },
    auth: { login: 'लॉगिन', register: 'खाता बनाएं', phone: 'मोबाइल नंबर', otp: 'ओटीपी डालें', send: 'ओटीपी भेजें', verify: 'सत्यापित करें', name: 'पूरा नाम', state: 'राज्य चुनें', district: 'जिला चुनें', mandal: 'मंडल चुनें', crop: 'मुख्य फसल', finish: 'प्रोफ़ाइल पूरी करें' },
    dash: { welcome: 'आपका स्वागत है', addCrop: 'नई फसल जोड़ें', status: 'सत्यापित किसान', location: 'स्थान विवरण', profile: 'किसान प्रोफ़ाइल' }
  },
  te: {
    nav: { home: 'హోమ్', crops: 'పంటలు', weather: 'వాతావరణం', dashboard: 'డ్యాష్‌బోర్డ్', suggestions: 'AI సలహా', login: 'లాగిన్', register: 'రిజిస్టర్', logout: 'లాగౌట్' },
    hero: { badge: 'ఖచ్చితమైన వ్యవసాయం', title: 'మెరుగైన భవిష్యత్తు కోసం స్మార్ట్ ఫార్మింగ్', desc: 'మీ దిగుబడిని పెంచుకోవడానికి AI మరియు నిజ-సమయ డేటాను ఉపయోగించండి.' },
    auth: { login: 'లాగిన్', register: 'ఖాతాను సృష్టించండి', phone: 'మొబైల్ నంబర్', otp: 'OTP నమోదు చేయండి', send: 'OTP పంపండి', verify: 'ధృవీకరించండి', name: 'పూర్తి పేరు', state: 'రాష్ట్రం', district: 'జిల్లా', mandal: 'మండలం', crop: 'పంట', finish: 'పూర్తి చేయండి' },
    dash: { welcome: 'తిరిగి స్వాగతం', addCrop: 'కొత్త పంటను జోడించండి', status: 'ధృవీకరించబడిన రైతు', location: 'స్థాన వివరాలు', profile: 'రైతు ప్రొఫైల్' }
  },
  ta: {
    nav: { home: 'முகப்பு', crops: 'பயிர்கள்', weather: 'வானிலை', dashboard: 'டாஷ்போர்டு', suggestions: 'AI ஆலோசனை', login: 'உள்நுழை', register: 'பதிவு', logout: 'வெளியேறு' },
    hero: { badge: 'துல்லியமான விவசாயம்', title: 'பசுமையான எதிர்காலத்திற்காக ஸ்மார்ட் விவசாயம்', desc: 'உங்கள் விளைச்சலை அதிகரிக்க AI மற்றும் நிகழ்நேர தரவைப் பயன்படுத்துங்கள்.' },
    auth: { login: 'உள்நுழை', register: 'கணக்கை உருவாக்கு', phone: 'கைபேசி எண்', otp: 'OTP உள்ளிடவும்', send: 'OTP அனுப்பு', verify: 'சரிபார்க்கவும்', name: 'முழு பெயர்', state: 'மாநிலம்', district: 'மாவட்டம்', mandal: 'வட்டம்', crop: 'பயிர்', finish: 'முடிக்க' },
    dash: { welcome: 'மீண்டும் வருக', addCrop: 'புதிய பயிர் சேர்', status: 'சரிபார்க்கப்பட்ட விவசாயி', location: 'இட விவரங்கள்', profile: 'விவசாயி சுயவிவரம்' }
  }
};

// --- Sub-components ---

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-green-200 transition-colors">
    <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-slate-400 text-[9px] font-black uppercase mb-1">{label}</span>
    <span className="text-xl font-black">{value}</span>
  </div>
);

const AuthModal = ({ isOpen, mode, onClose, t, onAuthSuccess }: any) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: '', state: '', district: '', mandal: '', crop: '' });

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      if (!phone || phone.length < 10) throw new Error("Please enter a valid mobile number.");
      
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-anchor', { 
        size: 'invisible',
        callback: () => console.log('Recaptcha resolved')
      });
      
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setVerificationId(result);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Try again.");
      console.error(err);
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
      
      if (mode === 'login') {
        if (docSnap.exists()) {
          onAuthSuccess(docSnap.data());
        } else {
          setError("Account not found. Please register first.");
          await signOut(auth);
          setStep('phone');
        }
      } else {
        // Register mode
        if (docSnap.exists()) {
          setError("Account already exists. Please login.");
          await signOut(auth);
          setStep('phone');
        } else {
          setStep('profile');
        }
      }
    } catch (err: any) {
      setError("Invalid OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishProfile = async () => {
    try {
      setLoading(true);
      if (!profile.name || !profile.state || !profile.district || !profile.mandal || !profile.crop) {
        throw new Error("Please fill all fields.");
      }
      const user = auth.currentUser;
      if (!user) throw new Error("Session expired.");
      const data = { ...profile, uid: user.uid, phone: user.phoneNumber, createdAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', user.uid), data);
      onAuthSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative animate-scaleIn border border-white/20">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={16} /></button>
        <h3 className="text-2xl font-serif text-slate-900 mb-2">{mode === 'login' ? t.auth.login : t.auth.register}</h3>
        <p className="text-slate-500 text-xs mb-8">{step === 'profile' ? 'Setup your agricultural profile' : 'Secure OTP-based access'}</p>
        
        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-[10px] border border-red-100 flex items-center gap-2"><AlertTriangle size={14}/>{error}</div>}

        {step === 'phone' && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="tel" placeholder={t.auth.phone} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 ring-green-500 outline-none transition-all" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button onClick={handleSendOtp} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.send}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <input type="text" placeholder={t.auth.otp} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center text-xl tracking-[0.4em] font-bold focus:ring-2 ring-green-500 outline-none" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-green-600/20">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.verify}
            </button>
            <button onClick={() => setStep('phone')} className="w-full text-[9px] font-black uppercase text-slate-400 tracking-widest text-center mt-2">Change Mobile Number</button>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{t.auth.name}</label>
              <input type="text" placeholder="E.g. Ramesh Kumar" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-green-500" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
            </div>
            
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{t.auth.state}</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={profile.state} onChange={(e) => setProfile({...profile, state: e.target.value, district: '', mandal: ''})}>
                <option value="">{t.auth.state}</option>
                {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {profile.state && (
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{t.auth.district}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={profile.district} onChange={(e) => setProfile({...profile, district: e.target.value, mandal: ''})}>
                  <option value="">{t.auth.district}</option>
                  {Object.keys(locationData[profile.state]).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {profile.district && (
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{t.auth.mandal}</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={profile.mandal} onChange={(e) => setProfile({...profile, mandal: e.target.value})}>
                  <option value="">{t.auth.mandal}</option>
                  {locationData[profile.state][profile.district].map((m: string) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{t.auth.crop}</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={profile.crop} onChange={(e) => setProfile({...profile, crop: e.target.value})}>
                <option value="">{t.auth.crop}</option>
                {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={handleFinishProfile} disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-600/20 mt-4">
              {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : t.auth.finish}
            </button>
          </div>
        )}
        <div id="recaptcha-anchor"></div>
      </div>
    </div>
  );
};

const DashboardView = ({ userProfile, t }: any) => {
  return (
    <div className="pt-24 pb-12 w-full max-w-[1440px] mx-auto px-8 animate-fadeInUp">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Left: Beautiful Profile Card */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-600/30">
                <User size={40} />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 mb-1">{userProfile?.name}</h2>
              <div className="flex items-center gap-2 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase border border-green-100">
                  <ShieldCheck size={12}/> {t.dash.status}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest block mb-2">{t.dash.location}</span>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400"><MapPin size={16}/></div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold leading-none">{userProfile?.state}</p>
                        <p className="text-sm font-bold text-slate-900">{userProfile?.district}, {userProfile?.mandal}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400"><Wheat size={16}/></div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold leading-none">{t.auth.crop}</p>
                        <p className="text-sm font-bold text-slate-900">{userProfile?.crop}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                  <Settings size={16}/> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Management & Analytics */}
        <div className="flex-1 w-full space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Farm Management</h3>
              <p className="text-slate-400 text-sm">Real-time overview of your agricultural assets.</p>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-green-600/30 hover:scale-105 active:scale-95 transition-all">
              <Plus size={18} /> {t.dash.addCrop}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Wheat size={24}/>} label="Active Crop" value={userProfile?.crop} color="green" />
            <StatCard icon={<Calendar size={24}/>} label="Cycle Progress" value="65%" color="blue" />
            <StatCard icon={<TrendingUp size={24}/>} label="Market Price" value="↑ 12%" color="orange" />
            {/* Fix: Droplets to Droplet */}
            <StatCard icon={<Droplet size={24}/>} label="Irrigation" value="Normal" color="cyan" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CloudSun className="text-blue-500" size={20}/> Daily Weather Feed
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-medium text-slate-600">Morning Temp</span>
                  <span className="text-sm font-bold">24°C</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="text-sm font-medium text-slate-600">Humidity Levels</span>
                  <span className="text-sm font-bold">58%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <span className="text-sm font-bold">Rain Prediction</span>
                  <span className="text-sm font-black">Low (5%)</span>
                </div>
              </div>
            </div>

            <div className="bg-green-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h4 className="text-xl font-serif mb-3">AI Recommendation</h4>
                <p className="text-green-100/70 text-sm leading-relaxed mb-6">Localized analysis for {userProfile?.mandal} shows increasing soil alkalinity. Consider adjusting phosphate application for your next {userProfile?.crop} cycle.</p>
              </div>
              <button className="relative z-10 flex items-center gap-2 text-green-400 font-black uppercase text-[9px] tracking-[0.2em] hover:translate-x-1 transition-all">
                Access Full AI Lab <ArrowRight size={14}/>
              </button>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-500/10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
  const [lang, setLang] = useState('en');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState('home');

  // AI Expert States
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });
    return () => unsub();
  }, [authModal.isOpen]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loadingAi]);

  const handleNav = (v: string) => {
    if (['dashboard', 'weather', 'suggestions'].includes(v) && !isLoggedIn) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    setCurrentView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Implement AI Chat Logic
  const handleAskAI = async () => {
    if (!input.trim() || loadingAi) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoadingAi(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: `You are an expert agricultural scientist named "Kisan AI Expert". Your goal is to provide scientific, practical, and localized farming advice specifically for the Indian context. 
          Use the following farmer profile to personalize your advice: 
          Name: ${userProfile?.name}
          Location: ${userProfile?.mandal}, ${userProfile?.district}, ${userProfile?.state}
          Primary Crop: ${userProfile?.crop}
          
          Respond in ${languages.find(l => l.code === lang)?.name || 'English'}. Keep advice actionable, scientific, and empathetic to the farming challenges.`,
          temperature: 0.7,
        },
      });

      const aiResponseText = response.text || "I apologize, but I am unable to generate a recommendation at this moment. Please try rephrasing your question.";
      setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I encountered a technical issue while processing your request. Please check your connectivity or try again later." }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${window.scrollY > 20 || currentView !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="w-full max-w-[1440px] mx-auto px-8 flex justify-between items-center">
        <div className="flex flex-col cursor-pointer" onClick={() => handleNav('home')}>
          <div className="flex items-center gap-2">
            <Sprout className="text-green-600 w-6 h-6" />
            <span className={`text-2xl font-black tracking-tighter ${currentView === 'home' && window.scrollY <= 20 ? 'text-white' : 'text-slate-900'}`}>KisanPortal</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-8">
            {['home', 'crops', 'weather', 'suggestions', 'dashboard'].map(k => (
              <button 
                key={k} 
                onClick={() => handleNav(k)} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${currentView === k ? 'text-green-600' : (currentView === 'home' && window.scrollY <= 20 ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
              >
                {t.nav[k]}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-green-600 transition-all ${currentView === k ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className={`p-1 rounded-xl flex items-center gap-1 border ${currentView === 'home' && window.scrollY <= 20 ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'}`}>
              <Globe size={14} className={`${currentView === 'home' && window.scrollY <= 20 ? 'text-white/60' : 'text-slate-400'} mx-1`} />
              <select value={lang} onChange={(e) => setLang(e.target.value)} className={`bg-transparent text-[10px] font-black uppercase outline-none pr-1 ${currentView === 'home' && window.scrollY <= 20 ? 'text-white' : 'text-slate-900'}`}>
                {languages.map(l => <option key={l.code} value={l.code} className="text-slate-900">{l.name}</option>)}
              </select>
            </div>
            
            {!isLoggedIn ? (
              <div className="flex gap-3">
                <button onClick={() => setAuthModal({isOpen: true, mode: 'login'})} className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 hover:scale-105 transition-all">Login</button>
                <button onClick={() => setAuthModal({isOpen: true, mode: 'register'})} className="px-6 py-2.5 border border-green-600 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-50 transition-all hidden md:block">Register</button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs uppercase">{userProfile?.name?.charAt(0)}</div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${currentView === 'home' && window.scrollY <= 20 ? 'text-white' : 'text-slate-900'}`}>{userProfile?.name?.split(' ')[0]}</span>
                </div>
                <button onClick={() => signOut(auth)} className="text-red-500 hover:text-red-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors">
                  <LogOut size={16}/> {t.nav.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
      <Navbar />
      
      <main>
        {currentView === 'home' && (
          <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400" className="w-full h-full object-cover animate-slowZoom" alt="Hero" />
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
            </div>
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-12 pt-20">
              <div className="max-w-2xl text-left animate-fadeInLeft">
                <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-8 border border-green-500/30">
                  <span className="text-green-100 text-[10px] font-black uppercase tracking-[0.2em]">{t.hero.badge}</span>
                </div>
                <h1 className="text-6xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight">{t.hero.title}</h1>
                <p className="text-xl text-slate-300 mb-12 leading-relaxed font-light max-w-lg">{t.hero.desc}</p>
                <div className="flex flex-wrap gap-5">
                  <button onClick={() => handleNav('dashboard')} className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-green-600/30 hover:bg-green-700 transition-all hover:-translate-y-1">Get Started</button>
                  <button onClick={() => handleNav('crops')} className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">Explore Repository</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentView === 'dashboard' && <DashboardView userProfile={userProfile} t={t} />}

        {currentView === 'weather' && (
          <div className="pt-32 pb-16 w-full max-w-[1440px] mx-auto px-8 animate-fadeInUp">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-serif text-slate-900 mb-2 tracking-tight">Weather Intelligence</h2>
                <p className="text-slate-500 text-base">Local agricultural weather insights for {userProfile?.mandal || 'your farm location'}.</p>
              </div>
              <div className="bg-green-50 text-green-700 px-5 py-2.5 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-black uppercase tracking-widest">
                <MapPin size={18} className="text-green-600"/> {userProfile?.district}, {userProfile?.state}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <StatCard icon={<Thermometer size={28}/>} label="Current Temp" value="31.4°C" color="blue" />
              <StatCard icon={<Droplet size={28}/>} label="Air Humidity" value="62%" color="cyan" />
              <StatCard icon={<Wind size={28}/>} label="Wind Flow" value="14.2 km/h" color="slate" />
              <StatCard icon={<CloudSun size={28}/>} label="Sky Status" value="Mainly Clear" color="yellow" />
            </div>
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-50">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><CloudSun size={24}/></div>
                <h4 className="text-xl font-serif">5-Day Forecast</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1,2,3,4,5].map(day => (
                  <div key={day} className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4">Day {day}</p>
                    <CloudSun size={32} className="mx-auto text-blue-400 mb-4" />
                    <p className="text-xl font-black text-slate-900">{28 + day}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'crops' && (
          <div className="pt-32 pb-16 w-full max-w-[1440px] mx-auto px-8 animate-fadeInUp">
             <div className="mb-12">
               <h2 className="text-4xl font-serif text-slate-900 mb-2 tracking-tight">Crop Repository</h2>
               <p className="text-slate-500 text-base">Expert guidance for high-yield cultivation of popular Indian crops.</p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cropOptions.map(crop => (
                  <div key={crop} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="h-40 bg-slate-50 flex items-center justify-center relative">
                      <Wheat size={64} className="text-green-600/20 group-hover:scale-110 transition-transform" />
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-green-600 border border-green-50 shadow-sm">Kharif</div>
                    </div>
                    <div className="p-8">
                      <h4 className="text-2xl font-bold text-slate-900 mb-4">{crop}</h4>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">Optimal soil pH: 6.0-7.5. Requires consistent moisture throughout the vegetative stage.</p>
                      <button className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-3 transition-all">
                        View Guidelines <ArrowRight size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {currentView === 'suggestions' && (
          <div className="pt-32 pb-16 w-full max-w-[1000px] mx-auto px-8 animate-fadeInUp">
             <div className="text-center mb-12">
               <h2 className="text-4xl font-serif text-slate-900 mb-2">AI Agriculture Expert</h2>
               <p className="text-slate-500 text-base">Instant, scientific advice for pest control, soil enrichment, and market strategy.</p>
             </div>
             <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[600px]">
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 scroll-smooth custom-scrollbar bg-slate-50/30">
                   <div className="flex justify-start">
                      <div className="max-w-[80%] p-6 rounded-3xl rounded-tl-none bg-white border border-slate-100 text-slate-600 text-sm shadow-sm">
                         Hello! I am your Kisan AI Expert. How can I help you improve your farm today?
                      </div>
                   </div>
                   {messages.map((m, idx) => (
                     <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-6 rounded-3xl text-sm shadow-sm ${m.role === 'user' ? 'rounded-tr-none bg-green-600 text-white' : 'rounded-tl-none bg-white border border-slate-100 text-slate-600'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                   {loadingAi && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3">
                           <RefreshCw className="animate-spin text-green-600 w-4 h-4" />
                           <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Consulting Knowledge Base...</span>
                        </div>
                     </div>
                   )}
                </div>
                <div className="p-8 bg-white border-t border-slate-50">
                   <div className="relative">
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                        placeholder="E.g. How to prevent yellowing of paddy leaves?" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-24 py-5 text-sm outline-none focus:ring-4 ring-green-500/10 focus:border-green-500 transition-all shadow-inner" 
                      />
                      <button 
                        onClick={handleAskAI}
                        disabled={loadingAi || !input.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all disabled:opacity-50"
                      >
                         {loadingAi ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Ask Expert'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 pt-24 pb-12 px-12 text-slate-400 mt-24">
        <div className="w-full max-w-[1440px] mx-auto grid md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Sprout className="text-green-500 w-8 h-8" />
              <span className="text-3xl font-black text-white tracking-tighter">KisanPortal</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed mb-10 text-slate-500">KisanPortal is India's leading precision agriculture platform, dedicated to empowering farmers with data-driven insights and AI intelligence for a sustainable future.</p>
          </div>
          <div>
            <h4 className="text-white text-[11px] font-black uppercase mb-8 tracking-[0.2em]">Platform</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('crops')}>Crop Repository</li>
              <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('weather')}>Weather Hub</li>
              <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('suggestions')}>AI Assistant</li>
              <li className="hover:text-green-500 cursor-pointer transition-colors" onClick={() => handleNav('dashboard')}>Kisan Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-[11px] font-black uppercase mb-8 tracking-[0.2em]">Support</h4>
            <div className="space-y-6">
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-600 mb-1 tracking-widest">Farmer Helpline</p>
                  <p className="text-2xl font-black text-white tracking-tighter">1800-KISAN-PRO</p>
               </div>
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-green-600 transition-all cursor-pointer"><Globe size={18} className="text-white"/></div>
                  <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center hover:bg-green-600 transition-all cursor-pointer"><ShieldCheck size={18} className="text-white"/></div>
               </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1440px] mx-auto border-t border-white/5 mt-20 pt-10 text-[9px] font-black uppercase tracking-[0.4em] opacity-30 flex justify-between items-center">
           <span>&copy; 2024 KisanPortal Precision Systems Pvt Ltd.</span>
           <div className="flex gap-8">
              <span className="cursor-pointer">Privacy Policy</span>
              <span className="cursor-pointer">Terms of Service</span>
           </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        mode={authModal.mode} 
        onClose={() => setAuthModal({isOpen: false, mode: 'login'})} 
        t={t} 
        onAuthSuccess={(p: any) => { 
          setUserProfile(p); 
          setIsLoggedIn(true); 
          setAuthModal({isOpen: false, mode: 'login'}); 
          setCurrentView('dashboard'); 
        }} 
      />
    </div>
  );
};

export default App;
