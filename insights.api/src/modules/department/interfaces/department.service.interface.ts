import { Department } from "../entities";
import { FilterDepartmentDto, ReportPageDto } from "../dtos";
import { CreateDepartmentType } from "../types/create-department.type";
import { ListDepartment } from "./list-department.interface";

export interface IDepartmentService {
  create(customerId: string, data: CreateDepartmentType): Promise<Department>;
  delete(customerId: string): Promise<void>;
  updateReportPage(
    customerId: string,
    departmentId: string,
    reportId: string,
    body: ReportPageDto,
  ): Promise<void>;
  getDepartmentById(customerId: string, departmentId: string): Promise<Department>;
  listByCustomerId(
    customerId: string,
    urlSlug: string,
    where: FilterDepartmentDto,
  ): Promise<ListDepartment>;
}
