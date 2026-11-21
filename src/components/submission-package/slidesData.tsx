import React from 'react';
import { CheckCircle2, Cpu, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import type { AppTab } from '../../shared/types';

export interface PitchSlide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  renderContent: (onNavigateTab: (tab: Exclude<AppTab, 'package'>) => void) => React.ReactNode;
}

const BRICS_PILLS = [
  'IN India 🇮🇳',
  'BR Brazil 🇧🇷',
  'RU Russia 🇷🇺',
  'CN China 🇨🇳',
  'ZA South Africa 🇿🇦',
  'EG Egypt 🇪🇬',
  'ET Ethiopia 🇪🇹',
  'IR Iran 🇮🇷',
  'AE UAE 🇦🇪',
  'SA Saudi Arabia 🇸🇦',
  'ID Indonesia 🇮🇩',
] as const;

/** Structured 12-slide evaluation pitch deck for CivicPulse BRICS. */
export const PITCH_SLIDES: readonly PitchSlide[] = [
  {
    id: 1,
    title: 'CivicPulse BRICS: AI for Digital Public Infrastructure & Governance',
    subtitle:
      'Track 1 — Multimodal Data Fusion & Predictive Infrastructure Prioritization for BRICS 11',
    tag: 'Executive Overview',
    renderContent: () => (
      <div className="space-y-4">
        <p className="text-slate-700 text-sm leading-relaxed font-medium">
          A sovereign, multilingual <strong>Digital Public Good (DPG)</strong> that bridges the
          disconnect between hyper-local citizen infrastructure needs and national capital budget
          allocations across 11 BRICS nations.
        </p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
            <div className="text-emerald-700 font-bold text-lg font-mono">11 Nations</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Federated BRICS Architecture
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
            <div className="text-cyan-700 font-bold text-lg font-mono">5 Channels</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Voice, IVR, Vision, SMS, Web
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
            <div className="text-amber-800 font-bold text-lg font-mono">100% DPG</div>
            <div className="text-[11px] text-slate-600 font-medium">
              Open Data &amp; SHA-256 Audit
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'The Problem: The Infrastructure Governance Disconnect',
    subtitle: 'Why billions in public investment fail to reach critical ground-level needs',
    tag: 'Problem Statement',
    renderContent: () => (
      <div className="space-y-3 text-sm text-slate-700">
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
          <div className="text-rose-800 font-bold mb-1">1. Fragmented Citizen Feedback</div>
          <p className="text-xs text-rose-950 font-medium leading-relaxed">
            Rural and low-literacy communities rely on regional spoken dialects (Tamil, Hindi,
            Portuguese, Arabic, Amharic), leaving voice grievances siloed and un-digitized.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
          <div className="text-amber-800 font-bold mb-1">2. Disconnected Sovereign Datasets</div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed">
            National census figures, spatial infrastructure indices, and capital expenditure budgets
            exist in isolated government databases without unified cross-referencing.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
          <div className="text-slate-800 font-bold mb-1">3. The Execution Gap</div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Allocated funds (Jal Jeevan, Novo PAC, Hayah Karima) can stall at regional execution
            tiers while urgent local bottlenecks remain under-prioritized.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'The Solution: Real-Time Multimodal AI Data Fusion',
    subtitle: 'Ingesting ground truth and grounding with authorized public registries',
    tag: 'Solution Architecture',
    renderContent: () => (
      <div className="space-y-3 text-xs text-slate-700">
        <p className="text-slate-800 text-sm font-medium">
          CivicPulse unifies <strong>Citizen Ground Intelligence</strong> with{' '}
          <strong>Official Government Data</strong> into one schema-validated workflow:
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl space-y-1">
            <div className="text-emerald-800 font-bold text-xs">Ground-Level Ingestion</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-950 font-medium">
              <li>Spoken voice notes &amp; IVR dialpad</li>
              <li>Computer vision defect triage (Gemini Vision)</li>
              <li>Localized regional dialect translation</li>
            </ul>
          </div>
          <div className="bg-cyan-50/60 border border-cyan-200 p-3 rounded-xl space-y-1">
            <div className="text-cyan-800 font-bold text-xs">Authorized Public Registries</div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-cyan-950 font-medium">
              <li>National Census Boards (MoSPI, IBGE, etc.)</li>
              <li>Infrastructure Indices (Water, Roads, Clinics)</li>
              <li>Public Budget Tranches &amp; WHO/FAO/Copernicus feeds</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Who It Serves: Cross-Stakeholder Value Proposition',
    subtitle: 'Empowering citizens, district engineers, and national planning commissions',
    tag: 'Stakeholder Impact',
    renderContent: () => (
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-emerald-800 font-bold">1. Citizens &amp; Communes</div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Express urgent service disruptions in mother tongue via low-cost phone call or photo
            without literacy barriers.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-cyan-800 font-bold">2. District Engineers</div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Receive damage severity scores, GIS coordinates, and immediate budget line-item
            matching.
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-amber-800 font-bold">3. National Commissions</div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Macro-level demand heatmaps to monitor budget disbursement and expedite bottleneck
            interventions.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Google AI & Technical Architecture',
    subtitle: 'Server-side Gemini API integration with deterministic Zod validation',
    tag: 'Technology Stack',
    renderContent: () => (
      <div className="space-y-2.5 text-xs">
        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <Cpu className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-slate-900">Server-Side Gemini API:</span>
            <span className="text-slate-600 ml-1 font-medium">
              Executes cross-lingual data fusion and strict Zod-validated structured JSON output.
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-slate-900">Gemini Multimodal Vision:</span>
            <span className="text-slate-600 ml-1 font-medium">
              Analyzes infrastructure defect photos to compute severity ratings (0–100) and repair
              urgency.
            </span>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-bold text-slate-900">Spatial GIS &amp; Public Feeds:</span>
            <span className="text-slate-600 ml-1 font-medium">
              Correlates Copernicus heat anomaly indices and WHO/FAO water stress metrics.
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Cross-Border BRICS 11 Applicability',
    subtitle: 'Designed from the ground up for deployment across partner nations',
    tag: 'Cross-Border Scale',
    renderContent: () => (
      <div className="space-y-3 text-xs text-slate-700">
        <p className="font-medium text-slate-800">
          Configured with baseline datasets and regional language profiles across 11 BRICS+ states:
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center">
          {BRICS_PILLS.map((pill) => (
            <div
              key={pill}
              className="bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] font-mono text-slate-800 shadow-xs font-semibold"
            >
              {pill}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          Each country profile encapsulates census boards, open data portal schemas, capital
          programs, and official language configurations.
        </p>
      </div>
    ),
  },
  {
    id: 7,
    title: 'Canonical Integrity & Grounded Government Data',
    subtitle: 'Deterministic scoring plus cryptographic SHA-256 payload digests',
    tag: 'Data Integrity',
    renderContent: () => (
      <div className="space-y-3 text-xs text-slate-700">
        <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Reproducible SHA-256 Digest &amp; Schema Validation</span>
          </div>
          <p className="text-[11px] text-emerald-950 leading-relaxed font-medium">
            Every fusion payload computes a canonical SHA-256 hash in Node crypto referencing the
            country baseline, open data URL, and matching capital program used during synthesis.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium">Authorized Portals: </span>
            <span className="text-slate-900 font-mono font-bold">data.gov.in, dados.gov.br</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium">Validation Layer: </span>
            <span className="text-emerald-700 font-mono font-bold">
              Strict Zod + Deterministic Gap Score
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: 'Multilingual Voice & Vision Triage',
    subtitle: 'Breaking linguistic barriers with regional audio capture and photo inspection',
    tag: 'Accessibility',
    renderContent: () => (
      <div className="space-y-3 text-xs text-slate-700">
        <p className="font-medium text-slate-800">
          Supports voice-first intake in regional languages:
        </p>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-bold">Tamil Dialect Sample:</span>
            <span className="font-mono text-slate-600 font-medium">Madurai / Melur Taluk</span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans italic bg-slate-50 p-2 rounded border border-slate-200">
            &ldquo;Melur Taluk, Ettimangalam village: for the past 12 days the Jal Jeevan drinking
            water pipeline has been ruptured, leaving 180 households without water...&rdquo;
          </p>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          Extracts sector, urgency, and regional context to match with the Jal Jeevan Mission
          baseline registry.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    title: 'Demand Hotspot Intelligence & Policymaker Tools',
    subtitle: 'Structured ranking of critical urgency bottlenecks for national planners',
    tag: 'Policy Dashboard',
    renderContent: () => (
      <div className="space-y-2.5 text-xs text-slate-700">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <div className="text-rose-800 font-bold text-[11px]">Madurai Melur</div>
            <div className="text-[10px] text-rose-950 font-medium">Water Pipeline (92/100)</div>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <div className="text-amber-800 font-bold text-[11px]">Bahia Sertão</div>
            <div className="text-[10px] text-amber-950 font-medium">Novo PAC Water (89/100)</div>
          </div>
          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <div className="text-rose-800 font-bold text-[11px]">Asyut Dairut</div>
            <div className="text-[10px] text-rose-950 font-medium">Clinic Power (88/100)</div>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          Surfaces procurement actions, taskforce priorities, and bilingual citizen callback steps.
        </p>
      </div>
    ),
  },
  {
    id: 10,
    title: 'Digital Public Good (DPG) & Open Source Standards',
    subtitle: 'Built on open schemas, data sovereignty, and interoperable JSON telemetry',
    tag: 'DPG Compliance',
    renderContent: () => (
      <div className="space-y-2.5 text-xs text-slate-700">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-1 shadow-xs">
          <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>DPG Alliance Standards Adherence</span>
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1 font-medium">
            <li>Open source Apache-2.0 compatible architecture</li>
            <li>Anonymized contact tokenization to protect citizen privacy</li>
            <li>Interoperable JSON telemetry exports for GovTech stacks</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    title: 'Deployment Roadmap & Scalability Across Global South',
    subtitle: 'Phase 1 to Phase 3 rollout strategy for multilateral development partners',
    tag: 'Roadmap',
    renderContent: () => (
      <div className="space-y-2 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-emerald-800 font-bold">Phase 1 (Immediate): </span>
          <span className="text-slate-700 font-medium">
            Pilot across municipal districts in India, Brazil, and South Africa with open API
            integration.
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-cyan-800 font-bold">Phase 2 (Month 6): </span>
          <span className="text-slate-700 font-medium">
            Expansion across 11 BRICS+ national statistical feeds with development bank reporting.
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-amber-800 font-bold">Phase 3 (Month 12): </span>
          <span className="text-slate-700 font-medium">
            Milestone-tracked capital disbursement workflows backed by field inspection
            verification.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    title: 'Conclusion: Empowering Communities Through Transparent AI',
    subtitle: 'Transforming civic requests into funded, completed infrastructure reality',
    tag: 'Summary',
    renderContent: (onNavigateTab) => (
      <div className="space-y-4 text-center py-2">
        <p className="text-slate-700 text-sm leading-relaxed max-w-lg mx-auto font-medium">
          CivicPulse BRICS delivers transparent <strong>Digital Public Infrastructure</strong>:
          AI-assisted, citizen-centered, and strictly grounded in verifiable registries.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('fusion')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Launch Live Data Fusion Engine
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('policy')}
            className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            View Policymaker Hotspots
          </button>
        </div>
      </div>
    ),
  },
];

export const BRIEF_DESCRIPTION =
  'CivicPulse BRICS is a multilingual Digital Public Good (DPG) platform that aggregates citizen infrastructure requests across 11 BRICS nations via voice, IVR telephony, and computer vision, fusing them with national census, infrastructure baselines, and public investment budgets using server-side Gemini AI to prioritize high-impact capital projects.';
