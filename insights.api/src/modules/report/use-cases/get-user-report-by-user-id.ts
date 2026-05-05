import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { IUserRepository } from "@/modules/user/interfaces";
import { Report } from "../entities";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { User } from "@/modules/user/entities";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";

export class GetUserReportByUserIdUseCase {
  private readonly populateCustomer = [{ path: "tenant" }];
  private readonly populateUses = [{ path: "reports" }];
  private readonly populateDepartment = [{ path: "reports" }];

  constructor(
    private userRepository: IUserRepository,
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(
    userId: string,
    urlSlug: string,
  ): Promise<{ externalWorkspaceId: string; reports: Report[] } | null> {
    const user = await this.userRepository.findUserById(userId, this.populateUses);

    if (!user) {
      throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);
    const externalWorkspaceId = await this.findExternalWorkspaceId(user, tenant);

    if (!externalWorkspaceId) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const userReports = user.reports as Report[];

    if (!user.departments.length) {
      return { externalWorkspaceId, reports: userReports };
    }

    const departmentReports = await this.findReportsFromDepartments(user.departments as string[]);
    const filterReports = departmentReports.filter(f => f.tenant == tenant._id);
    const combinedReports = this.combineUniqueReports(userReports, filterReports);

    return { externalWorkspaceId, reports: combinedReports };
  }

  private async findExternalWorkspaceId(user: User, tenant?: Tenant): Promise<string> {
    if (tenant?.externalWorkspaceId) {
      return tenant.externalWorkspaceId;
    }

    if (!user.customer) return null;

    const userCustomer = user.customer as string;

    const customer = await this.customerRepository.findById(userCustomer, this.populateCustomer);
    const customerTenant = customer.tenant as Tenant;

    return customerTenant?.externalWorkspaceId;
  }

  private async findReportsFromDepartments(departmentIds: string[]): Promise<Report[]> {
    const departments = await Promise.all(
      departmentIds.map(id => this.departmentRepository.findById(id, this.populateDepartment)),
    );

    return departments.flatMap(department => department.reports as Report[]);
  }

  private combineUniqueReports(userReports: Report[], departmentReports: Report[]): Report[] {
    return this.getUniqueReports([...userReports, ...departmentReports]);
  }

  private getUniqueReports(reports: Report[]): Report[] {
    const ids = new Set();
    return reports.filter(report => {
      const isUnique = !ids.has(report._id);
      if (isUnique) ids.add(report._id);
      return isUnique;
    });
  }
}
