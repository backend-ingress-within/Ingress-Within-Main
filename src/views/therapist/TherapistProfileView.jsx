import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Save,
  Award,
  Globe,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Lock,
  Camera,
  Trash2,
  Clock,
  Calendar,
  Bell,
  Laptop,
  Smartphone,
  LogOut,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  X,
  Building,
  MapPin,
  Mail,
  Phone,
  Info,
  Check,
  AlertTriangle,
  FileText,
  Sliders,
  Sparkles,
  Plus,
  CreditCard,
} from 'lucide-react';
import TherapistCalendarIntegrationCard from '../../components/therapist/TherapistCalendarIntegrationCard';

const TIMEZONE_OPTIONS = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'UTC',
];

const CLINICAL_FOCUS_CONCERNS = [
  'Anxiety',
  'Low mood',
  'Depression & Mood Disorders',
  'Overthinking',
  'Trauma / PTSD',
  'Burnout',
  'Workplace stress',
  'Relationship issues',
  'Emotional overwhelm',
  'Sleep problems',
  'Self-confidence',
  'Family issues',
  'Identity',
  'Loneliness',
  'Grief & Bereavement',
  'Anger',
  'ADHD & Neurodivergence',
];

const CLINICAL_MODALITIES = [
  'Cognitive Behavioral Therapy (CBT)',
  'Acceptance & Commitment Therapy (ACT)',
  'Trauma-Informed Care',
  'Somatic Grounding',
  'Mindfulness & Stress Management',
  'Relationship & Family Therapy',
  'Psychodynamic Therapy',
  'Emotionally Focused Therapy (EFT)',
  'Dialectical Behavior Therapy (DBT)',
  'Person-Centered Therapy',
];

const PREDEFINED_SPECIALTIES = Array.from(new Set([...CLINICAL_FOCUS_CONCERNS, ...CLINICAL_MODALITIES]));

const PREDEFINED_LANGUAGES = [
  'English',
  'Hindi',
  'Bengali',
  'Marathi',
  'Telugu',
  'Tamil',
  'Gujarati',
  'Kannada',
  'Malayalam',
  'Punjabi',
];

export default function TherapistProfileView({ onNavigateTab, onLogout }) {
  // Navigation / Active Section
  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'practice' | 'integrations' | 'financial' | 'notifications' | 'security' | 'account'

  // Server Data
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [payoutAccounts, setPayoutAccounts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [deactivationReadiness, setDeactivationReadiness] = useState(null);
  const [deactivationLoading, setDeactivationLoading] = useState(false);
  const [deactivationSubmitting, setDeactivationSubmitting] = useState(false);
  const [deactivationFeedback, setDeactivationFeedback] = useState(null);

  // Custom Specialty input
  const [customSpecialtyInput, setCustomSpecialtyInput] = useState('');

  // Working Hours / Consultation Windows
  const [savingHours, setSavingHours] = useState(false);
  const [hoursNotice, setHoursNotice] = useState('');

  // Payout Method Modal State
  const [isAddPayoutModalOpen, setIsAddPayoutModalOpen] = useState(false);
  const [payoutAccountType, setPayoutAccountType] = useState('bank'); // 'bank' | 'upi'
  const [payoutBeneficiaryName, setPayoutBeneficiaryName] = useState('');
  const [payoutBankName, setPayoutBankName] = useState('');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState('');
  const [payoutConfirmAccountNumber, setPayoutConfirmAccountNumber] = useState('');
  const [payoutIfsc, setPayoutIfsc] = useState('');
  const [payoutUpiId, setPayoutUpiId] = useState('');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    contactEmail: '',
    title: '',
    bio: '',
    qualification: '',
    experienceYears: 0,
    specializations: [],
    languages: [],
    sessionFormats: ['telehealth'],
    practiceName: '',
    practiceAddress: '',
    city: '',
    state: '',
    timezone: 'Asia/Kolkata',
    perSessionFee: '1500',
    availabilityHours: {
      mon: ['09:00-17:00'],
      tue: ['09:00-17:00'],
      wed: ['09:00-17:00'],
      thu: ['09:00-17:00'],
      fri: ['09:00-17:00'],
      sat: [],
      sun: [],
    },
    notificationPreferences: {
      email_appointment_reminders: true,
      email_booking_notifications: true,
      email_cancellation_alerts: true,
      email_homework_submissions: true,
      in_app_session_alerts: true,
      security_alerts: true,
    },
  });

  const [initialFormData, setInitialFormData] = useState(null);

  // Fetch Full Profile Hub Data
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const [profileRes, payoutsRes] = await Promise.all([
        fetch('/api/therapist/profile'),
        fetch('/api/therapist/payouts/accounts').catch(() => null),
      ]);

      if (profileRes.ok) {
        const json = await profileRes.json();
        setAccount(json.account);
        setProfile(json.profile);
        setSummaryStats(json.summary || null);

        const initial = {
          fullName: json.profile?.full_name || '',
          contactEmail: json.profile?.contact_email || '',
          title: json.profile?.title || 'Consultant Psychologist',
          bio: json.profile?.bio || '',
          qualification: json.profile?.qualification || '',
          experienceYears: json.profile?.experience_years ?? 0,
          specializations: Array.isArray(json.profile?.specializations) ? json.profile.specializations : [],
          languages: Array.isArray(json.profile?.languages) ? json.profile.languages : ['English', 'Hindi'],
          sessionFormats: (() => {
            const raw = Array.isArray(json.profile?.session_formats) ? json.profile.session_formats : ['telehealth'];
            const norm = Array.from(
              new Set(
                raw.flatMap((f) => {
                  const s = String(f || '').trim().toLowerCase().replace(/-/g, '_');
                  if (s === 'either' || s === 'both') return ['telehealth', 'in_person'];
                  if (s === 'telehealth' || s === 'in_person') return [s];
                  return [];
                })
              )
            );
            return norm.length > 0 ? norm : ['telehealth'];
          })(),
          practiceName: json.profile?.practice_name || '',
          practiceAddress: json.profile?.practice_address || '',
          city: json.profile?.city || '',
          state: json.profile?.state || '',
          timezone: json.profile?.timezone || 'Asia/Kolkata',
          perSessionFee: json.account?.per_session_fee ? String(json.account.per_session_fee) : '1500',
          availabilityHours: (json.profile?.availability_hours && typeof json.profile.availability_hours === 'object' && Object.keys(json.profile.availability_hours).length > 0)
            ? json.profile.availability_hours
            : {
                mon: ['09:00-17:00'],
                tue: ['09:00-17:00'],
                wed: ['09:00-17:00'],
                thu: ['09:00-17:00'],
                fri: ['09:00-17:00'],
                sat: [],
                sun: [],
              },
          notificationPreferences: json.profile?.notification_preferences || {
            email_appointment_reminders: true,
            email_booking_notifications: true,
            email_cancellation_alerts: true,
            email_homework_submissions: true,
            in_app_session_alerts: true,
            security_alerts: true,
          },
        };

        setFormData(initial);
        setInitialFormData(initial);
      } else {
        const errJson = await profileRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || 'Failed to load profile.');
      }

      if (payoutsRes && payoutsRes.ok) {
        const pJson = await payoutsRes.json();
        setPayoutAccounts(pJson.accounts || []);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const res = await fetch('/api/therapist/auth/sessions');
      if (res.ok) {
        const json = await res.json();
        setActiveSessions(json.sessions || []);
      }
    } catch (err) {
      console.error('Sessions fetch error:', err);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (activeSection === 'security') {
      fetchSessions();
    }
  }, [activeSection]);

  // Dirty State Detection
  const isDirty = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Profile Completeness Calculation (Strict real fields, no arbitrary percentages)
  const completeness = useMemo(() => {
    const fields = [
      { key: 'fullName', label: 'Full Name', valid: Boolean(formData.fullName?.trim()) },
      { key: 'contactEmail', label: 'Contact Email', valid: Boolean(formData.contactEmail?.trim()) },
      { key: 'title', label: 'Clinical Title', valid: Boolean(formData.title?.trim()) },
      { key: 'bio', label: 'Professional Bio', valid: Boolean(formData.bio?.trim()) },
      { key: 'qualification', label: 'Qualification', valid: Boolean(formData.qualification?.trim()) },
      { key: 'experienceYears', label: 'Experience Years', valid: Number(formData.experienceYears) > 0 },
      { key: 'city', label: 'City', valid: Boolean(formData.city?.trim()) },
      { key: 'specializations', label: 'Specialties', valid: formData.specializations?.length > 0 },
      { key: 'languages', label: 'Languages', valid: formData.languages?.length > 0 },
      { key: 'photo', label: 'Profile Photo', valid: Boolean(profile?.profile_image_url) },
    ];

    const completed = fields.filter((f) => f.valid).length;
    const total = fields.length;
    const percentage = Math.round((completed / total) * 100);
    const missing = fields.filter((f) => !f.valid).map((f) => f.label);

    return { completed, total, percentage, missing };
  }, [formData, profile]);

  // Handle Save
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveNotice('');
    setErrorMessage('');

    try {
      const cleanFormats = Array.from(
        new Set(
          (Array.isArray(formData.sessionFormats) ? formData.sessionFormats : ['telehealth']).flatMap((f) => {
            const s = String(f || '').trim().toLowerCase().replace(/-/g, '_');
            if (s === 'either' || s === 'both') return ['telehealth', 'in_person'];
            if (s === 'telehealth' || s === 'in_person') return [s];
            return [];
          })
        )
      );
      const finalFormats = cleanFormats.length > 0 ? cleanFormats : ['telehealth'];

      const res = await fetch('/api/therapist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          contact_email: formData.contactEmail ? formData.contactEmail.trim().toLowerCase() : null,
          title: formData.title.trim(),
          bio: formData.bio.trim(),
          qualification: formData.qualification.trim(),
          experience_years: Number(formData.experienceYears),
          specializations: formData.specializations,
          languages: formData.languages,
          session_formats: finalFormats,
          practice_name: formData.practiceName.trim(),
          practice_address: formData.practiceAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          timezone: formData.timezone,
          per_session_fee: Number(formData.perSessionFee || account?.per_session_fee || 1500),
          availability_hours: formData.availabilityHours,
          notification_preferences: formData.notificationPreferences,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to update profile.');
      }

      setProfile(data.profile);
      setAccount((prev) => ({
        ...prev,
        per_session_fee: Number(formData.perSessionFee || prev?.per_session_fee || 1500),
      }));
      const syncedForm = { ...formData, sessionFormats: finalFormats };
      setFormData(syncedForm);
      setInitialFormData(syncedForm);
      setSaveNotice('Profile updated successfully.');
      setTimeout(() => setSaveNotice(''), 3500);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialFormData) {
      setFormData({ ...initialFormData });
      setErrorMessage('');
    }
  };

  // Custom Specialty Tag Handlers
  const handleAddCustomSpecialty = (e) => {
    if (e) e.preventDefault();
    const tag = customSpecialtyInput.trim();
    if (!tag) return;
    if (!formData.specializations.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, tag],
      }));
    }
    setCustomSpecialtyInput('');
  };

  const handleRemoveSpecialty = (tag) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== tag),
    }));
  };

  // Consultation Windows / Working Hours Handlers
  const handleSaveWorkingHours = async () => {
    setSavingHours(true);
    setHoursNotice('');
    try {
      const res = await fetch('/api/therapist/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availability_hours: formData.availabilityHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save consultation windows.');
      setProfile(data.profile);
      setHoursNotice('Consultation windows saved successfully.');
      setTimeout(() => setHoursNotice(''), 3500);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSavingHours(false);
    }
  };

  const handleApplyPresetHours = (preset) => {
    let nextHours = {};
    if (preset === 'weekdays_9_5') {
      nextHours = {
        mon: ['09:00-17:00'],
        tue: ['09:00-17:00'],
        wed: ['09:00-17:00'],
        thu: ['09:00-17:00'],
        fri: ['09:00-17:00'],
        sat: [],
        sun: [],
      };
    } else if (preset === 'weekdays_extended') {
      nextHours = {
        mon: ['08:00-20:00'],
        tue: ['08:00-20:00'],
        wed: ['08:00-20:00'],
        thu: ['08:00-20:00'],
        fri: ['08:00-20:00'],
        sat: ['10:00-16:00'],
        sun: [],
      };
    } else if (preset === 'all_days') {
      nextHours = {
        mon: ['09:00-18:00'],
        tue: ['09:00-18:00'],
        wed: ['09:00-18:00'],
        thu: ['09:00-18:00'],
        fri: ['09:00-18:00'],
        sat: ['09:00-18:00'],
        sun: ['09:00-18:00'],
      };
    }
    setFormData((prev) => ({ ...prev, availabilityHours: nextHours }));
  };

  const handleToggleDay = (dayKey) => {
    setFormData((prev) => {
      const currentDaySlots = prev.availabilityHours?.[dayKey] || [];
      const isEnabled = currentDaySlots.length > 0;
      return {
        ...prev,
        availabilityHours: {
          ...prev.availabilityHours,
          [dayKey]: isEnabled ? [] : ['09:00-17:00'],
        },
      };
    });
  };

  const handleTimeSlotChange = (dayKey, slotIndex, start, end) => {
    setFormData((prev) => {
      const slots = [...(prev.availabilityHours?.[dayKey] || [])];
      slots[slotIndex] = `${start}-${end}`;
      return {
        ...prev,
        availabilityHours: {
          ...prev.availabilityHours,
          [dayKey]: slots,
        },
      };
    });
  };

  // Payout Account Management Handlers
  const handleOpenAddPayoutModal = () => {
    setPayoutAccountType('bank');
    setPayoutBeneficiaryName(formData.fullName || profile?.full_name || '');
    setPayoutBankName('');
    setPayoutAccountNumber('');
    setPayoutConfirmAccountNumber('');
    setPayoutIfsc('');
    setPayoutUpiId('');
    setPayoutError('');
    setIsAddPayoutModalOpen(true);
  };

  const handleSavePayoutAccount = async (e) => {
    e.preventDefault();
    setPayoutError('');
    setPayoutSubmitting(true);

    try {
      if (!payoutBeneficiaryName.trim()) {
        throw new Error('Please enter beneficiary legal name.');
      }

      if (payoutAccountType === 'bank') {
        if (!payoutAccountNumber || payoutAccountNumber.trim().length < 6) {
          throw new Error('Please enter a valid bank account number (minimum 6 digits).');
        }
        if (payoutAccountNumber !== payoutConfirmAccountNumber) {
          throw new Error('Bank account numbers do not match.');
        }
        if (!payoutIfsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(payoutIfsc.trim().toUpperCase())) {
          throw new Error('Please enter a valid 11-character IFSC code (e.g. HDFC0001234).');
        }
      } else {
        if (!payoutUpiId || !payoutUpiId.includes('@')) {
          throw new Error('Please enter a valid UPI ID (e.g. yourname@okhdfcbank).');
        }
      }

      const payload = {
        accountType: payoutAccountType,
        beneficiaryName: payoutBeneficiaryName.trim(),
        bankName: payoutAccountType === 'bank' ? (payoutBankName.trim() || undefined) : undefined,
        accountNumber: payoutAccountType === 'bank' ? payoutAccountNumber.trim() : undefined,
        ifsc: payoutAccountType === 'bank' ? payoutIfsc.trim().toUpperCase() : undefined,
        upiId: payoutAccountType === 'upi' ? payoutUpiId.trim().toLowerCase() : undefined,
        isDefault: payoutAccounts.length === 0,
      };

      const res = await fetch('/api/therapist/payouts/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to save payout account.');
      }

      // Reload accounts from API
      const accountsRes = await fetch('/api/therapist/payouts/accounts');
      if (accountsRes.ok) {
        const accData = await accountsRes.json();
        setPayoutAccounts(accData.accounts || []);
      }

      setIsAddPayoutModalOpen(false);
      setSaveNotice('Payout method successfully added.');
      setTimeout(() => setSaveNotice(''), 3500);
    } catch (err) {
      setPayoutError(err.message);
    } finally {
      setPayoutSubmitting(false);
    }
  };

  const handleSetDefaultPayout = async (accountId) => {
    try {
      const res = await fetch('/api/therapist/payouts/accounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      if (res.ok) {
        setPayoutAccounts((prev) =>
          prev.map((a) => ({ ...a, is_default: a.id === accountId }))
        );
        setSaveNotice('Default payout account updated.');
        setTimeout(() => setSaveNotice(''), 3500);
      }
    } catch (err) {
      setErrorMessage('Failed to set default payout account.');
    }
  };

  const handleDeletePayoutAccount = async (accountId) => {
    if (!window.confirm('Are you sure you want to remove this payout destination?')) return;
    try {
      const res = await fetch(`/api/therapist/payouts/accounts?id=${accountId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPayoutAccounts((prev) => prev.filter((a) => a.id !== accountId));
        setSaveNotice('Payout account removed.');
        setTimeout(() => setSaveNotice(''), 3500);
      }
    } catch (err) {
      setErrorMessage('Failed to delete payout account.');
    }
  };

  // Photo Upload Handler
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be under 5 MB.');
      return;
    }

    setPhotoError('');
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setPhotoUploading(true);
    setPhotoError('');

    try {
      const data = new FormData();
      data.append('file', photoFile);

      const res = await fetch('/api/therapist/profile/photo', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to upload photo.');
      }

      setProfile((prev) => ({ ...prev, profile_image_url: json.profile_image_url }));
      setIsPhotoModalOpen(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setSaveNotice('Profile photo updated.');
      setTimeout(() => setSaveNotice(''), 3000);
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Remove profile photo? Your profile will display your monogram avatar.')) return;
    setPhotoUploading(true);

    try {
      const res = await fetch('/api/therapist/profile/photo', { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to remove photo.');
      }

      setProfile((prev) => ({ ...prev, profile_image_url: null }));
      setIsPhotoModalOpen(false);
      setSaveNotice('Profile photo removed.');
      setTimeout(() => setSaveNotice(''), 3000);
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  // Revoke Sessions Handler
  const handleRevokeSession = async (deviceId) => {
    try {
      const res = await fetch('/api/therapist/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (err) {
      console.error('Revoke session error:', err);
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!window.confirm('Sign out of all other active browser and mobile sessions?')) return;
    try {
      const res = await fetch('/api/therapist/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokeAllOther: true }),
      });
      if (res.ok) {
        fetchSessions();
        setSaveNotice('Signed out of other sessions.');
        setTimeout(() => setSaveNotice(''), 3000);
      }
    } catch (err) {
      console.error('Revoke all other sessions error:', err);
    }
  };

  // Deactivation Check Handler
  const handleOpenDeactivateModal = async () => {
    setIsDeactivateModalOpen(true);
    setDeactivationFeedback(null);
    setDeactivationLoading(true);

    try {
      const res = await fetch('/api/therapist/profile/deactivate');
      if (res.ok) {
        const json = await res.json();
        setDeactivationReadiness(json.readiness);
      }
    } catch (err) {
      console.error('Deactivation readiness check error:', err);
    } finally {
      setDeactivationLoading(false);
    }
  };

  const handleRequestDeactivation = async () => {
    setDeactivationSubmitting(true);
    try {
      const res = await fetch('/api/therapist/profile/deactivate', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Deactivation request could not be processed.');
      }
      setDeactivationFeedback(json.message);
    } catch (err) {
      setDeactivationFeedback(err.message);
    } finally {
      setDeactivationSubmitting(false);
    }
  };

  // Helper toggle for array fields
  const toggleArrayItem = (key, item) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      if (key === 'sessionFormats' && current.includes(item) && current.length <= 1) {
        return prev;
      }
      const updated = current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
      return { ...prev, [key]: updated };
    });
  };

  // Helper toggle for notification preferences
  const toggleNotification = (key) => {
    if (key === 'security_alerts') return; // Cannot turn off security alerts
    setFormData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences?.[key],
      },
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl animate-pulse">
        <div className="h-44 bg-white border border-[#132A24]/10 rounded-2xl p-6" />
        <div className="h-96 bg-white border border-[#132A24]/10 rounded-2xl p-6" />
      </div>
    );
  }

  const defaultPayout = payoutAccounts.find((a) => a.is_default) || payoutAccounts[0];

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HERO SUMMARY CARD                                         */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#132A24]/10 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4E7A66]">
              Practitioner Center
            </span>
            <h1 className="font-serif text-3xl font-normal text-[#132A24] mt-0.5">
              My Profile & Practice Settings
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveNotice && (
              <span className="text-xs text-[#4E7A66] font-semibold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 size={14} /> {saveNotice}
              </span>
            )}
            {isDirty && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 transition-all cursor-pointer shadow-xs"
              >
                <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-900 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Hero Card */}
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar with Photo Upload Trigger */}
              <div className="relative group shrink-0">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={formData.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-[#132A24]/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#132A24] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm">
                    {formData.fullName ? formData.fullName.charAt(0) : 'T'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(true)}
                  title="Update profile photo"
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-[#132A24]/15 shadow-xs flex items-center justify-center text-[#132A24] hover:bg-[#FAFAF8] cursor-pointer transition-all"
                >
                  <Camera size={13} />
                </button>
              </div>

              {/* Identity & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl font-medium text-[#132A24]">
                    {formData.fullName || 'Verified Practitioner'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4E7A66]/10 text-[#4E7A66] text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={12} /> {account?.verification_status || 'Verified'}
                  </span>
                  {account?.rci_registered && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                      <Award size={11} /> RCI: {account.rci_number || 'Registered'}
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-[#132A24]/75">
                  {formData.title} &bull; {formData.qualification || 'Licensed Practitioner'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#132A24]/60 pt-0.5">
                  {(formData.city || formData.state) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#4E7A66]" />
                      {[formData.city, formData.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {formData.experienceYears > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#4E7A66]" />
                      {formData.experienceYears} Years Experience
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-[#4E7A66]" />
                    {account?.phone_number}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-[#4E7A66]" />
                    {formData.contactEmail || 'No contact email set'}
                  </span>
                </div>

                {formData.specializations?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {formData.specializations.slice(0, 4).map((spec) => (
                      <span
                        key={spec}
                        className="px-2.5 py-0.5 rounded-md bg-[#FAFAF8] border border-[#132A24]/10 text-[#132A24]/70 text-[11px]"
                      >
                        {spec}
                      </span>
                    ))}
                    {formData.specializations.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] text-[#132A24]/50">
                        +{formData.specializations.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Completeness Badge */}
            <div className="bg-[#FAFAF8] border border-[#132A24]/10 rounded-xl p-4 min-w-[210px] space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#132A24]">Profile Completeness</span>
                <span className="font-bold text-[#4E7A66]">{completeness.percentage}%</span>
              </div>
              <div className="w-full bg-[#132A24]/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#4E7A66] h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
              {completeness.missing.length > 0 ? (
                <p className="text-[10px] text-[#132A24]/55 leading-tight">
                  Missing: {completeness.missing.slice(0, 2).join(', ')}
                  {completeness.missing.length > 2 && ` +${completeness.missing.length - 2} more`}
                </p>
              ) : (
                <p className="text-[10px] text-[#4E7A66] font-medium flex items-center gap-1">
                  <CheckCircle2 size={11} /> All clinical profile fields complete
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-NAVIGATION TABS                                                     */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1 border-b border-[#132A24]/10 overflow-x-auto pb-px">
        {[
          { id: 'personal', label: 'Personal & Professional', icon: User },
          { id: 'practice', label: 'Practice & Sessions', icon: Sliders },
          { id: 'integrations', label: 'Google Calendar & Meet', icon: Calendar },
          { id: 'financial', label: 'Earnings & Payouts', icon: DollarSign },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & Sessions', icon: Lock },
          { id: 'account', label: 'Account & Practice Status', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#4E7A66] text-[#132A24] bg-white shadow-2xs'
                  : 'border-transparent text-[#132A24]/60 hover:text-[#132A24] hover:bg-[#FAFAF8]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#4E7A66]' : 'text-[#132A24]/40'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: PERSONAL & PROFESSIONAL INFORMATION                             */}
      {/* ========================================================================= */}
      {activeSection === 'personal' && (
        <form onSubmit={handleSave} className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-7">
          <div className="border-b border-[#132A24]/10 pb-4">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Personal & Professional Identity
            </h3>
            <p className="text-xs text-[#132A24]/60 mt-0.5">
              Manage your clinical bio, qualifications, and specialties shown to prospective clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">
                Full Professional Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Dr. Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">
                Clinical Title / Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Consultant Clinical Psychologist"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">
                Professional Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="doctor@example.com"
                required
              />
              <p className="text-[11px] text-[#132A24]/50 mt-1">
                Used for client match requests, client acceptance confirmations, and session alerts.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">
                Highest Professional Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="M.Phil / Ph.D. in Clinical Psychology"
              />
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-[#132A24]">
                Professional Bio & Therapeutic Approach
              </label>
              <span className="text-[11px] text-[#132A24]/40">
                {formData.bio.length} / 3000 chars
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border border-[#132A24]/15 rounded-xl p-3.5 outline-hidden focus:border-[#4E7A66] leading-relaxed"
              placeholder="Describe your therapeutic modality, clinical philosophy, and clinical focus areas..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">
                Years of Post-Qualification Experience
              </label>
              <input
                type="number"
                min="0"
                max="70"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
              />
            </div>
          </div>

          {/* Specialties Multi-Select & Custom Tagging */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#132A24] text-sm">
                Clinical Focus Areas & Modalities
              </label>
              <p className="text-[11px] text-[#132A24]/60 mt-0.5 leading-relaxed">
                Select your clinical focus concerns and therapeutic approaches. These directly drive the matching engine when prospective clients look for care.
              </p>
            </div>

            {/* Currently Active Specialties Badge List */}
            <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#132A24]/60">
                  Your Active Specialties ({formData.specializations.length})
                </span>
                {formData.specializations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, specializations: [] })}
                    className="text-[10px] text-red-600 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {formData.specializations.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {formData.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#132A24] text-white text-xs font-medium shadow-2xs"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(spec)}
                        className="hover:text-red-300 transition-colors p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#132A24]/50 italic">
                  No specialties selected yet. Please select at least one clinical focus or modality below.
                </p>
              )}
            </div>

            {/* Add Custom Tag */}
            <div className="space-y-1.5">
              <label className="block font-medium text-[#132A24]">
                Add Custom Specialization
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSpecialtyInput}
                  onChange={(e) => setCustomSpecialtyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSpecialty();
                    }
                  }}
                  placeholder="e.g. Perinatal & Postpartum Mood, OCD / ERP, Career Transitions..."
                  className="flex-1 border border-[#132A24]/15 rounded-xl px-3.5 py-2 outline-hidden focus:border-[#4E7A66] text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSpecialty}
                  disabled={!customSpecialtyInput.trim()}
                  className="px-4 py-2 bg-[#132A24] text-white rounded-xl text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus size={13} /> Add Tag
                </button>
              </div>
            </div>

            {/* Clinical Concern Focus Areas */}
            <div className="space-y-2 pt-2 border-t border-[#132A24]/10">
              <span className="block font-semibold text-[#132A24]">
                Client Concerns & Life Challenges
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CLINICAL_FOCUS_CONCERNS.map((spec) => {
                  const isSelected = formData.specializations.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleArrayItem('specializations', spec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4E7A66] text-white border-[#4E7A66]'
                          : 'bg-[#FAFAF8] text-[#132A24]/75 border-[#132A24]/15 hover:border-[#132A24]/30'
                      }`}
                    >
                      {isSelected && <Check size={12} className="inline mr-1 -mt-0.5" />}
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Therapeutic Approaches & Modalities */}
            <div className="space-y-2 pt-2 border-t border-[#132A24]/10">
              <span className="block font-semibold text-[#132A24]">
                Therapeutic Approaches & Clinical Modalities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CLINICAL_MODALITIES.map((spec) => {
                  const isSelected = formData.specializations.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleArrayItem('specializations', spec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#4E7A66] text-white border-[#4E7A66]'
                          : 'bg-[#FAFAF8] text-[#132A24]/75 border-[#132A24]/15 hover:border-[#132A24]/30'
                      }`}
                    >
                      {isSelected && <Check size={12} className="inline mr-1 -mt-0.5" />}
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Languages Multi-Select */}
          <div className="space-y-2 text-xs">
            <label className="block font-semibold text-[#132A24]">
              Languages for Consultation
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {PREDEFINED_LANGUAGES.map((lang) => {
                const isSelected = formData.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleArrayItem('languages', lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#4E7A66] text-white border-[#4E7A66]'
                        : 'bg-[#FAFAF8] text-[#132A24]/75 border-[#132A24]/15 hover:border-[#132A24]/30'
                    }`}
                  >
                    {isSelected && <Check size={12} className="inline mr-1 -mt-0.5" />}
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Practice Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs pt-2 border-t border-[#132A24]/10">
            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">Practice / Clinic Name</label>
              <input
                type="text"
                value={formData.practiceName}
                onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Ingress Wellness Suite / Private Clinic"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">Consultation Address</label>
              <input
                type="text"
                value={formData.practiceAddress}
                onChange={(e) => setFormData({ ...formData, practiceAddress: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Suite 402, Lotus Business Park, Bandra West"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#132A24] mb-1.5">State (Optional)</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66]"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Governance Notice */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 flex items-start gap-3">
            <Lock size={15} className="shrink-0 text-[#4E7A66] mt-0.5" />
            <div className="text-[11px] text-[#132A24]/65 leading-relaxed">
              <strong>Clinical Governance Safeguard:</strong> Practice authorization, RCI registration details, and client fee agreements are maintained by the Ingress Within Clinical Operations Board. Contact operations if you require updates to registered credentials.
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#132A24]/10">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-[#132A24]/60 hover:text-[#132A24] cursor-pointer"
              >
                Reset Changes
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: PRACTICE & SESSION PREFERENCES                                  */}
      {/* ========================================================================= */}
      {activeSection === 'practice' && (
        <form onSubmit={handleSave} className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-7">
          <div className="border-b border-[#132A24]/10 pb-4">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Session & Practice Preferences
            </h3>
            <p className="text-xs text-[#132A24]/60 mt-0.5">
              Manage consultation delivery modes, timezone configuration, and weekly clinical hours.
            </p>
          </div>

          {/* Consultation Formats */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-[#132A24]">Consultation Delivery Modes</label>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4E7A66]/10 text-[#4E7A66] border border-[#4E7A66]/20">
                Online Only Platform
              </span>
            </div>
            <div className="p-4 rounded-xl border border-[#4E7A66] bg-[#4E7A66]/5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#132A24]">Telehealth (Video & Audio Consultations)</span>
                <span className="text-[10px] font-bold text-[#4E7A66] uppercase tracking-wider">Active</span>
              </div>
              <p className="text-[11px] text-[#132A24]/65 mt-1 leading-relaxed">
                All client sessions on Ingress Within are conducted 100% online via secure, end-to-end encrypted video and audio sessions (Google Meet integration). Physical in-person consultations are not supported.
              </p>
            </div>
          </div>

          {/* Canonical Timezone */}
          <div className="text-xs space-y-1.5 max-w-md">
            <label className="block font-semibold text-[#132A24]">
              Canonical Practice Timezone <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full border border-[#132A24]/15 rounded-xl px-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] bg-white"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#132A24]/55">
              All client bookings, session alerts, and Google Calendar syncs use this timezone.
            </p>
          </div>

          {/* Per-Session Consultation Fee */}
          <div className="text-xs space-y-1.5 max-w-md">
            <label className="block font-semibold text-[#132A24]">
              Per-Session Consultation Fee (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-[#132A24]/50 font-mono">₹</span>
              <input
                type="number"
                min="1"
                max="100000"
                step="1"
                value={formData.perSessionFee}
                onChange={(e) => setFormData({ ...formData, perSessionFee: e.target.value })}
                className="w-full border border-[#132A24]/15 rounded-xl pl-8 pr-3.5 py-2.5 outline-hidden focus:border-[#4E7A66] bg-white font-mono"
                placeholder="1500"
                required
              />
            </div>
            <p className="text-[11px] text-[#132A24]/55">
              Standard fee charged per individual 50-minute clinical session.
            </p>
          </div>

          {/* Financial Breakdown Summary */}
          <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#132A24]">Standard Session Financial Breakdown</span>
              <span className="text-[10px] text-[#4E7A66] font-bold uppercase tracking-wider">Dynamic Payout</span>
            </div>
            {(() => {
              const grossFee = Number(formData.perSessionFee || account?.per_session_fee || 1500);
              const commPct = Number(account?.commission_rate || 20);
              const baseComm = (grossFee * commPct) / 100;
              const gstOnComm = baseComm * 0.18;
              const totalPlatformFee = baseComm + gstOnComm;
              const therapistNet = grossFee - totalPlatformFee;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-[#132A24]/10">
                    <span className="text-[10px] text-[#132A24]/50 block">Standard Fee (Gross)</span>
                    <span className="font-serif text-base font-semibold text-[#132A24]">
                      ₹{grossFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#132A24]/10">
                    <span className="text-[10px] text-[#132A24]/50 block">Platform Commission ({commPct}%)</span>
                    <span className="font-serif text-base font-semibold text-amber-900">
                      ₹{baseComm.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#132A24]/10">
                    <span className="text-[10px] text-[#132A24]/50 block">GST on Comm. (18%)</span>
                    <span className="font-serif text-base font-semibold text-amber-900">
                      ₹{gstOnComm.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-[#132A24]/10">
                    <span className="text-[10px] text-[#4E7A66] font-semibold block">Therapist Net Payout</span>
                    <span className="font-serif text-base font-semibold text-[#4E7A66]">
                      ₹{therapistNet.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Availability Overview Card */}
          <div className="p-5 rounded-xl border border-[#132A24]/10 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-[#132A24]">Clinical Working Hours & Calendar Slots</h4>
                <p className="text-[11px] text-[#132A24]/60">
                  Manage weekly booking hours and slot intervals directly on your interactive calendar.
                </p>
              </div>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('calendar')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132A24] text-white text-xs font-medium hover:bg-[#132A24]/90 cursor-pointer"
                >
                  <Calendar size={13} /> Manage Availability <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: GOOGLE CALENDAR & MEET INTEGRATION                               */}
      {/* ========================================================================= */}
      {activeSection === 'integrations' && (
        <div className="space-y-6">
          {/* How Google Meet & Calendar Sync Works */}
          <div className="bg-gradient-to-r from-[#132A24]/5 to-[#4E7A66]/10 border border-[#132A24]/10 rounded-2xl p-6 lg:p-7 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#132A24] text-white flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-[#132A24]">
                  How Consultation Links & Calendar Sync Work
                </h3>
                <p className="text-xs text-[#132A24]/60">
                  Fully automated scheduling — zero manual link sharing required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/80 border border-[#132A24]/10 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#4E7A66]/15 text-[#4E7A66] flex items-center justify-center font-bold text-[11px]">1</span>
                <div className="font-semibold text-xs text-[#132A24]">Connect Calendar</div>
                <p className="text-[11px] text-[#132A24]/65 leading-relaxed">
                  Link your professional Google Account using the secure Google Calendar card below.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-[#132A24]/10 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#4E7A66]/15 text-[#4E7A66] flex items-center justify-center font-bold text-[11px]">2</span>
                <div className="font-semibold text-xs text-[#132A24]">Set Consultation Windows</div>
                <p className="text-[11px] text-[#132A24]/65 leading-relaxed">
                  Configure your weekly consultation windows below so clients can only book when you are available.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-[#132A24]/10 space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-[#4E7A66]/15 text-[#4E7A66] flex items-center justify-center font-bold text-[11px]">3</span>
                <div className="font-semibold text-xs text-[#132A24]">Automatic Google Meet</div>
                <p className="text-[11px] text-[#132A24]/65 leading-relaxed">
                  When a client books, Ingress Within provisions a unique Google Meet link and sends calendar invites to both parties automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Google Calendar Card */}
          <TherapistCalendarIntegrationCard />

          {/* Consultation Windows & Working Hours Editor */}
          <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#132A24]/10 pb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#132A24]">
                  Consultation Windows & Working Hours
                </h3>
                <p className="text-xs text-[#132A24]/60 mt-0.5">
                  Clients can only book appointments within your configured daily consultation windows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#132A24]/50 font-medium">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetHours('weekdays_9_5')}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-[#132A24]/15 bg-[#FAFAF8] text-[#132A24]/75 hover:bg-[#132A24]/5 cursor-pointer font-medium"
                >
                  Weekdays 9-5
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetHours('weekdays_extended')}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-[#132A24]/15 bg-[#FAFAF8] text-[#132A24]/75 hover:bg-[#132A24]/5 cursor-pointer font-medium"
                >
                  Extended 8-8
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetHours('all_days')}
                  className="px-2.5 py-1 text-[11px] rounded-lg border border-[#132A24]/15 bg-[#FAFAF8] text-[#132A24]/75 hover:bg-[#132A24]/5 cursor-pointer font-medium"
                >
                  All 7 Days
                </button>
              </div>
            </div>

            {hoursNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} className="shrink-0 text-[#4E7A66]" />
                <span>{hoursNotice}</span>
              </div>
            )}

            {/* Daily Schedule List */}
            <div className="space-y-3">
              {[
                { key: 'mon', label: 'Monday' },
                { key: 'tue', label: 'Tuesday' },
                { key: 'wed', label: 'Wednesday' },
                { key: 'thu', label: 'Thursday' },
                { key: 'fri', label: 'Friday' },
                { key: 'sat', label: 'Saturday' },
                { key: 'sun', label: 'Sunday' },
              ].map(({ key, label }) => {
                const slots = formData.availabilityHours?.[key] || [];
                const isEnabled = slots.length > 0;
                const slotStr = slots[0] || '09:00-17:00';
                const [start = '09:00', end = '17:00'] = slotStr.split('-');

                const timeOptions = [
                  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
                  '20:00', '21:00', '22:00', '23:00'
                ];

                return (
                  <div
                    key={key}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                      isEnabled
                        ? 'bg-white border-[#132A24]/15'
                        : 'bg-[#FAFAF8] border-[#132A24]/8 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleDay(key)}
                        id={`day-${key}`}
                        className="rounded border-[#132A24]/20 text-[#4E7A66] focus:ring-[#4E7A66] cursor-pointer"
                      />
                      <label htmlFor={`day-${key}`} className="font-semibold text-xs text-[#132A24] cursor-pointer w-28">
                        {label}
                      </label>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        isEnabled ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {isEnabled ? 'Open for bookings' : 'Closed'}
                      </span>
                    </div>

                    {isEnabled && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#132A24]/60">From</span>
                        <select
                          value={start}
                          onChange={(e) => handleTimeSlotChange(key, 0, e.target.value, end)}
                          className="border border-[#132A24]/15 rounded-lg px-2.5 py-1 text-xs bg-white outline-hidden focus:border-[#4E7A66]"
                        >
                          {timeOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="text-[#132A24]/60">To</span>
                        <select
                          value={end}
                          onChange={(e) => handleTimeSlotChange(key, 0, start, e.target.value)}
                          className="border border-[#132A24]/15 rounded-lg px-2.5 py-1 text-xs bg-white outline-hidden focus:border-[#4E7A66]"
                        >
                          {timeOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#132A24]/10">
              <span className="text-[11px] text-[#132A24]/55">
                Sessions are scheduled in 50-minute clinical intervals with automatic buffer times.
              </span>
              <button
                type="button"
                onClick={handleSaveWorkingHours}
                disabled={savingHours}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                <Save size={13} /> {savingHours ? 'Saving...' : 'Save Working Windows'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: EARNINGS & PAYOUTS HUB                                          */}
      {/* ========================================================================= */}
      {activeSection === 'financial' && (
        <div className="space-y-6">
          {/* Zero Subscription Clarification Card */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#4E7A66] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-emerald-900 text-sm">
                Zero Subscription Fee Guarantee for Practitioners
              </div>
              <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                Ingress Within <strong>never charges subscriptions or upfront fees to therapists</strong>. There are no monthly subscription plans, tiers, or lock-in fees for clinical practitioners. You keep your full session consultation fee minus standard platform processing. Link your Bank Account or UPI ID below for direct, verified payouts.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#132A24]/10 pb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#132A24]">
                  Earnings & Payout Accounts
                </h3>
                <p className="text-xs text-[#132A24]/60 mt-0.5">
                  Manage your verified bank account and UPI withdrawal destinations.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenAddPayoutModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4E7A66] text-white text-xs font-semibold hover:bg-[#3D6352] cursor-pointer shadow-xs transition"
                >
                  <Plus size={14} /> Add Bank / UPI Payout Method
                </button>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('earnings')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 cursor-pointer"
                  >
                    <DollarSign size={14} /> Full Earnings & Withdraw <ChevronRight size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-1">
                <span className="text-[11px] text-[#132A24]/60 font-medium">Available to Withdraw</span>
                <div className="font-serif text-3xl font-medium text-[#4E7A66]">
                  ₹{Number(summaryStats?.availableBalance || 0).toFixed(2)}
                </div>
                <p className="text-[10px] text-[#132A24]/50">
                  Collected from completed & client no-show sessions.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-2">
                <span className="text-[11px] text-[#132A24]/60 font-medium">Default Payout Destination</span>
                {defaultPayout ? (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-medium text-xs text-[#132A24]">
                        {defaultPayout.beneficiary_name}
                      </div>
                      <div className="text-xs text-[#132A24]/60">
                        {defaultPayout.account_type === 'bank' ? defaultPayout.bank_name || 'Bank Account' : 'UPI ID'}:{' '}
                        <span className="font-mono">{defaultPayout.masked_identifier}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#4E7A66]/10 text-[#4E7A66] text-[10px] font-bold uppercase">
                      Default
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-amber-800 pt-1">
                    No verified payout account linked yet. Link a bank account or UPI ID below.
                  </div>
                )}
              </div>
            </div>

            {/* Linked Payout Accounts List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-[#132A24] uppercase tracking-wider">
                  Linked Payout Accounts ({payoutAccounts.length})
                </h4>
              </div>

              {payoutAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {payoutAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className={`p-4 rounded-xl border transition-all ${
                        acc.is_default
                          ? 'bg-white border-[#4E7A66] shadow-2xs ring-1 ring-[#4E7A66]/30'
                          : 'bg-[#FAFAF8] border-[#132A24]/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            acc.account_type === 'bank' ? 'bg-[#132A24]/5 text-[#132A24]' : 'bg-[#4E7A66]/10 text-[#4E7A66]'
                          }`}>
                            {acc.account_type === 'bank' ? <CreditCard size={15} /> : <Smartphone size={15} />}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[#132A24]">
                              {acc.beneficiary_name}
                            </div>
                            <div className="text-[11px] text-[#132A24]/60">
                              {acc.account_type === 'bank' ? (acc.bank_name || 'Bank Account') : 'UPI VPA'}
                            </div>
                          </div>
                        </div>

                        {acc.is_default ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#4E7A66]/15 text-[#4E7A66] text-[10px] font-bold uppercase">
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultPayout(acc.id)}
                            className="text-[10px] text-[#4E7A66] hover:underline font-medium cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#132A24]/10 flex items-center justify-between text-xs">
                        <div className="font-mono text-[#132A24]/80 text-[11px]">
                          {acc.masked_identifier}
                          {acc.account_type === 'bank' && acc.ifsc && (
                            <span className="text-[#132A24]/40 ml-2 font-mono">({acc.ifsc})</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeletePayoutAccount(acc.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                          title="Remove payout method"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl border border-dashed border-[#132A24]/20 bg-[#FAFAF8] space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center mx-auto">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-[#132A24]">No Payout Method Linked Yet</h5>
                    <p className="text-[11px] text-[#132A24]/60 max-w-sm mx-auto mt-0.5 leading-relaxed">
                      Link your Indian bank account (Account Number & IFSC) or UPI ID to receive automatic withdrawals whenever you consult with clients.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddPayoutModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} /> Add Bank Account or UPI ID
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 5: NOTIFICATION PREFERENCES                                        */}
      {/* ========================================================================= */}
      {activeSection === 'notifications' && (
        <form onSubmit={handleSave} className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#132A24]/10 pb-4">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Communication & Alert Preferences
            </h3>
            <p className="text-xs text-[#132A24]/60 mt-0.5">
              Control email alerts and in-app notifications for clinical workflow milestones.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'email_appointment_reminders',
                title: 'Appointment Reminders',
                desc: 'Email alerts 24 hours and 1 hour before scheduled therapy sessions.',
              },
              {
                key: 'email_booking_notifications',
                title: 'New Booking Alerts',
                desc: 'Immediate notifications when a client completes intake and books a session.',
              },
              {
                key: 'email_cancellation_alerts',
                title: 'Cancellation & Reschedule Notices',
                desc: 'Prompt notification when an appointment is modified or cancelled.',
              },
              {
                key: 'email_homework_submissions',
                title: 'Homework & Clinical Journal Submissions',
                desc: 'Alerts when assigned client reflection exercises are submitted for review.',
              },
              {
                key: 'in_app_session_alerts',
                title: 'In-App Clinical Alerts',
                desc: 'Interactive banner reminders inside your practitioner workspace.',
              },
              {
                key: 'security_alerts',
                title: 'Account Security Alerts',
                desc: 'Critical security notifications (login from new device, session revocation). Cannot be disabled.',
                locked: true,
              },
            ].map((pref) => {
              const isChecked = Boolean(formData.notificationPreferences?.[pref.key]);
              return (
                <div
                  key={pref.key}
                  onClick={() => !pref.locked && toggleNotification(pref.key)}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    pref.locked
                      ? 'border-[#132A24]/10 bg-[#FAFAF8] opacity-80 cursor-not-allowed'
                      : 'border-[#132A24]/10 bg-white hover:border-[#132A24]/20 cursor-pointer'
                  }`}
                >
                  <div className="space-y-0.5 pr-4">
                    <div className="font-semibold text-xs text-[#132A24] flex items-center gap-2">
                      <span>{pref.title}</span>
                      {pref.locked && <Lock size={12} className="text-[#132A24]/40" />}
                    </div>
                    <p className="text-[11px] text-[#132A24]/60">{pref.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={pref.locked}
                    onChange={() => {}}
                    className="accent-[#4E7A66] shrink-0"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              <Save size={14} /> {saving ? 'Saving...' : 'Save Notification Preferences'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB 6: SECURITY & ACTIVE SESSIONS                                      */}
      {/* ========================================================================= */}
      {activeSection === 'security' && (
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-7">
          <div className="border-b border-[#132A24]/10 pb-4">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Security & Active Device Sessions
            </h3>
            <p className="text-xs text-[#132A24]/60 mt-0.5">
              Review active browser sessions and manage device security.
            </p>
          </div>

          {/* Auth Identity Card */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-[#132A24]/50 font-bold uppercase tracking-wider">
                Primary Authentication & Contact
              </span>
              <div className="font-semibold text-[#132A24] flex items-center gap-2">
                <Phone size={14} className="text-[#4E7A66]" />
                <span>Verified Phone OTP: {account?.phone_number}</span>
              </div>
              <div className="text-xs text-[#132A24]/75 flex items-center gap-2">
                <Mail size={13} className="text-[#4E7A66]" />
                <span>Contact Email: {formData.contactEmail || 'Not configured'}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4E7A66]/10 text-[#4E7A66] text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck size={13} /> Secure Verified
            </span>
          </div>

          {/* Active Sessions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#132A24]">Active Device Sessions</span>
              {activeSessions.length > 1 && (
                <button
                  type="button"
                  onClick={handleRevokeAllOtherSessions}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Sign Out Other Sessions
                </button>
              )}
            </div>

            {sessionsLoading ? (
              <div className="p-8 text-center text-xs text-[#132A24]/40 animate-pulse">
                Loading session activity...
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#132A24]/50 bg-[#FAFAF8] rounded-xl border border-[#132A24]/10">
                No external active sessions detected.
              </div>
            ) : (
              <div className="divide-y divide-[#132A24]/10 border border-[#132A24]/10 rounded-xl overflow-hidden">
                {activeSessions.map((sess) => (
                  <div key={sess.id} className="p-4 bg-white flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center shrink-0">
                        {sess.deviceName?.toLowerCase().includes('mobile') || sess.userAgent?.includes('Mobile') ? (
                          <Smartphone size={17} />
                        ) : (
                          <Laptop size={17} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#132A24]">{sess.deviceName}</span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#4E7A66]/15 text-[#4E7A66] text-[10px] font-bold">
                              Current Device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#132A24]/55 mt-0.5">
                          IP: {sess.ipAddress} &bull; Last active:{' '}
                          {new Date(sess.lastActiveAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(sess.deviceId)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-2.5 py-1 rounded-md hover:bg-red-50 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. TAB 7: ACCOUNT STATUS & DEACTIVATION                                   */}
      {/* ========================================================================= */}
      {activeSection === 'account' && (
        <div className="bg-white border border-[#132A24]/10 rounded-2xl p-6 lg:p-8 shadow-xs space-y-7">
          <div className="border-b border-[#132A24]/10 pb-4">
            <h3 className="font-serif text-lg font-medium text-[#132A24]">
              Account Lifecycle & Practice Status
            </h3>
            <p className="text-xs text-[#132A24]/60 mt-0.5">
              Review platform practice authorization, membership dates, and offboarding workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-1">
              <span className="text-[10px] text-[#132A24]/50 font-bold uppercase tracking-wider">
                Practice Authorization
              </span>
              <div className="font-semibold text-sm text-[#132A24] flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#4E7A66]" />
                <span>Authorized to Practice ({account?.application_status})</span>
              </div>
              <p className="text-[11px] text-[#132A24]/60">
                Can accept new clients and conduct telehealth/in-person sessions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#132A24]/10 space-y-1">
              <span className="text-[10px] text-[#132A24]/50 font-bold uppercase tracking-wider">
                Member Since
              </span>
              <div className="font-semibold text-sm text-[#132A24]">
                {account?.created_at ? new Date(account.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Verified Practitioner'}
              </div>
              <p className="text-[11px] text-[#132A24]/60">
                Practitioner ID: <span className="font-mono">{account?.id?.slice(0, 13)}...</span>
              </p>
            </div>
          </div>

          {/* Offboarding / Deactivation Section */}
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-amber-950">
              <AlertTriangle size={17} className="text-amber-700" />
              <span>Practice Offboarding & Deactivation</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              As a healthcare platform, Ingress Within strictly safeguards client care continuity. Account closure requires that all active care relationships are completed or transitioned, scheduled appointments concluded, and earnings disbursed.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenDeactivateModal}
                className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 cursor-pointer shadow-2xs"
              >
                Check Deactivation Readiness
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO UPLOAD MODAL                                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132A24]/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#132A24]/10 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#132A24]/10 pb-3">
                <h3 className="font-serif text-lg font-medium text-[#132A24]">
                  Update Profile Photo
                </h3>
                <button
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="text-[#132A24]/40 hover:text-[#132A24] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {photoError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200">
                  {photoError}
                </div>
              )}

              <div className="flex flex-col items-center justify-center space-y-4 py-2">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-[#4E7A66] shadow-sm"
                  />
                ) : profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Current"
                    className="w-28 h-28 rounded-2xl object-cover border border-[#132A24]/10 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-[#132A24] text-white flex items-center justify-center font-serif text-3xl font-bold">
                    {formData.fullName ? formData.fullName.charAt(0) : 'T'}
                  </div>
                )}

                <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#FAFAF8] border border-[#132A24]/15 hover:border-[#132A24]/30 text-xs font-semibold text-[#132A24] inline-flex items-center gap-2">
                  <Camera size={14} />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-[#132A24]/50">JPEG, PNG, or WebP &bull; Max 5 MB</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#132A24]/10 pt-4">
                {profile?.profile_image_url ? (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={photoUploading}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={13} /> Remove Photo
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#132A24]/60 hover:text-[#132A24] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!photoFile || photoUploading}
                    onClick={handleUploadPhoto}
                    className="px-4 py-2 rounded-xl bg-[#132A24] text-white text-xs font-semibold hover:bg-[#132A24]/90 disabled:opacity-40 cursor-pointer shadow-xs"
                  >
                    {photoUploading ? 'Uploading...' : 'Save Photo'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DEACTIVATION READINESS MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isDeactivateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132A24]/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#132A24]/10 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#132A24]/10 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-700" />
                  <h3 className="font-serif text-lg font-medium text-[#132A24]">
                    Practice Deactivation Readiness
                  </h3>
                </div>
                <button
                  onClick={() => setIsDeactivateModalOpen(false)}
                  className="text-[#132A24]/40 hover:text-[#132A24] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {deactivationLoading ? (
                <div className="p-8 text-center text-xs text-[#132A24]/50 animate-pulse">
                  Verifying clinical care journeys and financial balances...
                </div>
              ) : deactivationFeedback ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Info size={15} /> Request Status
                  </div>
                  <p className="leading-relaxed">{deactivationFeedback}</p>
                </div>
              ) : deactivationReadiness ? (
                <div className="space-y-4 text-xs">
                  {deactivationReadiness.canDeactivate ? (
                    <div className="p-4 rounded-xl bg-[#4E7A66]/10 border border-[#4E7A66]/20 text-[#132A24] space-y-2">
                      <div className="font-semibold text-[#4E7A66] flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> Ready for Offboarding Review
                      </div>
                      <p className="text-[11px] text-[#132A24]/70 leading-relaxed">
                        You have zero active client care relationships, zero upcoming appointments, and zero unwithdrawn earnings. You may submit a request for clinical practice offboarding.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2.5">
                      <div className="font-semibold flex items-center gap-1.5 text-amber-900">
                        <AlertTriangle size={15} /> Action Required Before Account Closure
                      </div>
                      <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-amber-900/90">
                        {deactivationReadiness.blockingReasons.map((reason, idx) => (
                          <li key={idx} className="leading-relaxed">{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2.5 text-center text-[11px]">
                    <div className="p-2.5 rounded-lg bg-[#FAFAF8] border border-[#132A24]/10">
                      <span className="text-[#132A24]/50 block">Active Clients</span>
                      <span className="font-semibold text-[#132A24]">{deactivationReadiness.activeClients}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FAFAF8] border border-[#132A24]/10">
                      <span className="text-[#132A24]/50 block">Upcoming Appts</span>
                      <span className="font-semibold text-[#132A24]">{deactivationReadiness.upcomingSessions}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FAFAF8] border border-[#132A24]/10">
                      <span className="text-[#132A24]/50 block">Available Funds</span>
                      <span className="font-semibold text-[#132A24]">₹{Number(deactivationReadiness.availableBalance).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2 border-t border-[#132A24]/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDeactivateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#132A24]/60 hover:text-[#132A24] cursor-pointer"
                >
                  Close
                </button>
                {deactivationReadiness?.canDeactivate && !deactivationFeedback && (
                  <button
                    type="button"
                    disabled={deactivationSubmitting}
                    onClick={handleRequestDeactivation}
                    className="px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 cursor-pointer shadow-xs"
                  >
                    {deactivationSubmitting ? 'Submitting...' : 'Request Practice Closure'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Payout Account Modal */}
        {isAddPayoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#132A24]/10 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#132A24]/10 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#132A24]">
                    Link Payout Account
                  </h3>
                  <p className="text-xs text-[#132A24]/60">
                    Direct session earnings transfer to your Indian bank or UPI destination.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPayoutModalOpen(false)}
                  className="p-1 rounded-lg text-[#132A24]/40 hover:text-[#132A24] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Account Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAFAF8] rounded-xl border border-[#132A24]/10 text-xs">
                <button
                  type="button"
                  onClick={() => setPayoutAccountType('bank')}
                  className={`py-2 px-3 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    payoutAccountType === 'bank'
                      ? 'bg-white text-[#132A24] shadow-2xs font-semibold'
                      : 'text-[#132A24]/60 hover:text-[#132A24]'
                  }`}
                >
                  <CreditCard size={14} /> Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutAccountType('upi')}
                  className={`py-2 px-3 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    payoutAccountType === 'upi'
                      ? 'bg-white text-[#132A24] shadow-2xs font-semibold'
                      : 'text-[#132A24]/60 hover:text-[#132A24]'
                  }`}
                >
                  <Smartphone size={14} /> UPI ID (VPA)
                </button>
              </div>

              <form onSubmit={handleSavePayoutAccount} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#132A24]/80 font-medium mb-1">
                    Beneficiary Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutBeneficiaryName}
                    onChange={(e) => setPayoutBeneficiaryName(e.target.value)}
                    placeholder="As registered in your bank account"
                    className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
                  />
                </div>

                {payoutAccountType === 'bank' ? (
                  <>
                    <div>
                      <label className="block text-[#132A24]/80 font-medium mb-1">
                        Bank Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={payoutBankName}
                        onChange={(e) => setPayoutBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank, State Bank of India"
                        className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#132A24]/80 font-medium mb-1">
                        Bank Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={payoutAccountNumber}
                        onChange={(e) => setPayoutAccountNumber(e.target.value)}
                        placeholder="Enter full account number"
                        className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] font-mono outline-hidden focus:border-[#4E7A66]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#132A24]/80 font-medium mb-1">
                        Confirm Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutConfirmAccountNumber}
                        onChange={(e) => setPayoutConfirmAccountNumber(e.target.value)}
                        placeholder="Re-enter account number"
                        className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] font-mono outline-hidden focus:border-[#4E7A66]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#132A24]/80 font-medium mb-1">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        value={payoutIfsc}
                        onChange={(e) => setPayoutIfsc(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] font-mono uppercase outline-hidden focus:border-[#4E7A66]"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[#132A24]/80 font-medium mb-1">
                      UPI ID (VPA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutUpiId}
                      onChange={(e) => setPayoutUpiId(e.target.value)}
                      placeholder="e.g. doctor@okhdfcbank"
                      className="w-full border border-[#132A24]/15 rounded-xl px-3 py-2 bg-white text-[#132A24] outline-hidden focus:border-[#4E7A66]"
                    />
                    <p className="text-[10px] text-[#132A24]/50 mt-1">
                      Instant direct payouts per National Payments Corporation of India (NPCI) guidelines.
                    </p>
                  </div>
                )}

                {payoutError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0 text-red-600" />
                    <span>{payoutError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#132A24]/10">
                  <button
                    type="button"
                    onClick={() => setIsAddPayoutModalOpen(false)}
                    className="px-4 py-2 border border-[#132A24]/15 rounded-xl text-[#132A24]/70 hover:bg-[#132A24]/5 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={payoutSubmitting}
                    className="px-5 py-2 bg-[#132A24] text-white rounded-xl font-medium hover:bg-[#132A24]/90 cursor-pointer shadow-xs disabled:opacity-40 inline-flex items-center gap-1.5"
                  >
                    {payoutSubmitting ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Verifying...
                      </>
                    ) : (
                      'Save & Link Payout Account'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
