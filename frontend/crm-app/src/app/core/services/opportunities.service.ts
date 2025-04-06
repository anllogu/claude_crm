import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Opportunity, OpportunityCreate, OpportunityUpdate } from '../models/opportunity.model';

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
}
