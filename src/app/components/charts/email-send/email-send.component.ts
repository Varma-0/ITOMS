import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss']
})
export class EmailSendComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        const options = {
            chart: {
                type: 'donut',
                height: 310,
            },
            labels: ['80% Send', '67% Read', '33% Unread'],
            series: [100, 67, 33],
            colors: ['#6956CE', '#1CD3D2', '#4788ff'],
            dataLabels: {
                enabled: false,
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
        const chart = new ApexCharts(
            document.querySelector("#emailSend-chart"),
            options
        );
        chart.render();
    }

}
