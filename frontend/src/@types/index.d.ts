export type GlobalOptions = {
  translation: {
    sourceLanguage: string;
    targetLanguage: string;
    backend: 'free-google-translate' | 'google-translate' | 'bing-translate' | 'deepl-translate' | 'openai-translate';
    apiUrl: string;
    apiKey: string;
    model: string;
    prompt: string;
  },
  completion: {
    apiKey: string;
    apiURL: string;
    model: string;
    prompt: string;
  };
};
