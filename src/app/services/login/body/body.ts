import { addDeviceEvent, addMerchantBody, addPermissionBody, addRoleBody, addTenantBody, chartsEvent, createModelEvent, createNewUserBody, createUserEvent, deleteMerchantEVent, deleteModelEvent, deletePermissionEVent, deleteTenantEVent, dropEvent, editPermissionBody, editTenantBody, emailEvent, midEvent, passEvent, updateDeviceEvent, updateModelEvent, updateRoleBody } from './event';
import { createDevice, createNewUserEvent, createUserData, midDevice, updateRoleData } from './event-data';

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

export class addDeviceBody {
  event: addDeviceEvent;

  constructor(event: addDeviceEvent) {
    this.event = event;
  }
}

export class midHeirarchy {
  event: midEvent;

  constructor(event: midEvent) {
    this.event = event;
  }
}

export class createUser {
  event: createUserEvent;

  constructor(event: createUserEvent) {
    this.event = event;
  }
}

export class createNewUser {
  event: createNewUserBody;

  constructor(event: createNewUserBody) {
    this.event = event;
  }
}

export class roleUpdate {
  event: updateRoleBody;

  constructor(event: updateRoleBody) {
    this.event = event;
  }
}

export class permissionUpdate {
  event: editPermissionBody;

  constructor(event: editPermissionBody) {
    this.event = event;
  }
}

export class tenantUpdate {
  event: editTenantBody;

  constructor(event: editTenantBody) {
    this.event = event;
  }
}


export class tenantAdd {
  event: addTenantBody;

  constructor(event: addTenantBody) {
    this.event = event;
  }
}

export class merchantAdd {
  event: addMerchantBody;

  constructor(event: addMerchantBody) {
    this.event = event;
  }
}

export class permissionAdd {
  event: addPermissionBody;

  constructor(event: addPermissionBody) {
    this.event = event;
  }
}


export class permissionDelete {
  event: deletePermissionEVent;

  constructor(event: deletePermissionEVent) {
    this.event = event;
  }
}

export class tenantDelete {
  event: deleteTenantEVent;

  constructor(event: deleteTenantEVent) {
    this.event = event;
  }
}

export class merchantDelete {
  event: deleteMerchantEVent;

  constructor(event: deleteMerchantEVent) {
    this.event = event;
  }
}

export class devicePie {
  event: chartsEvent;

  constructor(event: chartsEvent) {
    this.event = event;
  }
}

export class roleAdd {
  event: addRoleBody;

  constructor(event: addRoleBody) {
    this.event = event;
  }
}