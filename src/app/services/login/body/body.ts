import { createModelEvent, deleteModelEvent, dropEvent, emailEvent, midEvent, passEvent, updateDeviceEvent, updateModelEvent } from './event';
import { createDevice, midDevice } from './event-data';

export class emailBody {
  event: emailEvent;

  constructor(event: emailEvent) {
    this.event = event;
  }
}

export class passBody {
  event: passEvent;

  constructor(event: passEvent) {
    this.event = event;
  }
}

export class dropBody {
  event: dropEvent;

  constructor(event: dropEvent) {
    this.event = event;
  }
}

export class createBody {
  event: createModelEvent;

  constructor(event: createModelEvent) {
    this.event = event;
  }
}

export class deleteBody {
  event: deleteModelEvent;

  constructor(event: deleteModelEvent) {
    this.event = event;
  }
}

export class updateBody {
  event: updateModelEvent;

  constructor(event: updateModelEvent) {
    this.event = event;
  }
}

export class updateDevice {
  event: updateDeviceEvent;

  constructor(event: updateDeviceEvent) {
    this.event = event;
  }
}

export class midHeirarchy {
  event: midEvent;

  constructor(event: midEvent) {
    this.event = event;
  }
}