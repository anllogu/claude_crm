import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { AutomationsComponent } from './automations.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    UsersComponent,
    AutomationsComponent,
    MatTabsModule
  ]
})
export class SettingsComponent { }
