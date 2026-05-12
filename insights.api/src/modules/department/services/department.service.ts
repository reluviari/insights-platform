import { IDepartmentService } from "../interfaces/department.service.interface";
import { CreateDepartmentUseCase } from "../use-cases/create-department.use-case";
import { CreateDepartmentType } from "../types/create-department.type";
import { ListDepartmentByCustomerIdUseCase } from "../use-cases/list-department-by-customer-id.use-case";
import { DeleteDepartmentUseCase } from "../use-cases/delete-department.use-case";
import { Department } from "../entities";
import { FilterDepartmentDto, ReportPageDto } from "../dtos";
import { UpdateReportPageUseCase } from "../use-cases/update-department-report-page.use-case";
import { GetDepartmentByIdUseCase } from "../use-cases/get-department-by-id.use-case";

export class DepartmentService implements IDepartmentService {
  constructor(
    private createDepartmentUseCase: CreateDepartmentUseCase,
    private deleteDepartmentUseCase: DeleteDepartmentUseCase,
    private listDepartmentByCustomerIdUseCase: ListDepartmentByCustomerIdUseCase,
    private updateReportPageUseCase: UpdateReportPageUseCase,
    private getDepartmentByIdUseCase: GetDepartmentByIdUseCase,
  ) {}

  async create(
    tenantId: string,
    customerId: string,
    data: CreateDepartmentType,
  ): Promise<Department> {
    return this.createDepartmentUseCase.execute(tenantId, customerId, data);
  }

  async delete(tenantId: string, customerId: string, departmentId: string): Promise<void> {
    await this.deleteDepartmentUseCase.execute(tenantId, customerId, departmentId);
  }

  async updateReportPage(
    tenantId: string,
    customerId: string,
    departmentId: string,
    reportId: string,
    body: ReportPageDto,
  ) {
    await this.updateReportPageUseCase.execute(tenantId, customerId, departmentId, reportId, body);
  }

  async listByCustomerId(customerId: string, userId: string, where: FilterDepartmentDto) {
    return this.listDepartmentByCustomerIdUseCase.execute(customerId, userId, where);
  }

  async getDepartmentById(
    tenantId: string,
    customerId: string,
    departmentId: string,
  ): Promise<Department> {
    return this.getDepartmentByIdUseCase.execute(tenantId, customerId, departmentId);
  }
}
