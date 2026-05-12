import { TargetFilter } from "../entities";
import { CreateTargetFilter } from "./create-target-filter.interface";
import { UpdateTargetFilter } from "./update-target-filter.interface";
import { WhereTargetFilter } from "./where-target-filter.interface";

export interface ITargetFilterRepository {
  create(data: CreateTargetFilter): Promise<TargetFilter | null>;
  update(targetFilterId: string, data: UpdateTargetFilter): Promise<TargetFilter | null>;
  updateByIdAndReportId(
    targetFilterId: string,
    reportId: string,
    data: UpdateTargetFilter,
  ): Promise<TargetFilter | null>;
  findById(targetFilterId: string): Promise<TargetFilter | null>;
  findByIdAndReportId(targetFilterId: string, reportId: string): Promise<TargetFilter | null>;
  delete(targetFilterId: string): Promise<void>;
  deleteByIdAndReportId(targetFilterId: string, reportId: string): Promise<void>;
  findByReportIdAndColumnAndTableAndDisplayName(
    reportId: string,
    column: string,
    table: string,
    displayName: string,
  ): Promise<TargetFilter | null>;
  listByReportId(reportId: string): Promise<TargetFilter[] | null>;
  listAll(where?: WhereTargetFilter, page?: number, limit?: number): Promise<TargetFilter[]>;
  count(where?: WhereTargetFilter): Promise<number>;
}
