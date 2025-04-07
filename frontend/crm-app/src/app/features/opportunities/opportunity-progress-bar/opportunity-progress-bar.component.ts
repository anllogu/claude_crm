import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpportunityStatus } from '../../../core/models/opportunity.model';
import { CloseOpportunityDialogComponent } from './close-opportunity-dialog.component';

@Component({
  selector: 'app-opportunity-progress-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './opportunity-progress-bar.component.html',
  styleUrls: ['./opportunity-progress-bar.component.scss']
})
export class OpportunityProgressBarComponent implements OnInit {
  @Input() currentStatus: string = '';
  @Input() opportunityId: number = 0;
  @Output() statusChange = new EventEmitter<string>();
  
  readonly STAGES = [
    { value: OpportunityStatus.IDENTIFIED, label: 'Identificada' },
    { value: OpportunityStatus.QUALIFIED, label: 'Calificada' },
    { value: OpportunityStatus.PROPOSAL, label: 'Propuesta' },
    { value: OpportunityStatus.DECISION, label: 'Decisión' },
    { 
      value: 'CLOSED', 
      label: 'Cerrada',
      subStages: [
        { value: OpportunityStatus.CLOSED_WON, label: 'Ganada' },
        { value: OpportunityStatus.CLOSED_LOST, label: 'Perdida' },
        { value: OpportunityStatus.CLOSED_DISCARDED, label: 'Descartada' }
      ]
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Inicialización si es necesaria
  }
  
  // Determina si una etapa está completada
  isCompleted(stageValue: string): boolean {
    if (stageValue === 'CLOSED') {
      return this.isClosedStatus(this.currentStatus);
    }
    
    const stageIndex = this.getStageIndex(stageValue);
    const currentIndex = this.getCurrentStatusIndex();
    
    return stageIndex < currentIndex;
  }
  
  // Determina si una etapa es la actual
  isCurrent(stageValue: string): boolean {
    if (stageValue === 'CLOSED') {
      return this.isClosedStatus(this.currentStatus);
    }
    
    return stageValue === this.currentStatus;
  }
  
  // Determina si una etapa está pendiente
  isPending(stageValue: string): boolean {
    if (stageValue === 'CLOSED') {
      return !this.isClosedStatus(this.currentStatus);
    }
    
    const stageIndex = this.getStageIndex(stageValue);
    const currentIndex = this.getCurrentStatusIndex();
    
    return stageIndex > currentIndex;
  }
  
  // Verifica si el estado actual es uno de los estados de cierre
  isClosedStatus(status: string): boolean {
    return status === OpportunityStatus.CLOSED_WON || 
           status === OpportunityStatus.CLOSED_LOST || 
           status === OpportunityStatus.CLOSED_DISCARDED;
  }
  
  // Obtiene el índice de una etapa en el array STAGES
  getStageIndex(stageValue: string): number {
    return this.STAGES.findIndex(stage => stage.value === stageValue);
  }
  
  // Obtiene el índice del estado actual
  getCurrentStatusIndex(): number {
    if (this.isClosedStatus(this.currentStatus)) {
      return this.STAGES.length - 1; // El índice de 'CLOSED'
    }
    
    return this.STAGES.findIndex(stage => stage.value === this.currentStatus);
  }
  
  // Verifica si el estado actual es el último (cualquier estado de cierre)
  isLastStage(status: string): boolean {
    return this.isClosedStatus(status);
  }
  
  // Avanza al siguiente estado
  advanceStage(): void {
    const nextStatus = this.getNextStatus(this.currentStatus);
    
    if (nextStatus === 'SHOW_DIALOG') {
      this.handleClosingStage();
    } else {
      this.statusChange.emit(nextStatus);
    }
  }
  
  // Determina el siguiente estado basado en el estado actual
  getNextStatus(currentStatus: string): string {
    switch (currentStatus) {
      case OpportunityStatus.IDENTIFIED:
        return OpportunityStatus.QUALIFIED;
      case OpportunityStatus.QUALIFIED:
        return OpportunityStatus.PROPOSAL;
      case OpportunityStatus.PROPOSAL:
        return OpportunityStatus.DECISION;
      case OpportunityStatus.DECISION:
        return 'SHOW_DIALOG'; // Indicador especial para mostrar el diálogo
      default:
        return currentStatus;
    }
  }
  
  // Maneja el caso especial de cierre mostrando un diálogo
  handleClosingStage(): void {
    const dialogRef = this.dialog.open(CloseOpportunityDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.statusChange.emit(result);
      }
    });
  }
}
