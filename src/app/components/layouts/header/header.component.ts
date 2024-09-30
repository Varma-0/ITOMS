import { Component, OnInit, HostListener } from '@angular/core';
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
    tenants: any;
    display: string;
    superAdmin: boolean;
    isScrolled = false;
    isSidebarActive: boolean;

    constructor(private router: Router, private authService: AuthService, private shared: SharedServices) { }

    ngOnInit() {
      this.welcome = localStorage.getItem('User Name');
      this.display = localStorage.getItem('selectedOption');
      this.email = localStorage.getItem('Email');
      this.tenants = JSON.parse(localStorage.getItem('tenants'));
      this.shared.sidebarActive$.subscribe(
        (active: boolean) => (this.isSidebarActive = active)
      );
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
      this.isScrolled = window.pageYOffset > 50;
    }

    logout(): void {
      localStorage.clear();
      this.router.navigate(['/landing']);
    }

    changeTenant(tid: string) {
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
        };

        this.authService.loginWithOption(payload).subscribe(
            response => {
                this.superAdmin = response.event.eventData.userType === "SA";
                if (!this.superAdmin) {
                    localStorage.setItem("roles", JSON.stringify(response.event.eventData.roleDetailsInfoList[0].rolePermissionsList));
                }
                const jwtToken = response.event.eventData.jwtToken;
                const userName = response.event.eventData.name;
                this.shared.setLoginData(this.superAdmin);
                localStorage.setItem('User Name', userName);
                localStorage.setItem("SA", `${this.superAdmin}`);
                localStorage.setItem('jwtToken', jwtToken);
                if (this.router.url === '/dashboard/analytics') {
                    window.location.reload();
                } else {
                    this.router.navigate(['/dashboard/analytics']);
                }
            },
            error => {
                console.error('Tenant change failed', error);
            }
        );
    }
}
