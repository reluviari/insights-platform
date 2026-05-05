import { Department } from "@/modules/department/entities";
import { ReportFilter } from "@/modules/report-filter/entities";
import { Report } from "@/modules/report/entities";
import { Customer } from "@/modules/customer/entities";
import { Tenant } from "@/modules/tenant/entities/tenant";

export interface User {
  _id?: string;
  name: string;
  avatar?: string;
  email: string;
  clientId?: string;
  password?: string;
  isActive: boolean;
  status: boolean;
  phone: string;
  passwordToken?: string;
  roles?: string[];
  customer?: string | Customer;
  tenants?: string[] | Tenant[];
  departments?: string[] | Department[];
  reports?: string[] | Report[];
  reportFilters?: string[] | ReportFilter[];
  createdTokenAt?: number;
}
