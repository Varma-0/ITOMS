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
    accessibleOptions: any = [];
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
          let permissions = JSON.parse(localStorage.getItem('roles'));
          permissions.forEach(element => {
            this.accessibleOptions.push(element.name)
          });
    }
    hasAccess(option: string): boolean {
        return this.superAdmin == 'true' ? true : this.accessibleOptions.includes(option.toUpperCase());
      }
}
