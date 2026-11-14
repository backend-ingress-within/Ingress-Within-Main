'use client';

import React, { useState } from 'react';
import { Lock, Phone, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function TherapyLoginView() {
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formatPhone = (val) => {
    return val;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/therapy/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
      } else {
        setSuccessMessage('Logged in successfully! Loading your portal…');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 1000);
      }
    } catch {
      setErrorMessage('Network error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpSending(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/therapy/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to send OTP.');
      } else {
        setOtpSent(true);
        setSuccessMessage('A one-time code was sent to your phone number.');
      }
    } catch {
      setErrorMessage('Network error while requesting OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMessage('Please enter the verification code sent to your phone.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/therapy/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid or expired OTP code.');
      } else {
        setSuccessMessage('Verification complete! Opening your portal…');
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 1000);
      }
    } catch {
      setErrorMessage('Network error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#162723] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <a href="/" className="inline-flex items-center gap-2 mb-4">
          <img src="/logo-mark-transparent.png" alt="Ingress Within" className="w-8 h-8 object-contain" />
          <span className="font-editorial text-2xl tracking-tight text-[#162723]">
            Ingress <span className="text-[#795663]">Within</span>
          </span>
        </a>
        <h1 className="font-editorial text-3xl font-normal text-[#162723]">
          Therapy Client Sign In
        </h1>
        <p className="mt-2 text-sm text-[#4F635E]">
          Access your personalized care consultations, progress notes, and clinician messages.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-[#162723]/10 rounded-2xl">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#162723]/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode('password');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                loginMode === 'password'
                  ? 'bg-white text-[#162723] shadow-xs'
                  : 'text-[#7D8E87] hover:text-[#162723]'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('otp');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                loginMode === 'otp'
                  ? 'bg-white text-[#162723] shadow-xs'
                  : 'text-[#7D8E87] hover:text-[#162723]'
              }`}
            >
              OTP Login
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 mb-4">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {loginMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#162723] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7D8E87] font-mono">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="98765 43210"
                    required
                    className="w-full pl-16 pr-3.5 py-2.5 rounded-xl border border-[#162723]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#162723]/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[#162723]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('otp');
                      setErrorMessage('You can request a one-time code to sign in.');
                    }}
                    className="text-[11px] text-[#795663] hover:underline"
                  >
                    Forgot password? Sign in with OTP
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#162723]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#162723]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7D8E87] hover:text-[#162723]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#162723] text-white text-sm font-semibold hover:bg-[#203631] transition-all disabled:opacity-50"
                >
                  <Lock size={16} />
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#162723] mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7D8E87] font-mono">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="98765 43210"
                    disabled={otpSent}
                    required
                    className="w-full pl-16 pr-3.5 py-2.5 rounded-xl border border-[#162723]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#162723]/20 font-mono disabled:bg-gray-50"
                  />
                </div>
              </div>

              {!otpSent ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#162723] text-white text-sm font-semibold hover:bg-[#203631] transition-all disabled:opacity-50"
                  >
                    <Phone size={16} />
                    {otpSending ? 'Sending Code…' : 'Send One-Time Code'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-[#162723]">Enter 6-Digit Code</label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpSending}
                        className="text-[11px] text-[#795663] hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      required
                      className="w-full text-center tracking-widest text-lg font-mono px-3.5 py-2.5 rounded-xl border border-[#162723]/15 bg-white focus:outline-none focus:ring-2 focus:ring-[#162723]/20"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#162723] text-white text-sm font-semibold hover:bg-[#203631] transition-all disabled:opacity-50"
                    >
                      <KeyRound size={16} />
                      {loading ? 'Verifying…' : 'Verify & Sign In'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#162723]/10 text-center space-y-3">
            <div>
              <span className="text-xs text-[#7D8E87]">New to Ingress Within? </span>
              <a href="/therapy" className="text-xs font-semibold text-[#795663] hover:underline">
                Find a Therapist &amp; Start Intake →
              </a>
            </div>
            <div>
              <span className="text-xs text-[#7D8E87]">Are you a practitioner? </span>
              <a href="/therapist/login" className="text-xs font-medium text-[#162723] hover:underline">
                Therapist Portal Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
