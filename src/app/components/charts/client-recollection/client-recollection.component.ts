import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-client-recollection',
  templateUrl: './client-recollection.component.html',
  styleUrls: ['./client-recollection.component.scss']
})
export class ClientRecollectionComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 270,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '40%',
                    endingShape: 'rounded'	
                },
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#3578e5', '#FF5B5C'],
            stroke: {
                show: true,
                width: 3,
                colors: ['transparent']
            },
            series: [{
                name: 'New Clients',
                data: [44, 55, 57, 56, 65, 65, 70, 65, 60, 70, 75]
            }, {
                name: 'Retained Clients',
                data: [35, 41, 36, 26, 70, 68, 70, 60, 55, 65, 70]
            }],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val: any) {
                        return + val + " thousands"
                    }
                }
            },
        }
        const chart = new ApexCharts(
            document.querySelector("#client-recollection-chart"),
            options
        );
        chart.render();
    }

}
