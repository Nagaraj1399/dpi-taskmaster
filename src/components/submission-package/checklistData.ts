import { CheckCircle2, Cpu, FileText, Globe, Radio, type LucideIcon } from 'lucide-react';
import type { AppTab } from '../../shared/types';

export interface BuildCriterionItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  targetTab: Exclude<AppTab, 'package'>;
  icon: LucideIcon;
  iconContainerClass: string;
  badgeClass: string;
  buttonTextClass: string;
}

/** Mandatory evaluation checklist items mapped to live navigable tabs. */
export const BUILD_CRITERIA_ITEMS: readonly BuildCriterionItem[] = [
  {
    id: 'e2e-flow',
    title: '1. Functioning End-to-End Flow for Core Use Case',
    badge: 'COMPLETE',
    description:
      'Citizen inputs voice/photo -> server AI extracts grievance entity -> fuses with Census & budget registries -> surfaces demand hotspots -> generates procurement actions.',
    actionLabel: 'Test Flow',
    targetTab: 'fusion',
    icon: CheckCircle2,
    iconContainerClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    buttonTextClass: 'text-emerald-700',
  },
  {
    id: 'google-ai',
    title: '2. Server-Side Google AI Integration (GenAI & Vision)',
    badge: 'COMPLETE',
    description:
      'Integrates @google/genai on the Express backend for multilingual data fusion and multimodal infrastructure damage severity computation (0-100 score).',
    actionLabel: 'Test Vision AI',
    targetTab: 'ingestion',
    icon: Cpu,
    iconContainerClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    badgeClass: 'bg-cyan-100 text-cyan-800',
    buttonTextClass: 'text-cyan-700',
  },
  {
    id: 'public-datasets',
    title: '3. Public Datasets & Live Endpoint Verification',
    badge: 'COMPLETE',
    description:
      'National census baselines (MoSPI, IBGE, Rosstat), Jal Jeevan / Novo PAC investment registers, WHO/FAO/Copernicus feeds, plus optional SSRF-guarded external API probing.',
    actionLabel: 'Explore Datasets',
    targetTab: 'datasets',
    icon: FileText,
    iconContainerClass: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-800',
    buttonTextClass: 'text-amber-700',
  },
  {
    id: 'brics-scale',
    title: '4. Cross-Border Applicability across 11 BRICS+ Nations',
    badge: '11 NATIONS',
    description:
      'Sovereign data profiles, administrative hierarchies, and capital program models for Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, UAE, and Indonesia.',
    actionLabel: 'Switch Countries',
    targetTab: 'policy',
    icon: Globe,
    iconContainerClass: 'bg-purple-100 text-purple-700 border-purple-200',
    badgeClass: 'bg-purple-100 text-purple-800',
    buttonTextClass: 'text-purple-700',
  },
  {
    id: 'multilingual-voice',
    title: '5. Multilingual & Voice Telephony Support',
    badge: 'COMPLETE',
    description:
      'Web Audio MediaRecorder capture, 7-language UI translation dictionary, and interactive toll-free IVR dialpad simulator.',
    actionLabel: 'Record Voice',
    targetTab: 'ingestion',
    icon: Radio,
    iconContainerClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800',
    buttonTextClass: 'text-emerald-700',
  },
];

export interface DemoScene {
  id: string;
  title: string;
  timeRange: string;
  headerColor: string;
  visualAction: string;
  spokenScript: string;
}

/** 3-5 minute demo walkthrough scenes for video recording. */
export const DEMO_SCENES: readonly DemoScene[] = [
  {
    id: 'scene-1',
    title: 'Scene 1: Problem & Track 1 Introduction',
    timeRange: '0:00 – 0:45',
    headerColor: 'text-emerald-800',
    visualAction:
      'Show the Track 1 Banner and global metric ribbon displaying 11 BRICS+ countries and baseline public capital plans.',
    spokenScript:
      '"Welcome to CivicPulse BRICS for Track 1: AI for Digital Public Infrastructure & Governance. Across partner nations, public infrastructure allocations can stall when local citizen reports stay fragmented across dialects and isolated databases."',
  },
  {
    id: 'scene-2',
    title: 'Scene 2: Multilingual Voice & Computer Vision Ingestion',
    timeRange: '0:45 – 1:45',
    headerColor: 'text-cyan-800',
    visualAction:
      'Navigate to Citizen Ingestion Hub. Record a voice note or select a photo preset / upload an image to trigger server-side Gemini Vision.',
    spokenScript:
      '"Citizens can report disruptions through voice recordings or infrastructure photographs. Server-side Gemini Multimodal inspects uploaded photos to extract structural defect indicators and a 0 to 100 severity rating."',
  },
  {
    id: 'scene-3',
    title: 'Scene 3: Real-Time AI Data Fusion & SHA-256 Grounding',
    timeRange: '1:45 – 2:45',
    headerColor: 'text-amber-800',
    visualAction:
      'Click Ingest & Fuse with Official Data to correlate the complaint with census figures, baseline indices, and Jal Jeevan capital programs.',
    spokenScript:
      '"On the Express backend, Gemini correlates the complaint with national census context, deterministic infrastructure gap scoring, and active capital budgets, generating a reproducible SHA-256 payload digest for audit transparency."',
  },
  {
    id: 'scene-4',
    title: 'Scene 4: Policymaker Hotspots & Cross-Border BRICS 11',
    timeRange: '2:45 – 3:45',
    headerColor: 'text-purple-800',
    visualAction:
      'Switch to Demand Hotspots & Policy and toggle between India, Brazil, South Africa, and Egypt.',
    spokenScript:
      '"National planners can filter demand hotspots across sectors and switch jurisdictions immediately between India, Brazil, Egypt, and all 11 BRICS+ baselines."',
  },
  {
    id: 'scene-5',
    title: 'Scene 5: DPG JSON Telemetry & Wrap-Up',
    timeRange: '3:45 – 4:30',
    headerColor: 'text-emerald-800',
    visualAction:
      'Click JSON Telemetry in the header to inspect and export the structured JSON schema.',
    spokenScript:
      '"Built as an open Digital Public Good with strict Zod schema validation, CivicPulse exports interoperable JSON telemetry ready for public-sector deployment."',
  },
];
