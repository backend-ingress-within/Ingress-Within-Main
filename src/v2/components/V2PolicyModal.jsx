import React from 'react';
import { X, Shield } from 'lucide-react';

export default function V2PolicyModal({ isOpen, onClose, activeKey = 'privacy' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#E7E0D3] shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto font-sans">
        <div className="flex items-center justify-between border-b border-[#E7E0D3] pb-4">
          <div className="flex items-center gap-2 text-[#1E3633]">
            <Shield className="w-5 h-5" />
            <h3 className="font-serif text-xl font-semibold text-[#1A2421]">
              {activeKey === 'privacy' ? 'Privacy Notice' : activeKey === 'terms' ? 'Terms of Use' : 'Cancellation & Policies'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#5E706A] hover:text-[#1A2421] rounded-full hover:bg-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-[#5E706A] leading-relaxed space-y-4">
          <p>
            <strong>Private by Default:</strong> Your journal entries, pattern maps, and reflections are strictly confidential. We do not sell data or share your personal writing with third-party advertisers or insurance companies.
          </p>
          <p>
            <strong>Role of AI:</strong> Artificial intelligence in Ingress Within operates as a linguistic and structural organizer. It surfaces repeating themes and helps organize your thoughts for personal review. It does not provide psychiatric diagnoses or medical treatments.
          </p>
          <p>
            <strong>Therapy Continuity:</strong> If you choose to work with a therapist, you retain complete authority over which individual entries or milestone summaries are shared.
          </p>
        </div>

        <div className="pt-4 border-t border-[#E7E0D3] text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#1E3633] text-white text-xs font-semibold hover:bg-[#2B4B47] cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
