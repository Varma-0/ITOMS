import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-basic-radar-chart',
  templateUrl: './basic-radar-chart.component.html',
  styleUrls: ['./basic-radar-chart.component.scss']
})
export class BasicRadarChartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 300,
                type: 'radar',
            },
            series: [{
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20],
            }],
            title: {
                text: 'Basic Radar Chart'
            },
            labels: ['January', 'February', 'March', 'April', 'May', 'June']
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-basic-radar-chart"),
            options
        );
        chart.render();
    }
}
