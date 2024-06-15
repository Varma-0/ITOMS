import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-basic-horizontal-bar',
  templateUrl: './basic-horizontal-bar.component.html',
  styleUrls: ['./basic-horizontal-bar.component.scss']
})
export class BasicHorizontalBarComponent implements OnInit {

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
        this.basic_horizontalBar_chart();
    }

    basic_horizontalBar_chart() {
        let element = document.getElementById("basic_horizontalBar_chart");
        new Chart(element, {
            type: 'horizontalBar',
            data: {
                labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                datasets: [
                    {
                        label: "Population (millions)",
                        backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.success,
                        this.colors.warning,
                        this.colors.info
                        ],
                        data: [2478,5267,734,784,433]
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
