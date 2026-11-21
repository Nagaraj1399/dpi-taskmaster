import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  Edit3,
  RefreshCw,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { BricsCountry, DatasetVerificationResult } from '../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { DatasetStudioModal } from '../dataset-studio/DatasetStudioModal';
import {
  CARD_SURFACE_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  SUBTLE_PANEL_CLASS,
} from '../ui/styles';
import {
  DemographicsCard,
  InfrastructureCard,
  InvestmentCard,
  PublicFeedsCard,
} from './DatasetCards';
import { useQuickApiVerify } from './hooks/useQuickApiVerify';

type DatasetCategory = 'all' | 'demographics' | 'infrastructure' | 'investment' | 'publicFeeds';

interface FilterTabConfig {
  id: DatasetCategory;
  translationKey: string;
  defaultLabel: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

const FILTER_TABS: readonly FilterTabConfig[] = [
  { id: 'all', translationKey: 'datasets.tab.all', defaultLabel: 'All Verified Datasets' },
  {
    id: 'demographics',
    translationKey: 'datasets.tab.demographics',
    defaultLabel: '1. Demographic Census',
    icon: Users,
  },
  {
    id: 'infrastructure',
    translationKey: 'datasets.tab.infrastructure',
    defaultLabel: '2. Infrastructure Indices',
    icon: Activity,
  },
  {
    id: 'investment',
    translationKey: 'datasets.tab.investment',
    defaultLabel: '3. Public Investment Plans',
    icon: DollarSign,
  },
  {
    id: 'publicFeeds',
    translationKey: 'datasets.tab.publicFeeds',
    defaultLabel: '4. Global Public Feeds (WHO / FAO)',
    icon: Cpu,
    iconClassName: 'text-cyan-700',
  },
];

interface GovernmentDatasetsExplorerProps {
  currentCountry: BricsCountry;
  onUpdateCountryData?: (updated: BricsCountry, verification?: DatasetVerificationResult) => void;
}

/**
 * Displays national demographic, infrastructure, investment, and global feed baselines
 * with live schema verification and a Radix-powered Dataset Studio modal for real data entry.
 */
export const GovernmentDatasetsExplorer: React.FC<GovernmentDatasetsExplorerProps> = ({
  currentCountry,
  onUpdateCountryData,
}) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<DatasetCategory>('all');
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  const quickVerify = useQuickApiVerify();
  const displayedDigest =
    currentCountry.sha256Digest ?? quickVerify.lastDigest ?? 'Not yet verified in this session';

  const handleQuickApiVerify = async () => {
    await quickVerify.verifyCountryDataset(currentCountry);
  };

  const handleSaveData = (updated: BricsCountry, verification?: DatasetVerificationResult) => {
    if (verification?.verified && verification.sha256Digest) {
      quickVerify.setLastDigest(verification.sha256Digest);
    }
    if (onUpdateCountryData) {
      onUpdateCountryData(updated, verification);
    }
  };

  return (
    <div id="gov-datasets-explorer" className="space-y-6">
      {/* Header Banner */}
      <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Database className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>{t('datasets.header.title', 'Official Sovereign Repositories')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentCountry.name} Official Repositories</span>
              <span className="text-2xl" aria-hidden="true">
                {currentCountry.flag}
              </span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {t(
                'datasets.header.subtitle',
                'Verified baseline statistical metrics & capital project registries.'
              )}{' '}
              Sourced under {currentCountry.censusAgency}. Enter real data, configure live API
              endpoints, and verify schema integrity in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsStudioOpen(true)}
              className={PRIMARY_BUTTON_CLASS}
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('datasets.btn.enterRealData', 'Enter Real Data')}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickApiVerify}
              disabled={quickVerify.status === 'verifying'}
              className={`${SECONDARY_BUTTON_CLASS} text-emerald-800`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${quickVerify.status === 'verifying' ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{t('datasets.btn.verifyApi', 'Verify with Live API')}</span>
            </button>
          </div>
        </div>

        {/* Honest Status / Error Banner */}
        {quickVerify.statusMessage && (
          <div
            role={quickVerify.status === 'failed' ? 'alert' : 'status'}
            aria-live="polite"
            className={`mt-4 p-2.5 rounded-xl text-xs flex items-center space-x-2 border ${
              quickVerify.status === 'failed'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {quickVerify.status === 'failed' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            )}
            <span className="font-mono font-bold">{quickVerify.statusMessage}</span>
          </div>
        )}

        {/* Data Architecture Card */}
        <div
          className={`mt-4 p-3 ${SUBTLE_PANEL_CLASS} text-xs text-slate-700 flex items-start space-x-3`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <span className="font-bold text-slate-900">
              Sovereign Data Architecture &amp; Verification Protocol:
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Official baselines (Demographic census, infrastructure indices, and capital
              allocations) are validated against Zod schema constraints and optionally probed
              against external open-data REST endpoints before changes are persisted.
            </p>
          </div>
        </div>

        {/* Config-Driven Category Filter Bar */}
        <div
          className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 overflow-x-auto scrollbar-thin"
          role="group"
          aria-label="Dataset category filters"
        >
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? 'text-white' : (tab.iconClassName ?? '')}`}
                    aria-hidden="true"
                  />
                )}
                <span>{t(tab.translationKey, tab.defaultLabel)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Dataset Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(activeCategory === 'all' || activeCategory === 'publicFeeds') && (
          <PublicFeedsCard country={currentCountry} onOpenStudio={() => setIsStudioOpen(true)} />
        )}
        {(activeCategory === 'all' || activeCategory === 'demographics') && (
          <DemographicsCard country={currentCountry} onOpenStudio={() => setIsStudioOpen(true)} />
        )}
        {(activeCategory === 'all' || activeCategory === 'infrastructure') && (
          <InfrastructureCard country={currentCountry} onOpenStudio={() => setIsStudioOpen(true)} />
        )}
        {(activeCategory === 'all' || activeCategory === 'investment') && (
          <InvestmentCard country={currentCountry} onOpenStudio={() => setIsStudioOpen(true)} />
        )}
      </div>

      {/* Honest Sourcing & Canonical SHA-256 Footnote */}
      <div
        className={`${SUBTLE_PANEL_CLASS} rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-600`}
      >
        <div className="flex items-center space-x-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>
            Sovereign Registry:{' '}
            <strong className="text-slate-900">{currentCountry.censusAgency}</strong> •
            Schema-validated baseline &amp; optional REST API probe
          </span>
        </div>
        <div className="font-mono text-[11px] text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 truncate max-w-md font-bold">
          Canonical SHA-256: {displayedDigest}
        </div>
      </div>

      <DatasetStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        currentCountry={currentCountry}
        onSaveCountryData={handleSaveData}
      />
    </div>
  );
};
