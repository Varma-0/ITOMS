import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-basic-radialbar-chart',
  templateUrl: './basic-radialbar-chart.component.html',
  styleUrls: ['./basic-radialbar-chart.component.scss']
})
export class BasicRadialbarChartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '70%',
                    }
                },
            },
            series: [70],
            labels: ['Cricket'],
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-basic-radialbar-chart"),
            options
        );
        chart.render();
    }

}
