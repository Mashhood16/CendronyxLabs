declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  const SpeechRecognition: any;
  const webkitSpeechRecognition: any;
  const SpeechRecognitionEvent: any;
  type SpeechRecognition = any;
  type SpeechRecognitionEvent = any;
}

export {};
