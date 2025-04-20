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

// Cuadro de mandos de oportunidades
export interface OpportunityDashboard {
  monthlySales: MetricWithTrend;
  pipelineValue: number;
  averageTicket: MetricWithTrend;
  conversionRate: MetricWithTrend;
  pipelineByStage: PipelineStage[];
}

export interface MetricWithTrend {
  value: number;
  trend: number; // Porcentaje de variación, puede ser positivo o negativo
}

export interface PipelineStage {
  name: string;
  value: number;
}
