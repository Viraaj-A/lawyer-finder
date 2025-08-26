"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { VoiceToTextFactory, VoiceProvider } from "@/lib/voice-to-text/factory";
import { VoiceToTextAdapter } from "@/lib/voice-to-text/adapter";
import AudioWaveform from "./AudioWaveform";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  provider?: VoiceProvider;
  className?: string;
}

export default function VoiceInput({ 
  onTranscript, 
  provider = 'google-cloud',
  className = "" 
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const adapterRef = useRef<VoiceToTextAdapter | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (adapterRef.current) {
        adapterRef.current.dispose();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      
      // First, test microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted');
        
        // Test if we're getting audio data
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const audioLevel = dataArray.reduce((a, b) => a + b) / dataArray.length;
        console.log('Audio level detected:', audioLevel);
        
        // Clean up test
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      } catch (micError) {
        console.error('Microphone test failed:', micError);
        throw new Error('Microphone not available. Please check permissions and that a microphone is connected.');
      }
      
      // Create adapter instance using factory
      adapterRef.current = VoiceToTextFactory.create(provider);
      
      // Start recording
      await adapterRef.current.startRecording({
        language: 'en-NZ',
        continuous: false,
        interimResults: false
      });
      
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!adapterRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Stop and get transcription
      const result = await adapterRef.current.stopRecording();
      
      if (result.error) {
        setError(result.error);
      } else if (result.transcript) {
        onTranscript(result.transcript);
      }
      
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError('Failed to process audio');
    } finally {
      setIsProcessing(false);
      if (adapterRef.current) {
        adapterRef.current.dispose();
        adapterRef.current = null;
      }
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          onClick={handleClick}
          disabled={isProcessing}
          className={`rounded-full hover:bg-secondary ${isRecording ? 'animate-pulse' : ''}`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        
        {isRecording && (
          <div className="w-48 h-12">
            <AudioWaveform isActive={isRecording} />
          </div>
        )}
      </div>
      
      {isRecording && !error && (
        <span className="text-xs text-destructive font-medium">
          Recording... Speak clearly
        </span>
      )}
      
      {isProcessing && (
        <span className="text-xs text-muted-foreground">
          Processing...
        </span>
      )}
      
      {error && (
        <span className="text-xs text-destructive max-w-xs text-center">
          {error}
        </span>
      )}
    </div>
  );
}