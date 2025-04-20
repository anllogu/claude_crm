import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { OpportunitiesService } from '../../../core/services/opportunities.service';
import { ContactsService } from '../../../core/services/contacts.service';
import { Opportunity, OpportunityStatus } from '../../../core/models/opportunity.model';
import { Contact } from '../../../core/models/contact.model';
import { OpportunityDashboardComponent } from '../opportunity-dashboard/opportunity-dashboard.component';

@Component({
  selector: 'app-opportunities-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    OpportunityDashboardComponent
  ],
  templateUrl: './opportunities-list.component.html',
  styleUrl: './opportunities-list.component.scss'
})
export class OpportunitiesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'value', 'status', 'expected_close_date', 'actions'];
  dataSource = new MatTableDataSource<Opportunity>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = true;
  opportunityStatusEnum = OpportunityStatus;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContactId: number | null = null;
  allOpportunities: Opportunity[] = [];

  constructor(
    private opportunitiesService: OpportunitiesService,
    private contactsService: ContactsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadOpportunities();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadContacts(): void {
    this.contactsService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.filteredContacts = [...this.contacts];
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
      }
    });
  }

  filterContacts(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
    
    if (!searchValue) {
      this.filteredContacts = [...this.contacts];
      return;
    }
    
    this.filteredContacts = this.contacts.filter(contact => {
      const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
      const company = contact.company ? contact.company.toLowerCase() : '';
      
      return fullName.includes(searchValue) || company.includes(searchValue);
    });
  }

  loadOpportunities(): void {
    this.isLoading = true;
    this.opportunitiesService.getOpportunities().subscribe({
      next: (data) => {
        this.allOpportunities = data;
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching opportunities:', err);
        this.isLoading = false;
      }
    });
  }

  filterByContact(): void {
    if (this.selectedContactId === null) {
      // If no contact is selected, show all opportunities
      this.dataSource.data = this.allOpportunities;
    } else {
      // Filter opportunities by the selected contact
      this.dataSource.data = this.allOpportunities.filter(
        opportunity => opportunity.contact_id === this.selectedContactId
      );
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createNewOpportunity(): void {
    this.router.navigate(['/opportunities/new']);
  }

  editOpportunity(id: number | undefined): void {
    if (id === undefined) {
      console.error('Cannot edit opportunity with undefined ID');
      return;
    }
    this.router.navigate(['/opportunities/edit', id]);
  }

  // Format currency value
  formatCurrency(value: number | undefined): string {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  }

  // Format date
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  }
}
