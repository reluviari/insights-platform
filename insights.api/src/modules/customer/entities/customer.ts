import { Report } from "@/modules/report/entities";
import { Tenant } from "@/modules/tenant/entities/tenant";

export interface Customer {
  _id?: string;
  name: string;
  clientId?: string;
  phone?: string;
  document: string;
  logo?: string;
  industry?: string;
  tenant: string | Tenant;
  reports: string[] | Report[];
  isActive?: boolean;
}
