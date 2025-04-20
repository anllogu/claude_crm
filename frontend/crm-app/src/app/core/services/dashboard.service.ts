import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { KPIs, OpportunityStatusCount, OpportunityClientValue } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getOpportunitiesByClient(): Observable<OpportunityClientValue> {
    return this.http.get<OpportunityClientValue>(`${this.apiConfig.getDashboardUrl()}/opportunities-by-client`);
  }

  getKPIs(): Observable<KPIs> {
    return this.http.get<KPIs>(`${this.apiConfig.getDashboardUrl()}/kpis`);
  }

  getOpportunitiesByStatus(): Observable<OpportunityStatusCount> {
    return this.http.get<OpportunityStatusCount>(`${this.apiConfig.getDashboardUrl()}/opportunities-by-status`);
  }
}
