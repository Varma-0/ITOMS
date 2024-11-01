// import { Component, OnInit } from '@angular/core';
// import ApexCharts from 'apexcharts';

// @Component({
//   selector: 'app-web-analytics',
//   templateUrl: './web-analytics.component.html',
//   styleUrls: ['./web-analytics.component.scss']
// })
// export class WebAnalyticsComponent implements OnInit {

//     constructor() { }

//     ngOnInit() {
//         const options = {
//             chart: {
//                 height: 305,
//                 type: 'bar',
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '50%',
//                 },
//             },
//             dataLabels: {
//                 enabled: false
//             },
//             stroke: {
//                 show: true,
//                 width: 2,
//                 colors: ['transparent']
//             },
//             colors: ['#ea3a3b', '#4788ff', '#6a4ffc'],
//             series: [{
//                 name: 'Net Profit',
//                 data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 111, 85]
//             }, {
//                 name: 'Revenue',
//                 data: [76, 85, 101, 98, 87, 105, 91, 114, 95, 95, 80]
//             }, {
//                 name: 'Free Cash Flow',
//                 data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 90, 100]
//             }],
//             xaxis: {
//                 categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//             },
//             fill: {
//                 opacity: 1
//             },
//             tooltip: {
//                 y: {
//                     formatter: function (val: any) {
//                     return "$ " + val + " thousands"
//                     }
//                 }
//             }
//         }
//         const chart = new ApexCharts(
//             document.querySelector("#website-analytics-chart"),
//             options
//         );
//         chart.render();
//     }

// }
import { Component, Input, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-web-analytics',
  templateUrl: './web-analytics.component.html',
  styleUrls: ['./web-analytics.component.scss']
})
export class WebAnalyticsComponent implements OnInit {
    @Input() activityData: string[] = [];
    constructor() { }

    ngOnInit() {
        // New application activity data
        console.log("efwwfw",this.activityData);
        const applicationActivity = this.activityData;

        // Convert data to an array format suitable for the chart
        const dates = Object.keys(applicationActivity);
        const values = Object.values(applicationActivity);

        const options = {
            chart: {
                height: 305,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '12%',
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            colors: ['#4788ff'], // Set a single color or adjust as needed
            series: [{
                name: 'Application Activity',
                data: values
            }],
            xaxis: {
                categories: dates,
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val: any) {
                        return val + " minutes";
                    }
                }
            }
        };

        const chart = new ApexCharts(
            document.querySelector("#website-analytics-chart"),
            options
        );
        chart.render();
    }

}
