import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Bug, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  ExternalLink,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { SUPPORT_CONFIG } from '../config/supportConfig';

export default function FeedbackPage({ user, profile, onOpenPolicy }) {
  // Form input states
  const [submissionType, setSubmissionType] = useState('feedback'); // 'feedback' | 'bug_report' | 'issue'
  const [category, setCategory] = useState('General Feedback');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('iw_user_email') || '' : ''
  );
  const [pageUrl, setPageUrl] = useState('');
  
  // Bug report conditional fields
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  
  // Bot trap
  const [botTrap, setBotTrap] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null); // { reference_code, id }
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side quick checks
    if (!subject.trim() || subject.trim().length < 3) {
      setErrorMessage('Please provide a subject line (at least 3 characters).');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please describe your feedback or issue in more detail (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_type: submissionType,
          category,
          subject: subject.trim(),
          description: description.trim(),
          contact_email: contactEmail.trim() || null,
          page_url: pageUrl.trim() || null,
          steps_to_reproduce: stepsToReproduce.trim() || null,
          expected_behavior: expectedBehavior.trim() || null,
          actual_behavior: actualBehavior.trim() || null,
          bot_trap: botTrap
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to submit feedback. Please try again.');
      }

      // Save email locally for future forms if provided
      if (contactEmail.trim()) {
        try {
          localStorage.setItem('iw_user_email', contactEmail.trim());
        } catch {}
      }

      setSuccessData({
        reference_code: data.reference_code,
        id: data.id
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('[FeedbackPage] Submission error:', err);
      setErrorMessage(err.message || 'A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!successData?.reference_code) return;
    navigator.clipboard.writeText(successData.reference_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setSubject('');
    setDescription('');
    setPageUrl('');
    setStepsToReproduce('');
    setExpectedBehavior('');
    setActualBehavior('');
    setErrorMessage('');
  };

  const handleNavigateBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else if (window.navigateTo) {
        window.navigateTo('/');
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] text-[#1E2A2E] font-sans flex flex-col justify-between selection:bg-[#8DBFB4]/20 selection:text-[#1E2A2E]">
      
      {/* Top Header */}
      <header className="px-6 md:px-12 py-4 border-b border-[#1E2A2E]/8 bg-[#F6F1EA]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="logo flex items-center gap-2.5 no-underline group cursor-pointer">
            <img 
              src="/logo-mark-transparent.png" 
              alt="Ingress Within" 
              className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" 
            />
            <span className="font-serif text-lg font-normal text-[#1E2A2E] leading-none">
              ingress <span className="font-semibold text-[#8DBFB4]">within</span>
            </span>
          </a>

          <button
            onClick={handleNavigateBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2A2E]/70 hover:text-[#1E2A2E] transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-10 px-5 md:px-8 max-w-3xl mx-auto w-full">

        {/* SUCCESS CONFIRMATION VIEW */}
        {successData ? (
          <div className="bg-white border border-[#1E2A2E]/10 rounded-2xl p-7 md:p-10 shadow-xs animate-fadeUp">
            <div className="w-12 h-12 rounded-xl bg-[#8DBFB4]/20 text-[#1A5040] flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h1 className="font-serif text-2xl md:text-3xl text-[#1E2A2E] mb-2 font-normal">
              Thank you for your report
            </h1>
            <p className="text-sm text-[#1E2A2E]/70 leading-relaxed mb-6">
              Your submission has been securely recorded and dispatched to the Ingress Within engineering and care team.
            </p>

            {/* Reference Code Card */}
            <div className="bg-[#F0F3F2] border border-[#1E2A2E]/10 rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E2A2E]/50 block mb-1">
                  Reference Identifier
                </span>
                <span className="font-mono text-xl font-bold text-[#1E2A2E] tracking-wider">
                  {successData.reference_code}
                </span>
                <p className="text-xs text-[#1E2A2E]/60 mt-1">
                  Keep this code handy if you follow up regarding this issue.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-lg border border-[#1E2A2E]/15 bg-white text-xs font-semibold text-[#1E2A2E] hover:bg-black/5 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1A5040]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Reference ID</span>
                  </>
                )}
              </button>
            </div>

            {contactEmail ? (
              <p className="text-xs text-[#1E2A2E]/70 leading-relaxed mb-8">
                An acknowledgment confirmation was sent to <strong className="text-[#1E2A2E]">{contactEmail}</strong>.
              </p>
            ) : (
              <p className="text-xs text-[#1E2A2E]/60 leading-relaxed mb-8">
                You submitted this report anonymously. If you need a personal response, you can email us directly with the reference code above.
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-[#1E2A2E]/8">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 bg-[#1E2A2E] text-white rounded-lg text-xs font-semibold hover:bg-[#2A3A3E] transition-colors cursor-pointer"
              >
                Submit another response
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if (window.navigateTo) window.navigateTo('/');
                    else window.location.href = '/';
                  }
                }}
                className="px-5 py-2.5 border border-[#1E2A2E]/15 rounded-lg text-xs font-semibold text-[#1E2A2E] hover:bg-black/5 transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* FEEDBACK & BUG REPORT SUBMISSION FORM */
          <div className="animate-fadeUp">
            
            {/* Header Titles */}
            <div className="mb-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8DBFB4] block mb-1">
                Continuous Care &amp; Improvement
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E2A2E] font-normal leading-tight">
                Feedback &amp; Bug Reports
              </h1>
              <p className="text-sm text-[#1E2A2E]/70 mt-2 leading-relaxed">
                Your experience shapes Ingress Within. Whether you encountered a glitch, have thoughts on the writing interface, or want to suggest an improvement, our team reads and evaluates every report.
              </p>
            </div>

            {/* Direct Contact & Support Notice Banner */}
            <div className="bg-white border border-[#1E2A2E]/10 rounded-xl p-4.5 mb-7 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8DBFB4]/15 text-[#1A5040] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs text-[#1E2A2E]/80 leading-relaxed">
                  <span className="font-semibold text-[#1E2A2E] block mb-0.5">Need immediate assistance or direct inquiry?</span>
                  Found a bug or having an issue? Report it through this form or email{' '}
                  <a href={`mailto:${SUPPORT_CONFIG.supportEmail}`} className="font-semibold text-[#1E2A2E] hover:underline underline-offset-2">
                    {SUPPORT_CONFIG.supportEmail}
                  </a>
                  . You can also contact our support line directly at{' '}
                  <a href={`tel:${SUPPORT_CONFIG.temporaryContactNumberRaw}`} className="font-semibold text-[#1E2A2E] hover:underline underline-offset-2">
                    {SUPPORT_CONFIG.temporaryContactNumber}
                  </a>.
                </div>
              </div>
            </div>

            {/* Authenticated Account Association Notice */}
            {user && (
              <div className="bg-[#8DBFB4]/10 border border-[#8DBFB4]/30 rounded-lg px-4 py-2.5 mb-6 text-xs text-[#1A5040] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1A5040]" />
                <span>
                  Signed in as <strong>{profile?.full_name || user?.name || user?.phone_number || 'Verified User'}</strong>. Your submission will be securely associated with your account.
                </span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-[#8A3020] text-xs flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-[#B33A2A]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="bg-white border border-[#1E2A2E]/10 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
              
              {/* Submission Type Segmented Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2A2E]/70 mb-2.5">
                  What would you like to submit? <span className="text-[#B33A2A]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'feedback', label: 'Feedback', desc: 'Suggestions & ideas', icon: MessageSquare },
                    { id: 'bug_report', label: 'Bug Report', desc: 'Something is broken', icon: Bug },
                    { id: 'issue', label: 'Technical Issue', desc: 'Account or loading problem', icon: AlertCircle }
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = submissionType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSubmissionType(t.id);
                          if (t.id === 'bug_report' && category === 'General Feedback') {
                            setCategory('Technical Issue');
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E2A2E] text-white border-[#1E2A2E] shadow-2xs'
                            : 'bg-white text-[#1E2A2E] border-[#1E2A2E]/15 hover:border-[#1E2A2E]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#8DBFB4]' : 'text-[#1E2A2E]/60'}`} />
                          <span className="text-xs font-bold">{t.label}</span>
                        </div>
                        <span className={`text-[11px] block leading-snug ${isSelected ? 'text-white/70' : 'text-[#1E2A2E]/50'}`}>
                          {t.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="f-subject" className="block text-xs font-semibold text-[#1E2A2E] mb-1.5">
                  Subject <span className="text-[#B33A2A]">*</span>
                </label>
                <input
                  id="f-subject"
                  type="text"
                  required
                  maxLength={150}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    submissionType === 'bug_report'
                      ? 'e.g., Error message when saving Day 4 entry'
                      : 'e.g., Suggestion for night mode during guided journaling'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] focus:ring-1 focus:ring-[#8DBFB4]/30 transition-all text-[#1E2A2E]"
                />
              </div>

              {/* Category & Page Path Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="f-category" className="block text-xs font-semibold text-[#1E2A2E] mb-1.5">
                    Category
                  </label>
                  <select
                    id="f-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                  >
                    {SUPPORT_CONFIG.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-page" className="block text-xs font-semibold text-[#1E2A2E] mb-1.5">
                    Page or Feature <span className="text-[#1E2A2E]/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="f-page"
                    type="text"
                    maxLength={150}
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    placeholder="e.g., /write, /dashboard, /reports"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="f-desc" className="text-xs font-semibold text-[#1E2A2E]">
                    Detailed Description <span className="text-[#B33A2A]">*</span>
                  </label>
                  <span className="text-[11px] text-[#1E2A2E]/40 font-mono">
                    {description.length}/3000
                  </span>
                </div>
                <textarea
                  id="f-desc"
                  required
                  rows={4}
                  maxLength={3000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    submissionType === 'bug_report'
                      ? 'Please describe the unexpected behavior you observed and what led up to it...'
                      : 'Share your feedback, observations, or suggestions in detail...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] focus:ring-1 focus:ring-[#8DBFB4]/30 transition-all text-[#1E2A2E] resize-y leading-relaxed"
                />
              </div>

              {/* CONDITIONAL BUG REPORT DETAILS */}
              {(submissionType === 'bug_report' || submissionType === 'issue') && (
                <div className="bg-[#F0F3F2]/50 border border-[#1E2A2E]/10 rounded-xl p-4.5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#1E2A2E]/8">
                    <Bug className="w-4 h-4 text-[#8DBFB4]" />
                    <span className="text-xs font-bold text-[#1E2A2E] uppercase tracking-wider">
                      Bug Diagnostic Information <span className="text-[#1E2A2E]/40 font-normal lowercase">(helps us reproduce &amp; fix rapidly)</span>
                    </span>
                  </div>

                  <div>
                    <label htmlFor="f-steps" className="block text-xs font-semibold text-[#1E2A2E] mb-1">
                      Steps to reproduce
                    </label>
                    <textarea
                      id="f-steps"
                      rows={2}
                      maxLength={1500}
                      value={stepsToReproduce}
                      onChange={(e) => setStepsToReproduce(e.target.value)}
                      placeholder="1. Opened /write page&#10;2. Clicked submit&#10;3. Page showed an error"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="f-expected" className="block text-xs font-semibold text-[#1E2A2E] mb-1">
                        What did you expect to happen?
                      </label>
                      <input
                        id="f-expected"
                        type="text"
                        maxLength={500}
                        value={expectedBehavior}
                        onChange={(e) => setExpectedBehavior(e.target.value)}
                        placeholder="e.g., Entry to save and transition to dashboard"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                      />
                    </div>

                    <div>
                      <label htmlFor="f-actual" className="block text-xs font-semibold text-[#1E2A2E] mb-1">
                        What actually happened?
                      </label>
                      <input
                        id="f-actual"
                        type="text"
                        maxLength={500}
                        value={actualBehavior}
                        onChange={(e) => setActualBehavior(e.target.value)}
                        placeholder="e.g., Red error banner appeared"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Email Field */}
              <div>
                <label htmlFor="f-email" className="block text-xs font-semibold text-[#1E2A2E] mb-1.5">
                  Follow-up Email <span className="text-[#1E2A2E]/40 font-normal">(Optional — provides confirmation &amp; updates)</span>
                </label>
                <input
                  id="f-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#1E2A2E]/15 rounded-lg outline-none focus:border-[#8DBFB4] transition-all text-[#1E2A2E]"
                />
                <p className="text-[11px] text-[#1E2A2E]/50 mt-1">
                  We use your email exclusively for correspondence regarding this report. Never for marketing.
                </p>
              </div>

              {/* Bot trap honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="bot_trap"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botTrap}
                  onChange={(e) => setBotTrap(e.target.value)}
                />
              </div>

              {/* Submission Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1E2A2E] hover:bg-[#2A3A3E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8DBFB4]" />
                      <span>Transmitting Report...</span>
                    </>
                  ) : (
                    <span>Submit {submissionType === 'bug_report' ? 'Bug Report' : submissionType === 'issue' ? 'Technical Issue' : 'Feedback'}</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#1E2A2E]/50 leading-relaxed">
                  Ingress Within Data Sovereignty · Submissions are evaluated strictly for platform quality and care operations.
                </p>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#1E2A2E]/8 text-center text-xs text-[#1E2A2E]/50 bg-[#F6F1EA]">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; {new Date().getFullYear()} Ingress Within. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="/" onClick={(e) => { e.preventDefault(); if (onOpenPolicy) onOpenPolicy('privacy'); }} className="hover:text-[#1E2A2E] transition-colors cursor-pointer">
              Privacy Policy
            </a>
            <a href="/" onClick={(e) => { e.preventDefault(); if (onOpenPolicy) onOpenPolicy('terms'); }} className="hover:text-[#1E2A2E] transition-colors cursor-pointer">
              Terms of Use
            </a>
            <a href={`mailto:${SUPPORT_CONFIG.supportEmail}`} className="hover:text-[#1E2A2E] transition-colors">
              {SUPPORT_CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
