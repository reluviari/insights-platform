export interface CustomerState {
  view: View;
  data: Data;
}

export interface View {
  isLoading?: boolean;
  hasError?: boolean;
  msgError?: string;
}

export interface Data {
  customers?: Array<{
    id?: string;
    name?: string;
    document?: string;
    logo?: string;
  }>;
}
