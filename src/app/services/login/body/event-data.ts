export class emailData {
    loginId: string;
    loginType: string;
  
    constructor(loginId: string, loginType: string) {
      this.loginId = loginId;
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

export class dropData {
    uid: string;
    inaSecretKey: string;

    constructor(uid: string, inaSecretKey: string) {
        this.uid = uid;
        this.inaSecretKey = inaSecretKey;
    }
}