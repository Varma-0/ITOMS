import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-radialbar-stroked-circular-gauge',
  templateUrl: './radialbar-stroked-circular-gauge.component.html',
  styleUrls: ['./radialbar-stroked-circular-gauge.component.scss']
})
export class RadialbarStrokedCircularGaugeComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radialBar',
                offsetY: -10
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    dataLabels: {
                        name: {
                            fontSize: '16px',
                            color: undefined,
                            offsetY: 120
                        },
                        value: {
                            offsetY: 76,
                            fontSize: '22px',
                            color: undefined,
                            formatter: function (val) {
                                return val + "%";
                            }
                        }
                    }
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    shadeIntensity: 0.15,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 65, 91]
                },
            },
            stroke: {
                dashArray: 4
            },
            series: [67],
            labels: ['Median Ratio'],
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-radialbar-stroked-circular-gauge"),
            options
        );
        chart.render();
    }

}
