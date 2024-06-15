import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-radialbar-semi-circular-gauge',
  templateUrl: './radialbar-semi-circular-gauge.component.html',
  styleUrls: ['./radialbar-semi-circular-gauge.component.scss']
})
export class RadialbarSemiCircularGaugeComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                type: 'radialBar',
                offsetY: -20,
                height: 600,
            },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: "#e7e7e7",
                        strokeWidth: '97%',
                        margin: 5, // margin is in pixels
                        shadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            color: '#999',
                            opacity: 1,
                            blur: 2
                        }
                    },
                    dataLabels: {
                        name: {
                            show: false
                        },   
                        value: {
                            offsetY: -2,
                            fontSize: '22px'
                        }                     
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91]
                },
            },
            series: [76],
            labels: ['Average Results'],
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-radialbar-semi-circular-gauge"),
            options
        );
        chart.render();
    }

}
