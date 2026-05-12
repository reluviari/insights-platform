import { Body, ConnectMongoDB, Method, Params, Query } from "@foundation/lib";
import {
  CreateTargetFilterDto,
  FilterTargetFilterDto,
  GetTargetDto,
  TargetFilterParamsDto,
  UpdateTargetFilterDto,
} from "../dtos";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { targetFilterRepository } from "@/modules/target-filter/repositories/mongo/target-filter/target-filter.repository";
import { ITargetFilterService } from "../interfaces";
import { TargetFilterService } from "../services/target-filter.service";
import { ListTargetFilterUseCase } from "../use-cases/list-target-filter.use-case";
import { PaginatedResultsDto } from "@/commons/dtos";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { Roles } from "@/modules/auth/roles/enums";
import { CreateTargetFilterUseCase } from "../use-cases/create-target-filter.use-case";
import { UpdateTargetFilterUseCase } from "../use-cases/update-target-filter.use-case";
import { DeleteTargetFilterUseCase } from "../use-cases/delete-target-filter.use-case";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { User } from "lib/foundation/methodDecorator";
import { SessionUser } from "@/commons/interfaces";

export class TargetFilterController {
  constructor(private targetFilterService: ITargetFilterService) {}

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  async create(
    @Body(CreateTargetFilterDto) body: CreateTargetFilterDto,
    @Params(TargetFilterParamsDto) { reportId }: TargetFilterParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<GetTargetDto> {
    const targetFilter = await this.targetFilterService.create(tenantId, reportId, body);

    return GetTargetDto.factory(GetTargetDto, targetFilter);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  async update(
    @Body(UpdateTargetFilterDto) body: UpdateTargetFilterDto,
    @Params(TargetFilterParamsDto) { reportId, targetFilterId }: TargetFilterParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<GetTargetDto> {
    const targetFilter = await this.targetFilterService.update(
      tenantId,
      reportId,
      targetFilterId,
      body,
    );

    return GetTargetDto.factory(GetTargetDto, targetFilter);
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async list(
    @Query(FilterTargetFilterDto) filter: FilterTargetFilterDto,
    @Params(TargetFilterParamsDto) { reportId }: TargetFilterParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<PaginatedResultsDto<GetTargetDto>> {
    const { page, pageSize } = filter;
    const pageNumber = Number(page ?? 0);

    const { targetFilters, count } = await this.targetFilterService.list(
      tenantId,
      reportId,
      filter,
    );

    return new PaginatedResultsDto<GetTargetDto>(
      GetTargetDto.factory(GetTargetDto, targetFilters),
      count,
      pageNumber,
      pageSize,
    );
  }

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  async deleteTargetFilter(
    @Params(TargetFilterParamsDto) { reportId, targetFilterId }: TargetFilterParamsDto,
    @User { tenantId }: SessionUser,
  ): Promise<void> {
    await this.targetFilterService.delete(tenantId, reportId, targetFilterId);
  }
}

const listTargetFilterUseCase = new ListTargetFilterUseCase(
  targetFilterRepository,
  reportRepository,
);

const createTargetFilterUseCase = new CreateTargetFilterUseCase(
  targetFilterRepository,
  reportRepository,
);

const updateTargetFilterUseCase = new UpdateTargetFilterUseCase(
  targetFilterRepository,
  reportRepository,
);

const deleteTargetFilterUseCase = new DeleteTargetFilterUseCase(
  targetFilterRepository,
  reportRepository,
);

const targetFilterService = new TargetFilterService(
  listTargetFilterUseCase,
  createTargetFilterUseCase,
  updateTargetFilterUseCase,
  deleteTargetFilterUseCase,
);
const controller = new TargetFilterController(targetFilterService);

export const list = controller.list.bind(controller);
export const create = controller.create.bind(controller);
export const update = controller.update.bind(controller);
export const deleteTargetFilter = controller.deleteTargetFilter.bind(controller);
