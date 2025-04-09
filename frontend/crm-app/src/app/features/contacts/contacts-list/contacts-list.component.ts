import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Import MatTableModule and MatTableDataSource
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginator for pagination
import { MatSort, MatSortModule } from '@angular/material/sort'; // Import MatSort for sorting
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule for filtering
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for filtering
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule

import { ContactsService } from '../../../core/services/contacts.service';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule, // Add Material Table module
    MatButtonModule, // Add Material Button module
    MatIconModule, // Add Material Icon module
    MatPaginatorModule, // Add Paginator module
    MatSortModule, // Add Sort module
    MatFormFieldModule, // Add FormField module
    MatInputModule, // Add Input module
    MatCardModule, // Add Card module
    MatProgressSpinnerModule // Add Progress Spinner module
  ],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss'
})
export class ContactsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'company', 'actions']; // Columns to display
  dataSource = new MatTableDataSource<Contact>(); // Data source for the table

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true; // Track loading state

  constructor(
    private contactsService: ContactsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  ngAfterViewInit(): void {
    // Set paginator and sort after view init
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactsService.getContacts().subscribe({
      next: (data) => {
        this.dataSource.data = data; // Assign data to the MatTableDataSource
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
        this.isLoading = false;
        // Handle error appropriately, e.g., show a message to the user
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createNewContact(): void {
    this.router.navigate(['/contacts/new']);
  }

  editContact(id: number | undefined): void {
    if (id === undefined) {
      console.error('Cannot edit contact with undefined ID');
      return;
    }
    this.router.navigate(['/contacts/edit', id]);
  }

  // Optional: Add delete functionality later if needed
  // deleteContact(id: number): void {
  //   if (confirm('Are you sure you want to delete this contact?')) {
  //     this.contactsService.deleteContact(id).subscribe({
  //       next: () => {
  //         this.loadContacts(); // Reload contacts after deletion
  //       },
  //       error: (err) => console.error('Error deleting contact:', err)
  //     });
  //   }
  // }
}
