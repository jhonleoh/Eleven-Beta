import { VoiceChanger } from "./voice-changer";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">ElevenLabs Voice Changer</h1>
        <p className="text-muted-foreground">Convert your text to lifelike speech with AI-powered voices</p>
        <p className="text-xs mt-2 text-muted-foreground max-w-lg mx-auto">
          Note: This demo uses ElevenLabs' free API which has usage limitations.
          If you encounter any issues, please try again later or visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs.io</a>.
        </p>
      </header>
      <div className="flex-1">
        <VoiceChanger />
      </div>
      <footer className="text-center text-sm text-muted-foreground mt-8 py-4">
        <p>Powered by ElevenLabs API • {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
