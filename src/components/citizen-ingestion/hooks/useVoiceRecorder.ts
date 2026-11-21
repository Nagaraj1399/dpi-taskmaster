import { useCallback, useEffect, useRef, useState } from 'react';
import { VOICE_FALLBACK_MAX_SECONDS } from '../../../shared/constants';
import type { BricsCountryCode } from '../../../shared/types';

function getDefaultTranscriptForCountry(countryCode: BricsCountryCode): string {
  if (countryCode === 'IN') {
    return 'Madurai Melur taluk: Major drinking water pipeline damaged for 12 villages. Water supply disrupted for over a week.';
  }
  if (countryCode === 'BR') {
    return 'Falta de água encanada no distrito rural há mais de duas semanas. Solicitamos vistoria técnica.';
  }
  return 'Citizen audio message recorded via Regional Civic Telephony Gateway.';
}

/**
 * Manages browser MediaRecorder voice capture with automatic cleanup of timers,
 * media tracks, and object URLs on unmount.
 */
export function useVoiceRecorder(
  countryCode: BricsCountryCode,
  onTranscriptFallback: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasAudioRecorded, setHasAudioRecorded] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    clearTimer();

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
    } else {
      setHasAudioRecorded(true);
      onTranscriptFallback(getDefaultTranscriptForCountry(countryCode));
    }
  }, [clearTimer, countryCode, onTranscriptFallback]);

  const startRecording = useCallback(async () => {
    setMicNotice(null);
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone API unavailable');
      }

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
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const url = URL.createObjectURL(audioBlob);
        audioUrlRef.current = url;
        setAudioUrl(url);
        setHasAudioRecorded(true);
        onTranscriptFallback(getDefaultTranscriptForCountry(countryCode));
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      clearTimer();
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      setMicNotice(
        'Browser microphone unavailable or denied; running timed sample voice capture instead.'
      );
      setIsRecording(true);
      setRecordingDuration(0);
      clearTimer();
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev + 1 >= VOICE_FALLBACK_MAX_SECONDS) {
            stopRecording();
            return VOICE_FALLBACK_MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    }
  }, [clearTimer, countryCode, onTranscriptFallback, stopRecording]);

  useEffect(() => {
    return () => {
      clearTimer();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.stop();
        recorder.stream.getTracks().forEach((track) => track.stop());
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [clearTimer]);

  return {
    isRecording,
    recordingDuration,
    hasAudioRecorded,
    audioUrl,
    micNotice,
    startRecording,
    stopRecording,
  };
}
