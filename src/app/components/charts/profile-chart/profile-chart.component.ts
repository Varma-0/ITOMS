import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-chart',
  templateUrl: './profile-chart.component.html',
  styleUrl: './profile-chart.component.scss'
})
export class ProfileChartComponent {
  @Input() labels: string[] = [];
  @Input() series: number[] = [];
  @Input() colors: string[] = [];

  constructor() { }

  ngOnInit() {
    const options = {
      chart: {
        type: 'donut',
        height: 310,
      },
      labels: this.labels.length ? this.labels : ['80% Send', '67% Read', '33% Unread'],
      series: this.series.length ? this.series : [100, 67, 33],
      colors: this.colors.length ? this.colors : ['#6956CE', '#1CD3D2', '#4788ff'],
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
    };
    const chart = new ApexCharts(
      document.querySelector("#profile-chart"),
      options
    );
    chart.render();
  }
}