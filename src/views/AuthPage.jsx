import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

const quotes = [
  "The things you avoid naming shape you anyway.",
  "What you keep circling becomes visible over time.",
  "Write the version before you made it make sense.",
  "A single entry is a moment. A thread is a picture."
];

export default function AuthPage({ onOpenPolicy, onAuthSuccess }) {
  // Views: 'entry' (Phone), 'otp' (OTP), 'name' (New User Name Collection)
  const [view, setView] = useState('entry');
  
  // Phone and OTP input values
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [signupToken, setSignupToken] = useState('');
  const [fullName, setFullName] = useState('');
  
  // OTP Resend Countdown (30 seconds)
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  
  // UI States
  const [errorMsg, setErrorMsg] = useState('');
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  const otpInputsRef = useRef([]);
  const nameInputRef = useRef(null);

  // Check URL parameters for contextual session-expired notice
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('reason') === 'session_expired' || urlParams.get('expired') === 'true') {
        setSessionExpiredNotice(true);
      }
    }
  }, []);

  // Quotes rotation on Left panel
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(quoteTimer);
  }, []);

  // OTP Countdown Timer (30s)
  useEffect(() => {
    let timer;
    if (view === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [view, otpTimer]);

  // Auto-submit OTP when all 6 digits are entered
  useEffect(() => {
    const fullOtp = otpDigits.join('');
    if (fullOtp.length === 6 && view === 'otp' && !isSubmitting) {
      handleOtpVerify(fullOtp);
    }
  }, [otpDigits, view]);

  // Navigate view helper
  const navigateToView = (newView) => {
    setView(newView);
    setErrorMsg('');
  };

  // Helper to get persistent device ID
  const getDeviceId = () => {
    let deviceId = typeof window !== 'undefined' ? localStorage.getItem('iw-device-id') : null;
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      if (typeof window !== 'undefined') {
        localStorage.setItem('iw-device-id', deviceId);
      }
    }
    return deviceId;
  };

  // ----------------------------------------------------
  // STEP 1: Send OTP
  // ----------------------------------------------------
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
      setErrorMsg("That doesn't look like a valid number.");
      setShake(true);
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const formattedPhone = `+91${cleanDigits}`;
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: formattedPhone })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data?.error?.message || "We couldn't send the code. Check your connection and try again.");
      }
      
      setOtpTimer(data.resend_in_seconds || 30);
      setCanResendOtp(false);
      setOtpDigits(['', '', '', '', '', '']);
      navigateToView('otp');
      
      // Auto-focus first OTP field
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } catch (err) {
      setErrorMsg(err.message || "We couldn't send the code. Check your connection and try again.");
      setShake(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // STEP 2: Verify OTP
  // ----------------------------------------------------
  const handleOtpVerify = async (otpCode) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const cleanDigits = mobileNumber.replace(/\D/g, '');
      const formattedPhone = `+91${cleanDigits}`;
      const deviceId = getDeviceId();
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: formattedPhone,
          otp_code: otpCode,
          device_id: deviceId,
          device_name: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Browser'
        })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data?.error?.message || "That code didn't match. Try again.");
      }
      
      // Branching: Existing User vs New User
      if (data.is_new_user && data.signup_token) {
        // NEW USER -> Name Collection Screen
        setSignupToken(data.signup_token);
        navigateToView('name');
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 150);
      } else {
        // EXISTING USER -> Authenticated Session -> Dashboard
        if (onAuthSuccess) {
          onAuthSuccess(data);
        }
        if (typeof window !== 'undefined') {
          if (typeof window.navigateTo === 'function') {
            window.navigateTo('/dashboard');
          } else {
            window.location.href = '/dashboard';
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "We couldn't verify your code. Check your connection and try again.");
      setShake(true);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // STEP 3: Complete Signup (New Users Only)
  // ----------------------------------------------------
  const handleCompleteSignup = async (e) => {
    if (e) e.preventDefault();
    
    const trimmed = fullName.trim();
    if (!trimmed) {
      setErrorMsg('A name is required.');
      setShake(true);
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const deviceId = getDeviceId();
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signup_token: signupToken,
          name: trimmed,
          device_id: deviceId,
          device_name: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Browser'
        })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data?.error?.message || "You're offline. We can't create your account right now. Try again when you're connected.");
      }
      
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
      
      if (typeof window !== 'undefined') {
        if (typeof window.navigateTo === 'function') {
          window.navigateTo('/dashboard');
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      setErrorMsg(err.message || "You're offline. We can't create your account right now. Try again when you're connected.");
      setShake(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP inputs keyboard handlers
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }
    
    const char = cleaned[cleaned.length - 1];
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setErrorMsg('');
    
    if (index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index] === '') {
        if (index > 0) {
          const newDigits = [...otpDigits];
          newDigits[index - 1] = '';
          setOtpDigits(newDigits);
          otpInputsRef.current[index - 1]?.focus();
        }
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      setErrorMsg('');
      const targetIndex = Math.min(pastedData.length - 1, 5);
      otpInputsRef.current[targetIndex]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp || isSubmitting) return;
    await handleSendOtp();
  };

  const handleChangeNumber = () => {
    setView('entry');
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg('');
  };

  // Format entered number for display: "+91 98765 43210"
  const formattedPhoneDisplay = () => {
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      return `+91 ${cleanDigits.substring(0, 5)} ${cleanDigits.substring(5)}`;
    }
    return `+91 ${mobileNumber}`;
  };

  // Shake animation variants
  const shakeVariants = {
    shake: {
      x: [0, -6, 6, -6, 6, -3, 3, 0],
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    idle: { x: 0 }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      
      {/* LEFT COLUMN: BRAND VISUALS (Quiet Breathing Atmosphere) */}
      <div className="relative hidden lg:flex flex-col items-center justify-between bg-[#1E3633] p-12 overflow-hidden border-r border-white/5">
        
        {/* Subtle decorative atmosphere glows */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#2E7A70]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E0A898]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Back Link to Home */}
        <a 
          href="/" 
          className="self-start flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-[0.14em] text-[#D8ECEA]/75 hover:text-white transition-colors no-underline z-10"
        >
          <ArrowLeft size={14} /> Back to Ingress
        </a>

        {/* Dynamic Breathing Portal Motif */}
        <div className="relative w-80 h-80 flex items-center justify-center shrink-0 my-8">
          
          {/* Logo Mark in Center */}
          <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
            <img 
              src="/logo-mark-light.png" 
              alt="Ingress Within" 
              className="w-16 h-16 object-contain drop-shadow-md" 
            />
            <span className="font-serif text-white text-base font-normal tracking-[0.08em] mt-3 leading-none">
              ingress <span className="font-semibold text-[#8DBFB4]">within</span>
            </span>
          </div>

          {/* Breathing Rings */}
          <motion.div 
            animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.45, 0.35] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-44 h-44 rounded-full border border-[#2E7A70]/30"
          />

          <motion.div 
            animate={{ scale: [1, 1.14, 1], opacity: [0.22, 0.35, 0.22] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-60 h-60 rounded-full border border-[#8DBFB4]/20"
          />

          <motion.div 
            animate={{ scale: [1, 1.20, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute w-72 h-72 rounded-full border border-[#E0A898]/15"
          />
        </div>

        {/* Rotating reflection quote */}
        <div className="max-w-[340px] text-left min-h-[70px] z-10">
          <AnimatePresence mode="wait">
            <motion.p 
              key={activeQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.75, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-lg italic text-[#D8ECEA] leading-relaxed"
            >
              "{quotes[activeQuoteIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

      </div>

      {/* RIGHT COLUMN: AUTHENTICATION FORM */}
      <div className="relative flex flex-col justify-between items-center py-12 px-6 md:px-12 bg-[#FAF8F5] min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="w-full flex justify-end items-center max-w-[380px] z-10">
          <div className="flex items-center gap-2 lg:hidden">
            <img 
              src="/logo-mark-transparent.png" 
              alt="Ingress Within" 
              className="w-6 h-6 object-contain" 
            />
            <span className="font-serif text-sm font-bold text-[#1A2421]">ingress <span className="font-normal text-[#2E7A70]">within</span></span>
          </div>
        </div>

        {/* Central Form Container */}
        <div className="w-full max-w-[380px] flex-grow flex flex-col justify-center z-10 py-10">
          
          {/* Contextual Session Expired Banner */}
          {sessionExpiredNotice && view === 'entry' && (
            <div className="mb-6 p-4 rounded-xl bg-[#FFF8F6] border border-[#F5D5CB] text-xs text-[#8A3828] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#C25438] flex-shrink-0" />
              <span>You've been logged out. Enter your number to continue.</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* ---------------------------------------------------- */}
            {/* STEP 1: PHONE NUMBER ENTRY                           */}
            {/* ---------------------------------------------------- */}
            {view === 'entry' && (
              <motion.div
                key="entry-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-10 text-center"
              >
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="font-serif text-3xl sm:text-4xl leading-tight font-normal text-[#1A2421] tracking-tight">
                    Ingress Within
                  </h1>
                  <p className="font-sans text-sm font-light text-[#5E706A] leading-relaxed">
                    A daily writing practice.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <motion.div
                    variants={shakeVariants}
                    animate={shake ? "shake" : "idle"}
                    onAnimationComplete={() => setShake(false)}
                    className="space-y-4"
                  >
                    <div className="text-left space-y-1.5">
                      <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#758D7E]">
                        Phone number
                      </label>
                      <div className="flex items-center bg-white border border-[#D5CDBC] rounded-xl px-4 py-3.5 focus-within:border-[#1E3633] focus-within:ring-1 focus-within:ring-[#1E3633]/20 transition-all shadow-2xs">
                        <span className="font-mono text-sm text-[#5E706A] font-semibold pr-3 border-r border-[#E7E0D3] mr-3 select-none">+91</span>
                        <input 
                          type="tel"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => { 
                            setMobileNumber(e.target.value.replace(/\D/g, '').substring(0, 10)); 
                            setErrorMsg(''); 
                          }}
                          placeholder="00000 00000"
                          disabled={isSubmitting}
                          autoFocus
                          className="w-full bg-transparent border-none p-0 font-mono text-sm text-[#1A2421] placeholder-[#A0AEA9] outline-none disabled:opacity-50 tracking-wider"
                        />
                      </div>
                    </div>
                    
                    {errorMsg && (
                      <p className="font-sans text-xs text-[#C25438] text-left leading-relaxed">
                        {errorMsg}
                      </p>
                    )}

                    {/* Continue Button */}
                    <button 
                      type="submit"
                      disabled={isSubmitting || mobileNumber.replace(/\D/g, '').length !== 10}
                      className="w-full bg-[#1E3633] hover:bg-[#2B4B47] text-white py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isSubmitting ? "Sending..." : "Continue"}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: OTP VERIFICATION                             */}
            {/* ---------------------------------------------------- */}
            {view === 'otp' && (
              <motion.div
                key="otp-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-10 text-center"
              >
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="font-serif text-3xl leading-tight font-normal text-[#1A2421]">
                    Verify your number
                  </h1>
                  <p className="font-sans text-xs sm:text-sm font-light text-[#5E706A] leading-relaxed">
                    Code sent to <span className="font-mono font-medium text-[#1A2421]">{formattedPhoneDisplay()}</span>
                  </p>
                </div>

                <motion.div
                  variants={shakeVariants}
                  animate={shake ? "shake" : "idle"}
                  onAnimationComplete={() => setShake(false)}
                  className="space-y-6"
                >
                  {/* 6-box OTP digits */}
                  <div className="flex justify-between gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input 
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        disabled={isSubmitting}
                        className="w-12 h-14 bg-white border border-[#D5CDBC] rounded-xl text-center font-mono text-xl font-semibold text-[#1A2421] outline-none focus:border-[#1E3633] focus:ring-1 focus:ring-[#1E3633]/20 transition-all shadow-2xs disabled:opacity-50"
                      />
                    ))}
                  </div>

                  {errorMsg && (
                    <p className="font-sans text-xs text-[#C25438] leading-relaxed">
                      {errorMsg}
                    </p>
                  )}

                  {isSubmitting && (
                    <div className="flex justify-center items-center py-1">
                      <span className="font-sans text-xs text-[#5E706A] animate-pulse">Verifying code...</span>
                    </div>
                  )}

                  {/* Resend and Change Number Links */}
                  <div className="flex flex-col items-center gap-3 pt-3 border-t border-[#E7E0D3]">
                    {canResendOtp ? (
                      <button 
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="font-sans text-xs text-[#2E7A70] hover:text-[#1E3633] font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer transition-colors"
                      >
                        Resend code
                      </button>
                    ) : (
                      <span className="font-sans text-xs text-[#7D8E87] font-light select-none">
                        Resend code (<strong className="font-mono text-[#1A2421]">{otpTimer}s</strong>)
                      </span>
                    )}

                    <button 
                      onClick={handleChangeNumber}
                      disabled={isSubmitting}
                      className="font-sans text-xs text-[#7D8E87] hover:text-[#1A2421] bg-transparent border-none p-0 cursor-pointer transition-colors flex items-center gap-1"
                    >
                      ← Change number
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: NEW USER NAME COLLECTION                     */}
            {/* ---------------------------------------------------- */}
            {view === 'name' && (
              <motion.div
                key="name-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-8 text-center"
              >
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="font-serif text-3xl leading-tight font-normal text-[#1A2421]">
                    What should we call you?
                  </h1>
                  <p className="font-sans text-xs sm:text-sm font-light text-[#5E706A] leading-relaxed">
                    This is how we'll address you in the app.
                  </p>
                </div>

                <form onSubmit={handleCompleteSignup} className="space-y-6">
                  <motion.div
                    variants={shakeVariants}
                    animate={shake ? "shake" : "idle"}
                    onAnimationComplete={() => setShake(false)}
                    className="space-y-4"
                  >
                    <div className="text-left space-y-1.5">
                      <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#758D7E]">
                        Name
                      </label>
                      <input 
                        ref={nameInputRef}
                        type="text"
                        maxLength={100}
                        value={fullName}
                        onChange={(e) => { 
                          setFullName(e.target.value); 
                          setErrorMsg(''); 
                        }}
                        placeholder="Your name"
                        disabled={isSubmitting}
                        autoFocus
                        className="w-full bg-white border border-[#D5CDBC] rounded-xl px-4 py-3.5 font-sans text-sm text-[#1A2421] placeholder-[#A0AEA9] outline-none focus:border-[#1E3633] focus:ring-1 focus:ring-[#1E3633]/20 transition-all shadow-2xs disabled:opacity-50"
                      />
                    </div>

                    {errorMsg && (
                      <p className="font-sans text-xs text-[#C25438] text-left leading-relaxed">
                        {errorMsg}
                      </p>
                    )}

                    <button 
                      type="submit"
                      disabled={isSubmitting || fullName.trim().length === 0}
                      className="w-full bg-[#1E3633] hover:bg-[#2B4B47] text-white py-3.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isSubmitting ? "Creating your sanctuary..." : "Continue"}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div className="h-6" />

      </div>

    </div>
  );
}
