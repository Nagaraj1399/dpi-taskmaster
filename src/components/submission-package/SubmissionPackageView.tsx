import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Play,
  Presentation,
  Sparkles,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { UI_NOTIFICATION_TIMEOUT_MS } from '../../shared/constants';
import type { AppTab, BricsCountry } from '../../shared/types';
import { CARD_SURFACE_CLASS, PRIMARY_BUTTON_CLASS } from '../ui/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BuildChecklistSection } from './BuildChecklistSection';
import { DemoScriptSection } from './DemoScriptSection';
import { PitchDeckSection } from './PitchDeckSection';
import { SubmissionKitSection } from './SubmissionKitSection';

type PackageSection = 'buildChecklist' | 'pitchDeck' | 'demoScript' | 'submissionPackage';

interface SectionTabConfig {
  id: PackageSection;
  label: string;
  icon: LucideIcon;
}

const SECTION_TABS: readonly SectionTabConfig[] = [
  { id: 'buildChecklist', label: '1. Build Criteria (5/5 Complete)', icon: CheckCircle2 },
  { id: 'pitchDeck', label: '2. Pitch Deck (12 Slides)', icon: Presentation },
  { id: 'demoScript', label: '3. Demo Video Script (3–5 Min)', icon: Video },
  { id: 'submissionPackage', label: '4. Submission Kit (5 Items)', icon: FileText },
];

interface SubmissionPackageViewProps {
  currentCountry: BricsCountry;
  onNavigateTab: (tab: Exclude<AppTab, 'package'>) => void;
}

/**
 * Evaluation package hub containing the build criteria checklist, 12-slide pitch deck,
 * 5-scene demo video script, and copyable submission deliverables inside Radix Tabs.
 */
export const SubmissionPackageView: React.FC<SubmissionPackageViewProps> = ({
  currentCountry,
  onNavigateTab,
}) => {
  const [activeSection, setActiveSection] = useState<PackageSection>('buildChecklist');
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      if (copyTimerRef.current !== null) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopiedField(null), UI_NOTIFICATION_TIMEOUT_MS);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div id="submission-package-view" className="space-y-6">
      <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Official Submission &amp; Evaluation Center ({currentCountry.name})</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Hackathon Evaluation Package &amp; 12-Slide Pitch Deck
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Complete submission kit matching all 5 Build criteria and 5 Submission deliverables
              for <strong>Track 1: AI for Digital Public Infrastructure &amp; Governance</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('fusion')}
            className={PRIMARY_BUTTON_CLASS}
          >
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Test Live End-to-End App</span>
          </button>
        </div>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={(val) => setActiveSection(val as PackageSection)}
        className="space-y-4"
      >
        <TabsList className="w-full flex flex-wrap sm:flex-nowrap gap-1.5 p-1.5">
          {SECTION_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex-1 gap-2 py-2.5">
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="buildChecklist" className="mt-0">
          <BuildChecklistSection onNavigateTab={onNavigateTab} />
        </TabsContent>

        <TabsContent value="pitchDeck" className="mt-0">
          <PitchDeckSection
            currentSlide={currentSlide}
            onChangeSlide={setCurrentSlide}
            onNavigateTab={onNavigateTab}
          />
        </TabsContent>

        <TabsContent value="demoScript" className="mt-0">
          <DemoScriptSection copiedField={copiedField} onCopy={copyToClipboard} />
        </TabsContent>

        <TabsContent value="submissionPackage" className="mt-0">
          <SubmissionKitSection
            copiedField={copiedField}
            onCopy={copyToClipboard}
            onOpenPitchDeck={() => setActiveSection('pitchDeck')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
