import React from 'react';
import { Activity, DollarSign, Edit3, Globe, Users } from 'lucide-react';
import { HEALTH_CENTERS_SCORE_MULTIPLIER } from '../../shared/constants';
import type { BricsCountry } from '../../shared/types';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';

interface DatasetCardProps {
  country: BricsCountry;
  onOpenStudio: () => void;
}

/** Category D card: WHO Health, FAO Water Stress, Copernicus Thermal, and Meteorological alerts. */
export const PublicFeedsCard: React.FC<DatasetCardProps> = ({ country, onOpenStudio }) => {
  const feeds = country.publicDataFeeds;
  const alertBadgeClass =
    feeds.meteorologicalAlertLevel === 'Normal'
      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
      : feeds.meteorologicalAlertLevel === 'Advisory'
        ? 'bg-amber-50 text-amber-800 border border-amber-200'
        : 'bg-red-50 text-red-800 border border-red-200';

  return (
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4 lg:col-span-3`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Globe className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Global Public Data Feeds (WHO, FAO, Copernicus)
            </h3>
            <p className="text-[11px] text-slate-600 font-medium">
              WHO Health Data, FAO Agriculture Water Stress, Copernicus Satellite &amp; National
              Meteorological Services
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenStudio}
          className="text-[11px] flex items-center space-x-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-lg transition-all font-bold"
        >
          <Edit3 className="w-3 h-3" aria-hidden="true" />
          <span>Edit Feeds</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${SUBTLE_PANEL_CLASS} p-3.5 space-y-1.5`}>
          <div className="text-[11px] font-bold text-slate-700">WHO Health Equity Index</div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">
            {feeds.whoHealthIndex ?? 0}/100
          </div>
          <p className="text-[10px] text-slate-600 font-medium">
            Sourced from WHO Global Health Observatory &amp; Universal Health Coverage indicators.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3.5 space-y-1.5`}>
          <div className="text-[11px] font-bold text-slate-700">FAO Agricultural Water Stress</div>
          <div className="text-xl font-extrabold text-amber-800 font-mono">
            {feeds.faoAgriWaterStress ?? 0}%
          </div>
          <p className="text-[10px] text-slate-600 font-medium">
            FAO AQUASTAT agricultural water withdrawal and soil vulnerability index.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3.5 space-y-1.5`}>
          <div className="text-[11px] font-bold text-slate-700">
            Copernicus Satellite Thermal/NDVI
          </div>
          <div className="text-xl font-extrabold text-cyan-800 font-mono">
            {feeds.copernicusSatelliteHeatScore ?? 0}/100
          </div>
          <p className="text-[10px] text-slate-600 font-medium">
            Copernicus Climate Change Service (C3S) surface anomalies &amp; vegetative index.
          </p>
        </div>

        <div className={`${SUBTLE_PANEL_CLASS} p-3.5 space-y-1.5`}>
          <div className="text-[11px] font-bold text-slate-700">Meteorological Alert Level</div>
          <div
            className={`text-base font-extrabold font-mono px-2 py-1 rounded inline-block mt-0.5 ${alertBadgeClass}`}
          >
            {feeds.meteorologicalAlertLevel ?? 'Normal'}
          </div>
          <p className="text-[10px] text-slate-600 font-medium">
            National Meteorological Services (IMD / INMET / Roshydromet) weather warnings.
          </p>
        </div>
      </div>
    </div>
  );
};

/** Category A card: National Demographic Census Data. */
export const DemographicsCard: React.FC<DatasetCardProps> = ({ country, onOpenStudio }) => (
  <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
          <Users className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Demographic Census Data</h3>
          <p className="text-[11px] text-slate-600 font-medium">National Demographic Baseline</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenStudio}
        className="text-[11px] flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 rounded-lg transition-all font-bold"
      >
        <Edit3 className="w-3 h-3" aria-hidden="true" />
        <span>Edit</span>
      </button>
    </div>

    <div className="space-y-3">
      <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
        <div className="text-[11px] text-slate-600 font-medium">
          Total Population (Official Census)
        </div>
        <div className="text-lg font-extrabold text-slate-900 mt-0.5">
          {country.demographics.totalPopulation}
        </div>
        <div className="text-[10px] text-slate-600 mt-1 font-medium">
          Source: {country.censusAgency}
        </div>
      </div>

      <div className={`${SUBTLE_PANEL_CLASS} p-3 space-y-2`}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-700 font-medium">
            Rural Population:{' '}
            <strong className="text-emerald-700 font-bold">
              {country.demographics.ruralPercentage}%
            </strong>
          </span>
          <span className="text-slate-700 font-medium">
            Urban:{' '}
            <strong className="text-blue-700 font-bold">
              {country.demographics.urbanPercentage}%
            </strong>
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-600 h-full"
            style={{ width: `${country.demographics.ruralPercentage}%` }}
          />
          <div
            className="bg-blue-600 h-full"
            style={{ width: `${country.demographics.urbanPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={`${SUBTLE_PANEL_CLASS} p-2.5`}>
          <div className="text-[11px] text-slate-600 font-medium">Density / km²</div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            {country.demographics.densityPerKm2} / km²
          </div>
        </div>
        <div className={`${SUBTLE_PANEL_CLASS} p-2.5`}>
          <div className="text-[11px] text-slate-600 font-medium">Literacy Rate</div>
          <div className="text-sm font-extrabold text-slate-900 mt-0.5">
            {country.demographics.literacyRate}%
          </div>
        </div>
      </div>

      <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-700 font-medium">Vulnerable Demographic Index:</span>
          <span className="text-amber-800 font-bold">
            {country.demographics.vulnerableDemographicIndex}/100
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full rounded-full"
            style={{ width: `${country.demographics.vulnerableDemographicIndex}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);

/** Category B card: Infrastructure Baseline Indices. */
export const InfrastructureCard: React.FC<DatasetCardProps> = ({ country, onOpenStudio }) => {
  const infra = country.infrastructureIndex;
  const rows = [
    {
      label: 'Roads & Highway Paving Score',
      valueText: `${infra.pavedRoadScore}/100`,
      valueColor: 'text-slate-900',
      barColor: 'bg-emerald-600',
      widthPct: infra.pavedRoadScore,
    },
    {
      label: 'Piped Water & Sanitation Coverage',
      valueText: `${infra.waterSanitationCoverage}%`,
      valueColor: 'text-cyan-800',
      barColor: 'bg-cyan-600',
      widthPct: infra.waterSanitationCoverage,
    },
    {
      label: 'Primary Health Centers per 10k Pop',
      valueText: String(infra.healthCentersPer10k),
      valueColor: 'text-purple-800',
      barColor: 'bg-purple-600',
      widthPct: Math.min(100, infra.healthCentersPer10k * HEALTH_CENTERS_SCORE_MULTIPLIER),
    },
    {
      label: 'Rural Broadband / 5G Connectivity',
      valueText: `${infra.broadbandConnectivity}%`,
      valueColor: 'text-amber-800',
      barColor: 'bg-amber-600',
      widthPct: infra.broadbandConnectivity,
    },
  ];

  return (
    <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Infrastructure Baseline Indices</h3>
            <p className="text-[11px] text-slate-600 font-medium">
              National Infrastructure Ratings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenStudio}
          className="text-[11px] flex items-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-lg transition-all font-bold"
        >
          <Edit3 className="w-3 h-3" aria-hidden="true" />
          <span>Edit</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label} className={`${SUBTLE_PANEL_CLASS} p-3 space-y-1.5`}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">{row.label}</span>
              <span className={`font-bold ${row.valueColor}`}>{row.valueText}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className={`${row.barColor} h-full`} style={{ width: `${row.widthPct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Category C card: Public Investment & Capital Budgets. */
export const InvestmentCard: React.FC<DatasetCardProps> = ({ country, onOpenStudio }) => (
  <div className={`${CARD_SURFACE_CLASS} p-5 space-y-4`}>
    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          <DollarSign className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Public Investment &amp; Budgets</h3>
          <p className="text-[11px] text-slate-600 font-medium">Capital Expenditure Allocations</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenStudio}
        className="text-[11px] flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg transition-all font-bold"
      >
        <Edit3 className="w-3 h-3" aria-hidden="true" />
        <span>Edit</span>
      </button>
    </div>

    <div className={`${SUBTLE_PANEL_CLASS} p-3 flex items-center justify-between`}>
      <div>
        <div className="text-[11px] text-slate-600 font-medium">Total Infrastructure Outlay</div>
        <div className="text-base font-extrabold text-amber-800">
          {country.publicInvestment.totalBudgetUSD}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[11px] text-slate-600 font-medium">Disbursement Rate</div>
        <div className="text-base font-extrabold text-emerald-700">
          {country.publicInvestment.disbursementRate}%
        </div>
      </div>
    </div>

    <div className="space-y-2.5">
      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
        Major Regional Programs:
      </div>
      {country.publicInvestment.topPrograms.length === 0 ? (
        <div className={`${SUBTLE_PANEL_CLASS} p-3 text-xs text-slate-600 font-medium`}>
          No capital programs listed for this baseline yet.
        </div>
      ) : (
        country.publicInvestment.topPrograms.map((prog, idx) => {
          const statusClass =
            prog.status === 'On Track' || prog.status === 'Completed'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : prog.status === 'Delayed'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-red-50 text-red-800 border border-red-200';
          return (
            <div key={`${prog.name}-${idx}`} className={`${SUBTLE_PANEL_CLASS} p-2.5 space-y-1`}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-bold text-slate-900 leading-tight">{prog.name}</div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap ${statusClass}`}
                >
                  {prog.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 font-medium">
                <span>Sector: {prog.sector}</span>
                <span className="font-bold text-slate-900">{prog.budgetUSD}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);
