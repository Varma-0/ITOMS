import { emailData,passData,dropData, modelUpdateData, createData, createDevice, midDevice, createUserData, addDevice } from './event-data';

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

export class createUserEvent {
  eventData: createUserData;
  eventType: string;
  eventSubType: string;

  constructor(eventData: createUserData, eventType: string, eventSubType: string) {
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

  export class deleteModelEvent {
    eventData: string;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: string, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class updateModelEvent {
    eventData: modelUpdateData;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: modelUpdateData, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class createModelEvent {
    eventData: createData;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: createData, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class updateDeviceEvent {
    eventData: createDevice;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: createDevice, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class addDeviceEvent {
    eventData: addDevice;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: addDevice, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }


  export class midEvent {
    eventData: midDevice;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: midDevice, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }