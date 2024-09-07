export class emailData {
    loginId: string;
    loginType: string;
  
    constructor(loginId: string,loginType: string) {
      this.loginId = loginId;
      this.loginType = loginType;
    }
  }

  export class verifyEmailData {
    loginId: string;
    otp: number;
    loginType: string;
  
    constructor(loginId: string, otp: number,loginType: string ) {
      this.loginId = loginId;
      this.otp = otp;
      this.loginType = loginType;
    }
  }

export class passData {
    uid: string;
    password: string;

    constructor(uid: string, password: string) {
        this.uid = uid;
        this.password = password;
    }
}

export class createUserData {
  uid: string;

  constructor(uid: string) {
      this.uid = uid;
  }
}

export class dropData {
    tid: string;
    uid: string;
    inaSecretKey: string;

    constructor(tid: string,uid: string, inaSecretKey: string) {
        this.tid = tid;
        this.uid = uid;
        this.inaSecretKey = inaSecretKey;
    }
}


export class modelUpdateData {
  id: string;
  name: string;
  description: string;

  constructor(id: string,name: string, description: string) {
      this.id = id;
      this.name = name;
      this.description = description;
  }
}

export class createData {
  name: string;
  description: string;

  constructor(name: string, description: string) {
      this.name = name;
      this.description = description;
  }
}


export class createDevice {
  deviceId: string;
  serialNumber: string;
  model: string;
  hierarchy: string;

  constructor(deviceId: string, serialNumber: string,model: string,hierarchy: string) {
      this.deviceId = deviceId;
      this.serialNumber = serialNumber;
      this.model = model;
      this.hierarchy = hierarchy;
  }
}

export class midDevice {
  mid: string;

  constructor(mid: string) {
      this.mid = mid;
  }
}