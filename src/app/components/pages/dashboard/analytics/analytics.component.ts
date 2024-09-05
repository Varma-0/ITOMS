import { Component, Input, OnInit } from "@angular/core";
declare let $: any;

@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"]
})
export class AnalyticsComponent implements OnInit {
    constructor() {}
    @Input() title: string = 'Demo';
    showFilter: boolean = false;

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

    ngOnInit() {
        
    }
}
