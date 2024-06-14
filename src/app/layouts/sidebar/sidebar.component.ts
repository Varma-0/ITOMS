import { Component, OnInit } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";
declare let $: any;

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
    constructor(private router: Router) {
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                $(".responsive-burger-menu").removeClass("active");
                $(".sidemenu-area").removeClass("active-sidemenu-area");
            }
        });
    }

    ngOnInit() {
        // Burger Menu JS
        $(".burger-menu").on("click", () => {
            $(this).toggleClass("active");
            $(".main-content").toggleClass("hide-sidemenu-area");
            $(".sidemenu-area").toggleClass("toggle-sidemenu-area");
            $(".top-navbar").toggleClass("toggle-navbar-area");
        });
        $(".responsive-burger-menu").on("click", function() {
            $(".responsive-burger-menu").toggleClass("active");
            $(".sidemenu-area").toggleClass("active-sidemenu-area");
        });
    }
}
