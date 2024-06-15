import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-radar-with-polygon-fill',
  templateUrl: './radar-with-polygon-fill.component.html',
  styleUrls: ['./radar-with-polygon-fill.component.scss']
})
export class RadarWithPolygonFillComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 350,
                type: 'radar',
            },
            series: [{
                name: 'Series 1',
                data: [20, 100, 40, 30, 50, 80, 33],
            }],
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            plotOptions: {
                radar: {
                    size: 140,
                    polygons: {
                        strokeColor: '#e9e9e9',
                        fill: {
                            colors: ['#f8f8f8', '#fff']
                        }
                    }
                }
            },
            title: {
                text: 'Radar with Polygon Fill'
            },
            colors: ['#FF4560'],
            markers: {
                size: 4,
                colors: ['#fff'],
                strokeColor: '#FF4560',
                strokeWidth: 2,
            },
            tooltip: {
                y: {
                    formatter: function(val: any) {
                        return val
                    }   
                }
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: function(val, i) {
                        if(i % 2 === 0) {
                            return val
                        } else {
                            return ''
                        }
                    }
                }
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#apex-radar-with-polygon-fill"),
            options
        );
        chart.render();
    }

}
