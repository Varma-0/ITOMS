import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';


@Component({
  selector: 'app-basic-line-chart',
  templateUrl: './basic-line-chart.component.html',
  styleUrls: ['./basic-line-chart.component.scss']
})
export class BasicLineChartComponent implements OnInit {

  @Input() data: any[] = [];  // Input property for data

  private chart: ApexCharts | null = null;

  constructor() { }

  ngOnInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.renderChart();
    }
  }

  // Render or update the chart based on input data
  private renderChart() {
    const { dates, dataSeries } = this.processData();

    const options = {
      chart: {
        height: 360,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      series: [{
        name: "Values",
        data: dataSeries
      }],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: dataSeries.length === 0 ? 'No Data Available' : '',
        align: 'left',
        style: {
          fontSize: "13px",
          color: '#666'
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: dates.length > 0 ? dates : ['No Data'],  // Dynamic dates or 'No Data'
      },
      yaxis: {
        title: {
          text: ''
        }
      }
    };

    if (this.chart) {
      this.chart.updateOptions(options);
    } else {
      this.chart = new ApexCharts(
        document.querySelector("#apex-basic-line-chart"),
        options
      );
      this.chart.render();
    }
  }

  // Process the API data to fit ChartData format
  private processData(): { dates: string[], dataSeries: number[] } {
    const dates: string[] = this.getLastWeekDates();
    const dataSeries: number[] = new Array(dates.length).fill(0); // Initialize with 0

    if (!this.data || this.data.length === 0) {
      return { dates, dataSeries };
    }

    for (const item of this.data) {
      const dateStr = Object.keys(item)[0]; // Extract date string
      const value = item[dateStr]; // Extract value
      const formattedDate = this.formatDate(new Date(dateStr));
      const index = dates.indexOf(formattedDate);
      if (index !== -1) {
        dataSeries[index] = value;
      }
    }

    return { dates, dataSeries };
  }

  // Generate an array of dates for the past 7 days
  private getLastWeekDates(): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(this.formatDate(date));
    }

    return dates;
  }

  // Format date as 'Mon dd'
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',  // "short", "long", or "narrow"
      day: '2-digit'     // "2-digit" or "numeric"
    };
    
    // Format the date using the options
    return date.toLocaleDateString('en-US', options);
  }
}
// import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
// import ApexCharts from 'apexcharts';

// interface ChartData {
//   date: string;
//   value: number;
// }

// @Component({
//   selector: 'app-basic-line-chart',
//   templateUrl: './basic-line-chart.component.html',
//   styleUrls: ['./basic-line-chart.component.scss']
// })
// export class BasicLineChartComponent implements OnInit {

//   @Input() data: any[] = [];  // Input property for data

//   private chart: ApexCharts | null = null;

//   constructor() { }

//   ngOnInit() {
//     this.renderChart();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['data']) {
//       this.renderChart();
//     }
//   }

//   // Render or update the chart based on input data
//   private renderChart() {
//     const { dates, dataSeries } = this.processData();

//     const options = {
//       chart: {
//         height: 360,
//         type: 'line',
//         zoom: {
//           enabled: false
//         }
//       },
//       series: [{
//         name: "Values",
//         data: dataSeries
//       }],
//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         curve: 'smooth'
//       },
//       title: {
//         text: dataSeries.length === 0 ? 'No Data Available' : 'Product Trends by Date',
//         align: 'left',
//         style: {
//           fontSize: "13px",
//           color: '#666'
//         }
//       },
//       grid: {
//         row: {
//           colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
//           opacity: 0.5
//         },
//       },
//       xaxis: {
//         categories: dates.length > 0 ? dates : ['No Data'],  // Dynamic dates or 'No Data'
//       },
//       yaxis: {
//         title: {
//           text: 'Count'
//         }
//       }
//     };

//     if (this.chart) {
//       this.chart.updateOptions(options);
//     } else {
//       this.chart = new ApexCharts(
//         document.querySelector("#apex-basic-line-chart"),
//         options
//       );
//       this.chart.render();
//     }
//   }

//   // Process the API data to fit ChartData format
//   private processData(): { dates: string[], dataSeries: number[] } {
//     const dates: string[] = this.getLastWeekDates();
//     const dataSeries: number[] = new Array(dates.length).fill(0); // Initialize with 0

//     if (!this.data || this.data.length === 0) {
//       return { dates, dataSeries };
//     }

//     // Flatten the data into a single object for easier processing
//     const flatData: { [key: string]: number } = this.data.reduce((acc, item) => {
//       return { ...acc, ...item };
//     }, {});

//     // Ensure we have dates for the past week
//     for (const dateStr of Object.keys(flatData)) {
//       const formattedDate = this.formatDate(new Date(dateStr));
//       const index = dates.indexOf(formattedDate);
//       if (index !== -1) {
//         dataSeries[index] = flatData[dateStr];
//       }
//     }

//     return { dates, dataSeries };
//   }

//   // Generate an array of dates for the past 7 days
//   private getLastWeekDates(): string[] {
//     const dates: string[] = [];
//     const today = new Date();

//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(today.getDate() - i);
//       dates.push(this.formatDate(date));
//     }

//     return dates;
//   }

//   // Format date as 'Mon dd'
//   private formatDate(date: Date): string {
//     const options: Intl.DateTimeFormatOptions = { 
//       weekday: 'short',  // "short", "long", or "narrow"
//       day: '2-digit'     // "2-digit" or "numeric"
//     };
    
//     // Format the date using the options
//     return date.toLocaleDateString('en-US', options);
//   }
// }
