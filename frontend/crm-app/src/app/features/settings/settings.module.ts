import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AutomationsComponent } from './automations.component';
import { UsersComponent } from './users.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [],  // Remove components from declarations
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    // Add standalone components to imports instead
    SettingsComponent,
    AutomationsComponent,
    UsersComponent
  ]
})
export class SettingsModule { }
