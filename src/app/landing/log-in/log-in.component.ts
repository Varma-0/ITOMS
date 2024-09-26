import { Component, OnInit } from '@angular/core';
import { dropBody, emailBody, passBody } from 'src/app/services/login/body/body';
import {  dropEvent, emailEvent, passEvent } from 'src/app/services/login/body/event';
import {  dropData, emailData, passData, verifyEmailData } from 'src/app/services/login/body/event-data';
import { AuthService } from 'src/app/services/login/login';
import { NavigationEnd, Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class DLogInComponent implements OnInit{
  username: string = '';
  usernameforgot: string = '';
  getotp: number = null;
  password: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  showPasswordField: boolean = false;
  showDropdown: boolean = false;
  enterOtp: boolean = false;
  enterNewPass: boolean = false;
  dropdownOptions: Array<string> = [];
  selectedOption: string = '';
  errorMessage: string = '';
  uid: string ='';
  superAdmin: boolean = false;
  uidVerify: string ='';
  inasecretkey: string='';
  errorApiMessage: string='';
  loadingEmail: boolean = false;
  loadingPassword: boolean = false;
  loadingDropdown: boolean = false;
  forgotPassword: boolean = false;
  loadingOtp: boolean = false;
  validateOtp: boolean = false;
  validatePass: boolean = false;

  constructor(private authService: AuthService, private router: Router,private shared:SharedServices) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' && localStorage.getItem('jwtToken')) {
          localStorage.removeItem('jwtToken');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmitEmail(): void {
    this.loadingEmail = true;
    const eventData = new emailData(this.username, 'EMAIL');
    const event = new emailEvent(eventData, 'LOGIN', 'USER_ID_VALIDATE');
    const loginRequest = new emailBody(event);

    this.authService.emailChecklogin(loginRequest).subscribe(
      response => {
        if (response.status == 200) {
          console.log("qq0")
          this.showPasswordField = true;
          this.uid = response.event.eventData.uid
          this.errorMessage='';
        } else if (response.dropdownOptions) {
          this.showDropdown = true;
          this.dropdownOptions = response.dropdownOptions;
          localStorage.setItem('tenants',JSON.stringify(this.dropdownOptions))
        }
        this.loadingEmail = false;
      },
      error => {
        this.errorMessage = 'Identity Verification Failed';
        // console.error('Validation failed', error);
        this.loadingEmail = false;
      }
    );
  }

  onForgotEmailClick(): void {

  }

  onSubmitPassword(): void {
    this.loadingPassword = true;
    const eventData = new passData(this.uid,this.password);
    const event = new passEvent(eventData, 'LOGIN', 'USER_CRD_VALIDATE');
    const loginRequest = new passBody(event);

    this.authService.loginWithPassword(loginRequest).subscribe(
      response => {
        if(response.status == 200) {
          this.showPasswordField = false;
          this.showDropdown = true;
          this.inasecretkey = response.event.eventData.inaSecretKey;
          this.dropdownOptions = response.event.eventData.userTenants;
          localStorage.setItem('tenants',JSON.stringify(this.dropdownOptions))
          this.errorMessage = '';
        } else if (response.status == 422) {
          this.errorApiMessage = response.message;
          this.errorMessage = this.errorApiMessage;
        }
        this.loadingPassword = false;

      },
      error => {
        this.errorMessage = this.errorApiMessage;
        console.error('Password validation failed', this.errorMessage);
        this.loadingPassword = false;

      }
    );
  }

  onForgotPasswordClick() {
    this.showPasswordField = false;
    this.forgotPassword = true;
  }

  onSubmitEmailforOtp() {
    this.loadingOtp = true;
    const eventData = new emailData(this.usernameforgot,'EMAIL');
    console.log(eventData)
    const event = new emailEvent(eventData, 'USER', 'FORGOT_CRED');
    const updatePassRequest = new emailBody(event);

    this.authService.emailVerificationforPassReset(updatePassRequest).subscribe(
      response => {
        if(response.status == 200) {
          console.log("EmailforOtp",response);
          this.forgotPassword = false;
          this.enterOtp = true;
        } else {
          this.errorApiMessage = response.message;
        }
        this.loadingOtp = false;
      },
      error => {
        this.errorMessage = this.errorApiMessage;
        // console.error('Password validation failed', error);
        this.loadingOtp = false;
      }
    );
  }

  onSubmitOtp() {
    this.validateOtp = true;
    const eventData = new verifyEmailData(this.usernameforgot,this.getotp,'EMAIL');
    console.log(eventData)
    const event = new emailEvent(eventData, 'USER', 'VERIFY_OTP');
    const updatePassRequest = new emailBody(event);
    this.authService.otpConfirmationforPassReset(updatePassRequest).subscribe(
      response => {
        if(response.status == 200) {
          console.log("Otp",response)
           this.uidVerify = response.event.eventData.uid;
           this.enterOtp = false;
           this.enterNewPass = true;
        } else {
          this.errorApiMessage = response.message;
        }
        this.validateOtp = false;
      },
      error => {
        this.errorMessage = this.errorApiMessage;
        // console.error('Password validation failed', error);
        this.validateOtp = false;
      }
    );
  }

  onSubmitNewPass() {
    this.validatePass = true;
    const eventData = new passData(this.uidVerify,this.newPassword);
    console.log(eventData)
    const event = new passEvent(eventData, 'USER', 'CRD_RESET');
    const updatePassRequest = new passBody(event);
    this.authService.resetPass(updatePassRequest).subscribe(
      response => {
        if(response.status == 200) {
          console.log("Otp",response)
          this.uid = response.event.eventData.uid;
          this.enterNewPass = false;
          this.forgotPassword = false;
        } else {
          this.errorApiMessage = response.message;
        }
        this.validateOtp = false;
      },
      error => {
        this.errorMessage = this.errorApiMessage;
        // console.error('Password validation failed', error);
        this.validateOtp = false;
      }
    );
  }

  onSubmitDropdown(): void {
   this.loadingDropdown = true;
   if(this.selectedOption) {
    console.log('fwffw',this.selectedOption);
    localStorage.setItem('uid',this.uid);
    localStorage.setItem('ina',this.inasecretkey)
    const eventData = new dropData(this.selectedOption["id"],this.uid, this.inasecretkey);
    const event = new dropEvent(eventData, 'LOGIN', 'GENERATE_TOKEN');
    const loginRequest = new dropBody(event);

    this.authService.loginWithOption(loginRequest).subscribe(
      response => {
        const jwtToken = response.event.eventData.jwtToken;
        response.event.eventData.userType == "SA"? this.superAdmin = true : this.superAdmin = false;
        const data = this.superAdmin;
        const userName = response.event.eventData.name;
        this.shared.setLoginData(data);
        localStorage.setItem('User Name',userName);
        localStorage.setItem('Email',this.username);
        localStorage.setItem("SA",`${this.superAdmin}`);
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('selectedOption', this.selectedOption['name']);
        this.router.navigate(['/dashboard/analytics']);
        this.loadingDropdown = false;
      },
      error => {
        this.errorMessage = 'Failed to process selected option';
        // console.error('Dropdown option submission failed', error);
        this.loadingDropdown = false;
      }
    );
   }
  }
}
