import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Contact, ContactCreate, ContactUpdate } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiConfig.getContactsUrl());
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiConfig.getContactsUrl()}/${id}`);
  }

  createContact(contact: ContactCreate): Observable<Contact> {
    return this.http.post<Contact>(this.apiConfig.getContactsUrl(), contact);
  }

  updateContact(id: number, contact: ContactUpdate): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiConfig.getContactsUrl()}/${id}`, contact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.getContactsUrl()}/${id}`);
  }
}
