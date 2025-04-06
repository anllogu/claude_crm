import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getAuthUrl(): string {
    return `${this.apiUrl}/auth`;
  }

  getContactsUrl(): string {
    return `${this.apiUrl}/contacts`;
  }

  getInteractionsUrl(): string {
    return `${this.apiUrl}/interactions`;
  }

  getOpportunitiesUrl(): string {
    return `${this.apiUrl}/opportunities`;
  }

  getDashboardUrl(): string {
    return `${this.apiUrl}/dashboard`;
  }
}
