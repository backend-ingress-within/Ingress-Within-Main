import React, { useState } from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import { Mail, Clock } from 'lucide-react';

export default function V2ContactPage({ onOpenPolicy }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/contact" />

      <section className="pt-16 pb-20 v2-hero-atmosphere border-b border-[#E7E0D3]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <SectionLabel text="WE ARE HERE TO HELP" number="CONTACT & ORIENTATION" />
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight leading-tight">
            Begin with a free 15-minute orientation call.
          </h1>
          <p className="text-base sm:text-lg text-[#5E706A] max-w-2xl mx-auto leading-relaxed">
            Not sure whether independent self-work or collaborative therapy fits your needs best? Speak directly with our care guide. No pressure, no obligations.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Info */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-2xl font-serif text-[#1A2421]">Direct Inquiries</h3>
            <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
              We respond to all questions, feedback, and support requests within one business day.
            </p>
            <div className="space-y-3 pt-2 text-xs text-[#3D4F46]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#758D7E]" />
                <span>hello@ingresswithin.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#758D7E]" />
                <span>Mon–Fri, 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E0D3] text-xs text-[#5E706A]">
              <strong>Immediate Crisis Notice:</strong> If you are in immediate danger or distress, please contact national helpline 112 or Tele MANAS (14416).
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#EBF1ED] border border-[#D5E2D9] text-center space-y-3">
                <h4 className="font-serif text-xl text-[#1E3633]">Thank you for reaching out.</h4>
                <p className="text-xs sm:text-sm text-[#5E706A]">
                  Our care coordinator will review your note and contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">Your Name</label>
                  <input required type="text" placeholder="Your full name" className="w-full p-3 rounded-xl bg-white border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">Email or Phone</label>
                  <input required type="text" placeholder="you@email.com" className="w-full p-3 rounded-xl bg-white border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">What would you like support with?</label>
                  <textarea rows={4} placeholder="Tell us a little about what is on your mind..." className="w-full p-3 rounded-xl bg-white border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633] resize-none"></textarea>
                </div>
                <button type="submit" className="w-full py-3 rounded-full bg-[#1E3633] text-white font-medium text-sm hover:bg-[#2B4B47] transition-all cursor-pointer">
                  Reserve orientation call →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
