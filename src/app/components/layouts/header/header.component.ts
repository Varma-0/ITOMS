import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/login/login';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    welcome: string;
    email: string;
    tenants:any;
    display: string;
    superAdmin: boolean;

    constructor(private router: Router,private authService: AuthService,private shared:SharedServices) { }

    ngOnInit() {
      this.welcome = localStorage.getItem('User Name')
      this.display = localStorage.getItem('selectedOption');
      this.email = localStorage.getItem('Email')
      this.tenants = JSON.parse(localStorage.getItem('tenants'))
    }

    logout(): void {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('SA');
      this.router.navigate(['/landing']);
    }

    changeTenant(tid){
        const payload = {
            "event": {
                "eventData": {
                    "tid": tid,
                    "uid": localStorage.getItem('uid'),
                    "inaSecretKey": localStorage.getItem('ina')
                },
                "eventType": "LOGIN",
                "eventSubType": "GENERATE_TOKEN"
            }
        }

        this.authService.loginWithOption(payload).subscribe(
            response => {
                response.event.eventData.userType == "SA"? this.superAdmin = true : this.superAdmin = false;
                const data = this.superAdmin;
              const jwtToken = response.event.eventData.jwtToken;
              const userName = response.event.eventData.name;
              this.shared.setLoginData(data);
              localStorage.setItem('User Name',userName);
            //   localStorage.setItem('Email',this.username);
              localStorage.setItem("SA",`${this.superAdmin}`);
              localStorage.setItem('jwtToken', jwtToken);
              if(this.router.url == '/dashboard/analytics'){
                window.location.reload();
              }else{
                this.router.navigate(['/dashboard/analytics'])
              }
            //   this.loadingDropdown = false;
            },
            error => {
            //   this.errorMessage = 'Failed to process selected option';
            //   // console.error('Dropdown option submission failed', error);
            //   this.loadingDropdown = false;
            }
          );
    }
}
