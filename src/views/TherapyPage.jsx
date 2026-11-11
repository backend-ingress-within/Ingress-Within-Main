import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ClipboardList,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
  Clock,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Info,
  FileText,
  Activity,
  BookOpen,
} from 'lucide-react';
import TherapyBookingFlow from '../components/therapy/TherapyBookingFlow';
import TherapyMatchResultsView from '../components/therapy/TherapyMatchResultsView';
import ConversationalIntake from '../components/therapy/ConversationalIntake';
import ClientTherapyDashboard from './client/ClientTherapyDashboard';
import { citiesMatch } from '../lib/therapy/cityUtils';

/*
 * Ingress Within — Therapy intake
 * Production clinical matching connects clients exclusively with verified,
 * active, and licensed practitioners registered on Ingress Within.
 */

const CONCERNS = [
  'Overthinking',
  'Anxiety',
  'Low mood',
  'Stress',
  'Burnout',
  'Relationship issues',
  'Family issues',
  'Career stress',
  'Academic stress',
  'Self-confidence',
  'Loneliness',
  'Anger',
  'Grief',
  'Sleep problems',
  'Low motivation',
  'Emotional overwhelm',
  'Identity',
  'Trauma / PTSD',
  'Other',
];

const LIFE_AREAS = [
  'Family',
  'Romantic Relationship',
  'Work/Career',
  'Studies',
  'Physical Health',
  'Finances',
  'Self-confidence',
  'Future/Uncertainty',
];

const SATISFACTION_AREAS = [
  'Sleep',
  'Energy',
  'Physical Health',
  'Work/Studies',
  'Relationships',
  'Family',
  'Daily Routine',
  'Self-confidence',
];

const SUPPORT_AREAS = [
  'I have someone I can talk to.',
  'I feel understood by people close to me.',
  'I feel emotionally supported in daily life.',
];

const SCENARIOS_1 = [
  ['sit1', 'Someone doesn’t reply to your message.', [
    'They’re probably busy',
    'I keep checking my phone',
    'I think I did something wrong',
    'I stop messaging',
  ]],
  ['sit2', 'You make a mistake.', [
    'I fix it and move on',
    'I keep thinking about it',
    'I become very critical of myself',
    'I avoid similar situations',
  ]],
  ['sit3', 'Someone criticizes your work.', [
    'I listen and improve',
    'I defend myself',
    'I feel bad for days',
    'I avoid showing my work again',
  ]],
  ['sit4', 'You have an important deadline.', [
    'I start early',
    'I delay until pressure builds',
    'I keep planning but don’t start',
    'I feel overwhelmed',
  ]],
];

const SCENARIOS_2 = [
  ['sit5', 'At a family gathering…', [
    'I feel comfortable',
    'I stay quiet',
    'I feel judged',
    'I want to leave early',
  ]],
  ['sit6', 'Someone compliments you.', [
    'I accept it',
    'I think they don’t mean it',
    'I feel awkward',
    'I dismiss it',
  ]],
  ['sit7', 'When I have free time…', [
    'I relax',
    'I feel guilty',
    'I scroll endlessly',
    'I don’t know what to do',
  ]],
  ['sit8', 'Thinking about the future…', [
    'I feel hopeful',
    'I feel uncertain',
    'I feel stuck',
    'I avoid thinking about it',
  ]],
];


const CSS = `
.iw{min-height:100vh;background:#f4f1ec;color:#263238;padding:32px 20px 60px}
.iw *{box-sizing:border-box}
.iw-shell,.iw-flow{max-width:980px;margin:auto}
.iw-flow{max-width:760px}
.iw-top,.iw-flowhead{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:24px}
.iw-k{color:#7b6a72;text-transform:uppercase;letter-spacing:.18em;font-size:10px;font-weight:700;margin-bottom:8px}
.iw h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(30px,5vw,44px);font-weight:400;line-height:1.12;margin:0 0 12px}
.iw h2{font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;line-height:1.2;margin:0 0 10px;color:#263238}
.iw h3{font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#263238;margin:0 0 10px}
.iw p{color:#66747a;line-height:1.65}
.iw-lede{font-size:16px;max-width:700px}
.iw-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:28px}
.iw-card{background:#fff;border:1px solid rgba(38,50,56,.10);border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(38,50,56,.04)}
.iw-journey{min-height:300px;display:flex;flex-direction:column}
.iw-journey p{font-size:14px;flex:1}
.iw-icon{width:44px;height:44px;border-radius:12px;background:rgba(38,50,56,.05);color:#263238;display:flex;align-items:center;justify-content:center;margin-bottom:18px}
.iw-back,.iw-primary,.iw-secondary,.iw-option{border-radius:12px;padding:11px 14px;font:inherit;cursor:pointer}
.iw-back,.iw-secondary{background:#fff;color:#263238;border:1px solid rgba(38,50,56,.10)}
.iw-back{display:flex;align-items:center;gap:7px;color:#66747a}
.iw-primary{background:#263238;color:#fff;border:1px solid #263238;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;transition:background .2s}
.iw-primary:hover{background:#2A3A3E}
.iw-primary:disabled{opacity:.45;cursor:not-allowed}
.iw-secondary{display:flex;align-items:center;justify-content:center;width:100%}
.iw-progress{height:5px;background:rgba(38,50,56,.10);border-radius:99px;overflow:hidden;margin-bottom:24px}
.iw-progress>div{height:100%;background:#263238;transition:width .2s}
.iw-optiongrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.iw-option{text-align:left;background:#fff;border:1px solid rgba(38,50,56,.10);color:#263238}
.iw-option:hover{border-color:rgba(38,50,56,.25)}
.iw-option.selected{border-color:#263238;background:rgba(38,50,56,.05)}
.iw-field{margin:0 0 18px}
.iw-field label{display:block;color:#263238;font-size:13px;font-weight:600;margin-bottom:7px}
.iw-field input,.iw-field textarea,.iw-field select{width:100%;background:#fff;color:#263238;border:1px solid rgba(38,50,56,.10);border-radius:12px;padding:12px;font:inherit;outline:none}
.iw-field textarea{min-height:110px;resize:vertical}
.iw-nav{display:flex;gap:12px;margin-top:22px}
.iw-nav>*{flex:1}
.iw-note{margin-top:20px;padding:14px 16px;border:1px solid rgba(38,50,56,.10);border-radius:12px;background:#fff;color:#66747a;font-size:13px;line-height:1.55}
.iw-safety{border:1px solid #ead8b8;background:#fff8ea;color:#76552d;border-radius:12px;padding:14px;font-size:13px;line-height:1.55;margin-bottom:18px}
.iw-safety strong{display:block;margin-bottom:5px;color:#5e482a}
.iw-danger{border-color:#d99a86;background:#fbefeb;color:#75402f}
.iw-success{text-align:center}
.iw-successicon{width:54px;height:54px;border-radius:50%;background:rgba(38,50,56,.05);color:#263238;margin:0 auto 16px;display:flex;align-items:center;justify-content:center}
.iw-summary{background:#f8f6f2;border:1px solid rgba(38,50,56,.10);border-radius:12px;padding:12px;margin:18px 0;text-align:left}
.iw-row{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(38,50,56,.08);font-size:13px}
.iw-row:last-child{border:0}
.iw-row span{color:#66747a}
.iw-row strong{color:#263238;text-align:right}
.iw-chat{max-height:390px;overflow:auto;display:flex;flex-direction:column;gap:12px;margin-bottom:15px}
.iw-bubble{max-width:82%;padding:12px 14px;border-radius:15px;line-height:1.55;font-size:14px}
.iw-bot{background:#f4f1ec;border:1px solid rgba(38,50,56,.08);color:#66747a}
.iw-user{align-self:flex-end;background:#263238;border:1px solid #263238;color:#fff}
.iw-chatinput{display:flex;gap:8px}
.iw-chatinput input{flex:1}
.iw-chatinput button{width:55px}
.iw-table{width:100%;border-collapse:collapse;font-size:13px}
.iw-table td{padding:9px 0;border-bottom:1px solid rgba(38,50,56,.08);vertical-align:top}
.iw-table td:first-child{color:#66747a;width:42%}
.iw-match{border:1px solid rgba(38,50,56,.12);border-radius:14px;padding:16px;margin-top:12px;background:#fff;cursor:pointer}
.iw-match.selected{border-color:#263238;background:#f8f6f2}
.iw-matchhead{display:flex;gap:12px;align-items:flex-start}
.iw-avatar{width:42px;height:42px;border-radius:50%;background:rgba(38,50,56,.07);display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:18px;flex:none}
.iw-matchname{font-weight:700;color:#263238}
.iw-tags{font-size:12px;color:#66747a;line-height:1.55;margin-top:3px}
.iw-fit{font-size:12px;color:#263238;margin-top:9px;line-height:1.5}
.iw-check{margin-left:auto;width:20px;height:20px;border:1px solid rgba(38,50,56,.2);border-radius:50%;flex:none}
.iw-match.selected .iw-check{background:#263238;box-shadow:inset 0 0 0 5px #fff}
.iw-grid5{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
.iw-scale-label{font-size:11px;color:#66747a;margin-bottom:7px}
.iw-section{padding-top:4px;margin-bottom:24px}
.iw-section+.iw-section{border-top:1px solid rgba(38,50,56,.08);padding-top:22px}
.iw-error{color:#8d3e2d;font-size:12px;margin-top:7px}
.iw-intake-wrap{max-width:880px;margin:0 auto;padding:16px 0 48px}
.iw-intake-eyebrow{font-size:.85rem;letter-spacing:.16em;text-transform:uppercase;color:#5f6b72;margin:0 0 14px;font-weight:600}
.iw-intake-title{font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#132a24;font-size:clamp(2.1rem,5vw,3.2rem);line-height:1.15;letter-spacing:-.01em;margin:0 0 16px}
.iw-intake-intro{font-size:1.2rem;max-width:62ch;margin:0 0 36px;color:#4d5a61;line-height:1.6}
.iw-intake-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.iw-intake-card{background:#ffffff;border:1px solid #e7e2da;border-radius:24px;padding:32px;display:flex;flex-direction:column;box-shadow:0 4px 16px rgba(19,42,36,0.03);transition:transform .15s ease,box-shadow .15s ease}
.iw-intake-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(19,42,36,0.06)}
.iw-intake-icon{width:56px;height:56px;border-radius:16px;background:#f0f4f2;display:flex;align-items:center;justify-content:center;margin-bottom:24px;color:#132a24}
.iw-intake-icon svg{width:26px;height:26px;stroke:#132a24}
.iw-intake-label{font-size:.85rem;color:#5f6b72;margin:0 0 6px;font-weight:600}
.iw-intake-h2{font-family:Georgia,'Times New Roman',serif;font-weight:500;color:#132a24;font-size:1.55rem;line-height:1.25;margin:0 0 12px}
.iw-intake-text{margin:0 0 20px;flex:1;font-size:1.02rem;color:#4d5a61;line-height:1.6}
.iw-intake-meta{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 24px}
.iw-intake-meta span{font-size:.85rem;color:#132a24;background:#f0f4f2;border:1px solid #e1e9e5;border-radius:999px;padding:6px 14px;font-weight:500}
.iw-intake-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:#132a24;color:#ffffff;text-decoration:none;padding:16px 24px;border-radius:16px;font-weight:600;font-size:1rem;border:none;cursor:pointer;transition:background .15s ease}
.iw-intake-btn:hover{background:#1f3b33}
.iw-intake-btn:focus-visible{outline:3px solid #1B5E52;outline-offset:3px}
.iw-intake-btn svg{width:18px;height:18px}
.iw-intake-equal{margin-top:24px;padding:20px 28px;background:#ffffff;border:1px solid #e7e2da;border-radius:20px;box-shadow:0 2px 8px rgba(19,42,36,0.02)}
.iw-intake-equal strong{color:#132a24;font-weight:600}
.iw-intake-equal p{margin:0;max-width:72ch;font-size:.95rem;color:#4d5a61;line-height:1.6}
.iw-intake-fine{margin:20px 4px 0;font-size:.9rem;color:#5f6b72;max-width:75ch}
@media(max-width:680px){
  .iw-intake-cards{grid-template-columns:1fr}
  .iw-intake-card{padding:24px 20px}
}
@media(max-width:800px){
  .iw-grid,.iw-optiongrid{grid-template-columns:1fr}
  .iw-card{padding:20px}
  .iw-grid5{grid-template-columns:repeat(2,1fr)}
}
`;

function Option({ children, selected, onClick, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`iw-option${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Header({ name, step, total, onBack }) {
  return (
    <>
      <div className="iw-flowhead">
        <button type="button" className="iw-back" onClick={onBack}>
          <ArrowLeft size={15} /> Back
        </button>
        <span style={{ color: '#9fb0c2', fontSize: 13 }}>{name} · {step}/{total}</span>
      </div>
      <div className="iw-progress">
        <div style={{ width: `${Math.min(100, (step / total) * 100)}%` }} />
      </div>
    </>
  );
}

function Safety({ value, setValue, allowEmergencyExit = true }) {
  const set = (key, next) => setValue((current) => ({ ...current, [key]: next }));
  const immediate =
    value.physical === 'Yes' ||
    (value.answer === 'Yes' && (
      value.recency === 'Today or this week' ||
      value.plan === 'Yes' ||
      value.attempt === 'Yes'
    ));

  if (value.needSupport === 'Yes') {
    return (
      <div className="iw-safety iw-danger">
        <strong><ShieldCheck size={16} style={{ verticalAlign: '-3px' }} /> Please get support now</strong>
        <div>
          If you feel you may act on thoughts of harming yourself or someone else, or you are
          in immediate danger, please contact emergency support rather than continuing this intake.
        </div>
        <div style={{ marginTop: 10 }}>
          <strong>Tele-MANAS: 14416 / 1-800-891-4416</strong>
          <br />
          <span>For immediate danger in India, call 112.</span>
        </div>
        {allowEmergencyExit && (
          <div className="iw-note" style={{ marginTop: 12 }}>
            This intake intentionally stops here when immediate support is needed.
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="iw-safety">
        <strong><ShieldCheck size={16} style={{ verticalAlign: '-3px' }} /> Safety check</strong>
        <div>
          We ask everyone these questions. This is not a diagnosis or emergency service.
          If you are in immediate danger, contact emergency support.
        </div>
      </div>

      <div className="iw-field">
        <label>
          In the past few months, have you had any thoughts of hopelessness, of not wanting to be
          here, or of harming yourself?
        </label>
        <div className="iw-optiongrid">
          {['No', 'Yes', 'Prefer not to say'].map((item) => (
            <Option key={item} selected={value.answer === item} onClick={() => set('answer', item)}>
              {item}
            </Option>
          ))}
        </div>
      </div>

      {value.answer === 'Yes' && (
        <>
          <div className="iw-field">
            <label>Do you need support right now?</label>
            <div className="iw-optiongrid">
              {['No, I’m okay to continue', 'Yes'].map((item) => (
                <Option
                  key={item}
                  selected={value.needSupport === (item === 'Yes' ? 'Yes' : 'No')}
                  onClick={() => set('needSupport', item === 'Yes' ? 'Yes' : 'No')}
                >
                  {item}
                </Option>
              ))}
            </div>
          </div>

          {value.needSupport !== 'Yes' && (
            <>
              <div className="iw-field">
                <label>How recently?</label>
                <div className="iw-optiongrid">
                  {['Today or this week', 'This month', 'A few months ago'].map((item) => (
                    <Option key={item} selected={value.recency === item} onClick={() => set('recency', item)}>
                      {item}
                    </Option>
                  ))}
                </div>
              </div>

              <div className="iw-field">
                <label>Do you have a specific plan, or access to a way to act on these thoughts?</label>
                <div className="iw-optiongrid">
                  {['Yes', 'No', 'Prefer not to say'].map((item) => (
                    <Option key={item} selected={value.plan === item} onClick={() => set('plan', item)}>
                      {item}
                    </Option>
                  ))}
                </div>
              </div>

              <div className="iw-field">
                <label>Have you ever made an attempt to harm yourself before?</label>
                <div className="iw-optiongrid">
                  {['Yes', 'No', 'Prefer not to say'].map((item) => (
                    <Option key={item} selected={value.attempt === item} onClick={() => set('attempt', item)}>
                      {item}
                    </Option>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className="iw-field">
        <label>
          One more, unrelated to the above, that we ask everyone: is anyone currently putting
          your physical safety at risk — for example, violence at home?
        </label>
        <div className="iw-optiongrid">
          {['No', 'Yes', 'Prefer not to say'].map((item) => (
            <Option key={item} selected={value.physical === item} onClick={() => set('physical', item)}>
              {item}
            </Option>
          ))}
        </div>
      </div>

      <div className="iw-field">
        <label>
          Are you currently under psychiatric care for a serious mental health condition, or have
          you been hospitalized for a mental health reason in the past year?
        </label>
        <div className="iw-optiongrid">
          {['No', 'Yes'].map((item) => (
            <Option key={item} selected={value.psych === item} onClick={() => set('psych', item)}>
              {item}
            </Option>
          ))}
        </div>
      </div>

      {immediate && (
        <div className="iw-safety iw-danger">
          <strong>Additional support may be needed</strong>
          <div>
            Based on these answers, the intake should be reviewed by a human care/clinical team
            before algorithmic therapist matching.
          </div>
        </div>
      )}
    </>
  );
}

function getOrCreateLeadSessionId() {
  if (typeof window === 'undefined') return 'sess_' + Date.now();
  let id = sessionStorage.getItem('iw_lead_session_id');
  if (!id) {
    id = 'lead_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem('iw_lead_session_id', id);
  }
  return id;
}

async function sendLeadAutosave(payload) {
  const phone = (payload.phoneNumber || '').trim();
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.length < 7) return;

  try {
    const sessionId = payload.sessionId || getOrCreateLeadSessionId();
    await fetch('/api/therapy/leads/autosave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId,
        phoneNumber: phone,
      }),
    });
  } catch (err) {
    console.debug('[Lead Autosave] Non-blocking notice:', err);
  }
}

function Conversation({ exit, user, profile }) {
  const [step, setStep] = useState(0);
  const [therapySessionId, setTherapySessionId] = useState(null);
  const [input, setInput] = useState('');
  const [contact, setContact] = useState(() => ({
    name: profile?.name || user?.name || user?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: user?.phone_number || user?.phoneNumber || user?.phone || '',
    consent: false,
  }));
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi. We can take this at your pace. What’s been weighing on you lately?',
    },
  ]);
  const [safety, setSafety] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');

  const createSession = async () => {
    if (therapySessionId) return therapySessionId;

    try {
      setSessionError('');

      const response = await fetch('/api/therapy/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyType: 'conversation',
          metadata: { source: 'therapy_conversation' },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create therapy session');
      }

      const sessionId = data?.session?.id || data?.id;
      if (!sessionId) {
        throw new Error('Therapy session ID was not returned');
      }

      setTherapySessionId(sessionId);
      return sessionId;
    } catch (error) {
      console.error('Therapy session creation failed:', error);
      setSessionError(error instanceof Error ? error.message : 'Unable to start therapy session');
      return null;
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  const saveIntake = async (sessionId = therapySessionId) => {
    if (!sessionId) return false;

    const response = await fetch('/api/therapy/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        fullName: contact.name.trim(),
        email: contact.email.trim(),
        phoneNumber: contact.phone.trim(),
        consents: {
          intake: contact.consent,
        },
        contactPreferences: {
          email: contact.email.trim(),
          phone: contact.phone.trim(),
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to save therapy intake');
    }

    return true;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const sessionId = therapySessionId || await createSession();
    if (!sessionId) return;

    setInput('');
    setLoading(true);

    setMessages((items) => [...items, { from: 'user', text }]);

    try {
      const response = await fetch('/api/therapy/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapySessionId: sessionId,
          role: 'user',
          content: text,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to save therapy message');
      }

      const assistantText =
        'Thank you for sharing that. Can you tell me a little more about when you notice this most strongly?';

      setMessages((items) => [...items, { from: 'bot', text: assistantText }]);

      const assistantResponse = await fetch('/api/therapy/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapySessionId: sessionId,
          role: 'assistant',
          content: assistantText,
        }),
      });

      const assistantData = await assistantResponse.json().catch(() => ({}));
      if (!assistantResponse.ok) {
        console.error('Assistant message save failed:', assistantData?.error);
      }
    } catch (error) {
      console.error('Therapy message save failed:', error);
      setMessages((items) => [
        ...items,
        {
          from: 'bot',
          text: 'I’m having trouble saving this message right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveSafety = async (sessionId = therapySessionId) => {
    if (!sessionId) return false;

    const answer = safety.answer;
    const safetyStatus =
      answer === 'Yes'
        ? 'positive'
        : answer === 'Prefer not to say'
          ? 'declined'
          : answer === 'No'
            ? 'negative'
            : 'not_assessed';

    const triageLevel =
      safety.physical === 'Yes' ||
      (answer === 'Yes' &&
        (safety.recency === 'Today or this week' ||
          safety.plan === 'Yes' ||
          safety.attempt === 'Yes'))
        ? 'immediate'
        : answer === 'Yes' || answer === 'Prefer not to say' || safety.psych === 'Yes'
          ? 'priority'
          : 'standard';

    const response = await fetch('/api/therapy/safety', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        safetyStatus,
        triageLevel,
        recentTiming: safety.recency || null,
        planOrMeans: safety.plan || null,
        priorAttempt: safety.attempt || null,
        physicalSafety: safety.physical || null,
        psychiatricCare: safety.psych || null,
        answers: safety,
        evaluatedBy: 'deterministic',
        evaluationMetadata: { source: 'therapy_conversation_frontend' },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to save safety assessment');
    }

    return true;
  };

  const submitTherapyIntake = async () => {
    const sessionId = therapySessionId || await createSession();
    if (!sessionId) return false;

    try {
      await saveIntake(sessionId);
      await saveSafety(sessionId);

      const response = await fetch('/api/therapy/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapySessionId: sessionId,
          submissionType: 'conversation',
          payload: {
            messageCount: messages.length,
            contactProvided: Boolean(contact.name || contact.email || contact.phone),
            safetyProvided: Boolean(safety.answer || safety.physical || safety.psych),
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to submit therapy intake');
      }

      return true;
    } catch (error) {
      console.error('Therapy intake submission failed:', error);
      setSessionError(error instanceof Error ? error.message : 'Unable to submit therapy intake');
      return false;
    }
  };

  const goNext = async () => {
    if (loading) return;

    if (step === 2) {
      if (!contact.name.trim() || !contact.email.trim() || !contact.phone.trim() || !contact.consent) {
        setSessionError('Please complete your contact details and consent before continuing.');
        return;
      }

      setLoading(true);
      try {
        const sessionId = therapySessionId || await createSession();
        if (!sessionId) return;
        await saveIntake(sessionId);
        setSessionError('');
        setStep(3);
      } catch (error) {
        console.error('Therapy intake save failed:', error);
        setSessionError(error instanceof Error ? error.message : 'Unable to save intake details');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 4) {
      if (!safety.answer || !safety.physical || !safety.psych) {
        setSessionError('Please complete the safety questions before continuing.');
        return;
      }

      if (
        safety.answer === 'Yes' &&
        safety.needSupport !== 'Yes' &&
        (!safety.recency || !safety.plan || !safety.attempt)
      ) {
        setSessionError('Please complete the remaining safety questions before continuing.');
        return;
      }

      setLoading(true);
      try {
        const sessionId = therapySessionId || await createSession();
        if (!sessionId) return;
        await saveSafety(sessionId);
        setSessionError('');
        setStep(5);
      } catch (error) {
        console.error('Safety save failed:', error);
        setSessionError(error instanceof Error ? error.message : 'Unable to save safety assessment');
      } finally {
        setLoading(false);
      }
      return;
    }

    setSessionError('');
    setStep((value) => Math.min(6, value + 1));
  };

  const finish = async () => {
    if (loading) return;

    setLoading(true);
    setSessionError('');

    try {
      const submitted = await submitTherapyIntake();
      if (submitted) setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="iw-flow">
        <Header name="Talk it through" step={7} total={7} onBack={exit} />
        <div className="iw-card iw-success">
          <div className="iw-successicon"><Check /></div>
          <h2>Your intake is complete</h2>
          <p>
            Your conversation and safety information are ready for the next care-team step.
            In production, the AI brief and approved triage/matching services run on the server.
          </p>
          <button type="button" className="iw-primary" onClick={exit}>Back to Therapy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="iw-flow">
      <Header
        name="Talk it through"
        step={step + 1}
        total={7}
        onBack={step ? () => setStep(step - 1) : exit}
      />

      <div className="iw-card">
        {step === 0 && (
          <>
            <div className="iw-k">Talk it through</div>
            <h2>Start with a conversation</h2>
            <p>
              Share what has been on your mind in a guided conversational experience.
              Take it at your own pace.
            </p>
            <div className="iw-note">
              This is an intake conversation, not a diagnosis or emergency service.
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="iw-k">Before we start</div>
            <h2>A quick age check</h2>
            <p>This therapy intake is currently designed for adults 18 and over.</p>
            <div className="iw-optiongrid">
              <Option onClick={() => setStep(2)}>I am 18 or older</Option>
              <Option onClick={() => setStep(0)}>I am under 18</Option>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="iw-k">Before we begin</div>
            <h2>A few things to confirm</h2>
            <div className="iw-field">
              <label>Full name</label>
              <input
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
              />
            </div>
            <div className="iw-field">
              <label>Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>
            <div className="iw-field">
              <label>Phone number</label>
              <input
                value={contact.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  setContact({ ...contact, phone: val });
                  if (val.replace(/[^\d+]/g, '').length >= 10) {
                    sendLeadAutosave({
                      phoneNumber: val,
                      fullName: contact.name,
                      email: contact.email,
                      journeyType: 'conversational',
                      currentStep: 3,
                      dropOffStage: 'contact_captured',
                    });
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.replace(/[^\d+]/g, '').length >= 7) {
                    sendLeadAutosave({
                      phoneNumber: e.target.value,
                      fullName: contact.name,
                      email: contact.email,
                      journeyType: 'conversational',
                      currentStep: 3,
                      dropOffStage: 'contact_captured',
                    });
                  }
                }}
              />
            </div>
            <label style={{ display: 'flex', gap: 9, fontSize: 13, color: '#263238' }}>
              <input
                type="checkbox"
                checked={contact.consent}
                onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
              />
              I understand this intake prepares information for therapist matching and does not diagnose or treat a condition.
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <div className="iw-k">Conversation</div>
            <h2>Let’s talk it through</h2>
            <div className="iw-chat">
              {messages.map((message, index) => (
                <div
                  key={`${message.from}-${index}`}
                  className={`iw-bubble ${message.from === 'bot' ? 'iw-bot' : 'iw-user'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="iw-chatinput">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                disabled={loading || !therapySessionId}
                placeholder={therapySessionId ? 'Write what has been on your mind...' : 'Starting secure session...'}
              />
              <button
                type="button"
                className="iw-primary"
                onClick={send}
                disabled={loading || !therapySessionId}
              >
                {loading ? '…' : '→'}
              </button>
            </div>
            <div className="iw-note">
              Production note: the browser must not call Anthropic directly. The real AI conversation belongs behind the server API.
            </div>
            {therapySessionId && (
              <div style={{ marginTop: 8, fontSize: 11, color: '#78909c' }}>
                Secure therapy session connected
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <div className="iw-k">Safety</div>
            <h2>One more thing, for your safety</h2>
            <Safety value={safety} setValue={setSafety} />
          </>
        )}

        {step === 5 && (
          <>
            <div className="iw-k">Preparing your intake</div>
            <h2>What happens next</h2>
            <p>
              In the production journey, the conversation is converted into an approved
              pre-session brief and reviewed through the appropriate safety/triage path.
            </p>
            <div className="iw-note">
              No diagnosis is generated by this frontend. Therapist recommendations should only use the approved backend matching service.
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <div className="iw-k">Ready</div>
            <h2>Review and finish</h2>
            <div className="iw-summary">
              <div className="iw-row"><span>Name</span><strong>{contact.name || '—'}</strong></div>
              <div className="iw-row"><span>Contact</span><strong>{contact.phone || contact.email || '—'}</strong></div>
              <div className="iw-row"><span>Safety</span><strong>{safety.answer || '—'}</strong></div>
            </div>
          </>
        )}

        {sessionError && <div className="iw-error">{sessionError}</div>}

        <div className="iw-nav">
          <button
            type="button"
            className="iw-secondary"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={loading}
          >
            Back
          </button>

          {step < 6 ? (
            <button
              type="button"
              className="iw-primary"
              onClick={goNext}
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Continue'}
            </button>
          ) : (
            <button
              type="button"
              className="iw-primary"
              onClick={finish}
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Guided({ exit, onBookSession, user, profile }) {
  const total = 18;
  const [step, setStep] = useState(1);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [sharePatterns, setSharePatterns] = useState(false);
  const [shareVocab, setShareVocab] = useState(false);
  const [shareWeekly, setShareWeekly] = useState(false);
  const [shareMonthly, setShareMonthly] = useState(false);
  const [therapySessionId, setTherapySessionId] = useState(null);
  const [eligibleTherapists, setEligibleTherapists] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [safety, setSafety] = useState({});
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [consents, setConsents] = useState([false, false, false, false]);
  const [d, setD] = useState(() => ({
    name: profile?.name || user?.name || user?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: user?.phone_number || user?.phoneNumber || user?.phone || '',
    age: '', gender: '', genderOther: '',
    occupation: '', occupationOther: '', city: '', living: '', livingOther: '',
    reason: '', concerns: [], concernSeverity: {}, concernsOther: '',
    bodySignal: '', duration: '',
    lifeArea: {}, ownWords: '',
    talked: [], priorTherapy: '', stopped: [], stoppedOther: '',
    medication: '', prescribed: '', diagnosed: '', currentSupport: '',
    satisfaction: {}, coping: '', copingOther: '', support: {},
    scenarios: {}, improve: [], worry: '',
    therapistGender: '', language: 'No preference', budget: '', frequency: '',
    styleStructure: '', stylePace: '', styleLead: '', termApproach: '',
    finalNotes: '',
  }));

  const phoneDebounceTimerRef = useRef(null);

  const autosaveGuidedLead = (stageOverride, stepOverride, extra = {}) => {
    const phone = (extra.phone !== undefined ? extra.phone : d.phone || '').trim();
    const cleanDigits = phone.replace(/[^\d+]/g, '');
    if (cleanDigits.length < 7) return;

    sendLeadAutosave({
      phoneNumber: phone,
      fullName: (extra.name !== undefined ? extra.name : d.name || '').trim(),
      email: (extra.email !== undefined ? extra.email : d.email || '').trim(),
      journeyType: 'guided',
      currentStep: stepOverride !== undefined ? stepOverride : step,
      dropOffStage:
        stageOverride ||
        (step >= 16
          ? 'matches_shown'
          : step >= 13
          ? 'preferences_set'
          : step >= 10
          ? 'safety_evaluated'
          : step >= 5
          ? 'concerns_selected'
          : 'contact_captured'),
      answers: {
        age: d.age,
        gender: d.gender === 'Self-describe' ? d.genderOther : d.gender,
        city: d.city,
        budget: d.budget,
        language: d.language,
        therapistGender: d.therapistGender,
        frequency: d.frequency,
        reason: d.reason,
        duration: d.duration,
        ...(extra.answers || {}),
      },
      concerns: Array.isArray(d.concerns) ? d.concerns : [],
      preferredLanguage: d.language && d.language !== 'No preference' ? d.language : null,
      therapistGenderPref: d.therapistGender || null,
      budget: d.budget ? parseInt(String(d.budget).replace(/[^\d]/g, ''), 10) || null : null,
      matchesShown:
        extra.matchesShown ||
        (matchOutcome?.matches
          ? matchOutcome.matches.map((m) => ({
              id: m.therapist.id,
              name: m.therapist.name,
              score: m.score,
              credentials: m.therapist.credentials,
            }))
          : []),
      selectedTherapistId: selectedTherapist?.id || null,
      selectedTherapistName: selectedTherapist?.name || null,
      isCompleted: extra.isCompleted || false,
    });
  };

  const handlePhoneChangeWithAutosave = (newPhone) => {
    set('phone', newPhone);
    const cleanDigits = newPhone.replace(/[^\d+]/g, '');

    if (phoneDebounceTimerRef.current) {
      clearTimeout(phoneDebounceTimerRef.current);
    }

    if (cleanDigits.length >= 10) {
      // Instant autosave once full phone number is typed
      autosaveGuidedLead('contact_captured', 3, { phone: newPhone });
    } else if (cleanDigits.length >= 7) {
      // Debounce autosave while typing
      phoneDebounceTimerRef.current = setTimeout(() => {
        autosaveGuidedLead('contact_captured', 3, { phone: newPhone });
      }, 700);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTherapists = async () => {
      setLoadingTherapists(true);
      try {
        const response = await fetch('/api/therapy/therapists');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && Array.isArray(data.therapists)) {
            setEligibleTherapists(data.therapists);
          }
        }
      } catch (err) {
        console.error('Failed to load eligible therapists:', err);
      } finally {
        if (isMounted) {
          setLoadingTherapists(false);
        }
      }
    };

    fetchTherapists();
    return () => {
      isMounted = false;
    };
  }, []);

  const [matchOutcome, setMatchOutcome] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [teamRequestSubmitted, setTeamRequestSubmitted] = useState(false);
  const [teamRequestSubmitting, setTeamRequestSubmitting] = useState(false);
  const [teamReferenceCode, setTeamReferenceCode] = useState('');

  useEffect(() => {
    if (step === 16 && !matchOutcome && !loadingMatches) {
      setLoadingMatches(true);
      fetch('/api/intake/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          safety: {
            response: safety.answer || 'No',
            answer: safety.answer || 'No',
            planOrMeans: safety.plan || null,
            plan: safety.plan || null,
            recency: safety.recency || null,
            priorAttempt: safety.attempt || null,
            attempt: safety.attempt || null,
            physicalSafetyRisk: safety.physical || null,
            physical: safety.physical || null,
            psychCareOrHospitalization: safety.psych || null,
            psych: safety.psych || null,
          },
          answers: {
            ...d,
            concerns: d.concerns,
            severity: d.concernSeverity,
            city: d.city,
            budget: d.budget,
            therapistgender: d.therapistGender,
            therapistGender: d.therapistGender,
            language: d.language,
            clientlanguage: d.language && d.language !== 'No preference' ? [d.language] : ['English'],
            stylestructure: d.styleStructure,
            stylepace: d.stylePace,
            stylelead: d.styleLead,
            termapproach: d.termApproach,
            bodysignal: d.bodySignal,
            clienttype: 'Adults',
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMatchOutcome(data);
          if (data?.matches?.length > 0 && !selectedTherapist) {
            setSelectedTherapist(data.matches[0].therapist);
          }
          if (data?.matches && data.matches.length > 0) {
            const matchesSummary = data.matches.map((m) => ({
              id: m.therapist?.id,
              name: m.therapist?.name,
              score: m.score,
              credentials: m.therapist?.credentials,
            }));
            autosaveGuidedLead('matches_shown', 16, { matchesShown: matchesSummary });
          }
        })
        .catch((err) => {
          console.error('Failed to compute matches via /api/intake/match:', err);
        })
        .finally(() => {
          setLoadingMatches(false);
        });
    }
  }, [step, matchOutcome, loadingMatches, safety, d, selectedTherapist]);

  const normalizedTherapists = useMemo(() => {
    return eligibleTherapists.map((t) => {
      const name = t.displayName || t.name || t.full_name || 'Licensed Clinician';
      const credentials = t.qualification || t.credentials || t.title || 'Consultant Psychologist';
      const specializations = Array.isArray(t.specializations)
        ? t.specializations
        : (Array.isArray(t.specialties) ? t.specialties : []);
      const formats = Array.isArray(t.sessionFormats)
        ? t.sessionFormats.map((f) => typeof f === 'string' ? (f.charAt(0).toUpperCase() + f.slice(1)) : f)
        : (Array.isArray(t.formats) ? t.formats : ['Telehealth']);
      const modalities = Array.isArray(t.modalities) ? t.modalities : [];
      const traumaExpertise = specializations.some((s) => typeof s === 'string' && /trauma|ptsd/i.test(s));

      return {
        ...t,
        id: t.id,
        name,
        displayName: name,
        credentials,
        qualification: credentials,
        experienceYears: Number(t.experienceYears || t.experience_years) || 0,
        state: t.state || '',
        city: t.city || '',
        gender: t.gender || 'Not specified',
        languages: Array.isArray(t.languages)
          ? t.languages
          : (Array.isArray(t.preferred_languages) ? t.preferred_languages : ['English', 'Hindi']),
        formats,
        sessionFormats: formats,
        specialties: specializations,
        specializations,
        modalities,
        fee: typeof t.fee === 'number' ? t.fee : (Number(t.per_session_fee) || 1500),
        availability: t.availability || 'Available for booking',
        traumaExpertise,
        bio: t.bio || '',
        profileImageUrl: t.profileImageUrl || t.profile_image_url || null,
      };
    });
  }, [eligibleTherapists]);

  // Dual-relationship safeguard: strictly exclude any therapist practicing in the client's city
  const cityFilteredTherapists = useMemo(() => {
    const clientCity = (d.city || '').trim();
    if (!clientCity) return normalizedTherapists;
    return normalizedTherapists.filter((t) => !citiesMatch(clientCity, t.city));
  }, [normalizedTherapists, d.city]);

  // Calculate dynamic options from actual therapist roster to prevent "no therapist found" dead-ends
  const dynamicBudgetOptions = useMemo(() => {
    if (!cityFilteredTherapists.length) {
      return [
        { value: 'Flexible', label: 'Flexible · All available clinicians (Recommended)' },
        { value: '₹1,200–₹1,800', label: '₹1,200 – ₹1,800 per session' },
        { value: '₹1,800–₹2,500', label: '₹1,800 – ₹2,500 per session' },
        { value: '₹2,500+', label: '₹2,500+ per session' },
      ];
    }

    const under1500 = cityFilteredTherapists.filter((t) => (t.fee || 1500) <= 1500).length;
    const between1200and1800 = cityFilteredTherapists.filter((t) => (t.fee || 1500) <= 1800).length;
    const between1800and2500 = cityFilteredTherapists.filter((t) => (t.fee || 1500) > 1800 && (t.fee || 1500) <= 2500).length;
    const above2500 = cityFilteredTherapists.filter((t) => (t.fee || 1500) > 2500).length;

    const list = [
      { value: 'Flexible', label: `Flexible · All ${cityFilteredTherapists.length} clinicians (Recommended)` }
    ];

    if (under1500 > 0) {
      list.push({ value: '₹1000–1500', label: `Accessible · Up to ₹1,500 (${under1500} available)` });
    }
    if (between1200and1800 > 0 && between1200and1800 !== under1500) {
      list.push({ value: '₹1,200–₹1,800', label: `Standard · ₹1,200–₹1,800 (${between1200and1800} available)` });
    }
    if (between1800and2500 > 0) {
      list.push({ value: '₹1,800–₹2,500', label: `Senior · ₹1,800–₹2,500 (${between1800and2500} available)` });
    }
    if (above2500 > 0) {
      list.push({ value: '₹2,500+', label: `Specialist · ₹2,500+ (${above2500} available)` });
    }

    return list;
  }, [cityFilteredTherapists]);

  const dynamicGenderOptions = useMemo(() => {
    const femaleCount = cityFilteredTherapists.filter((t) => (t.gender || '').toLowerCase() === 'female').length;
    const maleCount = cityFilteredTherapists.filter((t) => (t.gender || '').toLowerCase() === 'male').length;
    const nbCount = cityFilteredTherapists.filter((t) => ['non-binary', 'other'].includes((t.gender || '').toLowerCase())).length;

    const list = [
      { value: 'Female', label: femaleCount > 0 ? `Female (${femaleCount} available)` : 'Female' },
      { value: 'Male', label: maleCount > 0 ? `Male (${maleCount} available)` : 'Male' },
      { value: 'No preference', label: `No preference (${cityFilteredTherapists.length || 'All'} clinicians)` },
    ];
    if (nbCount > 0) {
      list.push({ value: 'Non-binary', label: `Non-binary (${nbCount} available)` });
    }
    return list;
  }, [cityFilteredTherapists]);

  const dynamicLanguageOptions = useMemo(() => {
    const counts = {};
    cityFilteredTherapists.forEach((t) => {
      const langs = Array.isArray(t.languages)
        ? t.languages
        : (Array.isArray(t.preferred_languages) ? t.preferred_languages : ['English', 'Hindi']);
      langs.forEach((l) => {
        if (!l || typeof l !== 'string') return;
        const trimmed = l.trim();
        if (!trimmed) return;
        const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
        counts[normalized] = (counts[normalized] || 0) + 1;
      });
    });

    const standardLanguages = [
      'English',
      'Hindi',
      'Marathi',
      'Bengali',
      'Tamil',
      'Telugu',
      'Kannada',
      'Malayalam',
      'Gujarati',
      'Punjabi',
      'Urdu',
      'Odia',
      'Assamese',
    ];

    const allLangs = Array.from(new Set([...standardLanguages, ...Object.keys(counts)])).sort((a, b) => {
      if (a === 'English') return -1;
      if (b === 'English') return 1;
      if (a === 'Hindi') return -1;
      if (b === 'Hindi') return 1;
      return a.localeCompare(b);
    });

    return [
      { value: 'No preference', label: `No preference (Any language · ${cityFilteredTherapists.length || 'All'} clinicians)` },
      ...allLangs.map((lang) => ({
        value: lang,
        label: counts[lang] ? `${lang} (${counts[lang]} available)` : lang,
        count: counts[lang] || 0,
      })),
    ];
  }, [cityFilteredTherapists]);
  
  const createSession = async () => {
    try {
      setSessionError('');

      const response = await fetch('/api/therapy/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyType: 'guided',
          metadata: { source: 'therapy_guided' },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.error || 'Failed to create therapy session'
        );
      }

      const sessionId = data?.session?.id || data?.id;

      if (!sessionId) {
        throw new Error('Therapy session ID was not returned');
      }

      setTherapySessionId(sessionId);
      return sessionId;
    } catch (error) {
      console.error('Guided therapy session creation failed:', error);
      setSessionError(
        error instanceof Error
          ? error.message
          : 'Unable to start guided therapy session'
      );
      return null;
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  const set = (key, value) => setD((current) => ({ ...current, [key]: value }));
  const toggle = (key, value, max) => {
    setD((current) => {
      const currentValues = current[key] || [];
      const next = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : currentValues.length >= max
          ? currentValues
          : [...currentValues, value];
      return { ...current, [key]: next };
    });
  };

  const setGrid = (key, row, value) => {
    setD((current) => ({
      ...current,
      [key]: { ...current[key], [row]: value },
    }));
  };

  const valid = useMemo(() => {
    if (step === 3) return d.name && d.email && d.phone && consents.every(Boolean);
    if (step === 4) return d.age && d.gender && (d.gender !== 'Self-describe' || d.genderOther) &&
      d.occupation && (d.occupation !== 'Other' || d.occupationOther) && d.city &&
      d.living && (d.living !== 'Other' || d.livingOther);
    if (step === 5) return d.reason && d.concerns.length && d.concerns.every((c) => d.concernSeverity[c]) &&
      (d.concerns.includes('Other') ? d.concernsOther : true) && d.bodySignal && d.duration;
    if (step === 6) return LIFE_AREAS.every((area) => d.lifeArea[area]) && d.ownWords.trim();
    if (step === 7) return d.talked.length && d.priorTherapy && d.medication && d.diagnosed && d.currentSupport &&
      (!['1–3 sessions', '4–10 sessions', '10+ sessions'].includes(d.priorTherapy) || d.stopped.length) &&
      (!['Currently taking', 'Took in the past', 'Prescribed but didn’t take'].includes(d.medication) || d.prescribed);
    if (step === 8) return SATISFACTION_AREAS.every((area) => d.satisfaction[area]);
    if (step === 9) return d.coping && SUPPORT_AREAS.every((area) => d.support[area]);
    if (step === 10) return safety.answer && safety.physical && safety.psych &&
      (safety.answer !== 'Yes' || (safety.needSupport !== 'Yes' && safety.recency && safety.plan && safety.attempt));
    if (step === 11 || step === 12) return SCENARIOS_1.concat(SCENARIOS_2).slice(step === 11 ? 0 : 4, step === 11 ? 4 : 8).every(([key]) => d.scenarios[key]);
    if (step === 13) return d.improve.length && d.worry && d.therapistGender && d.budget && d.frequency &&
      d.styleStructure && d.stylePace && d.styleLead && d.termApproach;
    if (step === 16) return !!selectedTherapist;
    return true;
  }, [step, d, safety, consents, selectedTherapist]);

  const triageTier = useMemo(() => {
    if (safety.physical === 'Yes' || safety.answer === 'Yes' && (
      safety.plan === 'Yes' || safety.attempt === 'Yes' || safety.recency === 'Today or this week'
    )) return 'immediate';
    if (safety.answer === 'Yes' || safety.answer === 'Prefer not to say' || safety.psych === 'Yes') return 'priority';
    return 'standard';
  }, [safety]);

  const matches = useMemo(() => {
    if (!cityFilteredTherapists.length) return [];

    const maxBudget = {
      'Under ₹500': 500,
      '₹500–1000': 1000,
      '₹1000–1500': 1500,
      '₹1500+': Infinity,
    }[d.budget] ?? Infinity;

    const selectedConcerns = (d.concerns || []).map((c) => c === 'Other' ? (d.concernsOther || 'Other') : c);
    const selectedLanguage = (d.language || '').trim().toLowerCase();
    const hasLanguagePref = selectedLanguage && selectedLanguage !== 'no preference' && selectedLanguage !== 'any language';

    return cityFilteredTherapists
      .filter((t) => {
        if (t.capacity && typeof t.capacity.current === 'number' && typeof t.capacity.max === 'number') {
          return t.capacity.current < t.capacity.max;
        }
        return true;
      })
      .filter((t) => {
        if (!d.therapistGender || d.therapistGender === 'No preference' || t.gender === 'Not specified') {
          return true;
        }
        return (t.gender || '').toLowerCase() === d.therapistGender.toLowerCase();
      })
      .map((t) => {
        const specialtiesList = Array.isArray(t.specialties) ? t.specialties : [];
        const concernHits = selectedConcerns.filter((c) =>
          specialtiesList.some((s) => {
            const sLower = typeof s === 'string' ? s.toLowerCase() : '';
            const cLower = typeof c === 'string' ? c.toLowerCase() : '';
            if (!sLower || !cLower) return false;
            return (
              sLower === cLower ||
              sLower.includes(cLower) ||
              cLower.includes(sLower) ||
              (cLower.includes('mood') && (sLower.includes('depression') || sLower.includes('mood'))) ||
              (cLower.includes('depression') && (sLower.includes('mood') || sLower.includes('depression'))) ||
              (cLower.includes('stress') && (sLower.includes('burnout') || sLower.includes('stress'))) ||
              (cLower.includes('burnout') && (sLower.includes('stress') || sLower.includes('burnout'))) ||
              (cLower.includes('trauma') && (sLower.includes('ptsd') || sLower.includes('trauma'))) ||
              (cLower.includes('grief') && (sLower.includes('bereavement') || sLower.includes('grief'))) ||
              (cLower.includes('anxiety') && (sLower.includes('panic') || sLower.includes('anxiety'))) ||
              (cLower.includes('relation') && sLower.includes('relation'))
            );
          })
        ).length;

        const budgetFit = t.fee <= maxBudget ? 1 : 0.6;
        const genderFit = (!d.therapistGender || d.therapistGender === 'No preference' || t.gender === 'Not specified')
          ? 0.8
          : ((t.gender || '').toLowerCase() === d.therapistGender.toLowerCase() ? 1.2 : 0.3);

        const therapistLanguages = (Array.isArray(t.languages) ? t.languages : ['English', 'Hindi'])
          .map((l) => (l || '').toLowerCase());
        const languageFit = !hasLanguagePref
          ? 1
          : (therapistLanguages.some((l) => l.includes(selectedLanguage) || selectedLanguage.includes(l)) ? 1.5 : 0.2);

        const score = Math.min(99, Math.round(40 + (concernHits * 20) + (budgetFit * 15) + (genderFit * 10) + (languageFit * 15)));
        return { ...t, score, concernHits, languageFit };
      })
      .sort((a, b) => {
        if (hasLanguagePref && b.languageFit !== a.languageFit) {
          return b.languageFit - a.languageFit;
        }
        if (b.concernHits !== a.concernHits) return b.concernHits - a.concernHits;
        return b.score - a.score;
      })
      .slice(0, 3);
  }, [cityFilteredTherapists, d, triageTier]);

  const ensureSession = async () => {
    if (therapySessionId) return therapySessionId;
    return createSession();
  };

  const saveGuidedIntake = async (sessionId) => {
    const response = await fetch('/api/therapy/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        fullName: d.name.trim(),
        email: d.email.trim(),
        phoneNumber: d.phone.trim(),
        age: d.age,
        gender: d.gender === 'Self-describe' ? d.genderOther : d.gender,
        occupation: d.occupation === 'Other' ? d.occupationOther : d.occupation,
        city: d.city.trim(),
        livingSituation: d.living === 'Other' ? d.livingOther : d.living,
        presentingReason: d.reason,
        concerns: {
          selected: d.concerns,
          other: d.concernsOther,
          severity: d.concernSeverity,
          bodySignal: d.bodySignal,
          duration: d.duration,
        },
        affectedLifeAreas: d.lifeArea,
        ownWords: d.ownWords.trim(),
        mentalHealthHistory: {
          talked: d.talked,
          priorTherapy: d.priorTherapy,
          stopped: d.stopped,
          stoppedOther: d.stoppedOther,
          medication: d.medication,
          prescribed: d.prescribed,
          diagnosed: d.diagnosed,
          currentSupport: d.currentSupport,
        },
        copingAndSupport: {
          coping: d.coping,
          copingOther: d.copingOther,
          support: d.support,
        },
        expectations: {
          improve: d.improve,
          worry: d.worry,
          therapistGender: d.therapistGender,
          language: d.language,
          budget: d.budget,
          frequency: d.frequency,
          styleStructure: d.styleStructure,
          stylePace: d.stylePace,
          styleLead: d.styleLead,
          termApproach: d.termApproach,
          finalNotes: d.finalNotes,
        },
        contactPreferences: {
          email: d.email.trim(),
          phone: d.phone.trim(),
        },
        consents,
        answers: {
          satisfaction: d.satisfaction,
          scenarios: d.scenarios,
          language: d.language,
          clientlanguage: d.language && d.language !== 'No preference' ? [d.language] : ['English'],
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.error || 'Failed to save guided therapy intake'
      );
    }

    return data;
  };

  const saveGuidedSafety = async (sessionId) => {
    const answer = safety.answer;

    const safetyStatus =
      answer === 'Yes'
        ? 'positive'
        : answer === 'Prefer not to say'
          ? 'declined'
          : answer === 'No'
            ? 'negative'
            : 'not_assessed';

    const triageLevel =
      safety.physical === 'Yes' ||
      (answer === 'Yes' &&
        (
          safety.recency === 'Today or this week' ||
          safety.plan === 'Yes' ||
          safety.attempt === 'Yes'
        ))
        ? 'immediate'
        : answer === 'Yes' ||
          answer === 'Prefer not to say' ||
          safety.psych === 'Yes'
          ? 'priority'
          : 'standard';

    const response = await fetch('/api/therapy/safety', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        safetyStatus,
        triageLevel,
        recentTiming: safety.recency || null,
        planOrMeans: safety.plan || null,
        priorAttempt: safety.attempt || null,
        physicalSafety: safety.physical || null,
        psychiatricCare: safety.psych || null,
        answers: safety,
        evaluatedBy: 'deterministic',
        evaluationMetadata: {
          source: 'therapy_guided_frontend',
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.error || 'Failed to save guided safety assessment'
      );
    }

    return data;
  };

  const saveGuidedMatches = async (sessionId) => {

    const payload = matches.map((therapist, index) => ({
      therapistAccountId: therapist.id,
      matchStatus: selectedTherapist?.id === therapist.id
        ? 'shortlisted'
        : 'candidate',
      matchRank: index + 1,
      matchScore: therapist.score,
      matchReasons: [
        therapist.concernHits > 0
          ? `${therapist.concernHits} concern specialization match(es)`
          : 'Verified clinical care practitioner',
        therapist.fee <= ({
          'Under ₹500': 500,
          '₹500–1000': 1000,
          '₹1000–1500': 1500,
          '₹1500+': Infinity,
        }[d.budget] ?? Infinity)
          ? 'Within selected budget'
          : 'Consultation fee aligned with clinical experience',
        d.therapistGender === 'No preference'
          ? 'No gender preference'
          : (therapist.gender && therapist.gender.toLowerCase() === d.therapistGender.toLowerCase()
            ? `Matches ${d.therapistGender} clinician preference`
            : null),
        d.language && d.language !== 'No preference'
          ? (Array.isArray(therapist.languages) && therapist.languages.some((l) => (l || '').toLowerCase().includes(d.language.toLowerCase()))
            ? `Speaks ${d.language}`
            : null)
          : null,
      ].filter(Boolean),
      matchingMetadata: {
        source: 'clinical_therapist_directory',
        therapistAccountId: therapist.id,
        displayName: therapist.name,
        credentials: therapist.credentials,
        city: therapist.city,
        formats: therapist.formats,
        specialties: therapist.specialties,
        modalities: therapist.modalities,
        availability: therapist.availability,
      },
    }));

    if (selectedTherapist && !payload.some((p) => p.therapistAccountId === selectedTherapist.id)) {
      payload.unshift({
        therapistAccountId: selectedTherapist.id,
        matchStatus: 'shortlisted',
        matchRank: 1,
        matchScore: 95,
        matchReasons: ['Client selected therapist'],
        matchingMetadata: {
          source: 'clinical_therapist_directory',
          therapistAccountId: selectedTherapist.id,
          displayName: selectedTherapist.name,
        },
      });
    }

    if (!payload.length) return;

    const response = await fetch('/api/therapy/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        matches: payload,
        selectedTherapistAccountId: selectedTherapist?.id || null,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || 'Failed to save therapist matches'
      );
    }

    return data;
  };

  const handleTalkToTeam = async () => {
    if (teamRequestSubmitting) return;
    setTeamRequestSubmitting(true);
    setSessionError('');
    try {
      const sessionId = await ensureSession();
      if (!sessionId) {
        throw new Error('Unable to establish a therapy session. Please try again.');
      }

      await saveGuidedIntake(sessionId);
      await saveGuidedSafety(sessionId);

      const response = await fetch('/api/therapy/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapySessionId: sessionId,
          submissionType: 'team',
          callbackPreference: 'As soon as possible',
          notes: d.ownWords?.trim() || d.reason?.trim() || 'Client requested team review from matches screen because none of the suggested matches suited them.',
          metadata: {
            source: 'therapy_matches_fallback',
            reason: 'Client indicated none of the automated therapist matches suited them',
            clientIntakeSummary: {
              name: d.name,
              email: d.email,
              phone: d.phone,
              concerns: d.concerns,
              language: d.language,
              genderPreference: d.therapistGender,
              budget: d.budget,
              frequency: d.frequency,
              reason: d.reason,
              ownWords: d.ownWords,
            },
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error?.message || data?.error || 'Failed to submit care team request');
      }

      const refCode = data?.referenceId || `TEAM-${Date.now().toString(36).toUpperCase()}`;
      setTeamReferenceCode(refCode);
      setTeamRequestSubmitted(true);
    } catch (err) {
      console.error('Failed to submit care team request from matches:', err);
      setSessionError(err instanceof Error ? err.message : 'Unable to submit care team request');
    } finally {
      setTeamRequestSubmitting(false);
    }
  };

  const submitGuided = async () => {
    const sessionId = await ensureSession();

    if (!sessionId) return false;

    await saveGuidedIntake(sessionId);
    await saveGuidedSafety(sessionId);
    await saveGuidedMatches(sessionId);

    const response = await fetch('/api/therapy/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        submissionType: 'guided',
        payload: {
          selectedTherapistAccountId: selectedTherapist?.id || null,
          selectedTherapistPrototypeId: selectedTherapist?.id || null,
          selectedTherapistName: selectedTherapist?.name || null,
          triageLevel: triageTier,
          matchCount: matches.length,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.error || 'Failed to submit guided therapy intake'
      );
    }

    return true;
  };

  const next = async () => {
    if (loading) return;

    if (step === 10 && safety.needSupport === 'Yes') return;

    setLoading(true);
    setSessionError('');

    try {
      const sessionId = await ensureSession();

      if (!sessionId) return;

      // Save the complete intake before the summary/matching stage.
      if (step === 13) {
        await saveGuidedIntake(sessionId);
      }

      // Safety is persisted immediately after the safety step.
      if (step === 10) {
        await saveGuidedSafety(sessionId);
      }

      // Persist matches when the user enters the matching step.
      if (step === 15) {
        await saveGuidedMatches(sessionId);
      }

      // Auto-save lead drop-off progression
      if (step === 3) {
        autosaveGuidedLead('contact_captured', 4);
      } else if (step === 5) {
        autosaveGuidedLead('concerns_selected', 6);
      } else if (step === 10) {
        autosaveGuidedLead('safety_evaluated', 11);
      } else if (step === 13) {
        autosaveGuidedLead('preferences_set', 14);
      }

      setStep((value) => Math.min(total - 1, value + 1));
    } catch (error) {
      console.error('Guided therapy step save failed:', error);
      setSessionError(
        error instanceof Error
          ? error.message
          : 'Unable to save your therapy intake'
      );
    } finally {
      setLoading(false);
    }
  };

  const previous = () => {
    if (loading) return;

    if (step === 18 && triageTier !== 'standard') {
      setStep(13);
      return;
    }

    setStep((value) => Math.max(1, value - 1));
  };

  const handleSaveConsentAndFinish = async (hasConsented) => {
    if (loading) return;
    setLoading(true);
    setSessionError('');

    try {
      if (selectedTherapist?.id || hasConsented) {
        try {
          await fetch('/api/user/insights-consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              therapistAccountId: selectedTherapist?.id || null,
              isEnabled: !!hasConsented,
              sharePatternSummary: hasConsented ? sharePatterns : false,
              shareEmotionalVocab: hasConsented ? shareVocab : false,
              shareWeeklyReports: hasConsented ? shareWeekly : false,
              shareMonthlyReports: hasConsented ? shareMonthly : false,
              consentVersion: '1.0.0',
            }),
          });
        } catch (consentErr) {
          console.warn('Could not save insight consent preferences during matching intake:', consentErr);
        }
      }

      const submitted = await submitGuided();

      if (submitted) {
        autosaveGuidedLead('completed', 18, { isCompleted: true });
        setStep(18);
      }
    } catch (error) {
      console.error('Guided therapy submission failed:', error);
      setSessionError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your therapy intake'
      );
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    if (loading) return;

    setLoading(true);
    setSessionError('');

    try {
      const submitted = await submitGuided();

      if (submitted) {
        autosaveGuidedLead('completed', 18, { isCompleted: true });
        setStep(18);
      }
    } catch (error) {
      console.error('Guided therapy submission failed:', error);
      setSessionError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your therapy intake'
      );
    } finally {
      setLoading(false);
    }
  };

  if (teamRequestSubmitted) {
    return (
      <div className="iw-flow">
        <Header name="Care Team Review" step={4} total={4} onBack={exit} />
        <div className="iw-card iw-success" style={{ textAlign: 'center' }}>
          <div className="iw-successicon"><Check /></div>
          <h2>We have received your query</h2>
          <p style={{ maxWidth: 540, margin: '0 auto 20px', lineHeight: 1.6, color: '#4A5568', fontSize: 15 }}>
            Thank you for reaching out. We have submitted your request along with your preferences. Our care team will review your details and reach out soon regarding your clinician matching and next steps.
          </p>

          <div
            style={{
              maxWidth: 500,
              margin: '0 auto 24px',
              padding: '16px 20px',
              backgroundColor: '#fff',
              border: '1px solid rgba(38,50,56,0.10)',
              borderRadius: 14,
              textAlign: 'left',
              fontSize: 13,
            }}
          >
            {teamReferenceCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f0f0f0', marginBottom: 8 }}>
                <span style={{ color: '#66747A' }}>Reference ID</span>
                <strong style={{ fontFamily: 'monospace', color: '#132A24' }}>{teamReferenceCode}</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
              <span style={{ color: '#66747A' }}>Name</span>
              <strong>{d.name || 'Valued Client'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
              <span style={{ color: '#66747A' }}>Email</span>
              <strong>{d.email || '—'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
              <span style={{ color: '#66747A' }}>Phone</span>
              <strong>{d.phone || '—'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
              <span style={{ color: '#66747A' }}>Preferred Language</span>
              <strong>{d.language || 'No preference'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
              <span style={{ color: '#66747A' }}>Clinician Gender</span>
              <strong>{d.therapistGender || 'No preference'}</strong>
            </div>
            {d.concerns && d.concerns.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#66747A' }}>Stated Concerns</span>
                <strong style={{ maxWidth: 260, textAlign: 'right' }}>{d.concerns.join(', ')}</strong>
              </div>
            )}
          </div>

          <button type="button" className="iw-primary" style={{ maxWidth: 260, margin: '0 auto 24px' }} onClick={exit}>
            Back to Therapy
          </button>

          {/* Emergency Crisis Helplines Support Box at Bottom */}
          <div
            style={{
              marginTop: 16,
              padding: '16px 20px',
              borderRadius: 14,
              backgroundColor: '#FAFAF9',
              border: '1px solid rgba(38,50,56,0.12)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, marginBottom: 6, color: '#132A24' }}>
              <Phone size={15} style={{ color: '#064e3b' }} />
              <span>Need Immediate Crisis Support? Helplines are Available 24/7</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.5, margin: '0 0 10px', color: '#66747A' }}>
              If you or someone you know is in immediate crisis, having thoughts of self-harm, or experiencing severe distress, please connect directly with dedicated helplines:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
              <a
                href="tel:14416"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Tele-MANAS:</span> <strong>14416</strong>
              </a>
              <a
                href="tel:18005990019"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>KIRAN:</span> <strong>1800-599-0019</strong>
              </a>
              <a
                href="tel:112"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  border: '1px solid #d97706',
                  color: '#78350f',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Emergency:</span> <strong>112</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 18) {
    return (
      <div className="iw-flow">
        <Header name="Guided form" step={18} total={18} onBack={exit} />
        <div className="iw-card iw-success">
          <div className="iw-successicon"><Check /></div>
          {selectedTherapist ? (
            <>
              <h2>Request Sent to {selectedTherapist.name}</h2>
              <p>Your clinical intake and matching request have been sent directly to <strong>{selectedTherapist.name}</strong> for clinical review.</p>
              <div className="iw-summary">
                <div className="iw-row"><span>Therapist</span><strong>{selectedTherapist.name}</strong></div>
                <div className="iw-row"><span>Status</span><strong style={{ color: '#0f766e' }}>Request Sent · Awaiting Review</strong></div>
                <div className="iw-row"><span>Availability</span><strong>{selectedTherapist.availability}</strong></div>
                <div className="iw-row"><span>Fee</span><strong>₹{selectedTherapist.fee}/session</strong></div>
              </div>

              <div className="iw-note" style={{ textAlign: 'left', lineHeight: 1.6, marginTop: 14 }}>
                <strong>What happens next:</strong>
                <ol style={{ paddingLeft: 18, marginTop: 6, marginBottom: 0 }}>
                  <li><strong>{selectedTherapist.name}</strong> will review your clinical intake and goals.</li>
                  <li>Once your therapist accepts the match, you will receive an email confirmation.</li>
                  <li>You can then schedule and book your first session whenever you are ready.</li>
                </ol>
              </div>

              <button
                type="button"
                className="iw-primary"
                style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                onClick={exit}
              >
                Return to Dashboard
              </button>
            </>
          ) : (
            <>
              <h2>Your intake is ready for clinical review</h2>
              <p>
                Based on the safety information provided, direct therapist matching is paused. Our care and clinical team will personally review your intake to support you safely.
              </p>
              <button
                type="button"
                className="iw-primary"
                style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                onClick={exit}
              >
                Return to Dashboard
              </button>
            </>
          )}
          <div className="iw-note" style={{ marginTop: 12 }}>
            Your consultation is held securely via Google Meet and synced automatically with Google Calendar once scheduled.
          </div>
          <button type="button" className="iw-secondary" onClick={exit}>Back to Therapy</button>
        </div>
      </div>
    );
  }

  return (
    <div className="iw-flow">
      <Header name="Guided form" step={step} total={total} onBack={step === 1 ? exit : previous} />
      <div className="iw-card">
        {step === 1 && (
          <>
            <div className="iw-k">Guided form</div>
            <h2>Mental Health Intake Form</h2>
            <p>Estimated time: 12–15 minutes, across 6 short sections. Please answer honestly — there are no right or wrong answers.</p>
            <div className="iw-note">
              This covers your background, current concerns and impact on daily life, mental health history,
              everyday functioning, scenarios and therapy preferences.
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="iw-k">Before we start</div>
            <h2>A quick age check</h2>
            <p>This intake is currently designed for adults 18 and over.</p>
            <div className="iw-optiongrid">
              <Option onClick={() => setStep(3)}>I am 18 or older</Option>
              <Option onClick={() => setStep(1)}>I am under 18</Option>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="iw-k">Before we begin</div>
            <h2>A few things to confirm</h2>
            <p>Please read and check each of these — they matter.</p>
            {[
              'I understand this form prepares a summary for therapist matching — it does not diagnose or treat any condition.',
              'I understand my therapist will form their own independent clinical assessment.',
              'I consent to my answers being stored securely and shared only with the therapist I choose to book.',
              'I understand this is not a crisis service and I will contact emergency/helpline support if I am in crisis.',
            ].map((text, index) => (
              <label key={text} style={{ display: 'flex', gap: 9, marginBottom: 13, fontSize: 13, color: '#263238' }}>
                <input
                  type="checkbox"
                  checked={consents[index]}
                  onChange={(e) => {
                    const nextConsents = [...consents];
                    nextConsents[index] = e.target.checked;
                    setConsents(nextConsents);
                  }}
                />
                {text}
              </label>
            ))}
            <div className="iw-field">
              <label>Full name</label>
              <input
                value={d.name}
                onChange={(e) => set('name', e.target.value)}
                onBlur={(e) => {
                  if (d.phone) autosaveGuidedLead('contact_captured', 3, { name: e.target.value });
                }}
                placeholder="Your name"
              />
            </div>
            <div className="iw-field">
              <label>Email</label>
              <input
                type="email"
                value={d.email}
                onChange={(e) => set('email', e.target.value)}
                onBlur={(e) => {
                  if (d.phone) autosaveGuidedLead('contact_captured', 3, { email: e.target.value });
                }}
                placeholder="you@example.com"
              />
            </div>
            <div className="iw-field">
              <label>Phone number</label>
              <input
                value={d.phone}
                onChange={(e) => handlePhoneChangeWithAutosave(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.replace(/[^\d+]/g, '').length >= 7) {
                    autosaveGuidedLead('contact_captured', 3, { phone: e.target.value });
                  }
                }}
                placeholder="Your phone number"
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="iw-k">Section A</div>
            <h2>About you</h2>
            <div className="iw-field"><label>Age</label><input value={d.age} onChange={(e) => set('age', e.target.value)} placeholder="Your age" /></div>
            <div className="iw-field">
              <label>Gender</label>
              <div className="iw-optiongrid">
                {['Female', 'Male', 'Non-binary', 'Prefer not to say', 'Self-describe'].map((item) => (
                  <Option key={item} selected={d.gender === item} onClick={() => set('gender', item)}>{item}</Option>
                ))}
              </div>
              {d.gender === 'Self-describe' && <input style={{ marginTop: 9 }} value={d.genderOther} onChange={(e) => set('genderOther', e.target.value)} placeholder="Self-describe" />}
            </div>
            <div className="iw-field">
              <label>Occupation</label>
              <div className="iw-optiongrid">
                {['Student', 'Competitive Exam Aspirant', 'Working Professional', 'Business', 'Homemaker', 'Looking for Work', 'Other'].map((item) => (
                  <Option key={item} selected={d.occupation === item} onClick={() => set('occupation', item)}>{item}</Option>
                ))}
              </div>
              {d.occupation === 'Other' && <input style={{ marginTop: 9 }} value={d.occupationOther} onChange={(e) => set('occupationOther', e.target.value)} placeholder="Please specify" />}
            </div>
            <div className="iw-field"><label>Current city</label><input value={d.city} onChange={(e) => set('city', e.target.value)} placeholder="Your city" /></div>
            <div className="iw-field">
              <label>Who do you currently live with?</label>
              <div className="iw-optiongrid">
                {['Alone', 'Parents', 'Partner/Spouse', 'Friends/Roommates', 'Hostel/PG', 'Other'].map((item) => (
                  <Option key={item} selected={d.living === item} onClick={() => set('living', item)}>{item}</Option>
                ))}
              </div>
              {d.living === 'Other' && <input style={{ marginTop: 9 }} value={d.livingOther} onChange={(e) => set('livingOther', e.target.value)} placeholder="Please specify" />}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="iw-k">Section B</div>
            <h2>Why are you here?</h2>
            <div className="iw-field">
              <label>What made you decide to seek support now?</label>
              <div className="iw-optiongrid">
                {[
                  'Something happened recently',
                  'I’ve been struggling for a few months',
                  'I’ve struggled for years',
                  'Someone suggested therapy',
                  'I want to understand myself better',
                  'I’m just exploring',
                  'Not sure',
                ].map((item) => <Option key={item} selected={d.reason === item} onClick={() => set('reason', item)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Which concerns best describe what you’re experiencing today?</label>
              <div className="iw-scale-label">Choose up to 5</div>
              <div className="iw-optiongrid">
                {CONCERNS.map((item) => (
                  <Option key={item} selected={d.concerns.includes(item)} onClick={() => toggle('concerns', item, 5)}>
                    {item}
                  </Option>
                ))}
              </div>
              {d.concerns.includes('Other') && (
                <input style={{ marginTop: 9 }} value={d.concernsOther} onChange={(e) => set('concernsOther', e.target.value)} placeholder="Please specify" />
              )}
            </div>
            {d.concerns.length > 0 && (
              <div className="iw-section">
                <div className="iw-field">
                  <label>How much is each of these affecting you right now?</label>
                  {d.concerns.map((concern) => (
                    <div key={concern} style={{ marginBottom: 12 }}>
                      <div className="iw-scale-label">{concern}</div>
                      <div className="iw-optiongrid">
                        {['Mild', 'Moderate', 'Severe'].map((level) => (
                          <Option key={level} selected={d.concernSeverity[concern] === level} onClick={() => setGrid('concernSeverity', concern, level)}>{level}</Option>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="iw-field">
              <label>Do you notice this in your body, not just your thoughts?</label>
              <p style={{ fontSize: 12 }}>Things like a racing heart, tight chest, shallow breathing, tension you can’t release, or feeling frozen/shut down.</p>
              <div className="iw-optiongrid">
                {['Often, and it’s hard to shake', 'Sometimes', 'Rarely or not really'].map((item) => <Option key={item} selected={d.bodySignal === item} onClick={() => set('bodySignal', item)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>How long have these concerns been affecting you?</label>
              <div className="iw-optiongrid">
                {['Less than 1 month', '1–3 months', '3–12 months', '1–2 years', 'More than 2 years'].map((item) => <Option key={item} selected={d.duration === item} onClick={() => set('duration', item)}>{item}</Option>)}
              </div>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <div className="iw-k">Section B, continued</div>
            <h2>How much different areas are affected</h2>
            {LIFE_AREAS.map((area) => (
              <div key={area} className="iw-field">
                <label>{area}</label>
                <div className="iw-grid5">
                  {['Not at all', 'A little', 'Moderately', 'Quite a lot', 'Extremely'].map((item) => (
                    <Option key={item} selected={d.lifeArea[area] === item} onClick={() => setGrid('lifeArea', area, item)}>{item}</Option>
                  ))}
                </div>
              </div>
            ))}
            <div className="iw-field">
              <label>In your own words, what has been bothering you lately?</label>
              <textarea value={d.ownWords} onChange={(e) => set('ownWords', e.target.value)} placeholder="Write as much or as little as feels right." />
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <div className="iw-k">Section C</div>
            <h2>Your mental health journey</h2>
            <div className="iw-note">Everything here, including medication and diagnosis history, should only be shared according to the product’s consent and privacy controls.</div>
            <div className="iw-field">
              <label>Have you spoken to anyone about this?</label>
              <div className="iw-optiongrid">
                {['No', 'Friend', 'Family', 'Therapist', 'Psychiatrist', 'Doctor'].map((item) => <Option key={item} selected={d.talked.includes(item)} onClick={() => toggle('talked', item, 6)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Have you attended therapy before?</label>
              <div className="iw-optiongrid">
                {['Never', '1–3 sessions', '4–10 sessions', '10+ sessions', 'Currently in therapy'].map((item) => <Option key={item} selected={d.priorTherapy === item} onClick={() => set('priorTherapy', item)}>{item}</Option>)}
              </div>
            </div>
            {['1–3 sessions', '4–10 sessions', '10+ sessions'].includes(d.priorTherapy) && (
              <div className="iw-field">
                <label>If therapy stopped, why?</label>
                <div className="iw-optiongrid">
                  {['Felt better', 'Too expensive', 'Didn’t connect with therapist', 'Didn’t help', 'Didn’t have time', 'Family reasons', 'Other'].map((item) => <Option key={item} selected={d.stopped.includes(item)} onClick={() => toggle('stopped', item, 7)}>{item}</Option>)}
                </div>
                {d.stopped.includes('Other') && <input style={{ marginTop: 9 }} value={d.stoppedOther} onChange={(e) => set('stoppedOther', e.target.value)} placeholder="Please specify" />}
              </div>
            )}
            <div className="iw-field">
              <label>Medication?</label>
              <div className="iw-optiongrid">
                {['Never', 'Currently taking', 'Took in the past', 'Prescribed but didn’t take', 'Prefer not to say'].map((item) => <Option key={item} selected={d.medication === item} onClick={() => set('medication', item)}>{item}</Option>)}
              </div>
            </div>
            {['Currently taking', 'Took in the past', 'Prescribed but didn’t take'].includes(d.medication) && (
              <div className="iw-field">
                <label>Who prescribed it?</label>
                <div className="iw-optiongrid">
                  {['Psychiatrist', 'General Physician', 'Neurologist', 'Other'].map((item) => <Option key={item} selected={d.prescribed === item} onClick={() => set('prescribed', item)}>{item}</Option>)}
                </div>
              </div>
            )}
            <div className="iw-field">
              <label>Diagnosed with a mental health condition?</label>
              <div className="iw-optiongrid">
                {['No', 'Yes', 'Not sure', 'Prefer not to say'].map((item) => <Option key={item} selected={d.diagnosed === item} onClick={() => set('diagnosed', item)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Currently receiving support?</label>
              <div className="iw-optiongrid">
                {['No', 'Therapy', 'Medication', 'Both'].map((item) => <Option key={item} selected={d.currentSupport === item} onClick={() => set('currentSupport', item)}>{item}</Option>)}
              </div>
            </div>
          </>
        )}

        {step === 8 && (
          <>
            <div className="iw-k">Section D</div>
            <h2>Rate your satisfaction</h2>
            {SATISFACTION_AREAS.map((area) => (
              <div key={area} className="iw-field">
                <label>{area}</label>
                <div className="iw-grid5">
                  {['Very Poor', 'Poor', 'Average', 'Good', 'Very Good'].map((item) => <Option key={item} selected={d.satisfaction[area] === item} onClick={() => setGrid('satisfaction', area, item)}>{item}</Option>)}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 9 && (
          <>
            <div className="iw-k">Section D, continued</div>
            <h2>Coping & support system</h2>
            <div className="iw-field">
              <label>When you’re emotionally struggling, what do you usually do first?</label>
              <div className="iw-optiongrid">
                {['Talk to someone', 'Keep it to myself', 'Pray/Meditate', 'Scroll social media', 'Watch videos', 'Sleep', 'Work/Study more', 'Exercise', 'Cry', 'Other'].map((item) => <Option key={item} selected={d.coping === item} onClick={() => set('coping', item)}>{item}</Option>)}
              </div>
              {d.coping === 'Other' && <input style={{ marginTop: 9 }} value={d.copingOther} onChange={(e) => set('copingOther', e.target.value)} placeholder="Please specify" />}
            </div>
            {SUPPORT_AREAS.map((area) => (
              <div key={area} className="iw-field">
                <label>{area}</label>
                <div className="iw-grid5">
                  {['Not at all', 'A little', 'Sometimes', 'Mostly', 'Completely'].map((item) => <Option key={item} selected={d.support[area] === item} onClick={() => setGrid('support', area, item)}>{item}</Option>)}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 10 && (
          <>
            <div className="iw-k">Before we continue</div>
            <h2>One more thing, for your safety</h2>
            <p>We ask this of everyone, early on and on purpose — not because of anything you’ve said.</p>
            <Safety value={safety} setValue={setSafety} />
          </>
        )}

        {step === 11 && (
          <>
            <div className="iw-k">Section E</div>
            <h2>A few quick scenarios</h2>
            <p>Go with your first instinct — there’s no right answer.</p>
            {SCENARIOS_1.map(([key, question, options]) => (
              <div key={key} className="iw-field">
                <label>{question}</label>
                <div className="iw-optiongrid">
                  {options.map((item) => <Option key={item} selected={d.scenarios[key] === item} onClick={() => setGrid('scenarios', key, item)}>{item}</Option>)}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 12 && (
          <>
            <div className="iw-k">Section E, continued</div>
            <h2>A few more scenarios</h2>
            {SCENARIOS_2.map(([key, question, options]) => (
              <div key={key} className="iw-field">
                <label>{question}</label>
                <div className="iw-optiongrid">
                  {options.map((item) => <Option key={item} selected={d.scenarios[key] === item} onClick={() => setGrid('scenarios', key, item)}>{item}</Option>)}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 13 && (
          <>
            <div className="iw-k">Section F</div>
            <h2>Therapy expectations</h2>
            <div className="iw-field">
              <label>What are you hoping will improve?</label>
              <div className="iw-scale-label">Choose up to 3</div>
              <div className="iw-optiongrid">
                {['Anxiety', 'Mood', 'Relationships', 'Confidence', 'Sleep', 'Productivity', 'Emotions', 'Family', 'Career', 'Self-understanding'].map((item) => <Option key={item} selected={d.improve.includes(item)} onClick={() => toggle('improve', item, 3)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>In a session, would you rather…</label>
              <div className="iw-optiongrid">
                <Option selected={d.styleStructure === 'Structured'} onClick={() => set('styleStructure', 'Structured')}>Have structure — tools, homework, a plan</Option>
                <Option selected={d.styleStructure === 'Open'} onClick={() => set('styleStructure', 'Open')}>Have open space — talk and see where it goes</Option>
              </div>
            </div>
            <div className="iw-field">
              <label>And when it comes to being challenged…</label>
              <div className="iw-optiongrid">
                <Option selected={d.stylePace === 'Gentle'} onClick={() => set('stylePace', 'Gentle')}>I’d prefer gentle and supportive</Option>
                <Option selected={d.stylePace === 'Direct'} onClick={() => set('stylePace', 'Direct')}>I’m okay being challenged directly</Option>
              </div>
            </div>
            <div className="iw-field">
              <label>And who takes the lead?</label>
              <div className="iw-optiongrid">
                <Option selected={d.styleLead === 'TherapistLed'} onClick={() => set('styleLead', 'TherapistLed')}>I’d rather the therapist guide the session</Option>
                <Option selected={d.styleLead === 'ClientLed'} onClick={() => set('styleLead', 'ClientLed')}>I’d rather lead and bring what’s on my mind</Option>
              </div>
            </div>
            <div className="iw-field">
              <label>What are you looking for right now?</label>
              <div className="iw-optiongrid">
                {[
                  ['ShortTerm', 'Focused, shorter-term help with something specific'],
                  ['LongTerm', 'Longer-term work — patterns, not just the current situation'],
                  ['NotSure', 'Not sure yet — open to what my therapist suggests'],
                ].map(([key, label]) => <Option key={key} selected={d.termApproach === key} onClick={() => set('termApproach', key)}>{label}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Biggest worry about therapy?</label>
              <div className="iw-optiongrid">
                {['Cost', 'Being judged', 'Opening up', 'It won’t help', 'Finding the right therapist', 'Nothing'].map((item) => <Option key={item} selected={d.worry === item} onClick={() => set('worry', item)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Therapist gender preference?</label>
              <div className="iw-optiongrid">
                {dynamicGenderOptions.map((opt) => (
                  <Option
                    key={opt.value}
                    selected={d.therapistGender === opt.value}
                    onClick={() => set('therapistGender', opt.value)}
                  >
                    {opt.label}
                  </Option>
                ))}
              </div>
            </div>
            <div className="iw-field">
              <label>Preferred language for therapy?</label>
              <select
                value={d.language || 'No preference'}
                onChange={(e) => set('language', e.target.value)}
                style={{
                  cursor: 'pointer',
                  fontSize: 14,
                  lineHeight: '1.4',
                  backgroundColor: '#fff',
                }}
              >
                {dynamicLanguageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="iw-field">
              <label>Affordable budget per session?</label>
              <div className="iw-optiongrid">
                {dynamicBudgetOptions.map((opt) => (
                  <Option
                    key={opt.value}
                    selected={d.budget === opt.value}
                    onClick={() => set('budget', opt.value)}
                  >
                    {opt.label}
                  </Option>
                ))}
              </div>
            </div>
            <div className="iw-field">
              <label>Preferred frequency?</label>
              <div className="iw-optiongrid">
                {['Weekly', 'Every 2 weeks', 'Monthly', 'Not sure'].map((item) => <Option key={item} selected={d.frequency === item} onClick={() => set('frequency', item)}>{item}</Option>)}
              </div>
            </div>
            <div className="iw-field">
              <label>Anything important you’d like us to know?</label>
              <textarea value={d.finalNotes} onChange={(e) => set('finalNotes', e.target.value)} placeholder="Optional — anything at all." />
            </div>
          </>
        )}

        {step === 14 && (
          <>
            <div className="iw-k">Before we match you</div>
            <h2>Here’s what we’ve put together</h2>
            <div className="iw-note"><strong>This is the summary your therapist/care team will read.</strong></div>
            <div className="iw-summary">
              <div className="iw-row"><span>Presenting concerns</span><strong>{d.concerns.join(', ') || '—'}</strong></div>
              <div className="iw-row"><span>In your own words</span><strong>{d.ownWords || '—'}</strong></div>
              <div className="iw-row"><span>Most affected areas</span><strong>{Object.entries(d.lifeArea).filter(([, value]) => ['Quite a lot', 'Extremely'].includes(value)).map(([key]) => key).join(', ') || 'No area rated significantly affected'}</strong></div>
              <div className="iw-row"><span>Mental health history</span><strong>{[d.priorTherapy && `Therapy: ${d.priorTherapy}`, d.medication && `Medication: ${d.medication}`, d.diagnosed && `Diagnosis: ${d.diagnosed}`, d.currentSupport && `Support: ${d.currentSupport}`].filter(Boolean).join(' · ') || '—'}</strong></div>
              <div className="iw-row"><span>Hoping to improve</span><strong>{d.improve.join(', ') || '—'}</strong></div>
              <div className="iw-row"><span>Preferences</span><strong>{[d.therapistGender ? `Gender: ${d.therapistGender}` : null, d.language && d.language !== 'No preference' ? `Language: ${d.language}` : 'Language: Any'].filter(Boolean).join(' · ')}</strong></div>
              <div className="iw-row"><span>Budget & frequency</span><strong>{d.budget} · {d.frequency}</strong></div>
            </div>
          </>
        )}

        {step === 15 && (
          <>
            <div className="iw-k">Clinical matching</div>
            <h2>How we match your therapists</h2>
            <p>Here’s how our matching aligns you with the right practitioner.</p>
            <div className="iw-note">
              <strong>Your concerns → specialization</strong><br />
              We look for direct overlap between the concerns you selected and verified clinician specialties.
            </div>
            <div className="iw-note">
              <strong>Your preferences → therapeutic approach</strong><br />
              Your structured vs. open and gentle vs. direct preferences help ensure a good relational fit.
            </div>
            <div className="iw-note">
              <strong>Budget &amp; schedule → availability</strong><br />
              Only practitioners with active availability and matching consultation options are recommended.
            </div>
            <div className="iw-note">
              <strong>Safety &amp; triage</strong><br />
              Standard-risk clients can select directly from available licensed practitioners. Priority or immediate cases are routed to care professionals first.
            </div>
          </>
        )}

        {step === 16 && (
          <div className="py-1">
            {loadingMatches ? (
              <div className="iw-note" style={{ textAlign: 'center', padding: '36px 0' }}>
                Analyzing your intake and computing clinical matches...
              </div>
            ) : matchOutcome ? (
              <TherapyMatchResultsView
                matchData={matchOutcome}
                clientAnswers={{
                  ...d,
                  severity: d.concernSeverity,
                  stylestructure: d.styleStructure,
                  termapproach: d.termApproach,
                }}
                onRequestTherapist={(therapist) => {
                  setSelectedTherapist(therapist);
                }}
                onEditAnswers={() => setStep(5)}
                onTalkToTeam={handleTalkToTeam}
              />
            ) : (
              <>
                <div className="iw-k">Therapist matching</div>
                <h2>A few therapists who could be a good fit</h2>
                <p>Licensed, verified practitioners actively available for consultation based on your intake responses.</p>
                <div className="iw-note" style={{ textAlign: 'center', padding: '24px 0' }}>
                  Finding verified active therapists...
                </div>
              </>
            )}
          </div>
        )}

        {step === 17 && (
          <div className="space-y-6">
            <div className="iw-k">Care Continuity &amp; Privacy</div>
            <h2>Share Insights with {selectedTherapist?.name || 'Your Therapist'}</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Help your therapist understand your emotional context and progress from day one. You can optionally share high-level summaries derived from your self-reflection activity.
            </p>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Completely optional &amp; confidential.</strong> Sharing these insights is strictly voluntary and never blocks therapy booking. Raw journal entries, audio recordings, and confidential reflection notes are <em>never</em> shared. You can change preferences or revoke access anytime under Settings.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 pb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Sharing Permissions (Explicit Consent)
              </span>
              <button
                type="button"
                className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
                onClick={() => {
                  const allActive = sharePatterns && shareVocab && shareWeekly && shareMonthly;
                  setSharePatterns(!allActive);
                  setShareVocab(!allActive);
                  setShareWeekly(!allActive);
                  setShareMonthly(!allActive);
                }}
              >
                {sharePatterns && shareVocab && shareWeekly && shareMonthly ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-3">
              <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${sharePatterns ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  checked={sharePatterns}
                  onChange={(e) => setSharePatterns(e.target.checked)}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-stone-900">Pattern Summary</span>
                  </div>
                  <div className="text-xs text-stone-500 leading-normal">
                    Share high-level recurring emotional and behavioral theme summaries from your platform activity (cycle visualizer details remain private).
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${shareVocab ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  checked={shareVocab}
                  onChange={(e) => setShareVocab(e.target.checked)}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-stone-900">Emotional Vocabulary Summary</span>
                  </div>
                  <div className="text-xs text-stone-500 leading-normal">
                    Share your emotional vocabulary distribution and primary emotional descriptors identified during check-ins.
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${shareWeekly ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  checked={shareWeekly}
                  onChange={(e) => setShareWeekly(e.target.checked)}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-stone-900">Weekly Reports</span>
                  </div>
                  <div className="text-xs text-stone-500 leading-normal">
                    Share your periodic weekly self-reflection summaries to help your therapist track week-over-week shifts.
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${shareMonthly ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  checked={shareMonthly}
                  onChange={(e) => setShareMonthly(e.target.checked)}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-stone-900">Monthly Reports</span>
                  </div>
                  <div className="text-xs text-stone-500 leading-normal">
                    Share your comprehensive monthly reflection and progress reports.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {sessionError && (
          <div className="iw-error">{sessionError}</div>
        )}

        <div className="iw-nav">
          <button
            type="button"
            className="iw-secondary"
            onClick={previous}
            disabled={loading}
          >
            Back
          </button>
          {step < 16 && (
            <button
              type="button"
              className="iw-primary"
              disabled={!valid || loading || !therapySessionId || (step === 10 && safety.needSupport === 'Yes')}
              onClick={next}
            >
              {loading ? 'Saving…' : 'Continue'} <ArrowRight size={16} />
            </button>
          )}
          {step === 16 && (
            <button
              type="button"
              className="iw-primary"
              disabled={triageTier === 'standard' && !selectedTherapist}
              onClick={() => setStep(17)}
            >
              {triageTier === 'standard' ? 'Continue to Sharing' : 'Continue to review'} <ArrowRight size={16} />
            </button>
          )}
          {step === 17 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="iw-secondary"
                disabled={loading}
                onClick={() => {
                  setSharePatterns(false);
                  setShareVocab(false);
                  setShareWeekly(false);
                  setShareMonthly(false);
                  handleSaveConsentAndFinish(false);
                }}
              >
                Skip &amp; Keep Private
              </button>
              <button
                type="button"
                className="iw-primary"
                disabled={loading}
                onClick={() => {
                  const anySelected = sharePatterns || shareVocab || shareWeekly || shareMonthly;
                  handleSaveConsentAndFinish(anySelected);
                }}
              >
                {loading ? 'Submitting…' : (sharePatterns || shareVocab || shareWeekly || shareMonthly ? 'Save Sharing & Submit' : 'Submit Intake')} <Check size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Team({ exit, user, profile }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [therapySessionId, setTherapySessionId] = useState(null);
  const [safety, setSafety] = useState({});
  const [form, setForm] = useState(() => ({
    name: profile?.name || user?.name || user?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: user?.phone_number || user?.phoneNumber || user?.phone || '',
    reason: '',
    callback: '',
  }));

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const createSession = async () => {
    if (therapySessionId) return therapySessionId;

    try {
      setSessionError('');
      const response = await fetch('/api/therapy/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyType: 'team',
          metadata: { source: 'therapy_team' },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create therapy session');
      }

      const sessionId = data?.session?.id || data?.id;
      if (!sessionId) throw new Error('Therapy session ID was not returned');

      setTherapySessionId(sessionId);
      return sessionId;
    } catch (error) {
      console.error('Team therapy session creation failed:', error);
      setSessionError(error instanceof Error ? error.message : 'Unable to start therapy request');
      return null;
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  const saveTeamIntake = async (sessionId) => {
    const response = await fetch('/api/therapy/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        fullName: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phone.trim(),
        presentingReason: form.reason.trim(),
        contactPreferences: {
          email: form.email.trim(),
          phone: form.phone.trim(),
          callbackPreference: form.callback,
        },
        consents: { teamContact: true },
        answers: { journey: 'team' },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || 'Failed to save team intake');
    return data;
  };

  const saveTeamSafety = async (sessionId) => {
    const answer = safety.answer;
    const safetyStatus =
      answer === 'Yes'
        ? 'positive'
        : answer === 'Prefer not to say'
          ? 'declined'
          : answer === 'No'
            ? 'negative'
            : 'not_assessed';

    const triageLevel =
      safety.physical === 'Yes' ||
      (answer === 'Yes' &&
        (safety.recency === 'Today or this week' ||
          safety.plan === 'Yes' ||
          safety.attempt === 'Yes'))
        ? 'immediate'
        : answer === 'Yes' || answer === 'Prefer not to say'
          ? 'priority'
          : 'standard';

    const response = await fetch('/api/therapy/safety', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        safetyStatus,
        triageLevel,
        recentTiming: safety.recency || null,
        planOrMeans: safety.plan || null,
        priorAttempt: safety.attempt || null,
        physicalSafety: safety.physical || null,
        psychiatricCare: safety.psych || null,
        answers: safety,
        evaluatedBy: 'deterministic',
        evaluationMetadata: { source: 'therapy_team_frontend' },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || 'Failed to save team safety assessment');
    return data;
  };

  const submitTeamRequest = async () => {
    const sessionId = therapySessionId || await createSession();
    if (!sessionId) return false;

    await saveTeamIntake(sessionId);
    await saveTeamSafety(sessionId);

    const response = await fetch('/api/therapy/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        therapySessionId: sessionId,
        submissionType: 'team',
        callbackPreference: form.callback,
        notes: form.reason.trim(),
        metadata: {
          source: 'therapy_team_frontend',
          contactProvided: true,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || 'Failed to submit team request');
    return data;
  };

  const next = async () => {
    if (loading) return;

    if (step === 1) {
      if (!safety.answer || (safety.answer === 'Yes' && (!safety.recency || !safety.plan || !safety.attempt)) || !safety.physical) {
        setSessionError('Please complete the safety questions before continuing.');
        return;
      }
    }

    if (step < 3) {
      setSessionError('');
      setStep((value) => value + 1);
      return;
    }

    setLoading(true);
    setSessionError('');
    try {
      await submitTeamRequest();
      setDone(true);
    } catch (error) {
      console.error('Team therapy submission failed:', error);
      setSessionError(error instanceof Error ? error.message : 'Unable to submit therapy request');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="iw-flow">
        <Header name="Talk to the team" step={4} total={4} onBack={exit} />
        <div className="iw-card iw-success" style={{ textAlign: 'center' }}>
          <div className="iw-successicon"><Check /></div>
          <h2>We have received your query</h2>
          <p style={{ maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.6, color: '#4A5568', fontSize: 15 }}>
            Thank you for reaching out. We have received your query and will reach out soon regarding your therapy journey.
          </p>
          <button type="button" className="iw-primary" style={{ maxWidth: 260, margin: '0 auto 24px' }} onClick={exit}>
            Back to Therapy
          </button>

          {/* Emergency Crisis Helplines Support Box at Bottom */}
          <div
            style={{
              marginTop: 16,
              padding: '16px 20px',
              borderRadius: 14,
              backgroundColor: '#FAFAF9',
              border: '1px solid rgba(38,50,56,0.12)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, marginBottom: 6, color: '#132A24' }}>
              <Phone size={15} style={{ color: '#064e3b' }} />
              <span>Need Immediate Crisis Support? Helplines are Available 24/7</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.5, margin: '0 0 10px', color: '#66747A' }}>
              If you or someone you know is in immediate crisis, having thoughts of self-harm, or experiencing severe distress, please connect directly with dedicated helplines:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
              <a
                href="tel:14416"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid rgba(38,50,56,0.12)',
                  color: '#132A24',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Tele-MANAS: 14416 / 1800-891-4416
              </a>
              <a
                href="tel:18005990019"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid rgba(38,50,56,0.12)',
                  color: '#132A24',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                KIRAN: 1800-599-0019
              </a>
              <a
                href="tel:112"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid rgba(38,50,56,0.12)',
                  color: '#132A24',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Emergency: 112
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iw-flow">
      <Header name="Talk to the team" step={step + 1} total={4} onBack={step ? () => setStep((value) => value - 1) : exit} />
      <div className="iw-card">
        {sessionError && <div className="iw-note" style={{ marginTop: 0, marginBottom: 18 }}>{sessionError}</div>}

        {step === 0 && (
          <>
            <div className="iw-k">Talk to the team</div>
            <h2>How should we reach you?</h2>
            <p>No AI conversation or therapist matching is needed for this route.</p>
            <div className="iw-field"><label>Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div className="iw-field"><label>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div className="iw-field">
              <label>Phone number</label>
              <input
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  set('phone', val);
                  if (val.replace(/[^\d+]/g, '').length >= 10) {
                    sendLeadAutosave({
                      phoneNumber: val,
                      fullName: form.name,
                      email: form.email,
                      journeyType: 'team',
                      currentStep: 0,
                      dropOffStage: 'contact_captured',
                    });
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.replace(/[^\d+]/g, '').length >= 7) {
                    sendLeadAutosave({
                      phoneNumber: e.target.value,
                      fullName: form.name,
                      email: form.email,
                      journeyType: 'team',
                      currentStep: 0,
                      dropOffStage: 'contact_captured',
                    });
                  }
                }}
                placeholder="Your phone number"
              />
            </div>
            <div className="iw-field"><label>What would you like help with?</label><textarea value={form.reason} onChange={(e) => set('reason', e.target.value)} /></div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="iw-k">Safety</div>
            <h2>One more thing, for your safety</h2>
            <Safety value={safety} setValue={setSafety} />
          </>
        )}

        {step === 2 && (
          <>
            <div className="iw-k">Callback</div>
            <h2>Preferred callback</h2>
            <p>Choose when the team should contact you.</p>
            <div className="iw-optiongrid">
              {['Morning', 'Afternoon', 'Evening', 'No preference'].map((item) => (
                <Option key={item} selected={form.callback === item} onClick={() => set('callback', item)}>{item}</Option>
              ))}
            </div>
            <div
              style={{
                marginTop: 20,
                padding: '14px 18px',
                borderRadius: 14,
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #FDBA74',
                color: '#9A3412',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                <Phone size={15} style={{ color: '#EA580C' }} />
                <span>In Immediate Crisis — Reach Out to Helplines Directly</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.5, margin: '0 0 10px', color: '#7C2D12' }}>
                If you are experiencing acute distress or thoughts of self-harm, please do not wait for a callback. Reach out directly to 24/7 emergency helplines:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
                <a
                  href="tel:14416"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #FDBA74',
                    color: '#C2410C',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Tele-MANAS: 14416 / 1800-891-4416
                </a>
                <a
                  href="tel:18005990019"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #FDBA74',
                    color: '#C2410C',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  KIRAN: 1800-599-0019
                </a>
                <a
                  href="tel:112"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 10px',
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #FDBA74',
                    color: '#C2410C',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Emergency: 112
                </a>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="iw-k">Review</div>
            <h2>Ready to send the request?</h2>
            <div className="iw-summary">
              <div className="iw-row"><span>Name</span><strong>{form.name}</strong></div>
              <div className="iw-row"><span>Phone</span><strong>{form.phone}</strong></div>
              <div className="iw-row"><span>Callback</span><strong>{form.callback}</strong></div>
              <div className="iw-row"><span>Safety triage</span><strong>{safety.answer === 'Yes' || safety.answer === 'Prefer not to say' ? 'Human review' : 'Standard'}</strong></div>
            </div>
          </>
        )}

        <div className="iw-nav">
          <button type="button" className="iw-secondary" disabled={!step || loading} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
          <button
            type="button"
            className="iw-primary"
            disabled={
              loading ||
              (step === 0 && (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.reason.trim())) ||
              (step === 1 && (!safety.answer || !safety.physical || (safety.answer === 'Yes' && (!safety.recency || !safety.plan || !safety.attempt)))) ||
              (step === 2 && !form.callback)
            }
            onClick={next}
          >
            {step < 3 ? <>Continue <ArrowRight size={16} /></> : <>Request callback <Check size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TherapyPage({ user, profile, onSignOut }) {
  const [journey, setJourney] = useState(null);
  const [bookingFlowOpen, setBookingFlowOpen] = useState(false);
  const [bookingTherapist, setBookingTherapist] = useState(null);
  const [loadingConnection, setLoadingConnection] = useState(true);
  const [connectionData, setConnectionData] = useState(null);
  const [viewHistoryOnly, setViewHistoryOnly] = useState(false);
  const [showIntakeOverride, setShowIntakeOverride] = useState(false);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/therapy/connection');
      if (res.ok) {
        const data = await res.json();
        setConnectionData(data);
      } else {
        setConnectionData({ connectionStatus: 'no_therapist' });
      }
    } catch (err) {
      setConnectionData({ connectionStatus: 'no_therapist' });
    } finally {
      setLoadingConnection(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleStartBooking = (therapist = null) => {
    setBookingTherapist(therapist);
    setBookingFlowOpen(true);
  };

  const dashboard = () => {
    if (typeof window !== 'undefined' && window.navigateTo) window.navigateTo('/dashboard');
    else if (typeof window !== 'undefined') window.history.back();
  };

  if (loadingConnection) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F1EC', color: '#132A24' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #132A24', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#132A24', margin: 0 }}>Loading your therapy space...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const connectionStatus = connectionData?.connectionStatus || (connectionData?.connected ? 'connected' : 'no_therapist');

  // STATE C: Connected therapist -> Show Client Therapy Dashboard
  if (connectionStatus === 'connected' && !showIntakeOverride && !journey) {
    return (
      <ClientTherapyDashboard
        user={user}
        profile={profile}
        relationship={connectionData?.connection}
        therapist={connectionData?.therapist}
        onRefreshRelationship={checkConnection}
        onSignOut={onSignOut}
        onStartRematch={(targetJourney = 'guided') => {
          setShowIntakeOverride(true);
          if (targetJourney) {
            setJourney(targetJourney);
          }
        }}
        connectionStatus={connectionStatus}
        pendingRequest={connectionData?.pendingRequest}
        history={connectionData?.history}
      />
    );
  }

  // STATE D (View History Mode): Paused or Ended Client requests to inspect past records
  if (viewHistoryOnly && !journey) {
    const historicalRelationship = connectionData?.history?.[0] || connectionData?.connection;
    return (
      <ClientTherapyDashboard
        user={user}
        profile={profile}
        relationship={historicalRelationship}
        therapist={connectionData?.therapist}
        onRefreshRelationship={checkConnection}
        onSignOut={onSignOut}
        isPastRelationship={true}
        onStartRematch={() => {
          setViewHistoryOnly(false);
          setJourney('guided');
        }}
        onExitHistory={() => setViewHistoryOnly(false)}
        connectionStatus={connectionStatus}
        pendingRequest={connectionData?.pendingRequest}
        history={connectionData?.history}
      />
    );
  }

  return (
    <div className="iw">
      <style>{CSS}</style>

      {!journey && (
        <div className="iw-shell">
          <div className="iw-top">
            <button type="button" className="iw-back" onClick={dashboard}>
              <ArrowLeft size={15} /> Dashboard
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {showIntakeOverride && connectionStatus === 'connected' && (
                <button
                  type="button"
                  onClick={() => setShowIntakeOverride(false)}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#064E3B',
                    background: '#ECFDF5',
                    border: '1px solid #10B981',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  Return to Active Portal →
                </button>
              )}
              <span style={{ color: '#9fb0c2', fontSize: 13 }}>Therapy</span>
            </div>
          </div>

          {showIntakeOverride && connectionStatus === 'connected' && (
            <div
              className="iw-card"
              style={{
                marginBottom: 24,
                padding: '16px 20px',
                borderRadius: 12,
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong style={{ color: '#064e3b', display: 'block', fontSize: 15 }}>
                  Active Clinical Care Relationship
                </strong>
                <span style={{ color: '#047857', fontSize: 13 }}>
                  You are currently connected with {connectionData?.therapist?.displayName || connectionData?.therapist?.name || 'your designated therapist'}.
                </span>
              </div>
              <button
                type="button"
                className="iw-primary"
                style={{ backgroundColor: '#064e3b', fontSize: 13, padding: '8px 18px', margin: 0, width: 'auto' }}
                onClick={() => setShowIntakeOverride(false)}
              >
                Return to Care Dashboard
              </button>
            </div>
          )}
          {connectionStatus === 'pending' && (() => {
            const req = connectionData?.pendingRequest;
            const concerns = req?.concerns || [];
            return (
              <div
                className="iw-card"
                style={{
                  marginBottom: 32,
                  padding: 28,
                  borderRadius: 16,
                  backgroundColor: '#ffffff',
                  border: '1.5px solid rgba(38,50,56,0.15)',
                  boxShadow: '0 4px 20px rgba(19, 42, 36, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, backgroundColor: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <Clock size={13} /> Matching in Progress
                  </div>
                  <span style={{ fontSize: 12, color: '#66747A' }}>
                    Request active · No re-submission needed
                  </span>
                </div>

                <h2 style={{ fontSize: 24, margin: '0 0 10px', color: '#132A24' }}>
                  Your Care Preferences are Being Matched
                </h2>
                <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.6, maxWidth: 680, margin: '0 0 20px' }}>
                  Our clinical care coordinator is reviewing your intake to match you with a vetted, licensed practitioner aligned with your presenting concerns, clinical modalities, and preferred schedule.
                </p>

                {concerns.length > 0 && (
                  <div style={{ marginBottom: 20, padding: '12px 16px', background: '#F4F1EC', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7B6A72', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Submitted Presenting Concerns
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {concerns.map((c, i) => (
                        <span key={i} style={{ fontSize: 12, padding: '3px 9px', background: '#ffffff', borderRadius: 6, border: '1px solid rgba(38,50,56,0.1)', color: '#263238', fontWeight: 500 }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                  <div style={{ padding: 14, background: '#FAFAF9', borderRadius: 10, border: '1px solid rgba(38,50,56,0.06)' }}>
                    <strong style={{ display: 'block', fontSize: 13, color: '#132A24', marginBottom: 4 }}>1. Clinical Review</strong>
                    <span style={{ fontSize: 12, color: '#66747A' }}>Our care coordinator verifies licensure and therapeutic specialization.</span>
                  </div>
                  <div style={{ padding: 14, background: '#FAFAF9', borderRadius: 10, border: '1px solid rgba(38,50,56,0.06)' }}>
                    <strong style={{ display: 'block', fontSize: 13, color: '#132A24', marginBottom: 4 }}>2. Availability Check</strong>
                    <span style={{ fontSize: 12, color: '#66747A' }}>Real-time Google Calendar openings are verified for immediate booking.</span>
                  </div>
                  <div style={{ padding: 14, background: '#FAFAF9', borderRadius: 10, border: '1px solid rgba(38,50,56,0.06)' }}>
                    <strong style={{ display: 'block', fontSize: 13, color: '#132A24', marginBottom: 4 }}>3. Portal Activation</strong>
                    <span style={{ fontSize: 12, color: '#66747A' }}>You receive an email and this page updates directly to your active care portal.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="iw-primary"
                    style={{ width: 'auto', padding: '10px 20px', fontSize: 13 }}
                    onClick={() => setJourney('team')}
                  >
                    Speak with Care Coordinator
                  </button>
                  <button
                    type="button"
                    className="iw-secondary"
                    style={{ width: 'auto', padding: '10px 18px', fontSize: 13 }}
                    onClick={() => {
                      if (window.confirm('Do you want to start a fresh intake? This will replace your previous intake answers.')) {
                        setJourney('guided');
                      }
                    }}
                  >
                    Update Intake Preferences
                  </button>
                  <button
                    type="button"
                    className="iw-secondary"
                    style={{ width: 'auto', padding: '10px 18px', fontSize: 13 }}
                    onClick={dashboard}
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            );
          })()}

          {/* STATE D: Paused, Ended, Declined, or Transferred Relationship Notice */}
          {['paused', 'ended', 'transferred'].includes(connectionStatus) && (() => {
            const pastClinician = connectionData?.therapist;
            const pastClinicianName = pastClinician?.displayName || pastClinician?.name || pastClinician?.full_name || 'your previous therapist';
            const statusLabel = connectionStatus === 'paused' ? 'Paused' : connectionStatus === 'transferred' ? 'Transferred' : 'Concluded';

            return (
              <div
                className="iw-card"
                style={{
                  marginBottom: 28,
                  padding: '20px 24px',
                  borderRadius: 14,
                  backgroundColor: '#FFFBEB',
                  border: '1.5px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 18,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 999, backgroundColor: '#FEF3C7', color: '#B45309', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    <Info size={12} /> Care Relationship {statusLabel}
                  </div>
                  <strong style={{ color: '#92400E', display: 'block', fontSize: 15 }}>
                    Care with {pastClinicianName} has ended or is paused.
                  </strong>
                  <span style={{ color: '#B45309', fontSize: 13 }}>
                    Your session notes, assignments, and billing history are preserved in your account records.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    className="iw-secondary"
                    style={{ fontSize: 13, padding: '8px 16px', margin: 0, backgroundColor: '#ffffff' }}
                    onClick={() => setViewHistoryOnly(true)}
                  >
                    View Past Care History
                  </button>
                  <button
                    type="button"
                    className="iw-primary"
                    style={{ backgroundColor: '#B45309', borderColor: '#B45309', fontSize: 13, padding: '8px 16px', margin: 0 }}
                    onClick={() => setJourney('guided')}
                  >
                    Find a New Therapist
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Intake Landing Page: 2 Paths (Guided Form & Speak with Team) */}
          <div className="iw-intake-wrap">
            <p className="iw-intake-eyebrow">Support, at your pace</p>
            <h1 className="iw-intake-title">Let’s find the right therapist for you.</h1>
            <p className="iw-intake-intro">
              Some people prefer to choose from simple options, some prefer to talk it through. Both work equally well.
            </p>

            <section className="iw-intake-cards" aria-label="Ways to get started">
              <article className="iw-intake-card">
                <div className="iw-intake-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="4" width="14" height="17" rx="3" />
                    <path d="M9 4.5h6v2H9z" />
                    <path d="M9 11h.01M9 15h.01M12.5 11H16M12.5 15H16" />
                  </svg>
                </div>
                <p className="iw-intake-label">Fill it in yourself</p>
                <h2 className="iw-intake-h2">Choose from simple options</h2>
                <p className="iw-intake-text">
                  Mostly pick-the-option questions, with just 2 or 3 places to write in your own words.
                </p>
                <div className="iw-intake-meta">
                  <span>About 10 minutes</span>
                  <span>At your own time</span>
                </div>
                <button
                  type="button"
                  className="iw-intake-btn"
                  onClick={() => setJourney('guided')}
                >
                  Start the form
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </article>

              <article className="iw-intake-card">
                <div className="iw-intake-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="8" r="3.2" />
                    <path d="M3.5 19c.4-3.2 2.7-5 5.5-5s5.1 1.8 5.5 5" />
                    <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.5 14.3c1.9.6 3.1 2.2 3.5 4.7" />
                  </svg>
                </div>
                <p className="iw-intake-label">Talk to someone</p>
                <h2 className="iw-intake-h2">Prefer to speak with a person?</h2>
                <p className="iw-intake-text">
                  Leave your number and our team will call you at a time that suits you. A semi-structured conversation with our team, so we can understand you before we match you.
                </p>
                <div className="iw-intake-meta">
                  <span>15 to 20 minutes</span>
                  <span>Call within 1 working day</span>
                </div>
                <button
                  type="button"
                  className="iw-intake-btn"
                  onClick={() => setJourney('team')}
                >
                  Request a call
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </article>
            </section>

            <div className="iw-intake-equal">
              <p>
                <strong>Matched by our algorithm, either way.</strong> Built with experienced psychologists, it finds your match from your form answers. If you speak to us, a psychologist from our team gets to know you first, and the same algorithm does the matching.
              </p>
            </div>

            <p className="iw-intake-fine">
              Confidential. Sessions are on Google Meet and added to your Google Calendar.
            </p>
          </div>
        </div>
      )}

      {journey === 'conversation' && (
        <ConversationalIntake
          exit={() => { setJourney(null); checkConnection(); }}
          user={user}
          profile={profile}
          onStartBooking={handleStartBooking}
        />
      )}
      {journey === 'guided' && <Guided exit={() => { setJourney(null); checkConnection(); }} onBookSession={handleStartBooking} user={user} profile={profile} />}
      {journey === 'team' && <Team exit={() => { setJourney(null); checkConnection(); }} user={user} profile={profile} />}

      <TherapyBookingFlow
        isOpen={bookingFlowOpen}
        onClose={() => { setBookingFlowOpen(false); checkConnection(); }}
        initialTherapist={bookingTherapist}
        user={user}
      />
    </div>
  );
}
