import { HttpStatus, ResponseError } from "@foundation/lib";
import { ICustomerRepository } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportRepository } from "@/modules/report/interfaces";

export class AttachReportsToCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(tenantId: string, customerId: string, reportId: string) {
    const customer = await this.checkCustomerExist(tenantId, customerId);
    await this.checkReportExist(tenantId, reportId);

    const combinedReports = this.combinerItemArray(reportId, customer.reports as string[]);

    return this.customerRepository.updateByIdAndTenantId(customerId, tenantId, {
      reports: combinedReports as string[],
    });
  }

  private combinerItemArray(item: string, array: string[]) {
    array.push(item);

    return Array.from(new Set(array));
  }

  private async checkCustomerExist(tenantId: string, customerId: string) {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);
    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  private async checkReportExist(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);
    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return report;
  }
}
