export interface ReportState {
  view: View;
  data: Data;
}

export interface View {
  isLoading?: boolean;
  hasError?: boolean;
}

export interface Data {
  reports?: Array<{
    id: string;
    title: string;
    externalId: string;
    icon: string;
    isActive: boolean;
  }>;
}
