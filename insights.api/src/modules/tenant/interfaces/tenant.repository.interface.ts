import { Tenant } from "../entities/tenant";

export interface ITenantRepository {
  findById(tenantId: string): Promise<Tenant>;
  findBySlug(urlSlug: string): Promise<Tenant>;
}
