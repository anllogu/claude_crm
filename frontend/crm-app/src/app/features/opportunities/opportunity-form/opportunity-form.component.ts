import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { OpportunitiesService } from '../../../core/services/opportunities.service';
import { ContactsService } from '../../../core/services/contacts.service';
import { Opportunity, OpportunityCreate, OpportunityUpdate, OpportunityStatus } from '../../../core/models/opportunity.model';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './opportunity-form.component.html',
  styleUrls: ['./opportunity-form.component.scss']
})
export class OpportunityFormComponent implements OnInit {
  opportunityForm!: FormGroup;
  isEditMode = false;
  opportunityId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  contacts: Contact[] = [];
  opportunityStatusOptions = Object.values(OpportunityStatus);

  constructor(
    private fb: FormBuilder,
    private opportunitiesService: OpportunitiesService,
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.opportunityForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      value: [null],
      status: [OpportunityStatus.IDENTIFIED, Validators.required],
      expected_close_date: [null],
      contact_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContacts();
    
    this.opportunityId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEditMode = !!this.opportunityId;

    if (this.isEditMode && this.opportunityId) {
      this.loadOpportunityData(this.opportunityId);
    }
  }

  loadContacts(): void {
    this.contactsService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
        this.errorMessage = 'No se pudieron cargar los contactos.';
      }
    });
  }

  loadOpportunityData(id: number): void {
    this.isLoading = true;
    this.opportunitiesService.getOpportunity(id).subscribe({
      next: (opportunity) => {
        // Convert date string to Date object for the datepicker
        const formData = {
          ...opportunity,
          expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : null
        };
        this.opportunityForm.patchValue(formData);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading opportunity:', err);
        this.errorMessage = 'No se pudo cargar la información de la oportunidad.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.opportunityForm.invalid) {
      this.opportunityForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    // Format the form data
    const formValue = this.opportunityForm.value;
    
    // Format date to full ISO string if it exists
    if (formValue.expected_close_date) {
      formValue.expected_close_date = new Date(formValue.expected_close_date).toISOString();
    }

    if (this.isEditMode && this.opportunityId) {
      const updatedOpportunity: OpportunityUpdate = formValue;
      this.opportunitiesService.updateOpportunity(this.opportunityId, updatedOpportunity).subscribe({
        next: () => this.router.navigate(['/opportunities']),
        error: (err) => this.handleError(err, 'update'),
        complete: () => this.isLoading = false
      });
    } else {
      const newOpportunity: OpportunityCreate = formValue;
      this.opportunitiesService.createOpportunity(newOpportunity).subscribe({
        next: () => this.router.navigate(['/opportunities']),
        error: (err) => this.handleError(err, 'create'),
        complete: () => this.isLoading = false
      });
    }
  }

  handleError(error: any, action: 'create' | 'update'): void {
    console.error(`Error ${action}ing opportunity:`, error);
    this.errorMessage = `No se pudo ${action === 'create' ? 'crear' : 'actualizar'} la oportunidad. Por favor, inténtalo de nuevo.`;
    this.isLoading = false;
  }

  goBack(): void {
    this.router.navigate(['/opportunities']);
  }

  // Helper getters for template validation
  get name() { return this.opportunityForm.get('name'); }
  get contact_id() { return this.opportunityForm.get('contact_id'); }
  get status() { return this.opportunityForm.get('status'); }
}
