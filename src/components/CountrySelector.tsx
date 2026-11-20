import React from 'react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { BricsCountryCode } from '../types';
import { Globe2 } from 'lucide-react';

interface CountrySelectorProps {
  selectedCountryCode: BricsCountryCode;
  onSelectCountry: (code: BricsCountryCode) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountryCode,
  onSelectCountry,
}) => {
  const countries = Object.values(BRICS_COUNTRIES);

  return (
    <div id="brics-country-selector-container" className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-xs text-slate-700 font-semibold">
          <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">Select BRICS Member State:</span>
        </div>

        {/* Scrollable Badges / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          {countries.map((c) => {
            const isSelected = c.code === selectedCountryCode;
            return (
              <button
                key={c.code}
                id={`btn-country-select-${c.code.toLowerCase()}`}
                onClick={() => onSelectCountry(c.code as BricsCountryCode)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-sm leading-none">{c.flag}</span>
                <span>{c.code}</span>
                <span className="hidden lg:inline text-[11px] text-slate-400">({c.name.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
