import React from 'react';
import {
  Check,
  ChevronDown,
  Database,
  Globe,
  Landmark,
  Languages,
  Layers,
  Presentation,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, useLanguage } from '../context/LanguageContext';
import type { AppTab, BricsCountryCode } from '../shared/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavTabConfig {
  id: AppTab;
  domId: string;
  translationKey: string;
  defaultLabel: string;
  mobileLabel: string;
  icon: LucideIcon;
  isHighlighted?: boolean;
  iconClassName?: string;
}

const NAV_TABS: readonly NavTabConfig[] = [
  {
    id: 'fusion',
    domId: 'nav-tab-fusion',
    translationKey: 'nav.tab.fusion',
    defaultLabel: 'AI Data Fusion',
    mobileLabel: 'AI Fusion',
    icon: Radio,
  },
  {
    id: 'policy',
    domId: 'nav-tab-policy',
    translationKey: 'nav.tab.policy',
    defaultLabel: 'Demand Hotspots & Policy',
    mobileLabel: 'Policy',
    icon: Landmark,
    iconClassName: 'text-amber-600',
  },
  {
    id: 'ingestion',
    domId: 'nav-tab-ingestion',
    translationKey: 'nav.tab.ingestion',
    defaultLabel: 'Citizen Ingestion Hub',
    mobileLabel: 'Ingestion',
    icon: Layers,
  },
  {
    id: 'datasets',
    domId: 'nav-tab-datasets',
    translationKey: 'nav.tab.datasets',
    defaultLabel: 'Official Datasets',
    mobileLabel: 'Datasets',
    icon: Database,
  },
  {
    id: 'gis',
    domId: 'nav-tab-gis',
    translationKey: 'nav.tab.gis',
    defaultLabel: 'GIS Heatmap',
    mobileLabel: 'GIS',
    icon: Globe,
  },
  {
    id: 'package',
    domId: 'nav-tab-package',
    translationKey: 'nav.tab.package',
    defaultLabel: 'Pitch Deck & Kit',
    mobileLabel: 'Pitch Deck',
    icon: Presentation,
    isHighlighted: true,
  },
];

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCountryCode: BricsCountryCode;
  onOpenTelemetry: () => void;
}

/**
 * Primary application header containing config-driven navigation tabs,
 * Radix UI language selector dropdown, and JSON telemetry trigger.
 */
export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCountryCode,
  onOpenTelemetry,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const currentLang =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) ?? SUPPORTED_LANGUAGES[0];

  return (
    <header
      id="civicpulse-header"
      data-country={selectedCountryCode}
      className="bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center space-x-3 text-left group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            onClick={() => setActiveTab('fusion')}
            title="Return to AI Data Fusion Engine"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  {t('nav.brand', 'CivicPulse')}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  BRICS 11
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>DPG Architecture</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate max-w-xs sm:max-w-md">
                {t('nav.tagline', 'Multi-Jurisdictional AI Governance & Data-Fusion Engine')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary sections"
            className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80"
          >
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabClass = tab.isHighlighted
                ? isActive
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-amber-900 hover:bg-amber-100 bg-amber-50 border border-amber-200'
                : isActive
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/90'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60';

              return (
                <button
                  key={tab.id}
                  id={tab.domId}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${tabClass}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      tab.isHighlighted
                        ? ''
                        : (tab.iconClassName ?? (isActive ? 'text-emerald-600' : 'text-slate-500'))
                    }`}
                    aria-hidden="true"
                  />
                  <span>{t(tab.translationKey, tab.defaultLabel)}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="btn-language-selector"
                  type="button"
                  aria-label={`Select interface language (current: ${currentLang?.label ?? 'English'})`}
                  className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" aria-hidden="true" />
                  <span>
                    {currentLang?.flag} {currentLang?.nativeLabel}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5"
              >
                <DropdownMenuLabel className="text-[10px] font-bold tracking-wider text-slate-600 uppercase px-2 py-1">
                  Interface Language
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer ${
                      language === lang.code
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-sm" aria-hidden="true">
                        {lang.flag}
                      </span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {language === lang.code && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 ml-2" aria-hidden="true" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              id="btn-view-telemetry-json"
              type="button"
              onClick={onOpenTelemetry}
              aria-label="Inspect JSON Data Fusion Telemetry"
              className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-emerald-200 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span className="hidden sm:inline">{t('nav.telemetry', 'JSON Telemetry')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          aria-label="Mobile sections"
          className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 text-xs overflow-x-auto gap-1"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const mobileClass = tab.isHighlighted
              ? isActive
                ? 'bg-amber-600 text-white font-bold'
                : 'text-amber-900 bg-amber-50 font-bold'
              : isActive
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-700 bg-slate-100 font-medium';

            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 ${mobileClass}`}
              >
                {tab.mobileLabel}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
