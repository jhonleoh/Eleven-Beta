import { VoiceChanger } from "./voice-changer";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">ElevenLabs Text to Speech (Voice Generator)</h1>
      </header>
      <div className="flex-1">
        <VoiceChanger />
      </div>
      <footer className="text-center text-sm text-muted-foreground mt-8 py-4">
        <p>Made with ❤️ by Ruyi</p>
      </footer>
    </main>
  );
}
