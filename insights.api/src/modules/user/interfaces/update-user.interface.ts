export interface UpdateUser {
  password?: string;
  passwordToken?: string;
  createdTokenAt?: number;
  departments?: string[];
}
