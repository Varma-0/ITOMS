import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-basic-bar-chartv2',
  templateUrl: './basic-bar-chartv2.component.html',
  styleUrls: ['./basic-bar-chartv2.component.scss']
})
export class BasicBarChartv2Component implements OnInit {

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
        this.basic_bar_chart();
    }

    basic_bar_chart = () => {
        let element = document.getElementById("basic_bar_chart");
        new Chart(element, {
            type: 'bar',
            data: {
                labels: ["Europe", "Asia", "Africa", "North America", "South America", "Antarctica", "Australia"],
                datasets: [
                    {
                        label: "Population (millions)",
                        backgroundColor: [
                            this.colors.primary,
                            this.colors.secondary,
                            this.colors.success,
                            this.colors.warning,
                            this.colors.info,
                            this.colors.purple,
                            this.colors.pink,
                        ],
                        data: [2478, 3267, 1734, 2084, 3000, 2478, 3267]
                    }
                ]
            },
            options: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            }
        });
    }

}
