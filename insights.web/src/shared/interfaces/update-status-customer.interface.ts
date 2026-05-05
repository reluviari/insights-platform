export interface UpdateStatusCustomer {
  customer: {
    isActive: boolean;
  };
  users?: string[];
}
