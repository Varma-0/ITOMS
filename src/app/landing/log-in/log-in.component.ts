// import { Component, OnInit } from '@angular/core';
// import { emailBody } from 'src/app/services/login/body/emailBody';
// import { Events } from 'src/app/services/login/body/event';
// import { EventData } from 'src/app/services/login/body/event-data';
// import { AuthService } from 'src/app/services/login/emailLogin';

// @Component({
//   selector: 'app-log-in',
//   templateUrl: './log-in.component.html',
//   styleUrls: ['./log-in.component.scss']
// })
// export class LogInComponent implements OnInit {
//   username: string;

//   constructor(private authService: AuthService) { }

//   ngOnInit() {
//   }
//   onSubmit(): void {
//     console.log("da",this.username);
//     const eventData = new EventData(this.username, 'EMAIL');
//     const event = new Events(eventData, 'LOGIN', 'USER_ID_VALIDATE');
//     const loginRequest = new emailBody(event);
//     console.log("1111",loginRequest);
//     this.authService.emailChecklogin(loginRequest).subscribe(response => {
//       // Handle the response here
//       console.log('Login successful', response);
//     }, error => {
//       // Handle error here
//       console.error('Login failed', error);
//     });
//   }

// }

import { Component } from '@angular/core';
import { dropBody, emailBody, passBody } from 'src/app/services/login/body/body';
import {  dropEvent, emailEvent, passEvent } from 'src/app/services/login/body/event';
import {  dropData, emailData, passData } from 'src/app/services/login/body/event-data';
import { AuthService } from 'src/app/services/login/login';
import { Event } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class DLogInComponent {
  username: string = '';
  password: string = '';
  showPasswordField: boolean = false;
  showDropdown: boolean = false;
  dropdownOptions: Array<string> = [];
  selectedOption: string = '';
  errorMessage: string = '';
  uid: string ='';
  passuid: string='';
  inasecretkey: string='';

  constructor(private authService: AuthService) {}

  onSubmitEmail(): void {
    const eventData = new emailData(this.username, 'EMAIL');
    const event = new emailEvent(eventData, 'LOGIN', 'USER_ID_VALIDATE');
    const loginRequest = new emailBody(event);

    this.authService.emailChecklogin(loginRequest).subscribe(
      response => {
        if (response.status == 200) {
          console.log("qq0")
          this.showPasswordField = true;
          this.uid = response.event.eventData.uid
        } else if (response.dropdownOptions) {
          this.showDropdown = true;
          this.dropdownOptions = response.dropdownOptions;
        }
      },
      error => {
        this.errorMessage = 'Identity Verification Failed';
        // console.error('Validation failed', error);
      }
    );
  }

  onSubmitPassword(): void {
    const eventData = new passData(this.uid,this.password);
    const event = new passEvent(eventData, 'LOGIN', 'USER_CRD_VALIDATE');
    const loginRequest = new passBody(event);

    this.authService.loginWithPassword(loginRequest).subscribe(
      response => {
        if(response.status == 200) {
          this.showPasswordField = false;
          this.showDropdown = true;
          this.passuid = response.event.eventData.uid;
          this.inasecretkey = response.event.eventData.inaSecretKey;
          this.dropdownOptions = response.event.eventData.userTenants;
        }
      },
      error => {
        this.errorMessage = 'Invalid password';
        // console.error('Password validation failed', error);
      }
    );
  }

  onSubmitDropdown(): void {
    const eventData = new dropData(this.username, 'EMAIL');
    const event = new dropEvent(eventData, 'LOGIN', 'CREATE');
    const loginRequest = new dropBody(event);

    // this.authService.loginWithOption(loginRequest).subscribe(
    //   response => {
    //     console.log('Dropdown option submission successful', response);
    //     // Implement your logic here
    //   },
    //   error => {
    //     this.errorMessage = 'Failed to process selected option';
    //     console.error('Dropdown option submission failed', error);
    //   }
    // );
  }
}
