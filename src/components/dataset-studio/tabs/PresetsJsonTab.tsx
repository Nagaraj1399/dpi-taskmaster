import React, { type ChangeEvent } from 'react';
import { AlertTriangle, CheckCircle2, Download, Sparkles, Upload } from 'lucide-react';
import type { BricsCountry } from '../../../shared/types';
import { SECONDARY_BUTTON_CLASS, SUBTLE_PANEL_CLASS } from '../../ui/styles';
import { DATASET_PRESETS, type DatasetPresetId } from '../presets';

interface PresetsJsonTabProps {
  formData: BricsCountry;
  rawJsonText: string;
  onChangeRawJson: (text: string) => void;
  onApplyPreset: (presetId: DatasetPresetId) => void;
  onApplyRawJson: (text: string) => boolean;
  onExportJson: (country: BricsCountry) => void;
  onImportJsonFile: (event: ChangeEvent<HTMLInputElement>) => void;
  jsonError: string | null;
  jsonSuccess: string | null;
}

/** Presets, Zod-validated JSON file import/export, and raw JSON editor tab. */
export const PresetsJsonTab: React.FC<PresetsJsonTabProps> = ({
  formData,
  rawJsonText,
  onChangeRawJson,
  onApplyPreset,
  onApplyRawJson,
  onExportJson,
  onImportJsonFile,
  jsonError,
  jsonSuccess,
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-bold text-slate-900">
        Load Official Presets or Edit Raw JSON Spec
      </h3>
      <p className="text-xs text-slate-600">
        Apply baseline presets, import/export Zod-validated JSON files, or edit the specification
        directly.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {DATASET_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onApplyPreset(preset.id)}
          className={`p-3.5 bg-white hover:bg-slate-50 text-left rounded-xl border border-slate-200 shadow-2xs transition-all space-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${preset.accentClass}`}
        >
          <div className="text-xs font-bold flex items-center justify-between">
            <span>{preset.title}</span>
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </div>
          <p className="text-[11px] text-slate-600 font-normal">{preset.description}</p>
        </button>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-3 pt-1">
      <button
        type="button"
        onClick={() => onExportJson(formData)}
        className={SECONDARY_BUTTON_CLASS}
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
        <span>Download JSON Spec</span>
      </button>

      <label
        htmlFor="studio-json-file-input"
        className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 shadow-2xs cursor-pointer transition-all focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2"
      >
        <Upload className="w-3.5 h-3.5 text-cyan-700" aria-hidden="true" />
        <span>Upload Local JSON File</span>
        <input
          id="studio-json-file-input"
          type="file"
          accept=".json,application/json"
          onChange={onImportJsonFile}
          className="sr-only"
        />
      </label>
    </div>

    {jsonError && (
      <div
        role="alert"
        className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2 font-semibold"
      >
        <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{jsonError}</span>
      </div>
    )}

    {jsonSuccess && (
      <div
        role="status"
        aria-live="polite"
        className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2 font-semibold"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{jsonSuccess}</span>
      </div>
    )}

    <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="studio-raw-json-editor" className="text-xs font-bold text-slate-800">
          Raw Dataset JSON Specification
        </label>
        <button
          type="button"
          onClick={() => onApplyRawJson(rawJsonText)}
          className={SECONDARY_BUTTON_CLASS}
        >
          Apply Raw JSON
        </button>
      </div>
      <textarea
        id="studio-raw-json-editor"
        rows={7}
        value={rawJsonText}
        onChange={(e) => onChangeRawJson(e.target.value)}
        spellCheck={false}
        className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
      />
    </div>
  </div>
);
