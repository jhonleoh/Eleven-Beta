# ElevenLabs Voice Changer

A simple web application that allows you to convert text to lifelike speech using the ElevenLabs API.

## Features

- Convert text to speech using ElevenLabs API
- Choose from multiple AI voices
- Adjust speech speed
- Listen to generated audio directly in the browser
- Clean and responsive user interface

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- ElevenLabs API

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- Bun (recommended) or npm

### Installation

1. Clone this repository
2. Install dependencies:
```bash
cd elevenlabs-voice-changer
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select a voice from the dropdown menu
2. Adjust the speech speed using the slider
3. Enter the text you want to convert to speech
4. Click the "Generate Audio" button
5. Listen to the generated audio

## Deployment

This project can be deployed on Netlify:

```bash
bun run build
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- [ElevenLabs](https://elevenlabs.io/) for their amazing text-to-speech API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
