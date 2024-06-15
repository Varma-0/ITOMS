import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-basic-radar-chartv2',
  templateUrl: './basic-radar-chartv2.component.html',
  styleUrls: ['./basic-radar-chartv2.component.scss']
})
export class BasicRadarChartv2Component implements OnInit {

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
        this.basic_radar_chart();
    }

    basic_radar_chart() {
        let element = document.getElementById("basic_radar_chart");
        new Chart(element, {
            type: 'radar',
            data: {
                labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                datasets: [
                {
                    label: "1950",
                    fill: true,
                    backgroundColor: this.colors.primaryLight,
                    borderColor: this.colors.primary,
                    pointBorderColor: "#ffffff",
                    data: [8.77,55.61,21.69,6.62,6.82]
                }, {
                    label: "2050",
                    fill: true,
                    backgroundColor: this.colors.successLight,
                    borderColor: this.colors.success,
                    pointBorderColor: "#ffffff",
                    data: [25.48,54.16,7.61,8.06,4.45]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Distribution in % of world population'
                }
            }
        });
    }

}
