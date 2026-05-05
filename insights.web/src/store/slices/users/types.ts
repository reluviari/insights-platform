export interface UserState {
  view: View;
  data: Data;
}

export interface View {
  isLoading?: boolean;
  hasError?: boolean;
  msgError?: string;
}

export interface Data {
  users?: Array<{
    id?: string;
    name?: string;
    phone?: string;
    logo?: string;
  }>;
}
