import { CreateTargetFilterDto, FilterTargetFilterDto, UpdateTargetFilterDto } from "../dtos";
import { TargetFilter } from "../entities";
import { ListTargetFilter } from "./list-target-filter.interface";

export interface ITargetFilterService {
  list(reportId: string, filter: FilterTargetFilterDto): Promise<ListTargetFilter>;
  create(reportId: string, body: CreateTargetFilterDto): Promise<TargetFilter>;
  update(
    reportId: string,
    targetFilterId: string,
    body: UpdateTargetFilterDto,
  ): Promise<TargetFilter>;
  delete(reportId: string, targetFilterId: string): Promise<void>;
}
