import React from 'react';
import { ChevronLeft, ChevronRight, Presentation } from 'lucide-react';
import type { AppTab } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { PITCH_SLIDES } from './slidesData';

interface PitchDeckSectionProps {
  currentSlide: number;
  onChangeSlide: (slideNumber: number) => void;
  onNavigateTab: (tab: Exclude<AppTab, 'package'>) => void;
}

/** Accessible 12-slide interactive pitch deck viewer. */
export const PitchDeckSection: React.FC<PitchDeckSectionProps> = ({
  currentSlide,
  onChangeSlide,
  onNavigateTab,
}) => {
  const safeIndex = Math.max(0, Math.min(PITCH_SLIDES.length - 1, currentSlide - 1));
  const activeSlide = PITCH_SLIDES[safeIndex] ?? PITCH_SLIDES[0];

  if (!activeSlide) {
    return null;
  }

  return (
    <div className={`${CARD_SURFACE_CLASS} p-6 space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Presentation className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
              Slide {activeSlide.id} of {PITCH_SLIDES.length}
            </div>
            <h3 className="text-base font-bold text-slate-900">{activeSlide.title}</h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={activeSlide.id === 1}
            onClick={() => onChangeSlide(Math.max(1, activeSlide.id - 1))}
            aria-label="Previous slide"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="text-xs font-mono text-slate-700 px-2 font-bold">
            {activeSlide.id} / {PITCH_SLIDES.length}
          </span>
          <button
            type="button"
            disabled={activeSlide.id === PITCH_SLIDES.length}
            onClick={() => onChangeSlide(Math.min(PITCH_SLIDES.length, activeSlide.id + 1))}
            aria-label="Next slide"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className={`${SUBTLE_PANEL_CLASS} rounded-2xl p-6 sm:p-8 min-h-[300px] flex flex-col justify-between relative`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              {activeSlide.tag}
            </span>
            <span className="text-[11px] text-slate-600 font-mono font-medium">
              CivicPulse BRICS • Track 1
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
            {activeSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 font-semibold mb-6">
            {activeSlide.subtitle}
          </p>

          <div className="pt-2">{activeSlide.renderContent(onNavigateTab)}</div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6 text-[11px] text-slate-600 font-mono font-medium">
          <span>Google AI Hackathon 2026</span>
          <span>Pitch Deck • BRICS Innovation Initiative</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-2">
        {PITCH_SLIDES.map((slide) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => onChangeSlide(slide.id)}
            aria-label={`Jump to slide ${slide.id}: ${slide.tag}`}
            aria-current={activeSlide.id === slide.id ? 'step' : undefined}
            className={`p-2 rounded-lg text-center transition-all text-xs font-mono border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
              activeSlide.id === slide.id
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {slide.id < 10 ? `0${slide.id}` : slide.id}
          </button>
        ))}
      </div>
    </div>
  );
};
