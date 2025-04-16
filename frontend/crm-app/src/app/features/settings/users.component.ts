import { Component } from '@angular/core';
import { UsersListComponent } from './users/users-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [UsersListComponent]
})
export class UsersComponent { }
