import { Body, ConnectMongoDB, Method, Params } from "@foundation/lib";
import { IReportFilterService } from "../interfaces";
import { ReportFilterService } from "../services/report-filter.service";
import { CreateReportFilterUseCase } from "../use-cases/create-report-filter.use-case";
import { CreateReportFilterDto, ReportFilterParamsDto, ReportFilterResponseDto } from "../dtos";
import { reportFilterRepository } from "../repositories/mongo/report-filter/report-filter.repository";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { targetFilterRepository } from "@/modules/target-filter/repositories/mongo/target-filter/target-filter.repository";
import { DeleteReportFilterUseCase } from "../use-cases/delete-report-filter.use-case";

export class ReportFilterController {
  constructor(private filterService: IReportFilterService) {}

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async create(
    @Body(CreateReportFilterDto) body: CreateReportFilterDto,
    @Params(ReportFilterParamsDto) { reportId, customerId }: ReportFilterParamsDto,
  ): Promise<ReportFilterResponseDto> {
    const createReport = await this.filterService.create(reportId, customerId, body);
    return ReportFilterResponseDto.factory(ReportFilterResponseDto, createReport);
  }

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async deleteFilter(
    @Params(ReportFilterParamsDto) { reportFilterId }: ReportFilterParamsDto,
  ): Promise<void> {
    await this.filterService.delete(reportFilterId);
  }
}

const createReportFilterUseCase = new CreateReportFilterUseCase(
  reportFilterRepository,
  reportRepository,
  targetFilterRepository,
);

const dreateReportFilterUseCase = new DeleteReportFilterUseCase(reportFilterRepository);

const service = new ReportFilterService(createReportFilterUseCase, dreateReportFilterUseCase);
const controller = new ReportFilterController(service);

export const create = controller.create.bind(controller);
export const deleteFilter = controller.deleteFilter.bind(controller);
