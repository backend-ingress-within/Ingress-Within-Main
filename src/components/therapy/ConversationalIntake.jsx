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
  }, [messages, currentQuestionId, matchingInProgress]);

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
    if (loading || matchingInProgress) return;
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

    // Call server to persist and evaluate acknowledgment
    setLoading(true);
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

      const acknowledgment =
        data.acknowledgment ||
        (typeof currentConfig.getNaturalAcknowledgment === 'function'
          ? currentConfig.getNaturalAcknowledgment(answerVal, nextAnswers)
          : 'Thank you for sharing.');

      // Push assistant acknowledgment
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_ack_${Date.now()}`,
          sender: 'assistant',
          text: acknowledgment,
          questionId: currentQId,
          timestamp: new Date().toISOString(),
        },
      ]);

      const nextQId = data.nextQuestionId || (
        typeof currentConfig.getNextQuestionId === 'function'
          ? currentConfig.getNextQuestionId(answerVal, nextAnswers)
          : null
      );

      if (nextQId) {
        setCurrentQuestionId(nextQId);
        const nextCfg = getQuestionById(nextQId);
        if (nextCfg && nextCfg.id !== 'contact_consent') {
          // Push next question prompt
          setMessages((prev) => [
            ...prev,
            {
              id: `msg_prompt_${Date.now()}`,
              sender: 'assistant',
              text: nextCfg.prompt,
              questionId: nextCfg.id,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } else {
        // Conversation complete, prompt consent step
        setCurrentQuestionId('contact_consent');
      }
    } catch (err) {
      console.warn('Answer persistence notice:', err);
      // Fallback: advance locally
      let fallbackNext = 'contact_consent';
      if (typeof currentConfig.getNextQuestionId === 'function') {
        const next = currentConfig.getNextQuestionId(answerVal, nextAnswers);
        if (next) fallbackNext = next;
      }
      setCurrentQuestionId(fallbackNext);
    } finally {
      setLoading(false);
    }
  };

  // Back to previous question
  const handleBackQuestion = () => {
    if (questionHistory.length === 0) return;
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
    }, 1800);
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
              <strong className="text-primary font-medium">₹{selectedTherapistSuccess.fee || 1500}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-mid">
              <span>Format</span>
              <strong className="text-primary font-medium">
                {(selectedTherapistSuccess.formats || ['Telehealth']).join(', ')}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof onStartBooking === 'function') {
                  onStartBooking(selectedTherapistSuccess);
                } else {
                  exit();
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Schedule First Session</span>
              <Calendar size={15} />
            </button>
            <button
              type="button"
              onClick={exit}
              className="w-full sm:w-auto px-6 py-3.5 border border-primary/20 text-primary hover:bg-primary/5 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Return to Care Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MATCH OUTCOME SCREEN (Shortlist OR Strict No-Match)
  // ---------------------------------------------------------------------------
  if (matchOutcome) {
    // ZERO MATCHES CASE (NON-NEGOTIABLE ZERO-BROADCAST REASSURING PATH)
    if (matchOutcome.status === 'no_match' || (matchOutcome.matches && matchOutcome.matches.length === 0)) {
      return (
        <div className="w-full max-w-[760px] mx-auto px-4 py-8 animate-in fade-in duration-300">
          <div className="bg-white border border-[#132A24]/12 rounded-3xl p-6 sm:p-10 shadow-lg text-left">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 w-fit mb-4">
              <Clock size={13} />
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
  // RENDER: MAIN CHATBOT CONVERSATIONAL CONTAINER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[800px] mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex flex-col min-h-[82vh]">
      {/* TOP HEADER: Progress, Title, Save & Resume */}
      <header className="bg-white/80 backdrop-blur-md border border-[#132A24]/10 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={exit}
            className="w-8 h-8 rounded-lg border border-[#132A24]/10 flex items-center justify-center text-mid hover:text-primary hover:border-accent/40 transition-all cursor-pointer shrink-0"
            title="Exit conversation"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm sm:text-base font-semibold text-primary truncate">
                Talk it through
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Conversational Intake
              </span>
            </div>
            <div className="text-[11px] text-mid truncate">
              Step {currentIndex + 1} of {activeQuestions.length} · {currentConfig.category}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveAndResumeLater}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#132A24]/15 hover:border-accent/40 text-primary hover:bg-primary/5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Save &amp; Resume</span>
          </button>
          <button
            type="button"
            onClick={exit}
            className="px-3 py-1.5 text-xs text-mid hover:text-primary transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="w-full bg-[#132A24]/10 h-1 rounded-full mb-4 overflow-hidden">
        <div
          className="bg-accent h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {saveSuccessMsg && (
        <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center animate-in fade-in">
          {saveSuccessMsg}
        </div>
      )}

      {/* CHAT STREAM (Message Scroll Area) */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={14} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-[13.5px] leading-relaxed ${
                  isAssistant
                    ? 'bg-white border border-[#132A24]/10 text-[#132A24] shadow-2xs rounded-tl-xs'
                    : 'bg-primary text-white shadow-2xs rounded-tr-xs font-light'
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

        {loading && (
          <div className="flex items-center gap-2 text-xs text-mid/70 italic px-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Thinking and adapting...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ACTIVE QUESTION INPUT CONTROL AREA */}
      <div className="mt-auto pt-3 border-t border-[#132A24]/10 bg-warm-paper/95 backdrop-blur-md">
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-[#FBEFEA] border border-[#E3B3A2] text-[#8A3320] text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* QUESTION PROMPT BANNER */}
        <div className="mb-3.5 text-left">
          <div className="text-[10px] uppercase font-bold tracking-wider text-secondary mb-1">
            Question {currentIndex + 1}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-normal text-primary leading-tight">
            {currentConfig.prompt}
          </h3>
          {currentConfig.helperText && (
            <p className="text-xs text-mid font-light mt-1">
              {currentConfig.helperText}
            </p>
          )}
        </div>

        {/* INPUT TYPE 1: TEXTAREA */}
        {currentConfig.inputType === 'textarea' && (
          <div className="space-y-2">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (textInput.trim()) handleAnswer(textInput.trim());
                }
              }}
              rows={3}
              placeholder={currentConfig.placeholder || 'Type your reflection here...'}
              className="w-full p-3.5 rounded-xl bg-white border border-[#132A24]/15 focus:border-accent focus:ring-1 focus:ring-accent/30 text-xs sm:text-sm text-primary placeholder:text-mid/50 outline-none resize-none transition-all"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-mid/70 hidden sm:inline">
                Press Enter to send · Shift+Enter for new line
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {questionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBackQuestion}
                    className="px-3 py-2 text-xs text-mid hover:text-primary font-medium cursor-pointer"
                  >
                    Back
                  </button>
                )}
                {currentConfig.skippable && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-3.5 py-2 text-xs border border-primary/20 rounded-xl hover:bg-primary/5 text-primary cursor-pointer font-medium"
                  >
                    {currentConfig.skipLabel || 'Skip'}
                  </button>
                )}
                <button
                  type="button"
                  disabled={!textInput.trim() || loading}
                  onClick={() => handleAnswer(textInput.trim())}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>Continue</span>
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INPUT TYPE 2: SINGLE SELECT */}
        {currentConfig.inputType === 'single_select' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(currentConfig.options || []).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  className="p-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#132A24]/12 hover:border-accent/40 text-left text-xs font-medium text-primary transition-all cursor-pointer flex items-center justify-between gap-2 group shadow-2xs"
                >
                  <span>{opt.label}</span>
                  <ChevronRight size={14} className="text-mid/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              {questionHistory.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  className="px-3 py-1.5 text-xs text-mid hover:text-primary font-medium cursor-pointer"
                >
                  ← Back to previous question
                </button>
              ) : <div />}

              {currentConfig.skippable && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-3.5 py-1.5 text-xs border border-primary/20 rounded-xl hover:bg-primary/5 text-primary cursor-pointer"
                >
                  {currentConfig.skipLabel || 'Skip'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* INPUT TYPE 3: MULTI SELECT */}
        {currentConfig.inputType === 'multi_select' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {(currentConfig.options || []).map((opt) => {
                const isSelected = selectedMulti.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMulti(selectedMulti.filter((v) => v !== opt.value));
                      } else {
                        setSelectedMulti([...selectedMulti, opt.value]);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-accent text-white border-accent shadow-xs'
                        : 'bg-white border-[#132A24]/12 hover:border-accent/40 text-primary'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={13} />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              {questionHistory.length > 0 ? (
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  className="px-3 py-2 text-xs text-mid hover:text-primary font-medium cursor-pointer"
                >
                  ← Back
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                {currentConfig.skippable && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-3.5 py-2 text-xs border border-primary/20 rounded-xl hover:bg-primary/5 text-primary cursor-pointer font-medium"
                  >
                    {currentConfig.skipLabel || 'Skip'}
                  </button>
                )}
                <button
                  type="button"
                  disabled={selectedMulti.length === 0 && !currentConfig.skippable}
                  onClick={() => handleAnswer(selectedMulti)}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>Confirm Selection ({selectedMulti.length})</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* INPUT TYPE 4: YES / NO */}
        {currentConfig.inputType === 'yes_no' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAnswer('Yes')}
                className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#132A24]/15 hover:border-accent/40 text-primary hover:bg-accent/5 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleAnswer('No')}
                className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#132A24]/15 hover:border-accent/40 text-primary hover:bg-accent/5 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
              >
                No
              </button>
            </div>

            {questionHistory.length > 0 && (
              <button
                type="button"
                onClick={handleBackQuestion}
                className="px-3 py-1 text-xs text-mid hover:text-primary font-medium cursor-pointer"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {/* INPUT TYPE 5: CONTACT & EXPLICIT MATCHING CONSENT */}
        {currentConfig.inputType === 'contact_consent' && (
          <div className="bg-white border border-[#132A24]/12 rounded-2xl p-4 sm:p-5 text-left space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-xl border border-primary/15 text-xs text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-primary/15 text-xs text-primary focus:border-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3 py-2 rounded-xl border border-primary/15 text-xs text-primary focus:border-accent outline-none"
                />
              </div>
            </div>

            {/* Privacy Shield & Consent Notice */}
            <div className="p-3.5 bg-[#FAF8F5] border border-primary/10 rounded-xl space-y-2 text-xs text-mid leading-relaxed font-light">
              <div className="flex items-center gap-2 font-bold uppercase text-[10px] text-primary tracking-wider">
                <Lock size={12} className="text-accent" />
                <span>Confidential Matching Privacy Guarantee</span>
              </div>
              <p className="m-0">
                Your intake answers are evaluated algorithmically against active, verified licensed therapists. Your full intake is <strong>only shared with the specific therapist you explicitly select</strong>. If no direct match is found, your record is held securely for internal clinical review with zero broadcasts.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 accent-accent w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-primary font-medium">
                I authorize Ingress Within to evaluate verified clinicians based on my intake answers and schedule 1-on-1 care.
              </span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBackQuestion}
                className="px-3 py-2 text-xs text-mid hover:text-primary font-medium cursor-pointer"
              >
                ← Back to previous question
              </button>

              <button
                type="button"
                disabled={!consentGranted || matchingInProgress}
                onClick={handleRunMatching}
                className="px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-accent/30 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                {matchingInProgress ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Evaluating Therapists...</span>
                  </>
                ) : (
                  <>
                    <span>Find My Matching Therapists</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
