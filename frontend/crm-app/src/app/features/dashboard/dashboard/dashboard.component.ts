import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { KPIs, OpportunityStatusCount, OpportunityClientValue } from '../../../core/models/dashboard.model';
import { ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { OpportunityStatus } from '../../../core/models/opportunity.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface StatusData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseChartDirective
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class DashboardComponent implements OnInit {
  kpis: KPIs | null = null;
  opportunityStatusData: StatusData[] = [];
  isLoading = true;
  maxStatusValue = 0;

  // Gráficos
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  opportunityClientData: ChartData<'pie'> = { labels: [], datasets: [] };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadOpportunityClientData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load KPIs
    this.dashboardService.getKPIs().subscribe({
      next: (data) => {
        this.kpis = data;
        this.loadOpportunityStatusData();
      },
      error: (error) => {
        console.error('Error loading KPIs:', error);
        this.isLoading = false;
      }
    });
  }

  loadOpportunityStatusData(): void {
    this.dashboardService.getOpportunitiesByStatus().subscribe({
      next: (data) => {
        this.processOpportunityStatusData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading opportunity status data:', error);
        this.isLoading = false;
      }
    });
  }

  processOpportunityStatusData(data: OpportunityStatusCount): void {
    this.opportunityStatusData = [];
    this.maxStatusValue = 0;

    const labels: string[] = [];
    const values: number[] = [];

    // Convertir el objeto a arrays para el gráfico de barras
    Object.entries(data).forEach(([status, count]) => {
      this.opportunityStatusData.push({
        name: status,
        value: count
      });
      labels.push(status);
      values.push(count);

      if (count > this.maxStatusValue) {
        this.maxStatusValue = count;
      }
    });

    // Ordenar por estado
    const statusOrder = [
      OpportunityStatus.IDENTIFIED,
      OpportunityStatus.QUALIFIED,
      OpportunityStatus.PROPOSAL,
      OpportunityStatus.DECISION,
      OpportunityStatus.CLOSED_WON,
      OpportunityStatus.CLOSED_LOST,
      OpportunityStatus.CLOSED_DISCARDED
    ];

    // Reordenar los arrays según el orden de estados
    const orderedLabels: string[] = [];
    const orderedValues: number[] = [];

    statusOrder.forEach(status => {
      const index = labels.indexOf(status);
      if (index !== -1) {
        orderedLabels.push(labels[index]);
        orderedValues.push(values[index]);
      }
    });

    this.barChartData = {
      labels: orderedLabels,
      datasets: [{
        data: orderedValues,
        label: 'Oportunidades',
        backgroundColor: '#36A2EB'
      }]
    };
  }

  loadOpportunityClientData(): void {
    this.dashboardService.getOpportunitiesByClient().subscribe({
      next: (data) => {
        this.processOpportunityClientData(data);
      },
      error: (error) => {
        console.error('Error loading opportunity client data:', error);
      }
    });
  }

  processOpportunityClientData(data: OpportunityClientValue): void {
    const labels = Object.keys(data);
    const values = Object.values(data);

    this.opportunityClientData = {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8BC34A', '#607D8B', '#E91E63', '#3F51B5'
        ]
      }]
    };
  }

  getPercentage(value: number): number {
    if (this.maxStatusValue === 0) return 0;
    return (value / this.maxStatusValue) * 100;
  }
}
