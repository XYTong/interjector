// import '@types/dom-speech-recognition';
import type { GlobalOptions } from './@types';
import SpeechRecognitionController from './SpeechRecognitionController';
import ResultManager from './ResultManager';
import ConsolePanel from './ConsolePanel';

const globalOptions: GlobalOptions = localStorage.getItem('globalOptions') ? JSON.parse(localStorage.getItem('globalOptions')!) : {
  translation: {
    targetLanguage: '',
    sourceLanguage: '',
    backend: '',
    apiUrl: '',
    apiKey: '',
    model: '',
    prompt: ''
  },
  completion: {
    model: '',
    apiKey: '',
    apiURL: '',
    prompt: ''
  }
};

class Interjector {
  private speechRecognitionController: SpeechRecognitionController;
  private resultManager: ResultManager;
  private consolePanel: ConsolePanel;
  private onGoingTranscript: string;
  constructor() {
    this.speechRecognitionController = new SpeechRecognitionController();
    this.resultManager = new ResultManager();
    this.consolePanel = new ConsolePanel();
    this.consolePanel.on('start', () => {
      this.speechRecognitionController.setLang(globalOptions.translation.sourceLanguage);
      this.speechRecognitionController.start();
    });
    this.consolePanel.on('stop', () => {
      this.speechRecognitionController.reset();
    });
    this.consolePanel.on('clear', () => {
      this.resultManager.clearTranscript();
    });
    this.consolePanel.on('complete', () => {
      this.completeTranscript();
    });
    this.speechRecognitionController.on('start', () => {
      this.resultManager.setOnGoingTranscript(this.onGoingTranscript);
      this.consolePanel.start();
    });
    this.speechRecognitionController.on('end', () => {
      this.resultManager.setOnGoingTranscript(this.onGoingTranscript);
      this.consolePanel.reset();
    });
    this.speechRecognitionController.on('result', (event: SpeechRecognitionEvent): void => {
      let newOnGoingTranscript: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.resultManager.addFinalTranscript(event.results[i][0].transcript);
          fetch(`/api/translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: event.results[i][0].transcript,
              targetLanguage: globalOptions.translation.targetLanguage,
              sourceLanguage: globalOptions.translation.sourceLanguage,
              backend: globalOptions.translation.backend,
              apiUrl: globalOptions.translation.apiUrl,
              apiKey: globalOptions.translation.apiKey,
              model: globalOptions.translation.model
            })
          })
            .then((res: Response): Promise<{ text: string }> => res.json())
            .then((res: { text: string }): void => {
              this.resultManager.addTranslatedTranscript(res.text);
            });
        } else {
          newOnGoingTranscript.push(event.results[i][0].transcript);
        }
        if (newOnGoingTranscript.length > 1 && newOnGoingTranscript.slice(0, -1).join(' ') !== this.onGoingTranscript) {
          fetch(`/api/translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: newOnGoingTranscript.slice(0, -1).join(' '),
              targetLanguage: globalOptions.translation.targetLanguage,
              sourceLanguage: globalOptions.translation.sourceLanguage,
              backend: globalOptions.translation.backend,
              apiUrl: globalOptions.translation.apiUrl,
              apiKey: globalOptions.translation.apiKey,
              model: globalOptions.translation.model
            })
          })
            .then((res: Response): Promise<{ text: string }> => res.json())
            .then((res: { text: string }): void => {
              this.resultManager.setOnGoingTranscriptTranslation(res.text);
            });
        }
        this.onGoingTranscript = newOnGoingTranscript.slice(0, -1).join(' ');
        this.resultManager.setOnGoingTranscript(newOnGoingTranscript.map((t: string) => `<div class="transcript-item not-final">${t}</div>`).join(' '));
      }
    });
    this.speechRecognitionController.on('audiostart', () => {
      this.consolePanel.activeAudioIndicator();
    });
    this.speechRecognitionController.on('audioend', () => {
      this.consolePanel.deactiveAudioIndicator();
    });
    this.speechRecognitionController.on('soundstart', () => {
      this.consolePanel.activeSoundIndicator();
    });
    this.speechRecognitionController.on('soundend', () => {
      this.consolePanel.deactiveSoundIndicator();
    });
    this.speechRecognitionController.on('speechstart', () => {
      this.consolePanel.activeSpeechIndicator();
    });
    this.speechRecognitionController.on('speechend', () => {
      this.consolePanel.deactiveSpeechIndicator();
    });
    this.speechRecognitionController.on('nomatch', () => {
      console.log('nomatch'); // when does this happen?
    });

  }
  completeTranscript(): void {
    const abortController = new AbortController();
    const completionDom = document.createElement('div');
    completionDom.classList.add('completion');
    const resultManager = this.resultManager;
    resultManager.addCompletion(completionDom);
    fetch(`${globalOptions.completion.apiURL
      }/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${globalOptions.completion.apiKey} `
      },
      body: JSON.stringify({
        model: globalOptions.completion.model,
        messages: [
          {
            role: 'system',
            content: globalOptions.completion.prompt,
          },
          {
            role: 'user',
            content: resultManager.getTranscript(),
          }
        ],
        stream: true
      }),
      signal: abortController.signal,
    }).then((res: Response): any => {
      const decoder = new TextDecoder();
      const reader = res.body!.getReader();
      let unprocessedParts: string = '';
      reader.read().then(function processResult({ done, value }) { // how is the type here?
        const lines = done ? unprocessedParts.split("\n") : (unprocessedParts + decoder.decode(value)).split("\n");
        unprocessedParts = lines.pop()!;
        for (const line of lines) {
          if (line.length === 0 || line === "data: [DONE]") {
            continue;
          }
          const content = JSON.parse(line.replace("data: ", ""));
          if (content.choices.length > 0 && content.choices[0].finish_reason !== 'stop') {
            const tokenDom = document.createElement('span');
            tokenDom.classList.add('token');
            tokenDom.innerText = content.choices[0].delta.content;
            completionDom.appendChild(tokenDom);
            resultManager.scrollToBottomCompletions();
          }
        }
        return done ? undefined : reader.read().then(processResult);
      });
    });
  }
}

const interjector = new Interjector();