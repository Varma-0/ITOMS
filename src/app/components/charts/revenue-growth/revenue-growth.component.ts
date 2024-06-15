import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-revenue-growth',
  templateUrl: './revenue-growth.component.html',
  styleUrls: ['./revenue-growth.component.scss']
})
export class RevenueGrowthComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 355,
                type: 'line',
                shadow: {
                    enabled: false,
                    color: '#eeeeee',
                    top: 3,
                    left: 2,
                    blur: 3,
                    opacity: 1
                },
            },
            stroke: {
                width: 7,   
                curve: 'smooth'
            },
            series: [{
                name: 'Revenue Growth',
                data: [0, 3, 10, 9, 29, 5, 22, 9, 30, 7, 19, 5]
            }],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    gradientToColors: [ '#1da1f2'],
                    shadeIntensity: 1,
                    type: 'horizontal',
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [100, 100, 100, 100],
                },
            },
            markers: {
                size: 4,
                opacity: 0.9,
                colors: ["#1da1f2"],
                strokeColor: "#ffffff",
                strokeWidth: 2,
                    
                hover: {
                    size: 7,
                }
            },
        }
        const chart = new ApexCharts(
            document.querySelector("#revenue-growth-chart"),
            options
        );
        chart.render();
    }

}
