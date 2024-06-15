import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';
import data from '../../../../assets/json/series.json';

@Component({
  selector: 'app-zoomable-line-timeseries',
  templateUrl: './zoomable-line-timeseries.component.html',
  styleUrls: ['./zoomable-line-timeseries.component.scss']
})
export class ZoomableLineTimeseriesComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        var ts2 = 1484418600000;
        const dates = [];
        var spikes = [5, -5, 3, -3, 8, -8]
        for (var i = 0; i < 120; i++) {
            ts2 = ts2 + 86400000;
            var innerArr = [ts2, data.dataSeries1["s2"][i].value];
            dates.push(innerArr)
        }
        const options = {
            chart: {
                type: 'area',
                stacked: false,
                height: 350,
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            dataLabels: {
                enabled: false
            },
            series: [{
                name: 'XYZ MOTORS',
                data: dates
            }],
            markers: {
                size: 0,
            },
            title: {
                text: 'Stock Price Movement',
                align: 'left'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                },
            },
            yaxis: {
                labels: {
                    formatter: function (val: any) {
                        return (val / 1000000).toFixed(0);
                    },
                },
                title: {
                    text: 'Price'
                },
            },
            xaxis: {
                type: 'datetime',
            },
            tooltip: {
                shared: false,
                    y: {
                        formatter: function (val: any) {
                        return (val / 1000000).toFixed(0)
                    }
                }
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#zoomable-timeseries-chart"),
            options
        );
        chart.render();
    }

}
