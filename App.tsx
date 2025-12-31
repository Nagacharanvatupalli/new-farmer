
import React, { useEffect, useState, useRef } from 'react';
import { 
  Leaf, Sprout, CloudSun, TrendingUp, ShieldCheck, Users, MapPin, 
  Phone, Mail, ChevronRight, Menu, X, Tractor, Droplets, Microscope, 
  LogIn, LogOut, MessageCircle, Send, User, Globe, CheckCircle2, 
  Wheat, Building2, LayoutDashboard, Search, UserPlus
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

// --- Extended Indian Location Data ---
const locationData: any = {
  "Andhra Pradesh": {
    districts: {
      "Guntur": ["Guntur Mandal 1", "Guntur Mandal 2", "Other"],
      "Krishna": ["Vijayawada", "Machilipatnam", "Nuzvid", "Other"],
      "Visakhapatnam": ["Visakhapatnam Urban", "Visakhapatnam Rural", "Gajuwaka", "Other"],
      "Anantapur": ["Anantapur", "Dharmavaram", "Guntakal", "Other"],
      "Other": ["Other"]
    }
  },
  "Telangana": {
    districts: {
      "Hyderabad": ["Ameerpet", "Madhapur", "Kukatpally", "Secunderabad", "Other"],
      "Warangal": ["Warangal Urban", "Warangal Rural", "Hanamkonda", "Other"],
      "Khammam": ["Khammam", "Wyra", "Sathupally", "Other"],
      "Nizamabad": ["Nizamabad", "Armur", "Bodhan", "Other"],
      "Other": ["Other"]
    }
  },
  "Karnataka": {
    districts: {
      "Bangalore": ["Bangalore North", "Bangalore South", "Bangalore East", "Other"],
      "Mysore": ["Mysore", "Hunsur", "Nanjangud", "Other"],
      "Belagavi": ["Belagavi", "Gokak", "Chikkodi", "Other"],
      "Other": ["Other"]
    }
  },
  "Tamil Nadu": {
    districts: {
      "Chennai": ["Chennai Central", "Chennai North", "Chennai South", "Other"],
      "Coimbatore": ["Coimbatore North", "Coimbatore South", "Pollachi", "Other"],
      "Madurai": ["Madurai North", "Madurai South", "Other"],
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
const translations: any = {
  en: {
    nav: { home: 'Home', cropDetails: 'Crops', weather: 'Weather', dashboard: 'Dashboard', suggestions: 'Suggestions', login: 'Login', register: 'Register', logout: 'Logout' },
    hero: { badge: 'Empowering Indian Agriculture', title: 'Cultivate the Future Today', desc: 'KisanPortal is the definitive ecosystem for modern growers. We bridge legacy farming wisdom with state-of-the-art analytics.', join: 'Join the Network', explore: 'Explore Services' },
    importance: { badge: 'The Backbone of Earth', title: 'Feeding Nations, Building Futures', desc: 'Every revolution in human history started with a surplus of food. KisanPortal honors this legacy by providing digital armor for guardians of the soil.', quote: 'Farmers are the only essential workers that create something out of nothing but a seed and hard work.' },
    tech: { badge: 'The Digital Harvest', title: 'High-Tech Solutions', subtitle: 'Deep-Rooted Traditions', desc: 'Harnessing the power of AI and IoT to create a sustainable agricultural future.' },
    features: { title: 'Everything You Need To Thrive', weather: 'Satellite Weather', market: 'Market Analytics', coop: 'Cooperative Lab', insurance: 'Smart Insurance' },
    auth: {
      titleLogin: 'Sign In', titleRegister: 'Create Account', subtitle: 'Secure access to KisanPortal', phone: 'Phone Number', phonePlaceholder: '98765 43210', sendOtp: 'Get OTP', otp: 'Enter 6-digit OTP', verify: 'Verify & Proceed',
      profile: 'Farmer Profile Information', name: 'Your Full Name', state: 'State', district: 'District', mandal: 'Mandal', crop: 'Primary Crop', otherCrop: 'Specify Crop', otherLocation: 'Specify Location',
      submit: 'Complete Registration', back: 'Go Back', switchLogin: 'Already a member? Login', switchRegister: 'New to KisanPortal? Register',
      error: 'Authentication failed. Please try again.', userNotFound: 'No profile found for this number. Please Register.', userExists: 'Account already exists for this number. Please Login.'
    },
    toast: { welcome: 'Welcome back', status: 'Identity Verified' }
  },
  hi: {
    nav: { home: 'मुख्य', cropDetails: 'फसल', weather: 'मौसम', dashboard: 'डैशबोर्ड', suggestions: 'सुझाव', login: 'लॉगिन', register: 'पंजीकरण', logout: 'लॉगआउट' },
    hero: { badge: 'भारतीय कृषि का सशक्तिकরণ', title: 'आज ही भविष्य की खेती करें', desc: 'किसानपोर्टल आधुनिक उत्पादकों के लिए एक पारिस्थितिकी तंत्र है।' },
    importance: { badge: 'पृथ्वी की रीढ़', title: 'राष्ट्रों को खिलाना, भविष्य का निर्माण', desc: 'मानव इतिहास में हर क्रांति खाद्य अधिशेष के साथ शुरू हुई।', quote: 'किसान ही एकमात्र आवश्यक कर्मचारी हैं जो केवल बीज और कड़ी मेहनत से कुछ भी बनाते हैं।' },
    tech: { badge: 'डिजिटल फसल', title: 'हाई-टेक समाधान', subtitle: 'गहरी जड़ें वाली परंपराएं', desc: 'स्थायी कृषि भविष्य बनाने के लिए एआई और आईओटी का उपयोग करना।' },
    features: { title: 'वह सब कुछ जो आपको फलने-फूलने के लिए चाहिए', weather: 'सैटेलाइट मौसम', market: 'बाजार विश्लेषण', coop: 'सहकारी लैब', insurance: 'स्मार्ट बीमा' },
    auth: { titleLogin: 'लॉगिन करें', titleRegister: 'खाता बनाएं', subtitle: 'किसापोर्टल तक सुरक्षित पहुंच', phone: 'फ़ोन नंबर', phonePlaceholder: '98765 43210', sendOtp: 'ओटीपी प्राप्त करें', otp: '६-अंकों का ओटीपी दर्ज करें', verify: 'सत्यापित करें', profile: 'किसान प्रोफ़ाइल जानकारी', name: 'आपका पूरा नाम', state: 'राज्य', district: 'जिला', mandal: 'मंडल', crop: 'मुख्य फसल', otherCrop: 'फसल का नाम लिखें', otherLocation: 'स्थान लिखें', submit: 'पंजीकरण पूरा करें', back: 'वापस जाएं', switchLogin: 'पहले से सदस्य हैं? लॉगिन करें', switchRegister: 'नया खाता? पंजीकरण करें', error: 'सत्यापन विफल। फिर प्रयास करें।', userNotFound: 'इस नंबर के लिए कोई प्रोफ़ाइल नहीं मिली। कृपया पंजीकरण करें।', userExists: 'इस नंबर के लिए खाता पहले से मौजूद है। कृपया लॉगिन करें।' },
    toast: { welcome: 'स्वागत है', status: 'पहचान सत्यापित' }
  },
  te: {
    nav: { home: 'హోమ్', cropDetails: 'పంటలు', weather: 'వాతావరణం', dashboard: 'డ్యాష్‌బోర్డ్', suggestions: 'సూచనలు', login: 'లాగిన్', register: 'రిజిస్టర్', logout: 'లాగ్అవుట్' },
    hero: { badge: 'భారతీయ వ్యవసాయ సాధికారత', title: 'భవిష్యత్తును సాగు చేద్దాం', desc: 'కిసాన్ పోర్టల్ ఆధునిక రైతులకు ఒక అద్భుతమైన వేదిక.' },
    importance: { badge: 'భూమికి వెన్నెముక', title: 'దేశాలకు ఆహారం, భవిష్యత్ నిర్మాణం', desc: 'మానవ చరిత్రలో ప్రతి విప్లవం ఆహార మిగులుతోనే ప్రారంభమైంది.', quote: 'రైతులు కేవలం విత్తనం మరియు కష్టంతో శూన్యం నుండి ఏదైనా సృష్టించే ఏకైక అవసరమైన కార్మికులు.' },
    tech: { badge: 'డిజిటల్ హార్వెస్ట్', title: 'హై-టెక్ సొల్యూషన్స్', subtitle: 'లోతైన సంప్రదాయాలు', desc: 'స్థిరమైన వ్యవసాయ భవిష్యత్తును సృష్టించడానికి AI మరియు IoT శక్తిని ఉపయోగించడం.' },
    features: { title: 'మీరు అభివృద్ధి చెందడానికి కావలసినవన్నీ', weather: 'వాతావరణం', market: 'మార్కెట్ అనలిటిక్స్', coop: 'కోఆపరేటివ్ ల్యాబ్', insurance: 'ఇన్సూరెన్స్' },
    auth: { titleLogin: 'లాగిన్', titleRegister: 'ఖాతాను సృష్టించండి', subtitle: 'కిసాన్ పోర్టల్‌కు సురక్షిత ప్రవేశం', phone: 'ఫోన్ నంబర్', sendOtp: 'OTP పొందండి', verify: 'ధృవీకరించండి', profile: 'రైతు ప్రొఫైల్ సమాచారం', name: 'పూర్తి పేరు', state: 'రాష్ట్రం', district: 'జిల్లా', mandal: 'మండలం', crop: 'ప్రధాన పంట', submit: 'రిజిస్ట్రేషన్ పూర్తి చేయండి', back: 'వెనక్కి', switchLogin: 'ఖాతా ఉందా? లాగిన్ అవ్వండి', switchRegister: 'కొత్తవారా? రిజిస్టర్ అవ్వండి', error: 'ధృవీకరణ విఫలమైంది.', userNotFound: 'ప్రొఫైల్ కనుగొనబడలేదు. దయచేసి రిజిస్టర్ చేసుకోండి.', userExists: 'ఈ నంబర్‌తో ఇప్పటికే ఖాతా ఉంది. దయచేసి లాగిన్ అవ్వండి.' },
    toast: { welcome: 'స్వాగతం', status: 'గుర్తింపు ధృవీకరించబడింది' }
  },
  ta: {
    nav: { home: 'முகப்பு', cropDetails: 'பயிர்கள்', weather: 'வானிலை', dashboard: 'டாஷ்போர்டு', suggestions: 'பரிந்துரைகள்', login: 'உள்நுழை', register: 'பதிவு செய்', logout: 'வெளியேறு' },
    hero: { badge: 'இந்திய விவசாய அதிகாரமளித்தல்', title: 'வருங்காலத்தை பயிரிடுவோம்', desc: 'கிசான் போர்ட்டல் நவீன விவசாயிகளுக்கான ஒரு சிறந்த தளமாகும்.' },
    importance: { badge: 'பூமியின் முதுகெலும்பு', title: 'நாடுகளுக்கு உணவு, எதிர்காலத்தை உருவாக்குதல்', desc: 'மனித வரலாற்றில் ஒவ்வொரு புரட்சியும் உணவு உபரியுடன் தொடங்கியது.', quote: 'விவசாயிகள் மட்டுமே ஒரு விதையிலிருந்தும் கடின உழைப்பிலிருந்தும் எதையாவது உருவாக்கும் ஒரே அத்தியாவசிய தொழிலாளர்கள்.' },
    tech: { badge: 'டிஜிட்டல் அறுவடை', title: 'உயர் தொழில்நுட்ப தீர்வுகள்', subtitle: 'ஆழ்ந்த மரபுகள்', desc: 'நிலையான விவசாய எதிர்காலத்தை உருவாக்க AI மற்றும் IoT சக்தியைப் பயன்படுத்துதல்.' },
    features: { title: 'நீங்கள் செழிக்க வேண்டிய அனைத்தும்', weather: 'வானிலை', market: 'சந்தை பகுப்பாய்வு', coop: 'கூட்டுறவு ஆய்வகம்', insurance: 'காப்பீடு' },
    auth: { titleLogin: 'உள்நுழை', titleRegister: 'கணக்கை உருவாக்கு', subtitle: 'கிசான் போர்ட்டலுக்கு பாதுகாப்பான அணுகல்', phone: 'தொலைபேசி எண்', sendOtp: 'OTP பெறு', verify: 'சரிபார்க்கவும்', profile: 'விவசாயி சுயவிவரத் தகவல்', name: 'முழு பெயர்', state: 'மாநிலம்', district: 'மாவட்டம்', mandal: 'மண்டலம்', crop: 'முதன்மை பயிர்', submit: 'பதிவை முடிக்கவும்', back: 'பின்னால்', switchLogin: 'கணக்கு உள்ளதா? உள்நுழையவும்', switchRegister: 'புதியவரா? பதிவு செய்யவும்', error: 'சரிபார்ப்பு தோல்வியடைந்தது.', userNotFound: 'சுயவிவரம் இல்லை. பதிவு செய்யவும்.', userExists: 'இந்த எண்ணில் ஏற்கனவே கணக்கு உள்ளது. உள்நுழையவும்.' },
    toast: { welcome: 'வரவேற்கிறோம்', status: 'அடையாளம் சரிபார்க்கப்பட்டது' }
  },
  kn: {
    nav: { home: 'ಮುಖಪುಟ', cropDetails: 'ಬೆಳೆಗಳು', weather: 'ಹವಾಮಾನ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', suggestions: 'ಸಲಹೆಗಳು', login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ', logout: 'ಲಾಗ್‌ಔಟ್' },
    hero: { badge: 'ಭಾರತೀಯ ಕೃಷಿ ಸಬಲೀಕರಣ', title: 'ಭವಿಷ್ಯವನ್ನು ಬೆಳೆಸೋಣ', desc: 'ಕಿಸಾನ್ ಪೋರ್ಟಲ್ ಆಧುನಿಕ ರೈತರಿಗಾಗಿ ಒಂದು ಉತ್ತಮ ವೇದಿಕೆಯಾಗಿದೆ.' },
    importance: { badge: 'ಭೂಮಿಯ ಬೆನ್ನೆಲುಬು', title: 'ದೇಶಗಳಿಗೆ ಆಹಾರ, ಭವಿಷ್ಯದ ನಿರ್ಮಾಣ', desc: 'ಮಾನವ ಇತಿಹಾಸದ ಪ್ರತಿಯೊಂದು ಕ್ರಾಂತಿಯು ಆಹಾರದ ಮಿಗುತೆಯೊಂದಿಗೆ ಪ್ರಾರಂಭವಾಯಿತು.', quote: 'ರೈತರು ಕೇವಲ ಬೀಜ ಮತ್ತು ಕಠಿಣ ಪರಿಶ್ರಮದಿಂದ ಶೂನ್ಯದಿಂದ ಏನನ್ನಾದರೂ ಸೃಷ್ಟಿಸುವ ಏಕೈಕ ಅಗತ್ಯ ಕೆಲಸಗಾರರು.' },
    tech: { badge: 'ಡಿಜಿಟಲ್ ಹಾರ್ವೆಸ್ಟ್', title: 'ಹೈ-ಟೆಕ್ ಪರಿಹಾರಗಳು', subtitle: 'ಆಳವಾದ ಸಂಪ್ರದಾಯಗಳು', desc: 'ಸುಸ್ಥಿರ ಕೃಷಿ ಭವಿಷ್ಯವನ್ನು ಸೃಷ್ಟಿಸಲು AI ಮತ್ತು IoT ಶಕ್ತಿಯನ್ನು ಬಳಸುವುದು.' },
    features: { title: 'ನೀವು ಅಭಿವೃದ್ಧಿ ಹೊಂದಲು ಬೇಕಾದ ಎಲ್ಲವೂ', weather: 'ಹವಾಮಾನ', market: 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ', coop: 'ಸಹಕಾರಿ ಪ್ರಯೋಗಾಲಯ', insurance: 'ವಿಮೆ' },
    auth: { titleLogin: 'ಲಾಗಿನ್', titleRegister: 'ಖಾತೆ ತೆರೆಯಿರಿ', subtitle: 'ಕಿಸಾನ್ ಪೋರ್ಟಲ್‌ಗೆ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ', phone: 'ಫೋನ್ ಸಂಖ್ಯೆ', sendOtp: 'OTP ಪಡೆಯಿರಿ', verify: 'ದೃಢೀಕರಿಸಿ', profile: 'ರೈತರ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ', name: 'ಪೂರ್ಣ ಹೆಸರು', state: 'ರಾಜ್ಯ', district: 'ಜಿಲ್ಲೆ', mandal: 'ಮಂಡಲ', crop: 'ಮುಖ್ಯ ಬೆಳೆ', submit: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ', back: 'ಹಿಂದಕ್ಕೆ', switchLogin: 'ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಆಗಿ', switchRegister: 'ಹೊಸಬರೇ? ನೋಂದಾಯಿಸಿ', error: 'ದೃಢೀಕರಣ ವಿಫಲವಾಗಿದೆ.', userNotFound: 'ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನೋಂದಾಯಿಸಿ.', userExists: 'ಈ ಸಂಖ್ಯೆಯ ಖಾತೆ ಈಗಾಗಲೇ ಇದೆ. ಲಾಗಿನ್ ಆಗಿ.' },
    toast: { welcome: 'ಸ್ವಾಗತ', status: 'ಗುರುತು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ' }
  }
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
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
    name: '', state: '', district: '', mandal: '', crop: '',
    otherState: '', otherDistrict: '', otherMandal: '', otherCrop: ''
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
    setPhoneNumber('');
    setOtp('');
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
    } catch (err: any) {
      setError(t.auth.error || 'Failed to send OTP');
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
      
      if (mode === 'login') {
        if (userDoc.exists()) {
          onAuthSuccess(userDoc.data());
          onClose();
        } else {
          await signOut(auth);
          setError(t.auth.userNotFound);
        }
      } else {
        if (userDoc.exists()) {
          await signOut(auth);
          setError(t.auth.userExists);
        } else {
          setStep('profile');
        }
      }
    } catch (err: any) {
      setError(t.auth.error || 'Verification failed');
    }
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Session expired");

      const finalProfile = {
        uid,
        name: profile.name,
        state: profile.state === 'Other' ? profile.otherState : profile.state,
        district: (profile.state !== 'Other' && profile.district === 'Other') ? profile.otherDistrict : profile.district,
        mandal: (profile.district !== 'Other' && profile.mandal === 'Other') ? profile.otherMandal : profile.mandal,
        crop: profile.crop === 'Other' ? profile.otherCrop : profile.crop,
        phoneNumber: auth.currentUser?.phoneNumber,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), finalProfile);
      onAuthSuccess(finalProfile);
      onClose();
    } catch (err: any) {
      setError(t.auth.error || 'Profile save failed');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-8 bg-green-50 border-b border-green-100 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-green-900">{mode === 'login' ? t.auth.titleLogin : t.auth.titleRegister}</h2>
            <p className="text-xs text-green-700/60 uppercase tracking-widest font-bold">{t.auth.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full text-green-800 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 flex items-center gap-3">
              <div className="bg-red-500 text-white p-1 rounded-full shrink-0"><X className="w-3 h-3" /></div>
              {error}
            </div>
          )}
          
          {step === 'phone' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.auth.phone}</label>
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
                disabled={loading || phoneNumber.length < 10}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-200 flex justify-center items-center gap-2"
              >
                {loading ? 'Sending...' : <>{t.auth.sendOtp} <ChevronRight className="w-5 h-5" /></>}
              </button>
              <div className="text-center pt-2">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs font-black text-green-700 hover:text-green-900 transition-colors uppercase tracking-widest"
                >
                  {mode === 'login' ? t.auth.switchRegister : t.auth.switchLogin}
                </button>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.auth.otp}</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
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
              <button onClick={() => setStep('phone')} className="w-full text-slate-400 font-bold hover:text-green-600 transition-colors text-sm uppercase tracking-widest">{t.auth.back}</button>
            </div>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <div className="md:col-span-2 flex items-center gap-3 mb-4 p-4 bg-green-50 rounded-2xl">
                <div className="bg-green-500 text-white p-2 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <p className="text-sm font-black text-green-900">Phone Verified</p>
                  <p className="text-[10px] text-green-700/60 uppercase font-bold tracking-wider">Fill your details to continue</p>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.name}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3.5 pl-10 pr-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.state}</label>
                <select 
                  required 
                  value={profile.state} 
                  onChange={(e) => setProfile({...profile, state: e.target.value, district: '', mandal: ''})}
                  className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select State</option>
                  {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {profile.state === 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (State)</label>
                  <input required type="text" value={profile.otherState} onChange={(e) => setProfile({...profile, otherState: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              {profile.state && profile.state !== 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.district}</label>
                  <select 
                    required 
                    value={profile.district} 
                    onChange={(e) => setProfile({...profile, district: e.target.value, mandal: ''})}
                    className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {Object.keys(locationData[profile.state].districts).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}

              {(profile.state !== 'Other' && profile.district === 'Other') && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (District)</label>
                  <input required type="text" value={profile.otherDistrict} onChange={(e) => setProfile({...profile, otherDistrict: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              {profile.district && profile.district !== 'Other' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.mandal}</label>
                  <select 
                    required 
                    value={profile.mandal} 
                    onChange={(e) => setProfile({...profile, mandal: e.target.value})}
                    className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select Mandal</option>
                    {locationData[profile.state].districts[profile.district].map((m: string) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}

              {(profile.district !== 'Other' && profile.mandal === 'Other') && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherLocation} (Mandal)</label>
                  <input required type="text" value={profile.otherMandal} onChange={(e) => setProfile({...profile, otherMandal: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.crop}</label>
                <select 
                  required 
                  value={profile.crop} 
                  onChange={(e) => setProfile({...profile, crop: e.target.value})}
                  className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="">Select Primary Crop</option>
                  {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {profile.crop === 'Other' && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.auth.otherCrop}</label>
                  <input required type="text" value={profile.otherCrop} onChange={(e) => setProfile({...profile, otherCrop: e.target.value})} className="w-full bg-slate-50 rounded-xl py-3.5 px-4 border border-slate-200 focus:ring-2 focus:ring-green-500/20 outline-none text-sm font-bold" />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="md:col-span-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg mt-4 shadow-xl shadow-green-200 transition-all flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : t.auth.submit}
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
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-green-300">{(t.hero?.badge || 'Portal')}</span>
        </div>
        <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif leading-[1.1] mb-8 animate-[fadeInUp_1s_ease-out] drop-shadow-2xl">
          {(t.hero?.title || 'Kisan').split(' ')[0]} <br /><span className="text-green-400">{(t.hero?.title || 'Portal').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed font-light opacity-90 drop-shadow-lg">{(t.hero?.desc || '')}</p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-green-900/40 hover:-translate-y-1">
            {(t.hero?.join || 'Join')} <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-2xl hover:-translate-y-1">{(t.hero?.explore || 'Explore')}</button>
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
          <p className="italic text-lg md:text-xl mb-6 leading-relaxed">"{t.importance?.quote || ''}"</p>
          <div className="h-px w-12 bg-green-400 mb-4"></div>
          <span className="font-black text-green-400 uppercase tracking-widest text-sm">— KisanPortal Insights</span>
        </div>
      </div>
      <div className="fade-in">
        <span className="text-green-600 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">{t.importance?.badge || ''}</span>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-slate-900 mb-8 leading-tight">{t.importance?.title || ''}</h2>
        <p className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-light">{t.importance?.desc || ''}</p>
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
          <span className="text-green-600 font-black tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">{t.tech?.badge || ''}</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-tight">{t.tech?.title || ''} <span className="text-green-600 italic">{t.tech?.subtitle || ''}</span></h2>
        </div>
        <p className="text-slate-500 text-lg md:text-xl max-w-md lg:text-right font-light leading-relaxed">{t.tech?.desc || ''}</p>
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
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif mb-8 leading-tight">{t.features?.title || 'Features'}</h2>
        <div className="h-1 w-24 md:w-32 bg-green-500 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {[{icon: CloudSun, key: 'weather'}, {icon: TrendingUp, key: 'market'}, {icon: Users, key: 'coop'}, {icon: ShieldCheck, key: 'insurance'}].map((item, idx) => (
          <div key={idx} className="fade-in border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] transition-all group hover:-translate-y-2">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600/20 rounded-2xl flex items-center justify-center text-green-400 mb-8 group-hover:scale-110 group-hover:bg-green-500 transition-all shadow-lg"><item.icon className="w-8 h-8 md:w-9 md:h-9" /></div>
            <h3 className="text-xl md:text-2xl font-black mb-4">{t.features?.[item.key] || item.key}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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
                {t.nav?.[item.key] || item.key}
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
                <button onClick={() => onOpenAuth('login')} className="flex items-center gap-2 bg-white/10 border border-white/30 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-white/20 transition-all whitespace-nowrap"><LogIn className="w-3.5 h-3.5" />{t.nav?.login || 'Login'}</button>
                <button onClick={() => onOpenAuth('register')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-lg hover:shadow-green-300/40 transition-all whitespace-nowrap"><UserPlus className="w-3.5 h-3.5" />{t.nav?.register || 'Register'}</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${scrolled ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white/10 border-white/20 text-white'}`}>
                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-white"><User className="w-3 h-3" /></div>
                  <span className="text-[9px] font-black uppercase tracking-wider max-w-[80px] truncate">{userProfile?.name || 'Farmer'}</span>
                </div>
                <button onClick={onLogout} className={`flex items-center gap-1.5 font-black text-[10px] hover:text-red-600 transition-all ${scrolled ? 'text-slate-500' : 'text-white/70'}`}><LogOut className="w-3.5 h-3.5" />{t.nav?.logout || 'Logout'}</button>
              </div>
            )}
          </div>
        </div>

        <button className="xl:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className={scrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-slate-900' : 'text-white'} />}</button>
      </div>

      {isOpen && (
        <div className="xl:hidden bg-white border-b absolute w-full left-0 p-6 space-y-6 shadow-2xl animate-fadeIn overflow-y-auto max-h-[80vh]">
          {navItems.map((item) => <a key={item.key} href={`#${item.key}`} className="flex items-center gap-3 text-slate-800 font-black text-xs uppercase py-2" onClick={() => setIsOpen(false)}><item.icon className="w-5 h-5" />{t.nav?.[item.key] || item.key}</a>)}
          {!isLoggedIn ? (
            <div className="space-y-3">
              <button onClick={() => {onOpenAuth('login'); setIsOpen(false)}} className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><LogIn className="w-6 h-6" /> {t.nav?.login || 'Login'}</button>
              <button onClick={() => {onOpenAuth('register'); setIsOpen(false)}} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><UserPlus className="w-6 h-6" /> {t.nav?.register || 'Register'}</button>
            </div>
          ) : (
            <button onClick={() => {onLogout(); setIsOpen(false)}} className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"><LogOut className="w-6 h-6" /> {t.nav?.logout || 'Logout'}</button>
          )}
        </div>
      )}
    </nav>
  );
};

// --- App Root ---

const App: React.FC = () => {
  useScrollReveal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<{isOpen: boolean, mode: 'login' | 'register'}>({isOpen: false, mode: 'login'});
  const [lang, setLang] = useState<string>('en');
  const [userProfile, setUserProfile] = useState<any>(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          setIsLoggedIn(true);
        } else {
          if (!authModal.isOpen || authModal.mode !== 'register') {
             await signOut(auth);
             setIsLoggedIn(false);
             setUserProfile(null);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [authModal.isOpen, authModal.mode]);

  const handleAuthSuccess = (profile: any) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setAuthModal({ ...authModal, isOpen: false });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setUserProfile(null);
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
      
      <footer className="bg-slate-950 pt-24 md:pt-32 pb-12 text-slate-400 text-center shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="bg-green-600 p-2 rounded-2xl"><Sprout className="text-white w-6 h-6 md:w-8 md:h-8" /></div>
            <span className="text-2xl md:text-3xl font-black text-white">KisanPortal</span>
            <p className="max-w-xl text-sm md:text-base opacity-60 leading-relaxed mx-auto">Cultivating progress through technology and tradition. Feeding the world, protecting the soil.</p>
          </div>
          <div className="pt-12 border-t border-slate-900 text-[10px] font-bold uppercase tracking-widest flex justify-center gap-8 md:gap-10">
            <a href="#" className="hover:text-green-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-green-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
      
      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        lang={lang} 
        t={t} 
        onAuthSuccess={handleAuthSuccess}
      />
      
      {isLoggedIn && (
        <div className="fixed bottom-10 right-10 bg-white border border-green-100 shadow-2xl p-5 md:p-6 rounded-[2rem] animate-[bounceIn_0.6s_ease-out] z-50 flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <User className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <p className="text-base md:text-lg font-black text-slate-800">{(t.toast?.welcome || 'Welcome')}, {userProfile?.name?.split(' ')[0]}!</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{(t.toast?.status || 'Verified')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
