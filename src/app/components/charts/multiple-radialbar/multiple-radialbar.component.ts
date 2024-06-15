import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-multiple-radialbar',
  templateUrl: './multiple-radialbar.component.html',
  styleUrls: ['./multiple-radialbar.component.scss']
})
export class MultipleRadialbarComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function (w) {
                                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                                return 249
                            }
                        }
                    }
                }
            },
            series: [44, 55, 67, 83],
            labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-multiple-radialbar-chart"),
            options
        );
        chart.render();
    }

}
