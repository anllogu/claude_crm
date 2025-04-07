import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Opportunity, OpportunityCreate, OpportunityUpdate } from '../models/opportunity.model';
import { OpportunityTracking, OpportunityTrackingCreate } from '../models/opportunity-tracking.model';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getOpportunities(): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(this.apiConfig.getOpportunitiesUrl());
  }

  getOpportunity(id: number): Observable<Opportunity> {
    return this.http.get<Opportunity>(`${this.apiConfig.getOpportunitiesUrl()}/${id}`);
  }

  getContactOpportunities(contactId: number): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(`${this.apiConfig.getOpportunitiesUrl()}/contact/${contactId}`);
  }

  createOpportunity(opportunity: OpportunityCreate): Observable<Opportunity> {
    return this.http.post<Opportunity>(this.apiConfig.getOpportunitiesUrl(), opportunity);
  }

  updateOpportunity(id: number, opportunity: OpportunityUpdate): Observable<Opportunity> {
    return this.http.put<Opportunity>(`${this.apiConfig.getOpportunitiesUrl()}/${id}`, opportunity);
  }

  deleteOpportunity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getOpportunitiesUrl()}/${id}`);
  }

  // Opportunity Tracking methods
  getOpportunityTracking(opportunityId: number): Observable<OpportunityTracking[]> {
    return this.http.get<OpportunityTracking[]>(`${this.apiConfig.getOpportunitiesUrl()}/${opportunityId}/tracking`);
  }

  addTrackingEntry(opportunityId: number, tracking: OpportunityTrackingCreate): Observable<OpportunityTracking> {
    return this.http.post<OpportunityTracking>(
      `${this.apiConfig.getOpportunitiesUrl()}/${opportunityId}/tracking`, 
      tracking
    );
  }

  addComment(opportunityId: number, comment: string): Observable<OpportunityTracking> {
    const trackingData: OpportunityTrackingCreate = {
      opportunity_id: opportunityId,
      tracking_type: 'comment',
      comment: comment
    };
    return this.addTrackingEntry(opportunityId, trackingData);
  }
}
