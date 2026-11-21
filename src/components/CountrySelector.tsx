import React from 'react';
import { Globe2 } from 'lucide-react';
import { BRICS_COUNTRIES } from '../shared/bricsData';
import type { BricsCountryCode } from '../shared/types';

interface CountrySelectorProps {
  selectedCountryCode: BricsCountryCode;
  onSelectCountry: (code: BricsCountryCode) => void;
}

/** Horizontal BRICS+ member state selector bar with explicit pressed state. */
export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountryCode,
  onSelectCountry,
}) => {
  const countries = Object.values(BRICS_COUNTRIES);

  return (
    <div
      id="brics-country-selector-container"
      className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-xs text-slate-700 font-semibold">
          <Globe2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="text-slate-700">Select BRICS Member State:</span>
        </div>

        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin"
          role="group"
          aria-label="BRICS Member States"
        >
          {countries.map((country) => {
            const isSelected = country.code === selectedCountryCode;
            return (
              <button
                key={country.code}
                id={`btn-country-select-${country.code.toLowerCase()}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCountry(country.code)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-sm leading-none" aria-hidden="true">
                  {country.flag}
                </span>
                <span>{country.code}</span>
                <span className="hidden lg:inline text-[11px] text-slate-600">
                  ({country.name.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
