import { PopulateOptions } from "@/commons/interfaces";
import { Report } from "../entities";
import { updateReportRequestType } from "../types";
import { WhereReport } from "./where-report.interface";

export interface IReportRepository {
  create(data: Report): Promise<Report>;
  createMany(data: Report[]): Promise<Report[]>;
  findById(id: string, populates?: PopulateOptions[]): Promise<Report | null>;
  findByIdAndTenantId(
    id: string,
    tenantId: string,
    populates?: PopulateOptions[],
  ): Promise<Report | null>;
  findByExternalId(externalId: string): Promise<Report | null>;
  update(id: string, data: updateReportRequestType): Promise<Report>;
  updateByIdAndTenantId(
    id: string,
    tenantId: string,
    data: updateReportRequestType,
  ): Promise<Report>;
  findReportsByTenantSlug(urlSlug: string): Promise<Report[] | null>;
  listAll(where?: WhereReport, page?: number, limit?: number): Promise<Report[]>;
  count(where?: WhereReport): Promise<number>;
  findByExternalIdAndTenantId(externalId: string, tenantId: string): Promise<Report | null>;
}
