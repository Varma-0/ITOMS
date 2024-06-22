import { Component, OnInit } from '@angular/core';
import { dropBody, emailBody, passBody } from 'src/app/services/login/body/body';
import {  dropEvent, emailEvent, passEvent } from 'src/app/services/login/body/event';
import {  dropData, emailData, passData } from 'src/app/services/login/body/event-data';
import { AuthService } from 'src/app/services/login/login';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class DLogInComponent implements OnInit{
  username: string = '';
  password: string = '';
  showPasswordField: boolean = false;
  showDropdown: boolean = false;
  dropdownOptions: Array<string> = [];
  selectedOption: string = '';
  errorMessage: string = '';
  uid: string ='';
  inasecretkey: string='';
  loadingEmail: boolean = false;
  loadingPassword: boolean = false;
  loadingDropdown: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

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
          this.errorMessage = '';
        }
        this.loadingPassword = false;

      },
      error => {
        this.errorMessage = 'Invalid password';
        // console.error('Password validation failed', error);
        this.loadingPassword = false;

      }
    );
  }

  onSubmitDropdown(): void {
   this.loadingDropdown = true;
   if(this.selectedOption) {
    const eventData = new dropData(this.selectedOption["id"],this.uid, this.inasecretkey);
    const event = new dropEvent(eventData, 'LOGIN', 'GENERATE_TOKEN');
    const loginRequest = new dropBody(event);

    this.authService.loginWithOption(loginRequest).subscribe(
      response => {
        const jwtToken = response.event.eventData.jwtToken; // Assume the token is in response.token
        localStorage.setItem('jwtToken', jwtToken);
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
