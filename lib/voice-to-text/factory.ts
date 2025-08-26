import { VoiceToTextAdapter } from './adapter';
import { GoogleCloudAdapter } from './implementations/google-cloud-adapter';

export type VoiceProvider = 'google-cloud' | 'web-speech' | 'azure' | 'aws';

/**
 * Factory for creating voice-to-text adapter instances
 * This allows easy switching between different voice API providers
 */
export class VoiceToTextFactory {
  static create(provider: VoiceProvider = 'google-cloud'): VoiceToTextAdapter {
    switch (provider) {
      case 'google-cloud':
        return new GoogleCloudAdapter();
      
      // Future implementations can be added here
      case 'web-speech':
        throw new Error('Web Speech API adapter not yet implemented');
      
      case 'azure':
        throw new Error('Azure Speech adapter not yet implemented');
      
      case 'aws':
        throw new Error('AWS Transcribe adapter not yet implemented');
      
      default:
        return new GoogleCloudAdapter();
    }
  }
}