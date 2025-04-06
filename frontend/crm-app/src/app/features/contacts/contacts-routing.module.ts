import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component'; // Import the new component

// Define routes specific to the contacts feature
const routes: Routes = [
  {
    path: '', // Default route shows the list
    component: ContactsListComponent,
    title: 'Contacts List' // Optional: Add title for browser tab
  },
  {
    path: 'new', // Route for creating a new contact
    component: ContactFormComponent,
    title: 'Create Contact'
  },
  {
    path: 'edit/:id', // Route for editing an existing contact
    component: ContactFormComponent,
    title: 'Edit Contact'
  }
  // Add other contact-related routes here if needed (e.g., contact detail view)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
