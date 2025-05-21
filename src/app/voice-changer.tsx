"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { availableVoices } from "@/lib/voices";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Download } from "lucide-react";

export function VoiceChanger() {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState(availableVoices[0].id);
  const [speed, setSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    try {
      setIsGenerating(true);
      setAudioUrl(null);
      setAudioBlob(null);
      setErrorMessage(null);

      console.log("Generating audio for text:", text);

      // Use our proxy API instead of calling ElevenLabs directly
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId,
          text,
          speed,
        }),
      });

      console.log("API response status:", response.status);
      console.log("API response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("API Error:", errorData);
        } catch (e) {
          console.error("Error parsing error response:", e);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        // Check for quota exceeded error
        if (errorData.detail && errorData.detail.status === "quota_exceeded") {
          setErrorMessage("Free quota exceeded. ElevenLabs limits the number of free requests you can make.");
          throw new Error("ElevenLabs free quota exceeded");
        }

        throw new Error(errorData.detail?.message || "Failed to generate audio");
      }

      // Get the audio data as a blob
      const blob = await response.blob();
      console.log("Received blob:", blob);
      console.log("Blob type:", blob.type);
      console.log("Blob size:", blob.size);

      if (blob.size === 0) {
        throw new Error("Received empty audio data");
      }

      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Play audio automatically
      if (audioRef.current) {
        audioRef.current.load();
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Error playing audio. Try clicking play manually.");
          });
        }
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      if (!errorMessage) {
        toast.error(error instanceof Error ? error.message : "Failed to generate audio");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioBlob || !audioUrl) return;

    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = `elevenlabs-${voiceId.slice(0, 6)}-${Date.now()}.mp3`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Speech</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>API Limit Reached</AlertTitle>
            <AlertDescription>
              {errorMessage}
              <p className="mt-2">
                Due to API quotas, this demo has limited functionality.
                For a full experience, visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs.io</a>.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label htmlFor="voice" className="text-sm font-medium">
            Voice
          </label>
          <Select value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="speed" className="text-sm font-medium">
            Speed: {speed.toFixed(1)}
          </label>
          <Slider
            id="speed"
            min={0.5}
            max={2}
            step={0.1}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="text" className="text-sm font-medium">
            Text <span className="text-xs text-muted-foreground">({text.length} / 1000 characters)</span>
          </label>
          <Textarea
            id="text"
            placeholder="Enter text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
            maxLength={1000}
          />
        </div>

        {audioUrl && (
          <div className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Audio Preview</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!audioBlob}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            <audio ref={audioRef} controls className="w-full" src={audioUrl} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateAudio}
          disabled={isGenerating || !text.trim()}
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate Audio"}
        </Button>
      </CardFooter>
    </Card>
  );
}
