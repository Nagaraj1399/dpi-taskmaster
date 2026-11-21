import React from 'react';
import type { BricsCountry } from '../../../shared/types';
import { NumberField, SliderField, TextField } from '../fields/SharedFields';

interface DemographicsTabProps {
  formData: BricsCountry;
  onUpdateDemographic: <K extends keyof BricsCountry['demographics']>(
    field: K,
    value: BricsCountry['demographics'][K]
  ) => void;
  onUpdateRuralUrban: (ruralPercentage: number) => void;
  onUpdateCensusAgency: (agency: string) => void;
}

/** Demographic census editing tab within the Dataset Studio modal. */
export const DemographicsTab: React.FC<DemographicsTabProps> = ({
  formData,
  onUpdateDemographic,
  onUpdateRuralUrban,
  onUpdateCensusAgency,
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <span>Enter Official National &amp; Regional Census Statistics</span>
        <span className="text-xs font-normal text-slate-600">({formData.name})</span>
      </h3>
      <span className="text-[11px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        Editable Baseline Metrics
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField
        id="demo-total-population"
        label="Total Population"
        value={formData.demographics.totalPopulation}
        onChange={(val) => onUpdateDemographic('totalPopulation', val)}
        placeholder="e.g. 1,428,627,663"
        helperText="Official count from Census / National Register."
        mono
      />

      <TextField
        id="demo-census-agency"
        label="Census Agency / Authority Name"
        value={formData.censusAgency}
        onChange={onUpdateCensusAgency}
        placeholder="e.g. Office of Registrar General / MoSPI"
        helperText="Official data provider authority."
      />

      <SliderField
        id="demo-rural-urban-slider"
        label="Rural Population %"
        value={formData.demographics.ruralPercentage}
        onChange={onUpdateRuralUrban}
        step={0.1}
        valueDisplay={`${formData.demographics.ruralPercentage}%`}
        footerContent={
          <div className="flex justify-between text-[11px] text-slate-600 font-medium">
            <span>Rural: {formData.demographics.ruralPercentage}%</span>
            <span>Urban: {formData.demographics.urbanPercentage}%</span>
          </div>
        }
      />

      <NumberField
        id="demo-density-km2"
        label="Density per km²"
        value={formData.demographics.densityPerKm2}
        onChange={(val) => onUpdateDemographic('densityPerKm2', val)}
        min={0}
        step={0.1}
        helperText="Inhabitants per square kilometer."
      />

      <NumberField
        id="demo-literacy-rate"
        label="Literacy Rate %"
        value={formData.demographics.literacyRate}
        onChange={(val) => onUpdateDemographic('literacyRate', val)}
        min={0}
        max={100}
        step={0.1}
        helperText="Percentage of literate population."
      />

      <SliderField
        id="demo-vulnerability-slider"
        label="Vulnerable Demographic Index (0-100)"
        value={formData.demographics.vulnerableDemographicIndex}
        onChange={(val) => onUpdateDemographic('vulnerableDemographicIndex', val)}
        step={0.1}
        valueDisplay={`${formData.demographics.vulnerableDemographicIndex}/100`}
        valueClassName="text-amber-800"
        helperText="Weight used in AI demand hotspot vulnerability scoring."
      />
    </div>
  </div>
);
