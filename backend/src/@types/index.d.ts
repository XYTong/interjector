import * as http from 'http';

export type ServerOptions = {
  port: number;
  host: string;
  key: string | Buffer;
  cert: string | Buffer;
  httpOnly: boolean;
}

export interface RouteHandler {
  (req: http.IncomingMessage, res: http.ServerResponse, ...pathSegments: string[]): void;
}

export interface Routes {
  [key: string]: RouteHandler | Routes;
}

export interface Mimes {
  [key: string]: string
}

export interface TranslationResult {
  text: string;
}

export interface TranslationOptions {
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  backend: 'free-google-translate' | 'google-translate' | 'bing-translate' | 'deepl-translate' | 'openai-translate' | '',
  apiUrl?: string,
  apiKey?: string,
  model?: string,
  prompt?: string
}

export interface ChatCompletion {
  choices: {
    content_filter_results: {
      hate: {
        filtered: boolean;
        severity: string;
      };
      self_harm: {
        filtered: boolean;
        severity: string;
      };
      sexual: {
        filtered: boolean;
        severity: string;
      };
      violence: {
        filtered: boolean;
        severity: string;
      };
    };
    finish_reason: string;
    index: number;
    logprobs: null;
    message: {
      content: string;
      role: string;
    };
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
  prompt_filter_results: {
    prompt_index: number;
    content_filter_results: {
      hate: {
        filtered: boolean;
        severity: string;
      };
      self_harm: {
        filtered: boolean;
        severity: string;
      };
      sexual: {
        filtered: boolean;
        severity: string;
      };
      violence: {
        filtered: boolean;
        severity: string;
      };
    };
  }[];
  system_fingerprint: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}