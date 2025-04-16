import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'automations',
    component: AutomationsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

import { AutomationsComponent } from './automations.component';
import { UsersComponent } from './users.component';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
