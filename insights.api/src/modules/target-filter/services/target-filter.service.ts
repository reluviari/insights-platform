import { CreateTargetFilterDto, FilterTargetFilterDto, UpdateTargetFilterDto } from "../dtos";
import { TargetFilter } from "../entities";
import { ITargetFilterService, ListTargetFilter } from "../interfaces";
import { CreateTargetFilterUseCase } from "../use-cases/create-target-filter.use-case";
import { DeleteTargetFilterUseCase } from "../use-cases/delete-target-filter.use-case";
import { ListTargetFilterUseCase } from "../use-cases/list-target-filter.use-case";
import { UpdateTargetFilterUseCase } from "../use-cases/update-target-filter.use-case";

export class TargetFilterService implements ITargetFilterService {
  constructor(
    private listTargetFilterUseCase: ListTargetFilterUseCase,
    private createTargetFilterUseCase: CreateTargetFilterUseCase,
    private updateTargetFilterUseCase: UpdateTargetFilterUseCase,
    private deleteTargetFilterUseCase: DeleteTargetFilterUseCase,
  ) {}

  async list(
    tenantId: string,
    reportId: string,
    filter: FilterTargetFilterDto,
  ): Promise<ListTargetFilter> {
    return this.listTargetFilterUseCase.execute(tenantId, reportId, filter);
  }

  async create(
    tenantId: string,
    reportId: string,
    body: CreateTargetFilterDto,
  ): Promise<TargetFilter> {
    return this.createTargetFilterUseCase.execute(tenantId, reportId, body);
  }

  async update(
    tenantId: string,
    reportId: string,
    targetFilterId: string,
    body: UpdateTargetFilterDto,
  ): Promise<TargetFilter> {
    return this.updateTargetFilterUseCase.execute(tenantId, reportId, targetFilterId, body);
  }

  async delete(tenantId: string, reportId: string, targetFilterId: string): Promise<void> {
    await this.deleteTargetFilterUseCase.execute(tenantId, reportId, targetFilterId);
  }
}
