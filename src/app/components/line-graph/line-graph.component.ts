import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ExpensesService } from '../../services/expenses.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {
  isBrowser: boolean;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [],
        label: 'Series A',
        fill: true,
        tension: 0.5
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };

  constructor(
    private expensesService: ExpensesService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('LineGraphComponent initialized');
      this.generateRandomData();
    }
  }

  generateRandomData() {
    const data = [];
    const labels = this.lineChartData.labels;
    if (labels) {
      for (let i = 0; i < labels.length; i++) {
        data.push(Math.floor(Math.random() * 100));
      }
      this.lineChartData.datasets[0].data = data;
    }
  }
}
