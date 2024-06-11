import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExpensesService } from '../../services/expenses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {
  lineChartData: ChartData<'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  lineChartColors = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  lineChartLegend = true;
  lineChartType = 'line' as const;
  lineChartPlugins = [];

  constructor(private expensesService: ExpensesService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // Fetch data from ExpensesService and update lineChartData and lineChartLabels
    // Example:
    // this.expensesService.getExpensesListener(bookletId, month, year).subscribe(expenses => {
    //   this.lineChartData = ...;
    //   this.lineChartLabels = ...;  
    // });
  }
}