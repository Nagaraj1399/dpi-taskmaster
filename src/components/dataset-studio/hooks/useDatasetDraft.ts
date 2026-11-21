import { useCallback, useState } from 'react';
import type {
  BricsCountry,
  CustomApiEndpointConfig,
  PublicInvestmentProgram,
} from '../../../shared/types';
import { DATASET_PRESETS, type DatasetPresetId } from '../presets';

const DEFAULT_API_CONFIG: CustomApiEndpointConfig = {
  endpointUrl: '',
  apiKey: '',
  authHeaderType: 'None',
  customHeaderKey: 'api-key',
  customHeaderValue: '',
  syncIntervalMinutes: 60,
  lastSyncStatus: 'Idle',
};

function cloneCountry(country: BricsCountry): BricsCountry {
  return JSON.parse(JSON.stringify(country)) as BricsCountry;
}

/**
 * Manages the editable country baseline draft, external API connector settings,
 * raw JSON editor buffer, and synchronization when `currentCountry` or `isOpen` changes.
 */
export function useDatasetDraft(
  currentCountry: BricsCountry,
  isOpen: boolean,
  onDirty?: () => void
) {
  const [formData, setFormData] = useState<BricsCountry>(() => cloneCountry(currentCountry));
  const [apiConfig, setApiConfig] = useState<CustomApiEndpointConfig>(DEFAULT_API_CONFIG);
  const [rawJsonText, setRawJsonText] = useState<string>(() =>
    JSON.stringify(currentCountry, null, 2)
  );
  const syncKey = `${currentCountry.code}:${isOpen}`;
  const [prevSyncKey, setPrevSyncKey] = useState<string>(syncKey);

  if (prevSyncKey !== syncKey) {
    setPrevSyncKey(syncKey);
    if (isOpen) {
      const cloned = cloneCountry(currentCountry);
      setFormData(cloned);
      setRawJsonText(JSON.stringify(cloned, null, 2));
    }
  }

  const commitFormData = useCallback(
    (updater: (prev: BricsCountry) => BricsCountry) => {
      setFormData((prev) => {
        const next = updater(prev);
        setRawJsonText(JSON.stringify(next, null, 2));
        return next;
      });
      onDirty?.();
    },
    [onDirty]
  );

  const updateCensusAgency = useCallback(
    (value: string) => {
      commitFormData((prev) => ({ ...prev, censusAgency: value }));
    },
    [commitFormData]
  );

  const updateDemographicField = useCallback(
    <K extends keyof BricsCountry['demographics']>(
      field: K,
      value: BricsCountry['demographics'][K]
    ) => {
      commitFormData((prev) => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          [field]: value,
        },
      }));
    },
    [commitFormData]
  );

  const updateRuralUrbanSplit = useCallback(
    (ruralPercentage: number) => {
      const clampedRural = Math.max(0, Math.min(100, Math.round(ruralPercentage * 10) / 10));
      const urbanPercentage = Math.round((100 - clampedRural) * 10) / 10;
      commitFormData((prev) => ({
        ...prev,
        demographics: {
          ...prev.demographics,
          ruralPercentage: clampedRural,
          urbanPercentage,
        },
      }));
    },
    [commitFormData]
  );

  const updateInfrastructureField = useCallback(
    <K extends keyof BricsCountry['infrastructureIndex']>(
      field: K,
      value: BricsCountry['infrastructureIndex'][K]
    ) => {
      commitFormData((prev) => ({
        ...prev,
        infrastructureIndex: {
          ...prev.infrastructureIndex,
          [field]: value,
        },
      }));
    },
    [commitFormData]
  );

  const updateInvestmentField = useCallback(
    <K extends keyof BricsCountry['publicInvestment']>(
      field: K,
      value: BricsCountry['publicInvestment'][K]
    ) => {
      commitFormData((prev) => ({
        ...prev,
        publicInvestment: {
          ...prev.publicInvestment,
          [field]: value,
        },
      }));
    },
    [commitFormData]
  );

  const updatePublicFeedField = useCallback(
    <K extends keyof BricsCountry['publicDataFeeds']>(
      field: K,
      value: BricsCountry['publicDataFeeds'][K]
    ) => {
      commitFormData((prev) => ({
        ...prev,
        publicDataFeeds: {
          ...prev.publicDataFeeds,
          [field]: value,
        },
      }));
    },
    [commitFormData]
  );

  const addProgram = useCallback(() => {
    commitFormData((prev) => ({
      ...prev,
      publicInvestment: {
        ...prev.publicInvestment,
        topPrograms: [
          ...prev.publicInvestment.topPrograms,
          {
            name: 'New Custom Public Works Mission',
            budgetUSD: '$1.2 Billion',
            sector: 'Water & Sanitation',
            status: 'On Track',
          },
        ],
      },
    }));
  }, [commitFormData]);

  const removeProgram = useCallback(
    (index: number) => {
      commitFormData((prev) => ({
        ...prev,
        publicInvestment: {
          ...prev.publicInvestment,
          topPrograms: prev.publicInvestment.topPrograms.filter((_, idx) => idx !== index),
        },
      }));
    },
    [commitFormData]
  );

  const updateProgramField = useCallback(
    <K extends keyof PublicInvestmentProgram>(
      index: number,
      field: K,
      value: PublicInvestmentProgram[K]
    ) => {
      commitFormData((prev) => {
        const updated = prev.publicInvestment.topPrograms.map((prog, idx) =>
          idx === index ? { ...prog, [field]: value } : prog
        );
        return {
          ...prev,
          publicInvestment: {
            ...prev.publicInvestment,
            topPrograms: updated,
          },
        };
      });
    },
    [commitFormData]
  );

  const updateApiConfigField = useCallback(
    <K extends keyof CustomApiEndpointConfig>(field: K, value: CustomApiEndpointConfig[K]) => {
      setApiConfig((prev) => ({ ...prev, [field]: value }));
      onDirty?.();
    },
    [onDirty]
  );

  const applyPreset = useCallback(
    (presetId: DatasetPresetId) => {
      const preset = DATASET_PRESETS.find((item) => item.id === presetId);
      if (!preset) return;
      commitFormData((prev) => preset.apply(prev));
    },
    [commitFormData]
  );

  const replaceDraft = useCallback(
    (nextCountry: BricsCountry) => {
      commitFormData(() => cloneCountry(nextCountry));
    },
    [commitFormData]
  );

  return {
    formData,
    apiConfig,
    rawJsonText,
    setRawJsonText,
    updateCensusAgency,
    updateDemographicField,
    updateRuralUrbanSplit,
    updateInfrastructureField,
    updateInvestmentField,
    updatePublicFeedField,
    addProgram,
    removeProgram,
    updateProgramField,
    updateApiConfigField,
    applyPreset,
    replaceDraft,
  };
}
