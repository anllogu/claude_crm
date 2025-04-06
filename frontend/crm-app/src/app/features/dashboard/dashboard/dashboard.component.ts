import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { KPIs, OpportunityStatusCount } from '../../../core/models/dashboard.model';
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
    MatProgressSpinnerModule
  ]
})
export class DashboardComponent implements OnInit {
  kpis: KPIs | null = null;
  opportunityStatusData: StatusData[] = [];
  isLoading = true;
  maxStatusValue = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
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

    // Convert the object to an array of name/value pairs
    Object.entries(data).forEach(([status, count]) => {
      this.opportunityStatusData.push({
        name: status,
        value: count
      });

      if (count > this.maxStatusValue) {
        this.maxStatusValue = count;
      }
    });

    // Sort by status order
    const statusOrder = [
      OpportunityStatus.IDENTIFIED,
      OpportunityStatus.QUALIFIED,
      OpportunityStatus.PROPOSAL,
      OpportunityStatus.DECISION,
      OpportunityStatus.CLOSED_WON,
      OpportunityStatus.CLOSED_LOST,
      OpportunityStatus.CLOSED_DISCARDED
    ];

    this.opportunityStatusData.sort((a, b) => {
      return statusOrder.indexOf(a.name as OpportunityStatus) - 
             statusOrder.indexOf(b.name as OpportunityStatus);
    });
  }

  getPercentage(value: number): number {
    if (this.maxStatusValue === 0) return 0;
    return (value / this.maxStatusValue) * 100;
  }
}
