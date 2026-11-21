import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Check,
  CheckCircle2,
  Database,
  DollarSign,
  FileJson,
  Globe,
  Link2,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { MODAL_SAVE_CLOSE_DELAY_MS } from '../../shared/constants';
import type { BricsCountry, DatasetVerificationResult } from '../../shared/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from '../ui/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useApiVerification } from './hooks/useApiVerification';
import { useDatasetDraft } from './hooks/useDatasetDraft';
import { useJsonIO } from './hooks/useJsonIO';
import { ApiConfigTab } from './tabs/ApiConfigTab';
import { DemographicsTab } from './tabs/DemographicsTab';
import { InfrastructureTab } from './tabs/InfrastructureTab';
import { InvestmentTab } from './tabs/InvestmentTab';
import { PresetsJsonTab } from './tabs/PresetsJsonTab';
import { PublicFeedsTab } from './tabs/PublicFeedsTab';
import { VerificationResultPanel } from './VerificationResultPanel';

type StudioTabId =
  'demographics' | 'infrastructure' | 'investment' | 'publicFeeds' | 'apiConfig' | 'jsonPreset';

interface StudioTabConfig {
  id: StudioTabId;
  label: string;
  icon: LucideIcon;
  iconClassName?: string;
}

const STUDIO_TABS: readonly StudioTabConfig[] = [
  { id: 'demographics', label: '1. Demographics', icon: Users },
  { id: 'infrastructure', label: '2. Infrastructure Indices', icon: Activity },
  { id: 'investment', label: '3. Capital Budgets & Projects', icon: DollarSign },
  { id: 'publicFeeds', label: '4. WHO / FAO Feeds', icon: Globe },
  {
    id: 'apiConfig',
    label: '5. Connect Real Gov API',
    icon: Link2,
    iconClassName: 'text-cyan-700',
  },
  {
    id: 'jsonPreset',
    label: 'Presets & Raw JSON',
    icon: FileJson,
    iconClassName: 'text-amber-700',
  },
];

export interface DatasetStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: BricsCountry;
  onSaveCountryData: (
    updatedCountry: BricsCountry,
    verification?: DatasetVerificationResult
  ) => void;
}

/**
 * Accessible Radix-powered modal for editing official BRICS country baseline datasets,
 * importing/exporting Zod-validated JSON specs, and running live API verification before saving.
 */
export const DatasetStudioModal: React.FC<DatasetStudioModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  onSaveCountryData,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTabId>('demographics');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verification = useApiVerification();

  const handleDraftDirty = () => {
    setSaveSuccessMsg(false);
    verification.reset();
  };

  const draft = useDatasetDraft(currentCountry, isOpen, handleDraftDirty);

  const jsonIO = useJsonIO((imported) => {
    draft.replaceDraft(imported);
  });

  const [prevModalKey, setPrevModalKey] = useState<string>(`${isOpen}:${currentCountry.code}`);
  const currentModalKey = `${isOpen}:${currentCountry.code}`;
  if (prevModalKey !== currentModalKey) {
    setPrevModalKey(currentModalKey);
    if (isOpen) {
      verification.reset();
      jsonIO.clearMessages();
      setSaveSuccessMsg(false);
    }
  }

  // Clear pending close timeout on unmount.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleVerifyWithApi = async () => {
    setSaveSuccessMsg(false);
    await verification.verify(draft.formData, draft.apiConfig);
  };

  const handleSaveAndApply = () => {
    if (verification.status !== 'passed' || !verification.result?.verified) {
      return;
    }
    const payloadToSave = verification.verifiedDataset ?? draft.formData;
    onSaveCountryData(payloadToSave, verification.result);
    setSaveSuccessMsg(true);

    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, MODAL_SAVE_CLOSE_DELAY_MS);
  };

  const canSave = verification.status === 'passed' && verification.result?.verified === true;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-white border border-slate-200 text-slate-900 shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="p-5 pr-12 bg-white border-b border-slate-200 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
            <Database className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                Official Dataset Studio &amp; API Verification
              </DialogTitle>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold font-mono border border-emerald-200">
                Real Data Entry &amp; Live API Studio
              </span>
            </div>
            <DialogDescription className="text-xs text-slate-600 mt-0.5 font-medium">
              Edit official baseline metrics, optionally probe a live government REST endpoint, and
              verify schema integrity before applying changes.
            </DialogDescription>
          </div>
        </div>

        {/* Accessible Radix Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as StudioTabId)}
          className="flex flex-col flex-1 min-h-0"
        >
          <TabsList className="w-full justify-start rounded-none border-x-0 border-t-0 bg-slate-50 border-b border-slate-200 px-5 py-1.5 gap-1.5 overflow-x-auto scrollbar-thin">
            {STUDIO_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${tab.iconClassName ?? ''}`} aria-hidden="true" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[60vh] bg-white">
            <TabsContent value="demographics" className="mt-0">
              <DemographicsTab
                formData={draft.formData}
                onUpdateDemographic={draft.updateDemographicField}
                onUpdateRuralUrban={draft.updateRuralUrbanSplit}
                onUpdateCensusAgency={draft.updateCensusAgency}
              />
            </TabsContent>

            <TabsContent value="infrastructure" className="mt-0">
              <InfrastructureTab
                formData={draft.formData}
                onUpdateInfrastructure={draft.updateInfrastructureField}
              />
            </TabsContent>

            <TabsContent value="investment" className="mt-0">
              <InvestmentTab
                formData={draft.formData}
                onUpdateInvestment={draft.updateInvestmentField}
                onAddProgram={draft.addProgram}
                onRemoveProgram={draft.removeProgram}
                onUpdateProgram={draft.updateProgramField}
              />
            </TabsContent>

            <TabsContent value="publicFeeds" className="mt-0">
              <PublicFeedsTab
                formData={draft.formData}
                onUpdatePublicFeed={draft.updatePublicFeedField}
              />
            </TabsContent>

            <TabsContent value="apiConfig" className="mt-0">
              <ApiConfigTab
                apiConfig={draft.apiConfig}
                onUpdateApiConfig={draft.updateApiConfigField}
              />
            </TabsContent>

            <TabsContent value="jsonPreset" className="mt-0">
              <PresetsJsonTab
                formData={draft.formData}
                rawJsonText={draft.rawJsonText}
                onChangeRawJson={draft.setRawJsonText}
                onApplyPreset={draft.applyPreset}
                onApplyRawJson={jsonIO.applyRawJson}
                onExportJson={jsonIO.exportJson}
                onImportJsonFile={jsonIO.importJsonFile}
                jsonError={jsonIO.jsonError}
                jsonSuccess={jsonIO.jsonSuccess}
              />
            </TabsContent>

            <VerificationResultPanel
              status={verification.status}
              result={verification.result}
              errorMessage={verification.errorMessage}
            />

            {saveSuccessMsg && (
              <div
                role="status"
                aria-live="polite"
                className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center space-x-2 font-bold shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>Verified dataset committed to the active platform registry.</span>
              </div>
            )}
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center space-x-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>
              {canSave
                ? 'Verification passed — ready to save to active registry'
                : 'Run Verify with API before saving changes'}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleVerifyWithApi}
              disabled={verification.status === 'verifying'}
              className={`flex-1 sm:flex-initial ${SECONDARY_BUTTON_CLASS} text-emerald-800`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${verification.status === 'verifying' ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>
                {verification.status === 'verifying' ? 'Verifying with API...' : 'Verify with API'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndApply}
              disabled={!canSave}
              className={`flex-1 sm:flex-initial ${PRIMARY_BUTTON_CLASS}`}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Save &amp; Apply Real Data</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
