import React from 'react';
import { 
  ShieldCheck, Database, Radio, Globe, Layers, Sparkles, 
  Terminal, Landmark, Presentation, Languages, ChevronDown, Check 
} from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  activeTab: 'fusion' | 'ingestion' | 'policy' | 'datasets' | 'gis' | 'package';
  setActiveTab: (tab: 'fusion' | 'ingestion' | 'policy' | 'datasets' | 'gis' | 'package') => void;
  selectedCountryCode: string;
  onOpenTelemetry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCountryCode,
  onOpenTelemetry,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header id="civicpulse-header" className="bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Persona */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setActiveTab('fusion')}
            title="Return to AI Data Fusion Engine"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">{t('nav.brand', 'CivicPulse')}</span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  BRICS 11
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  DPG Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                {t('nav.tagline', 'Multi-Jurisdictional AI Governance & Data-Fusion Engine')}
              </p>
            </div>
          </div>

          {/* Navigation Tabs with clean Radix-inspired pill styling */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              id="nav-tab-fusion"
              onClick={() => setActiveTab('fusion')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'fusion'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${activeTab === 'fusion' ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{t('nav.tab.fusion', 'AI Data Fusion')}</span>
            </button>

            <button
              id="nav-tab-policy"
              onClick={() => setActiveTab('policy')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'policy'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('nav.tab.policy', 'Demand Hotspots & Policy')}</span>
            </button>

            <button
              id="nav-tab-ingestion"
              onClick={() => setActiveTab('ingestion')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ingestion'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeTab === 'ingestion' ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{t('nav.tab.ingestion', 'Citizen Ingestion Hub')}</span>
            </button>

            <button
              id="nav-tab-datasets"
              onClick={() => setActiveTab('datasets')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'datasets'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${activeTab === 'datasets' ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{t('nav.tab.datasets', 'Official Datasets')}</span>
            </button>

            <button
              id="nav-tab-gis"
              onClick={() => setActiveTab('gis')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'gis'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${activeTab === 'gis' ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{t('nav.tab.gis', 'GIS Heatmap')}</span>
            </button>

            <button
              id="nav-tab-package"
              onClick={() => setActiveTab('package')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'package'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>{t('nav.tab.package', 'Pitch Deck & Kit')}</span>
            </button>
          </nav>

          {/* Quick Actions / Radix DropdownMenu for Language & DPG Telemetry Button */}
          <div className="flex items-center space-x-2.5">
            {/* Language Selector Dropdown powered by Radix UI DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="btn-language-selector"
                  className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  title="Select Interface Language"
                >
                  <Languages className="w-3.5 h-3.5 text-teal-600" />
                  <span>{currentLang.flag} {currentLang.nativeLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5">
                <DropdownMenuLabel className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-2 py-1">
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
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeLabel}</span>
                    </span>
                    {language === lang.code && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 ml-2" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              id="btn-view-telemetry-json"
              onClick={onOpenTelemetry}
              className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-emerald-200 transition-all shadow-xs"
              title="Inspect DPG JSON Data Fusion Telemetry"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t('nav.telemetry', 'JSON Telemetry')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-200 text-xs overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('fusion')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium ${activeTab === 'fusion' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            AI Fusion
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium ${activeTab === 'policy' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            Policy
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium ${activeTab === 'ingestion' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            Ingestion
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium ${activeTab === 'datasets' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            Datasets
          </button>
          <button
            onClick={() => setActiveTab('gis')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-medium ${activeTab === 'gis' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            GIS
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`px-2.5 py-1 rounded-lg shrink-0 font-bold ${activeTab === 'package' ? 'bg-amber-500 text-white' : 'text-amber-800 bg-amber-50'}`}
          >
            Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
};

