import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-basic-bar-chart',
  templateUrl: './basic-bar-chart.component.html',
  styleUrls: ['./basic-bar-chart.component.scss']
})
export class BasicBarChartComponent implements OnInit {

  constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 360,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            series: [{
                data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
            }],
            xaxis: {
                categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-basic-bar-chart"),
            options
        );
        chart.render();
    }

}
