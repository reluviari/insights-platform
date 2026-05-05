import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { PopulateOptions } from "@/commons/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { Report } from "../entities";
import { IReportIntegration } from "../interfaces";

export class GetReportDetailsByCustomerIdUseCase {
  private populateReportFilter: PopulateOptions[] = [{ path: "target" }];
  private populateReportCustomer: PopulateOptions[] = [{ path: "reports" }];

  constructor(
    private reportFilterRepository: IReportFilterRepository,
    private customerRepository: ICustomerRepository,
    private departmentRepository: IDepartmentRepository,
    private reportIntegration: IReportIntegration,
  ) {}

  async execute(customerId: string): Promise<Report[]> {
    const customer = await this.customerRepository.findById(
      customerId,
      this.populateReportCustomer,
    );

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
