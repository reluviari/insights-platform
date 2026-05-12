import { Department } from "../entities";
import { FilterDepartmentDto, ReportPageDto } from "../dtos";
import { CreateDepartmentType } from "../types/create-department.type";
import { ListDepartment } from "./list-department.interface";

export interface IDepartmentService {
  create(tenantId: string, customerId: string, data: CreateDepartmentType): Promise<Department>;
  delete(tenantId: string, customerId: string, departmentId: string): Promise<void>;
  updateReportPage(
    tenantId: string,
    customerId: string,
    departmentId: string,
    reportId: string,
    body: ReportPageDto,
  ): Promise<void>;
  getDepartmentById(
    tenantId: string,
    customerId: string,
    departmentId: string,
  ): Promise<Department>;
  listByCustomerId(
    customerId: string,
    urlSlug: string,
    where: FilterDepartmentDto,
  ): Promise<ListDepartment>;
}
