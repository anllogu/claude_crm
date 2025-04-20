import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../../core/services/dashboard.service';
import { OpportunityDashboard } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-opportunity-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './opportunity-dashboard.component.html',
  styleUrls: ['./opportunity-dashboard.component.scss']
})
export class OpportunityDashboardComponent implements OnInit {
  data: OpportunityDashboard | null = null;
  loading = true;
  error = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getOpportunityDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        console.error('Error cargando cuadro de mandos de oportunidades:', err);
      }
    });
  }

  getTrendColor(trend: number): string {
    if (trend > 0) return 'trend-up';
    if (trend < 0) return 'trend-down';
    return '';
  }
}
