import { count } from "rxjs";
import { ArrayDataOfNewUser } from "./event";

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

export class createNewUserEvent {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  country: string;
  emailAlt: string;
  phoneAlt: string;
  countryAlt: string;
  userLinkDataList: ArrayDataOfNewUser;
 

  constructor(firstName: string,lastName: string,dob: string,email: string,phone: string,country: string,emailAlt: string,countryAlt: string,phoneAlt: string,userLinkDataList: ArrayDataOfNewUser) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.dob = dob;
      this.email = email;
      this.phone = phone;
      this.country = country;
      this.emailAlt = emailAlt;
      this.phoneAlt = phoneAlt;
      this.countryAlt = countryAlt;
      this.userLinkDataList = userLinkDataList;
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
  oem: string;

  constructor(id: string,name: string, description: string,oem: string) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.oem = oem;
  }
}

export class createData {
  name: string;
  description: string;
  oem: string;

  constructor(name: string, description: string,oem: string) {
      this.name = name;
      this.description = description;
      this.oem = oem;
  }
}


export class createDevice {
  deviceId: string;
  serialNumber: string;
  softwareKey: string;
  modelName: string;
  model: string;
  hierarchyName: string;
  hierarchy: string;
  merchantName: string;
  merchantId: string;

  constructor(deviceId: string, serialNumber: string,softwareKey: string,modelName: string,model: string,hierarchyName: string,hierarchy: string,merchantName: string,merchantId: string) {
      this.deviceId = deviceId;
      this.serialNumber = serialNumber;
      this.softwareKey = softwareKey;
      this.modelName = modelName;
      this.model = model;
      this.hierarchyName = hierarchyName;
      this.hierarchy = hierarchy;
      this.merchantName = merchantName;
      this.merchantId = merchantId;
  }
}

export class addDevice {
  serialNumber: string;
  softwareKey: string;
  modelName: string;
  model: string;
  status: string;
  hierarchyName: string;
  hierarchy: string;
  merchantName: string;
  merchantId: string;

  constructor(serialNumber: string,status: string,softwareKey: string,modelName: string,model: string,hierarchyName: string,hierarchy: string,merchantName: string,merchantId: string) {
      this.serialNumber = serialNumber;
      this.status = status;
      this.softwareKey = softwareKey;
      this.modelName = modelName;
      this.model = model;
      this.hierarchyName = hierarchyName;
      this.hierarchy = hierarchy;
      this.merchantName = merchantName;
      this.merchantId = merchantId;
  }
}

export class midDevice {
  mid: string;

  constructor(mid: string) {
      this.mid = mid;
  }
}