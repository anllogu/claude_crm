import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading indicator
import { MatProgressBarModule } from '@angular/material/progress-bar'; // For progress bar
import { MatCardModule } from '@angular/material/card'; // Optional: Use Card for better layout

import { ContactsService } from '../../../core/services/contacts.service';
import { Contact, ContactCreate, ContactUpdate } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule, // Add Material Form Field
    MatInputModule, // Add Material Input
    MatButtonModule, // Add Material Button
    MatIconModule, // Add Material Icon
    MatProgressSpinnerModule, // Add Progress Spinner
    MatProgressBarModule, // Add Progress Bar
    MatCardModule // Add Card Module
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup; // Initialize in constructor or ngOnInit
  isEditMode = false;
  contactId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      // Add other fields as necessary based on Contact model
    });
  }

  ngOnInit(): void {
    this.contactId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEditMode = !!this.contactId;

    if (this.isEditMode && this.contactId) {
      this.loadContactData(this.contactId);
    }
  }

  loadContactData(id: number): void {
    this.isLoading = true;
    this.contactsService.getContact(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue(contact);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading contact:', err);
        this.errorMessage = 'Failed to load contact data.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched(); // Mark fields to show validation errors
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const formValue = this.contactForm.value;

    if (this.isEditMode && this.contactId) {
      const updatedContact: ContactUpdate = formValue;
      this.contactsService.updateContact(this.contactId, updatedContact).subscribe({
        next: () => this.router.navigate(['/contacts']),
        error: (err) => this.handleError(err, 'update'),
        complete: () => this.isLoading = false
      });
    } else {
      const newContact: ContactCreate = formValue;
      this.contactsService.createContact(newContact).subscribe({
        next: () => this.router.navigate(['/contacts']),
        error: (err) => this.handleError(err, 'create'),
        complete: () => this.isLoading = false
      });
    }
  }

  handleError(error: any, action: 'create' | 'update'): void {
    console.error(`Error ${action}ing contact:`, error);
    this.errorMessage = `Failed to ${action} contact. Please try again.`;
    this.isLoading = false;
  }

  goBack(): void {
    this.router.navigate(['/contacts']);
  }

  // Helper getters for template validation
  get firstName() { return this.contactForm.get('first_name'); }
  get lastName() { return this.contactForm.get('last_name'); }
  get email() { return this.contactForm.get('email'); }
}
