export interface LoginState {
  view: View;
  data: Data;
}

export interface View {
  isLoading?: boolean;
  hasError?: boolean;
  expireError?: boolean;
  redirectToLogin?: boolean;
}

export interface Data {
  token?: string;
  expire?: number;
  user?: User;
}

export interface User {
  name: string;
  email: string;
  image: string;
  roles: string[];
  tenant: string;
  customer: string;
  customerName: string;
  department: string;
  departmentName: string;
}
