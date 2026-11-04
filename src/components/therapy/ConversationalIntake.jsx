'use strict';
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Phone,
  AlertCircle,
  RotateCcw,
  User,
  HeartHandshake,
  Lock,
  ChevronRight,
  Info,
  Calendar,
  Bookmark,
  X,
} from 'lucide-react';
import {
  CONVERSATIONAL_QUESTIONS,
  getQuestionById,
  getActiveQuestions,
} from '../../lib/therapy/conversationalIntakeConfig';
import TherapyMatchResultsView from './TherapyMatchResultsView';

export default function ConversationalIntake({ exit, user, profile, onStartBooking }) {
  const [sessionId, setSessionId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionId, setCurrentQuestionId] = useState('reason');
  const [questionHistory, setQuestionHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Contact consent state
  const [contactName, setContactName] = useState(profile?.name || user?.name || user?.full_name || '');
  const [contactEmail, setContactEmail] = useState(profile?.email || user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone_number || user?.phoneNumber || user?.phone || '');
  const [consentGranted, setConsentGranted] = useState(false);

  // Match outcome states
  const [matchOutcome, setMatchOutcome] = useState(null);
  const [selectedTherapistSuccess, setSelectedTherapistSuccess] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentQuestionId, matchingInProgress]);

  // Initial load: start or resume session
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      setLoading(true);
      try {
        const res = await fetch('/api/therapy/conversation/session');
        const data = await res.json();
        if (!isMounted) return;

        if (res.ok && data.sessionId) {
          setSessionId(data.sessionId);
          const initialAnswers = data.answers || {};
          setAnswers(initialAnswers);

          // Restore contact fields if present
          if (initialAnswers.contact_name) setContactName(initialAnswers.contact_name);
          if (initialAnswers.contact_email) setContactEmail(initialAnswers.contact_email);
          if (initialAnswers.contact_phone) setContactPhone(initialAnswers.contact_phone);

          const qId = data.currentQuestionId || 'reason';
          setCurrentQuestionId(qId);

          // Build message history from answers
          const restoredMessages = [
            {
              id: 'msg_welcome',
              sender: 'assistant',
              text: CONVERSATIONAL_QUESTIONS[0].prompt,
              questionId: 'reason',
              timestamp: new Date().toISOString(),
            },
          ];

          // Add past answers to message stream if resuming
          const active = getActiveQuestions(initialAnswers);
          for (const q of active) {
            if (initialAnswers[q.id] !== undefined && q.id !== 'contact_consent') {
              const val = initialAnswers[q.id];
              const textVal = Array.isArray(val) ? val.join(', ') : String(val);
              restoredMessages.push({
                id: `msg_user_${q.id}`,
                sender: 'user',
                text: textVal,
                questionId: q.id,
                timestamp: new Date().toISOString(),
              });

              if (typeof q.getNaturalAcknowledgment === 'function') {
                const ack = q.getNaturalAcknowledgment(val, initialAnswers);
                if (ack) {
                  restoredMessages.push({
                    id: `msg_ack_${q.id}`,
                    sender: 'assistant',
                    text: ack,
                    isAck: true,
                    questionId: q.id,
                    timestamp: new Date().toISOString(),
                  });
                }
              }
            }
          }

          setMessages(restoredMessages);
        } else {
          // Client offline / test mode fallback
          const localSessionId = 'sess_local_' + Date.now().toString(36);
          setSessionId(localSessionId);
          setMessages([
            {
              id: 'msg_welcome',
              sender: 'assistant',
              text: CONVERSATIONAL_QUESTIONS[0].prompt,
              questionId: 'reason',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.warn('Session resume notice:', err);
        const localSessionId = 'sess_local_' + Date.now().toString(36);
        setSessionId(localSessionId);
        setMessages([
          {
            id: 'msg_welcome',
            sender: 'assistant',
            text: CONVERSATIONAL_QUESTIONS[0].prompt,
            questionId: 'reason',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeQuestions = getActiveQuestions(answers);
  const currentConfig = getQuestionById(currentQuestionId) || activeQuestions[0];
  const currentIndex = activeQuestions.findIndex((q) => q.id === currentQuestionId);
  const progressPercent = Math.min(
    100,
    Math.round(((currentIndex >= 0 ? currentIndex : 0) / Math.max(1, activeQuestions.length)) * 100)
  );

  // Submit response to current question
  const handleAnswer = async (answerVal) => {
    if (loading || matchingInProgress || isTyping) return;
    setErrorMsg('');

    // Pre-validation
    if (currentConfig.required && !currentConfig.skippable) {
      if (answerVal === undefined || answerVal === null || answerVal === '') {
        setErrorMsg('Please share a response to continue.');
        return;
      }
      if (Array.isArray(answerVal) && answerVal.length === 0) {
        setErrorMsg('Please select at least one option to continue.');
        return;
      }
    }

    const currentQId = currentQuestionId;
    const nextAnswers = { ...answers, [currentQId]: answerVal };
    setAnswers(nextAnswers);

    // Push user message to UI
    const userText = Array.isArray(answerVal)
      ? answerVal.join(', ')
      : typeof answerVal === 'object'
      ? JSON.stringify(answerVal)
      : String(answerVal);

    setMessages((prev) => [
      ...prev,
      {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: userText,
        questionId: currentQId,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Track history for back navigation
    setQuestionHistory((prev) => [...prev, currentQId]);

    // Reset inputs
    setTextInput('');
    setSelectedMulti([]);

    // Trigger typing indicator for natural conversational pacing
    setIsTyping(true);

    try {
      const res = await fetch('/api/therapy/conversation/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQId,
          answerValue: answerVal,
          currentAnswers: answers,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // Conversational pacing delay: minimum 320ms so user feels heard
      await new Promise((r) => setTimeout(r, 320));

      const acknowledgment =
        data.acknowledgment ||
        (typeof currentConfig.getNaturalAcknowledgment === 'function'
          ? currentConfig.getNaturalAcknowledgment(answerVal, nextAnswers)
          : 'Thank you for sharing.');

      const nextQId = data.nextQuestionId || (
        typeof currentConfig.getNextQuestionId === 'function'
          ? currentConfig.getNextQuestionId(answerVal, nextAnswers)
          : null
      );

      const nextCfg = nextQId ? getQuestionById(nextQId) : null;

      // Update message thread
      setMessages((prev) => {
        const updated = [
          ...prev,
          {
            id: `msg_ack_${Date.now()}`,
            sender: 'assistant',
            text: acknowledgment,
            isAck: true,
            questionId: currentQId,
            timestamp: new Date().toISOString(),
          },
        ];

        if (nextCfg && nextCfg.id !== 'contact_consent') {
          updated.push({
            id: `msg_prompt_${Date.now() + 1}`,
            sender: 'assistant',
            text: nextCfg.prompt,
            questionId: nextCfg.id,
            timestamp: new Date().toISOString(),
          });
        }
        return updated;
      });

      if (nextQId) {
        setCurrentQuestionId(nextQId);
      } else {
        setCurrentQuestionId('contact_consent');
      }
    } catch (err) {
      console.warn('Answer persistence notice:', err);
      let fallbackNext = 'contact_consent';
      if (typeof currentConfig.getNextQuestionId === 'function') {
        const next = currentConfig.getNextQuestionId(answerVal, nextAnswers);
        if (next) fallbackNext = next;
      }
      setCurrentQuestionId(fallbackNext);
    } finally {
      setIsTyping(false);
    }
  };

  // Back to previous question
  const handleBackQuestion = () => {
    if (questionHistory.length === 0 || isTyping) return;
    const prevQId = questionHistory[questionHistory.length - 1];
    setQuestionHistory((prev) => prev.slice(0, -1));
    setCurrentQuestionId(prevQId);

    // Pre-fill input if text
    if (answers[prevQId]) {
      if (typeof answers[prevQId] === 'string') {
        setTextInput(answers[prevQId]);
      } else if (Array.isArray(answers[prevQId])) {
        setSelectedMulti(answers[prevQId]);
      }
    }
  };

  // Skip optional question
  const handleSkip = () => {
    handleAnswer('Skipped');
  };

  // Trigger matching after explicit consent
  const handleRunMatching = async () => {
    if (!consentGranted) {
      setErrorMsg('Please confirm your consent to find matched therapists.');
      return;
    }
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg('Please ensure your name, email, and phone number are provided for clinical confirmation.');
      return;
    }

    const finalAnswers = {
      ...answers,
      contact_name: contactName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      contact_consent: {
        fullName: contactName.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        consentGranted: true,
        consentedAt: new Date().toISOString(),
      },
    };
    setAnswers(finalAnswers);

    setMatchingInProgress(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/therapy/conversation/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: finalAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Matching evaluation failed.');
      }

      setMatchOutcome(data);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to complete matching. Please check your connection.');
    } finally {
      setMatchingInProgress(false);
    }
  };

  // Explicit therapist selection
  const handleSelectTherapist = async (therapist) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/therapy/conversation/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          therapistId: therapist.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to select therapist.');
      }

      setSelectedTherapistSuccess(therapist);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to record therapist selection.');
    }
  };

  // Request manual team assistance (for zero-match or personal preference)
  const [teamRequested, setTeamRequested] = useState(false);
  const handleRequestTeam = async () => {
    try {
      await fetch('/api/therapy/conversation/request-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          notes: 'Client requested team assistance from conversational intake.',
        }),
      });
      setTeamRequested(true);
    } catch (err) {
      setTeamRequested(true);
    }
  };

  // Save and resume later
  const handleSaveAndResumeLater = () => {
    setSaveSuccessMsg('Your progress has been safely saved. You can return anytime to continue.');
    setTimeout(() => {
      setSaveSuccessMsg('');
      exit();
    }, 1500);
  };

  // ---------------------------------------------------------------------------
  // RENDER: SELECTED THERAPIST CONFIRMATION SCREEN
  // ---------------------------------------------------------------------------
  if (selectedTherapistSuccess) {
    return (
      <div className="w-full max-w-[720px] mx-auto px-4 py-8 animate-in fade-in duration-300">
        <div className="bg-white border border-[#132A24]/12 rounded-3xl p-6 sm:p-10 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle2 size={32} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Therapist Connection Initiated
          </span>

          <h2 className="font-serif text-3xl font-semibold text-[#132A24] mt-4 mb-3">
            You’re connected with {selectedTherapistSuccess.name}
          </h2>

          <p className="text-mid text-sm sm:text-base max-w-[520px] mx-auto leading-relaxed mb-6 font-light">
            We have securely transmitted your selected match request to {selectedTherapistSuccess.name}.
            Only this practitioner will review your relevant intake background. You can now schedule your first session.
          </p>

          <div className="bg-[#FAF8F5] border border-[#132A24]/8 rounded-2xl p-5 max-w-[480px] mx-auto mb-8 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs text-mid pb-2 border-b border-[#132A24]/8">
              <span>Practitioner</span>
              <strong className="text-primary font-medium">{selectedTherapistSuccess.name}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-mid pb-2 border-b border-[#132A24]/8">
              <span>Fee per session</span>
              <strong className="text-primary font-medium">₹{Number(selectedTherapistSuccess.fee || 1500).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-mid pb-2 border-b border-[#132A24]/8">
              <span>Format</span>
              <strong className="text-primary font-medium">Online (Telehealth Google Meet)</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-mid">
              <span>Confidentiality</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Encrypted &amp; Clinical Safe
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof onStartBooking === 'function') {
                  onStartBooking(selectedTherapistSuccess);
                } else {
                  exit();
                }
              }}
              className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Initial Session</span>
              <Calendar size={15} />
            </button>
            <button
              type="button"
              onClick={exit}
              className="px-6 py-3.5 border border-[#132A24]/20 hover:bg-[#132A24]/5 text-primary font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Return to Therapy Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MATCH OUTCOME (RESULTS OR NO-MATCH REASSURANCE)
  // ---------------------------------------------------------------------------
  if (matchOutcome) {
    if (!matchOutcome.matches || matchOutcome.matches.length === 0) {
      return (
        <div className="w-full max-w-[720px] mx-auto px-4 py-8 animate-in fade-in duration-300">
          <div className="bg-white border border-[#132A24]/12 rounded-3xl p-6 sm:p-10 text-left shadow-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-4">
              <Clock size={14} />
              <span>Personal Care Coordination Needed</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#132A24] leading-snug mb-3">
              We couldn’t find an immediate match based on your preferences right now.
            </h2>

            <p className="text-mid text-sm sm:text-base leading-relaxed mb-6 font-light">
              That’s completely okay — finding the right therapeutic fit matters. Because we strictly partner with verified, active practitioners with open capacity, nobody on our roster was a confident match for every specific criterion you requested.
            </p>

            <div className="bg-[#FAF8F5] border border-[#132A24]/8 rounded-2xl p-5 mb-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                What happens next
              </div>
              <p className="text-xs sm:text-sm text-mid leading-relaxed font-light">
                Our internal clinical care team has recorded your intake reference securely (<strong>{matchOutcome.referenceId}</strong>). An authorized coordinator will personally review your requirements and follow up with you.
              </p>
              <div className="p-3 bg-white rounded-xl border border-primary/8 text-xs text-mid flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy Guarantee:</strong> Your confidential intake is never broadcast to therapists or posted as a general lead. It remains securely held for internal coordinator review only.
                </span>
              </div>
            </div>

            {/* Helpline Notice */}
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900 mb-8 flex items-start gap-3">
              <Phone size={16} className="text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong>Need immediate assistance?</strong> If you are experiencing acute distress or need support right away, free confidential helplines are available 24/7 across India: Tele-MANAS (<strong>14416</strong>) and KIRAN (<strong>1800-599-0019</strong>).
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {!teamRequested ? (
                <button
                  type="button"
                  onClick={handleRequestTeam}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <HeartHandshake size={15} />
                  <span>Request Personal Team Coordination</span>
                </button>
              ) : (
                <div className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check size={15} />
                  <span>Coordination Request Received</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMatchOutcome(null);
                  setCurrentQuestionId('concerns');
                }}
                className="px-5 py-3 border border-primary/20 text-primary hover:bg-primary/5 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Adjust My Preferences
              </button>

              <button
                type="button"
                onClick={exit}
                className="px-5 py-3 text-mid hover:text-primary text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    // MATCHES FOUND CASE
    return (
      <div className="w-full max-w-[820px] mx-auto px-4 py-8 animate-in fade-in duration-300">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMatchOutcome(null)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mid hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Review Intake Answers</span>
          </button>
          <span className="text-xs text-mid">
            {matchOutcome.matches.length} verified clinician{matchOutcome.matches.length > 1 ? 's' : ''} matched
          </span>
        </div>

        <TherapyMatchResultsView
          matchData={matchOutcome}
          clientAnswers={answers}
          onRequestTherapist={handleSelectTherapist}
          onEditAnswers={() => {
            setMatchOutcome(null);
            setCurrentQuestionId('concerns');
          }}
          showNumericScore={false}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: CHATBOT INTERFACE (FIXED-HEIGHT CONVERSATIONAL SHELL)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[760px] mx-auto px-2 sm:px-4 py-2 sm:py-3 h-[86vh] min-h-[580px] max-h-[820px] flex flex-col animate-in fade-in duration-200">
      <div className="flex-1 bg-white/95 backdrop-blur-md border border-[#132A24]/12 rounded-3xl shadow-xl flex flex-col overflow-hidden relative">
        
        {/* PINNED CHATBOT HEADER */}
        <header className="px-4 sm:px-6 py-3.5 bg-white/90 border-b border-[#132A24]/8 flex items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#1E3A34] to-[#132A24] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={17} className="text-amber-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-sm sm:text-base font-semibold text-[#132A24] truncate">
                  Talk it through
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full hidden sm:inline">
                  Adaptive Matching
                </span>
              </div>
              <div className="text-[11px] text-mid truncate flex items-center gap-1.5 font-light">
                <span>Step {currentIndex >= 0 ? currentIndex + 1 : activeQuestions.length} of {activeQuestions.length}</span>
                <span>•</span>
                <span className="capitalize">{currentConfig.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveAndResumeLater}
              title="Save your progress and return anytime"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#132A24]/15 hover:border-accent/40 text-primary hover:bg-primary/5 text-xs font-semibold transition-all cursor-pointer"
            >
              <Bookmark size={13} className="text-accent" />
              <span className="hidden sm:inline">Save &amp; Resume</span>
            </button>
            <button
              type="button"
              onClick={exit}
              className="w-8 h-8 rounded-xl border border-transparent hover:border-[#132A24]/10 text-mid hover:text-primary flex items-center justify-center transition-all cursor-pointer"
              title="Exit intake"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* THIN PROGRESS INDICATOR */}
        <div className="w-full bg-[#132A24]/6 h-1 shrink-0 overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {saveSuccessMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center animate-in fade-in shrink-0">
            {saveSuccessMsg}
          </div>
        )}

        {/* CHAT MESSAGES SCROLL AREA (Infinite inside the card, page never scrolls) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 scroll-smooth">
          {messages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            const isAck = Boolean(msg.isAck);

            if (isAck) {
              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-2.5 justify-start animate-in fade-in duration-200 max-w-[88%]"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <HeartHandshake size={13} />
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-200/50 text-[#132A24] rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed font-light italic shadow-2xs">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
              >
                {isAssistant && (
                  <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent border border-accent/20 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Sparkles size={14} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13.5px] leading-relaxed ${
                    isAssistant
                      ? 'bg-[#FAF8F5] border border-[#132A24]/8 text-[#132A24] shadow-2xs rounded-tl-xs font-normal'
                      : 'bg-[#132A24] text-white shadow-xs rounded-tr-xs font-light'
                  }`}
                >
                  {msg.text}
                </div>

                {!isAssistant && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {/* REALISTIC TYPING INDICATOR */}
          {isTyping && (
            <div className="flex items-center gap-2.5 justify-start animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent border border-accent/20 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles size={13} />
              </div>
              <div className="bg-[#FAF8F5] border border-[#132A24]/8 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PINNED BOTTOM INTERACTIVE ACTION DOCK */}
        <div className="border-t border-[#132A24]/10 bg-white/95 backdrop-blur-md p-3 sm:p-4 shrink-0 z-10">
          {errorMsg && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-[#FBEFEA] border border-[#E3B3A2] text-[#8A3320] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Helper caption for current step */}
          {currentConfig.inputType !== 'contact_consent' && (
            <div className="flex items-center justify-between text-[11px] text-mid/80 mb-2 px-1">
              <span className="font-medium text-secondary truncate">
                {currentConfig.helperText || (
                  currentConfig.inputType === 'single_select'
                    ? 'Select an option to continue:'
                    : currentConfig.inputType === 'multi_select'
                    ? 'Select all that apply, then confirm:'
                    : currentConfig.inputType === 'yes_no'
                    ? 'Choose Yes or No:'
                    : 'Share your thoughts:'
                )}
              </span>
              {questionHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  disabled={isTyping}
                  className="text-mid hover:text-primary transition-colors cursor-pointer text-[11px] font-medium"
                >
                  ← Previous question
                </button>
              )}
            </div>
          )}

          {/* INPUT 1: TEXTAREA / REFLECTION */}
          {currentConfig.inputType === 'textarea' && (
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (textInput.trim()) handleAnswer(textInput.trim());
                    }
                  }}
                  rows={2}
                  disabled={isTyping}
                  placeholder={currentConfig.placeholder || 'Type your reflection here...'}
                  className="w-full p-3 pr-12 rounded-2xl bg-[#FAF8F5] border border-[#132A24]/12 focus:border-emerald-600 focus:bg-white focus:ring-1 focus:ring-emerald-600/30 text-xs sm:text-sm text-primary placeholder:text-mid/50 outline-none resize-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  disabled={!textInput.trim() || isTyping}
                  onClick={() => handleAnswer(textInput.trim())}
                  className="absolute right-2.5 bottom-3.5 w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Send reflection"
                >
                  <Send size={13} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-[10px] text-mid/60 hidden sm:inline">
                  Enter to send · Shift+Enter for new line
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {currentConfig.skippable && (
                    <button
                      type="button"
                      disabled={isTyping}
                      onClick={handleSkip}
                      className="px-3 py-1 text-xs border border-primary/20 rounded-lg hover:bg-primary/5 text-primary cursor-pointer font-medium"
                    >
                      {currentConfig.skipLabel || 'Skip'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INPUT 2: SINGLE SELECT (QUICK REPLIES) */}
          {currentConfig.inputType === 'single_select' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-0.5">
                {(currentConfig.options || []).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleAnswer(opt.value)}
                    className="p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#132A24]/10 hover:border-emerald-600 hover:shadow-xs text-left text-xs font-medium text-primary transition-all cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <span className="leading-snug">{opt.label}</span>
                    <ChevronRight size={13} className="text-mid/40 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {currentConfig.skippable && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isTyping}
                    onClick={handleSkip}
                    className="px-3 py-1 text-xs border border-primary/20 rounded-lg hover:bg-primary/5 text-primary cursor-pointer font-medium"
                  >
                    {currentConfig.skipLabel || 'Skip'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INPUT 3: MULTI SELECT (TOGGLE CHIPS) */}
          {currentConfig.inputType === 'multi_select' && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-0.5">
                {(currentConfig.options || []).map((opt) => {
                  const isSelected = selectedMulti.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isTyping}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedMulti(selectedMulti.filter((v) => v !== opt.value));
                        } else {
                          setSelectedMulti([...selectedMulti, opt.value]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-[#FAF8F5] hover:bg-white border-[#132A24]/12 hover:border-emerald-600/40 text-primary'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={12} className="stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#132A24]/6">
                <span className="text-[11px] text-mid">
                  {selectedMulti.length > 0
                    ? `${selectedMulti.length} selected`
                    : 'Select options above'}
                </span>

                <div className="flex items-center gap-2">
                  {currentConfig.skippable && (
                    <button
                      type="button"
                      disabled={isTyping}
                      onClick={handleSkip}
                      className="px-3 py-1.5 text-xs border border-primary/20 rounded-xl hover:bg-primary/5 text-primary cursor-pointer font-medium"
                    >
                      {currentConfig.skipLabel || 'Skip'}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={selectedMulti.length === 0 && !currentConfig.skippable || isTyping}
                    onClick={() => handleAnswer(selectedMulti)}
                    className="px-5 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/20 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Confirm Selection</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INPUT 4: YES / NO */}
          {currentConfig.inputType === 'yes_no' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleAnswer('Yes')}
                  className="py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#132A24]/15 hover:border-emerald-600 text-primary hover:text-emerald-800 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                >
                  Yes
                </button>
                <button
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleAnswer('No')}
                  className="py-3 px-4 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#132A24]/15 hover:border-emerald-600 text-primary hover:text-emerald-800 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* INPUT 5: CONTACT & EXPLICIT MATCHING CONSENT */}
          {currentConfig.inputType === 'contact_consent' && (
            <div className="bg-[#FAF8F5] border border-[#132A24]/12 rounded-2xl p-3.5 sm:p-4 text-left space-y-3 shadow-inner max-h-56 sm:max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-1.5 rounded-lg border border-primary/15 text-xs text-primary bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-1.5 rounded-lg border border-primary/15 text-xs text-primary bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-1.5 rounded-lg border border-primary/15 text-xs text-primary bg-white focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Privacy Shield & Consent Notice */}
              <div className="p-3 bg-white border border-primary/10 rounded-xl space-y-1.5 text-xs text-mid leading-relaxed font-light">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-primary tracking-wider">
                  <Lock size={12} className="text-emerald-700" />
                  <span>Confidential Matching Privacy Guarantee</span>
                </div>
                <p className="m-0 text-[11.5px]">
                  Your intake answers are evaluated algorithmically against active, verified licensed therapists. Your full intake is <strong>only shared with the specific therapist you explicitly select</strong>. If no direct match is found, your record is held securely for internal clinical review with zero broadcasts.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="mt-0.5 accent-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-primary font-medium">
                  I authorize Ingress Within to evaluate verified clinicians based on my intake answers and schedule 1-on-1 care.
                </span>
              </label>

              <div className="flex items-center justify-between pt-2 border-t border-[#132A24]/8">
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  className="px-3 py-1.5 text-xs text-mid hover:text-primary font-medium cursor-pointer"
                >
                  ← Previous question
                </button>

                <button
                  type="button"
                  disabled={!consentGranted || matchingInProgress}
                  onClick={handleRunMatching}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/40 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {matchingInProgress ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Evaluating Therapists...</span>
                    </>
                  ) : (
                    <>
                      <span>Find My Matching Therapists</span>
                      <Sparkles size={14} className="text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
