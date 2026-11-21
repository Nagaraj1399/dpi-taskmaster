import React from 'react';
import type { BricsCountry } from '../../../shared/types';
import { NumberField, SliderField } from '../fields/SharedFields';

interface InfrastructureTabProps {
  formData: BricsCountry;
  onUpdateInfrastructure: <K extends keyof BricsCountry['infrastructureIndex']>(
    field: K,
    value: BricsCountry['infrastructureIndex'][K]
  ) => void;
}

/** Infrastructure baseline indices editing tab within the Dataset Studio modal. */
export const InfrastructureTab: React.FC<InfrastructureTabProps> = ({
  formData,
  onUpdateInfrastructure,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-900">
        Enter Real Infrastructure Baseline Indices
      </h3>
      <span className="text-[11px] text-cyan-800 font-mono font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
        0 - 100 Normalized Scale
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SliderField
        id="infra-paved-roads"
        label="Roads & Highway Paving Score"
        value={formData.infrastructureIndex.pavedRoadScore}
        onChange={(val) => onUpdateInfrastructure('pavedRoadScore', val)}
        step={0.1}
        valueDisplay={`${formData.infrastructureIndex.pavedRoadScore}/100`}
        helperText="National / regional percentage of all-weather paved roads."
      />

      <SliderField
        id="infra-water-sanitation"
        label="Piped Water & Sanitation Coverage"
        value={formData.infrastructureIndex.waterSanitationCoverage}
        onChange={(val) => onUpdateInfrastructure('waterSanitationCoverage', val)}
        step={0.1}
        valueDisplay={`${formData.infrastructureIndex.waterSanitationCoverage}%`}
        valueClassName="text-cyan-800"
        helperText="Percentage of households with tap water & piped sewerage."
      />

      <NumberField
        id="infra-health-centers"
        label="Primary Health Centers per 10k Pop"
        value={formData.infrastructureIndex.healthCentersPer10k}
        onChange={(val) => onUpdateInfrastructure('healthCentersPer10k', val)}
        min={0}
        max={50}
        step={0.1}
        badgeText={`${formData.infrastructureIndex.healthCentersPer10k}`}
        badgeClassName="text-purple-800"
        helperText="Community health clinics & primary centers per 10,000 citizens."
      />

      <SliderField
        id="infra-broadband"
        label="Rural Broadband / 5G Connectivity"
        value={formData.infrastructureIndex.broadbandConnectivity}
        onChange={(val) => onUpdateInfrastructure('broadbandConnectivity', val)}
        step={0.1}
        valueDisplay={`${formData.infrastructureIndex.broadbandConnectivity}%`}
        valueClassName="text-amber-800"
        helperText="Rural fiber optic & high-speed mobile network reach."
      />

      <SliderField
        id="infra-power-grid"
        label="Power Grid Reliability Score"
        value={formData.infrastructureIndex.powerGridReliability}
        onChange={(val) => onUpdateInfrastructure('powerGridReliability', val)}
        step={0.1}
        valueDisplay={`${formData.infrastructureIndex.powerGridReliability}%`}
        helperText="Uninterrupted 24/7 electrical grid uptime score."
        className="md:col-span-2"
      />
    </div>
  </div>
);
