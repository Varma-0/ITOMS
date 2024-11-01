import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-basic-column-chart',
  templateUrl: './basic-column-chart.component.html',
  styleUrls: ['./basic-column-chart.component.scss']
})
export class BasicColumnChartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 360,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'	
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
            series: [{
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75]
            }, {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 100, 110]
            }, {
                name: 'Free Cash Flow',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 55, 45]
            }],
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            yaxis: {
                title: {
                    text: '$ (thousands)'
                }
            },
            fill: {
                opacity: 1

            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return "$ " + val + " thousands"
                    }
                }
            },
            legend: {
                offsetY: -10,
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-basic-column-chart"),
            options
        );
        chart.render();
    }
}
// import { Component, OnInit } from '@angular/core';
// import ApexCharts from 'apexcharts';

// @Component({
//   selector: 'app-basic-column-chart',
//   templateUrl: './basic-column-chart.component.html',
//   styleUrls: ['./basic-column-chart.component.scss']
// })
// export class BasicColumnChartComponent implements OnInit {

//     constructor() { }

//     ngOnInit() {
//         // Provided data
//         const applicationActivity = {
//             "2024-10-30": 420,
//             "2024-10-29": 281,
//             "2024-10-28": 466,
//             "2024-10-27": 335,
//             "2024-10-26": 303,
//             "2024-10-25": 471,
//             "2024-10-24": 350
//         };

//         // Extract dates and values
//         const dates = Object.keys(applicationActivity);
//         const values = Object.values(applicationActivity);

//         const options = {
//             chart: {
//                 height: 360,
//                 type: 'bar',
//             },
//             plotOptions: {
//                 bar: {
//                     horizontal: false,
//                     columnWidth: '15%',
//                     endingShape: 'rounded'	
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
//             series: [{
//                 name: 'Application Activity',
//                 data: values
//             }],
//             xaxis: {
//                 categories: dates,
//             },
//             yaxis: {
//                 title: {
//                     text: 'Activity Count'
//                 }
//             },
//             fill: {
//                 opacity: 1
//             },
//             tooltip: {
//                 y: {
//                     formatter: function (val) {
//                         return val + " activities";
//                     }
//                 }
//             },
//             legend: {
//                 offsetY: -10,
//             }
//         };

//         const chart = new ApexCharts(
//             document.querySelector("#apex-basic-column-chart"),
//             options
//         );
//         chart.render();
//     }
// }
