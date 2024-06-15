import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-landing-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class LandingNavbarComponent implements OnInit {

    location: any;
    navbarClass: any;

    constructor(
        private router: Router,
        location: Location
    ) {
        this.router.events
        .subscribe((event) => {
            if ( event instanceof NavigationEnd ) {
                this.location = this.router.url;
                if (this.location == '/' || this.location == '/home-2' || this.location == '/home-3' || this.location == '/home-5' || this.location == '/home-6' || this.location == '/home-7' || this.location == '/without-animation-home-1' || this.location == '/without-animation-home-2' || this.location == '/without-animation-home-3' || this.location == '/without-animation-home-5' || this.location == '/without-animation-home-6' || this.location == '/without-animation-home-7'){
                    this.navbarClass = 'navbar-area';
                } else if (this.location == '/home-4' || this.location == '/without-animation-home-4'){
                    this.navbarClass = 'navbar-area bg-white';
                } else {
                    this.navbarClass = 'navbar-area navbar-style-two';
                }
            }
        });
    }

    ngOnInit() {
    }

}
