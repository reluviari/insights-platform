import { TenantModel } from "./tenant.schema";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { toTenant } from "../utils/tenant-document-converter";

export class MongooseTenantRepository implements ITenantRepository {
  private async handleErrors<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(tenantId: string): Promise<Tenant> {
    const tenant = await this.handleErrors(TenantModel.findById(tenantId));

    return toTenant(tenant.toObject());
  }

  async findBySlug(urlSlug: string): Promise<Tenant> {
    const tenant = await this.handleErrors(
      TenantModel.findOne({
        urlSlug: urlSlug.replace("http://", "https://"),
      }),
    );

    return tenant ? toTenant(tenant.toObject()) : null;
  }
}
