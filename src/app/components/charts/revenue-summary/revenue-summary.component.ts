import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-revenue-summary',
  templateUrl: './revenue-summary.component.html',
  styleUrls: ['./revenue-summary.component.scss']
})
export class RevenueSummaryComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                height: 335,
                type: 'area',
            },
            dataLabels: {
                enabled: false
            },
            colors: ['#008FFB', '#18D2B7'],
            stroke: {
                curve: 'smooth'
            },
            series: [{
                name: 'Monthly Sales',
                data: [50, 70, 90, 65, 75, 50, 80]
            }, {
                name: 'Yearly Sales',
                data: [40, 60, 80, 55, 65, 40, 70]
            }],
            xaxis: {
                categories: ["01 Jan", "05 Jan", "10 Jan", "15 Jan", "20 Jan", "25 Jan", "30 Jan"],                
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            }
        }
        const chart = new ApexCharts(
            document.querySelector("#revenue-summary-chart"),
            options
        );
        chart.render();
    }

}
