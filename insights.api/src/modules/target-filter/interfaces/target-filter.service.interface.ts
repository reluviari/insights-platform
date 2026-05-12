import { CreateTargetFilterDto, FilterTargetFilterDto, UpdateTargetFilterDto } from "../dtos";
import { TargetFilter } from "../entities";
import { ListTargetFilter } from "./list-target-filter.interface";

export interface ITargetFilterService {
  list(
    tenantId: string,
    reportId: string,
    filter: FilterTargetFilterDto,
  ): Promise<ListTargetFilter>;
  create(tenantId: string, reportId: string, body: CreateTargetFilterDto): Promise<TargetFilter>;
  update(
    tenantId: string,
    reportId: string,
    targetFilterId: string,
    body: UpdateTargetFilterDto,
  ): Promise<TargetFilter>;
  delete(tenantId: string, reportId: string, targetFilterId: string): Promise<void>;
}
