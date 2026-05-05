import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { IReportRepository } from "../interfaces";
import { AttachReportToDepartmentsDto } from "../dtos";
import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { CreateReportFilterDto } from "@/modules/report-filter/dtos";
import { ReportFilter } from "@/modules/report-filter/entities";

export class AttachReportToDepartmentsUseCase {
  constructor(
    private customerRepository: ICustomerRepository,
    private reportRepository: IReportRepository,
    private departmentRepository: IDepartmentRepository,
    private reportFilterRepository: IReportFilterRepository,
  ) {}

  async execute(
    customerId: string,
    reportId: string,
    data: AttachReportToDepartmentsDto,
  ): Promise<void> {
    await Promise.all([
      this.validateCustomer(customerId),
      this.validateReport(reportId),
      this.validateDepartment(data.departmentId),
    ]);

    return this.addReportToDepartments(customerId, reportId, data);
  }

  async validateCustomer(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async validateReport(reportId: string) {
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async validateDepartment(departmentId: string) {
    const department = await this.departmentRepository.findById(departmentId);

    if (!department) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async validateReportNotAttachedToDepartment(reportId: string, departmentId: string) {
    const department = await this.departmentRepository.findById(departmentId);
    const reports = department.reports as string[];

    if (reports.includes(reportId)) {
      throw new ResponseError(
        ExceptionsConstants.REPORT_ALREADY_ATTACHED_TO_DEPARTMENT,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createReportFilters(
    customerId: string,
    reportId: string,
    reportFilters: CreateReportFilterDto[],
  ) {
    return this.reportFilterRepository.createMany(
      reportFilters.map(rf => ({
        customer: customerId,
        report: reportId,
        target: rf.targetId,
        ...rf,
      })),
    );
  }

  async addReportFiltersToDepartment(departmentId: string, reportFilters: ReportFilter[]) {
    const reportFilterIds = reportFilters.map(rf => rf._id);

    await this.departmentRepository.addReportFiltersToDepartment(departmentId, reportFilterIds);
  }

  async addReportToDepartments(
    customerId: string,
    reportId: string,
    data: AttachReportToDepartmentsDto,
  ): Promise<void> {
    await this.validateReportNotAttachedToDepartment(reportId, data.departmentId);

    await this.departmentRepository.addReportToManyDepartments([data.departmentId], reportId);

    if (data.reportPages?.length > 0) {
      await this.departmentRepository.addPagesToDepartment(
        reportId,
        data.departmentId,
        data.reportPages,
      );
    }

    if (data?.reportFilters?.length > 0) {
      const reportFilters = await this.createReportFilters(
        customerId,
        reportId,
        data.reportFilters,
      );

      await this.addReportFiltersToDepartment(data.departmentId, reportFilters);
    }
  }
}
