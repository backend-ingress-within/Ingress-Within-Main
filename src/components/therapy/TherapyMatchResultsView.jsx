import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Phone,
  Send,
  ArrowRight,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

/* Plain-language descriptions so clients never need to guess clinical acronyms */
const MODALITY_BLURB = {
  'CBT': 'CBT focuses on changing unhelpful thought and habit patterns.',
  'Acceptance & Commitment Therapy': 'ACT helps you act on what matters to you, even when thoughts and feelings are uncomfortable.',
  'Psychodynamic': 'Psychodynamic work explores how past experiences shape present patterns.',
  'Existential': 'Existential therapy explores meaning, choice and direction.',
  'Somatic': 'Somatic work looks at how stress shows up in the body.',
  'Attachment-focused': 'Attachment-focused work looks at how early relationships shape the way you connect now.',
  'Emotionally Focused Therapy': 'Emotionally focused therapy works on emotional patterns in close relationships.',
  'Family Systems': 'Family systems work looks at patterns within family relationships.',
  'Interpersonal/Relational': 'Interpersonal therapy works on patterns in your relationships.',
  'Spiritually-integrated': 'Spiritually integrated therapy brings your beliefs into the work, if you want that.',
};

const COUNT_WORD = ['', 'A therapist', 'Two therapists', 'Three therapists'];

function cap(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lc(s) {
  if (!s) return '';
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function joinList(arr) {
  if (!arr || !arr.length) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;
}

function rupees(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function initials(name) {
  if (!name) return 'TH';
  return name
    .replace(/^Dr\.\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function shortName(name) {
  if (!name) return 'Therapist';
  if (/^Dr\.\s/i.test(name)) return 'Dr. ' + name.split(/\s+/).pop();
  return name.split(/\s+/)[0];
}

function fitLabel(score) {
  if (score >= 85) return 'Strong fit';
  if (score >= 65) return 'Good fit';
  return 'Partial fit';
}

const OPENERS = [
  (t, matched, expClause) =>
    `You won’t need to start from scratch explaining ${joinList(matched.map(lc))} with ${t.name} — it’s part of what they specifically focus on${expClause}.`,
  (t, matched, expClause) =>
    `We matched you with ${t.name} partly because ${joinList(matched.map(lc))} is something they specifically work with${expClause} — so that part of your story won’t be new to them.`,
  (t, matched, expClause) =>
    (t.experienceYears ? `${cap(String(t.experienceYears))} years in, ` : 'Over their time practicing, ') +
    `${t.name} has built real familiarity with ${joinList(matched.map(lc))}, so that’s not new ground for them either.`,
];

const PACE_OPENERS = [
  (t, styleText) =>
    `You said ${lc(styleText)} feels right to you — that’s genuinely how they say they run things, so you shouldn’t have to ask them to slow down or speed up to meet you.`,
  (t, styleText) =>
    `The pace matters too: ${lc(styleText)} is what you said works for you, and it’s how ${t.name} describes their own sessions, not a stretch to get there.`,
];

const DIM_LABEL = {
  concern: 'how closely your concerns overlap',
  modality: 'how you like to work',
  budget: 'budget',
  gender: 'gender preference',
};

const DIM_RANK = { match: 2, partial: 1, not_stated: 1, not_matched: 0 };

export default function TherapyMatchResultsView({
  matchData,
  clientAnswers,
  onRequestTherapist,
  onTalkToTeam,
  onEditAnswers,
  showNumericScore = false,
}) {
  const [openWhy, setOpenWhy] = useState({});
  const [openMore, setOpenMore] = useState({});
  const [requestStatus, setRequestStatus] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  if (!matchData) {
    return (
      <div className="empty-results-box p-8 text-center text-[#4E635E]">
        <p>No matching session found.</p>
      </div>
    );
  }

  const {
    tier = 'standard',
    safetyMessage,
    needsTeamOutreach,
    guaranteedHandoff,
    relaxed,
    relaxLabel,
    slaHours,
    matches = [],
  } = matchData;

  const a = clientAnswers || {};
  const structure = a.stylestructure === 'Open' ? 'Open-ended' : 'Structured';
  const term = a.termapproach === 'LongTerm' ? 'long-term' : 'short-term';
  const ctx = {
    concerns: Array.isArray(a.concerns) ? a.concerns : [],
    styleText: `${structure}, ${term} sessions`,
    languages: Array.isArray(a.clientlanguage)
      ? a.clientlanguage
      : Array.isArray(a.languages)
      ? a.languages
      : ['English'],
    budgetBand: a.budget || '',
    genderPref:
      a.therapistgender && a.therapistgender !== 'No preference'
        ? a.therapistgender
        : a.therapistGender && a.therapistGender !== 'No preference'
        ? a.therapistGender
        : null,
  };

  const handleRequest = async (therapist) => {
    if (submittingId) return;
    setSubmittingId(therapist.id);
    try {
      if (onRequestTherapist) {
        await onRequestTherapist(therapist);
      } else {
        const res = await fetch('/api/match/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            therapistId: therapist.id,
            answers: clientAnswers,
          }),
        });
        if (!res.ok) throw new Error();
      }

      setRequestStatus((prev) => ({
        ...prev,
        [therapist.id]: `We’ve recorded your interest in ${shortName(
          therapist.name
        )}. Our team will confirm with them and follow up with you to schedule.`,
      }));
    } catch {
      setRequestStatus((prev) => ({
        ...prev,
        [therapist.id]: 'That didn’t go through. Please try again in a moment.',
      }));
    } finally {
      setSubmittingId(null);
    }
  };

  const n = matches.length;

  return (
    <div className="therapy-match-results w-full max-w-[780px] mx-auto text-[#0F2F2B] font-sans antialiased text-[16px] leading-[1.55]">
      {/* 1. SAFETY BLOCK */}
      {safetyMessage?.show && (
        <section
          className={`mb-6 p-6 rounded-2xl border transition-all ${
            tier === 'immediate'
              ? 'bg-[#FBEFEA] border-[#E3B3A2] text-[#8A3320]'
              : 'bg-[#FFF8EA] border-[#EAD8B8] text-[#6B4A0B]'
          }`}
          aria-labelledby="safety-title"
        >
          <div className="flex items-start gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
            <h2
              id="safety-title"
              className="font-serif text-2xl font-semibold leading-snug"
            >
              {safetyMessage.headline}
            </h2>
          </div>
          <p className="text-[15px] mb-4 text-[#4E635E] leading-relaxed">
            {safetyMessage.body}
          </p>
          <div className="space-y-2.5">
            {(safetyMessage.resources || []).map((r, i) => (
              <div
                key={i}
                className="bg-white/90 backdrop-blur-sm border border-[#E3B3A2]/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="font-semibold text-[15px] text-[#0F2F2B]">
                    {r.name}
                  </div>
                  <div className="text-[13px] text-[#4E635E]">{r.note}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(r.contact || '').split(' or ').map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B5E52] hover:bg-[#144A41] text-white font-bold text-[15px] no-underline shadow-xs transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {num.trim()}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. TEAM NOTIFICATION NOTICE */}
      {needsTeamOutreach && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#D5DFDA] text-[#4E635E] text-[14.5px]">
          <Info className="w-5 h-5 text-[#1B5E52] shrink-0 mt-0.5" />
          <span>
            Our clinical team has also been told about your situation and will
            reach out to you directly. A match here doesn’t replace that personal
            outreach.
          </span>
        </div>
      )}

      {/* 3. HERO & MATCH CONTENT */}
      {n > 0 ? (
        <>
          <header className="mb-6">
            <h1 className="font-serif text-[clamp(28px,5.5vw,42px)] font-normal text-[#0F2F2B] leading-tight tracking-tight mb-2">
              {relaxed
                ? `${COUNT_WORD[n] || n + ' therapists'} who partly fit what you told us`
                : `${COUNT_WORD[n] || n + ' therapists'} who fit what you told us`}
            </h1>
            <p className="text-[#4E635E] text-[16.5px] max-w-[48ch]">
              {n === 1
                ? 'Chosen from your answers. They offer online sessions and are taking new clients.'
                : 'Chosen from your answers. All of them offer online sessions and are taking new clients.'}
            </p>
          </header>

          {/* Stepper overview */}
          <ol
            className="flex flex-wrap gap-3 sm:gap-6 list-none p-0 mb-7 text-[14px] text-[#4E635E]"
            aria-label="What happens next"
          >
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DDE9E2] text-[#144A41] font-bold text-[11px] grid place-items-center">
                1
              </span>
              <span>You request a therapist</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DDE9E2] text-[#144A41] font-bold text-[11px] grid place-items-center">
                2
              </span>
              <span>They confirm</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#DDE9E2] text-[#144A41] font-bold text-[11px] grid place-items-center">
                3
              </span>
              <span>You book your first session</span>
            </li>
          </ol>

          {/* Widened Search Note */}
          {relaxed && relaxLabel && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-[#FBEBC8] text-[#6B4A0B] text-[14.5px]">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                We widened the search a little to make sure you had options,{' '}
                {relaxLabel}.
              </span>
            </div>
          )}

          {/* MATCH CARDS */}
          <div className="space-y-4">
            {matches.map((match, index) => {
              const t = match.therapist;
              const isBest = index === 0 && n > 1;
              const label = isBest
                ? relaxed
                  ? 'Closest match'
                  : 'Best match'
                : fitLabel(match.score);
              const scoreText = showNumericScore ? ` ${match.score}%` : '';

              const matchedConcerns = match.why?.concerns || [];
              const missedConcerns = ctx.concerns.filter(
                (c) => !matchedConcerns.includes(c)
              );
              const withinBudget = match.why?.withinBudget;
              const genderStatus = match.why?.dimensionStatus?.gender || 'not_stated';
              const sharedLang = ctx.languages.filter((l) =>
                t.languages.includes(l)
              );
              const missingLang = ctx.languages.filter(
                (l) => !t.languages.includes(l)
              );

              // Narrative summary sentence construction
              const sentences = [];
              if (matchedConcerns.length) {
                const expClause = t.experienceYears
                  ? `, across ${t.experienceYears} years of practice`
                  : '';
                sentences.push(
                  cap(
                    OPENERS[index % OPENERS.length](t, matchedConcerns, expClause)
                  )
                );
              }

              if (ctx.styleText) {
                sentences.push(
                  cap(PACE_OPENERS[index % PACE_OPENERS.length](t, ctx.styleText))
                );
              }

              const practical = [];
              if (!missingLang.length)
                practical.push(
                  `talk to them in ${joinList(ctx.languages)} without translating yourself in your head first`
                );
              if (withinBudget === true)
                practical.push(
                  `settle in without the fee becoming a separate decision every session`
                );
              if (practical.length)
                sentences.push(
                  cap(`That leaves you free to ${joinList(practical)}.`)
                );

              // Caveats: transparent disclosures
              const caveatMap = {};
              if (withinBudget === false)
                caveatMap.budget = 'their fee is above what you budgeted';
              if (ctx.genderPref && genderStatus === 'not_matched')
                caveatMap.gender = `they haven't listed ${lc(
                  ctx.genderPref
                )} as their gender`;
              if (missedConcerns.length)
                caveatMap.concern = `${cap(joinList(missedConcerns.map(lc)))}${
                  missedConcerns.length > 1 ? " aren't" : " isn't"
                } an area they specialise in`;
              if (missingLang.length && sharedLang.length)
                caveatMap.language = `they don't list ${joinList(
                  missingLang
                )}, though you share ${joinList(sharedLang)}`;
              else if (missingLang.length)
                caveatMap.language = "they don't list any of the languages you speak";

              const caveatOrder = ['budget', 'gender', 'concern', 'language'];
              const presentCaveats = caveatOrder.filter((k) => caveatMap[k]);
              if (presentCaveats.length) {
                let line = `The one thing to flag: ${caveatMap[presentCaveats[0]]}.`;
                if (presentCaveats.length > 1) {
                  line += ` Also, ${cap(
                    joinList(presentCaveats.slice(1).map((k) => caveatMap[k]))
                  )}.`;
                }
                if (
                  n > 1 &&
                  (presentCaveats[0] === 'budget' ||
                    presentCaveats[0] === 'gender')
                ) {
                  line += ` If that matters to you, it’s worth looking at the other ${
                    n - 1
                  } ${n - 1 === 1 ? 'option' : 'options'} below too.`;
                }
                sentences.push(line);
              }

              // Comparative clause for cards #2 & #3
              let comparativeText = '';
              if (index > 0 && matches[0]) {
                const topMatch = matches[0];
                const dsHere = match.why?.dimensionStatus || {};
                const dsTop = topMatch.why?.dimensionStatus || {};
                const gaps = Object.keys(DIM_LABEL).filter(
                  (k) => (DIM_RANK[dsTop[k]] || 0) > (DIM_RANK[dsHere[k]] || 0)
                );
                const compLine = gaps.length
                  ? `the difference comes down to ${joinList(
                      gaps.map((k) => DIM_LABEL[k])
                    )} — ${topMatch.therapist.name} lines up slightly closer there.`
                  : `both line up closely on paper — this one is still a strong match in its own right.`;
                comparativeText = `Compared with ${topMatch.therapist.name}, ${compLine}`;
              }

              // Dimension chips
              const ds = match.why?.dimensionStatus || {};
              const dimItems = [
                ['Concerns', ds.concern],
                ['Approach', ds.modality],
                ['Budget', ds.budget],
              ];
              if (ctx.genderPref) {
                dimItems.push(['Therapist gender', ds.gender]);
              }

              const whyOpen = openWhy[t.id] ?? index === 0;
              const moreOpen = openMore[t.id] ?? false;

              return (
                <article
                  key={t.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 transition-all ${
                    isBest
                      ? 'border-2 border-[#1B5E52] shadow-sm'
                      : 'border border-[#D5DFDA] shadow-xs'
                  }`}
                  data-therapist-id={t.id}
                >
                  {/* Card Head */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`shrink-0 rounded-full bg-[#DDE9E2] text-[#144A41] font-semibold grid place-items-center ${
                        isBest
                          ? 'w-14 h-14 text-xl'
                          : 'w-12 h-12 text-base'
                      }`}
                      aria-hidden="true"
                    >
                      {initials(t.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-serif font-semibold leading-tight text-[#0F2F2B] truncate ${
                          isBest ? 'text-2xl sm:text-[26px]' : 'text-xl'
                        }`}
                      >
                        {t.name}
                      </h3>
                      <p className="text-[14.5px] text-[#4E635E] truncate mt-0.5">
                        {t.credentials}
                      </p>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <ul className="flex flex-wrap gap-1.5 list-none p-0 mt-3 mb-0">
                    <li className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#144A41] bg-[#DDE9E2] px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </li>
                    {t.traumaVerified && (
                      <li className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#144A41] bg-[#DDE9E2] px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Trauma-informed care, verified</span>
                      </li>
                    )}
                    {t.backgroundCheckCleared && (
                      <li className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#144A41] bg-[#DDE9E2] px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Background check cleared</span>
                      </li>
                    )}
                  </ul>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[13px]">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold ${
                        isBest
                          ? 'bg-[#FBEBC8] text-[#6B4A0B]'
                          : 'bg-[#DDE9E2] text-[#144A41]'
                      }`}
                    >
                      {label}
                      {scoreText}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3F6F4] border border-[#D5DFDA] text-[#4E635E]">
                      {t.experienceYears} years of experience
                    </span>
                  </div>

                  {/* Dimension Summary Chips */}
                  <ul className="flex flex-wrap gap-1.5 list-none p-0 mt-3 mb-0">
                    {dimItems.map(([dLabel, val]) => {
                      if (!val || val === 'not_stated') return null;
                      const isOk = val === 'match';
                      const isPart = val === 'partial';
                      const isWarn = val === 'not_matched';

                      return (
                        <li
                          key={dLabel}
                          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isOk
                              ? 'bg-[#DDE9E2] text-[#144A41]'
                              : isPart
                              ? 'bg-[#FBEBC8] text-[#6B4A0B]'
                              : 'bg-[#FBEFEA] border border-[#E3B3A2] text-[#8A3320]'
                          }`}
                        >
                          {isOk && <CheckCircle2 className="w-3 h-3" />}
                          {isPart && <Info className="w-3 h-3" />}
                          {isWarn && <AlertTriangle className="w-3 h-3" />}
                          <span>{dLabel}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Accordion / Content Area */}
                  {index === 0 ? (
                    <div className="mt-4 pt-4 border-t border-[#D5DFDA]">
                      {sentences.length > 0 && (
                        <p className="text-[15px] text-[#0F2F2B] leading-relaxed mb-4">
                          {sentences.join(' ')}
                        </p>
                      )}

                      {/* Ledger rows */}
                      <div className="ledger-box border-t border-[#D5DFDA] pt-3 divide-y divide-[#D5DFDA] text-[14.5px]">
                        {/* Concerns row */}
                        {matchedConcerns.length > 0 && (
                          <div className="py-2.5 flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 text-[#1B5E52]">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                            <div className="w-1/3 min-w-[120px] text-[#4E635E]">
                              Concerns
                              <div className="text-[#0F2F2B] font-medium">
                                {joinList(ctx.concerns)}
                              </div>
                            </div>
                            <div className="flex-1 font-semibold text-[#0F2F2B]">
                              Works with {joinList(matchedConcerns)}
                            </div>
                          </div>
                        )}

                        {/* Modalities row */}
                        {(match.why?.modalities || []).length > 0 && (
                          <div className="py-2.5 flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 text-[#1B5E52]">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                            <div className="w-1/3 min-w-[120px] text-[#4E635E]">
                              Style
                              <div className="text-[#0F2F2B] font-medium">
                                {ctx.styleText}
                              </div>
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-[#0F2F2B]">
                                {joinList((match.why.modalities || []).slice(0, 2))}
                              </span>
                              {MODALITY_BLURB[match.why.modalities[0]] && (
                                <div className="text-[13px] font-normal text-[#4E635E] mt-0.5">
                                  {MODALITY_BLURB[match.why.modalities[0]]}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Language row */}
                        <div className="py-2.5 flex items-start gap-3">
                          <span
                            className={`shrink-0 mt-0.5 ${
                              missingLang.length
                                ? sharedLang.length
                                  ? 'text-[#6B4A0B]'
                                  : 'text-[#8A3320]'
                                : 'text-[#1B5E52]'
                            }`}
                          >
                            {missingLang.length ? (
                              <Info className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </span>
                          <div className="w-1/3 min-w-[120px] text-[#4E635E]">
                            Language
                            <div className="text-[#0F2F2B] font-medium">
                              {joinList(ctx.languages)}
                            </div>
                          </div>
                          <div className="flex-1 font-semibold text-[#0F2F2B]">
                            {!missingLang.length
                              ? `Sessions in ${joinList(t.languages)}`
                              : sharedLang.length
                              ? `Speaks ${joinList(sharedLang)}. Doesn't list ${joinList(
                                  missingLang
                                )}.`
                              : `Speaks ${joinList(t.languages)}`}
                          </div>
                        </div>

                        {/* Budget row */}
                        <div className="py-2.5 flex items-start gap-3">
                          <span
                            className={`shrink-0 mt-0.5 ${
                              withinBudget === false
                                ? 'text-[#8A3320]'
                                : 'text-[#1B5E52]'
                            }`}
                          >
                            {withinBudget === false ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </span>
                          <div className="w-1/3 min-w-[120px] text-[#4E635E]">
                            Budget
                            <div className="text-[#0F2F2B] font-medium">
                              {ctx.budgetBand
                                ? `${ctx.budgetBand} per session`
                                : 'Not specified'}
                            </div>
                          </div>
                          <div
                            className={`flex-1 font-semibold ${
                              withinBudget === false
                                ? 'text-[#8A3320]'
                                : 'text-[#0F2F2B]'
                            }`}
                          >
                            {rupees(t.fee)} per session
                            {withinBudget === false && (
                              <span className="font-normal text-[13px] ml-1">
                                (above your stated budget)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Gender row if stated */}
                        {ctx.genderPref && (
                          <div className="py-2.5 flex items-start gap-3">
                            <span
                              className={`shrink-0 mt-0.5 ${
                                genderStatus === 'match'
                                  ? 'text-[#1B5E52]'
                                  : 'text-[#8A3320]'
                              }`}
                            >
                              {genderStatus === 'match' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Info className="w-4 h-4" />
                              )}
                            </span>
                            <div className="w-1/3 min-w-[120px] text-[#4E635E]">
                              Gender
                              <div className="text-[#0F2F2B] font-medium">
                                {ctx.genderPref} preferred
                              </div>
                            </div>
                            <div className="flex-1 font-semibold text-[#0F2F2B]">
                              {t.gender || 'Not specified'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      {t.bio && (
                        <p className="font-serif text-[17px] leading-relaxed text-[#0F2F2B] mt-4 pt-3 border-t border-[#D5DFDA]">
                          {t.bio}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-[#D5DFDA]">
                      {comparativeText && (
                        <p className="text-[14px] text-[#4E635E] mb-3 italic">
                          {comparativeText}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenWhy((prev) => ({
                            ...prev,
                            [t.id]: !prev[t.id],
                          }))
                        }
                        className="flex items-center gap-2 text-[14.5px] font-semibold text-[#144A41] hover:underline cursor-pointer py-1"
                      >
                        <span>Why this fits you</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            whyOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {whyOpen && (
                        <div className="mt-3 pt-3 border-t border-[#D5DFDA] text-[14.5px]">
                          {sentences.length > 0 && (
                            <p className="text-[14.5px] text-[#0F2F2B] leading-relaxed mb-3">
                              {sentences.join(' ')}
                            </p>
                          )}
                          {t.bio && (
                            <p className="font-serif text-[16px] text-[#0F2F2B] leading-relaxed mb-3">
                              {t.bio}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* "More about <Therapist>" Disclosure */}
                  <div className="mt-3 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMore((prev) => ({
                          ...prev,
                          [t.id]: !prev[t.id],
                        }))
                      }
                      className="flex items-center gap-1.5 text-[14px] font-semibold text-[#1B5E52] hover:underline cursor-pointer"
                    >
                      <span>More about {shortName(t.name)}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          moreOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {moreOpen && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-[#F8FAF9] border border-[#D5DFDA] text-[13.5px] space-y-2">
                        {t.specialties?.length > 0 && (
                          <div>
                            <strong>Focus areas:</strong> {joinList(t.specialties)}.
                          </div>
                        )}
                        {t.modalities?.length > 0 && (
                          <div>
                            <strong>Methods:</strong>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              {t.modalities.map((mod) => (
                                <li key={mod}>
                                  <strong>{mod}</strong>
                                  {MODALITY_BLURB[mod] ? ` — ${MODALITY_BLURB[mod]}` : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {t.gender && (
                          <div>
                            <strong>Gender:</strong> {t.gender}
                          </div>
                        )}
                        <div>
                          <strong>Session format:</strong> Online only (Telehealth via Google Meet).
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Request Button */}
                  <div className="mt-5 pt-4 border-t border-[#D5DFDA] flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={submittingId === t.id || Boolean(requestStatus[t.id])}
                      onClick={() => handleRequest(t)}
                      className="min-h-[46px] px-6 rounded-xl font-bold text-white bg-[#1B5E52] hover:bg-[#144A41] disabled:bg-[#DDE9E2] disabled:text-[#144A41] transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                      {requestStatus[t.id]
                        ? 'Request Recorded'
                        : submittingId === t.id
                        ? 'Recording...'
                        : `Request ${shortName(t.name)}`}
                    </button>
                  </div>

                  {/* Status update banner */}
                  {requestStatus[t.id] && (
                    <div
                      className="mt-3.5 p-3.5 rounded-xl bg-[#DDE9E2] text-[#144A41] text-[14.5px] font-medium leading-relaxed"
                      role="status"
                    >
                      {requestStatus[t.id]}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      ) : guaranteedHandoff ? (
        /* 4. GUARANTEED HUMAN HAND-OFF CARD */
        <section
          className="bg-white border border-[#D5DFDA] rounded-2xl p-7 text-[#0F2F2B] shadow-xs"
          aria-labelledby="handoff-title"
        >
          <h2
            id="handoff-title"
            className="font-serif text-3xl font-semibold leading-snug mb-3"
          >
            {tier !== 'standard'
              ? 'We’re finding you a therapist directly'
              : 'We’ll find someone for you personally'}
          </h2>
          {tier !== 'standard' ? (
            <p className="text-[#4E635E] text-[16px] leading-relaxed mb-4">
              Nobody currently cleared for this is available right now, so our
              clinical care team is sorting it out by hand rather than leaving you
              without an option.
            </p>
          ) : (
            <>
              <p className="text-[#4E635E] text-[16px] leading-relaxed mb-2">
                Nobody on our roster is a confident fit for everything you asked
                for, and we’d rather not show you a poor match.
              </p>
              <p className="text-[#4E635E] text-[16px] leading-relaxed mb-5">
                A member of our clinical team will look at what you shared and get
                in touch. You don’t need to do anything else.
              </p>
              {onEditAnswers && (
                <button
                  type="button"
                  onClick={onEditAnswers}
                  className="px-5 py-2.5 rounded-xl border border-[#1B5E52] text-[#1B5E52] hover:bg-[#DDE9E2] font-semibold text-[15px] cursor-pointer"
                >
                  Edit my answers
                </button>
              )}
            </>
          )}
        </section>
      ) : null}

      {/* 5. GOOD TO KNOW (Grounded facts, no invented policies) */}
      <div className="mt-8 bg-white border border-[#D5DFDA] rounded-xl p-5 text-[14.5px]">
        <h3 className="font-serif text-[17px] font-semibold text-[#0F2F2B] mb-2">
          Good to know
        </h3>
        <ul className="list-disc pl-5 text-[#4E635E] space-y-1.5 m-0">
          <li>All sessions are online only via secure video consultation.</li>
          <li>
            Every therapist shown here is a verified professional currently
            accepting new clients.
          </li>
          {tier === 'immediate' ? (
            <li>
              Because of what you shared, our clinical team is being notified
              right now, not queued.
            </li>
          ) : typeof slaHours === 'number' ? (
            <li>
              Our care team typically follows up within {slaHours} hours
              {tier === 'priority' ? ', since this was flagged as priority' : ''}.
            </li>
          ) : null}
        </ul>
      </div>

      {/* 6. FALLBACK FOOTER */}
      {n > 0 && tier !== 'immediate' && (
        <p className="mt-6 text-center text-[15px] text-[#4E635E]">
          None of these feel right?{' '}
          <button
            type="button"
            onClick={onTalkToTeam}
            className="font-semibold text-[#1B5E52] underline underline-offset-3 cursor-pointer bg-transparent border-0 p-0"
          >
            Talk to our care team
          </button>
        </p>
      )}
    </div>
  );
}
