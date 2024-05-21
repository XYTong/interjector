
type SpeechRecognitionControllerEventName = 'start' | 'end' | 'result' | 'audiostart' | 'audioend' | 'soundstart' | 'soundend' | 'speechstart' | 'speechend' | 'nomatch';

class SpeechRecognitionController {
  private recognition: SpeechRecognition;
  private recognizing: boolean;

  private eventListeners: { [eventName in SpeechRecognitionControllerEventName]: { (event: SpeechRecognitionEvent): void }[] };

  constructor() {
    this.recognition = new window['webkitSpeechRecognition']();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.eventListeners = {
      'start': [],
      'end': [],
      'result': [],
      'audiostart': [],
      'audioend': [],
      'soundstart': [],
      'soundend': [],
      'speechstart': [],
      'speechend': [],
      'nomatch': []
    };
    this.recognition.onstart = ((event: SpeechRecognitionEvent): void => {
      this.emit('start', event);
    }).bind(this);
    this.recognition.onend = ((event: SpeechRecognitionEvent): void => {
      if (this.recognizing) {
        console.log('automatically restarting');
        this.recognition.stop();
        this.recognition.start();
      } else {
        this.reset();
        this.emit('end', event);
      }
    }).bind(this);
    this.recognition.onresult = (function (event: SpeechRecognitionEvent): void {
      this.emit('result', event);
    }).bind(this);
    this.recognition.onaudiostart = (function (event: SpeechRecognitionEvent): void {
      this.emit('audiostart', event);
    }).bind(this);
    this.recognition.onaudioend = (function (event: SpeechRecognitionEvent): void {
      this.emit('audioend', event);
    }).bind(this);
    this.recognition.onsoundstart = (function (event: SpeechRecognitionEvent): void {
      this.emit('soundstart', event);
    }).bind(this);
    this.recognition.onsoundend = (function (event: SpeechRecognitionEvent): void {
      this.emit('soundend', event);
    }).bind(this);
    this.recognition.onspeechstart = (function (event: SpeechRecognitionEvent): void {
      this.emit('speechstart', event);
    }).bind(this);
    this.recognition.onspeechend = (function (event: SpeechRecognitionEvent): void {
      this.emit('speechend', event);
    }).bind(this);
    this.recognition.onnomatch = (function (event: SpeechRecognitionEvent): void {
      this.emit('nomatch', event);
    }).bind(this);
    this.reset();
  }
  private emit(event: SpeechRecognitionControllerEventName, eventObject: SpeechRecognitionEvent): void {
    for (const callback of this.eventListeners[event]) {
      callback(eventObject);
    }
  }
  on(event: SpeechRecognitionControllerEventName, callback: (event: SpeechRecognitionEvent) => void): void {
    this.eventListeners[event].push(callback);
  }
  setLang(lang: string): void {
    this.recognition.lang = lang;
  }
  isRecognizing(): boolean {
    return this.recognizing;
  }
  reset(): void {
    this.recognizing = false;
    this.recognition.stop();
  }
  start(): void {
    this.recognition.start();
    this.recognizing = true;
  }
}
export default SpeechRecognitionController;