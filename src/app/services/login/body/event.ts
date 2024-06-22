import { emailData,passData,dropData } from './event-data';

export class emailEvent {
  eventData: emailData;
  eventType: string;
  eventSubType: string;

  constructor(eventData: emailData, eventType: string, eventSubType: string) {
    this.eventData = eventData;
    this.eventType = eventType;
    this.eventSubType = eventSubType;
  }
}

export class passEvent {
    eventData: passData;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: passData, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class dropEvent {
    eventData: dropData;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: dropData, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }