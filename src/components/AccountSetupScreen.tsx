import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  X,
  Users,
  RotateCcw,
  Check,
  Building,
  Smartphone,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../types/store';
import { AnimatedLogo } from './AnimatedLogo';
import { sound } from '../utils/audio';

interface AccountSetupScreenProps {
  onAccountCreated: (profile: UserProfile) => void;
  onSkip?: () => void;
  currentProfile?: UserProfile;
}

export const AccountSetupScreen: React.FC<AccountSetupScreenProps> = ({
  onAccountCreated,
  currentProfile,
}) => {
  // Check if there is already a saved profile in localStorage
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(() => {
    if (currentProfile) return currentProfile;
    try {
      const saved = localStorage.getItem('scan_and_go_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Mode: 'form' | 'google_modal' | 'choose_existing'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Google modal inputs
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googlePhoneInput, setGooglePhoneInput] = useState('');

  // If there's an existing profile, allow 1-tap continue as that person OR fresh sign-in
  const [isSwitchingUser, setIsSwitchingUser] = useState(!existingProfile);

  const handleCreateProfile = (
    userName: string,
    userEmail: string,
    userPhone: string,
    tier: string = 'Vijayawada VIP Shopper'
  ) => {
    if (!userName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setError('Please enter a valid Google / Gmail address');
      return;
    }
    const cleanPhone = userPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a 10-digit mobile number for WhatsApp bills');
      return;
    }

    try {
      sound.playScanBeep();
    } catch {}

    const newProfile: UserProfile = {
      name: userName.trim(),
      email: userEmail.trim().toLowerCase(),
      phone: cleanPhone.slice(-10),
      memberTier: tier,
      walletBalance: 0,
      walletPoints: 350,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('scan_and_go_user_profile', JSON.stringify(newProfile));
    } catch {}

    onAccountCreated(newProfile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateProfile(name, email, phone);
  };

  const handleGoogleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateProfile(
      googleNameInput || 'Google Shopper',
      googleEmailInput,
      googlePhoneInput || '9876543210',
      'Verified Google Member'
    );
  };

  // Quick Presets for Teacher & Classmates Evaluation
  const applyPreset = (
    presetName: string,
    presetEmail: string,
    presetPhone: string,
    tier: string
  ) => {
    setName(presetName);
    setEmail(presetEmail);
    setPhone(presetPhone);
    setError(null);
    setIsOtpVerified(true);
    handleCreateProfile(presetName, presetEmail, presetPhone, tier);
  };

  const handleStartFresh = () => {
    setIsSwitchingUser(true);
    setName('');
    setEmail('');
    setPhone('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-3 sm:p-6 relative select-none">
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070a13] via-slate-900 to-red-950/40 pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-red-600/10 blur-[100px] pointer-events-none top-1/4 animate-pulse" />

      <div className="relative z-10 w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl p-5 sm:p-8 border border-slate-200">
        {/* Animated Brand Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-3">
            <AnimatedLogo size="md" interactive={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-wider mb-2 border border-red-200">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Flipkart / Amazon Style Self-Checkout Sign In</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In / Create Account
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Enter your <strong>Google ID</strong>, <strong>Name</strong>, and <strong>Mobile Number</strong> so your digital WhatsApp GST bills and purchased items history are registered to you.
          </p>
        </div>

        {/* Existing Account Prompt (If previously logged in) */}
        {existingProfile && !isSwitchingUser && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 rounded-2xl bg-slate-50 border-2 border-red-100 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Saved Profile on this Device:</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">
                Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d71920] to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                {existingProfile.name ? existingProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-slate-900 text-sm truncate">
                  {existingProfile.name}
                </div>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{existingProfile.email}</span>
                </div>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>+91 {existingProfile.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAccountCreated(existingProfile)}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>Continue as {existingProfile.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleStartFresh}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-red-600" />
                <span>Switch / New User</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 1-Tap Classroom Presets for Teacher & Students */}
        <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200 rounded-2xl">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Classroom &amp; Teacher 1-Tap Quick Fill:</span>
            </span>
            <span className="text-[9px] text-slate-400">For fast evaluation</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'Teacher / Evaluator',
                  'teacher.evaluator@gmail.com',
                  '9848011223',
                  'Faculty Member Tier'
                )
              }
              className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 text-left transition cursor-pointer group shadow-2xs"
            >
              <div className="text-[11px] font-black text-slate-800 flex items-center gap-1 group-hover:text-indigo-600">
                <span>👩‍🏫 Teacher</span>
              </div>
              <div className="text-[9px] text-slate-500 truncate">teacher@gmail.com</div>
              <div className="text-[9px] text-emerald-600 font-mono mt-0.5">9848011223</div>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'Classmate Student',
                  'student.classmate@gmail.com',
                  '9876543210',
                  'Student VIP Tier'
                )
              }
              className="p-2 rounded-xl bg-white hover:bg-red-50 border border-slate-200 hover:border-red-400 text-left transition cursor-pointer group shadow-2xs"
            >
              <div className="text-[11px] font-black text-slate-800 flex items-center gap-1 group-hover:text-red-600">
                <span>👨‍🎓 Classmate</span>
              </div>
              <div className="text-[9px] text-slate-500 truncate">student@gmail.com</div>
              <div className="text-[9px] text-emerald-600 font-mono mt-0.5">9876543210</div>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset(
                  'Vijayawada Shopper',
                  'shopper.vja@gmail.com',
                  '9988776655',
                  'Flipkart / Amazon Shopper'
                )
              }
              className="p-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-left transition cursor-pointer group shadow-2xs"
            >
              <div className="text-[11px] font-black text-slate-800 flex items-center gap-1 group-hover:text-emerald-700">
                <span>🛒 Default Demo</span>
              </div>
              <div className="text-[9px] text-slate-500 truncate">shopper@gmail.com</div>
              <div className="text-[9px] text-emerald-600 font-mono mt-0.5">9988776655</div>
            </button>
          </div>
        </div>

        {/* Google One-Tap Sign In Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-slate-800 font-black text-xs sm:text-sm flex items-center justify-center gap-3 transition cursor-pointer shadow-xs mb-4 group"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google Account</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform ml-auto" />
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-wider absolute">
            or enter details directly
          </span>
        </div>

        {/* Amazon & Flipkart Style Direct Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold animate-in fade-in flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Mobile Number (Flipkart style with +91) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Mobile Number (Google Pay / Phone)
              </label>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> WhatsApp E-Bill Ready
              </span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1 text-xs font-black text-slate-600 border-r border-slate-300 pr-2 pointer-events-none">
                <span>🇮🇳 +91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(cleaned);
                  if (cleaned.length === 10) setIsOtpVerified(true);
                }}
                placeholder="10-digit mobile number (e.g. 9848012345)"
                required
                maxLength={10}
                className="w-full pl-20 pr-10 py-3 rounded-xl border border-slate-300 focus:border-[#d71920] focus:ring-2 focus:ring-red-100 outline-none text-sm font-bold text-slate-900 transition font-mono"
              />
              {phone.length === 10 && (
                <div className="absolute right-3 text-emerald-600">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          </div>

          {/* 2. Full Name */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Full Name (Student / Teacher / Shopper)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar / Ananya Sharma"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#d71920] focus:ring-2 focus:ring-red-100 outline-none text-sm font-semibold text-slate-900 transition"
              />
            </div>
          </div>

          {/* 3. Google ID / Gmail */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
              Google ID / Gmail Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#d71920] focus:ring-2 focus:ring-red-100 outline-none text-sm font-semibold text-slate-900 transition"
              />
            </div>
          </div>

          {/* Shopper Benefits */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-black text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Smart Shopper Account Privileges:</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 pl-4">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>English GST tax invoices sent to your WhatsApp &amp; stored in Profile</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 pl-4">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Turnstile exit barcode auto-generated upon UPI payment</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#d71920] hover:bg-[#b0141a] active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition cursor-pointer"
          >
            <span>Save Details &amp; Choose Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Google Authentication Dialog Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 className="text-sm font-black text-slate-800">
                  Google Account Sign In
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your Google ID credentials to sign in and save your bills on this device.
            </p>

            <form onSubmit={handleGoogleModalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Google User / Student Name
                </label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  placeholder="e.g. Pardhu D / Dr. Teacher"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-[#d71920] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Google ID / Gmail Email
                </label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="user@gmail.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-[#d71920] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Mobile Number (For WhatsApp Invoices)
                </label>
                <input
                  type="tel"
                  value={googlePhoneInput}
                  onChange={(e) =>
                    setGooglePhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  required
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold font-mono focus:border-[#d71920] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
