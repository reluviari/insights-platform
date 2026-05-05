import { IUserRepository } from "@/modules/user/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { IReportRepository } from "@/modules/report/interfaces";
import { GetSettingsDto } from "../dtos";

export class GetSettingsUseCase {
  constructor(
    private userRepository: IUserRepository,
    private tenantRepository: ITenantRepository,
    private customerRepository: ICustomerRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(urlSlug: string): Promise<GetSettingsDto> {
    const tenant = await this.findTenantByUrlSlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const [customers, customerCount, reportCount, users, userCount] = await Promise.all([
      this.findCustomerByTenantId(tenant._id),
      this.countCustomerByTenantId(tenant._id),
      this.countReportByTenantId(tenant._id),
      this.findUserByTenantId(tenant._id),
      this.countUserByTenantId(tenant._id),
    ]);

    return {
      customer: { customers, count: customerCount },
      report: { count: reportCount },
      user: { users, count: userCount },
    };
  }

  private async findTenantByUrlSlug(urlSlug: string) {
    return this.tenantRepository.findBySlug(urlSlug);
  }

  private async findCustomerByTenantId(tenantId: string) {
    const page = 1;
    const limit = 4;

    return this.customerRepository.listAll({ tenant: tenantId }, page, limit);
  }

  private async countCustomerByTenantId(tenantId: string) {
    return this.customerRepository.count({ tenant: tenantId });
  }

  private async countReportByTenantId(tenantId: string) {
    return this.reportRepository.count({ tenant: tenantId });
  }

  private async findUserByTenantId(tenantId: string) {
    const page = 1;
    const limit = 4;

    return this.userRepository.listUserByTenantId({ tenant: tenantId }, page, limit);
  }

  private async countUserByTenantId(tenantId: string) {
    return this.userRepository.countUserByTenantId({ tenant: tenantId });
  }
}
