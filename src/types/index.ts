export interface Voice {
  id: string;
  name: string;
}

export interface VoiceSettings {
  speed: number;
}

export interface TextToSpeechRequest {
  model_id: string;
  text: string;
  voice_settings: VoiceSettings;
}

export interface ElevenLabsResponse {
  audio: string;
  generationTime: number;
}
