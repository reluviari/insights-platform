import { HttpStatus, ResponseError } from "@foundation/lib";
import { ICustomerRepository } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportRepository } from "@/modules/report/interfaces";

export class AttachReportsToCustomerUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private reportRepository: IReportRepository,
  ) {}

  async execute(customerId: string, reportId: string) {
    const customer = await this.checkCustomerExist(customerId);
    await this.checkReportExist(reportId);

    const combinedReports = this.combinerItemArray(reportId, customer.reports as string[]);

    return this.customerRepository.update(customerId, {
      reports: combinedReports as string[],
    });
  }

  private combinerItemArray(item: string, array: string[]) {
    array.push(item);

    return Array.from(new Set(array));
  }

  private async checkCustomerExist(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  private async checkReportExist(reportId: string) {
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return report;
  }
}
