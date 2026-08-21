import React from 'react';
import { ArrowLeft, Phone, MessageSquare, Send } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';

const helplines = [
  {
    name: 'iCall',
    detail: 'Psychological counselling helpline\nMon–Sat · 8am–10pm IST',
    badge: 'Call',
    iconClass: 'bg-[#8DBFB4]/15 text-[#1A5040]',
    actionLink: 'tel:9152987821',
    isExternal: false
  },
  {
    name: 'Vandrevala Foundation',
    detail: 'Mental health support · 24/7\nFree · Confidential',
    badge: '24 / 7',
    iconClass: 'bg-[#8DBFB4]/15 text-[#1A5040]',
    actionLink: 'tel:18602662345',
    isExternal: false
  },
  {
    name: 'NIMHANS Helpline',
    detail: 'National mental health helpline\nAvailable across India',
    badge: 'Call',
    iconClass: 'bg-[#8DBFB4]/15 text-[#1A5040]',
    actionLink: 'tel:080-46110007',
    isExternal: false
  },
  {
    name: 'iCall — WhatsApp',
    detail: 'Text support if calling feels too much\nMon–Sat · 8am–10pm IST',
    badge: 'WhatsApp',
    iconClass: 'bg-[#B8A8D4]/15 text-[#5A4A8A]',
    actionLink: 'https://wa.me/919152987821',
    isExternal: true
  }
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-mint-grey text-primary font-sans relative pb-20">
      <DashboardNavbar activeTab="support" />

      <main className="max-w-[580px] mx-auto px-6 pt-8">
        <div className="space-y-6">
          <button 
            onClick={() => window.navigateTo('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-[#4A6A64] hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="space-y-2">
            <h1 className="font-serif text-[20px] text-primary leading-relaxed">
              If you're going through something right now, you don't have to go through it alone.
            </h1>
            <p className="text-[14px] text-mid leading-relaxed font-light">
              These are people and services trained for this. They're available now. This app isn't the right tool for a crisis — they are.
            </p>
          </div>

          {/* Immediate help */}
          <div className="space-y-3 pt-2 text-left">
            <div className="text-[10px] font-bold tracking-widest text-secondary uppercase">
              If you need to talk to someone now
            </div>

            <div className="space-y-3.5">
              {helplines.map((h, idx) => (
                <div 
                  key={idx}
                  className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${h.iconClass}`}>
                      {h.badge === 'WhatsApp' ? <MessageSquare size={18} /> : <Phone size={18} />}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-primary">{h.name}</h3>
                      <p className="text-[12px] text-mid leading-relaxed whitespace-pre-line mt-0.5 font-light">
                        {h.detail}
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-primary border border-secondary/30 mt-2">
                        {h.badge}
                      </span>
                    </div>
                  </div>
                  
                  <a 
                    href={h.actionLink}
                    target={h.isExternal ? '_blank' : '_self'}
                    rel="noreferrer"
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-xs ${
                      h.badge === 'WhatsApp' 
                        ? 'bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25' 
                        : 'bg-accent text-white hover:bg-[#654652]'
                    }`}
                  >
                    {h.badge === 'WhatsApp' ? <Send size={16} /> : <Phone size={16} />}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-primary/10 my-6" />

          {/* Struggles section */}
          <div className="space-y-3 text-left">
            <div className="text-[10px] font-bold tracking-widest text-secondary uppercase">
              If you're not in immediate crisis but struggling
            </div>

            <div className="space-y-3">
              <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
                <h3 className="text-[13px] font-bold text-primary">Talk to a therapist</h3>
                <p className="text-[13px] text-mid leading-relaxed font-light">
                  If what you're carrying feels like more than you can manage alone, speaking to a trained therapist is worth it. It's not a sign that things are beyond repair — often the opposite.
                </p>
                <button 
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/1pzckT6ns2H1IlMwYwJa8ghdf_h-uTr9cM1HJ_17B3vQ/edit', '_blank')}
                  className="text-[12px] font-semibold text-accent hover:text-[#654652] transition-colors flex items-center gap-1 border-none bg-transparent cursor-pointer"
                >
                  Find a therapist in India <ArrowLeft size={11} className="rotate-180" />
                </button>
              </div>

              <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 shadow-xs">
                <h3 className="text-[13px] font-bold text-primary mb-1">Talk to someone you trust</h3>
                <p className="text-[13px] text-mid leading-relaxed font-light">
                  A friend, partner, family member, or colleague. You don't have to explain the whole thing — just "I'm having a hard time today" is a good place to start.
                </p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#1E2A2E]/10 my-6" />

          {/* Disclaimer Bottom Note */}
          <div className="bg-[#1E2A2E]/5 border border-[#1E2A2E]/8 rounded-xl p-4">
            <p className="text-[12px] text-mid leading-relaxed font-light">
              <strong className="text-primary font-semibold">About this app and crisis:</strong> Ingress Within is a self-reflection tool — it's not designed or equipped to respond to a mental health crisis. If you're in crisis, the resources above are the right place. You can come back to the app when things feel more stable. <strong className="text-primary font-semibold">There's no pressure to write.</strong>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
