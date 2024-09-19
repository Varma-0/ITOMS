import { Component, OnInit } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
import { SharedServices } from "src/app/services/shared.service";
declare let $: any;

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
    isSidebarActive = true;
    superAdmin = localStorage.getItem('SA');
    sa = ['home','user','role','alert','permission','tenants','hierarchies','merchant','terminal','deployment','resources','parameters','device','model','con','heart','search','software','param','swap','system'];
    admin = ['hierarchies','merchant','terminal','deployment','resources','parameters','device','model','con','heart','param','swap','system'];
    user = ['home','user','role','alert','permission','tenants','hierarchies','merchant','terminal','model','con','heart','search','software','param','swap','system'];
    accessibleOptions: any = this.sa;
    constructor(private router: Router,private shared:SharedServices) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                $(".responsive-burger-menu").removeClass("active");
                $(".sidemenu-area").removeClass("active-sidemenu-area");
            }
        });
    }

    ngOnInit() {
        // Burger Menu JS
        $(".burger-menu").on("click", function() {
            $(this).toggleClass("active");
            $(".main-content").toggleClass("hide-sidemenu-area");
            $(".sidemenu-area").toggleClass("toggle-sidemenu-area");
            $(".top-navbar").toggleClass("toggle-navbar-area");
        });
        $(".responsive-burger-menu").on("click", function() {
            $(".responsive-burger-menu").toggleClass("active");
            $(".sidemenu-area").toggleClass("active-sidemenu-area");
        });
        this.shared.sidebarActive$.subscribe(
            (active: boolean) => (this.isSidebarActive = active)
          );
    }
    hasAccess(option: string): boolean {
        return this.accessibleOptions.includes(option);
      }
}
