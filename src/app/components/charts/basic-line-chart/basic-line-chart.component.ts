import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-basic-line-chart',
  templateUrl: './basic-line-chart.component.html',
  styleUrls: ['./basic-line-chart.component.scss']
})
export class BasicLineChartComponent implements OnInit {

    @Input() data: any[] = [];
    private chart: ApexCharts | null = null;
  
    constructor() { }
  
    ngOnInit() {
      this.renderChart();
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes['data']) {
        this.renderChart();
      }
    }
  
    private renderChart() {
      const { dates, dataSeries } = this.processData();
  
      const options = {
        chart: {
          height: 350,
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: false }
        },
        series: [{
          name: "Values",
          data: dataSeries
        }],
        colors: ['#2196F3'],
        dataLabels: { enabled: false },
        stroke: { 
          curve: 'smooth',
          width: 4
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
        },
        xaxis: {
          categories: dates,
          labels: {
            style: {
              colors: '#333',
              fontSize: '11px',
            }
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          min: 0,
          max: Math.max(...dataSeries) + 1,
          tickAmount: 9,
          labels: {
            style: {
              colors: '#333',
              fontSize: '11px',
            },
            formatter: (value) => value.toFixed(0)
          }
        },
        legend: { show: false },
        tooltip: {
          y: {
            formatter: (value) => value.toFixed(0)
          }
        }
      };
  
      if (this.chart) {
        this.chart.updateOptions(options);
      } else {
        this.chart = new ApexCharts(document.querySelector("#apex-basic-line-chart"), options);
        this.chart.render();
      }
    }
  
    private processData(): { dates: string[], dataSeries: number[] } {
      const pastWeekDates = this.getPastWeekDates();
      const dateMap = new Map<string, number>();
  
      pastWeekDates.forEach(date => dateMap.set(date, 0));
  
      this.data.forEach(item => {
        Object.entries(item).forEach(([dateStr, value]) => {
          const formattedDate = this.formatDate(new Date(dateStr));
          if (dateMap.has(formattedDate)) {
            dateMap.set(formattedDate, (dateMap.get(formattedDate) || 0) + Number(value));
          }
        });
      });
  
      const dates = pastWeekDates;
      const dataSeries = pastWeekDates.map(date => dateMap.get(date) || 0);
  
      return { dates, dataSeries };
    }
  
    private getPastWeekDates(): string[] {
      const dates: string[] = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(this.formatDate(date));
      }
      return dates;
    }
  
    private formatDate(date: Date): string {
      const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit',
        weekday: 'short'
      };
      return date.toLocaleDateString('en-US', options).replace(',', '');
    }
}