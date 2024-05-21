type ResultManagerEventName = 'cleared';
class ResultManager {
  private transcriptDom: HTMLDivElement;
  private transcriptTranslatedDom: HTMLDivElement;
  private transcriptFinalDom: HTMLDivElement;
  private transcriptOnGoingDom: HTMLDivElement;
  private transcriptTranslatedFinalDom: HTMLDivElement;
  private transcriptTranslatedOnGoingDom: HTMLDivElement;
  private completionsDom: HTMLDivElement;

  private eventListeners: { [eventName in ResultManagerEventName]: { (event: any): void }[] };

  constructor() {
    this.transcriptDom = <HTMLDivElement>document.getElementById('transcript')!;
    this.transcriptTranslatedDom = <HTMLDivElement>document.getElementById('transcript-translated')!;
    this.transcriptFinalDom = <HTMLDivElement>document.getElementById('transcript-final')!;
    this.transcriptOnGoingDom = <HTMLDivElement>document.getElementById('transcript-ongoing')!;
    this.transcriptTranslatedFinalDom = <HTMLDivElement>document.getElementById('transcript-translated-final')!;
    this.transcriptTranslatedOnGoingDom = <HTMLDivElement>document.getElementById('transcript-translated-ongoing')!;
    this.completionsDom = <HTMLDivElement>document.getElementById('completions')!;
    this.eventListeners = {
      'cleared': []
    };
  }
  on(event: ResultManagerEventName, callback: (event: any) => void): void {
    this.eventListeners[event].push(callback);
  }
  private emit(event: ResultManagerEventName, eventObject?: SpeechRecognitionEvent): void {
    for (const callback of this.eventListeners[event]) {
      callback(eventObject ? eventObject : undefined);
    }
  }
  clearTranscript(): void {
    this.transcriptFinalDom.innerHTML = '';
    this.transcriptOnGoingDom.innerHTML = '';
    this.transcriptTranslatedFinalDom.innerHTML = '';
    this.transcriptTranslatedOnGoingDom.innerHTML = '';
    this.emit('cleared');
  }
  addFinalTranscript(transcript: string): void {
    this.transcriptFinalDom.innerHTML += ` <div class="transcript-item final">${transcript}</div>`;
    this.scrollToBottomTranscript();
  }
  setOnGoingTranscript(transcript: string): void {
    this.transcriptOnGoingDom.innerHTML = ` <div class="transcript-item not-final">${transcript}</div>`;
  }
  setOnGoingTranscriptTranslation(translatedTranscript: string): void {
    this.transcriptTranslatedOnGoingDom.innerHTML = ` <div class="transcript-item not-final">${translatedTranscript}</div>`;
    this.scrollToBottomTranslatedTranscript();
  }
  getTranscript(): string {
    return this.transcriptFinalDom.innerText + ' ' + this.transcriptOnGoingDom.innerText;
  }
  addTranslatedTranscript(transcript: string): void {
    this.transcriptTranslatedFinalDom.innerHTML += ` <div class="transcript-item final">${transcript}</div>`;
    this.scrollToBottomTranslatedTranscript();
  }
  addCompletion(completionDom: HTMLDivElement): void {
    this.completionsDom.appendChild(completionDom);
    this.scrollToBottomCompletions();
  }
  scrollToBottomCompletions(): void {
    this.completionsDom.scrollTop = this.completionsDom.scrollHeight;
  }
  scrollToBottomTranscript(): void {
    this.transcriptDom.scrollTop = this.transcriptDom.scrollHeight;
  }
  scrollToBottomTranslatedTranscript(): void {
    this.transcriptTranslatedDom.scrollTop = this.transcriptTranslatedDom.scrollHeight;
  }
}
export default ResultManager;