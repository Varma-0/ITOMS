import { Component, OnInit } from "@angular/core";
import { TerminalService } from "src/app/services/terminal/devicelist";
import {  devicePie } from "src/app/services/login/body/body";
import { chartsEvent } from "src/app/services/login/body/event";

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

  constructor(private dataService: TerminalService) {}

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
    this.dataService.deviceModelRatio(chartData).subscribe(
      response => {
        console.log("pieMain",response);
        this.data = response.event.eventData.data[0];
        console.log("pie",this.data);
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

  loadAllData() {
    this.loadCounts();
  }

  loadCounts() {
    const chartEvent = new chartsEvent('REPORT', 'SEARCH');
    const chartData = new devicePie(chartEvent);

    this.dataService.terminalCount(chartData).subscribe(
      response => this.updateStatsCard('Terminals', response.event.eventData.total, 'bx bx-terminal', '#007bff')
    );

    this.dataService.merchantCount(chartData).subscribe(
      response => this.updateStatsCard('Merchants', response.event.eventData.total, 'bx bx-store', '#13bb37')
    );

    this.dataService.apkCountInfo(chartData).subscribe(
      response => this.updateStatsCard('Applications', response.event.eventData.total, 'bx bx-mobile-alt', '#ff4b00')
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
