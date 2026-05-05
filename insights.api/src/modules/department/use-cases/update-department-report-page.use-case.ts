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
    customerId: string,
    departmentId: string,
    reportId: string,
    body: ReportPageDto,
  ): Promise<void> {
    this.checkCustomerExist(customerId);
    this.checkDepartmentExist(departmentId);
    this.checkReportExist(reportId);

    await this.departmentRepository.updatePages(reportId, body);
  }

  private async checkCustomerExist(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  private async checkDepartmentExist(departmentId: string) {
    const department = await this.departmentRepository.findById(departmentId);

    if (!department) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  private async checkReportExist(reportId: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
