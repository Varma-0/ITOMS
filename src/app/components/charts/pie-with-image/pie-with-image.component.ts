import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-pie-with-image',
  templateUrl: './pie-with-image.component.html',
  styleUrls: ['./pie-with-image.component.scss']
})
export class PieWithImageComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                width: 450,
                type: 'pie',
            },
            colors: ['#93C3EE', '#E5C6A0', '#669DB5', '#94A74A'],
            series: [44, 33, 54, 45],
            fill: {
                type: 'image',
                opacity: 0.85,
                image: {
                    src: ['assets/img/slider/1.jpg', 'assets/img/slider/2.jpg', 'assets/img/slider/3.jpg', 'assets/img/slider/4.jpg'],
                    width: 25,
                    imagedHeight: 25
                },
            },
            stroke: {
                width: 4
            },
            dataLabels: {
                enabled: false
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
            document.querySelector("#apex-image-with-pie-chart"),
            options
        );
        chart.render();
    }

}
