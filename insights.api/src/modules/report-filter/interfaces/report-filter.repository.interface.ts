import { PopulateOptions } from "@/commons/interfaces";
import { ReportFilter } from "../entities";
import { CreateReportFilter } from "./create-report-filter.interface";
import { WhereReportFilter } from "./where-report-filter";

export interface IReportFilterRepository {
  findById(id: string, populates?: PopulateOptions[]): Promise<ReportFilter | null>;
  listByReportId(reportId: string, populates?: PopulateOptions[]): Promise<ReportFilter[]>;
  listByTargetFilterId(
    targetFilterId: string,
    populates?: PopulateOptions[],
  ): Promise<ReportFilter[]>;
  listAll(where?: WhereReportFilter, populates?: PopulateOptions[]): Promise<ReportFilter[]>;
  create(data: CreateReportFilter): Promise<ReportFilter>;
  createMany(data: CreateReportFilter[]): Promise<ReportFilter[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: any): Promise<ReportFilter | null>;
}
