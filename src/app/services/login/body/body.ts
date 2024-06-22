import { dropEvent, emailEvent, passEvent } from './event';

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