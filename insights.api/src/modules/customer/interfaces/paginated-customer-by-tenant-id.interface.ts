import { Report } from "@/modules/report/entities";
import { Customer } from "../entities";
import { User } from "@/modules/user/entities";

interface CustomerWithUserAndReports extends Omit<Customer, "reports"> {
  reports: {
    rows: Report[] | string[];
    count: number;
  };
  users: {
    rows: User[];
    count: number;
  };
}

export interface PaginatedCustomerByTenantId {
  customers: CustomerWithUserAndReports[];
  count: number;
}
