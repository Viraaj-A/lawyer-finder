import { VoiceToTextAdapter, VoiceToTextResult, VoiceToTextOptions } from '../adapter';

/**
 * Google Cloud Speech-to-Text adapter implementation
 * Uses the MediaRecorder API to capture audio and sends it to our API endpoint
 */
export class GoogleCloudAdapter extends VoiceToTextAdapter {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecordingFlag = false;
  private interimCallback?: (result: VoiceToTextResult) => void;
  private stream: MediaStream | null = null;

  async startRecording(options?: VoiceToTextOptions): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });

      // Create MediaRecorder with appropriate MIME type
      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
      this.audioChunks = [];

      // Collect audio data chunks
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecordingFlag = true;

      // For continuous recording with interim results
      if (options?.continuous && options?.interimResults) {
        // Record in chunks for interim processing
        this.mediaRecorder.start(1000); // Collect data every second
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Failed to access microphone. Please ensure microphone permissions are granted.');
    }
  }

  async stopRecording(): Promise<VoiceToTextResult> {
    if (!this.mediaRecorder || !this.isRecordingFlag) {
      return {
        transcript: '',
        isFinal: true,
        error: 'No recording in progress'
      };
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = async () => {
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(this.audioChunks, { 
            type: this.mediaRecorder!.mimeType 
          });

          // Check if we actually recorded something
          console.log('Audio recording details:', {
            blobSize: audioBlob.size,
            blobType: audioBlob.type,
            chunksCount: this.audioChunks.length,
            mimeType: this.mediaRecorder!.mimeType
          });

          if (audioBlob.size === 0) {
            throw new Error('No audio was recorded. Please check your microphone.');
          }

          // Send to our API endpoint
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', 'en-NZ');

          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.text();
            } catch {
              errorData = 'Unable to read error response';
            }
            
            console.error('API Response Error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData
            });
            
            // Parse JSON error if possible
            try {
              const jsonError = JSON.parse(errorData);
              throw new Error(jsonError.error || `API Error: ${response.status}`);
            } catch {
              throw new Error(`Failed to transcribe audio: ${response.status} - ${errorData}`);
            }
          }

          const result = await response.json();
          
          // Clean up
          this.dispose();

          resolve({
            transcript: result.transcript,
            confidence: result.confidence,
            isFinal: true
          });

        } catch (error) {
          console.error('Transcription error:', error);
          resolve({
            transcript: '',
            isFinal: true,
            error: 'Failed to transcribe audio'
          });
        }
      };

      // Stop recording
      this.mediaRecorder!.stop();
      this.isRecordingFlag = false;
    });
  }

  isRecording(): boolean {
    return this.isRecordingFlag;
  }

  onInterimResult(callback: (result: VoiceToTextResult) => void): void {
    this.interimCallback = callback;
  }

  dispose(): void {
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Clear recorder
    if (this.mediaRecorder) {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      this.mediaRecorder = null;
    }

    this.audioChunks = [];
    this.isRecordingFlag = false;
  }

  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Default fallback
  }
}