// import { Component, OnInit } from '@angular/core';
// import ApexCharts from 'apexcharts';

// @Component({
//   selector: 'app-email-send',
//   templateUrl: './email-send.component.html',
//   styleUrls: ['./email-send.component.scss']
// })
// export class EmailSendComponent implements OnInit {

//     constructor() { }

//     ngOnInit() {
//         const options = {
//             chart: {
//                 type: 'donut',
//                 height: 310,
//             },
//             labels: ['80% Send', '67% Read', '33% Unread'],
//             series: [100, 67, 33],
//             colors: ['#6956CE', '#1CD3D2', '#4788ff'],
//             dataLabels: {
//                 enabled: false,
//             },
//             responsive: [{
//                 breakpoint: 480,
//                 options: {
//                     legend: {
//                         position: 'bottom'
//                     }
//                 }
//             }]
//         }
//         const chart = new ApexCharts(
//             document.querySelector("#emailSend-chart"),
//             options
//         );
//         chart.render();
//     }

// }

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';

interface EventData {
  event: string;
  count: number;
}

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss']
})
export class EmailSendComponent implements OnInit {
  
  @Input() data: EventData[] = [];  // Input property for data

  private chart: ApexCharts | null = null;

  constructor() {}

  ngOnInit() {
    // Initialize the chart if we have data on load
    if (this.data && this.data.length > 0) {
      this.initChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if data input has changed
    if (changes['data']) {
      if (this.chart) {
        this.updateChart();
      } else if (this.data && this.data.length > 0) {
        this.initChart();
      }
    }
  }

  // Initialize the chart when data is available
  private initChart() {
    const options = this.getChartOptions();
    this.chart = new ApexCharts(document.querySelector("#emailSend-chart"), options);
    this.chart.render();
  }

  // Update the chart options when the data changes
  private updateChart() {
    if (this.chart && this.data && this.data.length > 0) {
      const options = this.getChartOptions();
      this.chart.updateOptions(options);
    }
  }

  // Generate options for the chart based on data
  private getChartOptions() {
    if (!this.data || this.data.length === 0) {
      return {
        chart: {
          type: 'donut',
          height: 380,
        },
        series: [1],  // Default single value if no data
        labels: ['No Data'],  // Default label
        colors: ['#cccccc'],  // Default color for no data
        dataLabels: {
          enabled: true,
          formatter: function (val: number, opts: any) {
            return opts.w.config.labels[opts.seriesIndex] + ": " + val;
          },
        },
        tooltip: {
          y: {
            formatter: function (val: number, opts: any) {
              return opts.w.config.labels[opts.seriesIndex] + ": " + val;
            }
          }
        }
      };
    }

    const labels = this.data.map(item => item.event);
    const series = this.data.map(item => item.count);
    const colors = this.generateColors(this.data.length);

    return {
      chart: {
        type: 'donut',
        height: 380,
      },
      labels: labels,  // Dynamic labels from data
      series: series,  // Dynamic series values from data
      colors: colors,  // Dynamic colors
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          // return opts.w.config.labels[opts.seriesIndex];  // Model name and count
        },
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  // Generate a set of random colors for the chart
 // Generate a set of random colors for the chart, avoiding light colors
private generateColors(count: number): string[] {
  const colors: string[] = [];
  while (colors.length < count) {
    const color = this.getRandomColor();
    if (!colors.includes(color)) {  // Ensure unique colors
      colors.push(color);
    }
  }
  return colors;
}

// Function to generate a random color, avoiding light colors
private getRandomColor(): string {
  // Use HSL to avoid light colors
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.floor(Math.random() * 30);  // 70% to 100% saturation
  const lightness = 30 + Math.floor(Math.random() * 40);  // 30% to 70% lightness

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

}
