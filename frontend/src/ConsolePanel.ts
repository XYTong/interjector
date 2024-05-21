
type ConsolePanelEventName = 'start' | 'stop' | 'clear' | 'complete';

class ConsolePanel {
  private startBtnDom: HTMLButtonElement;
  private clearBtnDom: HTMLButtonElement;
  private runningIndicatorDom: HTMLDivElement;
  private audioIndicatorDom: HTMLDivElement;
  private soundIndicatorDom: HTMLDivElement;
  private speechIndicatorDom: HTMLDivElement;
  private completeBtnDom: HTMLDivElement;

  private eventListeners: { [eventName in ConsolePanelEventName]: { (event?: SpeechRecognitionEvent): void }[] };
  constructor() {
    this.startBtnDom = <HTMLButtonElement>document.getElementById('start-btn')!;
    this.clearBtnDom = <HTMLButtonElement>document.getElementById('clear-btn')!;
    this.runningIndicatorDom = <HTMLDivElement>document.getElementById('running-indicator')!;
    this.audioIndicatorDom = <HTMLDivElement>document.getElementById('audio-indicator')!;
    this.soundIndicatorDom = <HTMLDivElement>document.getElementById('sound-indicator')!;
    this.speechIndicatorDom = <HTMLDivElement>document.getElementById('speech-indicator')!;
    this.completeBtnDom = <HTMLDivElement>document.getElementById('complete-btn')!;
    this.eventListeners = {
      'start': [],
      'stop': [],
      'clear': [],
      'complete': []
    };
    this.startBtnDom.addEventListener('click', (() => {
      if (this.startBtnDom.innerHTML === 'Start') {
        this.emit('start');
      } else {
        this.emit('stop');
      }
    }).bind(this));
    this.clearBtnDom.addEventListener('click', (() => {
      this.emit('clear');
    }).bind(this));
    this.completeBtnDom.addEventListener('click', (() => {
      this.emit('complete');
    }).bind(this));
  }
  private emit(event: ConsolePanelEventName, eventObject?: SpeechRecognitionEvent): void {
    for (const callback of this.eventListeners[event]) {
      callback(eventObject ? eventObject : undefined);
    }
  }
  on(event: ConsolePanelEventName, callback: (event?: SpeechRecognitionEvent) => void): void {
    this.eventListeners[event].push(callback);
  }
  start(): void {
    this.deactiveClearBtn();
    this.activeRunningIndicator();
    this.startBtnDom.innerHTML = "Stop";
  }
  reset(): void {
    this.deactiveRunningIndicator();
    this.deactiveAudioIndicator();
    this.deactiveSoundIndicator();
    this.deactiveSpeechIndicator();
    this.deactiveClearBtn();
    this.startBtnDom.innerHTML = "Start";
  }
  activeRunningIndicator(): void {
    this.runningIndicatorDom.classList.add('active');
  }
  deactiveRunningIndicator(): void {
    this.runningIndicatorDom.classList.remove('active');
  }
  activeAudioIndicator(): void {
    this.audioIndicatorDom.classList.add('active');
  }
  deactiveAudioIndicator(): void {
    this.audioIndicatorDom.classList.remove('active');
  }
  activeSoundIndicator(): void {
    this.soundIndicatorDom.classList.add('active');
  }
  deactiveSoundIndicator(): void {
    this.soundIndicatorDom.classList.remove('active');
  }
  activeSpeechIndicator(): void {
    this.speechIndicatorDom.classList.add('active');
  }
  deactiveSpeechIndicator(): void {
    this.speechIndicatorDom.classList.remove('active');
  }
  activeClearBtn(): void {
    this.clearBtnDom.disabled = true;
  }
  deactiveClearBtn(): void {
    this.clearBtnDom.disabled = false;
  }
}

export default ConsolePanel;