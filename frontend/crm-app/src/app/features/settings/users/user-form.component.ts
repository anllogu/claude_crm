import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { User } from './user.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEdit = !!data;
    this.userForm = this.fb.group({
      username: [data?.username || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      nombre: [data?.nombre || '', Validators.required],
      apellidos: [data?.apellidos || '', Validators.required],
      rol: [data?.rol || 'usuario', Validators.required],
      password: ['', this.isEdit ? [] : Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const value = this.userForm.value;
    if (this.isEdit && this.data) {
      this.userService.updateUser(this.data.id, value).subscribe(() => this.dialogRef.close(true));
    } else {
      this.userService.createUser(value).subscribe(() => this.dialogRef.close(true));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
