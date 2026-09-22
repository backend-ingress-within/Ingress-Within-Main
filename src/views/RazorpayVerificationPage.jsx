import React, { useState } from 'react';

export default function RazorpayVerificationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/razorpay-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || 'Invalid credentials or verification access disabled.');
        setLoading(false);
        return;
      }

      window.location.href = data.redirect || '/settings';
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F2] flex items-center justify-center p-4 font-sans text-[#1E2A2E]">
      <div className="max-w-md w-full bg-white border border-[#1E2A2E]/10 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block px-3 py-1 bg-[#8DBFB4]/15 border border-[#8DBFB4]/30 rounded-full text-xs font-semibold text-[#1A5040] uppercase tracking-wider">
            Verification Access
          </div>
          <h1 className="font-serif text-2xl font-bold">Razorpay Reviewer Login</h1>
          <p className="text-xs text-mid leading-relaxed">
            This entry point provides compliance and website verification reviewers with synthetic test-account access to inspect the Razorpay payment and checkout flow in Test Mode.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mid mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2A2E]/15 text-sm focus:outline-none focus:border-[#8DBFB4]"
              placeholder="Enter reviewer username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-mid mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2A2E]/15 text-sm focus:outline-none focus:border-[#8DBFB4]"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E2A2E] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2A3B40] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Access Reviewer Account'}
          </button>
        </form>

        <div className="text-[11px] text-mid/60 text-center leading-relaxed border-t border-[#1E2A2E]/8 pt-4">
          Zero real user journals, mental-health scores, or clinical notes are accessible from this synthetic verification account.
        </div>
      </div>
    </div>
  );
}
