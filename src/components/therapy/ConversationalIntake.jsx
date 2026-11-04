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
  Compass,
  Wind,
  Feather,
  Heart,
  HelpCircle,
} from 'lucide-react';
import {
  CONVERSATIONAL_QUESTIONS,
  getQuestionById,
  getActiveQuestions,
} from '../../lib/therapy/conversationalIntakeConfig';
import TherapyMatchResultsView from './TherapyMatchResultsView';

// Curated starter thoughts for open-ended reflection steps to reduce user blank-page anxiety
const STARTER_THOUGHTS = {
  reason: [
    'Feeling overwhelmed with daily stress & burnout',
    'Navigating anxiety and persistent worry',
    'Working through relationship or family difficulties',
    'Processing grief, loss, or major life transition',
    'Seeking clarity, direction, and self-understanding',
  ],
  expectations: [
    'Learn practical coping strategies and tools',
    'Have a safe, non-judgmental space to unpack emotions',
    'Understand unconscious patterns from my past',
    'Build resilience in my close relationships',
  ],
  modality_preference: [
    'Open to what my therapist recommends',
    'CBT (Practical thought & behavioral tools)',
    'Psychodynamic (Exploring root patterns & past experiences)',
    'Somatic (Mind-body stress release)',
  ],
};

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

  // Bespoke Sanctuary Grounding Feature (Take a Breath)
  const [isBreathingMode, setIsBreathingMode] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale gently...');

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

  // Gentle 4-second box-breathing cycle when breathing mode is activated
  useEffect(() => {
    if (!isBreathingMode) return;
    const phases = [
      'Inhale gently through your nose (4s)...',
      'Hold softly, feeling grounded (4s)...',
      'Exhale slowly and release (4s)...',
      'Rest in stillness (4s)...',
    ];
    let idx = 0;
    setBreathPhase(phases[0]);
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathPhase(phases[idx]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isBreathingMode]);

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

  // Derive meaningful therapeutic phases for client clarity
  const phases = [
    { id: 1, label: 'Intent & Reason', maxStep: 4 },
    { id: 2, label: 'Presenting Context', maxStep: 8 },
    { id: 3, label: 'Style & Relational Fit', maxStep: 14 },
    { id: 4, label: 'Therapist Match', maxStep: 17 },
  ];
  const currentStepNum = currentIndex >= 0 ? currentIndex + 1 : 1;
  const currentPhase = phases.find((p) => currentStepNum <= p.maxStep) || phases[phases.length - 1];

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

      // Conversational pacing delay: minimum 340ms so client feels heard
      await new Promise((r) => setTimeout(r, 340));

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
    setSaveSuccessMsg('Your journey has been safely preserved. You can return anytime to continue.');
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
        <div className="bg-[#FAF7F2] border border-[#283D38]/12 rounded-3xl p-6 sm:p-10 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF3ED] text-[#283D38] border border-[#8AA688]/30 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle2 size={32} className="text-[#8AA688]" />
          </div>

          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#795663] bg-[#795663]/10 px-3.5 py-1 rounded-full border border-[#795663]/20">
            Therapist Connection Formed
          </span>

          <h2 className="font-serif text-3xl font-semibold text-[#011627] mt-4 mb-3">
            You’re connected with {selectedTherapistSuccess.name}
          </h2>

          <p className="text-[#4F635E] text-sm sm:text-base max-w-[520px] mx-auto leading-relaxed mb-6 font-light">
            We have securely routed your confidential intake profile exclusively to {selectedTherapistSuccess.name}.
            Only your chosen clinician will review your background before your initial session.
          </p>

          <div className="bg-white border border-[#283D38]/10 rounded-2xl p-5 max-w-[480px] mx-auto mb-8 text-left space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#4F635E] pb-2 border-b border-[#283D38]/8">
              <span>Practitioner</span>
              <strong className="text-[#011627] font-medium">{selectedTherapistSuccess.name}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-[#4F635E] pb-2 border-b border-[#283D38]/8">
              <span>Fee per session</span>
              <strong className="text-[#011627] font-medium">₹{Number(selectedTherapistSuccess.fee || 1500).toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-[#4F635E] pb-2 border-b border-[#283D38]/8">
              <span>Session Format</span>
              <strong className="text-[#011627] font-medium">Online (Telehealth Google Meet)</strong>
            </div>
            <div className="flex items-center justify-between text-xs text-[#4F635E]">
              <span>Confidentiality</span>
              <span className="text-[#283D38] font-semibold flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#8AA688]" /> Verified &amp; Encrypted
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
              className="px-8 py-3.5 bg-[#283D38] hover:bg-[#1E3A34] text-[#FDFBF8] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Initial Session</span>
              <Calendar size={15} className="text-[#D9BCAF]" />
            </button>
            <button
              type="button"
              onClick={exit}
              className="px-6 py-3.5 border border-[#283D38]/20 hover:bg-[#283D38]/5 text-[#011627] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
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
          <div className="bg-[#FAF7F2] border border-[#283D38]/12 rounded-3xl p-6 sm:p-10 text-left shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF5E8] border border-[#B8964A]/30 text-[#6B4A0B] text-xs font-semibold mb-4">
              <Compass size={14} className="text-[#B8964A]" />
              <span>Personal Care Coordination Sanctuary</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#011627] leading-snug mb-3">
              We couldn’t find an immediate match based on your preferences right now.
            </h2>

            <p className="text-[#4F635E] text-sm sm:text-base leading-relaxed mb-6 font-light">
              That is completely okay — therapeutic resonance is delicate and deeply personal. Because we uphold clinical standards and verify every practitioner, none on our immediate roster satisfied every unique preference you specified.
            </p>

            <div className="bg-white border border-[#283D38]/10 rounded-2xl p-5 mb-6 space-y-3 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-[#795663]">
                Our Clinical Commitment to You
              </div>
              <p className="text-xs sm:text-sm text-[#4F635E] leading-relaxed font-light">
                Our internal clinical care coordination team has received your intake record securely under reference ID <strong>{matchOutcome.referenceId}</strong>. A licensed intake coordinator will personally review your answers to help guide your care.
              </p>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#283D38]/8 text-xs text-[#4F635E] flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#8AA688] shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Zero-Broadcast Guarantee:</strong> Your confidential intake is never broadcast or shared with other clinicians as a lead. It remains securely held for internal care coordination only.
                </span>
              </div>
            </div>

            {/* Helpline Notice */}
            <div className="bg-[#FBF5E8]/80 border border-[#B8964A]/30 rounded-xl p-4 text-xs text-[#6B4A0B] mb-8 flex items-start gap-3">
              <Phone size={16} className="text-[#B8964A] shrink-0 mt-0.5" />
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
                  className="px-6 py-3 bg-[#283D38] hover:bg-[#1E3A34] text-[#FDFBF8] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <HeartHandshake size={15} className="text-[#D9BCAF]" />
                  <span>Request Personal Care Coordination</span>
                </button>
              ) : (
                <div className="px-5 py-2.5 bg-[#EDF3ED] border border-[#8AA688]/40 text-[#283D38] text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check size={15} className="text-[#8AA688]" />
                  <span>Coordination Request Received</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setMatchOutcome(null);
                  setCurrentQuestionId('concerns');
                }}
                className="px-5 py-3 border border-[#283D38]/20 text-[#011627] hover:bg-[#283D38]/5 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Adjust My Preferences
              </button>

              <button
                type="button"
                onClick={exit}
                className="px-5 py-3 text-[#4F635E] hover:text-[#011627] text-xs uppercase tracking-wider font-semibold cursor-pointer"
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
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4F635E] hover:text-[#011627] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Review Intake Answers</span>
          </button>
          <span className="text-xs text-[#4F635E]">
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
  // RENDER: BESPOKE INGRESS WITHIN SANCTUARY CHATBOT
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[780px] mx-auto px-2 sm:px-4 py-2 sm:py-3 h-[88vh] min-h-[620px] max-h-[850px] flex flex-col animate-in fade-in duration-200">
      <div className="flex-1 bg-gradient-to-b from-[#FDFBF8] to-[#FAF7F2] border border-[#283D38]/12 rounded-3xl shadow-xl flex flex-col overflow-hidden relative backdrop-blur-md">
        
        {/* BESPOKE SANCTUARY HEADER */}
        <header className="px-4 sm:px-6 py-3.5 bg-white/90 border-b border-[#283D38]/8 flex items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#283D38] text-[#FDFBF8] flex items-center justify-center shadow-xs border border-[#B8964A]/30">
                <Compass className="w-5 h-5 text-[#D9BCAF]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#8AA688] border-2 border-white rounded-full animate-pulse shadow-2xs" title="Sanctuary Active" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-[15px] sm:text-base font-medium text-[#011627] truncate">
                  The Ingress Guide
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#795663] bg-[#795663]/10 border border-[#795663]/20 px-2 py-0.5 rounded-full hidden sm:inline">
                  Intake Sanctuary
                </span>
              </div>
              <div className="text-[11px] text-[#4F635E] truncate flex items-center gap-1.5 font-light">
                <span>Phase: {currentPhase.label}</span>
                <span>•</span>
                <span>Step {currentStepNum} of {activeQuestions.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mindful Grounding Breathing Button */}
            <button
              type="button"
              onClick={() => setIsBreathingMode(!isBreathingMode)}
              title="Ground yourself with gentle pacing"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isBreathingMode
                  ? 'bg-[#795663] text-white border-[#795663] shadow-xs'
                  : 'bg-[#795663]/5 hover:bg-[#795663]/15 text-[#795663] border-[#795663]/20'
              }`}
            >
              <Wind size={13} className={isBreathingMode ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isBreathingMode ? 'Pause Breathing' : 'Take a Breath'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndResumeLater}
              title="Save your progress and return anytime"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#283D38]/15 hover:border-[#795663]/50 text-[#011627] hover:bg-[#283D38]/5 text-xs font-semibold transition-all cursor-pointer"
            >
              <Bookmark size={13} className="text-[#B8964A]" />
              <span className="hidden md:inline">Save &amp; Resume</span>
            </button>

            <button
              type="button"
              onClick={exit}
              className="w-8 h-8 rounded-xl border border-transparent hover:border-[#283D38]/10 text-[#4F635E] hover:text-[#011627] flex items-center justify-center transition-all cursor-pointer"
              title="Exit intake"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* 4-PHASE MILESTONE ROADMAP */}
        <div className="bg-[#FAF7F2] border-b border-[#283D38]/6 px-4 py-2 shrink-0">
          <div className="flex items-center justify-between gap-1 text-[10px] font-semibold tracking-wider text-[#4F635E] uppercase mb-1">
            {phases.map((p) => {
              const isActive = currentPhase.id === p.id;
              const isDone = currentPhase.id > p.id;
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'text-[#795663] font-bold'
                      : isDone
                      ? 'text-[#8AA688]'
                      : 'text-[#4F635E]/40'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive
                        ? 'bg-[#795663] ring-2 ring-[#795663]/30'
                        : isDone
                        ? 'bg-[#8AA688]'
                        : 'bg-[#283D38]/20'
                    }`}
                  />
                  <span className="hidden sm:inline">{p.label}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-[#283D38]/8 h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#8AA688] via-[#795663] to-[#B8964A] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* MINDFUL BREATHING BANNER (Optional Grounding Oasis) */}
        {isBreathingMode && (
          <div className="bg-gradient-to-r from-[#F8F5F1] via-[#FAF7F2] to-[#F8F5F1] border-b border-[#795663]/20 px-4 py-2.5 flex items-center justify-between text-xs text-[#283D38] animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8AA688] animate-ping" />
              <span className="font-serif italic text-[13px]">{breathPhase}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBreathingMode(false)}
              className="text-[#4F635E] hover:text-[#011627] text-[11px] underline cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[#EDF3ED] border border-[#8AA688]/40 text-[#283D38] text-xs font-medium text-center animate-in fade-in shrink-0">
            {saveSuccessMsg}
          </div>
        )}

        {/* CHAT MESSAGES SCROLL AREA (Dedicated sanctuary feed) */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 scroll-smooth">
          {messages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            const isAck = Boolean(msg.isAck);

            // EMPATHETIC REFLECTIVE ACKNOWLEDGMENT (Distinctive Sanctuary Note)
            if (isAck) {
              return (
                <div
                  key={msg.id}
                  className="animate-in fade-in duration-200 max-w-[90%] sm:max-w-[80%]"
                >
                  <div className="bg-gradient-to-r from-[#F9F6F0] to-[#FAF8F5] border-l-4 border-[#795663] rounded-r-2xl py-3 px-4 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider text-[#795663] font-bold mb-1">
                      <HeartHandshake size={12} />
                      <span>Reflective Pause</span>
                    </div>
                    <div className="font-serif italic text-[13.5px] text-[#283D38] leading-relaxed">
                      "{msg.text}"
                    </div>
                  </div>
                </div>
              );
            }

            // ASSISTANT QUESTION CARD (Clinical Sanctuary Voice)
            if (isAssistant) {
              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 justify-start animate-in fade-in duration-200 max-w-[90%] sm:max-w-[82%]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#283D38]/10 text-[#283D38] border border-[#283D38]/15 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Compass size={16} className="text-[#795663]" />
                  </div>

                  <div className="bg-white border border-[#283D38]/10 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs relative text-[#011627]">
                    <div className="text-[9.5px] uppercase tracking-widest font-bold text-[#8AA688] mb-1.5 flex items-center gap-1.5">
                      <span>Ingress Sanctuary Guide</span>
                    </div>
                    <div className="font-serif text-[15px] sm:text-[16px] leading-relaxed text-[#011627] font-normal">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            }

            // USER RESPONSE CARD (Velvety Hawthorne Voice)
            return (
              <div
                key={msg.id}
                className="flex items-start gap-2.5 justify-end animate-in fade-in duration-200"
              >
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#283D38] text-[#FDFBF8] rounded-2xl rounded-tr-sm px-4 sm:px-5 py-3 shadow-md border border-[#283D38]/30">
                  <div className="text-[9.5px] uppercase tracking-widest text-[#D9BCAF] font-semibold mb-1 flex items-center gap-1">
                    <Feather size={11} />
                    <span>Your Reflection</span>
                  </div>
                  <div className="text-[13.5px] font-normal leading-relaxed text-[#FDFBF8]">
                    {msg.text}
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#283D38]/15 text-[#283D38] flex items-center justify-center shrink-0 mt-0.5">
                  <User size={13} />
                </div>
              </div>
            );
          })}

          {/* SERENE ORGANIC TYPING INDICATOR */}
          {isTyping && (
            <div className="flex items-center gap-2.5 justify-start animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-[#283D38]/10 text-[#795663] border border-[#283D38]/15 flex items-center justify-center shrink-0 shadow-2xs">
                <Compass size={15} className="animate-spin text-[#795663]" />
              </div>
              <div className="bg-white border border-[#283D38]/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AA688] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#795663] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8964A] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-[#4F635E] italic font-serif ml-1.5">The Guide is listening...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* PINNED BOTTOM INTERACTIVE RESPONSE STUDIO */}
        <div className="border-t border-[#283D38]/10 bg-white/98 backdrop-blur-md p-3 sm:p-4 shrink-0 z-10">
          {errorMsg && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-[#FDF2F1] border border-[#B34B46]/30 text-[#B34B46] text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Context helper caption */}
          {currentConfig.inputType !== 'contact_consent' && (
            <div className="flex items-center justify-between text-[11px] text-[#4F635E] mb-2 px-1">
              <span className="font-medium text-[#795663] truncate">
                {currentConfig.helperText || (
                  currentConfig.inputType === 'single_select'
                    ? 'Select the option that most resonates:'
                    : currentConfig.inputType === 'multi_select'
                    ? 'Select all areas you want to address, then confirm:'
                    : currentConfig.inputType === 'yes_no'
                    ? 'Select your response:'
                    : 'Reflect in your own words:'
                )}
              </span>
              {questionHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  disabled={isTyping}
                  className="text-[#4F635E] hover:text-[#011627] transition-colors cursor-pointer text-[11px] font-medium"
                >
                  ← Previous question
                </button>
              )}
            </div>
          )}

          {/* INPUT 1: TEXTAREA WITH STARTER INSPIRATION PILLS */}
          {currentConfig.inputType === 'textarea' && (
            <div className="space-y-2.5">
              {/* Optional starter thought chips */}
              {STARTER_THOUGHTS[currentConfig.id] && (
                <div className="flex flex-wrap items-center gap-1.5 pb-1">
                  <span className="text-[10px] font-semibold text-[#8AA688] uppercase tracking-wider">
                    Quick suggestions:
                  </span>
                  {STARTER_THOUGHTS[currentConfig.id].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={isTyping}
                      onClick={() => {
                        setTextInput((prev) => (prev ? `${prev}. ${chip}` : chip));
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#EDF3ED] border border-[#283D38]/10 hover:border-[#8AA688] text-[#283D38] transition-all cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              )}

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
                  placeholder={currentConfig.placeholder || 'Share your reflection here...'}
                  className="w-full p-3.5 pr-12 rounded-2xl bg-[#FAF7F2] border border-[#283D38]/12 focus:border-[#795663] focus:bg-white focus:ring-1 focus:ring-[#795663]/30 text-xs sm:text-sm text-[#011627] placeholder:text-[#4F635E]/50 outline-none resize-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  disabled={!textInput.trim() || isTyping}
                  onClick={() => handleAnswer(textInput.trim())}
                  className="absolute right-2.5 bottom-3.5 w-8 h-8 rounded-xl bg-[#283D38] hover:bg-[#1E3A34] disabled:bg-[#283D38]/20 text-[#FDFBF8] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  title="Send reflection"
                >
                  <Send size={13} className="text-[#D9BCAF]" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-[10px] text-[#4F635E]/70 hidden sm:inline">
                  Enter ↵ to send · Shift+Enter for newline
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {currentConfig.skippable && (
                    <button
                      type="button"
                      disabled={isTyping}
                      onClick={handleSkip}
                      className="px-3 py-1 text-xs border border-[#283D38]/20 rounded-lg hover:bg-[#283D38]/5 text-[#011627] cursor-pointer font-medium"
                    >
                      {currentConfig.skipLabel || 'Skip'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INPUT 2: SINGLE SELECT (TACTILE OPTION CARDS) */}
          {currentConfig.inputType === 'single_select' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5">
                {(currentConfig.options || []).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleAnswer(opt.value)}
                    className="p-3 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#283D38]/10 hover:border-[#795663] hover:shadow-xs text-left text-xs font-medium text-[#011627] transition-all cursor-pointer flex items-center justify-between gap-2 group border-l-2 hover:border-l-4 hover:border-l-[#795663]"
                  >
                    <span className="leading-snug">{opt.label}</span>
                    <ChevronRight size={13} className="text-[#4F635E]/40 group-hover:text-[#795663] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {currentConfig.skippable && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isTyping}
                    onClick={handleSkip}
                    className="px-3 py-1 text-xs border border-[#283D38]/20 rounded-lg hover:bg-[#283D38]/5 text-[#011627] cursor-pointer font-medium"
                  >
                    {currentConfig.skipLabel || 'Skip'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INPUT 3: MULTI SELECT (BOTANICAL TOGGLE CHIPS) */}
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
                          ? 'bg-[#283D38] text-[#FDFBF8] border-[#283D38] shadow-xs'
                          : 'bg-[#FAF7F2] hover:bg-white border-[#283D38]/12 hover:border-[#795663]/50 text-[#011627]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={12} className="stroke-[2.5] text-[#D9BCAF]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1 gap-2 border-t border-[#283D38]/6">
                <span className="text-[11px] text-[#4F635E]">
                  {selectedMulti.length > 0
                    ? `${selectedMulti.length} area${selectedMulti.length > 1 ? 's' : ''} selected`
                    : 'Select all that resonate'}
                </span>

                <div className="flex items-center gap-2">
                  {currentConfig.skippable && (
                    <button
                      type="button"
                      disabled={isTyping}
                      onClick={handleSkip}
                      className="px-3 py-1.5 text-xs border border-[#283D38]/20 rounded-xl hover:bg-[#283D38]/5 text-[#011627] cursor-pointer font-medium"
                    >
                      {currentConfig.skipLabel || 'Skip'}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={selectedMulti.length === 0 && !currentConfig.skippable || isTyping}
                    onClick={() => handleAnswer(selectedMulti)}
                    className="px-5 py-2 bg-[#283D38] hover:bg-[#1E3A34] disabled:bg-[#283D38]/20 text-[#FDFBF8] rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Confirm Selection</span>
                    <ArrowRight size={13} className="text-[#D9BCAF]" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INPUT 4: YES / NO (SANCTUARY PAIR) */}
          {currentConfig.inputType === 'yes_no' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleAnswer('Yes')}
                  className="py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#283D38]/15 hover:border-[#795663] text-[#011627] hover:text-[#795663] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs border-l-2 hover:border-l-4 hover:border-l-[#795663]"
                >
                  Yes, that resonates
                </button>
                <button
                  type="button"
                  disabled={isTyping}
                  onClick={() => handleAnswer('No')}
                  className="py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-white border border-[#283D38]/15 hover:border-[#283D38] text-[#011627] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
                >
                  No, not particularly
                </button>
              </div>
            </div>
          )}

          {/* INPUT 5: CONTACT & EXPLICIT CLINICAL CONSENT */}
          {currentConfig.inputType === 'contact_consent' && (
            <div className="bg-[#FAF7F2] border border-[#283D38]/12 rounded-2xl p-3.5 sm:p-4 text-left space-y-3 shadow-inner max-h-56 sm:max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#795663] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#283D38]/15 text-xs text-[#011627] bg-white focus:border-[#795663] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#795663] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#283D38]/15 text-xs text-[#011627] bg-white focus:border-[#795663] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#795663] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-1.5 rounded-lg border border-[#283D38]/15 text-xs text-[#011627] bg-white focus:border-[#795663] outline-none"
                  />
                </div>
              </div>

              {/* Privacy Shield & Consent Notice */}
              <div className="p-3 bg-white border border-[#283D38]/10 rounded-xl space-y-1.5 text-xs text-[#4F635E] leading-relaxed font-light">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-[#011627] tracking-wider">
                  <Lock size={12} className="text-[#8AA688]" />
                  <span>Confidential Matching Privacy Guarantee</span>
                </div>
                <p className="m-0 text-[11.5px]">
                  Your intake answers are evaluated algorithmically against active, verified licensed therapists. Your full intake is <strong>only shared with the specific therapist you explicitly choose</strong>. If no direct match is found, your record is held securely for internal care review with zero therapist broadcasts.
                </p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="mt-0.5 accent-[#283D38] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-[#011627] font-medium">
                  I authorize Ingress Within to evaluate verified clinicians based on my intake answers and schedule 1-on-1 care.
                </span>
              </label>

              <div className="flex items-center justify-between pt-2 border-t border-[#283D38]/8">
                <button
                  type="button"
                  onClick={handleBackQuestion}
                  className="px-3 py-1.5 text-xs text-[#4F635E] hover:text-[#011627] font-medium cursor-pointer"
                >
                  ← Previous question
                </button>

                <button
                  type="button"
                  disabled={!consentGranted || matchingInProgress}
                  onClick={handleRunMatching}
                  className="px-6 py-2.5 bg-[#283D38] hover:bg-[#1E3A34] disabled:bg-[#283D38]/30 text-[#FDFBF8] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  {matchingInProgress ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Evaluating Clinicians...</span>
                    </>
                  ) : (
                    <>
                      <span>Find My Matching Clinicians</span>
                      <Sparkles size={14} className="text-[#D9BCAF]" />
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
