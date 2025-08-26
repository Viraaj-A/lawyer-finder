/**
 * Voice-to-Text Adapter Interface
 * This interface allows for swappable voice transcription implementations
 */

export interface VoiceToTextResult {
  transcript: string;
  confidence?: number;
  isFinal: boolean;
  error?: string;
}

export interface VoiceToTextOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export abstract class VoiceToTextAdapter {
  /**
   * Start recording and transcribing audio
   */
  abstract startRecording(options?: VoiceToTextOptions): Promise<void>;
  
  /**
   * Stop recording
   */
  abstract stopRecording(): Promise<VoiceToTextResult>;
  
  /**
   * Check if currently recording
   */
  abstract isRecording(): boolean;
  
  /**
   * Set callback for interim results during recording
   */
  abstract onInterimResult?(callback: (result: VoiceToTextResult) => void): void;
  
  /**
   * Clean up resources
   */
  abstract dispose(): void;
}

/**
 * Factory function type for creating adapter instances
 */
export type VoiceToTextAdapterFactory = () => VoiceToTextAdapter;