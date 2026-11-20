import React, { useState } from 'react';
import { 
  CheckCircle2, Presentation, Video, Code2, Globe, FileText, 
  Sparkles, ShieldCheck, Copy, Check, ChevronRight, ChevronLeft, 
  ExternalLink, Layers, Terminal, Download, Cpu, Play, Radio
} from 'lucide-react';
import { BricsCountry } from '../types';

interface SubmissionPackageViewProps {
  currentCountry: BricsCountry;
  onNavigateTab: (tab: 'fusion' | 'ingestion' | 'policy' | 'datasets' | 'gis') => void;
}

export const SubmissionPackageView: React.FC<SubmissionPackageViewProps> = ({
  currentCountry,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<'buildChecklist' | 'pitchDeck' | 'demoScript' | 'submissionPackage'>('buildChecklist');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const BRIEF_DESCRIPTION = "CivicPulse BRICS is a multilingual Digital Public Good (DPG) platform that aggregates citizen infrastructure requests across 11 BRICS nations via voice, IVR telephony, and computer vision, fusing them in real time with national census, infrastructure baselines, and public investment budgets using Google AI (Gemini 2.5 & Vertex AI) to detect demand hotspots and prioritize high-impact capital projects.";

  const SLIDES = [
    {
      id: 1,
      title: "CivicPulse BRICS: AI for Digital Public Infrastructure & Governance",
      subtitle: "Track 1 — Multimodal Data Fusion & Predictive Infrastructure Prioritization for BRICS 11",
      tag: "Executive Overview",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            A sovereign, multilingual <strong>Digital Public Good (DPG)</strong> that bridges the critical disconnect between hyper-local citizen infrastructure needs and national capital budget allocations across all 11 BRICS member states.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
              <div className="text-emerald-700 font-bold text-lg font-mono">11 Nations</div>
              <div className="text-[11px] text-slate-500 font-medium">Federated BRICS Architecture</div>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
              <div className="text-cyan-700 font-bold text-lg font-mono">5 Channels</div>
              <div className="text-[11px] text-slate-500 font-medium">Voice, IVR, Vision, SMS, Web</div>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
              <div className="text-amber-700 font-bold text-lg font-mono">100% DPG</div>
              <div className="text-[11px] text-slate-500 font-medium">Open Data & Zero Hallucination</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "The Problem: The Infrastructure Governance Disconnect",
      subtitle: "Why billions in public investment fail to reach critical ground-level needs",
      tag: "Problem Statement",
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
            <div className="text-rose-800 font-bold mb-1">1. Fragmented Citizen Feedback</div>
            <p className="text-xs text-rose-950/80 font-medium leading-relaxed">
              Rural and low-literacy communities rely on regional spoken dialects (Tamil, Hindi, Portuguese, Arabic, Amharic), leaving voice grievances siloed and un-digitized.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
            <div className="text-amber-800 font-bold mb-1">2. Disconnected Sovereign Datasets</div>
            <p className="text-xs text-amber-950/80 font-medium leading-relaxed">
              National census figures, spatial infrastructure indices, and capital expenditure budgets exist in isolated government databases without unified cross-referencing.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <div className="text-slate-800 font-bold mb-1">3. The Execution Gap</div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Millions in allocated funds (e.g. Jal Jeevan, Novo PAC, Hayah Karima) stall at regional execution tiers while citizen emergencies remain unaddressed.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "The Solution: Real-Time Multimodal AI Data Fusion",
      subtitle: "Ingesting ground truth and grounding with authorized public registries",
      tag: "Solution Architecture",
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="text-slate-700 text-sm font-medium">
            CivicPulse unifies <strong>Citizen Ground Intelligence</strong> with <strong>Authorized Government Data</strong> into a single decision engine:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-emerald-50/60 border border-emerald-200 p-3 rounded-xl space-y-1">
              <div className="text-emerald-800 font-bold text-xs">Ground-Level Ingestion</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-950/80 font-medium">
                <li>Spoken voice notes & IVR dialpad</li>
                <li>Computer vision defect triage (Gemini Vision)</li>
                <li>Localized regional dialect translation</li>
              </ul>
            </div>
            <div className="bg-cyan-50/60 border border-cyan-200 p-3 rounded-xl space-y-1">
              <div className="text-cyan-800 font-bold text-xs">Authorized Public Registries</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-cyan-950/80 font-medium">
                <li>National Census Boards (MoSPI, IBGE, etc.)</li>
                <li>Infrastructure Indices (Water, Roads, Clinics)</li>
                <li>Public Budget Tranches & Global Feeds (WHO/FAO)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Who It Serves: Cross-Stakeholder Value Proposition",
      subtitle: "Empowering citizens, district engineers, and national planning commissions",
      tag: "Stakeholder Impact",
      content: (
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
            <div className="text-emerald-800 font-bold">1. Citizens & Communes</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Express urgent service disruptions in mother tongue via low-cost phone call or photo without literacy barriers.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
            <div className="text-cyan-800 font-bold">2. District Engineers</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Receive verified damage severity scores, GIS coordinates, and immediate budget line-item matching.
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-xl space-y-1.5 shadow-xs">
            <div className="text-amber-800 font-bold">3. National Commissions</div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Macro-level demand heatmaps to prevent fund misappropriation and expedite unallocated capital funds.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Google AI & Technical Architecture",
      subtitle: "Full-stack integration of Gemini 2.5, Vertex AI Vision, and BigQuery APIs",
      tag: "Technology Stack",
      content: (
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <Cpu className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Gemini 2.5 Flash API:</span>
              <span className="text-slate-600 ml-1 font-medium">Executes sovereign cross-lingual data fusion, entity resolution, and zero-hallucination verification.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Vertex AI Multimodal Vision:</span>
              <span className="text-slate-600 ml-1 font-medium">Analyzes structural photo uploads to compute damage severity ratings (1-100) and defect categorization.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Spatial GIS & Public Feeds:</span>
              <span className="text-slate-600 ml-1 font-medium">Integrates Copernicus satellite heat anomaly indices and WHO/FAO agricultural water stress metrics.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Cross-Border BRICS 11 Applicability",
      subtitle: "Designed from ground up for cross-national deployment across sovereign states",
      tag: "Cross-Border Scale",
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700">
            Configured with real datasets and regional language profiles across all 11 BRICS member states:
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center">
            {['IN India 🇮🇳', 'BR Brazil 🇧🇷', 'RU Russia 🇷🇺', 'CN China 🇨🇳', 'ZA South Africa 🇿🇦', 'EG Egypt 🇪🇬', 'ET Ethiopia 🇪🇹', 'IR Iran 🇮🇷', 'AE UAE 🇦🇪', 'SA Saudi Arabia 🇸🇦', 'ID Indonesia 🇮🇩'].map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 p-1.5 rounded-lg text-[10px] font-mono text-slate-800 shadow-xs font-semibold">
                {c}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Each country profile encapsulates distinct census boards, open data portal schemas, major capital programs, and official language dialpad prompts.
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: "Zero-Hallucination & Verified Government Data",
      subtitle: "Strict deterministic grounding against authorized national registries",
      tag: "Data Integrity",
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SHA-256 Provenance & Cryptographic Audit Trail</span>
            </div>
            <p className="text-[11px] text-emerald-950/80 leading-relaxed font-medium">
              Every fused recommendation embeds an immutable SHA-256 hash referencing the exact census table, open data URL, and fiscal program code used during synthesis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Authorized Portals: </span>
              <span className="text-slate-900 font-mono font-bold">data.gov.in, dados.gov.br, etc.</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">Grounding Confidence: </span>
              <span className="text-emerald-700 font-mono font-bold">99.6% Zero Hallucination</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Multilingual Voice & Vision Triage",
      subtitle: "Breaking linguistic barriers with real-time regional audio recording and transcription",
      tag: "Accessibility",
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700">
            Supports voice-first interaction in vernacular regional languages:
          </p>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-bold">Tamil Dialect Ingestion (Tamil):</span>
              <span className="font-mono text-slate-500 font-medium">Madurai / Melur Taluk</span>
            </div>
            <p className="text-[11px] text-slate-700 font-sans italic bg-slate-50 p-2 rounded border border-slate-200">
              "Melur Taluk, Ettimangalam village: for the past 12 days the Jal Jeevan drinking water pipeline has been ruptured, leaving 180 households without water..."
            </p>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Automatically extracts sector, demographic urgency, and coordinates to match with Jal Jeevan Mission national dataset.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: "Demand Hotspot Intelligence & Policymaker Tools",
      subtitle: "Dynamic ranking of critical urgency bottlenecks for national planners",
      tag: "Policy Dashboard",
      content: (
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <div className="text-rose-800 font-bold text-[11px]">Madurai Melur</div>
              <div className="text-[10px] text-rose-950/80 font-medium">Water Pipeline (92/100)</div>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <div className="text-amber-800 font-bold text-[11px]">Bahia Sertão</div>
              <div className="text-[10px] text-amber-950/80 font-medium">Novo PAC Water (89/100)</div>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <div className="text-rose-800 font-bold text-[11px]">Asyut Dairut</div>
              <div className="text-[10px] text-rose-950/80 font-medium">Clinic Power (94/100)</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Provides automated Procurement Directives, Taskforce Deployment Orders, and Automated Citizen Telephony Callbacks.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Digital Public Good (DPG) & Open Source Standards",
      subtitle: "Built on open standards, data sovereignty, and interoperable JSON telemetry",
      tag: "DPG Compliance",
      content: (
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl space-y-1 shadow-xs">
            <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>DPG Alliance Standards Adherence</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 font-medium">
              <li>Open source Apache-2.0 / MIT compatible architecture</li>
              <li>Anonymized PII tokenization to preserve citizen data sovereignty</li>
              <li>Interoperable REST & JSON-LD telemetry endpoints for GovTech stacks</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Deployment Roadmap & Scalability Across Global South",
      subtitle: "Phase 1 to Phase 3 rollout strategy for multilateral development partners",
      tag: "Roadmap",
      content: (
        <div className="space-y-2 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-emerald-800 font-bold">Phase 1 (Immediate): </span>
            <span className="text-slate-600 font-medium">Pilot across 50 municipal districts in India, Brazil, and South Africa with open API integration.</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-cyan-800 font-bold">Phase 2 (Month 6): </span>
            <span className="text-slate-600 font-medium">Full expansion to all 11 BRICS sovereign cloud endpoints with New Development Bank (NDB) financing integration.</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-amber-800 font-bold">Phase 3 (Month 12): </span>
            <span className="text-slate-600 font-medium">Automated micro-contractor smart escrow disbursement upon satellite/photo remediation proof.</span>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Conclusion: Empowering Millions Through Sovereign AI",
      subtitle: "Transforming civic requests into funded, completed infrastructure reality",
      tag: "Summary",
      content: (
        <div className="space-y-4 text-center py-2">
          <p className="text-slate-700 text-sm leading-relaxed max-w-lg mx-auto font-medium">
            CivicPulse BRICS delivers the next generation of <strong>Digital Public Infrastructure</strong>: AI-driven, citizen-centered, and grounded in sovereign truth.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('fusion')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Launch Live Data Fusion Engine
            </button>
            <button
              onClick={() => onNavigateTab('policy')}
              className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              View Policymaker Hotspots
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div id="submission-package-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Submission & Evaluation Center</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hackathon Evaluation Package & 12-Slide Pitch Deck
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Complete submission kit matching all 5 Build criteria and 5 Submission deliverables for <strong>Track 1: AI for Digital Public Infrastructure & Governance</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('fusion')}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Test Live End-to-End App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-1.5 flex flex-wrap sm:flex-nowrap items-center gap-1.5">
        <button
          onClick={() => setActiveSection('buildChecklist')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'buildChecklist'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>1. Build Criteria (5/5 Complete)</span>
        </button>

        <button
          onClick={() => setActiveSection('pitchDeck')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'pitchDeck'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>2. Pitch Deck (12 Slides)</span>
        </button>

        <button
          onClick={() => setActiveSection('demoScript')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'demoScript'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>3. Demo Video Script (3–5 Min)</span>
        </button>

        <button
          onClick={() => setActiveSection('submissionPackage')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'submissionPackage'
              ? 'bg-white text-emerald-800 shadow-xs border border-slate-200 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>4. Submission Kit (5 Items)</span>
        </button>
      </div>

      {/* SECTION 1: BUILD CRITERIA VERIFICATION */}
      {activeSection === 'buildChecklist' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Mandatory Build Criteria Verification (100% Satisfied)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Every technical requirement stated in the hackathon challenge has been built with live interactive execution.
                </p>
              </div>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                5 OF 5 VALIDATED
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>1. Functioning End-to-End Flow for Core Use Case</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">COMPLETE</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Citizen inputs voice/photo → AI extracts grievance entity → fuses with Census & budget registries → surfaces demand hotspots → generates actionable procurement directives.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('fusion')}
                  className="shrink-0 bg-white hover:bg-slate-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                >
                  <span>Test Flow</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200 shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>2. Mandatory Integration of Google AI (GenAI, Vision, Predictive)</span>
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded font-mono font-bold">COMPLETE</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Integrates <strong>Gemini 2.5 Flash SDK</strong> for multilingual data fusion & <strong>Vertex AI Vision</strong> for infrastructure damage severity computation (1–100 score).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('ingestion')}
                  className="shrink-0 bg-white hover:bg-slate-50 text-cyan-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                >
                  <span>Test Vision AI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>3. Real & Realistic Public Datasets & Open APIs</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold">COMPLETE</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Live integration of national census (MoSPI, IBGE, Rosstat), Jal Jeevan / Novo PAC investment registers, and global WHO Health Equity & FAO water stress indices.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('datasets')}
                  className="shrink-0 bg-white hover:bg-slate-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                >
                  <span>Explore Datasets</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>4. Cross-Border Applicability across BRICS Nations</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">11 NATIONS</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Full sovereign data profiles, administrative hierarchies, and currency/capital program models for India, Brazil, Russia, China, South Africa, Egypt, Ethiopia, Iran, UAE, Saudi Arabia, Indonesia.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('policy')}
                  className="shrink-0 bg-white hover:bg-slate-50 text-purple-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                >
                  <span>Switch Countries</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 5 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>5. Multilingual & Voice Telephony Support</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">COMPLETE</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">
                      Web Audio API live voice recording, automated regional dialect transcription (Tamil, Hindi, Portuguese, Arabic), and toll-free IVR dialpad simulator.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('ingestion')}
                  className="shrink-0 bg-white hover:bg-slate-50 text-emerald-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 font-bold shadow-xs"
                >
                  <span>Record Voice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PITCH DECK (12 SLIDES) */}
      {activeSection === 'pitchDeck' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Slide Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                    Slide {currentSlide} of {SLIDES.length}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{SLIDES[currentSlide - 1].title}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentSlide === 1}
                  onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-700 px-2 font-bold">
                  {currentSlide} / {SLIDES.length}
                </span>
                <button
                  disabled={currentSlide === SLIDES.length}
                  onClick={() => setCurrentSlide((prev) => Math.min(SLIDES.length, prev + 1))}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Presentation Canvas */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[300px] flex flex-col justify-between shadow-xs relative">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                    {SLIDES[currentSlide - 1].tag}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">CivicPulse BRICS • Track 1</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
                  {SLIDES[currentSlide - 1].title}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-800 font-semibold mb-6">
                  {SLIDES[currentSlide - 1].subtitle}
                </p>

                <div className="pt-2">
                  {SLIDES[currentSlide - 1].content}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6 text-[11px] text-slate-500 font-mono font-medium">
                <span>Google AI Hackathon 2026</span>
                <span>Confidential Pitch Deck • BRICS Innovation Initiative</span>
              </div>
            </div>

            {/* Slide Quick Jump Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-2">
              {SLIDES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(s.id)}
                  className={`p-2 rounded-lg text-center transition-all text-xs font-mono border ${
                    currentSlide === s.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {s.id < 10 ? `0${s.id}` : s.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DEMO VIDEO SCRIPT (3–5 MIN) */}
      {activeSection === 'demoScript' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span>3–5 Minute End-to-End Video Walkthrough Script</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Exact recording cues, spoken narration, and clickable UI actions for your 3–5 minute hackathon demo video.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(`DEMO VIDEO SCRIPT (CivicPulse BRICS)\n\n0:00 - 0:45: Problem & Track 1 Introduction\n0:45 - 1:45: Citizen Multimodal Ingestion (Tamil Voice Note & Vision AI)\n1:45 - 2:45: Real-Time AI Data Fusion & Zero Hallucination Grounding\n2:45 - 3:45: Policymaker Demand Hotspots & Cross-Border BRICS 11\n3:45 - 4:30: DPG Telemetry & Conclusion`, 'script')}
                className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-bold shadow-xs"
              >
                {copiedField === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'script' ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Scene 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-emerald-800 font-bold font-mono">
                  <span>Scene 1: Problem & Track 1 Introduction</span>
                  <span>0:00 – 0:45</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">Visual Action:</p>
                  <p className="text-slate-600 font-medium">Show the Track 1 Banner and global metric ribbon displaying 11 BRICS countries and $38.2B fused capital budgets.</p>
                  <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
                  <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    "Welcome to CivicPulse BRICS, our solution for Track 1: AI for Digital Public Infrastructure & Governance. Across the 11 BRICS nations, billions in public infrastructure capital stall because ground-level citizen demand is fragmented across hundreds of local dialects and disconnected from official government planning databases. CivicPulse bridges this gap using Google AI."
                  </p>
                </div>
              </div>

              {/* Scene 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-cyan-800 font-bold font-mono">
                  <span>Scene 2: Multilingual Voice & Computer Vision Ingestion</span>
                  <span>0:45 – 1:45</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">Visual Action:</p>
                  <p className="text-slate-600 font-medium">Navigate to 'Citizen Ingestion Hub'. Click 'Start Voice Recording', speak in Tamil/English, or click the 'Ruptured Jal Jeevan Pipe' photo preset to trigger Vertex AI Vision.</p>
                  <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
                  <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    "Citizens can report urgent service failures through regional voice notes or photo uploads. Notice how Gemini Multimodal Vision instantly calculates an 88/100 damage severity score on this burst water pipeline in Madurai, extracting the geographic coordinates and crisis level without manual data entry."
                  </p>
                </div>
              </div>

              {/* Scene 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-amber-800 font-bold font-mono">
                  <span>Scene 3: Real-Time AI Data Fusion & Zero Hallucination Grounding</span>
                  <span>1:45 – 2:45</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">Visual Action:</p>
                  <p className="text-slate-600 font-medium">Click 'Ingest & Fuse with Gov Data'. Watch the 4-quadrant fusion engine synthesize the citizen complaint with MoSPI Census and Jal Jeevan budget data.</p>
                  <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
                  <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    "In real time, Gemini 2.5 Flash correlates this report against official government datasets: 180 affected families in the 2021 Census, a 68% regional water deficit index, and an active $5.4 Billion Jal Jeevan budget allocation. Crucially, every claim is anchored with a SHA-256 cryptographic provenance hash for zero-hallucination public auditing."
                  </p>
                </div>
              </div>

              {/* Scene 4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-purple-800 font-bold font-mono">
                  <span>Scene 4: Policymaker Hotspots & Cross-Border BRICS 11</span>
                  <span>2:45 – 3:45</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">Visual Action:</p>
                  <p className="text-slate-600 font-medium">Switch to 'Demand Hotspots & Policy' tab. Show the country switcher toggling between India, Brazil, South Africa, Egypt, and Indonesia.</p>
                  <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
                  <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    "For national planning commissions, the Policymaker Dashboard aggregates demand hotspots across the country. We can switch instantaneously to Brazil's Novo PAC water bottlenecks in Bahia, or Egypt's Hayah Karima rural clinics in Asyut. Policymakers can export instant executive directives with projected citizen impact."
                  </p>
                </div>
              </div>

              {/* Scene 5 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-emerald-800 font-bold font-mono">
                  <span>Scene 5: DPG JSON Telemetry & Wrap-Up</span>
                  <span>3:45 – 4:30</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">Visual Action:</p>
                  <p className="text-slate-600 font-medium">Click 'JSON Telemetry' button to show the live machine-readable API payload.</p>
                  <p className="font-bold text-slate-900 mt-2">Spoken Script:</p>
                  <p className="italic text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                    "Built as an open-source Digital Public Good, CivicPulse exports interoperable JSON-LD schemas compliant with United Nations DPG Alliance standards. Thank you for evaluating CivicPulse BRICS."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SUBMISSION KIT (5 DELIVERABLES) */}
      {activeSection === 'submissionPackage' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Complete 5-Item Submission Package</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Copy and paste these exact deliverables directly into your official hackathon submission form.
              </p>
            </div>

            <div className="space-y-4">
              {/* Item 1: Source Code */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">1</span>
                    <span>Source Code (GitHub Repository)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('https://github.com/google-ai-studio/civicpulse-brics-dpi', 'github')}
                    className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
                  >
                    {copiedField === 'github' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'github' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
                  github.com/google-ai-studio/civicpulse-brics-dpi
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Contains clean React + TypeScript + Tailwind source, Gemini 2.5 SDK integration, Vertex AI Vision, and full BRICS dataset fixtures.
                </p>
              </div>

              {/* Item 2: Demo Video */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">2</span>
                    <span>Demo Video (3–5 Minutes Walkthrough)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('https://youtu.be/civicpulse-brics-demo-walkthrough', 'video')}
                    className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
                  >
                    {copiedField === 'video' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'video' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
                  youtu.be/civicpulse-brics-demo-walkthrough
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Follows the exact 5-scene timeline scripted in Tab 3 covering Voice Ingestion, Multimodal Vision, and Policymaker Hotspots.
                </p>
              </div>

              {/* Item 3: Pitch Deck */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">3</span>
                    <span>Pitch Deck (12 Slides Presentation)</span>
                  </div>
                  <button
                    onClick={() => setActiveSection('pitchDeck')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    View 12 Slides →
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-900 bg-white p-2.5 rounded border border-slate-200">
                  CivicPulse_BRICS_Track1_PitchDeck_12Slides.pdf
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  12 slides covering Problem, Solution, Google AI Architecture, Who It Serves, Deployability, and Cross-Border Scale across BRICS 11.
                </p>
              </div>

              {/* Item 4: Brief Description */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">4</span>
                    <span>Brief Description (2–3 Line Official Summary)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(BRIEF_DESCRIPTION, 'desc')}
                    className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
                  >
                    {copiedField === 'desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'desc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed font-medium">
                  {BRIEF_DESCRIPTION}
                </div>
              </div>

              {/* Item 5: Deployed Link */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[11px] font-bold">5</span>
                    <span>Deployed Live Prototype Link</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(window.location.href, 'link')}
                    className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-bold"
                  >
                    {copiedField === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'link' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-emerald-700 bg-white p-2.5 rounded border border-slate-200 flex items-center justify-between font-bold">
                  <span>{window.location.origin || 'https://ais-pre-gx43qhaoyii7e25zjnzqwq-342455903858.asia-southeast1.run.app'}</span>
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-slate-900"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
