import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-basic-line-chartv2',
  templateUrl: './basic-line-chartv2.component.html',
  styleUrls: ['./basic-line-chartv2.component.scss']
})
export class BasicLineChartv2Component implements OnInit {

    colors: any = {
        primary: $('.chartjs-colors .bg-primary').css('background-color'),
        secondary: $('.chartjs-colors .bg-secondary').css('background-color'),
        info: $('.chartjs-colors .bg-info').css('background-color'),
        success: $('.chartjs-colors .bg-success').css('background-color'),
        danger: $('.chartjs-colors .bg-danger').css('background-color'),
        warning: $('.chartjs-colors .bg-warning').css('background-color'),
        purple: $('.chartjs-colors .bg-purple').css('background-color'),
        pink: $('.chartjs-colors .bg-pink').css('background-color'),
        primaryLight: $('.chartjs-colors .bg-primary-light').css('background-color'),
        successLight: $('.chartjs-colors .bg-success-light').css('background-color'),
    };

    constructor() { }

    ngOnInit() {
        this.basic_line_chart();
    }

    basic_line_chart() {
        let element = document.getElementById("basic_line_chart");
        new Chart(element, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    data: [65, 0, 80, 81, 56, 85, 40],
                    label: "Africa",
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primaryLight,
                }, {
                    data: [25, 55, 20, 31, 96, 35, 80],
                    label: "Asia",
                    borderColor: this.colors.success,
                    backgroundColor: this.colors.successLight,
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'World population per region (in millions)'
                }
            }
        });
    }

}
