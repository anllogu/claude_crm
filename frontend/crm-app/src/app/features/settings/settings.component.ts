import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    UsersComponent
  ]
})
export class SettingsComponent { }
