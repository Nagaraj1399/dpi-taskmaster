import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import type {
  BricsCountry,
  CitizenGrievance,
  GrievanceChannel,
  GrievanceSector,
  GrievanceUrgency,
} from '../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { CARD_SURFACE_CLASS } from '../ui/styles';
import { ChannelTabsPanel } from './ChannelTabsPanel';
import { GrievanceSubmissionForm } from './GrievanceSubmissionForm';
import { usePhotoVisionAnalysis } from './hooks/usePhotoVisionAnalysis';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';
import { IvrDialpadPanel } from './IvrDialpadPanel';
import type { SamplePhotoPreset } from './photoPresets';

interface CitizenIngestionHubProps {
  currentCountry: BricsCountry;
  onGrievanceSubmitted: (grievance: CitizenGrievance) => void;
  onTriggerFusion: (grievance: CitizenGrievance) => void;
}

function createGrievanceId(countryCode: string, sequence: number): string {
  const randomSuffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 4).toUpperCase()
      : String(1000 + (sequence % 9000));
  return `GRV-${countryCode}-${randomSuffix}`;
}

/**
 * Multimodal citizen telemetry intake workspace supporting browser voice capture,
 * server-side Gemini Vision photo inspection, toll-free IVR simulation, and structured grievance submission.
 */
export const CitizenIngestionHub: React.FC<CitizenIngestionHubProps> = ({
  currentCountry,
  onGrievanceSubmitted,
  onTriggerFusion,
}) => {
  const { t } = useLanguage();
  const [activeChannel, setActiveChannel] = useState<GrievanceChannel>('Voice IVR');

  const [region, setRegion] = useState<string>(currentCountry.sampleRegions[0] ?? '');
  const [sector, setSector] = useState<GrievanceSector>('Water & Sanitation');
  const [urgency, setUrgency] = useState<GrievanceUrgency>('High');
  const [language, setLanguage] = useState<string>(currentCountry.primaryLanguages[0] ?? 'English');
  const [grievanceText, setGrievanceText] = useState<string>('');
  const [contactInfo] = useState<string>('+91 9840XXXX52');

  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [visionDamageScore, setVisionDamageScore] = useState<number | undefined>(undefined);

  const [ivrDialedDigits, setIvrDialedDigits] = useState<string>('');
  const [ivrCallActive, setIvrCallActive] = useState<boolean>(false);
  const [ivrPromptStep, setIvrPromptStep] = useState<number>(0);

  const sequenceRef = useRef<number>(1);
  const uploadedPreviewRef = useRef<string | null>(null);

  const photoVision = usePhotoVisionAnalysis();

  const handleTranscriptFallback = useCallback((fallbackText: string) => {
    setGrievanceText((current) => (current.trim().length > 0 ? current : fallbackText));
  }, []);

  const voiceRecorder = useVoiceRecorder(currentCountry.code, handleTranscriptFallback);

  const [prevCountryCode, setPrevCountryCode] = useState(currentCountry.code);
  if (prevCountryCode !== currentCountry.code) {
    setPrevCountryCode(currentCountry.code);
    setRegion(currentCountry.sampleRegions[0] ?? '');
    setLanguage(currentCountry.primaryLanguages[0] ?? 'English');
  }

  useEffect(() => {
    return () => {
      if (uploadedPreviewRef.current) {
        URL.revokeObjectURL(uploadedPreviewRef.current);
      }
    };
  }, []);

  const handleKeypadPress = (digit: string) => {
    setIvrDialedDigits((prev) => prev + digit);

    if (digit === '1') {
      setSector('Water & Sanitation');
      setIvrPromptStep(2);
    } else if (digit === '2') {
      setSector('Roads & Highways');
      setIvrPromptStep(2);
    } else if (digit === '3') {
      setSector('Healthcare');
      setIvrPromptStep(2);
    } else if (digit === '9') {
      setUrgency('Emergency');
      setIvrPromptStep(3);
    }
  };

  const startIvrCall = () => {
    setIvrCallActive(true);
    setIvrPromptStep(1);
    setIvrDialedDigits('');
  };

  const endIvrCall = () => {
    setIvrCallActive(false);
    setIvrPromptStep(0);
  };

  const handleSelectPhotoPreset = async (preset: SamplePhotoPreset) => {
    setPhotoUrl(preset.url);
    setSector(preset.sector);
    setUrgency(preset.urgency);
    setLanguage(preset.language);
    setRegion(preset.region);
    setGrievanceText(preset.text);
    setPhotoDescription(preset.title);
    setVisionDamageScore(undefined);
    setActiveChannel('Multimodal Photo Inspection');

    const result = await photoVision.analyzePhoto({
      photoUrl: preset.url,
      sector: preset.sector,
      countryCode: currentCountry.code,
      region: preset.region,
    });

    if (result) {
      setVisionDamageScore(result.severityScore);
    }
  };

  const handleUploadPhotoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        return;
      }

      if (uploadedPreviewRef.current) {
        URL.revokeObjectURL(uploadedPreviewRef.current);
        uploadedPreviewRef.current = null;
      }

      setPhotoUrl(dataUrl);
      setPhotoDescription(file.name);
      setVisionDamageScore(undefined);
      setActiveChannel('Multimodal Photo Inspection');

      const result = await photoVision.analyzePhoto({
        imageBase64: dataUrl,
        sector,
        countryCode: currentCountry.code,
        region,
      });

      if (result) {
        setVisionDamageScore(result.severityScore);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!grievanceText.trim()) {
      return;
    }

    const seq = sequenceRef.current;
    sequenceRef.current += 1;

    const newGrievance: CitizenGrievance = {
      id: createGrievanceId(currentCountry.code, seq),
      countryCode: currentCountry.code,
      region,
      channel: activeChannel,
      originalText: grievanceText,
      originalLanguage: language,
      sector,
      urgency,
      timestamp: `${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`,
      citizenContactAnonymized: contactInfo,
      audioDurationSeconds: voiceRecorder.hasAudioRecorded
        ? voiceRecorder.recordingDuration
        : undefined,
      photoUrl: photoUrl || undefined,
      photoDescription: photoDescription || undefined,
      visionDamageScore,
      status: 'Ingested',
    };

    onGrievanceSubmitted(newGrievance);
    onTriggerFusion(newGrievance);
  };

  return (
    <div id="citizen-ingestion-hub" className="space-y-6">
      {/* Header Banner */}
      <div className={`${CARD_SURFACE_CLASS} p-6 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" aria-hidden="true" />
              <span>{t('ingestion.header.badge', 'Multimodal Citizen Ingestion Hub')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentCountry.name} Ingestion Engine</span>
              <span className="text-2xl" aria-hidden="true">
                {currentCountry.flag}
              </span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Aggregates citizen development requests via voice notes, IVR telephony, messaging
              apps, and multimodal photo inspection across diverse BRICS linguistic regions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChannelTabsPanel
            activeChannel={activeChannel}
            onChangeChannel={setActiveChannel}
            isRecording={voiceRecorder.isRecording}
            recordingDuration={voiceRecorder.recordingDuration}
            hasAudioRecorded={voiceRecorder.hasAudioRecorded}
            audioUrl={voiceRecorder.audioUrl}
            micNotice={voiceRecorder.micNotice}
            onStartRecording={voiceRecorder.startRecording}
            onStopRecording={voiceRecorder.stopRecording}
            photoUrl={photoUrl}
            photoDescription={photoDescription}
            visionStatus={photoVision.status}
            visionAnalysis={photoVision.analysis}
            visionErrorMessage={photoVision.errorMessage}
            onSelectPhotoPreset={handleSelectPhotoPreset}
            onUploadPhotoFile={handleUploadPhotoFile}
          />

          <GrievanceSubmissionForm
            region={region}
            sector={sector}
            urgency={urgency}
            language={language}
            grievanceText={grievanceText}
            onChangeRegion={setRegion}
            onChangeSector={setSector}
            onChangeUrgency={setUrgency}
            onChangeLanguage={setLanguage}
            onChangeGrievanceText={setGrievanceText}
            onSubmit={handleSubmit}
          />
        </div>

        <IvrDialpadPanel
          ivrCallActive={ivrCallActive}
          ivrPromptStep={ivrPromptStep}
          ivrDialedDigits={ivrDialedDigits}
          sector={sector}
          urgency={urgency}
          onStartCall={startIvrCall}
          onEndCall={endIvrCall}
          onKeypadPress={handleKeypadPress}
        />
      </div>
    </div>
  );
};
