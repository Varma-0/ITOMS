import { Component, OnInit, Input, OnChanges } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-multiple-radialbar',
  templateUrl: './multiple-radialbar.component.html',
  styleUrls: ['./multiple-radialbar.component.scss']
})
export class MultipleRadialbarComponent implements OnInit {

  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() totalLabel: string = 'Total';
  @Input() totalValue: number = 0;

  constructor() { }

  ngOnInit() {
    this.renderChart();
  }

  private renderChart() {
    const options = {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: this.totalLabel,
              formatter: () => {
                return this.totalValue;
              }
            }
          }
        }
      },
      series: this.series,
      labels: this.labels,
    };

    const chart = new ApexCharts(
      document.querySelector("#apex-multiple-radialbar-chart"),
      options
    );
    chart.render();
  }
}
