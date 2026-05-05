import { Tenant } from "@/modules/tenant/entities/tenant";

export interface Report {
  _id?: string;
  title: string;
  externalId: string;
  icon?: string;
  description?: string;
  tenant: Tenant | string;
  isActive: boolean;
}
