import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
declare let $: any;

@Component({
  selector: 'app-bar-with-line',
  templateUrl: './bar-with-line.component.html',
  styleUrls: ['./bar-with-line.component.scss']
})
export class BarWithLineComponent implements OnInit {

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
        this.bar_chart_with_line();
    }

    bar_chart_with_line = () => {
        let element = document.getElementById("bar_chart_with_line");
        new Chart(element, {
            type: 'bar',
            data: {
                labels: ["1900", "1950", "1999", "2050"],
                datasets: [{
                    label: "Europe",
                    type: "line",
                    borderColor: this.colors.primary,
                    data: [408,547,675,734],
                    fill: false
                }, {
                    label: "Africa",
                    type: "line",
                    borderColor: this.colors.secondary,
                    data: [133,221,783,2478],
                    fill: false
                }, {
                    label: "Europe",
                    type: "bar",
                    backgroundColor: this.colors.purple,
                    data: [408,547,675,734],
                }, {
                    label: "Africa",
                    type: "bar",
                    backgroundColor: this.colors.pink,
                    backgroundColorHover: "#3e95cd",
                    data: [133,221,783,2478]
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Population growth (millions): Europe & Africa'
                },
                legend: { display: false }
            }
        });
    }

}
