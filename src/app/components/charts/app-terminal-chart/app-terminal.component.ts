import { Component, Input, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-terminal-chart',
  templateUrl: './app-terminal.component.html',
  styleUrls: ['./app-terminal.component.scss'] 
})
export class TerminalChartComponent implements OnInit {
  @Input() labels: [] = []; 
  @Input() series: [] = []; 
  colors: string[] = []; // Default colors for the chart

  constructor() { }

  ngOnInit() {
    // Prepare labels and series from cardMethodStatistics
    // this.labels = Object.keys(this.cardMethodStatistics);
    // this.series = Object.values(this.cardMethodStatistics);

    // Only render the chart if there are data points
    if (this.labels.length && this.series.length) {
      const options = {
        chart: {
          type: 'donut',
          height: 310,
        },
        labels: this.labels,
        series: this.series,
        colors: this.colors,
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }]
      };

      const chart = new ApexCharts(
        document.querySelector("#profile-chart"),
        options
      );
      chart.render();
    } else {
      // Optionally handle the case where there are no data points
      console.warn('No data available to render the chart.');
    }
  }
}
