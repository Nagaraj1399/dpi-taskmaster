import React, { useId } from 'react';
import { CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import type { GrievanceSector, GrievanceUrgency } from '../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { CARD_SURFACE_CLASS, INPUT_CONTROL_CLASS, PRIMARY_BUTTON_CLASS } from '../ui/styles';

const SECTOR_OPTIONS: readonly { value: GrievanceSector; label: string }[] = [
  { value: 'Water & Sanitation', label: 'Water & Sanitation' },
  { value: 'Roads & Highways', label: 'Roads & Highways' },
  { value: 'Healthcare', label: 'Healthcare & Hospitals' },
  { value: 'Digital & Power', label: 'Digital & Power Grid' },
  { value: 'Public Sanitation', label: 'Public Sanitation' },
];

const URGENCY_OPTIONS: readonly { value: GrievanceUrgency; label: string }[] = [
  { value: 'Low', label: 'Low - Routine Civic Request' },
  { value: 'Medium', label: 'Medium - Standard Public Service Gap' },
  { value: 'High', label: 'High - Critical Civic Bottleneck' },
  { value: 'Emergency', label: 'Emergency - Immediate Public Risk' },
];

interface GrievanceSubmissionFormProps {
  region: string;
  sector: GrievanceSector;
  urgency: GrievanceUrgency;
  language: string;
  grievanceText: string;
  onChangeRegion: (value: string) => void;
  onChangeSector: (value: GrievanceSector) => void;
  onChangeUrgency: (value: GrievanceUrgency) => void;
  onChangeLanguage: (value: string) => void;
  onChangeGrievanceText: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

/** Accessible citizen grievance submission form with associated labels and typed sector/urgency fields. */
export const GrievanceSubmissionForm: React.FC<GrievanceSubmissionFormProps> = ({
  region,
  sector,
  urgency,
  language,
  grievanceText,
  onChangeRegion,
  onChangeSector,
  onChangeUrgency,
  onChangeLanguage,
  onChangeGrievanceText,
  onSubmit,
}) => {
  const { t } = useLanguage();
  const baseId = useId();
  const regionId = `${baseId}-region`;
  const sectorId = `${baseId}-sector`;
  const urgencyId = `${baseId}-urgency`;
  const languageId = `${baseId}-language`;
  const textId = `${baseId}-grievance-text`;

  return (
    <form onSubmit={onSubmit} className={`${CARD_SURFACE_CLASS} p-6 space-y-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={regionId} className="block text-xs font-bold text-slate-800 mb-1">
            {t('ingestion.form.region', 'Jurisdiction Region')}
          </label>
          <div className="relative">
            <MapPin
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id={regionId}
              type="text"
              value={region}
              onChange={(e) => onChangeRegion(e.target.value)}
              placeholder="e.g. Tamil Nadu (Madurai - Melur)"
              className={`${INPUT_CONTROL_CLASS} pl-9 text-xs`}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor={sectorId} className="block text-xs font-bold text-slate-800 mb-1">
            {t('ingestion.form.sector', 'Infrastructure Sector')}
          </label>
          <select
            id={sectorId}
            value={sector}
            onChange={(e) => onChangeSector(e.target.value as GrievanceSector)}
            className={`${INPUT_CONTROL_CLASS} text-xs`}
          >
            {SECTOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={urgencyId} className="block text-xs font-bold text-slate-800 mb-1">
            {t('ingestion.form.urgency', 'Citizen Urgency Level')}
          </label>
          <select
            id={urgencyId}
            value={urgency}
            onChange={(e) => onChangeUrgency(e.target.value as GrievanceUrgency)}
            className={`${INPUT_CONTROL_CLASS} text-xs`}
          >
            {URGENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={languageId} className="block text-xs font-bold text-slate-800 mb-1">
            {t('ingestion.form.language', 'Regional Language')}
          </label>
          <input
            id={languageId}
            type="text"
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            placeholder="e.g. English, Tamil, Portuguese, Russian, Arabic"
            className={`${INPUT_CONTROL_CLASS} text-xs`}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={textId} className="block text-xs font-bold text-slate-800">
            {t('ingestion.form.text', 'Citizen Grievance Description')}
          </label>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Multi-lingual Natural Language Supported
          </span>
        </div>
        <textarea
          id={textId}
          rows={4}
          value={grievanceText}
          onChange={(e) => onChangeGrievanceText(e.target.value)}
          placeholder="Enter detailed regional citizen complaint..."
          className={`${INPUT_CONTROL_CLASS} text-xs leading-relaxed`}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Contact Tokenization &amp; Canonical SHA-256 Payload Digest</span>
        </div>

        <button type="submit" className={PRIMARY_BUTTON_CLASS}>
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>{t('ingestion.form.submit', 'Ingest & Fuse with Official Data')}</span>
        </button>
      </div>
    </form>
  );
};
