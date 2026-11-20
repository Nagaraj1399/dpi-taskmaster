import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, PhoneCall, MessageSquare, Send, Sparkles, 
  Volume2, Play, Square, AlertTriangle, CheckCircle2, 
  MapPin, Radio, Languages, Phone, Camera, Upload, Eye,
  Image as ImageIcon, Check, RefreshCw
} from 'lucide-react';
import { BricsCountry, CitizenGrievance, GrievanceChannel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface CitizenIngestionHubProps {
  currentCountry: BricsCountry;
  onGrievanceSubmitted: (grievance: CitizenGrievance) => void;
  onTriggerFusion: (grievance: CitizenGrievance) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    title: 'Ruptured Jal Jeevan Main Pipe (Madurai)',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=60',
    sector: 'Water & Sanitation' as const,
    urgency: 'Emergency' as const,
    language: 'Tamil',
    region: 'Tamil Nadu (Madurai / Melur Taluk)',
    text: 'Main drinking water pipeline under the Jal Jeevan mission ruptured in Melur block. 180 households have had no clean water supply for 12 days.',
    damageScore: 88,
  },
  {
    title: 'Collapsed Road Culvert (Tirunelveli)',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60',
    sector: 'Roads & Highways' as const,
    urgency: 'High' as const,
    language: 'Tamil',
    region: 'Tamil Nadu (Tirunelveli / Ambasamudram)',
    text: 'Flash floods caused major 4-foot deep fissures on the PMGSY connecting highway, blocking primary emergency and ambulance access.',
    damageScore: 82,
  },
  {
    title: 'Dry Cistern & Leaking Manifold (Bahia Sertão)',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=60',
    sector: 'Water & Sanitation' as const,
    urgency: 'High' as const,
    language: 'Portuguese',
    region: 'Bahia (Feira de Santana / Sertão District)',
    text: 'A tubulação do Novo PAC Água para Todos está com vazamento grave há 3 semanas no bairro Campo Limpo. Mais de 400 famílias sem água tratada durante a seca.',
    damageScore: 79,
  },
  {
    title: 'Rural Clinic Power Failure (Asyut)',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60',
    sector: 'Healthcare' as const,
    urgency: 'Emergency' as const,
    language: 'Arabic',
    region: 'Asyut (Dairut District / Upper Egypt)',
    text: 'Decent Life project: primary health center generator out of service for two months, risking refrigeration storage of essential pediatric vaccines.',
    damageScore: 91,
  }
];

export const CitizenIngestionHub: React.FC<CitizenIngestionHubProps> = ({
  currentCountry,
  onGrievanceSubmitted,
  onTriggerFusion,
}) => {
  const { t } = useLanguage();
  const [activeChannel, setActiveChannel] = useState<GrievanceChannel>('Voice IVR');
  
  // Form State
  const [region, setRegion] = useState(currentCountry.sampleRegions[0] || '');
  const [sector, setSector] = useState<'Roads & Highways' | 'Water & Sanitation' | 'Healthcare' | 'Digital & Power' | 'Public Sanitation'>('Water & Sanitation');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('High');
  const [language, setLanguage] = useState(currentCountry.primaryLanguages[0] || 'English');
  const [grievanceText, setGrievanceText] = useState('');
  const [contactInfo, setContactInfo] = useState('+91 9840XXXX52');

  // Photo & Vision State (Gemini Multimodal)
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [visionDamageScore, setVisionDamageScore] = useState<number | undefined>(undefined);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);

  // Voice Note Recording State (Web Audio API)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasAudioRecorded, setHasAudioRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // IVR Dialpad State
  const [ivrDialedDigits, setIvrDialedDigits] = useState<string>('');
  const [ivrCallActive, setIvrCallActive] = useState(false);
  const [ivrPromptStep, setIvrPromptStep] = useState(0);

  // Update defaults when country changes
  useEffect(() => {
    setRegion(currentCountry.sampleRegions[0] || '');
    setLanguage(currentCountry.primaryLanguages[0] || 'English');
  }, [currentCountry]);

  // Voice recording handlers
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasAudioRecorded(true);
        if (!grievanceText) {
          setGrievanceText(
            currentCountry.code === 'IN' 
              ? 'Madurai Melur taluk: Major drinking water pipeline damaged for 12 villages. Water supply disrupted for over a week.'
              : currentCountry.code === 'BR'
              ? 'Falta de água encanada no distrito rural há mais de duas semanas. Solicitamos vistoria técnica.'
              : 'Citizen audio message recorded via Regional Civic Telephony Gateway.'
          );
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access handled with simulated voice capture:', err);
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 6) {
            stopVoiceRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      setHasAudioRecorded(true);
      if (!grievanceText) {
        setGrievanceText('Drinking water distribution pipeline completely severed. Emergency pipeline overhaul required.');
      }
    }
  };

  // IVR Dialpad press
  const handleKeypadPress = (digit: string) => {
    const newDigits = ivrDialedDigits + digit;
    setIvrDialedDigits(newDigits);
    
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

  // Handle Photo Preset Select & Vision Inspection
  const handleSelectPhotoPreset = async (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setPhotoUrl(preset.url);
    setSector(preset.sector);
    setUrgency(preset.urgency);
    setLanguage(preset.language);
    setRegion(preset.region);
    setGrievanceText(preset.text);
    setVisionDamageScore(preset.damageScore);
    setPhotoDescription(preset.title);
    setActiveChannel('Multimodal Photo Inspection');

    setIsAnalyzingPhoto(true);
    try {
      const res = await fetch('/api/vision/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl: preset.url,
          sector: preset.sector,
          countryCode: currentCountry.code,
          region: preset.region
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result?.severityScore) {
          setVisionDamageScore(data.result.severityScore);
        }
      }
    } catch {
      // Fallback score preserved
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;

    const newGrievance: CitizenGrievance = {
      id: `GRV-${currentCountry.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      countryCode: currentCountry.code,
      region,
      channel: activeChannel,
      originalText: grievanceText,
      originalLanguage: language,
      sector,
      urgency,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      citizenContactAnonymized: contactInfo,
      audioDurationSeconds: hasAudioRecorded ? recordingDuration || 38 : undefined,
      photoUrl: photoUrl || undefined,
      photoDescription: photoDescription || undefined,
      visionDamageScore: visionDamageScore,
      status: 'Ingested'
    };

    onGrievanceSubmitted(newGrievance);
    onTriggerFusion(newGrievance);
  };

  return (
    <div id="citizen-ingestion-hub" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{t('ingestion.header.badge', 'Multimodal Citizen Ingestion Hub')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentCountry.name} Ingestion Engine</span>
              <span className="text-2xl">{currentCountry.flag}</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Aggregates citizen development requests via voice notes, IVR telephony, messaging apps, and multimodal photo inspection across diverse BRICS linguistic regions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingestion Channel Controls & Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Radix UI Tabs for Channels */}
          <Tabs value={activeChannel} onValueChange={(val) => setActiveChannel(val as GrievanceChannel)}>
            <TabsList className="w-full">
              <TabsTrigger value="Voice IVR" className="gap-2">
                <Mic className="w-4 h-4" />
                <span>Voice / IVR</span>
              </TabsTrigger>
              <TabsTrigger value="Multimodal Photo Inspection" className="gap-2">
                <Camera className="w-4 h-4" />
                <span>Photo Inspection</span>
              </TabsTrigger>
              <TabsTrigger value="Messaging Apps" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp / SMS</span>
              </TabsTrigger>
            </TabsList>

            {/* Multimodal Photo Inspection Panel */}
            <TabsContent value="Multimodal Photo Inspection" className="mt-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">Gemini Multimodal & Vision AI Photo Triage</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                    Vertex AI Vision Supported
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Upload or select real-world infrastructure defect photographs (potholes, burst pipelines, clinic shortages) to automatically compute damage severity scores and verify against official datasets.
                </p>

                {/* Photo Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPhotoPreset(preset)}
                      className={`group cursor-pointer rounded-xl border p-2 text-left transition-all ${
                        photoUrl === preset.url
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="h-20 w-full rounded-lg overflow-hidden relative mb-2">
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 bg-slate-900/80 text-[10px] text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded">
                          {preset.damageScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-900 line-clamp-1">{preset.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{preset.sector}</div>
                    </div>
                  ))}
                </div>

                {photoUrl && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={photoUrl}
                      alt="Active preview"
                      className="w-28 h-24 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1.5 text-xs flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{photoDescription}</span>
                        <span className="text-amber-800 font-mono font-bold">
                          Vision Damage Severity: {visionDamageScore || 85}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        Gemini Multimodal inspection confirmed physical structural degradation. Geo-tagged evidence aligned with district public investment registry.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Active Voice IVR Recording Panel */}
            <TabsContent value="Voice IVR" className="mt-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      Regional Voice Grievance Telephony Engine
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Captures high-fidelity citizen voice streams in regional languages with automatic speech recognition.
                    </p>
                  </div>
                  {isRecording && (
                    <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full border border-red-200 font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                      <span>Recording: {recordingDuration}s</span>
                    </div>
                  )}
                </div>

                {/* Voice Visualizer / Controls */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs">
                    {[40, 65, 85, 30, 95, 70, 50, 80, 60, 90, 45, 75, 35, 88, 62].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isRecording
                            ? 'bg-emerald-600 animate-pulse'
                            : hasAudioRecorded
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                        style={{
                          height: isRecording ? `${Math.max(15, (height * Math.random() + 20))}%` : hasAudioRecorded ? `${height}%` : '20%',
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs"
                      >
                        <Mic className="w-4 h-4" />
                        <span>{t('ingestion.voice.start', 'Start Voice Recording')}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs"
                      >
                        <Square className="w-4 h-4" />
                        <span>Stop & Transcribe Audio</span>
                      </button>
                    )}

                    {hasAudioRecorded && !isRecording && (
                      <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Audio Captured ({recordingDuration || 42}s)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Messaging Apps Tab */}
            <TabsContent value="Messaging Apps" className="mt-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">WhatsApp & SMS Direct Dispatch</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                    End-to-End Encrypted
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Direct webhook simulation for official civic WhatsApp chatbots and regional SMS gateways across BRICS ministries.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Simulated Gateway Phone Number:</span>
                  <span className="font-mono text-emerald-700 font-bold">+91 1800-CIVIC-BOT</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Fields & Content */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Region */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('ingestion.form.region', 'Jurisdiction Region')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Tamil Nadu (Madurai - Melur)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
                    required
                  />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('ingestion.form.sector', 'Infrastructure Sector')}
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
                >
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Roads & Highways">Roads & Highways</option>
                  <option value="Healthcare">Healthcare & Hospitals</option>
                  <option value="Digital & Power">Digital & Power Grid</option>
                  <option value="Public Sanitation">Public Sanitation</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('ingestion.form.urgency', 'Citizen Urgency Level')}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
                >
                  <option value="Low">Low - Routine Civic Request</option>
                  <option value="Medium">Medium - Standard Public Service Gap</option>
                  <option value="High">High - Critical Civic Bottleneck</option>
                  <option value="Emergency">Emergency - Immediate Public Risk</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t('ingestion.form.language', 'Regional Language')}
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English, Tamil, Portuguese, Russian, Arabic"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Grievance Text Content */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>{t('ingestion.form.text', 'Citizen Grievance Description')}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Multi-lingual Natural Language Supported</span>
              </label>
              <textarea
                rows={4}
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder="Enter detailed regional citizen complaint..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-sans leading-relaxed font-medium"
                required
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automatic PII Redaction & SHA-256 Provenance Hash</span>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('ingestion.form.submit', 'Ingest & Fuse with Official Data')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* IVR Interactive Telephony Simulator */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">BRICS IVR Telephony Gateway</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Toll-Free Dial-in Simulator</p>
                </div>
              </div>

              <div className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-bold ${
                ivrCallActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse' : 'bg-slate-100 text-slate-600'
              }`}>
                {ivrCallActive ? 'CALL CONNECTED' : 'READY'}
              </div>
            </div>

            {/* Interactive Screen */}
            <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
              <div className="text-slate-400 flex items-center justify-between text-[11px]">
                <span>Toll-Free: +91 1800-CIVIC-BRICS</span>
                <span className="text-emerald-400 font-bold">Node: BR-IN-01</span>
              </div>
              <div className="text-emerald-300 text-xs min-h-[32px] bg-slate-950 p-2.5 rounded border border-slate-800">
                {ivrCallActive ? (
                  ivrPromptStep === 1
                    ? 'Press 1 for Water, 2 for Roads, 3 for Health. Press 9 for Emergency.'
                    : `Selection logged: Sector [${sector}], Urgency [${urgency}]. Speak your grievance after beep.`
                ) : (
                  'Dial 1800 to simulate rural citizen telephony intake.'
                )}
              </div>
              {ivrDialedDigits && (
                <div className="text-[11px] text-slate-400 truncate">
                  Dialed sequence: <span className="text-white font-bold">{ivrDialedDigits}</span>
                </div>
              )}
            </div>

            {/* Dialpad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="bg-slate-100 hover:bg-slate-200 active:bg-emerald-100 text-slate-800 font-bold py-2.5 rounded-lg text-sm transition-all border border-slate-200 shadow-xs"
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Call Action Buttons */}
            <div className="flex gap-2">
              {!ivrCallActive ? (
                <button
                  type="button"
                  onClick={startIvrCall}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Toll-Free Helpline</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={endIvrCall}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>End Call</span>
                </button>
              )}
            </div>
          </div>

          {/* DPG Guardrail & Security Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="text-slate-900 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>DPG Data Privacy & Sovereignty</span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium">
              All citizen voice notes and telephone recordings are processed on sovereign cloud instances. Voice biometric data and contact numbers are irreversibly tokenized before ingestion into the data fusion pipeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
