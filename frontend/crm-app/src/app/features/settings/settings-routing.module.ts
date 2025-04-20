import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AutomationsComponent } from './automations.component';
import { UsersComponent } from './users.component';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
    canActivate: [AdminGuard]
  },
  {
    path: 'automations',
    component: AutomationsComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
