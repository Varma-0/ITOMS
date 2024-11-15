
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
