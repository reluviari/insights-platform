import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportRepository } from "@/modules/report/interfaces";
import { ResponseError, HttpStatus } from "@foundation/lib";
import { ReportPageDto } from "../dtos";
import { IDepartmentRepository } from "../interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";

export class UpdateReportPageUseCase {
  constructor(
    private reportRepository: IReportRepository,
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(
    tenantId: string,
    customerId: string,
    departmentId: string,
    reportId: string,
    body: ReportPageDto,
  ): Promise<void> {
    await Promise.all([
      this.checkCustomerExist(tenantId, customerId),
      this.checkDepartmentExist(customerId, departmentId),
      this.checkReportExist(tenantId, reportId),
    ]);

    await this.departmentRepository.updatePagesByDepartmentCustomerAndReport(
      departmentId,
      customerId,
      reportId,
      body,
    );
  }

  private async checkCustomerExist(tenantId: string, customerId: string) {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  private async checkDepartmentExist(customerId: string, departmentId: string) {
    const department = await this.departmentRepository.findByIdAndCustomerId(
      departmentId,
      customerId,
    );

    if (!department) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  private async checkReportExist(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
