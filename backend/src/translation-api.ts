import type { TranslationOptions, TranslationResult, ChatCompletion } from './@types';

const freeGoogleTranslator = function () {
  // https://github.com/ssut/py-googletrans/issues/268
  return async function (options: TranslationOptions): Promise<TranslationResult> {
    console.log(options);
    let res = await fetch(`${options.apiUrl}?client=dict-chrome-ex&sl=${options.sourceLanguage.slice(0, 2)}&tl=${options.targetLanguage.slice(0, 2)}&dt=t&q=${options.text}&id=UTF-8&oe=UTF-8`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: options.text,
        sourceLanguage: options.sourceLanguage,
        targetLanguage: options.targetLanguage
      })
    }).then(res => res.text());
    console.log(res);
    res = JSON.parse(res);
    while (typeof res !== 'string') {
      res = res[0];
    }
    return { text: res };
  }
};

// https://cloud.google.com/translate/docs/reference/rest
// as of 2024-05-19
// free tier(NMT): 500,000 characters per month
// paid tier: 
//     NMT: $20 per 1,000,000 characters
//     LLM: $25 per 1,000,000 characters
const googleTranslator = function () {
  return async function (options: TranslationOptions): Promise<TranslationResult> {
    return { text: 'NOT_IMPLEMENTED' };
  }
};

// https://learn.microsoft.com/en-us/azure/ai-services/translator/reference/v3-0-translate
// as of 2024-05-19
// free tier: 2,000,000 characters per month
// paid tier: $10 per 1,000,000 characters
const bingTranslator = function () {
  return async function (options: TranslationOptions): Promise<TranslationResult> {
    return { text: 'NOT_IMPLEMENTED' };
  }
};

// https://developers.deepl.com/docs/api-reference/translate
// as of 2024-05-19
// free tier: 500,000 characters per month
// paid tier: €4.99 + €0.00002 per character
const deepLTranslator = function () {
  return async function (options: TranslationOptions): Promise<TranslationResult> {
    return { text: 'NOT_IMPLEMENTED' };
  }
};

const openAITransaltor = function () {
  return async function (options: TranslationOptions): Promise<TranslationResult> {
    const completion = await fetch(`${options.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey} `
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          {
            role: 'system',
            content: options.prompt
          },
          {
            role: 'user',
            content: options.text
          }
        ]
      })
    }).then((res: Response): Promise<ChatCompletion> => res.json());
    if (completion.choices[0].finish_reason === 'stop') {
      return {
        text: completion.choices[0].message.content
      };
    } else {
      return {
        text: `ERR: ${completion.choices[0].finish_reason}`
      }
    }
  }
};

export default {
  'free-google-translate': freeGoogleTranslator(),
  'google-translate': googleTranslator(),
  'bing-translate': bingTranslator(),
  'deepl-translate': deepLTranslator(),
  'openai-translate': openAITransaltor()
};