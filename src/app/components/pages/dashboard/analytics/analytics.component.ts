import { Component, Input, OnInit } from "@angular/core";
import { devicePie } from "src/app/services/login/body/body";
import { chartsEvent } from "src/app/services/login/body/event";
import { TerminalService } from "src/app/services/terminal/devicelist";
declare let $: any;

interface ChartData {
  date: string;
  value: number;
}

@Component({
    selector: "app-analytics",
    templateUrl: "./analytics.component.html",
    styleUrls: ["./analytics.component.scss"]
})
export class AnalyticsComponent implements OnInit {
  terminalCount: any = 0;
  merchantCount: any = 0;
  apkCount: any = 0;
  // activatedData: any;
    constructor(private dataService: TerminalService) {}
    @Input() title: string = 'Demo';
    showFilter: boolean = false;
    welcome: string;
    data: any;

    activatedData: ChartData[] = [];
    deviceOnlineData: any[] = [];
    deviceOnlineData1: any;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

    ngOnInit() {
      this.welcome = localStorage.getItem('User Name')
      this.pieChart();
      this.terminalCountData();
      this.merchantCountData();
      this.apkCountData();
      this.newActivatedGraph();
      this.deviceOnline();
    }

    pieChart() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.deviceModelRatio(chartData).subscribe(
        response => {
          console.log("pieMain",response);
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

    newActivatedGraph() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.newActivatedGraphInfo(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.activatedData = response.event.eventData.data;
          console.log("dqoefqoq",this.activatedData);
        }
      )
    }

    deviceOnline() {
      const charts = new chartsEvent('REPORT','SEARCH');
      const chartData = new devicePie(charts);
      this.dataService.deviceOnlineGraphInfo(chartData).subscribe(
        response => {
          console.log("pie",response);
          this.deviceOnlineData = response.event.eventData.data;
          console.log("pie",this.deviceOnlineData);
        }
      )
    }

}
