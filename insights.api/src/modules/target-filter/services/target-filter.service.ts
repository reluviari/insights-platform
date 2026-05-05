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

  async list(reportId: string, filter: FilterTargetFilterDto): Promise<ListTargetFilter> {
    return this.listTargetFilterUseCase.execute(reportId, filter);
  }

  async create(reportId: string, body: CreateTargetFilterDto): Promise<TargetFilter> {
    return this.createTargetFilterUseCase.execute(reportId, body);
  }

  async update(
    reportId: string,
    targetFilterId: string,
    body: UpdateTargetFilterDto,
  ): Promise<TargetFilter> {
    return this.updateTargetFilterUseCase.execute(reportId, targetFilterId, body);
  }

  async delete(reportId: string, targetFilterId: string): Promise<void> {
    await this.deleteTargetFilterUseCase.execute(reportId, targetFilterId);
  }
}
