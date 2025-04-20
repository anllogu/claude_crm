export interface KPIs {
  total_contacts: number;
  open_opportunities: number;
  won_opportunities: number;
  total_won_value: number;
}

export interface OpportunityStatusCount {
  [key: string]: number;
}

export interface OpportunityClientValue {
  [key: string]: number;
}
