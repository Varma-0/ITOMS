import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-radar-multiple-series',
  templateUrl: './radar-multiple-series.component.html',
  styleUrls: ['./radar-multiple-series.component.scss']
})
export class RadarMultipleSeriesComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radar',
                dropShadow: {
                    enabled: true,
                    blur: 1,
                    left: 1,
                    top: 1
                }
            },
            series: [{
                name: 'Series 1',
                data: [80, 50, 30, 40, 100, 20],
            }, {
                name: 'Series 2',
                data: [20, 30, 40, 80, 20, 80],
            }, {
                name: 'Series 3',
                data: [44, 76, 78, 13, 43, 10],
            }],
            title: {
                text: 'Radar Chart - Multi Series'
            },
            stroke: {
                width: 0
            },
            fill: {
                opacity: 0.4
            },
            markers: {
                size: 0
            },
            labels: ['2011', '2012', '2013', '2014', '2015', '2016']
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-radar-multiple-series"),
            options
        );
        chart.render();

        function update() {
            function randomSeries() {
                var arr = []
                for(var i = 0; i < 6; i++) {
                    arr.push(Math.floor(Math.random() * 100)) 
                }

                return arr
            }
            chart.updateSeries([{
                name: 'Series 1',
                data: randomSeries(),
            }, {
                name: 'Series 2',
                data: randomSeries(),
            }, {
                name: 'Series 3',
                data: randomSeries(),
            }])
        }
    }

}
