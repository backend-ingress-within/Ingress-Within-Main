import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, CheckCircle, Clock, Tag, ShieldAlert } from 'lucide-react';

/**
 * PsychoeducationRecommendationCard
 * Displays the user's single persisted monthly psychoeducation module recommendation.
 * Aligned with the Ingress Within design system.
 * Does NOT run recommendation AI, recalculate patterns, or quote private journal content.
 */
export default function PsychoeducationRecommendationCard({ cycleId = 'latest', onNavigateToModule }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecommendation() {
      try {
        setLoading(true);
        const res = await fetch(`/api/modules/recommended?cycleId=${encodeURIComponent(cycleId)}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          if (res.status === 401) {
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch recommendation.');
        }

        const json = await res.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRecommendation();

    return () => {
      isMounted = false;
    };
  }, [cycleId]);

  if (loading) {
    return (
      <div className="bg-white-paper border border-primary/10 rounded-2xl p-5 sm:p-6 shadow-xs animate-pulse space-y-3 text-left">
        <div className="h-3 w-32 bg-primary/10 rounded-md"></div>
        <div className="h-5 w-48 bg-primary/15 rounded-md"></div>
        <div className="h-4 w-full bg-primary/5 rounded-md"></div>
      </div>
    );
  }

  if (error || !data || data.status === 'NO_RECOMMENDATION') {
    return null; // State 1: No recommendation (silent hide per spec)
  }

  // State 6: Crisis Route (Do NOT show purchase card or sell anything)
  if (data.status === 'CRISIS_ROUTE') {
    return (
      <div className="bg-error-subtle border border-error/20 rounded-2xl p-5 sm:p-6 space-y-3 text-left shadow-xs">
        <div className="flex items-center gap-2 text-error text-xs font-bold uppercase tracking-wider">
          <ShieldAlert size={14} className="text-error" />
          <span>Support & Crisis Resources</span>
        </div>
        <p className="text-xs text-primary/80 leading-relaxed">
          If you are experiencing intense distress or need immediate support, please reach out to our dedicated helpline resources or your healthcare practitioner.
        </p>
        <a
          href="/support"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-error hover:bg-[#963b36] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
        >
          <span>Access support helpline</span>
          <ArrowRight size={12} />
        </a>
      </div>
    );
  }

  const rec = data.recommendation;
  if (!rec || !rec.module) {
    return null;
  }

  const { module, purchaseStatus } = rec;
  const isOwned = purchaseStatus === 'active' || purchaseStatus === 'completed' || data.status === 'PURCHASED' || data.status === 'ACTIVE' || data.status === 'COMPLETED';
  const isCompleted = purchaseStatus === 'completed' || data.status === 'COMPLETED';
  const isActive = purchaseStatus === 'active' || data.status === 'ACTIVE';

  // Safe explanation derived from taxonomy concern without quoting journal text
  const getExplanation = () => {
    switch (module.id) {
      case 'M1':
        return 'A structured guided practice to shift harsh self-talk, build core self-worth, and break imposter syndrome loops.';
      case 'M2':
        return 'A structured guided program for overcoming rigid standards, over-polishing, and task avoidance.';
      case 'M3':
        return 'An evidence-based program for breaking chronic overthinking, worry, panic, and intrusive thoughts.';
      default:
        return 'A structured psychoeducation module tailored to your current focus areas.';
    }
  };

  const getDuration = () => {
    switch (module.id) {
      case 'M1': return '7 weeks · 35 touches';
      case 'M2': return '5 weeks · 25 touches';
      case 'M3': return '9 weeks · 45 touches';
      default: return 'Guided program';
    }
  };

  const handleCtaClick = () => {
    if (onNavigateToModule) {
      onNavigateToModule(module.id || module.slug);
    } else {
      window.location.href = `/modules/${module.id}`;
    }
  };

  // CTA Label mapping per spec
  const getCtaText = () => {
    if (isCompleted) return 'View module →';
    if (isActive || isOwned) return 'Continue module →';
    if (data.status === 'RECOMMENDED') return 'Explore module →';
    return 'View module →';
  };

  return (
    <div className="space-y-3 text-left">
      <div className="text-[9px] font-bold uppercase tracking-widest text-secondary flex items-center justify-between">
        <span>PSYCHOEDUCATION</span>
        <span className="text-[9.5px] font-semibold text-primary bg-secondary/15 border border-secondary/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles size={10} className="text-secondary" /> Recommended for you
        </span>
      </div>

      <div className="bg-white-paper border border-secondary/30 hover:border-accent/40 p-5 sm:p-6 rounded-2xl space-y-3 shadow-xs hover:shadow-sm transition-all group relative">
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Something to explore
          </div>
          <h3 className="font-serif text-xl font-normal text-primary group-hover:text-accent transition-colors">
            {module.name}
          </h3>
          <p className="text-xs font-semibold text-primary/80 leading-snug pt-0.5">
            {getExplanation()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-mid font-light border-t border-primary/5 pt-3">
          <div className="flex items-center gap-1 text-primary/70 font-mono text-[10.5px]">
            <Clock size={12} className="text-secondary" />
            <span>{getDuration()}</span>
          </div>
          <span className="text-light-mid">·</span>
          <div className="flex items-center gap-1 text-primary/70 font-mono text-[10.5px]">
            <Tag size={12} className="text-secondary" />
            <span>{module.currency === 'INR' ? `₹${module.price}` : `$${module.price}`}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleCtaClick}
            className="px-5 py-2.5 bg-accent hover:bg-[#654652] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>{getCtaText()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
