import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SharedServices } from './services/shared.service';
declare let $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent implements OnInit, OnDestroy {
    location: any;
    routerSubscription: any;
    showLoader=false;

    constructor(private router: Router,private shared:SharedServices) {
        this.shared.showLoader.subscribe(res => this.showLoader = res)
    }

    ngOnInit(){
        // this.shared.showSuccess("created successfully")
        this.recallJsFuntions();
    }

    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
                $.getScript('../assets/js/custom.js');
                this.location = this.router.url;
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0)
            });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }
}
