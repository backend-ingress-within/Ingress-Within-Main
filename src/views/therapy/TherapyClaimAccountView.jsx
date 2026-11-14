'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function TherapyClaimAccountView() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token') || '';
      setToken(urlToken);

      if (!urlToken) {
        setLoading(false);
        setErrorMessage('Missing account setup token. Please check the link from your email or therapist.');
        return;
      }

      fetch(`/api/therapy/auth/claim-account?token=${encodeURIComponent(urlToken)}`)
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.valid) {
            setValid(false);
            setErrorMessage(data.error || 'This setup link is invalid or has expired.');
            if (data.alreadyClaimed) setAlreadyClaimed(true);
          } else {
            setValid(true);
            setClientInfo(data.client);
          }
        })
        .catch(() => {
          setValid(false);
          setErrorMessage('Unable to verify setup link. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/therapy/auth/claim-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to activate account.');
      } else {
        setSubmitSuccess(true);
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 1500);
      }
    } catch {
      setErrorMessage('Network error during account setup. Please try again.');
    } finally {
      setSubmitting(false);
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
          Activate Your Therapy Account
        </h1>
        <p className="mt-2 text-sm text-[#4F635E]">
          Securely set your password to access your therapy portal, session history, and clinician notes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-[#162723]/10 rounded-2xl">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#7D8E87]">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-[#162723] border-t-transparent rounded-full mb-3" />
              <p>Verifying your personal setup link…</p>
            </div>
          ) : submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="font-editorial text-2xl text-[#162723] mb-2">Account Activated!</h2>
              <p className="text-sm text-[#4F635E] mb-4">
                Your password has been saved and your therapy account is ready. Redirecting to your dashboard…
              </p>
              <div className="inline-block animate-pulse text-xs text-[#7D8E87]">
                Taking you to your dashboard…
              </div>
            </div>
          ) : !valid ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={28} />
              </div>
              <h3 className="font-editorial text-xl text-[#162723] mb-2">
                {alreadyClaimed ? 'Account Already Activated' : 'Setup Link Invalid'}
              </h3>
              <p className="text-sm text-[#4F635E] mb-6">{errorMessage}</p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="/therapy/login"
                  className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl bg-[#162723] text-white text-sm font-medium hover:bg-[#203631] transition-colors"
                >
                  Sign In to Therapy <ArrowRight size={16} />
                </a>
                <a
                  href="/therapy"
                  className="w-full inline-flex justify-center items-center py-2 px-4 rounded-xl border border-[#162723]/15 text-[#4F635E] text-xs font-medium hover:bg-black/5 transition-colors"
                >
                  Return to Therapy Overview
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Client Profile Box */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#162723]/8">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#7D8E87] mb-2 flex items-center gap-1.5">
                  <Shield size={12} className="text-[#4E7A66]" /> Verified Therapy Client
                </div>
                <div className="space-y-1.5 text-xs text-[#162723]">
                  {clientInfo?.fullName && (
                    <div className="flex justify-between">
                      <span className="text-[#7D8E87]">Name:</span>
                      <span className="font-medium">{clientInfo.fullName}</span>
                    </div>
                  )}
                  {clientInfo?.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-[#7D8E87]">Phone:</span>
                      <span className="font-mono">{clientInfo.phoneNumber}</span>
                    </div>
                  )}
                  {clientInfo?.email && (
                    <div className="flex justify-between">
                      <span className="text-[#7D8E87]">Email:</span>
                      <span className="font-medium">{clientInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#162723] mb-1.5">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
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

              <div>
                <label className="block text-xs font-semibold text-[#162723] mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#162723]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#162723]/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-[#162723] text-white text-sm font-semibold hover:bg-[#203631] transition-all disabled:opacity-50"
                >
                  <Lock size={16} />
                  {submitting ? 'Setting Password…' : 'Activate & Continue to Portal'}
                </button>
              </div>

              <div className="text-center pt-2">
                <a
                  href="/therapy/login"
                  className="text-xs text-[#795663] hover:underline font-medium"
                >
                  Already set up your password? Sign In →
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
