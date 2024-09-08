import { createNewUser } from './body';
import { emailData,passData,dropData, modelUpdateData, createData, createDevice, midDevice, createUserData, addDevice, createNewUserEvent } from './event-data';

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

  export class createNewUserBody {
    eventData: createNewUserEvent;
    eventType: string;
    eventSubType: string;
  
    constructor(eventData: createNewUserEvent, eventType: string, eventSubType: string) {
      this.eventData = eventData;
      this.eventType = eventType;
      this.eventSubType = eventSubType;
    }
  }

  export class Tenant {
    id: string;
    name: string;
  
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  
  export class Role {
    id: string;
    name: string;
  
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  
  export class Hierarchy {
    id: string;
    name: string;
  
    constructor(id: string, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  
  export class ArrayDataOfNewUser {
    tenant: Tenant;
    role: Role;
    alerts: any[];  // Assuming alerts is an array. You can replace `any[]` with the actual type of alerts.
    hierarchy: Hierarchy;
  
    constructor(tenant: Tenant, role: Role, alerts: any[], hierarchy: Hierarchy) {
      this.tenant = tenant;
      this.role = role;
      this.alerts = alerts;
      this.hierarchy = hierarchy;
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