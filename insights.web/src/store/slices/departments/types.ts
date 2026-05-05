export interface DepartmentState {
  view: View;
  data: Data;
}

export interface View {
  isLoading?: boolean;
  hasError?: boolean;
}

export interface Data {
  departments?: Array<{
    id?: string;
    title?: string;
    isActive?: boolean;
  }>;
}
