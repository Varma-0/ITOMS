import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { TerminalService } from "src/app/services/terminal/devicelist";
import {  devicePie } from "src/app/services/login/body/body";
import { chartsEvent } from "src/app/services/login/body/event";
import { SharedServices } from "src/app/services/shared.service";

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
  @ViewChild('deviceModelRatio') deviceModelRatioTpl!: TemplateRef<any>;
  @ViewChild('newActivatedDevices') newActivatedDevicesTpl!: TemplateRef<any>;
  @ViewChild('deviceOnlineNumber') deviceOnlineNumberTpl!: TemplateRef<any>;
  @ViewChild('downloadStatus') downloadStatusTpl!: TemplateRef<any>;
  welcome: string = '';
  showDropdown: boolean = false;
  statsCards: any[] = [];
  availableCharts: any[] = [
    { name: 'Device Model Ratio', selected: true },
    { name: 'New Activated Devices', selected: true },
    { name: 'Device Online Number', selected: true },
    { name: 'Download Status', selected: true }
  ];
  data: any;
  activatedData: ChartData[] = [];
    deviceOnlineData: any[] = [];
    deviceOnlineData1: any;
  selectedCharts: any[] = [];

  constructor(private dataService: TerminalService, private shared: SharedServices) {}

  ngOnInit() {
    this.welcome = localStorage.getItem('User Name') || 'User';
    this.loadAllData();
    this.updateSelectedCharts();
    this.pieChart();
      this.newActivatedGraph();
      this.deviceOnline();
  }

  pieChart() {
    const charts = new chartsEvent('REPORT','SEARCH');
    const chartData = new devicePie(charts);
    this.shared.showLoader.next(true);
    this.dataService.deviceModelRatio(chartData).subscribe(
      response => {
        console.log("pieMain",response);
        this.data = response.event.eventData.data[0];
        console.log("pie",this.data);
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    )
  }

  
  newActivatedGraph() {
    const charts = new chartsEvent('REPORT','SEARCH');
    const chartData = new devicePie(charts);
    this.shared.showLoader.next(true);
    this.dataService.newActivatedGraphInfo(chartData).subscribe(
      response => {
        console.log("pie",response);
        this.activatedData = response.event.eventData.data;
        console.log("dqoefqoq",this.activatedData);
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    )
  }

  deviceOnline() {
    const charts = new chartsEvent('REPORT','SEARCH');
    const chartData = new devicePie(charts);
    this.shared.showLoader.next(true);
    this.dataService.deviceOnlineGraphInfo(chartData).subscribe(
      response => {
        console.log("pie",response);
        this.deviceOnlineData = response.event.eventData.data;
        console.log("pie",this.deviceOnlineData);
        this.shared.showLoader.next(false);
      },
      error => {
        console.error('Error:', error);
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
      }
    )
  }

  loadAllData() {
    this.loadCounts();
  }

  getChartTemplate(chartName: string): TemplateRef<any> {
    switch (chartName) {
      case 'Device Model Ratio':
        return this.deviceModelRatioTpl;
      case 'New Activated Devices':
        return this.newActivatedDevicesTpl;
      case 'Device Online Number':
        return this.deviceOnlineNumberTpl;
      case 'Download Status':
        return this.downloadStatusTpl;
      default:
        return this.deviceModelRatioTpl; // default template
    }
  }

  getChartData(chartName: string): any {
    switch (chartName) {
      case 'Device Model Ratio':
        return this.data;
      case 'New Activated Devices':
        return this.activatedData;
      case 'Device Online Number':
        return this.deviceOnlineData;
      case 'Download Status':
        return this.activatedData;
      default:
        return null;
    }
  }

  // loadCounts() {
  //   const chartEvent = new chartsEvent('REPORT', 'SEARCH');
  //   const chartData = new devicePie(chartEvent);
  //   this.shared.showLoader.next(true);
  //   this.dataService.terminalCount(chartData).subscribe(
  //     response => this.updateStatsCard('Terminals', response.event.eventData.total, 'bx bx-terminal', '#007bff')
      
  //   );

  //   this.dataService.merchantCount(chartData).subscribe(
  //     response => this.updateStatsCard('Merchants', response.event.eventData.total, 'bx bx-store', '#13bb37')
  //   );

  //   this.dataService.apkCountInfo(chartData).subscribe(
  //     response => this.updateStatsCard('Applications', response.event.eventData.total, 'bx bx-mobile-alt', '#ff4b00')
  //   );
  // }
  loadCounts() {
    const chartEvent = new chartsEvent('REPORT', 'SEARCH');
    const chartData = new devicePie(chartEvent);
    this.shared.showLoader.next(true); // Show loader
  
    // Fetch terminal count
    this.dataService.terminalCount(chartData).subscribe(
      response => {
        this.updateStatsCard('Terminals', response.event.eventData.total, 'bx bx-terminal', '#007bff');
        this.loadMerchantCount(chartData); // Load the next count
      },
      error => {
        console.error('Error fetching terminal count:', error);
        this.shared.showLoader.next(false); // Hide loader on error
        this.shared.showError(error.message)
      }
    );
  }
  
  loadMerchantCount(chartData: devicePie) {
    this.dataService.merchantCount(chartData).subscribe(
      response => {
        this.updateStatsCard('Merchants', response.event.eventData.total, 'bx bx-store', '#13bb37');
        this.loadApkCountInfo(chartData); // Load the next count
      },
      error => {
        console.error('Error fetching merchant count:', error);
        this.shared.showLoader.next(false); // Hide loader on error
        this.shared.showError(error.message)
      }
    );
  }
  
  loadApkCountInfo(chartData: devicePie) {
    this.dataService.apkCountInfo(chartData).subscribe(
      response => {
        this.updateStatsCard('Applications', response.event.eventData.total, 'bx bx-mobile-alt', '#ff4b00');
        this.shared.showLoader.next(false); // Hide loader after all requests
      },
      error => {
        console.error('Error fetching APK count:', error);
        this.shared.showLoader.next(false); // Hide loader on error
        this.shared.showError(error.message)
      }
    );
  }
  

  updateStatsCard(title: string, value: number, icon: string, color: string) {
    this.statsCards.push({ title, value, icon, color });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleChart(chart: any) {
    chart.selected = !chart.selected;
    this.updateSelectedCharts();
  }

  updateSelectedCharts() {
    this.selectedCharts = this.availableCharts.filter(chart => chart.selected);
  }
}
