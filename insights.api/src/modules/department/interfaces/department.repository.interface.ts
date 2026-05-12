import { PopulateOptions } from "@/commons/interfaces";
import { Department } from "../entities";
import { CreateDepartmentType } from "../types/create-department.type";
import { WhereDepartment } from "./where-department.interface";
import { ReportPageDto } from "../dtos";

export interface IDepartmentRepository {
  findById(id: string | Department, populates?: PopulateOptions[]): Promise<Department | null>;
  findByIdAndCustomerId(
    id: string,
    customerId: string,
    populates?: PopulateOptions[],
  ): Promise<Department | null>;
  create(data: CreateDepartmentType): Promise<Department>;
  update(departmentId: string, data: any): Promise<Department>;
  delete(id: string): Promise<Department | null>;
  deleteByIdAndCustomerId(id: string, customerId: string): Promise<Department | null>;
  findByTitle(title: string, customerId: string): Promise<Department | null>;
  listByReportIdAndCustomerId(reportId: string, customerId: string): Promise<Department[]>;
  listAll(where?: WhereDepartment, page?: number, limit?: number): Promise<Department[]>;
  listByCustomerId(customerId: string, populates?: PopulateOptions[]): Promise<Department[]>;
  count(where?: WhereDepartment): Promise<number>;
  updateDepartmentsReportFilters(reportFilterId: string): Promise<void>;
  addReportToManyDepartments(departmentIds: string[], reportId: string): Promise<void>;
  addReportFiltersToDepartment(departmentId: string, reportFilterIds: string[]): Promise<void>;
  addPagesToDepartment(
    reportId: string,
    departmentId: string,
    reportPages: ReportPageDto[],
  ): Promise<void>;
  updatePages(reportId: string, data: ReportPageDto): Promise<void>;
  updatePagesByDepartmentCustomerAndReport(
    departmentId: string,
    customerId: string,
    reportId: string,
    data: ReportPageDto,
  ): Promise<void>;
  updateReportPages(departmentId: string, data: ReportPageDto[]): Promise<void>;
}
