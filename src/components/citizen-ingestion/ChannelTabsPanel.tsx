import React, { useId, useRef } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  MessageSquare,
  Mic,
  RefreshCw,
  Square,
  Upload,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import type { GrievanceChannel, VisionAnalysisResult } from '../../shared/types';
import { useLanguage } from '../../context/LanguageContext';
import { CARD_SURFACE_CLASS, SUBTLE_PANEL_CLASS } from '../ui/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { VisionAnalysisStatus } from './hooks/usePhotoVisionAnalysis';
import { SAMPLE_PHOTO_PRESETS, type SamplePhotoPreset } from './photoPresets';

const VOICE_VISUALIZER_BARS = [40, 65, 85, 30, 95, 70, 50, 80, 60, 90, 45, 75, 35, 88, 62] as const;

interface ChannelTabConfig {
  value: GrievanceChannel;
  label: string;
  icon: LucideIcon;
}

const CHANNEL_TABS: readonly ChannelTabConfig[] = [
  { value: 'Voice IVR', label: 'Voice / IVR', icon: Mic },
  { value: 'Multimodal Photo Inspection', label: 'Photo Inspection', icon: Camera },
  { value: 'Messaging Apps', label: 'WhatsApp / SMS', icon: MessageSquare },
];

interface ChannelTabsPanelProps {
  activeChannel: GrievanceChannel;
  onChangeChannel: (channel: GrievanceChannel) => void;
  isRecording: boolean;
  recordingDuration: number;
  hasAudioRecorded: boolean;
  audioUrl: string | null;
  micNotice: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  photoUrl: string;
  photoDescription: string;
  visionStatus: VisionAnalysisStatus;
  visionAnalysis: VisionAnalysisResult | null;
  visionErrorMessage: string | null;
  onSelectPhotoPreset: (preset: SamplePhotoPreset) => void;
  onUploadPhotoFile: (file: File) => void;
}

/**
 * Channel selector tabs (`Voice / IVR`, `Photo Inspection`, `WhatsApp / SMS`)
 * backed by Radix Tabs and honest photo-triage status reporting.
 */
export const ChannelTabsPanel: React.FC<ChannelTabsPanelProps> = ({
  activeChannel,
  onChangeChannel,
  isRecording,
  recordingDuration,
  hasAudioRecorded,
  audioUrl,
  micNotice,
  onStartRecording,
  onStopRecording,
  photoUrl,
  photoDescription,
  visionStatus,
  visionAnalysis,
  visionErrorMessage,
  onSelectPhotoPreset,
  onUploadPhotoFile,
}) => {
  const { t } = useLanguage();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhotoFile(file);
    }
    e.target.value = '';
  };

  return (
    <Tabs value={activeChannel} onValueChange={(val) => onChangeChannel(val as GrievanceChannel)}>
      <TabsList className="w-full">
        {CHANNEL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 gap-2">
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Multimodal Photo Inspection Panel */}
      <TabsContent value="Multimodal Photo Inspection" className="mt-4">
        <div className={`${CARD_SURFACE_CLASS} p-6 space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900">
                Gemini Multimodal &amp; Vision AI Photo Triage
              </h3>
            </div>
            <label
              htmlFor={fileInputId}
              className="inline-flex items-center space-x-1.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer transition-all focus-within:ring-2 focus-within:ring-emerald-600"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Site Photo</span>
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Upload or select infrastructure defect photographs (potholes, burst pipelines, clinic
            outages) to run server-side Gemini Vision inspection and compute a real damage severity
            score.
          </p>

          {/* Accessible Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {SAMPLE_PHOTO_PRESETS.map((preset) => {
              const isSelected = photoUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPhotoPreset(preset)}
                  aria-pressed={isSelected}
                  className={`group rounded-xl border p-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="h-20 w-full rounded-lg overflow-hidden relative mb-2 bg-slate-200">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 line-clamp-1">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">{preset.sector}</div>
                </button>
              );
            })}
          </div>

          {photoUrl && (
            <div
              className={`${SUBTLE_PANEL_CLASS} p-4 flex flex-col sm:flex-row items-start gap-4`}
            >
              <img
                src={photoUrl}
                alt={photoDescription || 'Selected infrastructure defect'}
                className="w-28 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5 text-xs flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">
                    {photoDescription || 'Infrastructure Photo Submission'}
                  </span>
                  {visionStatus === 'analyzing' && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-mono font-bold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      <span>Running Gemini Vision...</span>
                    </span>
                  )}
                  {visionStatus === 'succeeded' && visionAnalysis && (
                    <span className="text-amber-800 font-mono font-bold">
                      Vision Damage Severity: {visionAnalysis.severityScore}/100
                    </span>
                  )}
                </div>

                {visionStatus === 'failed' && visionErrorMessage && (
                  <div
                    role="alert"
                    className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800 flex items-start gap-2 font-medium"
                  >
                    <AlertCircle
                      className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{visionErrorMessage}</span>
                  </div>
                )}

                {visionStatus === 'succeeded' && visionAnalysis && (
                  <div className="space-y-1 text-[11px] text-slate-700 font-medium">
                    <p>
                      <strong className="text-slate-900">{visionAnalysis.detectedIssue}</strong> —{' '}
                      {visionAnalysis.estimatedRepairUrgency} (
                      {visionAnalysis.infrastructureCategory})
                    </p>
                    {visionAnalysis.featuresIdentified.length > 0 && (
                      <p className="text-slate-600">
                        Observed features: {visionAnalysis.featuresIdentified.join(', ')} • Model:{' '}
                        <span className="font-mono">{visionAnalysis.aiModelUsed}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Active Voice IVR Recording Panel */}
      <TabsContent value="Voice IVR" className="mt-4">
        <div className={`${CARD_SURFACE_CLASS} p-6 space-y-5`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Regional Voice Grievance Telephony Engine</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Captures citizen voice streams in regional languages for regional dialect review.
              </p>
            </div>
            {isRecording && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full border border-red-200 font-mono font-bold"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>Recording: {recordingDuration}s</span>
              </div>
            )}
          </div>

          <div
            className={`${SUBTLE_PANEL_CLASS} p-6 flex flex-col items-center justify-center space-y-4`}
          >
            <div
              className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs"
              aria-hidden="true"
            >
              {VOICE_VISUALIZER_BARS.map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRecording
                      ? 'bg-emerald-600 animate-pulse'
                      : hasAudioRecorded
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                  }`}
                  style={{
                    height: isRecording
                      ? `${Math.max(20, ((height + recordingDuration * 13) % 80) + 20)}%`
                      : hasAudioRecorded
                        ? `${height}%`
                        : '20%',
                  }}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={onStartRecording}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <Mic className="w-4 h-4" aria-hidden="true" />
                  <span>{t('ingestion.voice.start', 'Start Voice Recording')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStopRecording}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                >
                  <Square className="w-4 h-4" aria-hidden="true" />
                  <span>Stop &amp; Transcribe Audio</span>
                </button>
              )}

              {hasAudioRecorded && !isRecording && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Audio Captured ({recordingDuration}s)</span>
                </div>
              )}
            </div>

            {audioUrl && (
              <audio controls src={audioUrl} className="w-full max-w-sm mt-2">
                <track kind="captions" />
              </audio>
            )}

            {micNotice && (
              <p
                role="status"
                aria-live="polite"
                className="text-[11px] text-amber-800 font-medium text-center"
              >
                {micNotice}
              </p>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Messaging Apps Tab */}
      <TabsContent value="Messaging Apps" className="mt-4">
        <div className={`${CARD_SURFACE_CLASS} p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-900">
                WhatsApp &amp; SMS Direct Dispatch
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
              Simulated Webhook Gateway
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Direct webhook simulation for official civic WhatsApp chatbots and regional SMS gateways
            across BRICS ministries.
          </p>
          <div className={`${SUBTLE_PANEL_CLASS} p-4 flex items-center justify-between text-xs`}>
            <span className="text-slate-700 font-semibold">Simulated Gateway Phone Number:</span>
            <span className="font-mono text-emerald-700 font-bold">+91 1800-CIVIC-BOT</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
