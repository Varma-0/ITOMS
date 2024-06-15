import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-gradient-donut',
  templateUrl: './gradient-donut.component.html',
  styleUrls: ['./gradient-donut.component.scss']
})
export class GradientDonutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                width: '100%',
                height: 440,
                type: 'donut',
            },
            dataLabels: {
                enabled: false
            },
            labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            series: [44, 55, 41, 17, 15, 35],
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function(val, opts) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex]
                }
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
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-gradient-donut-chart"),
            options
        );
        chart.render();
        const paper = chart.paper();
    }

}
