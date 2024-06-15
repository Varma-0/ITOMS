import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-donut-with-pattern',
  templateUrl: './donut-with-pattern.component.html',
  styleUrls: ['./donut-with-pattern.component.scss']
})
export class DonutWithPatternComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                width: 415,
                type: 'donut',
                dropShadow: {
                    enabled: true,
                    color: '#111',
                    top: -1,
                    left: 3,
                    blur: 3,
                    opacity: 0.2
                }
            },
            stroke: {
                width: 0,
            },
            series: [44, 55, 41, 17, 15],
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                showAlways: true,
                                show: true
                            }
                        }
                    }
                }
            },
            labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
            dataLabels: {
                dropShadow: {
                    blur: 3,
                    opacity: 0.8
                }
            },
            fill: {
            type: 'pattern',
                opacity: 1,
                pattern: {
                enabled: true,
                style: ['verticalLines', 'squares', 'horizontalLines', 'circles','slantedLines'], 
                },
            },
            states: {
                hover: {
                enabled: false
                }
            },
            theme: {
                palette: 'palette2'
            },
            title: {
                text: "Favourite Movie Type"
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
            document.querySelector("#apex-donut-with-pattern-chart"),
            options
        );
        chart.render();
    }
}
