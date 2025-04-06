export enum OpportunityStatus {
  IDENTIFIED = 'Identificada',
  QUALIFIED = 'Calificada',
  PROPOSAL = 'Propuesta',
  DECISION = 'Decisión',
  CLOSED_WON = 'Cerrada Ganada',
  CLOSED_LOST = 'Cerrada Perdida',
  CLOSED_DISCARDED = 'Cerrada Descartada'
}

export interface Opportunity {
  id: number;
  contact_id: number;
  user_id: number;
  name: string;
  description?: string;
  value?: number;
  status: OpportunityStatus | string;
  expected_close_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OpportunityCreate {
  contact_id: number;
  name: string;
  description?: string;
  value?: number;
  status?: OpportunityStatus | string;
  expected_close_date?: string;
}

export interface OpportunityUpdate {
  name?: string;
  description?: string;
  value?: number;
  status?: OpportunityStatus | string;
  expected_close_date?: string;
}
