import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { UpdateReportCustomerRequestDto } from "../dtos/update-report-by-customer-request.dto";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { IReportRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class UpdateReportByCustomerUseCase {
  constructor(
    private reportFilterRepository: IReportFilterRepository,
    private customerRepository: ICustomerRepository,
    private reportRepository: IReportRepository,
    private departmentRepository: IDepartmentRepository,
  ) {}

  async execute(
    tenantId: string,
    customerId: string,
    departmentId: string,
    reportId: string,
    data: UpdateReportCustomerRequestDto,
  ) {
    const requireDepartment = data && (data.reportPages || data.newDepartmentId) ? true : false;
    const requireUpdatePage = data && data.reportPages ? true : false;
    const requireUpdateFilter = data && data.filters ? true : false;

    await this.checkCustomerExist(tenantId, customerId);
    await this.checkReportExist(tenantId, reportId);

    if (requireDepartment) {
      await this.checkDepartmentExist(customerId, departmentId);
    }

    if (requireUpdatePage) {
      await this.departmentRepository.updateReportPages(departmentId, data.reportPages);
    }

    if (requireUpdateFilter) {
      await Promise.all(
        data.filters.map(filter => this.reportFilterRepository.update(filter.id, filter)),
      );
    }

    if (data?.newDepartmentId) {
      await this.updateDepartment(customerId, data, reportId);
    }
  }

  private async checkCustomerExist(tenantId: string, customerId: string) {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  private async checkReportExist(tenantId: string, reportId: string) {
    const report = await this.reportRepository.findByIdAndTenantId(reportId, tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
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

    return department;
  }

  private async updateDepartment(customerId, data, reportId) {
    const department = await this.checkDepartmentExist(customerId, data?.newDepartmentId);

    const uniqueReports = await this.uniqueReports(reportId, department);
    const uniqueReportPages = await this.uniqueReportPages(data, department);
    const uniqueReportFilters = await this.uniqueReportFilters(data, department);

    const moveReportToDepartment = {
      ...department,
      reportFilters: uniqueReportFilters,
      reportPages: uniqueReportPages,
      reports: uniqueReports,
    };

    return this.departmentRepository.update(data.newDepartmentId, moveReportToDepartment);
  }

  private async uniqueReportFilters(data, department) {
    const filterIds = data.filters.map(filter => filter.id);
    const newReportFilters = department.reportFilters.concat(filterIds);

    return newReportFilters.filter((item, index) => newReportFilters.indexOf(item) === index);
  }

  private async uniqueReports(reportId, department) {
    const newReport = department.reports.concat(reportId);

    return newReport.filter((item, index) => newReport.indexOf(item) === index);
  }

  private async uniqueReportPages(data, department) {
    const newReportPages = department.reportPages.concat(data?.reportPages);

    return newReportPages.filter((item, index, self) => {
      delete item._id;
      item.pages.map(page => {
        delete page._id;
      });

      return index === self.findIndex(element => JSON.stringify(element) === JSON.stringify(item));
    });
  }
}
