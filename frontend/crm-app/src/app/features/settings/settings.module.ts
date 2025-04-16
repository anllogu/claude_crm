import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AutomationsComponent } from './automations.component';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UsersListComponent } from './users/users-list.component';
import { UserFormComponent } from './users/user-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    SettingsComponent,
    AutomationsComponent,
    UsersComponent,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    UsersListComponent,
    UserFormComponent
  ]
})
export class SettingsModule { }
