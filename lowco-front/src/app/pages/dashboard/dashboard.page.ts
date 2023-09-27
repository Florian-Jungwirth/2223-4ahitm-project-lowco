import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ChartItem } from 'chart.js/dist/types/index';
import { TitleService } from 'src/app/services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  @ViewChild('barChart') barChart: { nativeElement: ChartItem };
  @ViewChild('doughnatChart') doughnatChart: { nativeElement: ChartItem };
  @ViewChild('pieChart') pieChart: { nativeElement: ChartItem };

  bars: any;
  doughnuts: any;
  pie: any;
  constructor(private titleService: TitleService) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Statistik')
  }

  ionViewDidEnter() {
    Chart.register();
    Chart.defaults.color = '#C0C0C0';
    Chart.defaults.borderColor = 'rgba(128,128,128, 0.1)'
    this.createBarChart();
    this.createDoughnatChart();
    this.createPieChart();
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Sales in USD',
            data: [12000, 15000, 18000, 22000, 26000, 31000],
            backgroundColor: ['rgba(244, 67, 54, 0.4)', 'rgba(33, 150, 243, 0.4)', 'rgba(255, 235, 59, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(156, 39, 176, 0.4)', 'rgba(255, 152, 0, 0.4)'],
            borderColor: ['rgba(244, 67, 54, 1)', 'rgba(33, 150, 243, 1)', 'rgba(255, 235, 59, 1)', 'rgba(76, 175, 80, 1)', 'rgba(156, 39, 176, 1)', 'rgba(255, 152, 0, 1)'],
            borderWidth: 0,
            borderRadius: 5
          },
        ],
      }
    });    
  }

  createDoughnatChart() {
    this.doughnuts = new Chart(this.doughnatChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['North America', 'Europe', 'Asia', 'South America', 'Australia'],
        datasets: [
          {
            label: 'Market Share',
            data: [30, 25, 20, 15, 10],
            backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(54, 162, 235, 0.4)', 'rgba(255, 206, 86, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(153, 102, 255, 0.4)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 0,
          },
        ],
      }
    });
  }

  createPieChart() {
    this.pie = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
          {
            label: 'My Pie Chart',
            data: [10, 20, 30, 25, 15],
            backgroundColor: ['rgba(255, 87, 51, 0.4)', 'rgba(63, 81, 181, 0.4)', 'rgba(255, 195, 0, 0.4)', 'rgba(76, 175, 80, 0.4)', 'rgba(156, 39, 176, 0.4)'],
            borderColor: ['rgba(255, 87, 51, 1)', 'rgba(63, 81, 181, 1)', 'rgba(255, 195, 0, 1)', 'rgba(76, 175, 80, 1)', 'rgba(156, 39, 176, 1)'],
            borderWidth: 0,
          },
        ],
      }
    });
  }  
}
