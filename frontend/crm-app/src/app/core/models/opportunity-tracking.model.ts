export interface OpportunityTracking {
  id: number;
  opportunity_id: number;
  user_id: number;
  tracking_type: 'status_change' | 'comment';
  old_status?: string;
  new_status?: string;
  comment?: string;
  created_at: string;
}

export interface OpportunityTrackingCreate {
  opportunity_id: number;
  tracking_type: 'status_change' | 'comment';
  old_status?: string;
  new_status?: string;
  comment?: string;
}
