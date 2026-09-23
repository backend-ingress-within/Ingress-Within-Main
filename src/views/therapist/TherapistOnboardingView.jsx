import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Shield,
  FileText,
  User,
  Award,
  Clock,
  Globe,
  DollarSign,
  AlertCircle,
  HelpCircle,
  LogOut,
  Upload
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Identity', icon: User, title: 'Basic Identity & Contact' },
  { id: 2, label: 'Professional', icon: FileText, title: 'Professional Overview & Bio' },
  { id: 3, label: 'Education', icon: Award, title: 'Qualifications & Degrees' },
  { id: 4, label: 'Registration', icon: Shield, title: 'Registration & RCI Details' },
  { id: 5, label: 'Experience', icon: Clock, title: 'Clinical Setting & Years' },
  { id: 6, label: 'Specialties', icon: Award, title: 'Areas of Practice' },
  { id: 7, label: 'Languages', icon: Globe, title: 'Languages for Therapy' },
  { id: 8, label: 'Formats', icon: DollarSign, title: 'Session Formats & Pricing' },
  { id: 9, label: 'Availability', icon: Clock, title: 'Practice Availability' },
  { id: 10, label: 'Documents', icon: Upload, title: 'Credentials & Verifications' },
  { id: 11, label: 'Declaration', icon: CheckCircle2, title: 'Ethics & Declaration' },
];

export default function TherapistOnboardingView({ initialData, onComplete, onLogout }) {
  const [currentStep, setCurrentStep] = useState(initialData?.application?.step || 1);
  const [answers, setAnswers] = useState(initialData?.application?.answers || {
    fullName: initialData?.profile?.full_name || '',
    email: '',
    phone: initialData?.account?.phone_number || '',
    city: 'Mumbai',
    state: 'Maharashtra',
    professionalTitle: 'Consultant Clinical Psychologist',
    bio: '',
    highestDegree: 'M.Phil / MSc Clinical Psychology',
    university: '',
    graduationYear: '2019',
    rciRegistered: false,
    rciNumber: '',
    registrationBody: 'Rehabilitation Council of India',
    experienceYears: 5,
    primaryModalities: ['Cognitive Behavioural Therapy (CBT)', 'Mindfulness-Based'],
    specializations: ['Anxiety Disorders', 'Depression', 'Workplace Stress & Burnout'],
    languages: ['English', 'Hindi'],
    sessionFormats: ['telehealth'],
    feePerSession: 1500,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlot: 'Morning & Evening',
    documentNotes: 'Degree and registration certificates ready for upload',
    ethicsDeclaration: false,
    truthfulnessConfirmed: false,
  });

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setErrorMessage('');
  };

  const toggleArrayItem = (key, item) => {
    const list = answers[key] || [];
    if (list.includes(item)) {
      updateAnswer(key, list.filter((i) => i !== item));
    } else {
      updateAnswer(key, [...list, item]);
    }
  };

  const handleSaveDraft = async (stepToSave = currentStep) => {
    setSaving(true);
    setSaveNotice('');
    setErrorMessage('');
    try {
      const res = await fetch('/api/therapist/onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: stepToSave,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save draft.');
      setSaveNotice('Progress saved.');
      setTimeout(() => setSaveNotice(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 11) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await handleSaveDraft(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitApplication = async () => {
    if (!answers.ethicsDeclaration || !answers.truthfulnessConfirmed) {
      setErrorMessage('Please accept the ethical declaration and confirm accuracy of information to proceed.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/therapist/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Submission failed.');
      if (onComplete) {
        onComplete(data);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#132A24] font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#132A24]/10 bg-white px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-mark-transparent.png" alt="Ingress Within" className="w-7 h-7 object-contain" />
            <div>
              <div className="font-serif text-base font-semibold leading-tight tracking-tight">
                ingress <span className="font-normal text-[#4E7A66]">within</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4E7A66]">
                Clinical Practitioner Onboarding
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {saveNotice && (
              <span className="text-[#4E7A66] font-medium animate-pulse">{saveNotice}</span>
            )}
            <button
              onClick={() => handleSaveDraft(currentStep)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#132A24]/15 bg-white text-[#132A24]/80 hover:bg-[#132A24]/5 transition-colors cursor-pointer"
            >
              <Save size={13} /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 text-[#132A24]/50 hover:text-[#132A24] cursor-pointer"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-6 py-10 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Step Indicator Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#132A24]/50 mb-3 ml-2">
            Step {currentStep} of 11
          </div>
          <div className="bg-white border border-[#132A24]/10 rounded-xl p-3 shadow-xs space-y-1">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isCurrent = s.id === currentStep;
              const isPast = s.id < currentStep;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-[#132A24] text-white shadow-xs'
                      : isPast
                      ? 'text-[#4E7A66] hover:bg-[#4E7A66]/10'
                      : 'text-[#132A24]/60 hover:bg-[#132A24]/5'
                  }`}
                >
                  <Icon size={14} className={isCurrent ? 'text-white' : isPast ? 'text-[#4E7A66]' : 'text-[#132A24]/40'} />
                  <span className="truncate">{s.label}</span>
                  {isPast && <CheckCircle2 size={12} className="ml-auto text-[#4E7A66]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body Area */}
        <div className="lg:col-span-3 bg-white border border-[#132A24]/10 rounded-2xl p-8 shadow-xs flex flex-col justify-between min-h-[520px]">
          
          <div>
            <div className="border-b border-[#132A24]/10 pb-4 mb-6">
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4E7A66]">
                Section {currentStep}
              </span>
              <h2 className="font-serif text-2xl text-[#132A24] mt-1 font-normal">
                {STEPS[currentStep - 1].title}
              </h2>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: IDENTITY */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Full Legal Name</label>
                    <input
                      type="text"
                      value={answers.fullName}
                      onChange={(e) => updateAnswer('fullName', e.target.value)}
                      placeholder="Dr. Anand Sharma"
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Professional Email</label>
                    <input
                      type="email"
                      value={answers.email}
                      onChange={(e) => updateAnswer('email', e.target.value)}
                      placeholder="anand@psychcare.in"
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Mobile Phone</label>
                    <input
                      type="text"
                      disabled
                      value={answers.phone}
                      className="w-full text-sm border border-[#132A24]/10 bg-[#132A24]/5 rounded-lg px-3.5 py-2.5 text-[#132A24]/60 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">City / Base Location</label>
                    <input
                      type="text"
                      value={answers.city}
                      onChange={(e) => updateAnswer('city', e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    value={answers.professionalTitle}
                    onChange={(e) => updateAnswer('professionalTitle', e.target.value)}
                    placeholder="Consultant Clinical Psychologist"
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Professional Bio & Clinical Philosophy</label>
                  <textarea
                    rows={4}
                    value={answers.bio}
                    onChange={(e) => updateAnswer('bio', e.target.value)}
                    placeholder="Describe your therapeutic style, clinical orientations, and focus areas..."
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                  <span className="text-[11px] text-[#132A24]/50">This overview will be shown on your shortlisted practitioner profile.</span>
                </div>
              </div>
            )}

            {/* STEP 3: EDUCATION */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Highest Degree in Psychology</label>
                    <input
                      type="text"
                      value={answers.highestDegree}
                      onChange={(e) => updateAnswer('highestDegree', e.target.value)}
                      placeholder="M.Phil Clinical Psychology"
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Graduation Year</label>
                    <input
                      type="number"
                      value={answers.graduationYear}
                      onChange={(e) => updateAnswer('graduationYear', e.target.value)}
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">University / Awarding Institution</label>
                  <input
                    type="text"
                    value={answers.university}
                    onChange={(e) => updateAnswer('university', e.target.value)}
                    placeholder="National Institute of Mental Health & Neuro Sciences (NIMHANS)"
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: REGISTRATION */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#132A24]/10 bg-[#FAFAF8]">
                  <input
                    type="checkbox"
                    id="rciRegistered"
                    checked={answers.rciRegistered}
                    onChange={(e) => updateAnswer('rciRegistered', e.target.checked)}
                    className="w-4 h-4 text-[#4E7A66] rounded-sm focus:ring-[#4E7A66]"
                  />
                  <label htmlFor="rciRegistered" className="text-xs text-[#132A24] cursor-pointer">
                    <span className="font-semibold block text-sm">RCI Registered Practitioner</span>
                    I hold active registration with the Rehabilitation Council of India.
                  </label>
                </div>

                {answers.rciRegistered && (
                  <div>
                    <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">RCI Registration Number (CRR No.)</label>
                    <input
                      type="text"
                      value={answers.rciNumber}
                      onChange={(e) => updateAnswer('rciNumber', e.target.value)}
                      placeholder="CRR/A-12345"
                      className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Professional Registration / Affiliation Body</label>
                  <input
                    type="text"
                    value={answers.registrationBody}
                    onChange={(e) => updateAnswer('registrationBody', e.target.value)}
                    placeholder="Indian Association of Clinical Psychologists (IACP)"
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: EXPERIENCE */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Post-Qualification Years of Practice</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={answers.experienceYears}
                    onChange={(e) => updateAnswer('experienceYears', Number(e.target.value))}
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-2">Primary Therapeutic Frameworks</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Cognitive Behavioural Therapy (CBT)',
                      'Acceptance & Commitment Therapy (ACT)',
                      'Psychodynamic & Relational',
                      'Somatic Experiencing',
                      'Emotionally Focused Therapy',
                      'Mindfulness-Based Cognitive Therapy',
                      'Family Systems Therapy',
                      'Existential Psychotherapy'
                    ].map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleArrayItem('primaryModalities', mod)}
                        className={`text-left p-2.5 rounded-lg border transition-all ${
                          (answers.primaryModalities || []).includes(mod)
                            ? 'bg-[#4E7A66]/10 border-[#4E7A66] text-[#132A24] font-medium'
                            : 'border-[#132A24]/15 text-[#132A24]/70 hover:bg-[#132A24]/5'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: SPECIALIZATIONS */}
            {currentStep === 6 && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#132A24]/70 mb-2">Select Your Clinical Practice Areas</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  {[
                    'Anxiety Disorders',
                    'Depression & Low Mood',
                    'Trauma & PTSD',
                    'Workplace Stress & Burnout',
                    'Relationship Friction',
                    'Family Conflict',
                    'Grief & Bereavement',
                    'Self-Esteem & Identity',
                    'Life Transitions',
                    'Emotional Regulation',
                    'Sleep Disruptions',
                    'Academic Pressure'
                  ].map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleArrayItem('specializations', spec)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        (answers.specializations || []).includes(spec)
                          ? 'bg-[#4E7A66]/10 border-[#4E7A66] text-[#132A24] font-medium shadow-2xs'
                          : 'border-[#132A24]/15 text-[#132A24]/70 hover:bg-[#132A24]/5'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 7: LANGUAGES */}
            {currentStep === 7 && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#132A24]/70 mb-2">Languages in which you provide psychotherapy</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  {['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Malayalam'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleArrayItem('languages', lang)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        (answers.languages || []).includes(lang)
                          ? 'bg-[#4E7A66]/10 border-[#4E7A66] text-[#132A24] font-medium shadow-2xs'
                          : 'border-[#132A24]/15 text-[#132A24]/70 hover:bg-[#132A24]/5'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 8: FORMATS */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-2">Offered Consultation Formats</label>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {[
                      { id: 'telehealth', label: 'Online Video Session' },
                      { id: 'audio', label: 'Audio Consultation' },
                      { id: 'in_person', label: 'In-Clinic In-Person' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => toggleArrayItem('sessionFormats', fmt.id)}
                        className={`text-center p-3 rounded-xl border transition-all ${
                          (answers.sessionFormats || []).includes(fmt.id)
                            ? 'bg-[#4E7A66]/10 border-[#4E7A66] text-[#132A24] font-medium'
                            : 'border-[#132A24]/15 text-[#132A24]/70 hover:bg-[#132A24]/5'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Standard 50-Min Session Fee (₹)</label>
                  <input
                    type="number"
                    value={answers.feePerSession}
                    onChange={(e) => updateAnswer('feePerSession', Number(e.target.value))}
                    placeholder="1500"
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                  <span className="text-[11px] text-[#132A24]/50">Includes clinical platform tools and patient note management.</span>
                </div>
              </div>
            )}

            {/* STEP 9: AVAILABILITY */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <label className="block text-xs font-medium text-[#132A24]/70 mb-1">Standard Practice Days</label>
                <div className="grid grid-cols-7 gap-2 text-xs">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleArrayItem('workingDays', day)}
                      className={`text-center py-2.5 rounded-lg border text-[11px] transition-all ${
                        (answers.workingDays || []).includes(day)
                          ? 'bg-[#132A24] text-white font-medium'
                          : 'border-[#132A24]/15 text-[#132A24]/70 hover:bg-[#132A24]/5'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Preferred Slot Window</label>
                  <input
                    type="text"
                    value={answers.timeSlot}
                    onChange={(e) => updateAnswer('timeSlot', e.target.value)}
                    placeholder="e.g. Weekday mornings 09:00 - 13:00, or Evenings 17:00 - 20:00"
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>
              </div>
            )}

            {/* STEP 10: DOCUMENTS */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-[#132A24]/20 bg-[#FAFAF8] text-center">
                  <Upload size={24} className="mx-auto text-[#4E7A66] mb-2" />
                  <p className="text-xs font-medium text-[#132A24]">Verification Documents Ready for Submission</p>
                  <p className="text-[11px] text-[#132A24]/50 mt-1">
                    Degree certificates, Master's transcript, and RCI license certificates.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#132A24]/70 mb-1.5">Document References / Notes</label>
                  <textarea
                    rows={3}
                    value={answers.documentNotes}
                    onChange={(e) => updateAnswer('documentNotes', e.target.value)}
                    placeholder="Notes regarding certificates or registration validity..."
                    className="w-full text-sm border border-[#132A24]/15 rounded-lg px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
                  />
                </div>
              </div>
            )}

            {/* STEP 11: DECLARATION */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#132A24]/10 bg-[#FAFAF8] text-xs text-[#132A24]/80 space-y-3">
                  <h4 className="font-semibold text-sm text-[#132A24]">Clinical Ethics & Standards of Practice</h4>
                  <p>
                    By applying to the Ingress Within Practitioner Network, I declare that I possess recognized clinical qualifications in mental health, abide by patient confidentiality, and operate within the ethical guidelines established by national psychological associations.
                  </p>
                  <p>
                    I understand that all applications undergo clinical review before practice authorization (can_practice) is granted.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ethicsDeclaration"
                      checked={answers.ethicsDeclaration}
                      onChange={(e) => updateAnswer('ethicsDeclaration', e.target.checked)}
                      className="w-4 h-4 text-[#4E7A66] rounded-sm focus:ring-[#4E7A66]"
                    />
                    <label htmlFor="ethicsDeclaration" className="text-xs text-[#132A24] cursor-pointer">
                      I agree to the Ingress Within Clinical Code of Ethics and Privacy Charter.
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="truthfulnessConfirmed"
                      checked={answers.truthfulnessConfirmed}
                      onChange={(e) => updateAnswer('truthfulnessConfirmed', e.target.checked)}
                      className="w-4 h-4 text-[#4E7A66] rounded-sm focus:ring-[#4E7A66]"
                    />
                    <label htmlFor="truthfulnessConfirmed" className="text-xs text-[#132A24] cursor-pointer">
                      I confirm that all degrees, registration numbers, and clinical details provided are accurate.
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Navigation Buttons */}
          <div className="border-t border-[#132A24]/10 pt-6 mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#132A24]/15 text-xs font-medium text-[#132A24]/70 hover:bg-[#132A24]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {currentStep < 11 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 transition-all cursor-pointer shadow-xs"
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4E7A66] text-white text-xs font-semibold hover:bg-[#4E7A66]/90 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application for Review'}
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
