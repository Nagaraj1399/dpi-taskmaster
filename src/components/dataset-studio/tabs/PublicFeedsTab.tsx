import React from 'react';
import type { BricsCountry, MeteorologicalAlertLevel } from '../../../shared/types';
import { SelectField, SliderField } from '../fields/SharedFields';

const ALERT_OPTIONS: ReadonlyArray<{ value: MeteorologicalAlertLevel; label: string }> = [
  { value: 'Normal', label: 'Normal Status' },
  { value: 'Advisory', label: 'Advisory Weather Alert' },
  { value: 'Critical Flood/Drought', label: 'Critical Flood / Drought Emergency' },
];

interface PublicFeedsTabProps {
  formData: BricsCountry;
  onUpdatePublicFeed: <K extends keyof BricsCountry['publicDataFeeds']>(
    field: K,
    value: BricsCountry['publicDataFeeds'][K]
  ) => void;
}

/** Global public datasets (WHO, FAO, Copernicus) editing tab within the Dataset Studio modal. */
export const PublicFeedsTab: React.FC<PublicFeedsTabProps> = ({ formData, onUpdatePublicFeed }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-900">
        Global Public Datasets &amp; Environmental Overlays
      </h3>
      <span className="text-[11px] text-purple-800 font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
        WHO / FAO / Copernicus C3S
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SliderField
        id="feed-who-health"
        label="WHO Health Equity Index"
        value={formData.publicDataFeeds.whoHealthIndex}
        onChange={(val) => onUpdatePublicFeed('whoHealthIndex', val)}
        step={0.1}
        valueDisplay={`${formData.publicDataFeeds.whoHealthIndex}/100`}
        helperText="WHO Global Health Observatory primary clinic reach score."
      />

      <SliderField
        id="feed-fao-water-stress"
        label="FAO Agricultural Water Stress"
        value={formData.publicDataFeeds.faoAgriWaterStress}
        onChange={(val) => onUpdatePublicFeed('faoAgriWaterStress', val)}
        step={0.1}
        valueDisplay={`${formData.publicDataFeeds.faoAgriWaterStress}%`}
        valueClassName="text-amber-800"
        helperText="FAO AQUASTAT agricultural water withdrawal index."
      />

      <SliderField
        id="feed-copernicus-heat"
        label="Copernicus Satellite Thermal/NDVI"
        value={formData.publicDataFeeds.copernicusSatelliteHeatScore}
        onChange={(val) => onUpdatePublicFeed('copernicusSatelliteHeatScore', val)}
        step={0.1}
        valueDisplay={`${formData.publicDataFeeds.copernicusSatelliteHeatScore}/100`}
        valueClassName="text-cyan-800"
        helperText="Copernicus Climate Change Service surface heat anomalies."
      />

      <SelectField
        id="feed-met-alert"
        label="Meteorological Alert Level"
        value={formData.publicDataFeeds.meteorologicalAlertLevel}
        onChange={(val) => onUpdatePublicFeed('meteorologicalAlertLevel', val)}
        options={ALERT_OPTIONS}
        helperText="National Met Service (IMD / INMET) alert category."
      />
    </div>
  </div>
);
