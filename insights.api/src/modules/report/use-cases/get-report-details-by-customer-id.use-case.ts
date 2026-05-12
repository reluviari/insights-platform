import { HttpStatus, ResponseError } from "@foundation/lib";
import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { PopulateOptions } from "@/commons/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { Report } from "../entities";
import { IReportIntegration } from "../interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class GetReportDetailsByCustomerIdUseCase {
  private populateReportFilter: PopulateOptions[] = [{ path: "target" }];
  private populateReportCustomer: PopulateOptions[] = [{ path: "reports" }];

  constructor(
    private reportFilterRepository: IReportFilterRepository,
    private customerRepository: ICustomerRepository,
    private departmentRepository: IDepartmentRepository,
    private reportIntegration: IReportIntegration,
  ) {}

  async execute(tenantId: string, customerId: string): Promise<Report[]> {
    const customer = await this.customerRepository.findByIdAndTenantId(
      customerId,
      tenantId,
      this.populateReportCustomer,
    );

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const reports = await Promise.all(
      (customer.reports as Report[]).map(async (report: Report) => {
        const [departments, reportFilters, reportPages] = await Promise.all([
          this.departmentRepository.listByReportIdAndCustomerId(report._id, customerId),
          this.reportFilterRepository.listByReportId(report._id, this.populateReportFilter),
          this.reportIntegration.getPBIReportPages(report.externalId),
        ]);
        return { reportPages, reportFilters, departments, ...report };
      }),
    );

    return reports;
  }
}
