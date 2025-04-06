import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpportunitiesListComponent } from './opportunities-list/opportunities-list.component';
import { OpportunityFormComponent } from './opportunity-form/opportunity-form.component';

// Define routes specific to the opportunities feature
const routes: Routes = [
  {
    path: '', // Default route shows the list
    component: OpportunitiesListComponent,
    title: 'Opportunities List'
  },
  {
    path: 'new', // Route for creating a new opportunity
    component: OpportunityFormComponent,
    title: 'Create Opportunity'
  },
  {
    path: 'edit/:id', // Route for editing an existing opportunity
    component: OpportunityFormComponent,
    title: 'Edit Opportunity'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunitiesRoutingModule { }
