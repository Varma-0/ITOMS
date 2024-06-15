import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-radialbars-with-image',
  templateUrl: './radialbars-with-image.component.html',
  styleUrls: ['./radialbars-with-image.component.scss']
})
export class RadialbarsWithImageComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            fill: {
                type: 'image',
                image: {
                    src: ['assets/img/slider/1.jpg'],
                }
            },
            series: [67],
            stroke: {
                lineCap: 'round'
            },
            labels: ['Volatility'],
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-radialbars-with-image"),
            options
        );
        chart.render();
    }

}
