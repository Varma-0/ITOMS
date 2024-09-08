import { Component, Input, OnInit } from "@angular/core";
import { devicePie } from "src/app/services/login/body/body";
import { chartsEvent } from "src/app/services/login/body/event";
import { TerminalService } from "src/app/services/terminal/devicelist";
declare let $: any;

@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"]
})
export class AnalyticsComponent implements OnInit {
  terminalCount: any;
  merchantCount: any;
  apkCount: any;
    constructor(private dataService: TerminalService) {}
    @Input() title: string = 'Demo';
    showFilter: boolean = false;
    welcome: string;
    data: any;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

    ngOnInit() {
      this.welcome = localStorage.getItem('User Name')
      this.pieChart();
      this.terminalCountData();
      this.merchantCountData();
      this.apkCountData();
    }

    pieChart() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.deviceModelRatio(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.data = response.event.eventData.data[0];
          console.log("pie",this.data);
        }
      )
    }

    terminalCountData() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.deviceModelRatio(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.terminalCount = response.event.eventData.total;
          console.log("pie",this.terminalCount);
        }
      )
    }

    merchantCountData() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.merchantCount(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.merchantCount = response.event.eventData.total;
          console.log("pie",this.merchantCount);
        }
      )
    }

    apkCountData() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.apkCountInfo(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.apkCount = response.event.eventData.total;
          console.log("pie",this.apkCount);
        }
      )
    }

}
