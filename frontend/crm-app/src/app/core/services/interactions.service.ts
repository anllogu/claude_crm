import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Interaction, InteractionCreate, InteractionUpdate } from '../models/interaction.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getInteractions(): Observable<Interaction[]> {
    return this.http.get<Interaction[]>(this.apiConfig.getInteractionsUrl());
  }

  getInteraction(id: number): Observable<Interaction> {
    return this.http.get<Interaction>(`${this.apiConfig.getInteractionsUrl()}/${id}`);
  }

  getContactInteractions(contactId: number): Observable<Interaction[]> {
    return this.http.get<Interaction[]>(`${this.apiConfig.getInteractionsUrl()}/contact/${contactId}`);
  }

  createInteraction(interaction: InteractionCreate): Observable<Interaction> {
    return this.http.post<Interaction>(this.apiConfig.getInteractionsUrl(), interaction);
  }

  updateInteraction(id: number, interaction: InteractionUpdate): Observable<Interaction> {
    return this.http.put<Interaction>(`${this.apiConfig.getInteractionsUrl()}/${id}`, interaction);
  }

  deleteInteraction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getInteractionsUrl()}/${id}`);
  }
}
