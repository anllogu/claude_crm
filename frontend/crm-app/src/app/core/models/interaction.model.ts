export interface Interaction {
  id: number;
  contact_id: number;
  user_id: number;
  type: string;
  description: string;
  interaction_date: string;
  created_at: string;
}

export interface InteractionCreate {
  contact_id: number;
  type: string;
  description: string;
  interaction_date: string;
}

export interface InteractionUpdate {
  type?: string;
  description?: string;
  interaction_date?: string;
}
