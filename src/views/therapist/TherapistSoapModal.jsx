import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Save, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export default function TherapistSoapModal({ appointmentId, onClose }) {
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadSoap() {
      try {
        const res = await fetch(`/api/therapist/sessions/${appointmentId}/soap`);
        if (res.ok) {
          const json = await res.json();
          if (json.note) {
            setSubjective(json.note.subjective || '');
            setObjective(json.note.objective || '');
            setAssessment(json.note.assessment || '');
            setPlan(json.note.plan || '');
            setIsDraft(Boolean(json.note.is_draft));
            setFinalizedAt(json.note.finalized_at);
          }
        }
      } catch (err) {
        console.error('Failed to load SOAP note:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSoap();
  }, [appointmentId]);

  const handleSave = async (asDraft = false) => {
    setSaving(true);
    setSaveNotice('');
    setErrorMessage('');
    try {
      const res = await fetch(`/api/therapist/sessions/${appointmentId}/soap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjective,
          objective,
          assessment,
          plan,
          is_draft: asDraft,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to save note.');
      }

      setIsDraft(asDraft);
      setSaveNotice(asDraft ? 'Draft saved.' : 'SOAP note finalized.');
      setTimeout(() => setSaveNotice(''), 3000);
      if (!asDraft) {
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-[#132A24]/10 shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#132A24]/10 flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4E7A66]/10 text-[#4E7A66] flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium text-[#132A24]">
                  Clinical SOAP Note
                </h3>
                {finalizedAt && !isDraft && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4E7A66]/10 text-[#4E7A66] uppercase tracking-wider">
                    Finalized
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#132A24]/50">
                Subjective &bull; Objective &bull; Assessment &bull; Plan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveNotice && (
              <span className="text-xs text-[#4E7A66] font-medium animate-pulse">{saveNotice}</span>
            )}
            <button onClick={onClose} className="p-1 rounded-md text-[#132A24]/40 hover:text-[#132A24]">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Editor */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Confidential Notice Banner */}
          <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#132A24]/10 text-[11px] text-[#132A24]/70 flex items-center gap-2">
            <Lock size={13} className="text-[#4E7A66] shrink-0" />
            <span>
              Privileged Medical Record: Never visible to clients. Protected by strict practitioner RLS policies.
            </span>
          </div>

          {/* S - Subjective */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1">
              [S] Subjective — Client's Reported Experience
            </label>
            <textarea
              rows={3}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Client's primary complaints, direct quotes, emotional state, life events discussed..."
              className="w-full border border-[#132A24]/15 rounded-lg p-3 text-xs outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
            />
          </div>

          {/* O - Objective */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1">
              [O] Objective — Clinician Observations & Affect
            </label>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Affect, engagement, eye contact, speech rate, cognitive coherence, behavioural cues..."
              className="w-full border border-[#132A24]/15 rounded-lg p-3 text-xs outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
            />
          </div>

          {/* A - Assessment */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1">
              [A] Assessment — Clinical Formulation & Progress
            </label>
            <textarea
              rows={3}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Clinical synthesis, diagnostic impressions, treatment response, safety appraisal..."
              className="w-full border border-[#132A24]/15 rounded-lg p-3 text-xs outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
            />
          </div>

          {/* P - Plan */}
          <div>
            <label className="block text-xs font-semibold text-[#132A24] mb-1">
              [P] Plan — Therapeutic Interventions & Next Steps
            </label>
            <textarea
              rows={3}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Homework, psychoeducation, therapeutic modalities planned, next session focus..."
              className="w-full border border-[#132A24]/15 rounded-lg p-3 text-xs outline-hidden focus:border-[#4E7A66] focus:ring-1 focus:ring-[#4E7A66]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#132A24]/10 bg-[#FAFAF8] flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-[#132A24]/15 bg-white text-xs font-medium text-[#132A24] hover:bg-[#132A24]/5 cursor-pointer disabled:opacity-50"
          >
            Save as Draft
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-[#132A24]/70 hover:bg-[#132A24]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#4E7A66] text-white text-xs font-semibold hover:bg-[#4E7A66]/90 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {saving ? 'Finalizing...' : 'Finalize SOAP Note'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
