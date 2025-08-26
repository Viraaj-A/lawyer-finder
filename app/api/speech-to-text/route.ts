import { NextRequest, NextResponse } from 'next/server';
import speech from '@google-cloud/speech';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'en-NZ';
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check audio file details
    console.log('Received audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: 'Audio file is empty. No audio was recorded.' },
        { status: 400 }
      );
    }

    // Convert audio file to buffer
    const audioBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // Initialize the Google Cloud Speech client with credentials from env
    let credentials;
    try {
      const credentialsString = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON;
      console.log('Credentials check:', {
        exists: !!credentialsString,
        length: credentialsString?.length || 0,
        startsWithBrace: credentialsString?.startsWith('{'),
        endsWithBrace: credentialsString?.endsWith('}')
      });
      
      if (!credentialsString) {
        throw new Error('GOOGLE_CLOUD_CREDENTIALS_JSON not found in environment variables');
      }
      
      credentials = JSON.parse(credentialsString);
      
      console.log('Parsed credentials check:', {
        hasType: !!credentials.type,
        hasProjectId: !!credentials.project_id,
        hasPrivateKey: !!credentials.private_key,
        hasClientEmail: !!credentials.client_email,
        projectId: credentials.project_id
      });
      
      if (!credentials.private_key) {
        throw new Error('Invalid credentials format - missing private_key');
      }
    } catch (credError) {
      console.error('Credentials parsing error:', credError);
      return NextResponse.json(
        { error: 'Speech service configuration error. Please check server credentials.' },
        { status: 500 }
      );
    }

    const client = new speech.SpeechClient({ credentials });

    // Prepare the streaming request configuration
    const streamingRequest = {
      config: {
        encoding: 'WEBM_OPUS' as const,
        sampleRateHertz: 48000,
        languageCode: 'en-US', // Can also use 'en-AU' or 'en-GB'
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false, // Set true if you need word timing
        enableWordConfidence: false, // Set true to get confidence per word
        // NO model specified = uses cheapest default model
        
        // IMPORTANT: Data Logging Configuration
        // Current: WITH data logging (SKU: 67F5-A183-E319) - $0.006/15 seconds
        // To disable data logging (for privacy), uncomment the next line:
        // useEnhanced: true, // SKU: 9A39-6157-9D25 - $0.009/15 seconds (50% more expensive)
      },
      interimResults: false, // Set to true if you want partial results
    };

    // Create a promise to handle the streaming recognition
    const transcriptPromise = new Promise<string>((resolve, reject) => {
      let fullTranscript = '';
      
      // Create the streaming recognize stream
      const recognizeStream = client
        .streamingRecognize(streamingRequest)
        .on('error', (error) => {
          console.error('Streaming error:', error);
          reject(error);
        })
        .on('data', (data) => {
          if (data.results[0] && data.results[0].alternatives[0]) {
            const transcript = data.results[0].alternatives[0].transcript;
            fullTranscript += transcript + ' ';
            console.log('Received transcript chunk:', transcript);
          }
        })
        .on('end', () => {
          resolve(fullTranscript.trim());
        });

      // Create a readable stream from the buffer and pipe it
      const audioStream = Readable.from(buffer);
      audioStream.pipe(recognizeStream);
    });

    try {
      // Wait for the transcription to complete
      const transcription = await transcriptPromise;

      console.log('Transcription successful:', {
        length: transcription.length,
        language
      });

      return NextResponse.json({
        transcript: transcription || "No speech detected. Please speak clearly into the microphone.",
        confidence: 0.95, // Streaming API doesn't provide confidence scores
        isFinal: true
      });
    } catch (apiError: any) {
      console.error('Google Speech-to-Text streaming error:', {
        message: apiError.message,
        code: apiError.code,
        details: apiError.details,
        stack: apiError.stack
      });
      
      // Provide more specific error messages
      let errorMessage = 'Speech recognition failed.';
      if (apiError.code === 7) {
        errorMessage = 'Permission denied. Check API credentials.';
      } else if (apiError.code === 3) {
        errorMessage = 'Invalid audio format or encoding.';
      } else if (apiError.message?.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
      }
      
      return NextResponse.json(
        { error: `${errorMessage} Details: ${apiError.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Speech-to-text error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}