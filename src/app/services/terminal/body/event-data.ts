export class terminalEvent {
    eventType: string;
    eventSubType: string;
  
    constructor(eventType: string, eventSubType: string) {
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }