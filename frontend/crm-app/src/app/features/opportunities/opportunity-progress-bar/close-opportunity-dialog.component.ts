import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { OpportunityStatus } from '../../../core/models/opportunity.model';

@Component({
  selector: 'app-close-opportunity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule
  ],
  template: `
    <h2 mat-dialog-title>Cerrar Oportunidad</h2>
    <mat-dialog-content>
      <p>Selecciona el resultado de esta oportunidad:</p>
      <mat-radio-group [(ngModel)]="selectedOption" class="radio-group">
        <mat-radio-button [value]="OpportunityStatus.CLOSED_WON" class="radio-button">
          Ganada
        </mat-radio-button>
        <mat-radio-button [value]="OpportunityStatus.CLOSED_LOST" class="radio-button">
          Perdida
        </mat-radio-button>
        <mat-radio-button [value]="OpportunityStatus.CLOSED_DISCARDED" class="radio-button">
          Descartada
        </mat-radio-button>
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="selectedOption" [disabled]="!selectedOption">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
    }
    .radio-button {
      margin: 5px;
    }
  `]
})
export class CloseOpportunityDialogComponent {
  selectedOption: string = '';
  OpportunityStatus = OpportunityStatus; // Exponer el enum para usarlo en la plantilla
  
  constructor(public dialogRef: MatDialogRef<CloseOpportunityDialogComponent>) {}
}
