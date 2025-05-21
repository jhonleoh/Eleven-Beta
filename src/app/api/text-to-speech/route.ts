import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Received request to /api/text-to-speech');
    const body = await request.json();
    const { voiceId, text, speed } = body;

    console.log(`Processing request for voice ${voiceId}, text length: ${text?.length || 0}`);

    if (!voiceId || !text) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Prepare the payload for ElevenLabs API
    const payload = {
      model_id: "eleven_multilingual_v2",
      text: text,
      voice_settings: {
        speed: speed || 1,
      },
    };

    console.log('Sending request to ElevenLabs API');

    // Try the standard endpoint first
    let response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?allow_unauthenticated=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://elevenlabs.io',
          'Referer': 'https://elevenlabs.io/',
        },
        body: JSON.stringify(payload),
      }
    );

    // Log the response status for debugging
    console.log('ElevenLabs API response status (standard endpoint):', response.status);

    // If the standard endpoint fails, try the one with timestamps
    if (!response.ok) {
      console.log('Standard endpoint failed, trying with timestamps endpoint');
      response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?allow_unauthenticated=1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://elevenlabs.io',
            'Referer': 'https://elevenlabs.io/',
          },
          body: JSON.stringify(payload),
        }
      );

      console.log('ElevenLabs API response status (stream endpoint):', response.status);
    }

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('ElevenLabs API error:', errorData);
        return NextResponse.json(errorData, { status: response.status });
      } catch (e) {
        console.error('Error parsing error response:', e);
        return NextResponse.json(
          { error: `API error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }
    }

    // Get the audio data from the response
    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    console.log('Response content type:', contentType);

    const audioData = await response.arrayBuffer();
    console.log(`Received audio data of size: ${audioData.byteLength} bytes`);

    // Return the audio data with the appropriate headers
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': audioData.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error proxying request to ElevenLabs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
