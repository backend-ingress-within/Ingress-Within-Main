import React, { useState } from 'react';
import V2Navbar from '../components/V2Navbar';
import V2Footer from '../components/V2Footer';
import SectionLabel from '../components/SectionLabel';
import V2Button from '../components/V2Button';
import { Mail, Clock, PhoneCall, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export default function V2ContactPage({ onOpenPolicy }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', interest: 'journaling', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A2421] font-sans selection:bg-[#EBF1ED]">
      <V2Navbar currentPath="/v2/contact" />

      {/* Section 1: Hero Cover & Contact Form Hub */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 border-b border-[#E7E0D3] v2-hero-atmosphere relative overflow-hidden">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <SectionLabel text="WE ARE HERE TO HELP" number="CONTACT & ORIENTATION" />
            <h1 className="text-4xl sm:text-6xl font-serif text-[#1A2421] tracking-tight leading-[1.15]">
              Begin with a free 15-minute orientation call.
            </h1>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              Not sure whether independent self-reflection or therapist-led care fits your needs best? Speak directly with our care guide. No pressure, no obligations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Info Card */}
            <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D3] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1ED] text-[#1E3633] text-xs font-mono font-semibold">
                  <PhoneCall className="w-3.5 h-3.5" /> ORIENTATION DESK
                </div>
                
                <h3 className="text-2xl font-serif text-[#1A2421]">Direct Care Channels</h3>
                <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                  We respond to all clinical matching inquiries, software support questions, and orientation bookings within one business day.
                </p>

                <div className="space-y-4 pt-2 text-xs sm:text-sm text-[#3D4F46]">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D3]">
                    <Mail className="w-4 h-4 text-[#2E7A70]" />
                    <span className="font-mono text-xs">care@ingresswithin.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E0D3]">
                    <Clock className="w-4 h-4 text-[#2E7A70]" />
                    <span>Mon–Sat, 9:00 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFF8F6] border border-[#F5D5CB] text-xs text-[#8A3828] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C25438]" /> Urgent Crisis Notice
                </div>
                <p>
                  If you are experiencing acute distress or suicidal thoughts, please call India National Helpline <strong>112</strong> or Tele-MANAS at <strong>14416</strong> immediately.
                </p>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#E7E0D3] flex flex-col justify-center">
              {submitted ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-[#EBF1ED] border border-[#D5E2D9] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1E3633] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#1E3633]">Thank you for reaching out.</h4>
                  <p className="text-sm text-[#5E706A] max-w-md mx-auto">
                    Our care guide has received your request and will reach out within 24 hours to confirm your 15-minute orientation call.
                  </p>
                  <div className="pt-2 text-xs font-mono text-[#758D7E]">
                    TAGLINE: Understand. Grow. Continue.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">Your Name *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Maya Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">Email or Phone *</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. maya@example.com"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">Area of Interest</label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633]"
                    >
                      <option value="journaling">Self-Guided Guided Journaling & Modules (₹499/mo)</option>
                      <option value="therapy">Collaborative 1:1 Therapy + Journaling Sync (₹1,999/session)</option>
                      <option value="orientation">General 15-Min Free Orientation Call</option>
                      <option value="enterprise">University / Organization Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#758D7E] mb-1 font-semibold">What is on your mind?</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what you are looking for or any questions you have..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#DCD5C5] text-sm focus:outline-none focus:border-[#1E3633] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#1E3633] text-white font-medium text-sm hover:bg-[#2B4B47] transition-all cursor-pointer shadow-xs font-sans tracking-wide"
                  >
                    Reserve free 15-minute orientation call →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What Happens on an Orientation */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-white border-b border-[#E7E0D3]">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <SectionLabel text="TRANSPARENT PROCESS" number="WHAT TO EXPECT" />
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              A quiet, pressure-free orientation.
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] leading-relaxed">
              We know starting inner inquiry can feel intimidating. Here is exactly what happens when you connect with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">15-Min Compassionate Intake</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                You share what you've been noticing in your days—recurring burnout, relationship friction, or anxiety loops.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Pathway Matching</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                We clarify whether our independent journaling workspace or a licensed clinical therapist will best serve your goals.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D3] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#1E3633] font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h4 className="font-serif text-lg font-semibold text-[#1A2421]">Zero High-Pressure Sales</h4>
              <p className="text-xs sm:text-sm text-[#5E706A] leading-relaxed">
                No automatic billing locks or pushy follow-ups. You proceed at your own natural pace when you feel ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Final Callout Cover */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center py-16 xl:py-24 px-6 bg-[#FAF8F5]">
        <div className="w-full max-w-4xl mx-auto text-center space-y-8 p-12 sm:p-16 rounded-3xl bg-white border border-[#E7E0D3]">
          <div className="w-16 h-16 rounded-full border-[1.5px] border-[#2E7A70] flex items-center justify-center mx-auto bg-[#FAF8F5] shadow-xs">
            <div className="w-4 h-4 rounded-full bg-[#1E3633]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1A2421] tracking-tight">
              Ready to meet your inner life with clarity?
            </h2>
            <p className="text-base sm:text-lg text-[#5E706A] max-w-xl mx-auto leading-relaxed">
              Explore how the Mirror Engine and longitudinal pattern tracking can transform your relationship with yourself.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <V2Button href="/v2/what-it-is" variant="secondary" size="lg">
              Explore What It Is
            </V2Button>
            <V2Button href="/v2/pricing" size="lg">
              View Transparent Pricing →
            </V2Button>
          </div>
        </div>
      </section>

      <V2Footer onOpenPolicy={onOpenPolicy} />
    </div>
  );
}
