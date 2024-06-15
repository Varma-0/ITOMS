import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-basic-pie-chart',
  templateUrl: './basic-pie-chart.component.html',
  styleUrls: ['./basic-pie-chart.component.scss']
})
export class BasicPieChartComponent implements OnInit {

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
        this.basic_pie_chart();
    }

    basic_pie_chart() {
        let element = document.getElementById("basic_pie_chart");
        new Chart(element, {
            type: 'pie',
            data: {
                labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
                datasets: [{
                    label: "Population (millions)",
                    borderWidth: 2,
                    backgroundColor: [
                    this.colors.primary,
                    this.colors.pink,
                    this.colors.success,
                    this.colors.warning,
                    this.colors.info
                    ],
                    data: [2478,3267,734,1784,933]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Predicted world population (millions) in 2050'
                }
            }
        });
    }
}
